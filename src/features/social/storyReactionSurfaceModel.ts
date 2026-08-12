import type {
  SocialStoryReactionStateDto,
  SocialStoryReactionSummaryDto,
} from '@/api/social';

export type SocialStoryReactionSurfaceMode = 'viewer_state' | 'owner_summary';

export type SocialStoryReactionSurface =
  | { mode: 'viewer_state'; state: SocialStoryReactionStateDto }
  | { mode: 'owner_summary'; summary: SocialStoryReactionSummaryDto };

export type SocialStoryReactionSurfaceApi = {
  getStoryReaction(storyId: string): Promise<SocialStoryReactionStateDto>;
  getStoryReactionSummary(storyId: string): Promise<SocialStoryReactionSummaryDto>;
};

export const getSocialStoryReactionSurfaceMode = (
  ownUsername: string | null | undefined,
  authorUsername: string,
): SocialStoryReactionSurfaceMode | null => {
  const normalizedOwnUsername = ownUsername?.trim();
  if (!normalizedOwnUsername) return null;
  return normalizedOwnUsername === authorUsername.trim()
    ? 'owner_summary'
    : 'viewer_state';
};

export const loadSocialStoryReactionSurface = async (
  mode: SocialStoryReactionSurfaceMode,
  storyId: string,
  api: SocialStoryReactionSurfaceApi,
): Promise<SocialStoryReactionSurface> => {
  if (mode === 'owner_summary') {
    return { mode, summary: await api.getStoryReactionSummary(storyId) };
  }
  return { mode, state: await api.getStoryReaction(storyId) };
};
