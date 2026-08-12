import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';

import { createSocialApi } from './combined-api';

const STORY_ID = '11111111-1111-4111-8111-111111111111';

const createAuth = () => ({
  getAccessToken: vi.fn().mockResolvedValue('access-token'),
  refreshAccessToken: vi.fn().mockResolvedValue('refreshed-token'),
});

const createClient = (request: ReturnType<typeof vi.fn>): ApiClient =>
  ({ request }) as unknown as ApiClient;

describe('Social Story Reaction API', () => {
  it('uses separate viewer state and set/clear subresources', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce({
        schemaVersion: 1,
        storyId: STORY_ID,
        reaction: null,
      })
      .mockResolvedValueOnce({
        schemaVersion: 1,
        storyId: STORY_ID,
        reaction: 'fire',
      })
      .mockResolvedValueOnce({
        schemaVersion: 1,
        storyId: STORY_ID,
        reaction: null,
      });
    const api = createSocialApi(createAuth(), createClient(request));

    await expect(api.getStoryReaction(` ${STORY_ID} `)).resolves.toMatchObject({
      reaction: null,
    });
    await expect(api.setStoryReaction(STORY_ID, 'fire')).resolves.toMatchObject({
      reaction: 'fire',
    });
    await expect(api.clearStoryReaction(STORY_ID)).resolves.toMatchObject({
      reaction: null,
    });

    expect(request).toHaveBeenNthCalledWith(1, {
      method: 'GET',
      path: `/v1/social/stories/${STORY_ID}/reaction`,
      headers: { authorization: 'Bearer access-token' },
      retry: false,
    });
    expect(request).toHaveBeenNthCalledWith(2, {
      method: 'PUT',
      path: `/v1/social/stories/${STORY_ID}/reaction`,
      body: { reaction: 'fire' },
      headers: { authorization: 'Bearer access-token' },
      retry: false,
    });
    expect(request).toHaveBeenNthCalledWith(3, {
      method: 'DELETE',
      path: `/v1/social/stories/${STORY_ID}/reaction`,
      headers: { authorization: 'Bearer access-token' },
      retry: false,
    });
  });

  it('uses a distinct owner-only aggregate subresource', async () => {
    const request = vi.fn().mockResolvedValue({
      schemaVersion: 1,
      storyId: STORY_ID,
      counts: { love: 1, fire: 2, strong: 3, clap: 4 },
      totalCount: 10,
    });
    const api = createSocialApi(createAuth(), createClient(request));

    await expect(api.getStoryReactionSummary(STORY_ID)).resolves.toMatchObject({
      totalCount: 10,
    });
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      path: `/v1/social/stories/${STORY_ID}/reaction-summary`,
      headers: { authorization: 'Bearer access-token' },
      retry: false,
    });
  });

  it('rejects empty Story ids before making a request', async () => {
    const request = vi.fn();
    const api = createSocialApi(createAuth(), createClient(request));

    await expect(api.getStoryReaction('   ')).rejects.toThrow(/Story ID/u);
    await expect(api.getStoryReactionSummary('   ')).rejects.toThrow(/Story ID/u);
    expect(request).not.toHaveBeenCalled();
  });
});
