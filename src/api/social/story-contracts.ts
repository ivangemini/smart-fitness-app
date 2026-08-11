import type { SocialProfileDto } from './contracts';
import type { SocialMediaPublicDescriptorDto } from './media-contracts';

export const SOCIAL_STORY_DTO_SCHEMA_VERSION = 1 as const;
export const SOCIAL_STORY_MEDIA_SCHEMA_VERSION = 1 as const;
export const SOCIAL_STORY_CAPTION_SCHEMA_VERSION = 1 as const;
export const SOCIAL_STORY_CAPTION_MAX_LENGTH = 1000 as const;
export const SOCIAL_STORY_OVERLAY_SCHEMA_VERSION = 1 as const;
export const SOCIAL_STORY_OVERLAY_MAX_LENGTH = 280 as const;
export const SOCIAL_STORY_OVERLAY_PLACEMENTS = [
  'top',
  'center',
  'bottom',
] as const;
export type SocialStoryOverlayPlacement =
  (typeof SOCIAL_STORY_OVERLAY_PLACEMENTS)[number];

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

export type SocialStoryCaptionDto = {
  schemaVersion: typeof SOCIAL_STORY_CAPTION_SCHEMA_VERSION;
  storyId: string;
  caption: string | null;
};

export type SocialStoryOverlayValueDto = {
  schemaVersion: typeof SOCIAL_STORY_OVERLAY_SCHEMA_VERSION;
  text: string;
  placement: SocialStoryOverlayPlacement;
};

export type SocialStoryOverlayDto = {
  schemaVersion: typeof SOCIAL_STORY_OVERLAY_SCHEMA_VERSION;
  storyId: string;
  overlay: SocialStoryOverlayValueDto | null;
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
  caption?: string | null;
  overlay?: SocialStoryOverlayValueDto | null;
  image: SocialStoryMediaInput;
};
