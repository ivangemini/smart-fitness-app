import { describe, expect, it } from 'vitest';

import type { StorageAdapter } from '@/storage';

import {
  createProactivePresentationStore,
  getProactivePresentationStorageKey,
  parseProactivePresentationState,
} from './proactivePresentationStore';

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

describe('proactive presentation state', () => {
  it('fails closed to an empty state for malformed or unknown-version storage', () => {
    expect(parseProactivePresentationState('{')).toEqual({
      schemaVersion: 1,
      lastShownAt: null,
      dismissedKeys: [],
    });
    expect(
      parseProactivePresentationState(
        JSON.stringify({ schemaVersion: 2, lastShownAt: '2026-08-19T00:00:00.000Z' }),
      ),
    ).toEqual({ schemaVersion: 1, lastShownAt: null, dismissedKeys: [] });
  });

  it('normalizes timestamps and bounds unique dismissed keys', () => {
    const parsed = parseProactivePresentationState(
      JSON.stringify({
        schemaVersion: 1,
        lastShownAt: '2026-08-19T12:00:00+03:00',
        dismissedKeys: [
          ' first ',
          'first',
          ...Array.from({ length: 40 }, (_, index) => `key-${index}`),
          '',
        ],
      }),
    );

    expect(parsed.lastShownAt).toBe('2026-08-19T09:00:00.000Z');
    expect(parsed.dismissedKeys[0]).toBe('first');
    expect(new Set(parsed.dismissedKeys).size).toBe(parsed.dismissedKeys.length);
    expect(parsed.dismissedKeys).toHaveLength(32);
  });

  it('keeps presentation state account-scoped', async () => {
    const storage = createMemoryStorage();
    const store = createProactivePresentationStore(storage);

    await store.recordShown('user-a', '2026-08-19T12:00:00.000Z');
    await store.dismiss('user-a', 'strength_progress:id:bench:120');

    expect(await store.read('user-a')).toMatchObject({
      lastShownAt: '2026-08-19T12:00:00.000Z',
      dismissedKeys: ['strength_progress:id:bench:120'],
    });
    expect(await store.read('user-b')).toEqual({
      schemaVersion: 1,
      lastShownAt: null,
      dismissedKeys: [],
    });
    expect(storage.values.has(getProactivePresentationStorageKey('user-a'))).toBe(true);
    expect(storage.values.has(getProactivePresentationStorageKey('user-b'))).toBe(false);
  });

  it('serializes concurrent dismiss mutations so neither key is lost', async () => {
    const storage = createMemoryStorage();
    const store = createProactivePresentationStore(storage);

    await Promise.all([
      store.dismiss('user-a', 'insight-a'),
      store.dismiss('user-a', 'insight-b'),
    ]);

    expect(new Set((await store.read('user-a')).dismissedKeys)).toEqual(
      new Set(['insight-a', 'insight-b']),
    );
  });

  it('rejects invalid identities and timestamps instead of persisting ambiguous state', async () => {
    const storage = createMemoryStorage();
    const store = createProactivePresentationStore(storage);

    await expect(store.recordShown('user-a', 'not-a-date')).rejects.toThrow(
      'shownAt must be a valid timestamp',
    );
    await expect(store.dismiss('user-a', '   ')).rejects.toThrow(
      'Proactive insight key is invalid',
    );
    expect(() => getProactivePresentationStorageKey('   ')).toThrow(
      'requires a user id',
    );
  });

  it('clears the account-scoped record', async () => {
    const storage = createMemoryStorage();
    const store = createProactivePresentationStore(storage);
    await store.dismiss('user-a', 'insight-a');

    await store.clear('user-a');

    expect(await store.read('user-a')).toEqual({
      schemaVersion: 1,
      lastShownAt: null,
      dismissedKeys: [],
    });
  });
});
