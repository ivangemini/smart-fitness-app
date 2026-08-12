import type { ApiClient } from '@/api/client';

import {
  buildSocialListQuery,
  requestSocialApiWithAuth,
  requireSocialPathSegment,
} from './authenticated-request';
import type { SocialApiAuth } from './contracts';
import {
  SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
  SOCIAL_STORY_HIGHLIGHT_TITLE_MAX_LENGTH,
  SOCIAL_STORY_REPLY_MAX_LENGTH,
  type CreateSocialStoryHighlightInput,
  type CreateSocialStoryReplyInput,
  type ListSocialStoryExpansionInput,
  type SocialStoryArchiveItemDto,
  type SocialStoryAudienceDto,
  type SocialStoryCloseFriendDto,
  type SocialStoryExpansionPage,
  type SocialStoryHighlightDto,
  type SocialStoryHighlightItemsDto,
  type SocialStoryPushPreferenceDto,
  type SocialStoryReplyDto,
  type SocialStoryViewerDto,
} from './story-expansion-contracts';
import {
  parseSocialStoryArchivePageResponse,
  parseSocialStoryAudienceResponse,
  parseSocialStoryCloseFriendDto,
  parseSocialStoryCloseFriendsPageResponse,
  parseSocialStoryHighlightDto,
  parseSocialStoryHighlightItemsResponse,
  parseSocialStoryHighlightsResponse,
  parseSocialStoryPushPreferenceResponse,
  parseSocialStoryRepliesPageResponse,
  parseSocialStoryReplyDto,
  parseSocialStoryViewersPageResponse,
} from './story-expansion-parsers';
import { parseSocialStorySuccessResponse } from './story-parsers';

export type SocialStoryExpansionApi = {
  getStoryAudience(storyId: string): Promise<SocialStoryAudienceDto>;
  listStoryCloseFriends(
    input?: ListSocialStoryExpansionInput,
  ): Promise<SocialStoryExpansionPage<SocialStoryCloseFriendDto>>;
  addStoryCloseFriend(username: string): Promise<SocialStoryCloseFriendDto>;
  removeStoryCloseFriend(username: string): Promise<void>;
  listStoryViewers(
    storyId: string,
    input?: ListSocialStoryExpansionInput,
  ): Promise<SocialStoryExpansionPage<SocialStoryViewerDto>>;
  createStoryReply(
    storyId: string,
    input: CreateSocialStoryReplyInput,
  ): Promise<SocialStoryReplyDto>;
  listStoryReplies(
    storyId: string,
    input?: ListSocialStoryExpansionInput,
  ): Promise<SocialStoryExpansionPage<SocialStoryReplyDto>>;
  deleteStoryReply(replyId: string): Promise<void>;
  listStoryArchive(
    input?: ListSocialStoryExpansionInput,
  ): Promise<SocialStoryExpansionPage<SocialStoryArchiveItemDto>>;
  createStoryHighlight(
    input: CreateSocialStoryHighlightInput,
  ): Promise<SocialStoryHighlightDto>;
  listStoryHighlights(): Promise<SocialStoryHighlightDto[]>;
  getStoryHighlight(highlightId: string): Promise<SocialStoryHighlightItemsDto>;
  deleteStoryHighlight(highlightId: string): Promise<void>;
  addStoryHighlightItem(
    highlightId: string,
    storyId: string,
    position: number,
  ): Promise<void>;
  removeStoryHighlightItem(highlightId: string, storyId: string): Promise<void>;
  getStoryPushPreference(): Promise<SocialStoryPushPreferenceDto>;
  setStoryPushPreference(requestedEnabled: boolean): Promise<SocialStoryPushPreferenceDto>;
};

const storyPath = (storyId: string): string =>
  `/v1/social/stories/${requireSocialPathSegment(storyId, 'Social Story ID')}`;

const highlightPath = (highlightId: string): string =>
  `/v1/social/stories/highlights/${requireSocialPathSegment(
    highlightId,
    'Social Story highlight ID',
  )}`;

const buildReplyPayload = (
  input: CreateSocialStoryReplyInput,
): CreateSocialStoryReplyInput => {
  const idempotencyKey = input.idempotencyKey.trim();
  const body = input.body.trim();
  if (
    input.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    idempotencyKey.length < 16 ||
    idempotencyKey.length > 128 ||
    body.length < 1 ||
    body.length > SOCIAL_STORY_REPLY_MAX_LENGTH
  ) {
    throw new Error('Social Story reply input is invalid');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    idempotencyKey,
    body,
  };
};

