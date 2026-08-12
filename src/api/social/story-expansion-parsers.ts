import { parseSocialMediaPublicDescriptorDto } from './media-parsers';
import { parseSocialProfileDto } from './parsers';
import {
  SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
  SOCIAL_STORY_HIGHLIGHT_TITLE_MAX_LENGTH,
  SOCIAL_STORY_REPLY_MAX_LENGTH,
  type SocialStoryArchiveItemDto,
  type SocialStoryAudienceDto,
  type SocialStoryCloseFriendDto,
  type SocialStoryExpansionPage,
  type SocialStoryHighlightDto,
  type SocialStoryHighlightItemsDto,
  type SocialStoryPushPreferenceDto,
  type SocialStoryReplyDto,
  type SocialStoryViewerDto,
} from './story-expansion-contracts';
import {
  SOCIAL_STORY_AUDIENCES,
  type SocialStoryAudience,
  type SocialStoryImageDescriptorDto,
} from './story-contracts';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
const PAGE_KEYS = ['schemaVersion', 'items', 'nextCursor'] as const;
const PROFILE_ITEM_KEYS = ['schemaVersion', 'profile'] as const;

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

const isIsoDate = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

export const isSocialStoryAudience = (value: unknown): value is SocialStoryAudience =>
  typeof value === 'string' &&
  (SOCIAL_STORY_AUDIENCES as readonly string[]).includes(value);

const requireUuid = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    throw new Error(`Invalid ${label}`);
  }
  return value;
};

const parseStoryImage = (value: unknown): SocialStoryImageDescriptorDto => {
  if (!isRecord(value) || value.assetType !== 'story_image') {
    throw new Error('Invalid Social Story archive image response');
  }
  const descriptor = parseSocialMediaPublicDescriptorDto({
    ...value,
    assetType: 'workout_post_image',
  });
  return { ...descriptor, assetType: 'story_image' };
};

const parsePage = <T>(
  value: unknown,
  parseItem: (item: unknown) => T,
  label: string,
): SocialStoryExpansionPage<T> => {
  if (!isRecord(value) || !hasExactKeys(value, PAGE_KEYS)) {
    throw new Error(`Invalid ${label} page response`);
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    !Array.isArray(value.items) ||
    value.items.length > 50 ||
    (value.nextCursor !== null &&
      (typeof value.nextCursor !== 'string' || value.nextCursor.length === 0))
  ) {
    throw new Error(`Invalid ${label} page response`);
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    items: value.items.map(parseItem),
    nextCursor: value.nextCursor,
  };
};

export const parseSocialStoryAudienceResponse = (
  value: unknown,
): SocialStoryAudienceDto => {
  const keys = ['schemaVersion', 'storyId', 'audience'] as const;
  if (!isRecord(value) || !hasExactKeys(value, keys)) {
    throw new Error('Invalid Social Story audience response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    !isSocialStoryAudience(value.audience)
  ) {
    throw new Error('Invalid Social Story audience response');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    storyId: requireUuid(value.storyId, 'Social Story audience story ID'),
    audience: value.audience,
  };
};

export const parseSocialStoryCloseFriendDto = (
  value: unknown,
): SocialStoryCloseFriendDto => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [...PROFILE_ITEM_KEYS, 'addedAt']) ||
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    !isIsoDate(value.addedAt)
  ) {
    throw new Error('Invalid Social Story Close Friends response');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    profile: parseSocialProfileDto(value.profile),
    addedAt: value.addedAt,
  };
};

export const parseSocialStoryCloseFriendsPageResponse = (
  value: unknown,
): SocialStoryExpansionPage<SocialStoryCloseFriendDto> =>
  parsePage(value, parseSocialStoryCloseFriendDto, 'Social Story Close Friends');

export const parseSocialStoryViewerDto = (value: unknown): SocialStoryViewerDto => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [...PROFILE_ITEM_KEYS, 'viewedAt']) ||
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    !isIsoDate(value.viewedAt)
  ) {
    throw new Error('Invalid Social Story viewer response');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    profile: parseSocialProfileDto(value.profile),
    viewedAt: value.viewedAt,
  };
};

export const parseSocialStoryViewersPageResponse = (
  value: unknown,
): SocialStoryExpansionPage<SocialStoryViewerDto> =>
  parsePage(value, parseSocialStoryViewerDto, 'Social Story viewers');

