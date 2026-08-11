import type {
  SocialStoryLikeStateDto,
  SocialStoryLikeSummaryDto,
} from '@/api/social';

export type SocialStoryLikeSurfaceMode = 'viewer_state' | 'owner_summary';

export type SocialStoryLikeSurface =
  | {
      mode: 'viewer_state';
      state: SocialStoryLikeStateDto;
    }
  | {
      mode: 'owner_summary';
      summary: SocialStoryLikeSummaryDto;
    };

export type SocialStoryLikeSurfaceApi = {
  getStoryLike(storyId: string): Promise<SocialStoryLikeStateDto>;
  getStoryLikeSummary(storyId: string): Promise<SocialStoryLikeSummaryDto>;
};

export const getSocialStoryLikeSurfaceMode = (
  ownUsername: string | null | undefined,
  authorUsername: string,
): SocialStoryLikeSurfaceMode =>
  ownUsername?.trim() === authorUsername.trim()
    ? 'owner_summary'
    : 'viewer_state';

export const loadSocialStoryLikeSurface = async (
  mode: SocialStoryLikeSurfaceMode,
  storyId: string,
  api: SocialStoryLikeSurfaceApi,
): Promise<SocialStoryLikeSurface> => {
  if (mode === 'owner_summary') {
    return {
      mode,
      summary: await api.getStoryLikeSummary(storyId),
    };
  }
  return {
    mode,
    state: await api.getStoryLike(storyId),
  };
};
