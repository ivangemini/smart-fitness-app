export const SOCIAL_STORY_REACTION_SCHEMA_VERSION = 1 as const;
export const SOCIAL_STORY_REACTION_TYPES = [
  'love',
  'fire',
  'strong',
  'clap',
] as const;

export type SocialStoryReactionType =
  (typeof SOCIAL_STORY_REACTION_TYPES)[number];

export type SocialStoryReactionStateDto = {
  schemaVersion: typeof SOCIAL_STORY_REACTION_SCHEMA_VERSION;
  storyId: string;
  reaction: SocialStoryReactionType | null;
};

export type SocialStoryReactionCountsDto = Record<SocialStoryReactionType, number>;

export type SocialStoryReactionSummaryDto = {
  schemaVersion: typeof SOCIAL_STORY_REACTION_SCHEMA_VERSION;
  storyId: string;
  counts: SocialStoryReactionCountsDto;
  totalCount: number;
};
