import { parseSocialMediaPublicDescriptorDto } from './media-parsers';
import { parseSocialProfileDto } from './parsers';
import {
  SOCIAL_STORY_DTO_SCHEMA_VERSION,
  type SocialStoryDto,
  type SocialStoryImageDescriptorDto,
  type SocialStoryPageDto,
} from './story-contracts';

const STORY_KEYS = [
  'schemaVersion',
  'id',
  'author',
  'image',
  'viewed',
  'createdAt',
  'expiresAt',
] as const;
const STORY_PAGE_KEYS = ['items', 'nextCursor'] as const;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean => {
  const actual = Object.keys(value);
  return (
    actual.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
};

const parseStoryImage = (value: unknown): SocialStoryImageDescriptorDto => {
  if (!isRecord(value) || value.assetType !== 'story_image') {
    throw new Error('Invalid Social Story image response');
  }
  const descriptor = parseSocialMediaPublicDescriptorDto({
    ...value,
    assetType: 'workout_post_image',
  });
  return { ...descriptor, assetType: 'story_image' };
};

export const parseSocialStoryDto = (value: unknown): SocialStoryDto => {
  if (!isRecord(value) || !hasExactKeys(value, STORY_KEYS)) {
    throw new Error('Invalid Social Story response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_DTO_SCHEMA_VERSION ||
    typeof value.id !== 'string' ||
    !UUID_PATTERN.test(value.id) ||
    typeof value.viewed !== 'boolean' ||
    typeof value.createdAt !== 'string' ||
    typeof value.expiresAt !== 'string'
  ) {
    throw new Error('Invalid Social Story response');
  }
  const createdAtMs = Date.parse(value.createdAt);
  const expiresAtMs = Date.parse(value.expiresAt);
  if (
    Number.isNaN(createdAtMs) ||
    Number.isNaN(expiresAtMs) ||
    expiresAtMs - createdAtMs !== STORY_LIFETIME_MS
  ) {
    throw new Error('Invalid Social Story lifecycle response');
  }
  const image = parseStoryImage(value.image);
  if (image.assetId.length === 0) {
    throw new Error('Invalid Social Story image response');
  }
  return {
    schemaVersion: SOCIAL_STORY_DTO_SCHEMA_VERSION,
    id: value.id,
    author: parseSocialProfileDto(value.author),
    image,
    viewed: value.viewed,
    createdAt: value.createdAt,
    expiresAt: value.expiresAt,
  };
};

export const parseSocialStoryResponse = (value: unknown): SocialStoryDto => {
  if (!isRecord(value) || !hasExactKeys(value, ['story'])) {
    throw new Error('Invalid Social Story response');
  }
  return parseSocialStoryDto(value.story);
};

export const parseSocialStoryPageResponse = (
  value: unknown,
): SocialStoryPageDto => {
  if (!isRecord(value) || !hasExactKeys(value, STORY_PAGE_KEYS)) {
    throw new Error('Invalid Social Story page response');
  }
  if (
    !Array.isArray(value.items) ||
    value.items.length > 50 ||
    (value.nextCursor !== null &&
      (typeof value.nextCursor !== 'string' || value.nextCursor.length === 0))
  ) {
    throw new Error('Invalid Social Story page response');
  }
  const items = value.items.map(parseSocialStoryDto);
  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new Error('Invalid duplicate Social Story page response');
  }
  return { items, nextCursor: value.nextCursor };
};

export const parseSocialStorySuccessResponse = (value: unknown): void => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['success']) ||
    value.success !== true
  ) {
    throw new Error('Invalid Social Story mutation response');
  }
};
