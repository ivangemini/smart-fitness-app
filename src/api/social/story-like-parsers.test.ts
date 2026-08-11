import { describe, expect, it } from 'vitest';

import {
  parseSocialStoryLikeStateResponse,
  parseSocialStoryLikeSummaryResponse,
} from './story-like-parsers';

const STORY_ID = '11111111-1111-4111-8111-111111111111';

describe('Social Story Like response parsers', () => {
  it('parses viewer state without accepting aggregate or identity fields', () => {
    expect(
      parseSocialStoryLikeStateResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        liked: true,
      }),
    ).toEqual({ schemaVersion: 1, storyId: STORY_ID, liked: true });

    for (const extra of [
      { likeCount: 4 },
      { userId: '22222222-2222-4222-8222-222222222222' },
      { likerIds: [] },
    ]) {
      expect(() =>
        parseSocialStoryLikeStateResponse({
          schemaVersion: 1,
          storyId: STORY_ID,
          liked: true,
          ...extra,
        }),
      ).toThrow(/Story Like state/u);
    }
  });

  it('parses owner aggregate without accepting viewer or liker identity fields', () => {
    expect(
      parseSocialStoryLikeSummaryResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        likeCount: 7,
      }),
    ).toEqual({ schemaVersion: 1, storyId: STORY_ID, likeCount: 7 });

    for (const value of [
      { schemaVersion: 1, storyId: STORY_ID, likeCount: -1 },
      { schemaVersion: 1, storyId: STORY_ID, likeCount: 1.5 },
      { schemaVersion: 1, storyId: STORY_ID, likeCount: 1, liked: true },
      { schemaVersion: 1, storyId: STORY_ID, likeCount: 1, likerIds: [] },
    ]) {
      expect(() => parseSocialStoryLikeSummaryResponse(value)).toThrow(
        /Story Like summary/u,
      );
    }
  });

  it('rejects malformed Story identifiers and schema versions', () => {
    expect(() =>
      parseSocialStoryLikeStateResponse({
        schemaVersion: 2,
        storyId: STORY_ID,
        liked: false,
      }),
    ).toThrow(/Story Like state/u);
    expect(() =>
      parseSocialStoryLikeSummaryResponse({
        schemaVersion: 1,
        storyId: 'not-a-uuid',
        likeCount: 0,
      }),
    ).toThrow(/Story Like summary/u);
  });
});
