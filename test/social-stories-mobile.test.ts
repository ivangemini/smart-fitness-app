import { describe, expect, it } from 'vitest';

import {
  parseSocialStoryCaptionResponse,
  parseSocialStoryDto,
  parseSocialStoryOverlayResponse,
  parseSocialStoryPageResponse,
  parseSocialStorySuccessResponse,
} from '@/api/social';
import {
  createSocialStoryCacheStore,
  SOCIAL_STORY_CACHE_MAX_AGE_MS,
} from '@/features/social/socialStoryCache';
import {
  markSocialStoryViewed,
  mergeSocialStories,
} from '@/features/social/socialStorySurfaceModel';
import type { StorageAdapter } from '@/storage';

const ASSET_ID = '11111111-1111-4111-8111-111111111111';
const STORY_ID = '22222222-2222-4222-8222-222222222222';
const HASH = 'a'.repeat(64);
const CREATED_AT = '2026-08-09T10:00:00.000Z';
const EXPIRES_AT = '2026-08-10T10:00:00.000Z';

const variant = (name: string, width: number, height: number) => ({
  width,
  height,
  mimeType: 'image/jpeg',
  contentHash: HASH,
  url: `https://media.example.com/public/social-media/v1/${ASSET_ID}/${name}/${HASH}.jpg`,
});

const storyValue = (overrides: Record<string, unknown> = {}) => ({
  schemaVersion: 1,
  id: STORY_ID,
  author: {
    schemaVersion: 1,
    username: 'story_owner',
    displayName: 'Story Owner',
    bio: null,
    avatarUrl: null,
    visibility: 'public',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  },
  image: {
    schemaVersion: 1,
    assetId: ASSET_ID,
    assetType: 'story_image',
    width: 1080,
    height: 1920,
    aspectRatio: 1080 / 1920,
    placeholder: { type: 'average_color', value: '#123456' },
    variants: {
      post_320: variant('post_320', 180, 320),
      post_640: variant('post_640', 360, 640),
      post_1080: variant('post_1080', 608, 1080),
      post_1440: variant('post_1440', 810, 1440),
    },
  },
  viewed: false,
  createdAt: CREATED_AT,
  expiresAt: EXPIRES_AT,
  ...overrides,
});

const createMemoryStorage = () => {
  const values = new Map<string, string>();
  const storage: StorageAdapter = {
    async read(key) {
      return values.get(key) ?? null;
    },
    async write(key, value) {
      values.set(key, value);
    },
    async remove(key) {
      values.delete(key);
    },
  };
  return { storage, values };
};

