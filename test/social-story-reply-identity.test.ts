import { describe, expect, it, vi } from 'vitest';

import {
  createSocialStoryReplySignature,
  resolveSocialStoryReplyIdentity,
  type SocialStoryReplyComposition,
} from '@/features/social/socialStoryReplyIdentity';

const composition = (
  overrides: Partial<SocialStoryReplyComposition> = {},
): SocialStoryReplyComposition => ({
  storyId: '11111111-1111-4111-8111-111111111111',
  body: 'Strong session',
  ...overrides,
});

describe('Story reply identity', () => {
  it('keeps one idempotency key for retries of the exact same reply', () => {
    const createKey = vi.fn(() => 'story-reply-a');
    const first = resolveSocialStoryReplyIdentity(null, composition(), createKey);
    const retry = resolveSocialStoryReplyIdentity(first, composition(), createKey);

    expect(retry).toBe(first);
    expect(createKey).toHaveBeenCalledTimes(1);
  });

  it('rotates identity when the target Story or normalized body changes', () => {
    const keys = ['story-reply-a', 'story-reply-b', 'story-reply-c'];
    const createKey = vi.fn(() => keys.shift() ?? 'story-reply-fallback');
    const first = resolveSocialStoryReplyIdentity(null, composition(), createKey);
    const bodyChanged = resolveSocialStoryReplyIdentity(
      first,
      composition({ body: 'Great session' }),
      createKey,
    );
    const storyChanged = resolveSocialStoryReplyIdentity(
      bodyChanged,
      composition({
        storyId: '22222222-2222-4222-8222-222222222222',
        body: 'Great session',
      }),
      createKey,
    );

    expect(first.idempotencyKey).toBe('story-reply-a');
    expect(bodyChanged.idempotencyKey).toBe('story-reply-b');
    expect(storyChanged.idempotencyKey).toBe('story-reply-c');
    expect(createKey).toHaveBeenCalledTimes(3);
  });

  it('uses a deterministic signature for identical normalized input', () => {
    expect(createSocialStoryReplySignature(composition())).toBe(
      createSocialStoryReplySignature(composition()),
    );
  });
});
