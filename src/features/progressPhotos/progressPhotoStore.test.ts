import { describe, expect, it } from 'vitest';

import type { StorageAdapter } from '@/storage';

import {
  createProgressPhotoStore,
  getProgressPhotoStorageKey,
  type ProgressPhotoRecord,
} from './progressPhotoStore';

const USER_ID = '11111111-1111-4111-8111-111111111111';
const PHOTO_ID = '22222222-2222-4222-8222-222222222222';

const createMemoryStorage = (): StorageAdapter & { values: Map<string, string> } => {
  const values = new Map<string, string>();
  return {
    values,
    async read(key) {
      return values.get(key) ?? null;
    },
    async write(key, value) {
      values.set(key, value);
    },
    async remove(key) {
      values.delete(key);
    },
  };
};

const photo = (overrides: Partial<ProgressPhotoRecord> = {}): ProgressPhotoRecord => ({
  id: PHOTO_ID,
  ownerUserId: USER_ID,
  pose: 'front',
  source: 'camera',
  status: 'ready',
  localUri: `file:///Documents/smart-fitness-progress-photos/${USER_ID}/${PHOTO_ID}.jpg`,
  width: 900,
  height: 1200,
  mimeType: 'image/jpeg',
  capturedAt: '2026-08-22T05:00:00.000Z',
  createdAt: '2026-08-22T05:00:00.000Z',
  ...overrides,
});

describe('progress photo local store', () => {
  it('uses an account-scoped key and persists only validated managed-file metadata', async () => {
    const storage = createMemoryStorage();
    const store = createProgressPhotoStore(storage);

    await store.add(USER_ID, photo());

    expect((await store.read(USER_ID)).photos).toEqual([photo()]);
    expect(storage.values.has(getProgressPhotoStorageKey(USER_ID))).toBe(true);
  });

  it('fails closed for another owner or unmanaged file path', async () => {
    const storage = createMemoryStorage();
    const store = createProgressPhotoStore(storage);

    await expect(
      store.add(USER_ID, photo({ ownerUserId: '33333333-3333-4333-8333-333333333333' })),
    ).rejects.toThrow('invalid for this account');
    await expect(
      store.add(USER_ID, photo({ localUri: 'file:///tmp/unmanaged.jpg' })),
    ).rejects.toThrow('invalid for this account');
  });

  it('drops malformed persisted records rather than exposing them', async () => {
    const storage = createMemoryStorage();
    storage.values.set(
      getProgressPhotoStorageKey(USER_ID),
      JSON.stringify({
        schemaVersion: 'progress-photos-local-v1',
        photos: [photo(), { ...photo(), id: 'not-a-uuid' }],
      }),
    );

    expect((await createProgressPhotoStore(storage).read(USER_ID)).photos).toEqual([
      photo(),
    ]);
  });

  it('persists the deleting state before final metadata removal', async () => {
    const storage = createMemoryStorage();
    const store = createProgressPhotoStore(storage);
    await store.add(USER_ID, photo());

    await store.markDeleting(USER_ID, PHOTO_ID);
    expect((await store.read(USER_ID)).photos[0]?.status).toBe('deleting');

    await store.remove(USER_ID, PHOTO_ID);
    expect((await store.read(USER_ID)).photos).toEqual([]);
  });

  it('clears only the requested account metadata key', async () => {
    const storage = createMemoryStorage();
    const store = createProgressPhotoStore(storage);
    await store.add(USER_ID, photo());
    storage.values.set('device-preference', 'keep');

    await store.clear(USER_ID);

    expect(storage.values.has(getProgressPhotoStorageKey(USER_ID))).toBe(false);
    expect(storage.values.get('device-preference')).toBe('keep');
  });
});
