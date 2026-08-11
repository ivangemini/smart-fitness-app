import { describe, expect, it, vi } from 'vitest';

import {
  getSocialStoryLikeSurfaceMode,
  loadSocialStoryLikeSurface,
} from './storyLikeSurfaceModel';

const STORY_ID = '11111111-1111-4111-8111-111111111111';

describe('Story Like privacy surface model', () => {
  it('selects a surface only when current ownership is known', () => {
    expect(getSocialStoryLikeSurfaceMode('owner', 'owner')).toBe(
      'owner_summary',
    );
    expect(getSocialStoryLikeSurfaceMode('viewer', 'owner')).toBe(
      'viewer_state',
    );
    expect(getSocialStoryLikeSurfaceMode(null, 'owner')).toBeNull();
    expect(getSocialStoryLikeSurfaceMode('   ', 'owner')).toBeNull();
  });

  it('never loads viewer Like state for the Story owner', async () => {
    const getStoryLike = vi.fn();
    const getStoryLikeSummary = vi.fn().mockResolvedValue({
      schemaVersion: 1,
      storyId: STORY_ID,
      likeCount: 4,
    });

    await expect(
      loadSocialStoryLikeSurface('owner_summary', STORY_ID, {
        getStoryLike,
        getStoryLikeSummary,
      }),
    ).resolves.toMatchObject({ mode: 'owner_summary', summary: { likeCount: 4 } });
    expect(getStoryLike).not.toHaveBeenCalled();
    expect(getStoryLikeSummary).toHaveBeenCalledOnce();
  });

  it('never loads owner aggregate for a non-owner viewer', async () => {
    const getStoryLike = vi.fn().mockResolvedValue({
      schemaVersion: 1,
      storyId: STORY_ID,
      liked: true,
    });
    const getStoryLikeSummary = vi.fn();

    await expect(
      loadSocialStoryLikeSurface('viewer_state', STORY_ID, {
        getStoryLike,
        getStoryLikeSummary,
      }),
    ).resolves.toMatchObject({ mode: 'viewer_state', state: { liked: true } });
    expect(getStoryLike).toHaveBeenCalledOnce();
    expect(getStoryLikeSummary).not.toHaveBeenCalled();
  });
});
