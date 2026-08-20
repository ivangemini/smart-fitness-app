import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { isApiError } from '@/api/client';
import type {
  KnowledgeLearningState,
  KnowledgeQuizAnswer,
  KnowledgeQuizSubmissionResult,
} from '@/api/knowledge/learningContracts';
import { useAuthSession } from '@/hooks/useAuthSession';

import {
  createKnowledgeLearningStore,
  KNOWLEDGE_LEARNING_MAX_RETRY_ATTEMPTS,
} from './knowledgeLearningStore';
import { useKnowledgeLearningApi } from './useKnowledgeLearningApi';

const learningStore = createKnowledgeLearningStore(AsyncStorage);

const isRetryableWriteError = (error: unknown): boolean => {
  if (!isApiError(error)) return false;
  if (error.retryable) return true;
  if (error.code === 'network_error' || error.code === 'timeout') return true;
  if (error.status === 429) return true;
  return typeof error.status === 'number' && error.status >= 500;
};

const createReadOperationId = (articleVersionId: string): string =>
  `knowledge-read-${articleVersionId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const createIdentityKey = (
  userId: string | null,
  articleVersionId: string | null,
): string => `${userId ?? 'signed-out'}:${articleVersionId ?? 'no-version'}`;

export const useKnowledgeLearningState = (articleVersionId: string | null) => {
  const api = useKnowledgeLearningApi();
  const { user } = useAuthSession();
  const userId = user?.id ?? null;
  const identityKey = createIdentityKey(userId, articleVersionId);
  const activeIdentityRef = useRef(identityKey);
  const viewIdentityRef = useRef(identityKey);
  activeIdentityRef.current = identityKey;

  const [learningState, setLearningState] =
    useState<KnowledgeLearningState | null>(null);
  const [pendingRead, setPendingRead] = useState(false);
  const [loading, setLoading] = useState(Boolean(userId && articleVersionId));
  const [markingRead, setMarkingRead] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [syncIssue, setSyncIssue] = useState(false);
  const [quizIssue, setQuizIssue] = useState(false);
  const [reloadRevision, setReloadRevision] = useState(0);

  const refresh = useCallback(() => setReloadRevision((value) => value + 1), []);

  useEffect(() => {
    const currentIdentityKey = createIdentityKey(userId, articleVersionId);
    if (viewIdentityRef.current !== currentIdentityKey) {
      viewIdentityRef.current = currentIdentityKey;
      setLearningState(null);
      setPendingRead(false);
      setMarkingRead(false);
      setSubmittingQuiz(false);
      setSyncIssue(false);
      setQuizIssue(false);
    }

    if (!userId || !articleVersionId) {
      setLearningState(null);
      setPendingRead(false);
      setLoading(false);
      setSyncIssue(false);
      setQuizIssue(false);
      return;
    }

    let cancelled = false;
    const currentUserId = userId;
    const currentArticleVersionId = articleVersionId;
    const isCurrentIdentity = () =>
      !cancelled && activeIdentityRef.current === currentIdentityKey;

    const updateFromSnapshot = async () => {
      const snapshot = await learningStore.read(currentUserId);
      if (!isCurrentIdentity()) return;
      setLearningState(
        snapshot.states.find(
          (state) => state.articleVersionId === currentArticleVersionId,
        ) ?? null,
      );
      setPendingRead(
        snapshot.pendingReads.some(
          (operation) => operation.articleVersionId === currentArticleVersionId,
        ),
      );
    };

    const flushPendingReads = async () => {
      const snapshot = await learningStore.read(currentUserId);
      for (const operation of snapshot.pendingReads) {
        if (!isCurrentIdentity()) return;
        if (operation.attempts >= KNOWLEDGE_LEARNING_MAX_RETRY_ATTEMPTS) {
          await learningStore.removeRead(currentUserId, operation.operationId);
          if (isCurrentIdentity()) setSyncIssue(true);
          continue;
        }

        try {
          const confirmed = await api.markRead({
            articleVersionId: operation.articleVersionId,
          });
          await learningStore.mergeState(currentUserId, confirmed);
          await learningStore.removeRead(currentUserId, operation.operationId);
          if (
            isCurrentIdentity() &&
            confirmed.articleVersionId === currentArticleVersionId
          ) {
            setLearningState(confirmed);
            setPendingRead(false);
          }
        } catch (error) {
          if (!isRetryableWriteError(error)) {
            await learningStore.removeRead(currentUserId, operation.operationId);
            if (isCurrentIdentity()) setSyncIssue(true);
            continue;
          }

          if (operation.attempts + 1 >= KNOWLEDGE_LEARNING_MAX_RETRY_ATTEMPTS) {
            await learningStore.removeRead(currentUserId, operation.operationId);
          } else {
            await learningStore.incrementReadAttempt(
              currentUserId,
              operation.operationId,
            );
          }
          if (isCurrentIdentity()) setSyncIssue(true);
          break;
        }
      }
      await updateFromSnapshot();
    };

    const load = async () => {
      setLoading(true);
      setSyncIssue(false);
      await updateFromSnapshot();
      if (!isCurrentIdentity()) return;

      try {
        const remote = await api.getState({
          articleVersionId: currentArticleVersionId,
        });
        await learningStore.mergeState(currentUserId, remote);
        if (isCurrentIdentity()) setLearningState(remote);
      } catch {
        if (isCurrentIdentity()) setSyncIssue(true);
      }

      await flushPendingReads();
      if (isCurrentIdentity()) setLoading(false);
    };

    void load().catch(() => {
      if (isCurrentIdentity()) {
        setSyncIssue(true);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [api, articleVersionId, reloadRevision, userId]);

  const markRead = useCallback(async () => {
    if (
      !userId ||
      !articleVersionId ||
      markingRead ||
      pendingRead ||
      activeIdentityRef.current !== identityKey ||
      viewIdentityRef.current !== identityKey
    ) {
      return;
    }
    const operationIdentity = identityKey;
    const operationUserId = userId;
    const operationArticleVersionId = articleVersionId;
    const isCurrentIdentity = () =>
      activeIdentityRef.current === operationIdentity;

    setMarkingRead(true);
    setSyncIssue(false);

    try {
      const confirmed = await api.markRead({
        articleVersionId: operationArticleVersionId,
      });
      await learningStore.mergeState(operationUserId, confirmed);
      if (isCurrentIdentity()) {
        setLearningState(confirmed);
        setPendingRead(false);
      }
    } catch (error) {
      if (isRetryableWriteError(error)) {
        await learningStore.enqueueRead(operationUserId, {
          operationId: createReadOperationId(operationArticleVersionId),
          articleVersionId: operationArticleVersionId,
          createdAt: new Date().toISOString(),
        });
        if (isCurrentIdentity()) setPendingRead(true);
      } else if (isCurrentIdentity()) {
        setSyncIssue(true);
      }
    } finally {
      if (isCurrentIdentity()) setMarkingRead(false);
    }
  }, [
    api,
    articleVersionId,
    identityKey,
    markingRead,
    pendingRead,
    userId,
  ]);

  const evaluateQuiz = useCallback(
    async (
      answers: KnowledgeQuizAnswer[],
    ): Promise<KnowledgeQuizSubmissionResult | null> => {
      if (
        !userId ||
        !articleVersionId ||
        submittingQuiz ||
        activeIdentityRef.current !== identityKey ||
        viewIdentityRef.current !== identityKey
      ) {
        return null;
      }
      const operationIdentity = identityKey;
      const operationUserId = userId;
      const operationArticleVersionId = articleVersionId;
      const isCurrentIdentity = () =>
        activeIdentityRef.current === operationIdentity;

      setSubmittingQuiz(true);
      setQuizIssue(false);
      try {
        const result = await api.evaluateQuiz({
          articleVersionId: operationArticleVersionId,
          answers,
        });
        await learningStore.mergeState(operationUserId, result.learningState);
        if (isCurrentIdentity()) setLearningState(result.learningState);
        return isCurrentIdentity() ? result : null;
      } catch {
        if (isCurrentIdentity()) setQuizIssue(true);
        return null;
      } finally {
        if (isCurrentIdentity()) setSubmittingQuiz(false);
      }
    },
    [api, articleVersionId, identityKey, submittingQuiz, userId],
  );

  const viewIsCurrent = viewIdentityRef.current === identityKey;

  return useMemo(
    () => ({
      evaluateQuiz,
      learningState: viewIsCurrent ? learningState : null,
      loading:
        viewIsCurrent ? loading : Boolean(userId && articleVersionId),
      markRead,
      markingRead: viewIsCurrent ? markingRead : false,
      pendingRead: viewIsCurrent ? pendingRead : false,
      quizIssue: viewIsCurrent ? quizIssue : false,
      refresh,
      submittingQuiz: viewIsCurrent ? submittingQuiz : false,
      syncIssue: viewIsCurrent ? syncIssue : false,
    }),
    [
      articleVersionId,
      evaluateQuiz,
      learningState,
      loading,
      markRead,
      markingRead,
      pendingRead,
      quizIssue,
      refresh,
      submittingQuiz,
      syncIssue,
      userId,
      viewIsCurrent,
    ],
  );
};
