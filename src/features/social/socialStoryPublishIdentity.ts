import {
  SOCIAL_CONTENT_MODERATION_ERROR_CODES,
  type SocialApiErrorCode,
  type SocialStoryAudience,
  type SocialStoryOverlayPlacement,
} from '@/api/social';

export type SocialStoryPublishComposition = {
  assetId: string;
  expectedStateVersion: number;
  caption: string | null;
  overlay: {
    text: string;
    placement: SocialStoryOverlayPlacement;
  } | null;
  audience: SocialStoryAudience;
};

export type SocialStoryPublishIdentity = {
  signature: string;
  idempotencyKey: string;
};

const moderationErrorCodes = new Set<SocialApiErrorCode>(
  SOCIAL_CONTENT_MODERATION_ERROR_CODES,
);

export const createSocialStoryPublishSignature = (
  composition: SocialStoryPublishComposition,
): string => JSON.stringify(composition);

export const createSocialStoryPublishIdempotencyKey = (): string => {
  const randomUuid = globalThis.crypto?.randomUUID?.();
  if (randomUuid) return `story-create-${randomUuid}`;
  return `story-create-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

export const resolveSocialStoryPublishIdentity = (
  current: SocialStoryPublishIdentity | null,
  composition: SocialStoryPublishComposition,
  createKey: () => string = createSocialStoryPublishIdempotencyKey,
): SocialStoryPublishIdentity => {
  const signature = createSocialStoryPublishSignature(composition);
  if (current?.signature === signature) return current;
  return { signature, idempotencyKey: createKey() };
};

export const shouldResetSocialStoryPublishIdentity = (
  errorCode: SocialApiErrorCode | null,
): boolean =>
  errorCode === 'SOCIAL_STORY_IDEMPOTENCY_KEY_REUSE' ||
  (errorCode !== null && moderationErrorCodes.has(errorCode));
