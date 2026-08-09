import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  createSocialApi,
  type SocialStoryDto,
} from '@/api/social';
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

import { getSocialStoryCopy } from '../socialStoryCopy';
import { getSocialStoryLoadError } from '../socialStorySurfaceModel';

export default function SocialStoryViewerScreen() {
  const params = useLocalSearchParams<{ storyId?: string | string[] }>();
  const storyId = Array.isArray(params.storyId) ? params.storyId[0] : params.storyId;
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const { locale } = useLocalization();
  const copy = getSocialStoryCopy(locale);
  const safeAreaInsets = useSafeAreaInsets();
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        author: {
          color: colors.textPrimary,
          flexShrink: 1,
          fontSize: Typography.bodyEmphasized.fontSize,
          fontWeight: Typography.bodyEmphasized.fontWeight,
          lineHeight: Typography.bodyEmphasized.lineHeight,
        },
        content: {
          alignSelf: 'center',
          flexGrow: 1,
          gap: Spacing.three,
          maxWidth: MaxContentWidth,
          paddingHorizontal: Spacing.three,
          width: '100%',
        },
        errorCard: { gap: Spacing.three },
        header: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.three,
          justifyContent: 'space-between',
        },
        mediaArea: {
          alignItems: 'center',
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: 24,
          borderWidth: StyleSheet.hairlineWidth,
          flex: 1,
          justifyContent: 'center',
          minHeight: 320,
          overflow: 'hidden',
        },
        screen: { backgroundColor: glass.backgroundBase, flex: 1 },
        storyImage: { height: '100%', width: '100%' },
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
  const socialApi = useMemo(() => createSocialApi(auth), [auth]);
  const [story, setStory] = useState<SocialStoryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStory = useCallback(async () => {
    if (!ready) return;
    if (!isAuthenticated || !storyId) {
      setStory(null);
      setLoading(false);
      setErrorMessage(copy.storyUnavailable);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const nextStory = await socialApi.getStory(storyId);
      setStory(nextStory);
      setLoading(false);
      try {
        await socialApi.markStoryViewed(storyId);
      } catch {
        // The Story remains readable even if the idempotent viewed mutation cannot persist.
      }
    } catch (error) {
      setStory(null);
      setLoading(false);
      const mapped = getSocialStoryLoadError(error);
      setErrorMessage(
        mapped === 'not_found' ? copy.storyUnavailable : copy.loadError,
      );
    }
  }, [copy.loadError, copy.storyUnavailable, isAuthenticated, ready, socialApi, storyId]);

  useEffect(() => {
    void loadStory();
  }, [loadStory]);

  const variant =
    story?.image.variants.post_1080 ??
    story?.image.variants.post_640 ??
    story?.image.variants.post_320 ??
    null;
  const backgroundColor =
    story?.image.placeholder.type === 'average_color'
      ? story.image.placeholder.value
      : undefined;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: safeAreaInsets.bottom + Spacing.three,
            paddingTop: safeAreaInsets.top + Spacing.two,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.author}>
            {story ? `@${story.author.username}` : copy.stories}
          </Text>
          <LiquidGlassIconButton
            accessibilityLabel={copy.close}
            Icon={X}
            onPress={() => router.back()}
            testID="story-viewer-close"
          />
        </View>

        {loading ? (
          <LoadingState label={copy.loading} />
        ) : errorMessage ? (
          <AppCard style={styles.errorCard}>
            <InlineError message={errorMessage} />
            <SecondaryButton label={copy.retry} onPress={() => void loadStory()} />
          </AppCard>
        ) : story && variant ? (
          <View style={[styles.mediaArea, { backgroundColor }]}>
            <Image
              accessibilityLabel={`${copy.openStory}: ${story.author.displayName}`}
              resizeMode="contain"
              source={{ uri: variant.url }}
              style={styles.storyImage}
            />
          </View>
        ) : (
          <InlineError message={copy.storyUnavailable} />
        )}
      </ScrollView>
    </View>
  );
}
