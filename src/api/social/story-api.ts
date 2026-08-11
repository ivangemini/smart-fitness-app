import type { ApiClient } from '@/api/client';

import {
  buildSocialListQuery,
  requestSocialApiWithAuth,
  requireSocialPathSegment,
} from './authenticated-request';
import type { SocialApiAuth } from './contracts';
import {
  SOCIAL_STORY_CAPTION_MAX_LENGTH,
  SOCIAL_STORY_DTO_SCHEMA_VERSION,
  SOCIAL_STORY_MEDIA_SCHEMA_VERSION,
  SOCIAL_STORY_OVERLAY_MAX_LENGTH,
  SOCIAL_STORY_OVERLAY_PLACEMENTS,
  SOCIAL_STORY_OVERLAY_SCHEMA_VERSION,
  type CreateSocialStoryInput,
  type ListSocialStoriesInput,
  type SocialStoryCaptionDto,
  type SocialStoryDto,
  type SocialStoryOverlayDto,
  type SocialStoryOverlayPlacement,
  type SocialStoryPageDto,
} from './story-contracts';
import {
  parseSocialStoryCaptionResponse,
  parseSocialStoryOverlayResponse,
  parseSocialStoryPageResponse,
  parseSocialStoryResponse,
  parseSocialStorySuccessResponse,
} from './story-parsers';

export type SocialStoryApi = {
  createStory(input: CreateSocialStoryInput): Promise<SocialStoryDto>;
  getStory(storyId: string): Promise<SocialStoryDto>;
  getStoryCaption(storyId: string): Promise<SocialStoryCaptionDto>;
  getStoryOverlay(storyId: string): Promise<SocialStoryOverlayDto>;
  listStories(input?: ListSocialStoriesInput): Promise<SocialStoryPageDto>;
  markStoryViewed(storyId: string): Promise<void>;
  deleteStory(storyId: string): Promise<void>;
};

const isOverlayPlacement = (
  value: unknown,
): value is SocialStoryOverlayPlacement =>
  typeof value === 'string' &&
  (SOCIAL_STORY_OVERLAY_PLACEMENTS as readonly string[]).includes(value);

const buildCreatePayload = (
  input: CreateSocialStoryInput,
): CreateSocialStoryInput => {
  const idempotencyKey = input.idempotencyKey.trim();
  const assetId = input.image.assetId.trim();
  const caption =
    typeof input.caption === 'string' ? input.caption.trim() : input.caption;
  const overlayText = input.overlay?.text.trim() ?? '';
  const hasOverlay = overlayText.length > 0;
  if (
    input.schemaVersion !== SOCIAL_STORY_DTO_SCHEMA_VERSION ||
    input.image.schemaVersion !== SOCIAL_STORY_MEDIA_SCHEMA_VERSION ||
    idempotencyKey.length < 16 ||
    idempotencyKey.length > 128 ||
    !assetId ||
    !Number.isSafeInteger(input.image.expectedStateVersion) ||
    input.image.expectedStateVersion < 1 ||
    (typeof caption === 'string' &&
      caption.length > SOCIAL_STORY_CAPTION_MAX_LENGTH) ||
    (input.overlay !== null &&
      input.overlay !== undefined &&
      input.overlay.schemaVersion !== SOCIAL_STORY_OVERLAY_SCHEMA_VERSION) ||
    overlayText.length > SOCIAL_STORY_OVERLAY_MAX_LENGTH ||
    (hasOverlay && !isOverlayPlacement(input.overlay?.placement))
  ) {
    throw new Error('Social Story input is invalid');
  }
  return {
    schemaVersion: SOCIAL_STORY_DTO_SCHEMA_VERSION,
    idempotencyKey,
    ...(caption ? { caption } : {}),
    ...(hasOverlay && input.overlay
      ? {
          overlay: {
            schemaVersion: SOCIAL_STORY_OVERLAY_SCHEMA_VERSION,
            text: overlayText,
            placement: input.overlay.placement,
          },
        }
      : {}),
    image: {
      schemaVersion: SOCIAL_STORY_MEDIA_SCHEMA_VERSION,
      assetId,
      expectedStateVersion: input.image.expectedStateVersion,
    },
  };
};

export const createSocialStoryApi = (
  auth: SocialApiAuth,
  apiClient: ApiClient,
): SocialStoryApi => ({
  async createStory(input) {
    return parseSocialStoryResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'POST',
        '/v1/social/stories',
        buildCreatePayload(input),
      ),
    );
  },

  async getStory(storyId) {
    return parseSocialStoryResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `/v1/social/stories/${requireSocialPathSegment(storyId, 'Social Story ID')}`,
      ),
    );
  },

  async getStoryCaption(storyId) {
    return parseSocialStoryCaptionResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `/v1/social/stories/${requireSocialPathSegment(
          storyId,
          'Social Story ID',
        )}/caption`,
      ),
    );
  },

  async getStoryOverlay(storyId) {
    return parseSocialStoryOverlayResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `/v1/social/stories/${requireSocialPathSegment(
          storyId,
          'Social Story ID',
        )}/overlay`,
      ),
    );
  },

  async listStories(input = {}) {
    return parseSocialStoryPageResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `/v1/social/stories${buildSocialListQuery(input, 'Social Story')}`,
      ),
    );
  },

  async markStoryViewed(storyId) {
    parseSocialStorySuccessResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'POST',
        `/v1/social/stories/${requireSocialPathSegment(
          storyId,
          'Social Story ID',
        )}/view`,
      ),
    );
  },

  async deleteStory(storyId) {
    parseSocialStorySuccessResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'DELETE',
        `/v1/social/stories/${requireSocialPathSegment(storyId, 'Social Story ID')}`,
      ),
    );
  },
});
