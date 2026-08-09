import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createSocialApi, type SocialStoryDto } from '@/api/social';
import { useAuthSession } from '@/hooks/useAuthSession';

import { getDefaultSocialStoryCacheStore } from './socialStoryCache';
import {
  getSocialStoryLoadError,
  markSocialStoryViewed,
  mergeSocialStories,
  type SocialStoryLoadError,
} from './socialStorySurfaceModel';

export type SocialStoriesStatus = 'idle' | 'loading' | 'ready' | 'error';

const PAGE_SIZE = 20;

export function useSocialStories() {
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const accountId = session?.user.id ?? null;
  const cacheStore = useMemo(() => getDefaultSocialStoryCacheStore(), []);
  const requestSequence = useRef(0);
  const [status, setStatus] = useState<SocialStoriesStatus>('idle');
  const [stories, setStories] = useState<SocialStoryDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showingCachedStories, setShowingCachedStories] = useState(false);
  const [loadError, setLoadError] = useState<SocialStoryLoadError | null>(null);

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
      const hadVisibleStories = stories.length > 0;
      let cachedPageShown = false;
      if (asRefresh) {
        setRefreshing(true);
      } else {
        setStatus('loading');
        setStories([]);
        setNextCursor(null);
        setShowingCachedStories(false);
      }
      setLoadError(null);

      if (!asRefresh) {
        const cached = await cacheStore.load(accountId);
        if (sequence !== requestSequence.current) return;
        if (cached) {
          cachedPageShown = true;
          setStories(cached.items);
          setNextCursor(null);
          setShowingCachedStories(true);
          setStatus('ready');
        }
      }

      try {
        const page = await socialApi.listStories({ limit: PAGE_SIZE });
        if (sequence !== requestSequence.current) return;
        setStories(page.items);
        setNextCursor(page.nextCursor);
        setShowingCachedStories(false);
        setStatus('ready');
        if (page.items.length > 0) {
          await cacheStore.save(accountId, page.items);
        } else {
          await cacheStore.remove(accountId);
        }
      } catch (error) {
        if (sequence !== requestSequence.current) return;
        const mapped = getSocialStoryLoadError(error);
        setLoadError(mapped);
        if (mapped === 'session_expired') {
          setStories([]);
          setNextCursor(null);
          setShowingCachedStories(false);
          setStatus('error');
        } else if (cachedPageShown || (asRefresh && hadVisibleStories)) {
          setStatus('ready');
        } else {
          setStatus('error');
        }
      } finally {
        if (sequence === requestSequence.current) setRefreshing(false);
      }
    },
    [accountId, cacheStore, isAuthenticated, socialApi, stories.length],
  );

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore || showingCachedStories) return;
    const sequence = ++requestSequence.current;
    setLoadingMore(true);
    setLoadError(null);
    try {
      const page = await socialApi.listStories({
        limit: PAGE_SIZE,
        cursor: nextCursor,
      });
      if (sequence !== requestSequence.current) return;
      setStories((current) => mergeSocialStories(current, page.items));
      setNextCursor(page.nextCursor);
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setLoadError(getSocialStoryLoadError(error));
    } finally {
      if (sequence === requestSequence.current) setLoadingMore(false);
    }
  }, [loadingMore, nextCursor, showingCachedStories, socialApi]);

  const markViewed = useCallback(
    async (storyId: string) => {
      if (!accountId) return;
      await socialApi.markStoryViewed(storyId);
      setStories((current) => {
        const next = markSocialStoryViewed(current, storyId);
        void cacheStore.save(accountId, next);
        return next;
      });
    },
    [accountId, cacheStore, socialApi],
  );

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated || !accountId) {
      requestSequence.current += 1;
      setStatus('idle');
      setStories([]);
      setNextCursor(null);
      setShowingCachedStories(false);
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
    markViewed,
    nextCursor,
    ready,
    refreshing,
    showingCachedStories,
    status,
    stories,
  };
}
