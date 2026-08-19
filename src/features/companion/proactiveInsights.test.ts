import { describe, expect, it } from 'vitest';

import type { WorkoutSession, WorkoutSet } from '@/types';

import { selectProactiveInsight } from './proactiveInsights';

const makeSet = (
  id: string,
  exerciseId: string,
  exerciseName: string,
  weight: number,
): WorkoutSet => ({
  id,
  exerciseId,
  exerciseName,
  weight,
  reps: 5,
  completed: true,
});

const makeSession = (
  id: string,
  finishedAt: string,
  sets: WorkoutSet[] = [],
): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets,
});

const twoSets = (prefix: string, weight: number, exerciseId = 'bench', exerciseName = 'Bench Press') => [
  makeSet(`${prefix}-1`, exerciseId, exerciseName, weight),
  makeSet(`${prefix}-2`, exerciseId, exerciseName, weight),
];

describe('selectProactiveInsight', () => {
  it('selects one meaningful strength progression insight from sufficient evidence', () => {
    const result = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions: [
        makeSession('early-1', '2026-07-25T10:00:00.000Z', twoSets('early-1', 100)),
        makeSession('early-2', '2026-07-30T10:00:00.000Z', twoSets('early-2', 100)),
        makeSession('recent-1', '2026-08-10T10:00:00.000Z', twoSets('recent-1', 108)),
        makeSession('recent-2', '2026-08-17T10:00:00.000Z', twoSets('recent-2', 110)),
      ],
    });

    expect(result).toMatchObject({
      kind: 'strength_progress',
      exerciseId: 'bench',
      periodDays: 28,
      evidence: {
        sessionCount: 4,
        workingSetCount: 8,
      },
    });
    expect(result?.kind === 'strength_progress' && result.evidence.relativeChange).toBeGreaterThanOrEqual(0.05);
  });

  it('prioritizes strength progress over a simultaneous positive consistency signal', () => {
    const result = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions: [
        makeSession('early-1', '2026-07-25T10:00:00.000Z', twoSets('early-1', 100)),
        makeSession('early-2', '2026-07-30T10:00:00.000Z', twoSets('early-2', 100)),
        makeSession('recent-1', '2026-08-08T10:00:00.000Z', twoSets('recent-1', 108)),
        makeSession('recent-2', '2026-08-11T10:00:00.000Z', twoSets('recent-2', 110)),
        makeSession('recent-3', '2026-08-14T10:00:00.000Z'),
        makeSession('recent-4', '2026-08-18T10:00:00.000Z'),
      ],
    });

    expect(result?.kind).toBe('strength_progress');
  });

  it('uses a normalized exercise-name fallback for legacy sets without an exercise id', () => {
    const sessions = [
      makeSession('early-1', '2026-07-25T10:00:00.000Z', twoSets('early-1', 100, '', 'Bench Press')),
      makeSession('early-2', '2026-07-30T10:00:00.000Z', twoSets('early-2', 100, '', 'Bench Press')),
      makeSession('recent-1', '2026-08-10T10:00:00.000Z', twoSets('recent-1', 108, '', 'Bench Press')),
      makeSession('recent-2', '2026-08-17T10:00:00.000Z', twoSets('recent-2', 110, '', 'Bench Press')),
    ];
    const result = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions,
    });

    expect(result?.kind).toBe('strength_progress');
    expect(result?.key).toContain('name:bench_press');
    expect(
      selectProactiveInsight({
        nowAt: '2026-08-19T12:00:00.000Z',
        sessions,
        presentation: { dismissedKeys: result ? [result.key] : [] },
      }),
    ).toBeNull();
  });

  it('requires a larger sample before surfacing stagnation', () => {
    const result = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions: [
        makeSession('early-1', '2026-07-24T10:00:00.000Z', twoSets('early-1', 100)),
        makeSession('early-2', '2026-07-28T10:00:00.000Z', twoSets('early-2', 100)),
        makeSession('early-3', '2026-08-02T10:00:00.000Z', twoSets('early-3', 100)),
        makeSession('recent-1', '2026-08-08T10:00:00.000Z', twoSets('recent-1', 101)),
        makeSession('recent-2', '2026-08-13T10:00:00.000Z', twoSets('recent-2', 101)),
        makeSession('recent-3', '2026-08-18T10:00:00.000Z', twoSets('recent-3', 101)),
      ],
    });

    expect(result).toMatchObject({
      kind: 'strength_stagnation',
      exerciseId: 'bench',
      evidence: {
        sessionCount: 6,
        workingSetCount: 12,
      },
    });
  });

  it('surfaces only positive consistency changes and counts unique active days', () => {
    const result = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions: [
        makeSession('previous-1', '2026-07-25T10:00:00.000Z'),
        makeSession('previous-duplicate', '2026-07-25T18:00:00.000Z'),
        makeSession('recent-1', '2026-08-08T10:00:00.000Z'),
        makeSession('recent-2', '2026-08-11T10:00:00.000Z'),
        makeSession('recent-3', '2026-08-14T10:00:00.000Z'),
        makeSession('recent-4', '2026-08-18T10:00:00.000Z'),
      ],
    });

    expect(result).toEqual({
      schemaVersion: 1,
      kind: 'consistency_up',
      key: 'consistency_up:1:4',
      periodDays: 28,
      evidence: { previousActiveDays: 1, recentActiveDays: 4 },
    });
  });

  it('enforces a seven-day global presentation cooldown', () => {
    const result = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      presentation: { lastShownAt: '2026-08-15T12:00:00.000Z' },
      sessions: [
        makeSession('early-1', '2026-07-25T10:00:00.000Z', twoSets('early-1', 100)),
        makeSession('early-2', '2026-07-30T10:00:00.000Z', twoSets('early-2', 100)),
        makeSession('recent-1', '2026-08-10T10:00:00.000Z', twoSets('recent-1', 110)),
        makeSession('recent-2', '2026-08-17T10:00:00.000Z', twoSets('recent-2', 110)),
      ],
    });

    expect(result).toBeNull();
  });

  it('suppresses future or malformed presentation timestamps instead of risking spam', () => {
    expect(
      selectProactiveInsight({
        nowAt: '2026-08-19T12:00:00.000Z',
        sessions: [],
        presentation: { lastShownAt: '2026-08-20T12:00:00.000Z' },
      }),
    ).toBeNull();
    expect(
      selectProactiveInsight({
        nowAt: '2026-08-19T12:00:00.000Z',
        sessions: [],
        presentation: { lastShownAt: 'not-a-date' },
      }),
    ).toBeNull();
  });

  it('suppresses a dismissed stable insight key and does not invent a negative consistency insight', () => {
    const sessions = [
      makeSession('early-1', '2026-07-24T10:00:00.000Z', twoSets('early-1', 100)),
      makeSession('early-2', '2026-07-28T10:00:00.000Z', twoSets('early-2', 100)),
      makeSession('early-3', '2026-08-02T10:00:00.000Z', twoSets('early-3', 100)),
      makeSession('recent-1', '2026-08-08T10:00:00.000Z', twoSets('recent-1', 101)),
      makeSession('recent-2', '2026-08-13T10:00:00.000Z', twoSets('recent-2', 101)),
      makeSession('recent-3', '2026-08-18T10:00:00.000Z', twoSets('recent-3', 101)),
    ];
    const first = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions,
    });
    expect(first?.kind).toBe('strength_stagnation');

    const suppressed = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions,
      presentation: { dismissedKeys: first ? [first.key] : [] },
    });
    expect(suppressed).toBeNull();
  });

  it('rejects an invalid analysis anchor', () => {
    expect(() =>
      selectProactiveInsight({ sessions: [], nowAt: 'not-a-date' }),
    ).toThrow('selectProactiveInsight requires a valid nowAt timestamp');
  });
});
