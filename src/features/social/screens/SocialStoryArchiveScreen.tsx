import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createSocialApi } from '@/api/social';
import type {
  SocialStoryArchiveItemDto,
  SocialStoryHighlightDto,
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

import { getSocialStoryCopy } from '../socialStoryCopy';
import { getSocialStoryExpansionCopy } from '../socialStoryExpansionCopy';

const PAGE_SIZE = 20;
type ArchiveRow =
  | { kind: 'section'; id: 'highlights' | 'archive' }
  | { kind: 'highlight'; value: SocialStoryHighlightDto }
  | { kind: 'archive'; value: SocialStoryArchiveItemDto }
  | { kind: 'empty'; id: 'archive-empty' };

export default function SocialStoryArchiveScreen() {
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const { locale } = useLocalization();
  const copy = getSocialStoryExpansionCopy(locale);
  const storyCopy = getSocialStoryCopy(locale);
  const insets = useSafeAreaInsets();
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        actions: { gap: Spacing.one },
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
        field: {
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: 14,
          borderWidth: StyleSheet.hairlineWidth,
          color: colors.textPrimary,
          fontSize: Typography.body.fontSize,
          lineHeight: Typography.body.lineHeight,
          minHeight: 44,
          paddingHorizontal: Spacing.two,
          paddingVertical: Spacing.two,
        },
        footer: { paddingVertical: Spacing.three },
        header: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.two,
          marginBottom: Spacing.three,
        },
        headerCard: { gap: Spacing.two, marginBottom: Spacing.three },
        highlightRow: { gap: Spacing.two, marginBottom: Spacing.two },
        mediaRow: {
          alignItems: 'flex-start',
          flexDirection: 'row',
          gap: Spacing.two,
          marginBottom: Spacing.two,
        },
        meta: {
          color: colors.textSecondary,
          fontSize: Typography.caption.fontSize,
          lineHeight: Typography.caption.lineHeight,
        },
        rowCopy: { flex: 1, gap: Spacing.one },
        screen: { backgroundColor: glass.backgroundBase, flex: 1 },
        sectionTitle: {
          color: colors.textPrimary,
          fontSize: Typography.bodyEmphasized.fontSize,
          fontWeight: Typography.bodyEmphasized.fontWeight,
          lineHeight: Typography.bodyEmphasized.lineHeight,
          marginBottom: Spacing.two,
          marginTop: Spacing.two,
        },
        thumbnail: {
          borderRadius: 12,
          overflow: 'hidden',
          width: 88,
        },
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
  const [archive, setArchive] = useState<SocialStoryArchiveItemDto[]>([]);
  const [archiveCursor, setArchiveCursor] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<SocialStoryHighlightDto[]>([]);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const [highlightTitle, setHighlightTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    if (!ready) return;
    if (!isAuthenticated) {
      setLoading(false);
      setError(copy.loadFailed);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [archivePage, nextHighlights] = await Promise.all([
        api.listStoryArchive({ limit: PAGE_SIZE }),
        api.listStoryHighlights(),
      ]);
      setArchive(archivePage.items);
      setArchiveCursor(archivePage.nextCursor);
      setHighlights(nextHighlights);
      setSelectedHighlightId((current) =>
        current && nextHighlights.some((item) => item.id === current)
          ? current
          : (nextHighlights[0]?.id ?? null),
      );
    } catch {
      setError(copy.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [api, copy.loadFailed, isAuthenticated, ready]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const runMutation = useCallback(
    async (mutation: () => Promise<void>) => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        await mutation();
      } catch {
        setError(copy.loadFailed);
      } finally {
        setBusy(false);
      }
    },
    [busy, copy.loadFailed],
  );

  const createHighlight = () => {
    const title = highlightTitle.trim();
    if (!title) return;
    void runMutation(async () => {
      const created = await api.createStoryHighlight({ schemaVersion: 1, title });
      setHighlights((current) => [created, ...current]);
      setSelectedHighlightId(created.id);
      setHighlightTitle('');
    });
  };

  const deleteHighlight = (highlightId: string) => {
    void runMutation(async () => {
      await api.deleteStoryHighlight(highlightId);
      setHighlights((current) => {
        const next = current.filter((item) => item.id !== highlightId);
        setSelectedHighlightId((selected) =>
          selected === highlightId ? (next[0]?.id ?? null) : selected,
        );
        return next;
      });
    });
  };

  const addToSelectedHighlight = (storyId: string) => {
    const highlightId = selectedHighlightId;
    if (!highlightId) return;
    void runMutation(async () => {
      const detail = await api.getStoryHighlight(highlightId);
      if (detail.items.some((item) => item.story.id === storyId)) return;
      const position = detail.items.reduce(
        (max, item) => Math.max(max, item.position + 1),
        0,
      );
      if (position > 99) throw new Error('Story highlight is full');
      await api.addStoryHighlightItem(highlightId, storyId, position);
    });
  };

  const deleteArchivedStory = (storyId: string) => {
    Alert.alert(storyCopy.deleteStoryTitle, storyCopy.deleteStoryBody, [
      { text: storyCopy.cancel, style: 'cancel' },
      {
        text: storyCopy.deleteStory,
        style: 'destructive',
        onPress: () =>
          void runMutation(async () => {
            await api.deleteStory(storyId);
            setArchive((current) => current.filter((item) => item.id !== storyId));
          }),
      },
    ]);
  };

  const loadMore = async () => {
    if (!archiveCursor || busy) return;
    setBusy(true);
    setError(null);
    try {
      const page = await api.listStoryArchive({
        limit: PAGE_SIZE,
        cursor: archiveCursor,
      });
      setArchive((current) => {
        const ids = new Set(current.map((item) => item.id));
        return [...current, ...page.items.filter((item) => !ids.has(item.id))];
      });
      setArchiveCursor(page.nextCursor);
    } catch {
      setError(copy.loadFailed);
    } finally {
      setBusy(false);
    }
  };

  const rows: ArchiveRow[] = useMemo(
    () => [
      { kind: 'section', id: 'highlights' },
      ...highlights.map((value) => ({ kind: 'highlight' as const, value })),
      { kind: 'section', id: 'archive' },
      ...(archive.length > 0
        ? archive.map((value) => ({ kind: 'archive' as const, value }))
        : [{ kind: 'empty' as const, id: 'archive-empty' as const }]),
    ],
    [archive, highlights],
  );
  const selectedHighlight = highlights.find(
    (item) => item.id === selectedHighlightId,
  );

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
      keyExtractor={(row) => {
        if (row.kind === 'section' || row.kind === 'empty') return row.id;
        return `${row.kind}:${row.value.id}`;
      }}
      ListEmptyComponent={
        loading ? <LoadingState label={copy.archiveTitle} /> : null
      }
      ListFooterComponent={
        archiveCursor ? (
          <View style={styles.footer}>
            <SecondaryButton
              disabled={busy}
              label={copy.loadMore}
              loading={busy}
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
            <Text style={styles.title}>{copy.archiveTitle}</Text>
          </View>
          <AppCard style={styles.headerCard}>
            <TextInput
              editable={!busy}
              maxLength={80}
              onChangeText={setHighlightTitle}
              placeholder={copy.highlightPlaceholder}
              placeholderTextColor={colors.textSecondary}
              style={styles.field}
              value={highlightTitle}
            />
            <PrimaryButton
              disabled={!highlightTitle.trim() || busy}
              label={copy.createHighlight}
              onPress={createHighlight}
            />
          </AppCard>
          {error ? <InlineError message={error} /> : null}
        </>
      }
      renderItem={({ item }) => {
        if (item.kind === 'section') {
          return (
            <Text style={styles.sectionTitle}>
              {item.id === 'highlights' ? copy.highlightsTitle : copy.archiveTitle}
            </Text>
          );
        }
        if (item.kind === 'empty') {
          return (
            <AppCard style={styles.highlightRow}>
              <Text style={styles.meta}>{copy.archiveEmpty}</Text>
            </AppCard>
          );
        }
        if (item.kind === 'highlight') {
          const selected = item.value.id === selectedHighlightId;
          return (
            <AppCard style={styles.highlightRow}>
              <Text style={styles.body}>{item.value.title}</Text>
              {selected ? (
                <PrimaryButton
                  disabled
                  label={copy.selectedHighlight}
                  onPress={() => undefined}
                />
              ) : (
                <SecondaryButton
                  disabled={busy}
                  label={copy.selectHighlight}
                  onPress={() => setSelectedHighlightId(item.value.id)}
                />
              )}
              <SecondaryButton
                disabled={busy}
                label={copy.deleteHighlight}
                onPress={() => deleteHighlight(item.value.id)}
              />
            </AppCard>
          );
        }

        const variant =
          item.value.image.variants.post_320 ??
          item.value.image.variants.post_640 ??
          null;
        return (
          <AppCard style={styles.mediaRow}>
            {variant ? (
              <Image
                accessibilityLabel={copy.archiveTitle}
                resizeMode="cover"
                source={{ uri: variant.url }}
                style={[styles.thumbnail, { aspectRatio: item.value.image.aspectRatio }]}
              />
            ) : null}
            <View style={styles.rowCopy}>
              <Text style={styles.meta}>
                {formatLocalizedDateTime(item.value.archivedAt, locale)}
              </Text>
              {item.value.caption ? (
                <Text numberOfLines={3} style={styles.body}>
                  {item.value.caption}
                </Text>
              ) : null}
              <View style={styles.actions}>
                {selectedHighlight ? (
                  <SecondaryButton
                    disabled={busy}
                    label={`${copy.addToHighlight}: ${selectedHighlight.title}`}
                    onPress={() => addToSelectedHighlight(item.value.id)}
                  />
                ) : null}
                <SecondaryButton
                  disabled={busy}
                  label={copy.activityTitle}
                  onPress={() =>
                    router.push({
                      pathname: '/social/story/activity',
                      params: { storyId: item.value.id },
                    })
                  }
                />
                <SecondaryButton
                  disabled={busy}
                  label={storyCopy.deleteStory}
                  onPress={() => deleteArchivedStory(item.value.id)}
                />
              </View>
            </View>
          </AppCard>
        );
      }}
      style={styles.screen}
    />
  );
}
