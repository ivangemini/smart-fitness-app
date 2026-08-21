import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';

import { createCoachApi } from './client';
import { COACH_LEARN_SCHEMA_VERSION } from './learn';

const RUN_ID = '11111111-1111-4111-8111-111111111111';
const USER_ID = '22222222-2222-4222-8222-222222222222';
const ARTICLE_ID = '33333333-3333-4333-8333-333333333333';
const ARTICLE_VERSION_ID = '44444444-4444-4444-8444-444444444444';

const baseRunEnvelope = () => ({
  run: {
    id: RUN_ID,
    userId: USER_ID,
    domain: 'combined',
    requestType: 'combined_review',
    status: 'completed',
    idempotencyKey: null,
    requestData: {},
    contextSnapshot: {},
    result: {},
    error: null,
    policyVersions: {},
    requestedAt: '2026-08-20T12:00:00.000Z',
    startedAt: '2026-08-20T12:00:01.000Z',
    completedAt: '2026-08-20T12:00:02.000Z',
    createdAt: '2026-08-20T12:00:00.000Z',
    updatedAt: '2026-08-20T12:00:02.000Z',
  },
  agentRuns: [],
});

const validLearn = () => ({
  schemaVersion: COACH_LEARN_SCHEMA_VERSION,
  recommendations: [
    {
      schemaVersion: COACH_LEARN_SCHEMA_VERSION,
      article: {
        schemaVersion: 'knowledge-v1',
        articleId: ARTICLE_ID,
        articleVersionId: ARTICLE_VERSION_ID,
        slug: 'training-basics',
        locale: 'en',
        version: 1,
        primaryConceptId: 'training_basics',
        conceptIds: ['training_basics'],
        category: 'training',
        format: 'quick_lesson',
        riskTier: 'tier_1',
        title: 'Training basics',
        summary: 'Reviewed educational summary.',
        publishedAt: '2026-08-20T11:00:00.000Z',
      },
      reasonFindingCodes: ['combined_training_modification_required'],
    },
  ],
});

const createClient = (response: unknown) => {
  const get = vi.fn(async () => response);
  const apiClient = { get } as unknown as ApiClient;
  return {
    get,
    coachApi: createCoachApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      apiClient,
    ),
  };
};

describe('Coach Learn detail parsing', () => {
  it('preserves a valid optional Learn selection on GET run detail', async () => {
    const response = { ...baseRunEnvelope(), learn: validLearn() };
    const { coachApi, get } = createClient(response);

    await expect(coachApi.getRun(RUN_ID)).resolves.toMatchObject({
      run: { id: RUN_ID },
      learn: validLearn(),
    });
    expect(get).toHaveBeenCalledWith(`/v1/coach/runs/${RUN_ID}`, {
      headers: { authorization: 'Bearer access-token' },
    });
  });

  it('ignores malformed Learn data without failing the underlying Coach run', async () => {
    const response = {
      ...baseRunEnvelope(),
      learn: {
        ...validLearn(),
        recommendations: [
          {
            ...validLearn().recommendations[0],
            reasonFindingCodes: ['free-form model prose'],
          },
        ],
      },
    };
    const { coachApi } = createClient(response);

    await expect(coachApi.getRun(RUN_ID)).resolves.toMatchObject({
      run: { id: RUN_ID, status: 'completed' },
      agentRuns: [],
      learnValidationFailed: true,
    });
  });
});
