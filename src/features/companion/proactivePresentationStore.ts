import type { StorageAdapter } from '@/storage';

const STORAGE_PREFIX = 'smart-fitness:proactive-coach-presentation:v1';
const MAX_DISMISSED_KEYS = 32;
const MAX_INSIGHT_KEY_LENGTH = 240;

export type ProactivePresentationState = {
  schemaVersion: 1;
  lastShownAt: string | null;
  dismissedKeys: string[];
};

const createEmptyState = (): ProactivePresentationState => ({
  schemaVersion: 1,
  lastShownAt: null,
  dismissedKeys: [],
});

const normalizeUserId = (userId: string) => {
  const normalized = userId.trim();
  if (!normalized) {
    throw new Error('Proactive presentation storage requires a user id');
  }
  return normalized;
};

export const getProactivePresentationStorageKey = (userId: string): string =>
  `${STORAGE_PREFIX}:${encodeURIComponent(normalizeUserId(userId))}`;

const normalizeTimestamp = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
};

const normalizeInsightKey = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized && normalized.length <= MAX_INSIGHT_KEY_LENGTH
    ? normalized
    : null;
};

const normalizeDismissedKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const normalized = value
    .map(normalizeInsightKey)
    .filter((key): key is string => key !== null);
  return Array.from(new Set(normalized)).slice(0, MAX_DISMISSED_KEYS);
};

export const parseProactivePresentationState = (
  raw: string | null,
): ProactivePresentationState => {
  if (!raw) return createEmptyState();
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (value.schemaVersion !== 1) return createEmptyState();
    return {
      schemaVersion: 1,
      lastShownAt: normalizeTimestamp(value.lastShownAt),
      dismissedKeys: normalizeDismissedKeys(value.dismissedKeys),
    };
  } catch {
    return createEmptyState();
  }
};

const serialize = (state: ProactivePresentationState) => JSON.stringify(state);

export type ProactivePresentationStore = {
  read(userId: string): Promise<ProactivePresentationState>;
  recordShown(userId: string, shownAt: string): Promise<ProactivePresentationState>;
  dismiss(userId: string, insightKey: string): Promise<ProactivePresentationState>;
  clear(userId: string): Promise<void>;
};

export const createProactivePresentationStore = (
  storage: StorageAdapter,
): ProactivePresentationStore => {
  const mutations = new Map<string, Promise<void>>();

  const read = async (userId: string) => {
    const storageKey = getProactivePresentationStorageKey(userId);
    return parseProactivePresentationState(await storage.read(storageKey));
  };

  const mutate = async (
    userId: string,
    update: (state: ProactivePresentationState) => ProactivePresentationState,
  ) => {
    const storageKey = getProactivePresentationStorageKey(userId);
    let nextState = createEmptyState();
    const previous = mutations.get(storageKey) ?? Promise.resolve();
    const current = previous
      .catch(() => undefined)
      .then(async () => {
        const state = parseProactivePresentationState(await storage.read(storageKey));
        nextState = update(state);
        await storage.write(storageKey, serialize(nextState));
      });
    mutations.set(storageKey, current);
    try {
      await current;
      return nextState;
    } finally {
      if (mutations.get(storageKey) === current) mutations.delete(storageKey);
    }
  };

  return {
    read,
    recordShown: (userId, shownAt) => {
      const normalizedShownAt = normalizeTimestamp(shownAt);
      if (!normalizedShownAt) {
        return Promise.reject(
          new Error('Proactive presentation shownAt must be a valid timestamp'),
        );
      }
      return mutate(userId, (state) => ({ ...state, lastShownAt: normalizedShownAt }));
    },
    dismiss: (userId, insightKey) => {
      const normalizedKey = normalizeInsightKey(insightKey);
      if (!normalizedKey) {
        return Promise.reject(new Error('Proactive insight key is invalid'));
      }
      return mutate(userId, (state) => ({
        ...state,
        dismissedKeys: [
          normalizedKey,
          ...state.dismissedKeys.filter((key) => key !== normalizedKey),
        ].slice(0, MAX_DISMISSED_KEYS),
      }));
    },
    clear: (userId) => storage.remove(getProactivePresentationStorageKey(userId)),
  };
};
