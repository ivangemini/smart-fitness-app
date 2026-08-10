import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Platform, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createSocialApi, type SocialWorkoutPostDto } from '@/api/social';
import { AppCard } from '@/components/ui/AppCard';
import { DestructiveButton } from '@/components/ui/DestructiveButton';
import { InlineError } from '@/components/ui/InlineError';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Spacing } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { SocialReportModal } from '../SocialReportModal';
import {
  SocialWorkoutCommentRow,
  SocialWorkoutCommentsControls,
  SocialWorkoutCommentsHeader,
  useSocialWorkoutComments,
} from '../SocialWorkoutCommentsCard';
import { SocialWorkoutPostDetailContent } from '../SocialWorkoutPostDetailContent';
import { SocialWorkoutReactionCard } from '../SocialWorkoutReactionCard';
import { getSocialReportCopy } from '../socialReportCopy';
import type { SocialReportTarget } from '../socialReportModel';
import { getSocialWorkoutPostSurfaceCopy } from '../socialWorkoutPostSurfaceCopy';
import {
  getSocialWorkoutPostLoadError,
  type SocialWorkoutPostLoadError,
} from '../socialWorkoutPostSurfaceModel';
import { createSocialWorkoutPostSurfaceStyles } from './SocialWorkoutPostSurface.styles';

type DetailStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'private'
  | 'blocked'
  | 'not_found'
  | 'deleted'
  | 'error';

const readParam = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] ?? '' : value ?? '').trim();

