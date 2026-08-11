import { describe, expect, it } from 'vitest';

import { parseSocialStoryDto } from './story-parsers';

const STORY_ID = '11111111-1111-4111-8111-111111111111';
const ASSET_ID = '22222222-2222-4222-8222-222222222222';
const HASH = 'a'.repeat(64);
const CREATED_AT = '2026-08-11T10:00:00.000Z';
const EXPIRES_AT = '2026-08-12T10:00:00.000Z';

const profile = {
  schemaVersion: 1,
  username: 'story_author',
  displayName: 'Story Author',
  bio: null,
  avatarUrl: null,
  visibility: 'public',
  createdAt: CREATED_AT,
  updatedAt: CREATED_AT,
};

const image = {
  schemaVersion: 1,
  assetId: ASSET_ID,
  assetType: 'story_image',
  width: 1080,
  height: 1920,
  aspectRatio: 1080 / 1920,
  placeholder: { type: 'average_color', value: '#112233' },
  variants: Object.fromEntries(
    [320, 640, 1080, 1440].map((size) => [
      `post_${size}`,
      {
        width: Math.round(size * (1080 / 1920)),
        height: size,
        mimeType: 'image/jpeg',
        contentHash: HASH,
        url: `https://media.example.test/public/social-media/v1/${ASSET_ID}/post_${size}/${HASH}.jpg`,
      },
    ]),
  ),
};

const story = {
  schemaVersion: 1,
  id: STORY_ID,
  author: profile,
  image,
  viewed: false,
  createdAt: CREATED_AT,
  expiresAt: EXPIRES_AT,
};

describe('Social Story base parser', () => {
  it('keeps binary Like state out of the base Story DTO', () => {
    expect(parseSocialStoryDto(story)).toMatchObject({
      id: STORY_ID,
      viewed: false,
    });
    expect(() => parseSocialStoryDto({ ...story, liked: true })).toThrow(
      /Invalid Social Story response/u,
    );
    expect(() => parseSocialStoryDto({ ...story, likeCount: 2 })).toThrow(
      /Invalid Social Story response/u,
    );
  });
});
