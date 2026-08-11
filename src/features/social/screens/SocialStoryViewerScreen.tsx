import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createSocialApi, type SocialStoryDto } from '@/api/social';
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
import { requestSocialStoryRefresh } from '../socialStoryRefreshSignal';
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
        caption: {
          color: colors.textPrimary,
          fontSize: Typography.body.fontSize,
          fontWeight: Typography.body.fontWeight,
          lineHeight: Typography.body.lineHeight,
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
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
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
  const [caption, setCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStory = useCallback(async () => {
    if (!ready) return;
    if (!isAuthenticated || !storyId) {
      setStory(null);
      setCaption(null);
      setCanDelete(false);
      setLoading(false);
      setErrorMessage(copy.storyUnavailable);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const [nextStory, ownProfile, captionResult] = await Promise.all([
        socialApi.getStory(storyId),
        socialApi.getOwnProfile().catch(() => null),
        socialApi.getStoryCaption(storyId).catch(() => null),
      ]);
      setStory(nextStory);
      setCaption(
        captionResult?.storyId === nextStory.id ? captionResult.caption : null,
      );
      setCanDelete(ownProfile?.username === nextStory.author.username);
      setLoading(false);
      try {
        await socialApi.markStoryViewed(storyId);
      } catch {
        // The Story remains readable even if the idempotent viewed mutation cannot persist.
      }
    } catch (error) {
      setStory(null);
      setCaption(null);
      setCanDelete(false);
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

  const deleteStory = useCallback(async () => {
    if (!storyId || deleting) return;
    setDeleting(true);
    setErrorMessage(null);
    try {
      await socialApi.deleteStory(storyId);
      requestSocialStoryRefresh();
      router.back();
    } catch {
      setErrorMessage(copy.deleteFailed);
      setDeleting(false);
    }
  }, [copy.deleteFailed, deleting, socialApi, storyId]);

  const confirmDelete = useCallback(() => {
    Alert.alert(copy.deleteStoryTitle, copy.deleteStoryBody, [
      { text: copy.cancel, style: 'cancel' },
      {
        text: copy.deleteStory,
        style: 'destructive',
        onPress: () => void deleteStory(),
      },
    ]);
  }, [copy.cancel, copy.deleteStory, copy.deleteStoryBody, copy.deleteStoryTitle, deleteStory]);

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
        ) : errorMessage && !story ? (
          <AppCard style={styles.errorCard}>
            <InlineError message={errorMessage} />
            <SecondaryButton label={copy.retry} onPress={() => void loadStory()} />
          </AppCard>
        ) : story && variant ? (
          <>
            <View
              style={[
                styles.mediaArea,
                { aspectRatio: story.image.aspectRatio, backgroundColor },
              ]}
            >
              <Image
                accessibilityLabel={`${copy.openStory}: ${story.author.displayName}`}
                resizeMode="contain"
                source={{ uri: variant.url }}
                style={styles.storyImage}
              />
            </View>
            {caption ? <Text style={styles.caption}>{caption}</Text> : null}
            {errorMessage ? <InlineError message={errorMessage} /> : null}
            {canDelete ? (
              <SecondaryButton
                label={copy.deleteStory}
                loading={deleting}
                onPress={confirmDelete}
              />
            ) : null}
          </>
        ) : (
          <InlineError message={copy.storyUnavailable} />
        )}
      </ScrollView>
    </View>
  );
}
