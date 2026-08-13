import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';
import { createRemoteLabsRepository } from './RemoteLabsRepository';

describe('RemoteLabsRepository interpretation', () => {
  it('posts to the owner-scoped interpretation endpoint without automatic retry', async () => {
    const post = vi.fn(async () => ({
      interpretation: {
        runId: 'run-1',
        contextVersion: 1,
        output: {
          version: 1 as const,
          provider: 'test',
          model: 'test-model',
          findings: [],
        },
      },
    }));
    const repository = createRemoteLabsRepository(
      { post } as unknown as ApiClient,
      {
        getAccessToken: async () => 'token',
        refreshAccessToken: async () => null,
      },
    );

    await expect(repository.interpretDocument('doc/1')).resolves.toMatchObject({ runId: 'run-1' });
    expect(post).toHaveBeenCalledWith(
      '/v1/labs/documents/doc%2F1/interpretation',
      undefined,
      expect.objectContaining({ retry: false }),
    );
  });
});
