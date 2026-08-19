import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';

import { createKnowledgeApi, KNOWLEDGE_SCHEMA_VERSION } from './index';

const summary = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  articleId: '11111111-1111-4111-8111-111111111111',
  articleVersionId: '22222222-2222-4222-8222-222222222222',
  slug: 'rir-basics',
  locale: 'en',
  version: 1,
  primaryConceptId: 'rir',
  conceptIds: ['rir'],
  category: 'training',
  format: 'quick_lesson',
  riskTier: 'tier_1',
  title: 'RIR basics',
  summary: 'Understand repetitions in reserve.',
  publishedAt: '2026-08-19T11:00:00.000Z',
} as const;

const fakeApiClient = (get: ReturnType<typeof vi.fn>) =>
  ({ get } as unknown as ApiClient);

describe('createKnowledgeApi', () => {
  it('sends bounded discovery filters through the authenticated shared API client', async () => {
    const get = vi.fn().mockResolvedValue({ articles: [summary] });
    const api = createKnowledgeApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      fakeApiClient(get),
    );

    await expect(
      api.listArticles({
        locale: 'en',
        category: 'training',
        conceptId: 'rir',
        query: '  reps in reserve  ',
        limit: 20,
      }),
    ).resolves.toEqual({ articles: [summary] });

    expect(get).toHaveBeenCalledWith(
      '/v1/knowledge/articles?locale=en&category=training&conceptId=rir&query=reps%20in%20reserve&limit=20',
      { headers: { authorization: 'Bearer access-token' } },
    );
  });

  it('rejects oversized search before making a network request', async () => {
    const get = vi.fn();
    const api = createKnowledgeApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      fakeApiClient(get),
    );

    await expect(
      api.listArticles({ locale: 'en', query: 'x'.repeat(81) }),
    ).rejects.toThrow();
    expect(get).not.toHaveBeenCalled();
  });
});
