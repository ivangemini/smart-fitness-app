import { isApiError } from '@/api/client';
import {
  getSocialApiErrorCode,
  type SocialStoryDto,
} from '@/api/social';

export type SocialStoryLoadError =
  | 'invalid_cursor'
  | 'not_found'
  | 'offline'
  | 'session_expired'
  | 'generic';

export const isSocialStoryActive = (
  story: SocialStoryDto,
  nowMs = Date.now(),
): boolean => Date.parse(story.expiresAt) > nowMs;

export const mergeSocialStories = (
  existing: SocialStoryDto[],
  incoming: SocialStoryDto[],
): SocialStoryDto[] => {
  const ids = new Set(existing.map((story) => story.id));
  const merged = [...existing];
  for (const story of incoming) {
    if (ids.has(story.id)) continue;
    ids.add(story.id);
    merged.push(story);
  }
  return merged;
};

export const markSocialStoryViewed = (
  stories: SocialStoryDto[],
  storyId: string,
): SocialStoryDto[] =>
  stories.map((story) =>
    story.id === storyId && !story.viewed ? { ...story, viewed: true } : story,
  );

export const getSocialStoryLoadError = (
  error: unknown,
): SocialStoryLoadError => {
  const code = getSocialApiErrorCode(error);
  if (code === 'SOCIAL_STORY_INVALID_CURSOR') return 'invalid_cursor';
  if (code === 'SOCIAL_STORY_NOT_FOUND') return 'not_found';
  if (isApiError(error)) {
    if (error.status === 401 || error.code === 'unauthorized') {
      return 'session_expired';
    }
    if (error.code === 'network_error' || error.code === 'timeout') {
      return 'offline';
    }
  }
  return 'generic';
};
