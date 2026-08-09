import type { ApiClient } from '@/api/client';

import {
  buildSocialListQuery,
  requestSocialApiWithAuth,
  requireSocialPathSegment,
} from './authenticated-request';
import type { SocialApiAuth } from './contracts';
import {
  SOCIAL_STORY_DTO_SCHEMA_VERSION,
  SOCIAL_STORY_MEDIA_SCHEMA_VERSION,
  type CreateSocialStoryInput,
  type ListSocialStoriesInput,
  type SocialStoryDto,
  type SocialStoryPageDto,
} from './story-contracts';
import {
  parseSocialStoryPageResponse,
  parseSocialStoryResponse,
  parseSocialStorySuccessResponse,
} from './story-parsers';

export type SocialStoryApi = {
  createStory(input: CreateSocialStoryInput): Promise<SocialStoryDto>;
  getStory(storyId: string): Promise<SocialStoryDto>;
  listStories(input?: ListSocialStoriesInput): Promise<SocialStoryPageDto>;
  markStoryViewed(storyId: string): Promise<void>;
  deleteStory(storyId: string): Promise<void>;
};

const buildCreatePayload = (
  input: CreateSocialStoryInput,
): CreateSocialStoryInput => {
  const idempotencyKey = input.idempotencyKey.trim();
  const assetId = input.image.assetId.trim();
  if (
    input.schemaVersion !== SOCIAL_STORY_DTO_SCHEMA_VERSION ||
    input.image.schemaVersion !== SOCIAL_STORY_MEDIA_SCHEMA_VERSION ||
    idempotencyKey.length < 16 ||
    idempotencyKey.length > 128 ||
    !assetId ||
    !Number.isSafeInteger(input.image.expectedStateVersion) ||
    input.image.expectedStateVersion < 1
  ) {
    throw new Error('Social Story input is invalid');
  }
  return {
    schemaVersion: SOCIAL_STORY_DTO_SCHEMA_VERSION,
    idempotencyKey,
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
