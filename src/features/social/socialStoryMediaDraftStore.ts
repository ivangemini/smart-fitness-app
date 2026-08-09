import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = 'smart-fitness:social-story-media:v1:';
const MAX_PREVIEW_URI_LENGTH = 4_096;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;

export type SocialStoryMediaDraft = {
  schemaVersion: 1;
  assetId: string;
  previewUri: string | null;
  updatedAt: string;
};

const keyForDraft = (accountId: string): string => `${STORAGE_PREFIX}${accountId}`;

const isDraft = (value: unknown): value is SocialStoryMediaDraft => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Object.keys(candidate).length === 4 &&
    candidate.schemaVersion === 1 &&
    typeof candidate.assetId === 'string' &&
    UUID_PATTERN.test(candidate.assetId) &&
    (candidate.previewUri === null ||
      (typeof candidate.previewUri === 'string' &&
        candidate.previewUri.length > 0 &&
        candidate.previewUri.length <= MAX_PREVIEW_URI_LENGTH)) &&
    typeof candidate.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(candidate.updatedAt))
  );
};

export const loadSocialStoryMediaDraft = async (
  accountId: string,
): Promise<SocialStoryMediaDraft | null> => {
  const storageKey = keyForDraft(accountId);
  try {
    const stored = await AsyncStorage.getItem(storageKey);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (!isDraft(parsed)) {
      await AsyncStorage.removeItem(storageKey);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveSocialStoryMediaDraft = async (
  accountId: string,
  draft: Omit<SocialStoryMediaDraft, 'schemaVersion' | 'updatedAt'>,
): Promise<void> => {
  const value: SocialStoryMediaDraft = {
    schemaVersion: 1,
    assetId: draft.assetId,
    previewUri: draft.previewUri,
    updatedAt: new Date().toISOString(),
  };
  if (!isDraft(value)) throw new Error('Story media draft is invalid');
  await AsyncStorage.setItem(keyForDraft(accountId), JSON.stringify(value));
};

export const clearSocialStoryMediaDraft = async (accountId: string): Promise<void> => {
  await AsyncStorage.removeItem(keyForDraft(accountId));
};
