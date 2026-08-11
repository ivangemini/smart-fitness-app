import { describe, expect, it, vi } from 'vitest';

import {
  createSocialStoryPublishSignature,
  resolveSocialStoryPublishIdentity,
  shouldResetSocialStoryPublishIdentity,
  type SocialStoryPublishComposition,
} from '@/features/social/socialStoryPublishIdentity';

const composition = (
  overrides: Partial<SocialStoryPublishComposition> = {},
): SocialStoryPublishComposition => ({
  assetId: '11111111-1111-4111-8111-111111111111',
  expectedStateVersion: 6,
  caption: 'Leg day',
  overlay: { text: 'New PR', placement: 'center' },
  ...overrides,
});

describe('Story publish identity', () => {
  it('keeps one idempotency key for retries of the exact same composition', () => {
    const createKey = vi.fn(() => 'story-create-a');
    const first = resolveSocialStoryPublishIdentity(null, composition(), createKey);
    const retry = resolveSocialStoryPublishIdentity(first, composition(), createKey);

    expect(retry).toBe(first);
    expect(createKey).toHaveBeenCalledTimes(1);
  });

  it('rotates identity when published Story content changes', () => {
    const keys = ['story-create-a', 'story-create-b', 'story-create-c'];
    const createKey = vi.fn(() => keys.shift() ?? 'story-create-fallback');
    const first = resolveSocialStoryPublishIdentity(null, composition(), createKey);
    const captionChanged = resolveSocialStoryPublishIdentity(
      first,
      composition({ caption: 'Push day' }),
      createKey,
    );
    const placementChanged = resolveSocialStoryPublishIdentity(
      captionChanged,
      composition({
        caption: 'Push day',
        overlay: { text: 'New PR', placement: 'top' },
      }),
      createKey,
    );

    expect(first.idempotencyKey).toBe('story-create-a');
    expect(captionChanged.idempotencyKey).toBe('story-create-b');
    expect(placementChanged.idempotencyKey).toBe('story-create-c');
    expect(createKey).toHaveBeenCalledTimes(3);
  });

  it('uses a deterministic signature for an identical normalized composition', () => {
    expect(createSocialStoryPublishSignature(composition())).toBe(
      createSocialStoryPublishSignature(composition()),
    );
  });

  it('resets only after confirmed moderation or idempotency terminal errors', () => {
    expect(
      shouldResetSocialStoryPublishIdentity('SOCIAL_CONTENT_MODERATION_REJECTED'),
    ).toBe(true);
    expect(
      shouldResetSocialStoryPublishIdentity('SOCIAL_CONTENT_MODERATION_UNAVAILABLE'),
    ).toBe(true);
    expect(
      shouldResetSocialStoryPublishIdentity('SOCIAL_STORY_IDEMPOTENCY_KEY_REUSE'),
    ).toBe(true);
    expect(shouldResetSocialStoryPublishIdentity('SOCIAL_RATE_LIMITED')).toBe(false);
    expect(shouldResetSocialStoryPublishIdentity(null)).toBe(false);
  });
});
