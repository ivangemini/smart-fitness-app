import type { SocialProfileDto } from './contracts';
import type { SocialMediaPublicDescriptorDto } from './media-contracts';

export const SOCIAL_STORY_DTO_SCHEMA_VERSION = 1 as const;
export const SOCIAL_STORY_MEDIA_SCHEMA_VERSION = 1 as const;

export type SocialStoryImageDescriptorDto = Omit<
  SocialMediaPublicDescriptorDto,
  'assetType'
> & {
  assetType: 'story_image';
};

export type SocialStoryDto = {
  schemaVersion: typeof SOCIAL_STORY_DTO_SCHEMA_VERSION;
  id: string;
  author: SocialProfileDto;
  image: SocialStoryImageDescriptorDto;
  viewed: boolean;
  createdAt: string;
  expiresAt: string;
};

export type SocialStoryPageDto = {
  items: SocialStoryDto[];
  nextCursor: string | null;
};

export type ListSocialStoriesInput = {
  limit?: number;
  cursor?: string;
};

export type SocialStoryMediaInput = {
  schemaVersion: typeof SOCIAL_STORY_MEDIA_SCHEMA_VERSION;
  assetId: string;
  expectedStateVersion: number;
};

export type CreateSocialStoryInput = {
  schemaVersion: typeof SOCIAL_STORY_DTO_SCHEMA_VERSION;
  idempotencyKey: string;
  image: SocialStoryMediaInput;
};
