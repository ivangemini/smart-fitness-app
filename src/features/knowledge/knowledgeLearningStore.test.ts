import { describe, expect, it } from 'vitest';

import {
  createKnowledgeLearningStore,
  type KnowledgeLearningStorage,
} from './knowledgeLearningStore';

const userId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const articleVersionId = '22222222-2222-4222-8222-222222222222';

const createMemoryStorage = (): KnowledgeLearningStorage => {
  const values = new Map<string, string>();
  return {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
    removeItem: async (key) => {
      values.delete(key);
    },
  };
};

const state = (revision: number) => ({
  schemaVersion: 'knowledge-learning-state-v1' as const,
  articleId: '11111111-1111-4111-8111-111111111111',
  articleVersionId,
  locale: 'en' as const,
  version: 1,
  state: 'read' as const,
  evidenceState: 'read' as const,
  readAt: '2026-08-20T08:00:00.000Z',
  understoodAt: null,
  understoodQuizItemIds: [],
  revision,
  contentAvailable: true,
  latestArticleVersionId: articleVersionId,
  latestVersion: 1,
  refreshReason: null,
});

describe('Knowledge learning local store', () => {
  it('compacts duplicate pending read evidence for the same exact version', async () => {
    const store = createKnowledgeLearningStore(createMemoryStorage());
    await store.enqueueRead(userId, {
      operationId: 'read-one',
      articleVersionId,
      createdAt: '2026-08-20T08:00:00.000Z',
    });
    await store.enqueueRead(userId, {
      operationId: 'read-two',
      articleVersionId,
      createdAt: '2026-08-20T08:01:00.000Z',
    });

    const snapshot = await store.read(userId);
    expect(snapshot.pendingReads).toHaveLength(1);
    expect(snapshot.pendingReads[0]?.operationId).toBe('read-one');
  });

  it('never lets a stale cached projection replace a newer server revision', async () => {
    const store = createKnowledgeLearningStore(createMemoryStorage());
    await store.mergeState(userId, state(4));
    await store.mergeState(userId, state(2));

    const snapshot = await store.read(userId);
    expect(snapshot.states).toHaveLength(1);
    expect(snapshot.states[0]?.revision).toBe(4);
  });

  it('partitions and clears account-scoped learning data independently', async () => {
    const storage = createMemoryStorage();
    const store = createKnowledgeLearningStore(storage);
    const secondUserId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    await store.mergeState(userId, state(1));
    await store.mergeState(secondUserId, state(1));

    await store.clear(userId);

    expect((await store.read(userId)).states).toHaveLength(0);
    expect((await store.read(secondUserId)).states).toHaveLength(1);
  });
});
