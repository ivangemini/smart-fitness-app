import { describe, expect, it } from 'vitest';

import { parsePushDestination } from './push-destination';

describe('parsePushDestination', () => {
  it('accepts only an internal Story detail route', () => {
    expect(parsePushDestination('/social/story/story_123-abc')).toBe(
      '/social/story/story_123-abc',
    );
  });

  it.each([
    'https://example.com/phish',
    '//example.com/social/story/story-1',
    'smartfitness://social/story/story-1',
    '/settings/account',
    '/social/story/',
    '/social/story/../settings',
    '/social/story/story-1/extra',
    '/social/story/story-1?redirect=https://example.com',
    '/social/story/story-1#fragment',
    '/social/story/story%2Fsettings',
  ])('rejects non-allowlisted destination %s', (destination) => {
    expect(parsePushDestination(destination)).toBeNull();
  });

  it('rejects non-string provider data', () => {
    expect(parsePushDestination(null)).toBeNull();
    expect(
      parsePushDestination({ destination: '/social/story/story-1' }),
    ).toBeNull();
  });
});
