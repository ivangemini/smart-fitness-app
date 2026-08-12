import {
  SOCIAL_STORY_REACTION_SCHEMA_VERSION,
  SOCIAL_STORY_REACTION_TYPES,
  type SocialStoryReactionCountsDto,
  type SocialStoryReactionStateDto,
  type SocialStoryReactionSummaryDto,
  type SocialStoryReactionType,
} from './story-reaction-contracts';

const STATE_KEYS = ['schemaVersion', 'storyId', 'reaction'] as const;
const SUMMARY_KEYS = ['schemaVersion', 'storyId', 'counts', 'totalCount'] as const;
const COUNT_KEYS = SOCIAL_STORY_REACTION_TYPES;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean => {
  const actual = Object.keys(value);
  return (
    actual.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
};

const isStoryId = (value: unknown): value is string =>
  typeof value === 'string' && UUID_PATTERN.test(value);

export const isSocialStoryReactionType = (
  value: unknown,
): value is SocialStoryReactionType =>
  typeof value === 'string' &&
  (SOCIAL_STORY_REACTION_TYPES as readonly string[]).includes(value);

const parseCount = (value: unknown): number => {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new Error('Invalid Social Story Reaction summary response');
  }
  return value;
};

const parseCounts = (value: unknown): SocialStoryReactionCountsDto => {
  if (!isRecord(value) || !hasExactKeys(value, COUNT_KEYS)) {
    throw new Error('Invalid Social Story Reaction summary response');
  }
  return {
    love: parseCount(value.love),
    fire: parseCount(value.fire),
    strong: parseCount(value.strong),
    clap: parseCount(value.clap),
  };
};

export const parseSocialStoryReactionStateResponse = (
  value: unknown,
): SocialStoryReactionStateDto => {
  if (!isRecord(value) || !hasExactKeys(value, STATE_KEYS)) {
    throw new Error('Invalid Social Story Reaction state response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_REACTION_SCHEMA_VERSION ||
    !isStoryId(value.storyId) ||
    (value.reaction !== null && !isSocialStoryReactionType(value.reaction))
  ) {
    throw new Error('Invalid Social Story Reaction state response');
  }
  return {
    schemaVersion: SOCIAL_STORY_REACTION_SCHEMA_VERSION,
    storyId: value.storyId,
    reaction: value.reaction,
  };
};

export const parseSocialStoryReactionSummaryResponse = (
  value: unknown,
): SocialStoryReactionSummaryDto => {
  if (!isRecord(value) || !hasExactKeys(value, SUMMARY_KEYS)) {
    throw new Error('Invalid Social Story Reaction summary response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_REACTION_SCHEMA_VERSION ||
    !isStoryId(value.storyId)
  ) {
    throw new Error('Invalid Social Story Reaction summary response');
  }
  const counts = parseCounts(value.counts);
  const totalCount = parseCount(value.totalCount);
  if (totalCount !== counts.love + counts.fire + counts.strong + counts.clap) {
    throw new Error('Invalid Social Story Reaction summary response');
  }
  return {
    schemaVersion: SOCIAL_STORY_REACTION_SCHEMA_VERSION,
    storyId: value.storyId,
    counts,
    totalCount,
  };
};
