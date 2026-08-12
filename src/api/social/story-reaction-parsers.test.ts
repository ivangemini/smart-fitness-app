import { describe, expect, it } from 'vitest';

import {
  parseSocialStoryReactionStateResponse,
  parseSocialStoryReactionSummaryResponse,
} from './story-reaction-parsers';

const STORY_ID = '11111111-1111-4111-8111-111111111111';

describe('Social Story Reaction response parsers', () => {
  it('parses only the bounded viewer reaction state', () => {
    for (const reaction of ['love', 'fire', 'strong', 'clap', null]) {
      expect(
        parseSocialStoryReactionStateResponse({
          schemaVersion: 1,
          storyId: STORY_ID,
          reaction,
        }),
      ).toEqual({ schemaVersion: 1, storyId: STORY_ID, reaction });
    }

    for (const value of [
      { schemaVersion: 1, storyId: STORY_ID, reaction: 'unknown' },
      { schemaVersion: 1, storyId: STORY_ID, reaction: 'love', userId: STORY_ID },
      { schemaVersion: 2, storyId: STORY_ID, reaction: null },
    ]) {
      expect(() => parseSocialStoryReactionStateResponse(value)).toThrow(
        /Story Reaction state/u,
      );
    }
  });

  it('parses an identity-free owner aggregate with an exact total', () => {
    expect(
      parseSocialStoryReactionSummaryResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        counts: { love: 2, fire: 1, strong: 3, clap: 4 },
        totalCount: 10,
      }),
    ).toEqual({
      schemaVersion: 1,
      storyId: STORY_ID,
      counts: { love: 2, fire: 1, strong: 3, clap: 4 },
      totalCount: 10,
    });

    for (const value of [
      {
        schemaVersion: 1,
        storyId: STORY_ID,
        counts: { love: 1, fire: 0, strong: 0, clap: 0 },
        totalCount: 2,
      },
      {
        schemaVersion: 1,
        storyId: STORY_ID,
        counts: { love: -1, fire: 0, strong: 0, clap: 0 },
        totalCount: 0,
      },
      {
        schemaVersion: 1,
        storyId: STORY_ID,
        counts: { love: 0, fire: 0, strong: 0, clap: 0, wow: 1 },
        totalCount: 0,
      },
      {
        schemaVersion: 1,
        storyId: STORY_ID,
        counts: { love: 0, fire: 0, strong: 0, clap: 0 },
        totalCount: 0,
        reactors: [],
      },
    ]) {
      expect(() => parseSocialStoryReactionSummaryResponse(value)).toThrow(
        /Story Reaction summary/u,
      );
    }
  });

  it('rejects malformed Story ids', () => {
    expect(() =>
      parseSocialStoryReactionStateResponse({
        schemaVersion: 1,
        storyId: 'not-a-uuid',
        reaction: null,
      }),
    ).toThrow(/Story Reaction state/u);
  });
});
