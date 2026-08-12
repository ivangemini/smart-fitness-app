import type { SocialProfileDto } from './contracts';
import type {
  SocialStoryAudience,
  SocialStoryImageDescriptorDto,
} from './story-contracts';

export const SOCIAL_STORY_EXPANSION_SCHEMA_VERSION = 1 as const;
export const SOCIAL_STORY_REPLY_MAX_LENGTH = 1000 as const;
export const SOCIAL_STORY_HIGHLIGHT_TITLE_MAX_LENGTH = 80 as const;

export type SocialStoryAudienceDto = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  storyId: string;
  audience: SocialStoryAudience;
};

export type SocialStoryExpansionPage<T> = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  items: T[];
  nextCursor: string | null;
};

export type SocialStoryCloseFriendDto = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  profile: SocialProfileDto;
  addedAt: string;
};

export type SocialStoryViewerDto = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  profile: SocialProfileDto;
  viewedAt: string;
};

export type SocialStoryReplyDto = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  id: string;
  storyId: string;
  author: SocialProfileDto;
  body: string;
  createdAt: string;
};

export type SocialStoryArchiveOverlayDto = {
  text: string;
  placement: 'top' | 'center' | 'bottom';
};

export type SocialStoryArchiveItemDto = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  id: string;
  author: SocialProfileDto;
  image: SocialStoryImageDescriptorDto;
  caption: string | null;
  overlay: SocialStoryArchiveOverlayDto | null;
  audience: SocialStoryAudience;
  createdAt: string;
  expiresAt: string;
  archivedAt: string;
};

export type SocialStoryHighlightDto = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type SocialStoryHighlightItemsDto = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  highlight: SocialStoryHighlightDto;
  items: Array<{ position: number; story: SocialStoryArchiveItemDto }>;
};

export type SocialStoryPushPreferenceDto = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  requestedEnabled: boolean;
  deliveryProviderAvailable: false;
  effectiveEnabled: false;
  updatedAt: string | null;
};

export type ListSocialStoryExpansionInput = {
  limit?: number;
  cursor?: string;
};

export type CreateSocialStoryReplyInput = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  idempotencyKey: string;
  body: string;
};

export type CreateSocialStoryHighlightInput = {
  schemaVersion: typeof SOCIAL_STORY_EXPANSION_SCHEMA_VERSION;
  title: string;
};
