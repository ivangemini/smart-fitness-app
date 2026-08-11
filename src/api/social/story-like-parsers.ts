import {
  SOCIAL_STORY_LIKE_SCHEMA_VERSION,
  type SocialStoryLikeStateDto,
  type SocialStoryLikeSummaryDto,
} from './story-like-contracts';

const STATE_KEYS = ['schemaVersion', 'storyId', 'liked'] as const;
const SUMMARY_KEYS = ['schemaVersion', 'storyId', 'likeCount'] as const;
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

export const parseSocialStoryLikeStateResponse = (
  value: unknown,
): SocialStoryLikeStateDto => {
  if (!isRecord(value) || !hasExactKeys(value, STATE_KEYS)) {
    throw new Error('Invalid Social Story Like state response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_LIKE_SCHEMA_VERSION ||
    !isStoryId(value.storyId) ||
    typeof value.liked !== 'boolean'
  ) {
    throw new Error('Invalid Social Story Like state response');
  }
  return {
    schemaVersion: SOCIAL_STORY_LIKE_SCHEMA_VERSION,
    storyId: value.storyId,
    liked: value.liked,
  };
};

export const parseSocialStoryLikeSummaryResponse = (
  value: unknown,
): SocialStoryLikeSummaryDto => {
  if (!isRecord(value) || !hasExactKeys(value, SUMMARY_KEYS)) {
    throw new Error('Invalid Social Story Like summary response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_LIKE_SCHEMA_VERSION ||
    !isStoryId(value.storyId) ||
    typeof value.likeCount !== 'number' ||
    !Number.isSafeInteger(value.likeCount) ||
    value.likeCount < 0
  ) {
    throw new Error('Invalid Social Story Like summary response');
  }
  return {
    schemaVersion: SOCIAL_STORY_LIKE_SCHEMA_VERSION,
    storyId: value.storyId,
    likeCount: value.likeCount,
  };
};
