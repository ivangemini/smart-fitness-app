import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import type { SocialApi, SocialWorkoutCommentDto } from '@/api/social';
import { AppCard } from '@/components/ui/AppCard';
import { FormField } from '@/components/ui/FormField';
import { InlineError } from '@/components/ui/InlineError';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import type { SupportedLocale } from '@/localization';

import type { SocialWorkoutPostSurfaceStyles } from './screens/SocialWorkoutPostSurface.styles';
import { getSocialRateLimitMessage } from './socialRateLimitCopy';
import type { SocialWorkoutPostSurfaceCopy } from './socialWorkoutPostSurfaceCopy';
import {
  buildPendingSocialWorkoutComment,
  formatSocialWorkoutCommentDate,
  getSocialWorkoutCommentLoadError,
  isMissingSocialWorkoutCommentError,
  mergeSocialWorkoutComments,
  removeSocialWorkoutComment,
  type PendingSocialWorkoutComment,
  type SocialWorkoutCommentLoadError,
} from './socialWorkoutCommentModel';

type CommentStatus = 'loading' | 'ready' | 'error';

type UseSocialWorkoutCommentsInput = {
  canComment: boolean;
  copy: SocialWorkoutPostSurfaceCopy;
  enabled: boolean;
  locale: SupportedLocale;
  postId: string;
  socialApi: SocialApi;
};

const PAGE_SIZE = 20;

export function useSocialWorkoutComments({
  canComment,
  copy,
  enabled,
  locale,
  postId,
  socialApi,
}: UseSocialWorkoutCommentsInput) {
  const requestSequence = useRef(0);
  const pendingSubmission = useRef<PendingSocialWorkoutComment | null>(null);
  const [status, setStatus] = useState<CommentStatus>('loading');
  const [comments, setComments] = useState<SocialWorkoutCommentDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadError, setLoadError] =
    useState<SocialWorkoutCommentLoadError | null>(null);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);
  const [loadMoreError, setLoadMoreError] =
    useState<SocialWorkoutCommentLoadError | null>(null);
  const [draft, setDraft] = useState('');
  const [submitBusy, setSubmitBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    if (!enabled) return;
    const sequence = ++requestSequence.current;
    setStatus('loading');
    setComments([]);
    setNextCursor(null);
    setLoadError(null);
    setLoadMoreError(null);
    setDeleteError(null);

    try {
      const page = await socialApi.listWorkoutPostComments(postId, {
        limit: PAGE_SIZE,
      });
      if (sequence !== requestSequence.current) return;
      setComments(page.items);
      setNextCursor(page.nextCursor);
      setStatus('ready');
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setLoadError(getSocialWorkoutCommentLoadError(error));
      setStatus('error');
    }
  }, [enabled, postId, socialApi]);

  useEffect(() => {
    if (!enabled) {
      requestSequence.current += 1;
      pendingSubmission.current = null;
      setStatus('loading');
      setComments([]);
      setNextCursor(null);
      setLoadError(null);
      setLoadMoreError(null);
      setDraft('');
      setSubmitBusy(false);
      setSubmitError(null);
      setDeletingId(null);
      setDeleteError(null);
      return;
    }
    void loadInitial();
    return () => {
      requestSequence.current += 1;
    };
  }, [enabled, loadInitial]);

  const loadMore = async () => {
    if (!enabled || !nextCursor || loadMoreBusy) return;
    const sequence = requestSequence.current;
    setLoadMoreBusy(true);
    setLoadMoreError(null);
    try {
      const page = await socialApi.listWorkoutPostComments(postId, {
        limit: PAGE_SIZE,
        cursor: nextCursor,
      });
      if (sequence !== requestSequence.current) return;
      setComments((current) =>
        mergeSocialWorkoutComments(current, page.items),
      );
      setNextCursor(page.nextCursor);
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setLoadMoreError(getSocialWorkoutCommentLoadError(error));
    } finally {
      if (sequence === requestSequence.current) setLoadMoreBusy(false);
    }
  };

  const submit = async () => {
    if (!enabled || !canComment || submitBusy || draft.trim().length === 0) {
      return;
    }
    const sequence = requestSequence.current;
    const pending = buildPendingSocialWorkoutComment(
      pendingSubmission.current,
      draft,
    );
    pendingSubmission.current = pending;
    setSubmitBusy(true);
    setSubmitError(null);
    try {
      const created = await socialApi.createWorkoutPostComment(postId, pending);
      if (sequence !== requestSequence.current) return;
      setComments((current) => mergeSocialWorkoutComments(current, [created]));
      setDraft('');
      pendingSubmission.current = null;
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setSubmitError(
        getSocialRateLimitMessage(error, locale) ?? copy.commentsCreateError,
      );
    } finally {
      if (sequence === requestSequence.current) setSubmitBusy(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!enabled || deletingId) return;
    const sequence = requestSequence.current;
    setDeletingId(commentId);
    setDeleteError(null);
    try {
      await socialApi.deleteWorkoutPostComment(postId, commentId);
      if (sequence !== requestSequence.current) return;
      setComments((current) =>
        removeSocialWorkoutComment(current, commentId),
      );
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      if (isMissingSocialWorkoutCommentError(error)) {
        setComments((current) =>
          removeSocialWorkoutComment(current, commentId),
        );
      } else {
        setDeleteError(copy.commentsDeleteError);
      }
    } finally {
      if (sequence === requestSequence.current) setDeletingId(null);
    }
  };

  return {
    comments,
    deleteComment,
    deleteError,
    deletingId,
    draft,
    loadError,
    loadInitial,
    loadMore,
    loadMoreBusy,
    loadMoreError,
    nextCursor,
    setDraft,
    status,
    submit,
    submitBusy,
    submitError,
  };
}

