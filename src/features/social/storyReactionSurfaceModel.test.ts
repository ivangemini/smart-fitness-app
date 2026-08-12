import { describe, expect, it, vi } from 'vitest';

import {
  getSocialStoryReactionSurfaceMode,
  loadSocialStoryReactionSurface,
} from './storyReactionSurfaceModel';

const STORY_ID = '11111111-1111-4111-8111-111111111111';

describe('Story Reaction privacy surface model', () => {
  it('selects a surface only when current ownership is known', () => {
    expect(getSocialStoryReactionSurfaceMode('owner', 'owner')).toBe(
      'owner_summary',
    );
    expect(getSocialStoryReactionSurfaceMode('viewer', 'owner')).toBe(
      'viewer_state',
    );
    expect(getSocialStoryReactionSurfaceMode(null, 'owner')).toBeNull();
    expect(getSocialStoryReactionSurfaceMode('   ', 'owner')).toBeNull();
  });

  it('never loads viewer reaction state for the Story owner', async () => {
    const getStoryReaction = vi.fn();
    const getStoryReactionSummary = vi.fn().mockResolvedValue({
      schemaVersion: 1,
      storyId: STORY_ID,
      counts: { love: 1, fire: 2, strong: 0, clap: 1 },
      totalCount: 4,
    });

    await expect(
      loadSocialStoryReactionSurface('owner_summary', STORY_ID, {
        getStoryReaction,
        getStoryReactionSummary,
      }),
    ).resolves.toMatchObject({
      mode: 'owner_summary',
      summary: { totalCount: 4 },
    });
    expect(getStoryReaction).not.toHaveBeenCalled();
    expect(getStoryReactionSummary).toHaveBeenCalledOnce();
  });

  it('never loads owner aggregate for a non-owner viewer', async () => {
    const getStoryReaction = vi.fn().mockResolvedValue({
      schemaVersion: 1,
      storyId: STORY_ID,
      reaction: 'fire',
    });
    const getStoryReactionSummary = vi.fn();

    await expect(
      loadSocialStoryReactionSurface('viewer_state', STORY_ID, {
        getStoryReaction,
        getStoryReactionSummary,
      }),
    ).resolves.toMatchObject({
      mode: 'viewer_state',
      state: { reaction: 'fire' },
    });
    expect(getStoryReaction).toHaveBeenCalledOnce();
    expect(getStoryReactionSummary).not.toHaveBeenCalled();
  });
});
