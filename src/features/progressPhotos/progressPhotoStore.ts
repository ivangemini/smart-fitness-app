import type { StorageAdapter } from '@/storage';

export const PROGRESS_PHOTO_LOCAL_SCHEMA_VERSION = 'progress-photos-local-v1' as const;
export const MAX_PROGRESS_PHOTO_RECORDS = 500;
const STORAGE_PREFIX = '@smart-fitness/progress-photos/v1/';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ProgressPhotoPose = 'front' | 'side' | 'back';
export type ProgressPhotoSource = 'camera' | 'library';
export type ProgressPhotoStatus = 'ready' | 'deleting';

export type ProgressPhotoRecord = {
  id: string;
  ownerUserId: string;
  pose: ProgressPhotoPose;
  source: ProgressPhotoSource;
  status: ProgressPhotoStatus;
  localUri: string;
  width: number;
  height: number;
  mimeType: string;
  capturedAt: string;
  createdAt: string;
};

export type ProgressPhotoSnapshot = {
  schemaVersion: typeof PROGRESS_PHOTO_LOCAL_SCHEMA_VERSION;
  photos: ProgressPhotoRecord[];
};

const emptySnapshot = (): ProgressPhotoSnapshot => ({
  schemaVersion: PROGRESS_PHOTO_LOCAL_SCHEMA_VERSION,
  photos: [],
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIsoDateTime = (value: unknown): value is string =>
  typeof value === 'string' && value.includes('T') && !Number.isNaN(Date.parse(value));

const isPositiveDimension = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 100_000;

const isPose = (value: unknown): value is ProgressPhotoPose =>
  value === 'front' || value === 'side' || value === 'back';

const isSource = (value: unknown): value is ProgressPhotoSource =>
  value === 'camera' || value === 'library';

const isStatus = (value: unknown): value is ProgressPhotoStatus =>
  value === 'ready' || value === 'deleting';

const isManagedLocalUri = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.startsWith('file://') &&
  value.includes('/smart-fitness-progress-photos/');

const requireUserId = (userId: string): string => {
  const normalized = userId.trim();
  if (!UUID_PATTERN.test(normalized)) {
    throw new Error('Progress photo account identifier is invalid.');
  }
  return normalized;
};

const parsePhoto = (
  value: unknown,
  ownerUserId: string,
): ProgressPhotoRecord | null => {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    !UUID_PATTERN.test(value.id) ||
    value.ownerUserId !== ownerUserId ||
    !isPose(value.pose) ||
    !isSource(value.source) ||
    !isStatus(value.status) ||
    !isManagedLocalUri(value.localUri) ||
    !isPositiveDimension(value.width) ||
    !isPositiveDimension(value.height) ||
    typeof value.mimeType !== 'string' ||
    !value.mimeType.startsWith('image/') ||
    value.mimeType.length > 80 ||
    !isIsoDateTime(value.capturedAt) ||
    !isIsoDateTime(value.createdAt)
  ) {
    return null;
  }

  return value as ProgressPhotoRecord;
};

const parseSnapshot = (
  raw: string | null,
  ownerUserId: string,
): ProgressPhotoSnapshot => {
  if (!raw) return emptySnapshot();
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !isRecord(value) ||
      value.schemaVersion !== PROGRESS_PHOTO_LOCAL_SCHEMA_VERSION ||
      !Array.isArray(value.photos)
    ) {
      return emptySnapshot();
    }

    const byId = new Map<string, ProgressPhotoRecord>();
    for (const candidate of value.photos.slice(-MAX_PROGRESS_PHOTO_RECORDS * 2)) {
      const photo = parsePhoto(candidate, ownerUserId);
      if (photo) byId.set(photo.id, photo);
    }
    return {
      schemaVersion: PROGRESS_PHOTO_LOCAL_SCHEMA_VERSION,
      photos: [...byId.values()]
        .sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt))
        .slice(0, MAX_PROGRESS_PHOTO_RECORDS),
    };
  } catch {
    return emptySnapshot();
  }
};

export const getProgressPhotoStorageKey = (userId: string): string =>
  `${STORAGE_PREFIX}${userId.trim()}`;

export const createProgressPhotoStore = (storage: StorageAdapter) => {
  let mutationTail: Promise<void> = Promise.resolve();

  const read = async (userId: string): Promise<ProgressPhotoSnapshot> => {
    const ownerUserId = requireUserId(userId);
    await mutationTail;
    return parseSnapshot(
      await storage.read(getProgressPhotoStorageKey(ownerUserId)),
      ownerUserId,
    );
  };

  const write = async (userId: string, snapshot: ProgressPhotoSnapshot) => {
    await storage.write(getProgressPhotoStorageKey(userId), JSON.stringify(snapshot));
  };

  const mutate = async (
    userId: string,
    updater: (snapshot: ProgressPhotoSnapshot) => ProgressPhotoSnapshot,
  ): Promise<ProgressPhotoSnapshot> => {
    const ownerUserId = requireUserId(userId);
    let result = emptySnapshot();
    const operation = mutationTail.then(async () => {
      const current = parseSnapshot(
        await storage.read(getProgressPhotoStorageKey(ownerUserId)),
        ownerUserId,
      );
      result = updater(current);
      await write(ownerUserId, result);
    });
    mutationTail = operation.then(
      () => undefined,
      () => undefined,
    );
    await operation;
    return result;
  };

  const add = (userId: string, photo: ProgressPhotoRecord) =>
    mutate(userId, (snapshot) => {
      if (photo.ownerUserId !== userId || !parsePhoto(photo, userId)) {
        throw new Error('Progress photo record is invalid for this account.');
      }
      if (snapshot.photos.some((item) => item.id === photo.id)) {
        throw new Error('Progress photo record already exists.');
      }
      if (snapshot.photos.length >= MAX_PROGRESS_PHOTO_RECORDS) {
        throw new Error('Progress photo local record limit reached.');
      }
      return {
        ...snapshot,
        photos: [photo, ...snapshot.photos].sort(
          (a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt),
        ),
      };
    });

  const markDeleting = (userId: string, photoId: string) =>
    mutate(userId, (snapshot) => ({
      ...snapshot,
      photos: snapshot.photos.map((photo) =>
        photo.id === photoId ? { ...photo, status: 'deleting' } : photo,
      ),
    }));

  const remove = (userId: string, photoId: string) =>
    mutate(userId, (snapshot) => ({
      ...snapshot,
      photos: snapshot.photos.filter((photo) => photo.id !== photoId),
    }));

  const clear = async (userId: string) => {
    const ownerUserId = requireUserId(userId);
    const operation = mutationTail.then(() =>
      storage.remove(getProgressPhotoStorageKey(ownerUserId)),
    );
    mutationTail = operation.then(
      () => undefined,
      () => undefined,
    );
    await operation;
  };

  return { add, clear, markDeleting, read, remove };
};
