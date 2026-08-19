import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';

import { createCoachApi } from './client';
import { COACH_QUESTION_ANSWER_SCHEMA_VERSION } from './questions';

const response = {
  schemaVersion: 1,
  status: 'answered',
  intent: 'goal_progress',
  scopes: ['goal'],
  answer: {
    schemaVersion: COACH_QUESTION_ANSWER_SCHEMA_VERSION,
    answer: 'Recorded goal context is available.',
    evidenceScopes: ['goal'],
    evidenceSummary: ['Goal evidence available.'],
    caveatCodes: [],
    dataQuality: 'sufficient',
    confidence: 0.8,
  },
} as const;

const createApiClient = () => {
  const post = vi.fn(async () => response);
  return {
    apiClient: { post } as unknown as ApiClient,
    post,
  };
};

describe('Coach question API client', () => {
  it('posts only the trimmed question with bearer auth and no automatic retry', async () => {
    const { apiClient, post } = createApiClient();
    const coachApi = createCoachApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      apiClient,
    );

    await expect(coachApi.askQuestion('  How am I doing on my goal?  ')).resolves.toEqual(
      response,
    );
    expect(post).toHaveBeenCalledWith(
      '/v1/coach/questions',
      { question: 'How am I doing on my goal?' },
      {
        headers: { authorization: 'Bearer access-token' },
        retry: false,
      },
    );
  });

  it('rejects empty or overlong questions before making a request', async () => {
    const { apiClient, post } = createApiClient();
    const coachApi = createCoachApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      apiClient,
    );

    await expect(coachApi.askQuestion('   ')).rejects.toThrow();
    await expect(coachApi.askQuestion('x'.repeat(601))).rejects.toThrow();
    expect(post).not.toHaveBeenCalled();
  });
});