describe('mobile Social Stories contract', () => {
  it('strictly parses a 24-hour story_image DTO and page', () => {
    const parsed = parseSocialStoryDto(storyValue());
    expect(parsed.id).toBe(STORY_ID);
    expect(parsed.image.assetType).toBe('story_image');
    expect(parsed.image.variants.post_1080?.url).toContain('/post_1080/');

    expect(
      parseSocialStoryPageResponse({ items: [storyValue()], nextCursor: 'next' }),
    ).toEqual({ items: [parsed], nextCursor: 'next' });
    expect(() => parseSocialStorySuccessResponse({ success: true })).not.toThrow();
  });

  it('parses the separate bounded Story caption contract', () => {
    expect(
      parseSocialStoryCaptionResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        caption: 'Leg day complete',
      }),
    ).toEqual({
      schemaVersion: 1,
      storyId: STORY_ID,
      caption: 'Leg day complete',
    });
    expect(
      parseSocialStoryCaptionResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        caption: null,
      }).caption,
    ).toBeNull();
    expect(() =>
      parseSocialStoryCaptionResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        caption: '',
      }),
    ).toThrow();
    expect(() =>
      parseSocialStoryCaptionResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        caption: ' untrimmed ',
      }),
    ).toThrow();
    expect(() =>
      parseSocialStoryCaptionResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        caption: 'x'.repeat(1001),
      }),
    ).toThrow();
    expect(() =>
      parseSocialStoryCaptionResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        caption: 'caption',
        extra: true,
      }),
    ).toThrow();
  });

  it('parses the separate bounded Story overlay contract', () => {
    expect(
      parseSocialStoryOverlayResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        overlay: {
          schemaVersion: 1,
          text: 'New personal record',
          placement: 'center',
        },
      }),
    ).toEqual({
      schemaVersion: 1,
      storyId: STORY_ID,
      overlay: {
        schemaVersion: 1,
        text: 'New personal record',
        placement: 'center',
      },
    });
    expect(
      parseSocialStoryOverlayResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        overlay: null,
      }).overlay,
    ).toBeNull();

    for (const placement of ['top', 'center', 'bottom']) {
      expect(
        parseSocialStoryOverlayResponse({
          schemaVersion: 1,
          storyId: STORY_ID,
          overlay: {
            schemaVersion: 1,
            text: 'Lift',
            placement,
          },
        }).overlay?.placement,
      ).toBe(placement);
    }

    for (const overlay of [
      { schemaVersion: 1, text: '', placement: 'top' },
      { schemaVersion: 1, text: ' untrimmed ', placement: 'center' },
      { schemaVersion: 1, text: 'x'.repeat(281), placement: 'bottom' },
      { schemaVersion: 1, text: 'Lift', placement: 'free' },
      { schemaVersion: 1, text: 'Lift', placement: 'top', color: '#fff' },
    ]) {
      expect(() =>
        parseSocialStoryOverlayResponse({
          schemaVersion: 1,
          storyId: STORY_ID,
          overlay,
        }),
      ).toThrow();
    }
    expect(() =>
      parseSocialStoryOverlayResponse({
        schemaVersion: 1,
        storyId: STORY_ID,
        overlay: null,
        extra: true,
      }),
    ).toThrow();
  });

  it('rejects wrong media type, lifecycle drift, extra keys and duplicate pages', () => {
    const wrongType = storyValue({
      image: { ...storyValue().image, assetType: 'workout_post_image' },
    });
    expect(() => parseSocialStoryDto(wrongType)).toThrow();
    expect(() =>
      parseSocialStoryDto(
        storyValue({ expiresAt: '2026-08-10T09:59:59.000Z' }),
      ),
    ).toThrow();
    expect(() => parseSocialStoryDto({ ...storyValue(), caption: 'extra' })).toThrow();
    expect(() =>
      parseSocialStoryDto({
        ...storyValue(),
        overlay: { schemaVersion: 1, text: 'extra', placement: 'center' },
      }),
    ).toThrow();
    expect(() => parseSocialStoryDto({ ...storyValue(), extra: true })).toThrow();
    expect(() =>
      parseSocialStoryPageResponse({
        items: [storyValue(), storyValue()],
        nextCursor: null,
      }),
    ).toThrow();
  });
});

describe('mobile Social Story cache and state', () => {
  it('keeps a short-lived account-scoped strict cache', async () => {
    const { storage } = createMemoryStorage();
    const cache = createSocialStoryCacheStore(storage);
    const story = parseSocialStoryDto(storyValue());
    const now = Date.parse(CREATED_AT) + 60_000;

    await cache.save('account-a', [story], now);
    expect(await cache.load('account-a', now + 30_000)).toEqual({
      cachedAt: new Date(now).toISOString(),
      items: [story],
    });
    expect(await cache.load('account-b', now + 30_000)).toBeNull();
    expect(
      await cache.load('account-a', now + SOCIAL_STORY_CACHE_MAX_AGE_MS + 1),
    ).toBeNull();
  });

  it('drops expired stories even when the cache itself is still fresh', async () => {
    const { storage } = createMemoryStorage();
    const cache = createSocialStoryCacheStore(storage);
    const story = parseSocialStoryDto(storyValue());
    const expiresAt = Date.parse(EXPIRES_AT);

    await cache.save('account-a', [story], expiresAt - 30_000);
    expect(await cache.load('account-a', expiresAt + 1)).toBeNull();
  });

  it('preserves server order while merging and marks viewed immutably', () => {
    const first = parseSocialStoryDto(storyValue());
    const second = parseSocialStoryDto(
      storyValue({ id: '33333333-3333-4333-8333-333333333333' }),
    );
    expect(mergeSocialStories([first], [first, second]).map((item) => item.id)).toEqual([
      first.id,
      second.id,
    ]);
    const viewed = markSocialStoryViewed([first, second], first.id);
    expect(viewed[0]?.viewed).toBe(true);
    expect(viewed[1]).toBe(second);
  });
});
