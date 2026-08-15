export type PushDestination = `/social/story/${string}`;

const STORY_DESTINATION_PREFIX = '/social/story/';
const SAFE_STORY_ID = /^[A-Za-z0-9_-]{1,128}$/;

export function parsePushDestination(value: unknown): PushDestination | null {
  if (typeof value !== 'string') return null;
  if (!value.startsWith(STORY_DESTINATION_PREFIX)) return null;
  if (value.includes('?') || value.includes('#') || value.includes('%')) {
    return null;
  }

  const storyId = value.slice(STORY_DESTINATION_PREFIX.length);
  if (!SAFE_STORY_ID.test(storyId)) return null;

  return `${STORY_DESTINATION_PREFIX}${storyId}`;
}
