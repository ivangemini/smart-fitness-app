import type { KnowledgeLearningState } from '@/api/knowledge/learningContracts';
import { parseKnowledgeLearningState } from '@/api/knowledge/learningParsers';

export const KNOWLEDGE_LEARNING_LOCAL_SCHEMA_VERSION =
  'knowledge-learning-local-v1' as const;
export const KNOWLEDGE_LEARNING_MAX_PENDING_READS = 50;
export const KNOWLEDGE_LEARNING_MAX_RETRY_ATTEMPTS = 5;
const MAX_CACHED_STATES = 500;
const STORAGE_PREFIX = '@smart-fitness/knowledge-learning/v1/';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type KnowledgeLearningStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

export type PendingKnowledgeRead = {
  operationId: string;
  articleVersionId: string;
  createdAt: string;
  attempts: number;
};

export type KnowledgeLearningLocalSnapshot = {
  schemaVersion: typeof KNOWLEDGE_LEARNING_LOCAL_SCHEMA_VERSION;
  states: KnowledgeLearningState[];
  pendingReads: PendingKnowledgeRead[];
};

const emptySnapshot = (): KnowledgeLearningLocalSnapshot => ({
  schemaVersion: KNOWLEDGE_LEARNING_LOCAL_SCHEMA_VERSION,
  states: [],
  pendingReads: [],
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIsoDateTime = (value: unknown): value is string =>
  typeof value === 'string' && value.includes('T') && !Number.isNaN(Date.parse(value));

const parsePendingRead = (value: unknown): PendingKnowledgeRead | null => {
  if (!isRecord(value)) return null;
  if (
    typeof value.operationId !== 'string' ||
    value.operationId.length < 1 ||
    value.operationId.length > 120 ||
    typeof value.articleVersionId !== 'string' ||
    !UUID_PATTERN.test(value.articleVersionId) ||
    !isIsoDateTime(value.createdAt) ||
    typeof value.attempts !== 'number' ||
    !Number.isInteger(value.attempts) ||
    value.attempts < 0 ||
    value.attempts > KNOWLEDGE_LEARNING_MAX_RETRY_ATTEMPTS
  ) {
    return null;
  }
  return {
    operationId: value.operationId,
    articleVersionId: value.articleVersionId,
    createdAt: value.createdAt,
    attempts: value.attempts,
  };
};

const parseSnapshot = (raw: string | null): KnowledgeLearningLocalSnapshot => {
  if (!raw) return emptySnapshot();
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !isRecord(value) ||
      value.schemaVersion !== KNOWLEDGE_LEARNING_LOCAL_SCHEMA_VERSION ||
      !Array.isArray(value.states) ||
      !Array.isArray(value.pendingReads)
    ) {
      return emptySnapshot();
    }

    const stateByVersion = new Map<string, KnowledgeLearningState>();
    for (const candidate of value.states.slice(0, MAX_CACHED_STATES * 2)) {
      try {
        const state = parseKnowledgeLearningState(candidate);
        const existing = stateByVersion.get(state.articleVersionId);
        if (!existing || state.revision >= existing.revision) {
          stateByVersion.set(state.articleVersionId, state);
        }
      } catch {
        // Local cache is non-authoritative. Invalid entries are discarded.
      }
    }

    const pendingByVersion = new Map<string, PendingKnowledgeRead>();
    for (const candidate of value.pendingReads.slice(-KNOWLEDGE_LEARNING_MAX_PENDING_READS * 2)) {
      const pending = parsePendingRead(candidate);
      if (!pending) continue;
      const existing = pendingByVersion.get(pending.articleVersionId);
      if (!existing || pending.createdAt < existing.createdAt) {
        pendingByVersion.set(pending.articleVersionId, pending);
      }
    }

    return {
      schemaVersion: KNOWLEDGE_LEARNING_LOCAL_SCHEMA_VERSION,
      states: [...stateByVersion.values()].slice(-MAX_CACHED_STATES),
      pendingReads: [...pendingByVersion.values()].slice(
        -KNOWLEDGE_LEARNING_MAX_PENDING_READS,
      ),
    };
  } catch {
    return emptySnapshot();
  }
};

