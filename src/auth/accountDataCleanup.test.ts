import { describe, expect, it } from 'vitest';

import { getKnowledgeLearningStorageKey } from '@/features/knowledge/knowledgeLearningStore';
import { getProgressPhotoStorageKey } from '@/features/progressPhotos/progressPhotoStore';
import type { StorageAdapter } from '@/storage';

import {
  PENDING_ACCOUNT_CLEANUP_STORAGE_KEY,
  PROGRESS_PHOTO_FILE_CLEANUP_FAILURE,
  clearLocalAccountData,
  completeLocalAccountCleanup,
  getLocalAccountDataStorageKeys,
  resumePendingLocalAccountCleanup,
} from './accountDataCleanup';

const createMemoryStorage = (
  initial: Record<string, string> = {},
  failRemoveKey?: string,
): StorageAdapter & { values: Map<string, string> } => {
  const values = new Map(Object.entries(initial));
  return {
    values,
    async read(key) {
      return values.get(key) ?? null;
    },
    async write(key, value) {
      values.set(key, value);
    },
    async remove(key) {
      if (key === failRemoveKey) throw new Error('remove failed');
      values.delete(key);
    },
  };
};

describe('local account data cleanup', () => {
  it('removes every account key while preserving device preferences', async () => {
    const userId = 'user-1';
    const accountKeys = getLocalAccountDataStorageKeys(userId);
    expect(accountKeys).toContain(getKnowledgeLearningStorageKey(userId));
    expect(accountKeys).toContain(getProgressPhotoStorageKey(userId));
    const storage = createMemoryStorage({
      ...Object.fromEntries(accountKeys.map((key) => [key, 'private account data'])),
      '@smart_fitness_theme_mode': 'dark',
    });

    await clearLocalAccountData(storage, userId);

    for (const key of accountKeys) expect(storage.values.has(key), key).toBe(false);
    expect(storage.values.get('@smart_fitness_theme_mode')).toBe('dark');
    expect(storage.values.has(PENDING_ACCOUNT_CLEANUP_STORAGE_KEY)).toBe(true);

    await completeLocalAccountCleanup(storage);
    expect(storage.values.has(PENDING_ACCOUNT_CLEANUP_STORAGE_KEY)).toBe(false);
  });

  it('uses a separate secure marker store and clears it only after completion', async () => {
    const userId = 'user-secure';
    const keys = getLocalAccountDataStorageKeys(userId);
    const dataStorage = createMemoryStorage(
      Object.fromEntries(keys.map((key) => [key, 'private'])),
    );
    const markerStorage = createMemoryStorage();

    await clearLocalAccountData(dataStorage, userId, markerStorage);

    for (const key of keys) expect(dataStorage.values.has(key), key).toBe(false);
    expect(markerStorage.values.has(PENDING_ACCOUNT_CLEANUP_STORAGE_KEY)).toBe(true);

    await completeLocalAccountCleanup(markerStorage);
    expect(markerStorage.values.has(PENDING_ACCOUNT_CLEANUP_STORAGE_KEY)).toBe(false);
  });

  it('runs account file cleanup and retains the recovery marker if file deletion fails', async () => {
    const userId = 'user-photo-files';
    const dataStorage = createMemoryStorage();
    const markerStorage = createMemoryStorage();
    const cleaned: string[] = [];

    await clearLocalAccountData(dataStorage, userId, markerStorage, async (id) => {
      cleaned.push(id);
    });
    expect(cleaned).toEqual([userId]);

    await expect(
      clearLocalAccountData(dataStorage, userId, markerStorage, async () => {
        throw new Error('file cleanup failed');
      }),
    ).rejects.toMatchObject({
      name: 'AccountDataCleanupError',
      failedKeys: [PROGRESS_PHOTO_FILE_CLEANUP_FAILURE],
    });
    expect(markerStorage.values.has(PENDING_ACCOUNT_CLEANUP_STORAGE_KEY)).toBe(true);
  });

  it('continues removing account data when the secure marker cannot be written', async () => {
    const userId = 'user-marker-failure';
    const keys = getLocalAccountDataStorageKeys(userId);
    const dataStorage = createMemoryStorage(
      Object.fromEntries(keys.map((key) => [key, 'private'])),
    );
    const markerStorage: StorageAdapter = {
      async read() {
        return null;
      },
      async write() {
        throw new Error('secure storage unavailable');
      },
      async remove() {
        return undefined;
      },
    };

    await clearLocalAccountData(dataStorage, userId, markerStorage);

    for (const key of keys) expect(dataStorage.values.has(key), key).toBe(false);
  });

  it('retains a durable marker when cleanup is interrupted', async () => {
    const userId = 'user-2';
    const failedKey = getLocalAccountDataStorageKeys(userId)[0] as string;
    const storage = createMemoryStorage({ [failedKey]: 'private' }, failedKey);

    await expect(clearLocalAccountData(storage, userId)).rejects.toMatchObject({
      name: 'AccountDataCleanupError',
      failedKeys: [failedKey],
    });
    expect(storage.values.has(PENDING_ACCOUNT_CLEANUP_STORAGE_KEY)).toBe(true);
  });

  it('resumes pending cleanup including account files but retains the marker until auth cleanup finishes', async () => {
    const userId = 'user-3';
    const keys = getLocalAccountDataStorageKeys(userId);
    const dataStorage = createMemoryStorage(
      Object.fromEntries(keys.map((key) => [key, 'private'])),
    );
    const markerStorage = createMemoryStorage({
      [PENDING_ACCOUNT_CLEANUP_STORAGE_KEY]: JSON.stringify({
        userId,
        requestedAt: '2026-07-25T00:00:00.000Z',
      }),
    });
    const cleaned: string[] = [];

    expect(
      await resumePendingLocalAccountCleanup(
        dataStorage,
        markerStorage,
        async (id) => {
          cleaned.push(id);
        },
      ),
    ).toBe(true);
    for (const key of keys) expect(dataStorage.values.has(key), key).toBe(false);
    expect(cleaned).toEqual([userId]);
    expect(markerStorage.values.has(PENDING_ACCOUNT_CLEANUP_STORAGE_KEY)).toBe(true);

    await completeLocalAccountCleanup(markerStorage);
    expect(markerStorage.values.has(PENDING_ACCOUNT_CLEANUP_STORAGE_KEY)).toBe(false);
  });
});