export type SocialWorkoutCommentsController = ReturnType<
  typeof useSocialWorkoutComments
>;

const errorMessage = (
  copy: SocialWorkoutPostSurfaceCopy,
  error: SocialWorkoutCommentLoadError | null,
): string => {
  if (error === 'invalid_cursor') return copy.commentsLoadCursor;
  if (error === 'offline') return copy.commentsLoadOffline;
  if (error === 'session_expired') return copy.commentsLoadSession;
  if (error === 'private') return copy.commentsLoadPrivate;
  if (error === 'blocked') return copy.commentsLoadBlocked;
  if (error === 'not_found') return copy.commentsLoadNotFound;
  return copy.commentsLoadGeneric;
};

export function SocialWorkoutCommentsHeader({
  controller,
  copy,
  styles,
}: {
  controller: SocialWorkoutCommentsController;
  copy: SocialWorkoutPostSurfaceCopy;
  styles: SocialWorkoutPostSurfaceStyles;
}) {
  return (
    <AppCard>
      <Text style={styles.cardTitle}>{copy.commentsTitle}</Text>
      <Text style={styles.body}>{copy.commentsBody}</Text>
      {controller.status === 'loading' ? (
        <LoadingState label={copy.commentsLoading} />
      ) : null}
      {controller.status === 'error' ? (
        <>
          <InlineError message={errorMessage(copy, controller.loadError)} />
          <SecondaryButton
            label={copy.retry}
            onPress={() => void controller.loadInitial()}
          />
        </>
      ) : null}
      {controller.status === 'ready' && controller.comments.length === 0 ? (
        <Text style={styles.body}>{copy.commentsEmpty}</Text>
      ) : null}
    </AppCard>
  );
}