export const getKnowledgeLearningStorageKey = (userId: string): string =>
  `${STORAGE_PREFIX}${userId}`;

const keyForUser = (userId: string): string => {
  if (!UUID_PATTERN.test(userId)) {
    throw new Error('Knowledge learning cache user identifier is invalid.');
  }
  return getKnowledgeLearningStorageKey(userId);
};

export const createKnowledgeLearningStore = (storage: KnowledgeLearningStorage) => {
  let mutationTail: Promise<void> = Promise.resolve();

  const read = async (userId: string): Promise<KnowledgeLearningLocalSnapshot> => {
    await mutationTail;
    return parseSnapshot(await storage.getItem(keyForUser(userId)));
  };

  const write = async (
    userId: string,
    snapshot: KnowledgeLearningLocalSnapshot,
  ): Promise<void> => {
    await storage.setItem(keyForUser(userId), JSON.stringify(snapshot));
  };

  const mutate = async (
    userId: string,
    updater: (
      snapshot: KnowledgeLearningLocalSnapshot,
    ) => KnowledgeLearningLocalSnapshot,
  ): Promise<KnowledgeLearningLocalSnapshot> => {
    let result = emptySnapshot();
    const operation = mutationTail.then(async () => {
      const current = parseSnapshot(await storage.getItem(keyForUser(userId)));
      result = updater(current);
      await write(userId, result);
    });
    mutationTail = operation.then(
      () => undefined,
      () => undefined,
    );
    await operation;
    return result;
  };

  const mergeState = (userId: string, state: KnowledgeLearningState) =>
    mutate(userId, (snapshot) => {
      const byVersion = new Map(
        snapshot.states.map((item) => [item.articleVersionId, item] as const),
      );
      const existing = byVersion.get(state.articleVersionId);
      if (!existing || state.revision >= existing.revision) {
        byVersion.set(state.articleVersionId, state);
      }
      return {
        ...snapshot,
        states: [...byVersion.values()].slice(-MAX_CACHED_STATES),
      };
    });

  const enqueueRead = (
    userId: string,
    input: Omit<PendingKnowledgeRead, 'attempts'>,
  ) =>
    mutate(userId, (snapshot) => {
      if (
        snapshot.pendingReads.some(
          (item) => item.articleVersionId === input.articleVersionId,
        )
      ) {
        return snapshot;
      }
      return {
        ...snapshot,
        pendingReads: [
          ...snapshot.pendingReads,
          { ...input, attempts: 0 },
        ].slice(-KNOWLEDGE_LEARNING_MAX_PENDING_READS),
      };
    });

  const removeRead = (userId: string, operationId: string) =>
    mutate(userId, (snapshot) => ({
      ...snapshot,
      pendingReads: snapshot.pendingReads.filter(
        (item) => item.operationId !== operationId,
      ),
    }));

  const incrementReadAttempt = (userId: string, operationId: string) =>
    mutate(userId, (snapshot) => ({
      ...snapshot,
      pendingReads: snapshot.pendingReads.map((item) =>
        item.operationId === operationId
          ? {
              ...item,
              attempts: Math.min(
                KNOWLEDGE_LEARNING_MAX_RETRY_ATTEMPTS,
                item.attempts + 1,
              ),
            }
          : item,
      ),
    }));

  const clear = async (userId: string): Promise<void> => {
    const operation = mutationTail.then(() => storage.removeItem(keyForUser(userId)));
    mutationTail = operation.then(
      () => undefined,
      () => undefined,
    );
    await operation;
  };

  return { clear, enqueueRead, incrementReadAttempt, mergeState, read, removeRead };
};
