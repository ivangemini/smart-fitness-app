import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createSocialApi } from '@/api/social';
import type {
  SocialStoryReplyDto,
  SocialStoryViewerDto,
} from '@/api/social/story-expansion-contracts';
import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { formatLocalizedDateTime, useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import { getSocialStoryExpansionCopy } from '../socialStoryExpansionCopy';

const PAGE_SIZE = 20;
type ActivityMode = 'viewers' | 'replies';
type ActivityRow =
  | { kind: 'viewer'; value: SocialStoryViewerDto }
  | { kind: 'reply'; value: SocialStoryReplyDto };

export default function SocialStoryActivityScreen() {
  const params = useLocalSearchParams<{ storyId?: string | string[] }>();
  const storyId = Array.isArray(params.storyId) ? params.storyId[0] : params.storyId;
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const { locale } = useLocalization();
  const copy = getSocialStoryExpansionCopy(locale);
  const insets = useSafeAreaInsets();
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          color: colors.textPrimary,
          fontSize: Typography.body.fontSize,
          lineHeight: Typography.body.lineHeight,
        },
        content: {
          alignSelf: 'center',
          flexGrow: 1,
          maxWidth: MaxContentWidth,
          paddingHorizontal: Spacing.three,
          width: '100%',
        },
        controls: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing.two,
          marginBottom: Spacing.three,
        },
        footer: { paddingVertical: Spacing.three },
        header: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.two,
          marginBottom: Spacing.three,
        },
        item: { gap: Spacing.one, marginBottom: Spacing.two },
        meta: {
          color: colors.textSecondary,
          fontSize: Typography.caption.fontSize,
          lineHeight: Typography.caption.lineHeight,
        },
        screen: { backgroundColor: glass.backgroundBase, flex: 1 },
        title: {
          color: colors.textPrimary,
          flex: 1,
          fontSize: Typography.screenTitle.fontSize,
          fontWeight: Typography.screenTitle.fontWeight,
          lineHeight: Typography.screenTitle.lineHeight,
        },
      }),
    [colors, glass],
  );
  const auth = useMemo(
    () => ({
      getAccessToken: async () => session?.tokens.accessToken ?? null,
      refreshAccessToken: async () => (await refresh())?.tokens.accessToken ?? null,
    }),
    [refresh, session?.tokens.accessToken],
  );
  const api = useMemo(() => createSocialApi(auth), [auth]);
  const [mode, setMode] = useState<ActivityMode>('viewers');
  const [viewers, setViewers] = useState<SocialStoryViewerDto[]>([]);
  const [replies, setReplies] = useState<SocialStoryReplyDto[]>([]);
  const [viewerCursor, setViewerCursor] = useState<string | null>(null);
  const [replyCursor, setReplyCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    if (!ready) return;
    if (!isAuthenticated || !storyId) {
      setLoading(false);
      setError(copy.loadFailed);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [viewerPage, replyPage] = await Promise.all([
        api.listStoryViewers(storyId, { limit: PAGE_SIZE }),
        api.listStoryReplies(storyId, { limit: PAGE_SIZE }),
      ]);
      setViewers(viewerPage.items);
      setReplies(replyPage.items);
      setViewerCursor(viewerPage.nextCursor);
      setReplyCursor(replyPage.nextCursor);
    } catch {
      setError(copy.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [api, copy.loadFailed, isAuthenticated, ready, storyId]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (!storyId || loadMoreBusy) return;
    const cursor = mode === 'viewers' ? viewerCursor : replyCursor;
    if (!cursor) return;
    setLoadMoreBusy(true);
    setError(null);
    try {
      if (mode === 'viewers') {
        const page = await api.listStoryViewers(storyId, {
          limit: PAGE_SIZE,
          cursor,
        });
        setViewers((current) => {
          const usernames = new Set(current.map((item) => item.profile.username));
          return [
            ...current,
            ...page.items.filter((item) => !usernames.has(item.profile.username)),
          ];
        });
        setViewerCursor(page.nextCursor);
      } else {
        const page = await api.listStoryReplies(storyId, {
          limit: PAGE_SIZE,
          cursor,
        });
        setReplies((current) => {
          const ids = new Set(current.map((item) => item.id));
          return [...current, ...page.items.filter((item) => !ids.has(item.id))];
        });
        setReplyCursor(page.nextCursor);
      }
    } catch {
      setError(copy.loadFailed);
    } finally {
      setLoadMoreBusy(false);
    }
  }, [api, copy.loadFailed, loadMoreBusy, mode, replyCursor, storyId, viewerCursor]);

  const rows: ActivityRow[] = useMemo(
    () =>
      mode === 'viewers'
        ? viewers.map((value) => ({ kind: 'viewer' as const, value }))
        : replies.map((value) => ({ kind: 'reply' as const, value })),
    [mode, replies, viewers],
  );
  const hasMore = mode === 'viewers' ? Boolean(viewerCursor) : Boolean(replyCursor);

  return (
    <FlatList
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.four,
          paddingTop: insets.top + Spacing.two,
        },
      ]}
      data={loading ? [] : rows}
      keyExtractor={(row) =>
        row.kind === 'viewer'
          ? `viewer:${row.value.profile.username}`
          : `reply:${row.value.id}`
      }
      ListEmptyComponent={
        loading ? (
          <LoadingState label={mode === 'viewers' ? copy.viewers : copy.replies} />
        ) : (
          <AppCard>
            <Text style={styles.meta}>
              {mode === 'viewers' ? copy.noViewers : copy.noReplies}
            </Text>
          </AppCard>
        )
      }
      ListFooterComponent={
        hasMore ? (
          <View style={styles.footer}>
            <SecondaryButton
              disabled={loadMoreBusy}
              label={copy.loadMore}
              loading={loadMoreBusy}
              onPress={() => void loadMore()}
            />
          </View>
        ) : null
      }
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <LiquidGlassIconButton
              accessibilityLabel={copy.back}
              Icon={ChevronLeft}
              onPress={() => router.back()}
            />
            <Text style={styles.title}>{copy.activityTitle}</Text>
          </View>
          <View style={styles.controls}>
            {mode === 'viewers' ? (
              <PrimaryButton label={copy.viewers} onPress={() => setMode('viewers')} />
            ) : (
              <SecondaryButton label={copy.viewers} onPress={() => setMode('viewers')} />
            )}
            {mode === 'replies' ? (
              <PrimaryButton label={copy.replies} onPress={() => setMode('replies')} />
            ) : (
              <SecondaryButton label={copy.replies} onPress={() => setMode('replies')} />
            )}
          </View>
          {error ? <InlineError message={error} /> : null}
        </>
      }
      renderItem={({ item }) => (
        <AppCard style={styles.item}>
          {item.kind === 'viewer' ? (
            <>
              <Text style={styles.body}>@{item.value.profile.username}</Text>
              <Text style={styles.meta}>
                {formatLocalizedDateTime(item.value.viewedAt, locale)}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.meta}>@{item.value.author.username}</Text>
              <Text style={styles.body}>{item.value.body}</Text>
              <Text style={styles.meta}>
                {formatLocalizedDateTime(item.value.createdAt, locale)}
              </Text>
            </>
          )}
        </AppCard>
      )}
      style={styles.screen}
    />
  );
}