export function SocialWorkoutCommentRow({
  cancelLabel,
  comment,
  controller,
  copy,
  isPostOwner,
  locale,
  onReportComment,
  ownUsername,
  reportLabel,
  styles,
}: {
  cancelLabel: string;
  comment: SocialWorkoutCommentDto;
  controller: SocialWorkoutCommentsController;
  copy: SocialWorkoutPostSurfaceCopy;
  isPostOwner: boolean;
  locale: SupportedLocale;
  onReportComment: (commentId: string) => void;
  ownUsername: string | null;
  reportLabel: string;
  styles: SocialWorkoutPostSurfaceStyles;
}) {
  const isOwnComment = comment.author.username === ownUsername;
  const canDelete = isPostOwner || isOwnComment;
  const canReport = !isOwnComment;
  const confirmDelete = () => {
    Alert.alert(copy.commentsDeleteTitle, copy.commentsDeleteBody, [
      { text: cancelLabel, style: 'cancel' },
      {
        text: copy.commentsDeleteConfirm,
        style: 'destructive',
        onPress: () => void controller.deleteComment(comment.id),
      },
    ]);
  };

  return (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.commentHeaderCopy}>
          <Text style={styles.username}>@{comment.author.username}</Text>
          <Text style={styles.metaText}>
            {formatSocialWorkoutCommentDate(comment.createdAt, locale)}
          </Text>
        </View>
        {canDelete || canReport ? (
          <View style={styles.commentActions}>
            {canReport ? (
              <Pressable
                accessibilityLabel={reportLabel}
                accessibilityRole="button"
                onPress={() => onReportComment(comment.id)}
                style={({ pressed }) => [
                  styles.commentReportButton,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.commentReportLabel}>{reportLabel}</Text>
              </Pressable>
            ) : null}
            {canDelete ? (
              <Pressable
                accessibilityLabel={copy.commentsDelete}
                accessibilityRole="button"
                disabled={controller.deletingId !== null}
                onPress={confirmDelete}
                style={({ pressed }) => [
                  styles.commentDeleteButton,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.commentDeleteLabel}>
                  {controller.deletingId === comment.id
                    ? `${copy.commentsDelete}…`
                    : copy.commentsDelete}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
      <Text style={styles.commentBody}>{comment.body}</Text>
    </View>
  );
}

export function SocialWorkoutCommentsControls({
  canComment,
  controller,
  copy,
  onCreateProfile,
  styles,
}: {
  canComment: boolean;
  controller: SocialWorkoutCommentsController;
  copy: SocialWorkoutPostSurfaceCopy;
  onCreateProfile: () => void;
  styles: SocialWorkoutPostSurfaceStyles;
}) {
  if (controller.status !== 'ready') return null;

  return (
    <AppCard>
      <InlineError message={controller.deleteError} />
      {controller.nextCursor ? (
        <>
          <InlineError
            message={
              controller.loadMoreError
                ? errorMessage(copy, controller.loadMoreError)
                : null
            }
          />
          <SecondaryButton
            disabled={controller.loadMoreBusy}
            label={
              controller.loadMoreError === 'invalid_cursor'
                ? copy.commentsReload
                : copy.commentsLoadMore
            }
            loading={controller.loadMoreBusy}
            onPress={
              controller.loadMoreError === 'invalid_cursor'
                ? () => void controller.loadInitial()
                : () => void controller.loadMore()
            }
          />
        </>
      ) : null}

      {canComment ? (
        <>
          <FormField
            accessibilityLabel={copy.commentsInputLabel}
            helperText={`${controller.draft.length}/500`}
            label={copy.commentsInputLabel}
            maxLength={500}
            multiline
            onChangeText={controller.setDraft}
            placeholder={copy.commentsInputPlaceholder}
            style={styles.commentInput}
            textAlignVertical="top"
            value={controller.draft}
          />
          <InlineError message={controller.submitError} />
          <PrimaryButton
            disabled={
              controller.submitBusy || controller.draft.trim().length === 0
            }
            label={copy.commentsSubmit}
            loading={controller.submitBusy}
            onPress={() => void controller.submit()}
          />
        </>
      ) : (
        <>
          <Text style={styles.body}>{copy.commentsProfileRequired}</Text>
          <SecondaryButton
            label={copy.commentsCreateProfile}
            onPress={onCreateProfile}
          />
        </>
      )}
    </AppCard>
  );
}
