import { router, useLocalSearchParams } from 'expo-router';
import { Heart, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  createSocialApi,
  type SocialStoryDto,
  type SocialStoryOverlayValueDto,
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
import { getSocialStoryExpansionCopy } from '../socialStoryExpansionCopy';
import { SocialStoryReplySurface } from '../SocialStoryReplySurface';
import {
  getSocialStoryLikeSurfaceMode,
  loadSocialStoryLikeSurface,
  type SocialStoryLikeSurface,
  type SocialStoryLikeSurfaceMode,
} from '../storyLikeSurfaceModel';
import { SocialStoryOverlayView } from '../SocialStoryOverlayView';
import { SocialStoryReactionSurface } from '../SocialStoryReactionSurface';
import {
  getSocialStoryReactionSurfaceMode,
  type SocialStoryReactionSurfaceMode,
} from '../storyReactionSurfaceModel';
import { requestSocialStoryRefresh } from '../socialStoryRefreshSignal';
import { getSocialStoryLoadError } from '../socialStorySurfaceModel';

export default function SocialStoryViewerScreen() {
  const params = useLocalSearchParams<{ storyId?: string | string[] }>();
  const storyId = Array.isArray(params.storyId) ? params.storyId[0] : params.storyId;
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const { locale } = useLocalization();
  const copy = getSocialStoryCopy(locale);
  const expansionCopy = getSocialStoryExpansionCopy(locale);
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
        likeButton: {
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          justifyContent: 'center',
          minHeight: 44,
          minWidth: 44,
        },
        likeButtonDisabled: { opacity: 0.5 },
        likeButtonPressed: { opacity: 0.72 },
        likeSummary: {
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          flexDirection: 'row',
          gap: Spacing.two,
          minHeight: 44,
          paddingHorizontal: Spacing.three,
        },
        likeSummaryText: {
          color: colors.textPrimary,
          fontSize: Typography.callout.fontSize,
          fontWeight: Typography.callout.fontWeight,
          lineHeight: Typography.callout.lineHeight,
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
  const [overlay, setOverlay] = useState<SocialStoryOverlayValueDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [likeMode, setLikeMode] = useState<SocialStoryLikeSurfaceMode | null>(null);
  const [reactionMode, setReactionMode] =
    useState<SocialStoryReactionSurfaceMode | null>(null);
  const [likeSurface, setLikeSurface] = useState<SocialStoryLikeSurface | null>(
    null,
  );
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeUpdating, setLikeUpdating] = useState(false);
  const [likeErrorMessage, setLikeErrorMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetInteractionSurfaces = useCallback(() => {
    setLikeMode(null);
    setReactionMode(null);
    setLikeSurface(null);
    setLikeLoading(false);
    setLikeUpdating(false);
    setLikeErrorMessage(null);
  }, []);

  const loadStory = useCallback(async () => {
    if (!ready) return;
    if (!isAuthenticated || !storyId) {
      setStory(null);
      setCaption(null);
      setOverlay(null);
      setCanDelete(false);
      resetInteractionSurfaces();
      setLoading(false);
      setErrorMessage(copy.storyUnavailable);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setLikeErrorMessage(null);
    try {
      const [nextStory, ownProfile, captionResult, overlayResult] =
        await Promise.all([
          socialApi.getStory(storyId),
          socialApi.getOwnProfile().catch(() => null),
          socialApi.getStoryCaption(storyId).catch(() => null),
          socialApi.getStoryOverlay(storyId).catch(() => null),
        ]);
      setStory(nextStory);
      setCaption(
        captionResult?.storyId === nextStory.id ? captionResult.caption : null,
      );
      setOverlay(
        overlayResult?.storyId === nextStory.id ? overlayResult.overlay : null,
      );
      const nextCanDelete = ownProfile?.username === nextStory.author.username;
      setCanDelete(nextCanDelete);
      const nextLikeMode = getSocialStoryLikeSurfaceMode(
        ownProfile?.username,
        nextStory.author.username,
      );
      const nextReactionMode = getSocialStoryReactionSurfaceMode(
        ownProfile?.username,
        nextStory.author.username,
      );
      setLikeMode(nextLikeMode);
      setReactionMode(nextReactionMode);
      setLikeSurface(null);
      setLikeLoading(Boolean(nextLikeMode));
      setLoading(false);

      void socialApi.markStoryViewed(storyId).catch(() => {
        // The Story remains readable even if the idempotent viewed mutation cannot persist.
      });

      if (!nextLikeMode) {
        setLikeErrorMessage(copy.likeLoadFailed);
        return;
      }
      try {
        const nextLikeSurface = await loadSocialStoryLikeSurface(
          nextLikeMode,
          storyId,
          socialApi,
        );
        const responseStoryId =
          nextLikeSurface.mode === 'owner_summary'
            ? nextLikeSurface.summary.storyId
            : nextLikeSurface.state.storyId;
        if (responseStoryId !== nextStory.id) {
          throw new Error('Story Like response target mismatch');
        }
        setLikeSurface(nextLikeSurface);
      } catch {
        setLikeErrorMessage(copy.likeLoadFailed);
      } finally {
        setLikeLoading(false);
      }
    } catch (error) {
      setStory(null);
      setCaption(null);
      setOverlay(null);
      setCanDelete(false);
      resetInteractionSurfaces();
      setLoading(false);
      const mapped = getSocialStoryLoadError(error);
      setErrorMessage(
        mapped === 'not_found' ? copy.storyUnavailable : copy.loadError,
      );
    }
  }, [
    copy.likeLoadFailed,
    copy.loadError,
    copy.storyUnavailable,
    isAuthenticated,
    ready,
    resetInteractionSurfaces,
    socialApi,
    storyId,
  ]);

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
  }, [
    copy.cancel,
    copy.deleteStory,
    copy.deleteStoryBody,
    copy.deleteStoryTitle,
    deleteStory,
  ]);

  const viewerLikeState =
    likeSurface?.mode === 'viewer_state' ? likeSurface.state : null;
  const ownerLikeSummary =
    likeSurface?.mode === 'owner_summary' ? likeSurface.summary : null;

  const toggleStoryLike = useCallback(async () => {
    if (
      !storyId ||
      likeMode !== 'viewer_state' ||
      !viewerLikeState ||
      likeLoading ||
      likeUpdating
    ) {
      return;
    }
    setLikeUpdating(true);
    setLikeErrorMessage(null);
    try {
      const nextState = viewerLikeState.liked
        ? await socialApi.unlikeStory(storyId)
        : await socialApi.likeStory(storyId);
      if (nextState.storyId !== storyId) {
        throw new Error('Story Like mutation target mismatch');
      }
      setLikeSurface({ mode: 'viewer_state', state: nextState });
    } catch {
      setLikeErrorMessage(copy.likeUpdateFailed);
    } finally {
      setLikeUpdating(false);
    }
  }, [
    copy.likeUpdateFailed,
    likeLoading,
    likeMode,
    likeUpdating,
    socialApi,
    storyId,
    viewerLikeState,
  ]);

  const variant =
    story?.image.variants.post_1080 ??
    story?.image.variants.post_640 ??
    story?.image.variants.post_320 ??
    null;
  const backgroundColor =
    story?.image.placeholder.type === 'average_color'
      ? story.image.placeholder.value
      : undefined;
  const likeSelected = viewerLikeState?.liked ?? false;
  const likeDisabled = likeLoading || likeUpdating || !viewerLikeState;

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
              <SocialStoryOverlayView overlay={overlay} />
            </View>
            {caption ? <Text style={styles.caption}>{caption}</Text> : null}

            {likeMode === 'owner_summary' ? (
              <View
                accessibilityLabel={
                  ownerLikeSummary
                    ? copy.likesCount(ownerLikeSummary.likeCount)
                    : copy.likeLoadFailed
                }
                style={styles.likeSummary}
                testID="story-like-summary"
              >
                <Heart color={colors.textSecondary} size={18} />
                <Text style={styles.likeSummaryText}>
                  {ownerLikeSummary
                    ? copy.likesCount(ownerLikeSummary.likeCount)
                    : likeLoading
                      ? copy.loading
                      : '—'}
                </Text>
              </View>
            ) : likeMode === 'viewer_state' ? (
              <Pressable
                accessibilityLabel={
                  likeSelected ? copy.unlikeStory : copy.likeStory
                }
                accessibilityRole="button"
                accessibilityState={{
                  busy: likeUpdating,
                  disabled: likeDisabled,
                  selected: likeSelected,
                }}
                disabled={likeDisabled}
                onPress={() => void toggleStoryLike()}
                style={({ pressed }) => [
                  styles.likeButton,
                  likeDisabled ? styles.likeButtonDisabled : null,
                  pressed ? styles.likeButtonPressed : null,
                ]}
                testID="story-like-toggle"
              >
                <Heart
                  color={likeSelected ? colors.error : colors.textPrimary}
                  fill={likeSelected ? colors.error : 'transparent'}
                  size={22}
                />
              </Pressable>
            ) : null}

            {reactionMode ? (
              <SocialStoryReactionSurface
                api={socialApi}
                locale={locale}
                mode={reactionMode}
                storyId={story.id}
              />
            ) : null}
            <SocialStoryReplySurface
              api={socialApi}
              copy={expansionCopy}
              owner={canDelete}
              storyId={story.id}
            />
            {likeErrorMessage ? (
              <InlineError message={likeErrorMessage} />
            ) : null}
            {errorMessage ? <InlineError message={errorMessage} /> : null}
            {canDelete ? (
              <>
                <SecondaryButton
                  label={expansionCopy.manageStories}
                  onPress={() => router.push('/social/story/settings')}
                />
                <SecondaryButton
                  label={copy.deleteStory}
                  loading={deleting}
                  onPress={confirmDelete}
                />
              </>
            ) : null}
          </>
        ) : (
          <InlineError message={copy.storyUnavailable} />
        )}
      </ScrollView>
    </View>
  );
}
