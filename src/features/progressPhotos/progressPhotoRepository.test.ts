import { describe, expect, it } from 'vitest';

import type { StorageAdapter } from '@/storage';

import { createProgressPhotoRepository } from './progressPhotoRepository';

const USER_ID = '11111111-1111-4111-8111-111111111111';
const PHOTO_ID = '22222222-2222-4222-8222-222222222222';
const MANAGED_URI = `file:///Documents/smart-fitness-progress-photos/${USER_ID}/${PHOTO_ID}.jpg`;

const memoryStorage = (): StorageAdapter => {
  const values = new Map<string, string>();
  return {
    read: async (key) => values.get(key) ?? null,
    write: async (key, value) => {
      values.set(key, value);
    },
    remove: async (key) => {
      values.delete(key);
    },
  };
};

const input = () => ({
  userId: USER_ID,
  photoId: PHOTO_ID,
  pose: 'front' as const,
  source: 'camera' as const,
  sourceUri: 'file:///picker/capture.jpg',
  width: 900,
  height: 1200,
  mimeType: 'image/jpeg',
  now: '2026-08-22T05:00:00.000Z',
});

describe('progress photo repository', () => {
  it('copies the source before exposing a ready metadata record', async () => {
    const storage = memoryStorage();
    const persisted: string[] = [];
    const repository = createProgressPhotoRepository({
      storage,
      files: {
        persist: async ({ sourceUri }) => {
          persisted.push(sourceUri);
          return MANAGED_URI;
        },
        remove: async () => undefined,
      },
    });

    await repository.add(input());

    expect(persisted).toEqual(['file:///picker/capture.jpg']);
    expect(await repository.list(USER_ID)).toMatchObject([
      { id: PHOTO_ID, status: 'ready', localUri: MANAGED_URI },
    ]);
  });

  it('removes a copied file if the metadata write fails', async () => {
    const removed: string[] = [];
    const repository = createProgressPhotoRepository({
      storage: {
        read: async () => null,
        write: async () => {
          throw new Error('write failed');
        },
        remove: async () => undefined,
      },
      files: {
        persist: async () => MANAGED_URI,
        remove: async (uri) => {
          removed.push(uri);
        },
      },
    });

    await expect(repository.add(input())).rejects.toThrow('write failed');
    expect(removed).toEqual([MANAGED_URI]);
  });

  it('keeps a deleting marker when file deletion fails and retries on next list', async () => {
    const storage = memoryStorage();
    let failDelete = true;
    const removed: string[] = [];
    const repository = createProgressPhotoRepository({
      storage,
      files: {
        persist: async () => MANAGED_URI,
        remove: async (uri) => {
          removed.push(uri);
          if (failDelete) throw new Error('delete failed');
        },
      },
    });
    await repository.add(input());

    await expect(repository.remove(USER_ID, PHOTO_ID)).rejects.toThrow('delete failed');
    expect(await repository.list(USER_ID)).toEqual([]);

    failDelete = false;
    expect(await repository.list(USER_ID)).toEqual([]);
    expect(removed).toEqual([MANAGED_URI, MANAGED_URI, MANAGED_URI]);
  });
});
