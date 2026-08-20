import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

export const useKnowledgeLearningState = (articleVersionId: string | null) => {
  const api = useKnowledgeLearningApi();
  const { user } = useAuthSession();
  const userId = user?.id ?? null;
  const [learningState, setLearningState] = useState<KnowledgeLearningState | null>(null);
  const [pendingRead, setPendingRead] = useState(false);
  const [loading, setLoading] = useState(Boolean(userId && articleVersionId));
  const [markingRead, setMarkingRead] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [syncIssue, setSyncIssue] = useState(false);
  const [quizIssue, setQuizIssue] = useState(false);
  const [reloadRevision, setReloadRevision] = useState(0);

  const refresh = useCallback(() => setReloadRevision((value) => value + 1), []);

  useEffect(() => {
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

    const updateFromSnapshot = async () => {
      const snapshot = await learningStore.read(currentUserId);
      if (cancelled) return;
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
        if (cancelled) return;
        if (operation.attempts >= KNOWLEDGE_LEARNING_MAX_RETRY_ATTEMPTS) {
          await learningStore.removeRead(currentUserId, operation.operationId);
          if (!cancelled) setSyncIssue(true);
          continue;
        }

        try {
          const confirmed = await api.markRead({
            articleVersionId: operation.articleVersionId,
          });
          await learningStore.mergeState(currentUserId, confirmed);
          await learningStore.removeRead(currentUserId, operation.operationId);
          if (!cancelled && confirmed.articleVersionId === currentArticleVersionId) {
            setLearningState(confirmed);
            setPendingRead(false);
          }
        } catch (error) {
          if (!isRetryableWriteError(error)) {
            await learningStore.removeRead(currentUserId, operation.operationId);
            if (!cancelled) setSyncIssue(true);
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
          if (!cancelled) setSyncIssue(true);
          break;
        }
      }
      await updateFromSnapshot();
    };

    const load = async () => {
      setLoading(true);
      setSyncIssue(false);
      await updateFromSnapshot();
      if (cancelled) return;

      try {
        const remote = await api.getState({
          articleVersionId: currentArticleVersionId,
        });
        await learningStore.mergeState(currentUserId, remote);
        if (!cancelled) setLearningState(remote);
      } catch {
        if (!cancelled) setSyncIssue(true);
      }

      await flushPendingReads();
      if (!cancelled) setLoading(false);
    };

    void load().catch(() => {
      if (!cancelled) {
        setSyncIssue(true);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [api, articleVersionId, reloadRevision, userId]);

  const markRead = useCallback(async () => {
    if (!userId || !articleVersionId || markingRead || pendingRead) return;
    setMarkingRead(true);
    setSyncIssue(false);

    try {
      const confirmed = await api.markRead({ articleVersionId });
      await learningStore.mergeState(userId, confirmed);
      setLearningState(confirmed);
      setPendingRead(false);
    } catch (error) {
      if (isRetryableWriteError(error)) {
        await learningStore.enqueueRead(userId, {
          operationId: createReadOperationId(articleVersionId),
          articleVersionId,
          createdAt: new Date().toISOString(),
        });
        setPendingRead(true);
      } else {
        setSyncIssue(true);
      }
    } finally {
      setMarkingRead(false);
    }
  }, [api, articleVersionId, markingRead, pendingRead, userId]);

  const evaluateQuiz = useCallback(
    async (answers: KnowledgeQuizAnswer[]): Promise<KnowledgeQuizSubmissionResult | null> => {
      if (!userId || !articleVersionId || submittingQuiz) return null;
      setSubmittingQuiz(true);
      setQuizIssue(false);
      try {
        const result = await api.evaluateQuiz({ articleVersionId, answers });
        await learningStore.mergeState(userId, result.learningState);
        setLearningState(result.learningState);
        return result;
      } catch {
        setQuizIssue(true);
        return null;
      } finally {
        setSubmittingQuiz(false);
      }
    },
    [api, articleVersionId, submittingQuiz, userId],
  );

  return useMemo(
    () => ({
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
    }),
    [
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
    ],
  );
};
