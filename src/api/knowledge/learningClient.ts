import { createApiClient, isApiError, type ApiClient } from '@/api/client';
import { getMobileApiBaseUrl } from '@/api/config';

import {
  KNOWLEDGE_LEARNING_MAX_QUIZ_ITEMS,
  KNOWLEDGE_LEARNING_STATE_LIST_MAX_LIMIT,
  KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
  type KnowledgeLearningApi,
  type KnowledgeQuizAnswer,
} from './learningContracts';
import {
  parseKnowledgeLearningState,
  parseKnowledgeLearningStateList,
  parseKnowledgeQuizSubmissionResult,
} from './learningParsers';

type KnowledgeLearningApiAuth = {
  getAccessToken(): Promise<string | null>;
  refreshAccessToken(): Promise<string | null>;
};

const defaultApiClient = createApiClient({
  baseUrl: getMobileApiBaseUrl(),
  defaultTimeoutMs: 20_000,
  defaultRetry: { attempts: 1, delayMs: 350, factor: 2 },
});

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const assertArticleVersionId = (value: string): string => {
  const normalized = value.trim();
  if (!UUID_PATTERN.test(normalized)) {
    throw new Error('Knowledge article version identifier is invalid.');
  }
  return normalized;
};

const normalizeAnswers = (answers: KnowledgeQuizAnswer[]): KnowledgeQuizAnswer[] => {
  if (answers.length < 1 || answers.length > KNOWLEDGE_LEARNING_MAX_QUIZ_ITEMS) {
    throw new Error('Knowledge quiz submission size is invalid.');
  }
  const normalized = answers.map((answer) => {
    const quizItemId = answer.quizItemId.trim();
    const selectedOptionId = answer.selectedOptionId.trim();
    if (!UUID_PATTERN.test(quizItemId)) {
      throw new Error('Knowledge quiz item identifier is invalid.');
    }
    if (selectedOptionId.length < 1 || selectedOptionId.length > 16) {
      throw new Error('Knowledge quiz option identifier is invalid.');
    }
    return { quizItemId, selectedOptionId };
  });
  if (new Set(normalized.map((answer) => answer.quizItemId)).size !== normalized.length) {
    throw new Error('Knowledge quiz item identifiers must be unique.');
  }
  return normalized;
};

export const createKnowledgeLearningApi = (
  auth: KnowledgeLearningApiAuth,
  apiClient: ApiClient = defaultApiClient,
): KnowledgeLearningApi => {
  const requestWithAuth = async <T>(
    request: (accessToken: string) => Promise<T>,
  ): Promise<T> => {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) throw new Error('Sign in is required to use Knowledge learning state.');
    try {
      return await request(accessToken);
    } catch (error) {
      if (!isApiError(error) || error.status !== 401) throw error;
      const refreshedToken = await auth.refreshAccessToken();
      if (!refreshedToken) {
        throw new Error('Your session expired. Sign in again to continue.');
      }
      return request(refreshedToken);
    }
  };

  return {
    listStates: async (input = {}) => {
      const limit = input.limit;
      if (
        limit !== undefined &&
        (!Number.isInteger(limit) || limit < 1 || limit > KNOWLEDGE_LEARNING_STATE_LIST_MAX_LIMIT)
      ) {
        throw new Error('Knowledge learning state limit is invalid.');
      }
      const suffix = limit === undefined ? '' : `?limit=${limit}`;
      return requestWithAuth(async (accessToken) =>
        parseKnowledgeLearningStateList(
          await apiClient.get<unknown>(`/v1/knowledge/learning-states${suffix}`, {
            headers: { authorization: `Bearer ${accessToken}` },
          }),
        ),
      );
    },
    getState: async ({ articleVersionId }) => {
      const id = assertArticleVersionId(articleVersionId);
      return requestWithAuth(async (accessToken) =>
        parseKnowledgeLearningState(
          await apiClient.get<unknown>(
            `/v1/knowledge/article-versions/${encodeURIComponent(id)}/learning-state`,
            { headers: { authorization: `Bearer ${accessToken}` } },
          ),
        ),
      );
    },
    markRead: async ({ articleVersionId }) => {
      const id = assertArticleVersionId(articleVersionId);
      return requestWithAuth(async (accessToken) =>
        parseKnowledgeLearningState(
          await apiClient.post<unknown, { schemaVersion: string }>(
            `/v1/knowledge/article-versions/${encodeURIComponent(id)}/learning-state/read`,
            { schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION },
            { headers: { authorization: `Bearer ${accessToken}` }, retry: false },
          ),
        ),
      );
    },
    evaluateQuiz: async ({ articleVersionId, answers }) => {
      const id = assertArticleVersionId(articleVersionId);
      const normalizedAnswers = normalizeAnswers(answers);
      return requestWithAuth(async (accessToken) =>
        parseKnowledgeQuizSubmissionResult(
          await apiClient.post<unknown, { schemaVersion: string; answers: KnowledgeQuizAnswer[] }>(
            `/v1/knowledge/article-versions/${encodeURIComponent(id)}/quiz/evaluate`,
            {
              schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
              answers: normalizedAnswers,
            },
            { headers: { authorization: `Bearer ${accessToken}` }, retry: false },
          ),
        ),
      );
    },
  };
};