export const parseSocialStoryReplyDto = (value: unknown): SocialStoryReplyDto => {
  const keys = ['schemaVersion', 'id', 'storyId', 'author', 'body', 'createdAt'] as const;
  if (!isRecord(value) || !hasExactKeys(value, keys)) {
    throw new Error('Invalid Social Story reply response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    typeof value.body !== 'string' ||
    value.body.length < 1 ||
    value.body.length > SOCIAL_STORY_REPLY_MAX_LENGTH ||
    value.body !== value.body.trim() ||
    !isIsoDate(value.createdAt)
  ) {
    throw new Error('Invalid Social Story reply response');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    id: requireUuid(value.id, 'Social Story reply ID'),
    storyId: requireUuid(value.storyId, 'Social Story reply story ID'),
    author: parseSocialProfileDto(value.author),
    body: value.body,
    createdAt: value.createdAt,
  };
};

export const parseSocialStoryRepliesPageResponse = (
  value: unknown,
): SocialStoryExpansionPage<SocialStoryReplyDto> =>
  parsePage(value, parseSocialStoryReplyDto, 'Social Story replies');

export const parseSocialStoryArchiveItemDto = (
  value: unknown,
): SocialStoryArchiveItemDto => {
  const keys = [
    'schemaVersion',
    'id',
    'author',
    'image',
    'caption',
    'overlay',
    'audience',
    'createdAt',
    'expiresAt',
    'archivedAt',
  ] as const;
  if (!isRecord(value) || !hasExactKeys(value, keys)) {
    throw new Error('Invalid Social Story archive response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    !isSocialStoryAudience(value.audience) ||
    (value.caption !== null && typeof value.caption !== 'string') ||
    !isIsoDate(value.createdAt) ||
    !isIsoDate(value.expiresAt) ||
    !isIsoDate(value.archivedAt) ||
    Date.parse(value.archivedAt) < Date.parse(value.expiresAt)
  ) {
    throw new Error('Invalid Social Story archive response');
  }
  let overlay: SocialStoryArchiveItemDto['overlay'] = null;
  if (value.overlay !== null) {
    if (
      !isRecord(value.overlay) ||
      !hasExactKeys(value.overlay, ['text', 'placement']) ||
      typeof value.overlay.text !== 'string' ||
      value.overlay.text.length < 1 ||
      !['top', 'center', 'bottom'].includes(String(value.overlay.placement))
    ) {
      throw new Error('Invalid Social Story archive overlay response');
    }
    overlay = {
      text: value.overlay.text,
      placement: value.overlay.placement as 'top' | 'center' | 'bottom',
    };
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    id: requireUuid(value.id, 'Social Story archive ID'),
    author: parseSocialProfileDto(value.author),
    image: parseStoryImage(value.image),
    caption: value.caption,
    overlay,
    audience: value.audience,
    createdAt: value.createdAt,
    expiresAt: value.expiresAt,
    archivedAt: value.archivedAt,
  };
};

export const parseSocialStoryArchivePageResponse = (
  value: unknown,
): SocialStoryExpansionPage<SocialStoryArchiveItemDto> =>
  parsePage(value, parseSocialStoryArchiveItemDto, 'Social Story archive');

export const parseSocialStoryHighlightDto = (
  value: unknown,
): SocialStoryHighlightDto => {
  const keys = ['schemaVersion', 'id', 'title', 'createdAt', 'updatedAt'] as const;
  if (!isRecord(value) || !hasExactKeys(value, keys)) {
    throw new Error('Invalid Social Story highlight response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    typeof value.title !== 'string' ||
    value.title.length < 1 ||
    value.title.length > SOCIAL_STORY_HIGHLIGHT_TITLE_MAX_LENGTH ||
    value.title !== value.title.trim() ||
    !isIsoDate(value.createdAt) ||
    !isIsoDate(value.updatedAt)
  ) {
    throw new Error('Invalid Social Story highlight response');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    id: requireUuid(value.id, 'Social Story highlight ID'),
    title: value.title,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
};

export const parseSocialStoryHighlightsResponse = (
  value: unknown,
): { schemaVersion: 1; items: SocialStoryHighlightDto[] } => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['schemaVersion', 'items']) ||
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    !Array.isArray(value.items) ||
    value.items.length > 50
  ) {
    throw new Error('Invalid Social Story highlights response');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    items: value.items.map(parseSocialStoryHighlightDto),
  };
};

export const parseSocialStoryHighlightItemsResponse = (
  value: unknown,
): SocialStoryHighlightItemsDto => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['schemaVersion', 'highlight', 'items']) ||
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    !Array.isArray(value.items) ||
    value.items.length > 100
  ) {
    throw new Error('Invalid Social Story highlight items response');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    highlight: parseSocialStoryHighlightDto(value.highlight),
    items: value.items.map((item) => {
      if (
        !isRecord(item) ||
        !hasExactKeys(item, ['position', 'story']) ||
        !Number.isSafeInteger(item.position) ||
        Number(item.position) < 0 ||
        Number(item.position) > 99
      ) {
        throw new Error('Invalid Social Story highlight item response');
      }
      return {
        position: Number(item.position),
        story: parseSocialStoryArchiveItemDto(item.story),
      };
    }),
  };
};

export const parseSocialStoryPushPreferenceResponse = (
  value: unknown,
): SocialStoryPushPreferenceDto => {
  const keys = [
    'schemaVersion',
    'requestedEnabled',
    'deliveryProviderAvailable',
    'effectiveEnabled',
    'updatedAt',
  ] as const;
  if (!isRecord(value) || !hasExactKeys(value, keys)) {
    throw new Error('Invalid Social Story push preference response');
  }
  if (
    value.schemaVersion !== SOCIAL_STORY_EXPANSION_SCHEMA_VERSION ||
    typeof value.requestedEnabled !== 'boolean' ||
    value.deliveryProviderAvailable !== false ||
    value.effectiveEnabled !== false ||
    (value.updatedAt !== null && !isIsoDate(value.updatedAt))
  ) {
    throw new Error('Invalid Social Story push preference response');
  }
  return {
    schemaVersion: SOCIAL_STORY_EXPANSION_SCHEMA_VERSION,
    requestedEnabled: value.requestedEnabled,
    deliveryProviderAvailable: false,
    effectiveEnabled: false,
    updatedAt: value.updatedAt,
  };
};
