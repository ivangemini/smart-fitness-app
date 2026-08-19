import { describe, expect, it, vi } from 'vitest';

import type { WorkoutSession } from '@/types';

import type {
  ProactivePresentationState,
  ProactivePresentationStore,
} from './proactivePresentationStore';
import { resolveProactiveInsightForPresentation } from './proactiveInsightPresentation';

const session = (id: string, finishedAt: string): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets: [],
});

const sessions: WorkoutSession[] = [
  session('previous', '2026-08-01T10:00:00.000Z'),
  session('recent-1', '2026-08-08T10:00:00.000Z'),
  session('recent-2', '2026-08-11T10:00:00.000Z'),
  session('recent-3', '2026-08-14T10:00:00.000Z'),
  session('recent-4', '2026-08-18T10:00:00.000Z'),
];

const emptyState = (): ProactivePresentationState => ({
  schemaVersion: 1,
  lastShownAt: null,
  dismissedKeys: [],
});

const createStore = (
  overrides: Partial<ProactivePresentationStore> = {},
): ProactivePresentationStore => ({
  read: vi.fn(async () => emptyState()),
  recordShown: vi.fn(async (_userId, shownAt) => ({
    ...emptyState(),
    lastShownAt: shownAt,
  })),
  dismiss: vi.fn(async (_userId, insightKey) => ({
    ...emptyState(),
    dismissedKeys: [insightKey],
  })),
  clear: vi.fn(async () => undefined),
  ...overrides,
});

describe('proactive insight presentation gate', () => {
  it('persists cooldown before returning an eligible insight', async () => {
    const store = createStore();
    const nowAt = '2026-08-19T12:00:00.000Z';

    const insight = await resolveProactiveInsightForPresentation({
      nowAt,
      sessions,
      store,
      userId: 'user-a',
    });

    expect(insight?.kind).toBe('consistency_up');
    expect(store.recordShown).toHaveBeenCalledWith('user-a', nowAt);
  });

  it('fails closed when cooldown persistence fails', async () => {
    const store = createStore({
      recordShown: vi.fn(async () => {
        throw new Error('storage unavailable');
      }),
    });

    await expect(
      resolveProactiveInsightForPresentation({
        nowAt: '2026-08-19T12:00:00.000Z',
        sessions,
        store,
        userId: 'user-a',
      }),
    ).resolves.toBeNull();
  });

  it('does not write a new cooldown when the stored cooldown suppresses selection', async () => {
    const suppressedState: ProactivePresentationState = {
      schemaVersion: 1,
      lastShownAt: '2026-08-18T12:00:00.000Z',
      dismissedKeys: [],
    };
    const store = createStore({
      read: vi.fn(async () => suppressedState),
    });

    const insight = await resolveProactiveInsightForPresentation({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions,
      store,
      userId: 'user-a',
    });

    expect(insight).toBeNull();
    expect(store.recordShown).not.toHaveBeenCalled();
  });
});
