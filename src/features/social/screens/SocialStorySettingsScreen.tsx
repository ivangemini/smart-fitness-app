import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createSocialApi } from '@/api/social';
import type {
  SocialStoryArchiveItemDto,
  SocialStoryCloseFriendDto,
  SocialStoryHighlightDto,
  SocialStoryPushPreferenceDto,
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

export default function SocialStorySettingsScreen() {
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const { locale } = useLocalization();
  const copy = getSocialStoryExpansionCopy(locale);
  const safeAreaInsets = useSafeAreaInsets();
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          color: colors.textSecondary,
          fontSize: Typography.body.fontSize,
          lineHeight: Typography.body.lineHeight,
        },
        card: { gap: Spacing.two },
        content: {
          alignSelf: 'center',
          flexGrow: 1,
          gap: Spacing.three,
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
          minHeight: 44,
          paddingHorizontal: Spacing.two,
          paddingVertical: Spacing.two,
        },
        header: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.two,
        },
        item: { gap: Spacing.one },
        itemHeader: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.two,
          justifyContent: 'space-between',
        },
        screen: { backgroundColor: glass.backgroundBase, flex: 1 },
        title: {
          color: colors.textPrimary,
          flex: 1,
          fontSize: Typography.screenTitle.fontSize,
          fontWeight: Typography.screenTitle.fontWeight,
          lineHeight: Typography.screenTitle.lineHeight,
        },
        sectionTitle: {
          color: colors.textPrimary,
          fontSize: Typography.bodyEmphasized.fontSize,
          fontWeight: Typography.bodyEmphasized.fontWeight,
          lineHeight: Typography.bodyEmphasized.lineHeight,
        },
        switchRow: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.two,
          justifyContent: 'space-between',
        },
        username: {
          color: colors.textPrimary,
          flex: 1,
          fontSize: Typography.body.fontSize,
          lineHeight: Typography.body.lineHeight,
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
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [highlightTitle, setHighlightTitle] = useState('');
  const [closeFriends, setCloseFriends] = useState<SocialStoryCloseFriendDto[]>([]);
  const [archive, setArchive] = useState<SocialStoryArchiveItemDto[]>([]);
  const [highlights, setHighlights] = useState<SocialStoryHighlightDto[]>([]);
  const [pushPreference, setPushPreference] =
    useState<SocialStoryPushPreferenceDto | null>(null);

  const load = useCallback(async () => {
    if (!ready) return;
    if (!isAuthenticated) {
      setLoading(false);
      setError(copy.loadFailed);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [friendsPage, archivePage, nextHighlights, nextPushPreference] =
        await Promise.all([
          api.listStoryCloseFriends({ limit: 50 }),
          api.listStoryArchive({ limit: 50 }),
          api.listStoryHighlights(),
          api.getStoryPushPreference(),
        ]);
      setCloseFriends(friendsPage.items);
      setArchive(archivePage.items);
      setHighlights(nextHighlights);
      setPushPreference(nextPushPreference);
    } catch {
      setError(copy.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [api, copy.loadFailed, isAuthenticated, ready]);

  useEffect(() => {
    void load();
  }, [load]);

  const runMutation = useCallback(
    async (mutation: () => Promise<void>) => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        await mutation();
        await load();
      } catch {
        setError(copy.loadFailed);
      } finally {
        setBusy(false);
      }
    },
    [busy, copy.loadFailed, load],
  );

  const addCloseFriend = () => {
    const normalized = username.trim().replace(/^@/u, '');
    if (!normalized) return;
    void runMutation(async () => {
      await api.addStoryCloseFriend(normalized);
      setUsername('');
    });
  };

  const createHighlight = () => {
    const title = highlightTitle.trim();
    if (!title) return;
    void runMutation(async () => {
      await api.createStoryHighlight({ schemaVersion: 1, title });
      setHighlightTitle('');
    });
  };

  const addArchiveItem = (storyId: string, highlightId: string) => {
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

  const togglePushPreference = (requestedEnabled: boolean) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    void api
      .setStoryPushPreference(requestedEnabled)
      .then(setPushPreference)
      .catch(() => setError(copy.loadFailed))
      .finally(() => setBusy(false));
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: safeAreaInsets.bottom + Spacing.four,
            paddingTop: safeAreaInsets.top + Spacing.two,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LiquidGlassIconButton
            accessibilityLabel={copy.back}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
          <Text style={styles.title}>{copy.settingsTitle}</Text>
        </View>

        {loading ? <LoadingState label={copy.settingsTitle} /> : null}
        {error ? <InlineError message={error} /> : null}

        {!loading ? (
          <>
            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>{copy.closeFriendsTitle}</Text>
              <Text style={styles.body}>{copy.closeFriendsBody}</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={!busy}
                onChangeText={setUsername}
                placeholder={copy.usernamePlaceholder}
                placeholderTextColor={colors.textSecondary}
                style={styles.field}
                value={username}
              />
              <PrimaryButton
                disabled={!username.trim() || busy}
                label={copy.add}
                onPress={addCloseFriend}
              />
              {closeFriends.map((friend) => (
                <View key={friend.profile.username} style={styles.itemHeader}>
                  <Text style={styles.username}>@{friend.profile.username}</Text>
                  <SecondaryButton
                    disabled={busy}
                    label={copy.remove}
                    onPress={() =>
                      void runMutation(() =>
                        api.removeStoryCloseFriend(friend.profile.username),
                      )
                    }
                  />
                </View>
              ))}
            </AppCard>

            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>{copy.highlightsTitle}</Text>
              <TextInput
                editable={!busy}
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
              {highlights.map((highlight) => (
                <View key={highlight.id} style={styles.itemHeader}>
                  <Text style={styles.username}>{highlight.title}</Text>
                  <SecondaryButton
                    disabled={busy}
                    label={copy.deleteHighlight}
                    onPress={() =>
                      void runMutation(() => api.deleteStoryHighlight(highlight.id))
                    }
                  />
                </View>
              ))}
            </AppCard>

            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>{copy.archiveTitle}</Text>
              {archive.length === 0 ? (
                <Text style={styles.body}>{copy.archiveEmpty}</Text>
              ) : (
                archive.map((story) => (
                  <View key={story.id} style={styles.item}>
                    <Text style={styles.username}>
                      {formatLocalizedDateTime(story.archivedAt, locale)}
                    </Text>
                    {highlights.map((highlight) => (
                      <SecondaryButton
                        disabled={busy}
                        key={highlight.id}
                        label={`${copy.addToHighlight}: ${highlight.title}`}
                        onPress={() => addArchiveItem(story.id, highlight.id)}
                      />
                    ))}
                  </View>
                ))
              )}
            </AppCard>

            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>{copy.pushTitle}</Text>
              <Text style={styles.body}>{copy.pushUnavailable}</Text>
              <View style={styles.switchRow}>
                <Text style={styles.username}>{copy.pushRequested}</Text>
                <Switch
                  disabled={busy || !pushPreference}
                  onValueChange={togglePushPreference}
                  value={pushPreference?.requestedEnabled ?? false}
                />
              </View>
            </AppCard>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
