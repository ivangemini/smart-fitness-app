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

describe('Social Story Like API', () => {
  it('uses separate viewer state and mutation subresources', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce({ schemaVersion: 1, storyId: STORY_ID, liked: false })
      .mockResolvedValueOnce({ schemaVersion: 1, storyId: STORY_ID, liked: true })
      .mockResolvedValueOnce({ schemaVersion: 1, storyId: STORY_ID, liked: false });
    const api = createSocialApi(createAuth(), createClient(request));

    await expect(api.getStoryLike(` ${STORY_ID} `)).resolves.toMatchObject({
      liked: false,
    });
    await expect(api.likeStory(STORY_ID)).resolves.toMatchObject({ liked: true });
    await expect(api.unlikeStory(STORY_ID)).resolves.toMatchObject({ liked: false });

    for (const [index, method] of ['GET', 'PUT', 'DELETE'].entries()) {
      expect(request).toHaveBeenNthCalledWith(index + 1, {
        method,
        path: `/v1/social/stories/${STORY_ID}/like`,
        headers: { authorization: 'Bearer access-token' },
        retry: false,
      });
    }
  });

  it('uses a distinct owner-only aggregate subresource', async () => {
    const request = vi.fn().mockResolvedValue({
      schemaVersion: 1,
      storyId: STORY_ID,
      likeCount: 3,
    });
    const api = createSocialApi(createAuth(), createClient(request));

    await expect(api.getStoryLikeSummary(STORY_ID)).resolves.toEqual({
      schemaVersion: 1,
      storyId: STORY_ID,
      likeCount: 3,
    });
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      path: `/v1/social/stories/${STORY_ID}/like-summary`,
      headers: { authorization: 'Bearer access-token' },
      retry: false,
    });
  });

  it('rejects an empty Story id before making any request', async () => {
    const request = vi.fn();
    const api = createSocialApi(createAuth(), createClient(request));

    await expect(api.getStoryLike('   ')).rejects.toThrow(/Story ID/u);
    await expect(api.getStoryLikeSummary('   ')).rejects.toThrow(/Story ID/u);
    expect(request).not.toHaveBeenCalled();
  });
});
