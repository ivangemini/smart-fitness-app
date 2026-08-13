import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createSocialApi } from '@/api/social';
import type { SocialStoryCloseFriendDto } from '@/api/social/story-expansion-contracts';
import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import { getSocialStoryExpansionCopy } from '../socialStoryExpansionCopy';

const PAGE_SIZE = 20;

export default function SocialStoryCloseFriendsScreen() {
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
        row: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.two,
          justifyContent: 'space-between',
          marginBottom: Spacing.two,
        },
        screen: { backgroundColor: glass.backgroundBase, flex: 1 },
        subtitle: {
          color: colors.textSecondary,
          fontSize: Typography.body.fontSize,
          lineHeight: Typography.body.lineHeight,
        },
        title: {
          color: colors.textPrimary,
          flex: 1,
          fontSize: Typography.screenTitle.fontSize,
          fontWeight: Typography.screenTitle.fontWeight,
          lineHeight: Typography.screenTitle.lineHeight,
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
  const [items, setItems] = useState<SocialStoryCloseFriendDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [username, setUsername] = useState('');
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
      const page = await api.listStoryCloseFriends({ limit: PAGE_SIZE });
      setItems(page.items);
      setNextCursor(page.nextCursor);
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
        await loadInitial();
      } catch {
        setError(copy.loadFailed);
      } finally {
        setBusy(false);
      }
    },
    [busy, copy.loadFailed, loadInitial],
  );

  const addFriend = () => {
    const normalized = username.trim().replace(/^@/u, '');
    if (!normalized) return;
    void runMutation(async () => {
      await api.addStoryCloseFriend(normalized);
      setUsername('');
    });
  };

  const loadMore = async () => {
    if (!nextCursor || busy) return;
    setBusy(true);
    setError(null);
    try {
      const page = await api.listStoryCloseFriends({
        limit: PAGE_SIZE,
        cursor: nextCursor,
      });
      setItems((current) => {
        const usernames = new Set(current.map((item) => item.profile.username));
        return [
          ...current,
          ...page.items.filter((item) => !usernames.has(item.profile.username)),
        ];
      });
      setNextCursor(page.nextCursor);
    } catch {
      setError(copy.loadFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FlatList
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.four,
          paddingTop: insets.top + Spacing.two,
        },
      ]}
      data={loading ? [] : items}
      keyExtractor={(item) => item.profile.username}
      ListEmptyComponent={
        loading ? <LoadingState label={copy.closeFriendsTitle} /> : null
      }
      ListFooterComponent={
        nextCursor ? (
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
            <Text style={styles.title}>{copy.closeFriendsTitle}</Text>
          </View>
          <AppCard style={styles.headerCard}>
            <Text style={styles.subtitle}>{copy.closeFriendsBody}</Text>
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
              onPress={addFriend}
            />
          </AppCard>
          {error ? <InlineError message={error} /> : null}
        </>
      }
      renderItem={({ item }) => (
        <AppCard style={styles.row}>
          <Text style={styles.username}>@{item.profile.username}</Text>
          <SecondaryButton
            disabled={busy}
            label={copy.remove}
            onPress={() =>
              void runMutation(() =>
                api.removeStoryCloseFriend(item.profile.username),
              )
            }
          />
        </AppCard>
      )}
      style={styles.screen}
    />
  );
}
