export type SocialStoryReplyComposition = {
  storyId: string;
  body: string;
};

export type SocialStoryReplyIdentity = {
  signature: string;
  idempotencyKey: string;
};

export const createSocialStoryReplySignature = (
  composition: SocialStoryReplyComposition,
): string => JSON.stringify(composition);

export const createSocialStoryReplyIdempotencyKey = (): string => {
  const randomUuid = globalThis.crypto?.randomUUID?.();
  if (randomUuid) return `story-reply-${randomUuid}`;
  return `story-reply-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

export const resolveSocialStoryReplyIdentity = (
  current: SocialStoryReplyIdentity | null,
  composition: SocialStoryReplyComposition,
  createKey: () => string = createSocialStoryReplyIdempotencyKey,
): SocialStoryReplyIdentity => {
  const signature = createSocialStoryReplySignature(composition);
  if (current?.signature === signature) return current;
  return { signature, idempotencyKey: createKey() };
};
