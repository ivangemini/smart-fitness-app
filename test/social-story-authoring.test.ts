import { describe, expect, it } from 'vitest';

import type { SocialMediaOwnerAssetDto } from '@/api/social';
import {
  canRefreshSocialStoryMedia,
  getApprovedSocialStoryMediaInput,
} from '@/features/social/socialStoryMediaModel';

const ASSET_ID = '11111111-1111-4111-8111-111111111111';
const ISO = '2026-08-09T10:00:00.000Z';

const asset = (overrides: Partial<SocialMediaOwnerAssetDto> = {}): SocialMediaOwnerAssetDto => ({
  schemaVersion: 1,
  assetId: ASSET_ID,
  assetType: 'story_image',
  state: 'approved',
  stateVersion: 7,
  stateReasonCode: null,
  uploadExpiresAt: null,
  declaredMediaType: 'image/jpeg',
  declaredByteSize: 1024,
  source: null,
  moderation: null,
  publicDescriptor: {
    schemaVersion: 1,
    assetId: ASSET_ID,
    assetType: 'story_image',
    width: 1080,
    height: 1920,
    aspectRatio: 1080 / 1920,
    placeholder: { type: 'average_color', value: '#123456' },
    variants: {},
  },
  createdAt: ISO,
  updatedAt: ISO,
  quarantinedAt: ISO,
  failedAt: null,
  deletedAt: null,
  ...overrides,
});

describe('Story authoring media state', () => {
  it('submits only an owned approved story_image with the exact stateVersion', () => {
    expect(getApprovedSocialStoryMediaInput(asset())).toEqual({
      schemaVersion: 1,
      assetId: ASSET_ID,
      expectedStateVersion: 7,
    });
    expect(
      getApprovedSocialStoryMediaInput(asset({ state: 'processing' })),
    ).toBeNull();
    expect(
      getApprovedSocialStoryMediaInput(asset({ assetType: 'workout_post_image' })),
    ).toBeNull();
    expect(
      getApprovedSocialStoryMediaInput(
        asset({
          publicDescriptor: {
            ...asset().publicDescriptor!,
            assetType: 'workout_post_image',
          },
        }),
      ),
    ).toBeNull();
  });

  it('keeps pending, processing and review-required assets refreshable', () => {
    expect(canRefreshSocialStoryMedia(asset({ state: 'upload_pending' }))).toBe(true);
    expect(canRefreshSocialStoryMedia(asset({ state: 'processing' }))).toBe(true);
    expect(canRefreshSocialStoryMedia(asset({ state: 'review_required' }))).toBe(true);
    expect(canRefreshSocialStoryMedia(asset())).toBe(false);
    expect(canRefreshSocialStoryMedia(asset({ state: 'rejected' }))).toBe(false);
  });
});
