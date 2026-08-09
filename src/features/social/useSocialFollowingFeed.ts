import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createSocialApi, type SocialWorkoutPostDto } from '@/api/social';
import { useAuthSession } from '@/hooks/useAuthSession';

import { getDefaultSocialFollowingFeedCacheStore } from './socialFollowingFeedCache';
import {
  getSocialWorkoutPostLoadError,
  mergeSocialWorkoutPosts,
  type SocialWorkoutPostLoadError,
} from './socialWorkoutPostSurfaceModel';

export type SocialFollowingFeedStatus = 'idle' | 'loading' | 'ready' | 'error';

const PAGE_SIZE = 20;

export function useSocialFollowingFeed() {
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const accountId = session?.user.id ?? null;
  const cacheStore = useMemo(() => getDefaultSocialFollowingFeedCacheStore(), []);
  const requestSequence = useRef(0);
  const [status, setStatus] = useState<SocialFollowingFeedStatus>('idle');
  const [posts, setPosts] = useState<SocialWorkoutPostDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showingCachedFeed, setShowingCachedFeed] = useState(false);
  const [loadError, setLoadError] = useState<SocialWorkoutPostLoadError | null>(null);

  const auth = useMemo(
    () => ({
      getAccessToken: async () => session?.tokens.accessToken ?? null,
      refreshAccessToken: async () => (await refresh())?.tokens.accessToken ?? null,
    }),
    [refresh, session?.tokens.accessToken],
  );
  const socialApi = useMemo(() => createSocialApi(auth), [auth]);

  const loadFirstPage = useCallback(
    async (asRefresh = false) => {
      if (!isAuthenticated || !accountId) return;
      const sequence = ++requestSequence.current;
      const hadVisiblePosts = posts.length > 0;
      let cachedPageShown = false;

      if (asRefresh) {
        setRefreshing(true);
      } else {
        setStatus('loading');
        setPosts([]);
        setNextCursor(null);
        setShowingCachedFeed(false);
      }
      setLoadError(null);

      if (!asRefresh) {
        const cached = await cacheStore.load(accountId);
        if (sequence !== requestSequence.current) return;
        if (cached) {
          cachedPageShown = true;
          setPosts(cached.items);
          setNextCursor(null);
          setShowingCachedFeed(true);
          setStatus('ready');
        }
      }

      try {
        const page = await socialApi.listFollowingFeed({ limit: PAGE_SIZE });
        if (sequence !== requestSequence.current) return;
        setPosts(page.items);
        setNextCursor(page.nextCursor);
        setShowingCachedFeed(false);
        setStatus('ready');
        if (page.items.length > 0) {
          await cacheStore.save(accountId, page.items);
        } else {
          await cacheStore.remove(accountId);
        }
      } catch (error) {
        if (sequence !== requestSequence.current) return;
        const mapped = getSocialWorkoutPostLoadError(error);
        setLoadError(mapped);
        if (mapped === 'session_expired') {
          setPosts([]);
          setNextCursor(null);
          setShowingCachedFeed(false);
          setStatus('error');
        } else if (cachedPageShown || (asRefresh && hadVisiblePosts)) {
          setStatus('ready');
        } else {
          setStatus('error');
        }
      } finally {
        if (sequence === requestSequence.current) setRefreshing(false);
      }
    },
    [accountId, cacheStore, isAuthenticated, posts.length, socialApi],
  );

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore || showingCachedFeed) return;
    const sequence = ++requestSequence.current;
    setLoadingMore(true);
    setLoadError(null);
    try {
      const page = await socialApi.listFollowingFeed({
        limit: PAGE_SIZE,
        cursor: nextCursor,
      });
      if (sequence !== requestSequence.current) return;
      setPosts((current) => mergeSocialWorkoutPosts(current, page.items));
      setNextCursor(page.nextCursor);
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setLoadError(getSocialWorkoutPostLoadError(error));
    } finally {
      if (sequence === requestSequence.current) setLoadingMore(false);
    }
  }, [loadingMore, nextCursor, showingCachedFeed, socialApi]);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated || !accountId) {
      requestSequence.current += 1;
      setStatus('idle');
      setPosts([]);
      setNextCursor(null);
      setShowingCachedFeed(false);
      return;
    }
    void loadFirstPage(false);
    return () => {
      requestSequence.current += 1;
    };
  }, [accountId, isAuthenticated, ready, socialApi]);

  return {
    isAuthenticated,
    loadError,
    loadFirstPage,
    loadMore,
    loadingMore,
    nextCursor,
    posts,
    ready,
    refreshing,
    showingCachedFeed,
    status,
  };
}
