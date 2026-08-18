import { describe, expect, it } from 'vitest';

import type { WorkoutSession, WorkoutSet } from '@/types';

import { buildProgressHighlightAnalytics } from './highlightAnalytics';

const makeSet = (
  id: string,
  exerciseId: string,
  exerciseName: string,
  weight: number,
): WorkoutSet => ({ id, exerciseId, exerciseName, weight, reps: 5, completed: true });

const makeSession = (id: string, finishedAt: string, sets: WorkoutSet[]): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets,
});

describe('buildProgressHighlightAnalytics', () => {
  it('separates recent records and directional strength signals', () => {
    const analytics = buildProgressHighlightAnalytics(
      [
        makeSession('early', '2026-08-01T10:00:00.000Z', [
          makeSet('bench-early', 'bench', 'Bench Press', 100),
          makeSet('row-early', 'row', 'Barbell Row', 100),
        ]),
        makeSession('recent', '2026-08-15T10:00:00.000Z', [
          makeSet('bench-recent', 'bench', 'Bench Press', 110),
          makeSet('row-recent', 'row', 'Barbell Row', 90),
        ]),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 28 },
    );

    expect(analytics.counts).toMatchObject({ improving: 1, declining: 1 });
    expect(analytics.improvingExercises[0]).toMatchObject({ exerciseId: 'bench', trend: 'up' });
    expect(analytics.decliningExercises[0]).toMatchObject({ exerciseId: 'row', trend: 'down' });
    expect(analytics.recordExercises.map((item) => item.exerciseId)).toContain('bench');
    expect(analytics.evidence).toEqual({ sessionCount: 2, estimated1RmSetCount: 4 });
  });

  it('does not report an all-time record whose record timestamp is outside the selected period', () => {
    const analytics = buildProgressHighlightAnalytics(
      [
        makeSession('old', '2026-06-01T10:00:00.000Z', [
          makeSet('old-bench', 'bench', 'Bench Press', 120),
        ]),
        makeSession('period', '2026-08-15T10:00:00.000Z', [
          makeSet('period-bench', 'bench', 'Bench Press', 110),
        ]),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 28 },
    );

    expect(analytics.counts.records).toBe(0);
    expect(analytics.recordExercises).toEqual([]);
  });

  it('clamps the detail period to 180 days', () => {
    const analytics = buildProgressHighlightAnalytics([], {
      endAt: '2026-08-18T12:00:00.000Z',
      periodDays: 999,
    });
    expect(analytics.period.days).toBe(180);
  });
});
