import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createSocialApi } from '@/api/social';
import type { SocialStoryPushPreferenceDto } from '@/api/social/story-expansion-contracts';
import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
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
        header: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.two,
        },
        screen: { backgroundColor: glass.backgroundBase, flex: 1 },
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
        switchText: {
          color: colors.textPrimary,
          flex: 1,
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
      setPushPreference(await api.getStoryPushPreference());
    } catch {
      setError(copy.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [api, copy.loadFailed, isAuthenticated, ready]);

  useEffect(() => {
    void load();
  }, [load]);

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
              <SecondaryButton
                label={copy.closeFriendsTitle}
                onPress={() => router.push('/social/story/close-friends')}
              />
            </AppCard>

            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>{copy.archiveTitle}</Text>
              <Text style={styles.body}>{copy.archiveEmpty}</Text>
              <SecondaryButton
                label={`${copy.archiveTitle} · ${copy.highlightsTitle}`}
                onPress={() => router.push('/social/story/archive')}
              />
            </AppCard>

            <AppCard style={styles.card}>
              <Text style={styles.sectionTitle}>{copy.pushTitle}</Text>
              <Text style={styles.body}>{copy.pushUnavailable}</Text>
              <View style={styles.switchRow}>
                <Text style={styles.switchText}>{copy.pushRequested}</Text>
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