export default function SocialWorkoutPostDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ postId?: string | string[] }>();
  const postId = readParam(params.postId);
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { locale, t } = useLocalization();
  const copy = getSocialWorkoutPostSurfaceCopy(locale);
  const reportCopy = getSocialReportCopy(locale);
  const styles = useMemo(() => createSocialWorkoutPostSurfaceStyles(colors), [colors]);
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const requestSequence = useRef(0);
  const [status, setStatus] = useState<DetailStatus>('idle');
  const [post, setPost] = useState<SocialWorkoutPostDto | null>(null);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [loadError, setLoadError] = useState<SocialWorkoutPostLoadError | null>(
    null,
  );
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [reportTarget, setReportTarget] =
    useState<SocialReportTarget | null>(null);

  const auth = useMemo(
    () => ({
      getAccessToken: async () => session?.tokens.accessToken ?? null,
      refreshAccessToken: async () => (await refresh())?.tokens.accessToken ?? null,
    }),
    [refresh, session?.tokens.accessToken],
  );
  const socialApi = useMemo(() => createSocialApi(auth), [auth]);
  const commentsEnabled =
    ready && isAuthenticated && status === 'ready' && post !== null;
  const comments = useSocialWorkoutComments({
    canComment: ownUsername !== null,
    copy,
    enabled: commentsEnabled,
    locale,
    postId,
    socialApi,
  });

  const loadPost = useCallback(async () => {
    if (!isAuthenticated) return;
    if (!postId) {
      setStatus('not_found');
      return;
    }
    const sequence = ++requestSequence.current;
    setStatus('loading');
    setPost(null);
    setOwnUsername(null);
    setIsOwnPost(false);
    setLoadError(null);
    setDeleteError(null);
    setReportTarget(null);

    try {
      const [loadedPost, ownProfile] = await Promise.all([
        socialApi.getWorkoutPost(postId),
        socialApi.getOwnProfile(),
      ]);
      if (sequence !== requestSequence.current) return;
      const username = ownProfile?.username ?? null;
      setPost(loadedPost);
      setOwnUsername(username);
      setIsOwnPost(username === loadedPost.author.username);
      setStatus('ready');
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      const mapped = getSocialWorkoutPostLoadError(error);
      setLoadError(mapped);
      setStatus(
        mapped === 'private'
          ? 'private'
          : mapped === 'blocked'
            ? 'blocked'
            : mapped === 'not_found'
              ? 'not_found'
              : 'error',
      );
    }
  }, [isAuthenticated, postId, socialApi]);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      requestSequence.current += 1;
      setStatus('idle');
      return;
    }
    void loadPost();
    return () => {
      requestSequence.current += 1;
    };
  }, [isAuthenticated, loadPost, ready]);

  const deletePost = async () => {
    if (deleteBusy || !isOwnPost) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await socialApi.deleteWorkoutPost(postId);
      setPost(null);
      setStatus('deleted');
    } catch {
      setDeleteError(copy.deleteError);
    } finally {
      setDeleteBusy(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(copy.deleteTitle, copy.deleteBody, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: copy.deleteConfirm, style: 'destructive', onPress: deletePost },
    ]);
  };

  const errorMessage =
    loadError === 'offline'
      ? copy.loadErrorOffline
      : loadError === 'session_expired'
        ? copy.loadErrorSession
        : copy.loadErrorGeneric;
  const commentListData =
    commentsEnabled && comments.status === 'ready' ? comments.comments : [];

  return (
    <>
      <FlatList
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + Spacing.eight,
            paddingTop: insets.top + Spacing.four,
          },
        ]}
        data={commentListData}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(comment) => comment.id}
        ListFooterComponent={
          ready && isAuthenticated && status === 'ready' && post ? (
            <View style={styles.listFooter}>
              <SocialWorkoutCommentsControls
                canComment={ownUsername !== null}
                controller={comments}
                copy={copy}
                onCreateProfile={() => router.push('/settings/social-profile')}
                styles={styles}
              />
              {!isOwnPost ? (
                <SecondaryButton
                  label={reportCopy.reportPost}
                  onPress={() =>
                    setReportTarget({ type: 'workout_post', postId: post.id })
                  }
                />
              ) : null}
              {isOwnPost ? (
                <>
                  <InlineError message={deleteError} />
                  <DestructiveButton
                    disabled={deleteBusy}
                    label={copy.deletePost}
                    loading={deleteBusy}
                    onPress={confirmDelete}
                  />
                </>
              ) : null}
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View
            style={[
              styles.container,
              commentListData.length > 0 && styles.listHeaderWithItems,
            ]}>
            <View style={styles.headerRow}>
              <LiquidGlassIconButton
                accessibilityLabel={t('common.back')}
                Icon={ChevronLeft}
                onPress={() => router.back()}
              />
              <View style={styles.headerCopy}>
                <Text style={styles.eyebrow}>{copy.detailEyebrow}</Text>
                <Text style={styles.title}>
                  {post?.workout.title ?? copy.untitledWorkout}
                </Text>
              </View>
            </View>

            {!ready ||
            (ready &&
              isAuthenticated &&
              (status === 'idle' || status === 'loading')) ? (
              <AppCard>
                <LoadingState label={copy.loadingPost} />
              </AppCard>
            ) : null}

            {ready && !isAuthenticated ? (
              <StateCard
                body={copy.signInBody}
                styles={styles}
                title={copy.signInTitle}>
                <PrimaryButton
                  label={copy.signInAction}
                  onPress={() => router.push('/auth/sign-in')}
                />
              </StateCard>
            ) : null}

            {ready && isAuthenticated && status === 'private' ? (
              <StateCard
                body={copy.privateBody}
                styles={styles}
                title={copy.privateTitle}
              />
            ) : null}

            {ready && isAuthenticated && status === 'blocked' ? (
              <StateCard
                body={copy.blockedBody}
                styles={styles}
                title={copy.blockedTitle}
              />
            ) : null}

            {ready && isAuthenticated && status === 'not_found' ? (
              <StateCard
                body={copy.notFoundBody}
                styles={styles}
                title={copy.notFoundTitle}
              />
            ) : null}

            {ready && isAuthenticated && status === 'deleted' ? (
              <StateCard
                body={copy.deletedBody}
                styles={styles}
                title={copy.deletedTitle}>
                <SecondaryButton
                  label={t('common.back')}
                  onPress={() => router.back()}
                />
              </StateCard>
            ) : null}

            {ready && isAuthenticated && status === 'error' ? (
              <StateCard
                body={errorMessage}
                styles={styles}
                title={copy.loadErrorTitle}>
                <SecondaryButton label={copy.retry} onPress={loadPost} />
              </StateCard>
            ) : null}

            {ready && isAuthenticated && status === 'ready' && post ? (
              <>
                <SocialWorkoutPostDetailContent
                  copy={copy}
                  locale={locale}
                  post={post}
                  styles={styles}
                />
                <SocialWorkoutReactionCard
                  canReact={ownUsername !== null}
                  copy={copy}
                  locale={locale}
                  onCreateProfile={() => router.push('/settings/social-profile')}
                  postId={post.id}
                  socialApi={socialApi}
                  styles={styles}
                />
                <SocialWorkoutCommentsHeader
                  controller={comments}
                  copy={copy}
                  styles={styles}
                />
              </>
            ) : null}
          </View>
        }
        renderItem={({ item: comment }) => (
          <View style={styles.listItem}>
            <SocialWorkoutCommentRow
              cancelLabel={t('common.cancel')}
              comment={comment}
              controller={comments}
              copy={copy}
              isPostOwner={isOwnPost}
              locale={locale}
              onReportComment={(commentId) =>
                setReportTarget({
                  type: 'workout_comment',
                  postId,
                  commentId,
                })
              }
              ownUsername={ownUsername}
              reportLabel={reportCopy.reportComment}
              styles={styles}
            />
          </View>
        )}
        style={styles.screen}
      />
      <SocialReportModal
        locale={locale}
        onClose={() => setReportTarget(null)}
        socialApi={socialApi}
        target={reportTarget}
      />
    </>
  );
}

function StateCard({
  body,
  children,
  styles,
  title,
}: {
  body: string;
  children?: React.ReactNode;
  styles: ReturnType<typeof createSocialWorkoutPostSurfaceStyles>;
  title: string;
}) {
  return (
    <AppCard>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {children}
    </AppCard>
  );
}
