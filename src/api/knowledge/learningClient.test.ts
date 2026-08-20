import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';

import {
  createKnowledgeLearningApi,
  KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
} from './index';

const state = {
  schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
  articleId: '11111111-1111-4111-8111-111111111111',
  articleVersionId: '22222222-2222-4222-8222-222222222222',
  locale: 'en',
  version: 1,
  state: 'read',
  evidenceState: 'read',
  readAt: '2026-08-20T08:00:00.000Z',
  understoodAt: null,
  understoodQuizItemIds: [],
  revision: 1,
  contentAvailable: true,
  latestArticleVersionId: '22222222-2222-4222-8222-222222222222',
  latestVersion: 1,
  refreshReason: null,
} as const;

const fakeApiClient = (get: ReturnType<typeof vi.fn>, post: ReturnType<typeof vi.fn>) =>
  ({ get, post } as unknown as ApiClient);

describe('createKnowledgeLearningApi', () => {
  it('uses the authenticated exact-version read endpoint', async () => {
    const get = vi.fn().mockResolvedValue(state);
    const post = vi.fn();
    const api = createKnowledgeLearningApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      fakeApiClient(get, post),
    );

    await expect(
      api.getState({ articleVersionId: state.articleVersionId }),
    ).resolves.toEqual(state);
    expect(get).toHaveBeenCalledWith(
      `/v1/knowledge/article-versions/${state.articleVersionId}/learning-state`,
      { headers: { authorization: 'Bearer access-token' } },
    );
  });

  it('disables generic request retries for explicit read evidence writes', async () => {
    const get = vi.fn();
    const post = vi.fn().mockResolvedValue(state);
    const api = createKnowledgeLearningApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      fakeApiClient(get, post),
    );

    await api.markRead({ articleVersionId: state.articleVersionId });
    expect(post).toHaveBeenCalledWith(
      `/v1/knowledge/article-versions/${state.articleVersionId}/learning-state/read`,
      { schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION },
      { headers: { authorization: 'Bearer access-token' }, retry: false },
    );
  });

  it('rejects duplicate quiz-item answers before transport', async () => {
    const get = vi.fn();
    const post = vi.fn();
    const api = createKnowledgeLearningApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      fakeApiClient(get, post),
    );
    const quizItemId = '33333333-3333-4333-8333-333333333333';

    await expect(
      api.evaluateQuiz({
        articleVersionId: state.articleVersionId,
        answers: [
          { quizItemId, selectedOptionId: 'a' },
          { quizItemId, selectedOptionId: 'b' },
        ],
      }),
    ).rejects.toThrow();
    expect(post).not.toHaveBeenCalled();
  });
});
