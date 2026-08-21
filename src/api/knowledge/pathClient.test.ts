import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';
import {
  createKnowledgeApi,
  KNOWLEDGE_PATH_SCHEMA_VERSION,
} from './index';

const fakeApiClient = (get: ReturnType<typeof vi.fn>) =>
  ({ get } as unknown as ApiClient);

const summary = {
  schemaVersion: KNOWLEDGE_PATH_SCHEMA_VERSION,
  pathId: '11111111-1111-4111-8111-111111111111',
  pathVersionId: '22222222-2222-4222-8222-222222222222',
  slug: 'training-fundamentals',
  locale: 'en',
  version: 1,
  title: 'Training fundamentals',
  summary: 'Reviewed curriculum',
  publishedAt: '2026-08-20T12:00:00.000Z',
  stepCount: 1,
} as const;

describe('Knowledge path client', () => {
  it('uses authenticated bounded path discovery', async () => {
    const get = vi.fn().mockResolvedValue({
      schemaVersion: KNOWLEDGE_PATH_SCHEMA_VERSION,
      paths: [summary],
    });
    const api = createKnowledgeApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      fakeApiClient(get),
    );

    await expect(api.listPaths({ locale: 'en', limit: 20 })).resolves.toEqual({
      schemaVersion: KNOWLEDGE_PATH_SCHEMA_VERSION,
      paths: [summary],
    });
    expect(get).toHaveBeenCalledWith('/v1/knowledge/paths?locale=en&limit=20', {
      headers: { authorization: 'Bearer access-token' },
    });
  });

  it('rejects invalid path identifiers and oversized limits before network access', async () => {
    const get = vi.fn();
    const api = createKnowledgeApi(
      {
        getAccessToken: async () => 'access-token',
        refreshAccessToken: async () => null,
      },
      fakeApiClient(get),
    );

    await expect(api.getPath({ slug: '../bad', locale: 'en' })).rejects.toThrow();
    await expect(api.listPaths({ locale: 'en', limit: 101 })).rejects.toThrow();
    expect(get).not.toHaveBeenCalled();
  });
});
