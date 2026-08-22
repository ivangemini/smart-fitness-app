import { createAsyncStorageAdapter, type StorageAdapter } from '@/storage';

import {
  deleteProgressPhotoFile,
  persistProgressPhotoFile,
} from './progressPhotoFiles';
import {
  createProgressPhotoStore,
  type ProgressPhotoPose,
  type ProgressPhotoRecord,
  type ProgressPhotoSource,
} from './progressPhotoStore';

type ProgressPhotoFilePort = {
  persist(input: {
    userId: string;
    photoId: string;
    sourceUri: string;
    mimeType: string;
  }): Promise<string>;
  remove(localUri: string): Promise<void>;
};

type AddProgressPhotoInput = {
  userId: string;
  photoId: string;
  pose: ProgressPhotoPose;
  source: ProgressPhotoSource;
  sourceUri: string;
  width: number;
  height: number;
  mimeType: string;
  now: string;
};

type CreateProgressPhotoRepositoryOptions = {
  storage?: StorageAdapter;
  files?: ProgressPhotoFilePort;
};

const defaultFiles: ProgressPhotoFilePort = {
  persist: persistProgressPhotoFile,
  remove: deleteProgressPhotoFile,
};

export const createProgressPhotoRepository = ({
  storage = createAsyncStorageAdapter(),
  files = defaultFiles,
}: CreateProgressPhotoRepositoryOptions = {}) => {
  const store = createProgressPhotoStore(storage);

  const reconcileDeleting = async (
    userId: string,
    photos: ProgressPhotoRecord[],
  ): Promise<ProgressPhotoRecord[]> => {
    for (const photo of photos) {
      if (photo.status !== 'deleting') continue;
      try {
        await files.remove(photo.localUri);
        await store.remove(userId, photo.id);
      } catch {
        // Keep the deleting marker durable so a later read can retry cleanup.
      }
    }
    const after = await store.read(userId);
    return after.photos.filter((photo) => photo.status === 'ready');
  };

  const list = async (userId: string): Promise<ProgressPhotoRecord[]> => {
    const snapshot = await store.read(userId);
    return reconcileDeleting(userId, snapshot.photos);
  };

  const add = async (input: AddProgressPhotoInput): Promise<ProgressPhotoRecord> => {
    const localUri = await files.persist({
      userId: input.userId,
      photoId: input.photoId,
      sourceUri: input.sourceUri,
      mimeType: input.mimeType,
    });
    const photo: ProgressPhotoRecord = {
      id: input.photoId,
      ownerUserId: input.userId,
      pose: input.pose,
      source: input.source,
      status: 'ready',
      localUri,
      width: input.width,
      height: input.height,
      mimeType: input.mimeType,
      capturedAt: input.now,
      createdAt: input.now,
    };

    try {
      await store.add(input.userId, photo);
      return photo;
    } catch (error) {
      try {
        await files.remove(localUri);
      } catch {
        // The metadata write remains failed; do not hide the original error.
      }
      throw error;
    }
  };

  const remove = async (userId: string, photoId: string): Promise<void> => {
    const current = (await store.read(userId)).photos.find((photo) => photo.id === photoId);
    if (!current) return;
    await store.markDeleting(userId, photoId);
    await files.remove(current.localUri);
    await store.remove(userId, photoId);
  };

  return { add, list, remove };
};

export const progressPhotoRepository = createProgressPhotoRepository();
