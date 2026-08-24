import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Crypto from 'expo-crypto';

import { getMobileApiBaseUrl } from '@/api';
import { createApiClient } from '@/api/client';
import { AuthContext } from '@/auth';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { FormField } from '@/components/ui/FormField';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { formatLocalizedDateTime, useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { TrainerEvidenceView } from './TrainerEvidenceView';
import { TrainerProposalSection } from './TrainerProposalSection';
import { createTrainerCollaborationApi } from './trainerCollaborationApi';
import { getTrainerCollaborationC3Copy } from './trainerCollaborationC3Copy';
import type { TrainerComment, TrainerEvidence } from './trainerCollaborationC3Model';
import { getTrainerCollaborationCopy } from './trainerCollaborationCopy';
import {
  isUuid,
  toTrainerRelationshipView,
  type TrainerReadScope,
  type TrainerRelationshipView,
} from './trainerCollaborationModel';

type TrainerCollaborationDetailScreenProps = {
  relationshipId: string;
};

type EvidenceLoadState = {
  evidence: TrainerEvidence | null;
  error: boolean;
  loading: boolean;
};

const EMPTY_EVIDENCE_STATE: EvidenceLoadState = {
  evidence: null,
  error: false,
  loading: false,
};

export function TrainerCollaborationDetailScreen({
  relationshipId,
}: TrainerCollaborationDetailScreenProps) {
  const auth = useContext(AuthContext);
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = useMemo(() => getTrainerCollaborationC3Copy(locale), [locale]);
  const relationshipCopy = useMemo(() => getTrainerCollaborationCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const api = useMemo(
    () => createTrainerCollaborationApi(createApiClient({ baseUrl: getMobileApiBaseUrl() })),
    [],
  );
  const currentUserId = auth?.user?.id ?? null;
  const accessToken = auth?.session?.tokens.accessToken ?? null;

  const [relationship, setRelationship] = useState<TrainerRelationshipView | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [comments, setComments] = useState<TrainerComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [commentAttemptKey, setCommentAttemptKey] = useState<string | null>(null);
  const [commentSending, setCommentSending] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [evidenceState, setEvidenceState] = useState<
    Partial<Record<TrainerReadScope, EvidenceLoadState>>
  >({});

  const loadComments = useCallback(
    async (view: TrainerRelationshipView) => {
      if (!accessToken || view.status !== 'active') {
        setComments([]);
        setCommentsError(false);
        return;
      }
      setCommentsLoading(true);
      setCommentsError(false);
      try {
        setComments(await api.listComments(accessToken, view.id));
      } catch {
        setCommentsError(true);
      } finally {
        setCommentsLoading(false);
      }
    },
    [accessToken, api],
  );

  const loadRelationship = useCallback(async () => {
    if (!accessToken || !currentUserId || !isUuid(relationshipId)) {
      setRelationship(null);
      setLoadError(Boolean(accessToken && currentUserId));
      return;
    }

    setLoading(true);
    setLoadError(false);
    try {
      const relationships = await api.listRelationships(accessToken);
      const source = relationships.find((item) => item.id === relationshipId);
      const view = source ? toTrainerRelationshipView(source, currentUserId) : null;
      if (!view) throw new Error('Trainer relationship is unavailable');
      setRelationship(view);
      setEvidenceState({});
      await loadComments(view);
    } catch {
      setRelationship(null);
      setComments([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [accessToken, api, currentUserId, loadComments, relationshipId]);

  useEffect(() => {
    void loadRelationship();
  }, [loadRelationship]);

  const loadEvidence = async (scope: TrainerReadScope) => {
    if (
      !accessToken ||
      !relationship ||
      relationship.status !== 'active' ||
      relationship.role !== 'trainer' ||
      !relationship.scopes.includes(scope)
    ) {
      return;
    }

    setEvidenceState((current) => ({
      ...current,
      [scope]: { evidence: current[scope]?.evidence ?? null, error: false, loading: true },
    }));
    try {
      const evidence = await api.loadEvidence(accessToken, relationship.id, scope);
      setEvidenceState((current) => ({
        ...current,
        [scope]: { evidence, error: false, loading: false },
      }));
    } catch {
      setEvidenceState((current) => ({
        ...current,
        [scope]: { evidence: null, error: true, loading: false },
      }));
    }
  };

  const sendComment = async () => {
    const body = commentBody.trim();
    if (
      !accessToken ||
      !relationship ||
      relationship.status !== 'active' ||
      relationship.role !== 'trainer' ||
      !body ||
      body.length > 2000 ||
      commentSending
    ) {
      return;
    }

    const idempotencyKey = commentAttemptKey ?? Crypto.randomUUID();
    if (!commentAttemptKey) setCommentAttemptKey(idempotencyKey);
    setCommentSending(true);
    setCommentError(false);
    try {
      const comment = await api.createComment(accessToken, relationship.id, {
        body,
        idempotencyKey,
      });
      setComments((current) => {
        const remaining = current.filter((item) => item.id !== comment.id);
        return [...remaining, comment];
      });
      setCommentBody('');
      setCommentAttemptKey(null);
    } catch {
      setCommentError(true);
    } finally {
      setCommentSending(false);
    }
  };

  const counterpartLabel = relationship
    ? relationship.counterpart.displayName?.trim() ||
      `${relationshipCopy.counterpartFallback} · ${relationship.counterpart.userId.slice(0, 8)}`
    : '';
  const bodyLength = commentBody.trim().length;
  const canSendComment = Boolean(
    relationship?.status === 'active' &&
      relationship.role === 'trainer' &&
      bodyLength > 0 &&
      bodyLength <= 2000 &&
      !commentSending,
  );

  return (
    <SettingsScreenLayout subtitle={copy.subtitle} title={copy.title}>
      {!accessToken || !currentUserId ? (
        <AppCard>
          <Text style={styles.body}>{relationshipCopy.accountRequired}</Text>
        </AppCard>
      ) : null}

      {accessToken && currentUserId ? (
        <AppCard>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.cardTitle}>{counterpartLabel || copy.title}</Text>
              {relationship ? (
                <>
                  <Text style={styles.meta}>
                    {relationshipCopy.status}: {relationshipCopy.statusLabels[relationship.status]}
                  </Text>
                  <Text style={styles.meta}>
                    {relationshipCopy.role}: {relationshipCopy.roleLabels[relationship.role]}
                  </Text>
                </>
              ) : null}
            </View>
            <AppButton
              disabled={loading}
              label={copy.refresh}
              loading={loading}
              onPress={() => void loadRelationship()}
              variant="secondary"
            />
          </View>

          {loadError ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {copy.relationshipUnavailable}
            </Text>
          ) : null}

          {relationship ? (
            <View style={styles.scopeList}>
              <Text style={styles.label}>{relationshipCopy.grantedScopes}</Text>
              {relationship.scopes.map((scope) => (
                <Text key={scope} style={styles.meta}>
                  • {relationshipCopy.scopeLabels[scope]}
                </Text>
              ))}
            </View>
          ) : null}

          {relationship && relationship.status !== 'active' ? (
            <Text style={styles.hint}>{copy.activeOnly}</Text>
          ) : null}
        </AppCard>
      ) : null}

      {relationship?.status === 'active' ? (
        <AppCard>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>{copy.commentsTitle}</Text>
            <Text style={styles.hint}>{copy.commentsHint}</Text>
          </View>

          <AppButton
            disabled={commentsLoading}
            label={copy.refresh}
            loading={commentsLoading}
            onPress={() => void loadComments(relationship)}
            variant="secondary"
          />

          {commentsError ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {copy.commentsUnavailable}
            </Text>
          ) : null}

          {!commentsLoading && !commentsError && comments.length === 0 ? (
            <Text style={styles.hint}>{copy.commentsEmpty}</Text>
          ) : null}

          <View style={styles.commentList}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <View style={styles.commentMetaRow}>
                  <Text style={styles.commentAuthor}>
                    {comment.author.displayName?.trim() || copy.humanTrainer}
                  </Text>
                  <Text style={styles.commentTime}>
                    {formatLocalizedDateTime(comment.createdAt, locale)}
                  </Text>
                </View>
                <Text style={styles.commentBody}>{comment.body}</Text>
              </View>
            ))}
          </View>

          {relationship.role === 'trainer' ? (
            <View style={styles.composer}>
              <FormField
                errorMessage={bodyLength > 2000 ? copy.commentTooLong : null}
                label={copy.commentLabel}
                maxLength={2000}
                multiline
                onChangeText={(value) => {
                  setCommentBody(value);
                  setCommentAttemptKey(null);
                  setCommentError(false);
                }}
                placeholder={copy.commentPlaceholder}
                style={styles.commentInput}
                textAlignVertical="top"
                value={commentBody}
              />
              {commentError ? (
                <Text accessibilityRole="alert" style={styles.errorText}>
                  {copy.commentFailed}
                </Text>
              ) : null}
              <AppButton
                disabled={!canSendComment}
                label={copy.sendComment}
                loading={commentSending}
                onPress={() => void sendComment()}
              />
            </View>
          ) : (
            <Text style={styles.hint}>{copy.trainerOnlyComment}</Text>
          )}
        </AppCard>
      ) : null}

      {relationship?.status === 'active' && accessToken ? (
        <TrainerProposalSection
          accessToken={accessToken}
          api={api}
          locale={locale}
          relationship={relationship}
        />
      ) : null}

      {relationship?.status === 'active' ? (
        <AppCard>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>{copy.evidenceTitle}</Text>
            <Text style={styles.hint}>
              {relationship.role === 'trainer' ? copy.evidenceHint : copy.clientEvidenceHint}
            </Text>
          </View>

          {relationship.role === 'trainer'
            ? relationship.scopes.map((scope) => {
                const state = evidenceState[scope] ?? EMPTY_EVIDENCE_STATE;
                return (
                  <View key={scope} style={styles.evidenceBlock}>
                    <Text style={styles.evidenceTitle}>{relationshipCopy.scopeLabels[scope]}</Text>
                    <AppButton
                      disabled={state.loading}
                      label={state.evidence ? copy.reloadEvidence : copy.loadEvidence}
                      loading={state.loading}
                      onPress={() => void loadEvidence(scope)}
                      variant="secondary"
                    />
                    {state.error ? (
                      <Text accessibilityRole="alert" style={styles.errorText}>
                        {copy.evidenceUnavailable}
                      </Text>
                    ) : null}
                    {state.evidence ? (
                      <TrainerEvidenceView evidence={state.evidence} locale={locale} />
                    ) : null}
                  </View>
                );
              })
            : relationship.scopes.map((scope) => (
                <Text key={scope} style={styles.meta}>
                  • {relationshipCopy.scopeLabels[scope]}
                </Text>
              ))}
        </AppCard>
      ) : null}

      {relationship ? (
        <AppCard>
          <Text style={styles.hint}>{copy.privacy}</Text>
        </AppCard>
      ) : null}
    </SettingsScreenLayout>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    comment: {
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: Spacing.one,
      paddingTop: Spacing.three,
    },
    commentAuthor: { color: colors.textPrimary, flex: 1, fontSize: 13, fontWeight: '700' },
    commentBody: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
    commentInput: { minHeight: 104 },
    commentList: { gap: Spacing.three },
    commentMetaRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
    commentTime: { color: colors.textMuted, fontSize: 11, lineHeight: 16 },
    composer: { gap: Spacing.three },
    errorText: { color: colors.error, fontSize: 13, lineHeight: 19 },
    evidenceBlock: {
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: Spacing.three,
      paddingTop: Spacing.three,
    },
    evidenceTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', lineHeight: 20 },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.three,
      justifyContent: 'space-between',
    },
    hint: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
    meta: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    scopeList: { gap: Spacing.one },
    sectionHeader: { gap: Spacing.one },
  });
