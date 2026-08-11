export const SOCIAL_STORY_LIKE_SCHEMA_VERSION = 1 as const;

export type SocialStoryLikeStateDto = {
  schemaVersion: typeof SOCIAL_STORY_LIKE_SCHEMA_VERSION;
  storyId: string;
  liked: boolean;
};

export type SocialStoryLikeSummaryDto = {
  schemaVersion: typeof SOCIAL_STORY_LIKE_SCHEMA_VERSION;
  storyId: string;
  likeCount: number;
};