const buildHighlightPayload = (
  input: CreateSocialStoryHighlightInput,
): CreateSocialStoryHighlightInput => {
  const title = input.title.trim();
  if (
    input.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    title.length < 1 ||
    title.length > SOCIAL_STORY_HIGHLIGHT_TITLE_MAX_LENGTH
  ) {
    throw new Error('Social Story highlight input is invalid');
  }
  return { schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION, title };
};

const requireHighlightPosition = (position: number): number => {
  if (!Number.isSafeInteger(position) || position < 0 || position > 99) {
    throw new Error('Social Story highlight position must be between 0 and 99');
  }
  return position;
};

export const createSocialStoryExpansionApi = (
  auth: SocialApiAuth,
  apiClient: ApiClient,
): SocialStoryExpansionApi => ({
  async getStoryAudience(storyId) {
    return parseSocialStoryAudienceResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `${storyPath(storyId)}/audience`,
      ),
    );
  },

  async listStoryCloseFriends(input = {}) {
    return parseSocialStoryCloseFriendsPageResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `/v1/social/stories/close-friends${buildSocialListQuery(
          input,
          'Social Story Close Friends',
        )}`,
      ),
    );
  },

  async addStoryCloseFriend(username) {
    return parseSocialStoryCloseFriendDto(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'PUT',
        `/v1/social/stories/close-friends/${requireSocialPathSegment(
          username,
          'Social Story Close Friend username',
        )}`,
      ),
    );
  },

  async removeStoryCloseFriend(username) {
    parseSocialStorySuccessResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'DELETE',
        `/v1/social/stories/close-friends/${requireSocialPathSegment(
          username,
          'Social Story Close Friend username',
        )}`,
      ),
    );
  },

  async listStoryViewers(storyId, input = {}) {
    return parseSocialStoryViewersPageResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `${storyPath(storyId)}/viewers${buildSocialListQuery(
          input,
          'Social Story viewers',
        )}`,
      ),
    );
  },

  async createStoryReply(storyId, input) {
    return parseSocialStoryReplyDto(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'POST',
        `${storyPath(storyId)}/replies`,
        buildReplyPayload(input),
      ),
    );
  },

  async listStoryReplies(storyId, input = {}) {
    return parseSocialStoryRepliesPageResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `${storyPath(storyId)}/replies${buildSocialListQuery(
          input,
          'Social Story replies',
        )}`,
      ),
    );
  },

  async deleteStoryReply(replyId) {
    parseSocialStorySuccessResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'DELETE',
        `/v1/social/stories/replies/${requireSocialPathSegment(
          replyId,
          'Social Story reply ID',
        )}`,
      ),
    );
  },

  async listStoryArchive(input = {}) {
    return parseSocialStoryArchivePageResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        `/v1/social/stories/archive${buildSocialListQuery(
          input,
          'Social Story archive',
        )}`,
      ),
    );
  },

  async createStoryHighlight(input) {
    return parseSocialStoryHighlightDto(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'POST',
        '/v1/social/stories/highlights',
        buildHighlightPayload(input),
      ),
    );
  },

  async listStoryHighlights() {
    return parseSocialStoryHighlightsResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        '/v1/social/stories/highlights',
      ),
    ).items;
  },

  async getStoryHighlight(highlightId) {
    return parseSocialStoryHighlightItemsResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        highlightPath(highlightId),
      ),
    );
  },

  async deleteStoryHighlight(highlightId) {
    parseSocialStorySuccessResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'DELETE',
        highlightPath(highlightId),
      ),
    );
  },

  async addStoryHighlightItem(highlightId, storyId, position) {
    parseSocialStorySuccessResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'PUT',
        `${highlightPath(highlightId)}/items/${requireSocialPathSegment(
          storyId,
          'Social Story ID',
        )}`,
        {
          schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
          position: requireHighlightPosition(position),
        },
      ),
    );
  },

  async removeStoryHighlightItem(highlightId, storyId) {
    parseSocialStorySuccessResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'DELETE',
        `${highlightPath(highlightId)}/items/${requireSocialPathSegment(
          storyId,
          'Social Story ID',
        )}`,
      ),
    );
  },

  async getStoryPushPreference() {
    return parseSocialStoryPushPreferenceResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'GET',
        '/v1/social/stories/push-preference',
      ),
    );
  },

  async setStoryPushPreference(requestedEnabled) {
    return parseSocialStoryPushPreferenceResponse(
      await requestSocialApiWithAuth(
        auth,
        apiClient,
        'PUT',
        '/v1/social/stories/push-preference',
        {
          schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
          requestedEnabled,
        },
      ),
    );
  },
});
