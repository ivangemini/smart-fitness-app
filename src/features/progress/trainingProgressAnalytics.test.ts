import { describe, expect, it } from 'vitest';

import type { WorkoutSession, WorkoutSet } from '@/types';

import {
  buildTrainingProgressAnalytics,
  calculateComparableEstimated1Rm,
} from './trainingProgressAnalytics';

const makeSet = ({
  completed = true,
  exerciseId = 'bench',
  exerciseName = 'Bench Press',
  id,
  reps,
  weight,
}: {
  completed?: boolean;
  exerciseId?: string;
  exerciseName?: string;
  id: string;
  reps: number;
  weight: number;
}): WorkoutSet => ({
  id,
  exerciseId,
  exerciseName,
  weight,
  reps,
  completed,
});

const makeSession = ({
  finishedAt,
  id,
  sets,
}: {
  finishedAt: string;
  id: string;
  sets: WorkoutSet[];
}): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets,
});

describe('trainingProgressAnalytics', () => {
  it('builds bounded frequency, volume, evidence, and strength trends', () => {
    const analytics = buildTrainingProgressAnalytics(
      [
        makeSession({
          id: 'early',
          finishedAt: '2026-08-01T10:00:00.000Z',
          sets: [makeSet({ id: 'early-bench', reps: 5, weight: 100 })],
        }),
        makeSession({
          id: 'recent',
          finishedAt: '2026-08-15T10:00:00.000Z',
          sets: [makeSet({ id: 'recent-bench', reps: 5, weight: 110 })],
        }),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 28 },
    );

    expect(analytics.frequency).toEqual({
      sessionCount: 2,
      activeDayCount: 2,
      workoutsPerWeek: 0.5,
    });
    expect(analytics.volume).toEqual({
      totalVolume: 1050,
      previousHalfVolume: 500,
      recentHalfVolume: 550,
      comparableSessionCount: 2,
      trend: 'up',
    });
    expect(analytics.evidence).toEqual({
      sessionCount: 2,
      workingSetCount: 2,
      weightedSetCount: 2,
      estimated1RmSetCount: 2,
    });
    expect(analytics.exercises[0]).toMatchObject({
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      sessionCount: 2,
      workingSetCount: 2,
      periodBestWeight: 110,
      previousHalfBestEstimated1Rm: 116.67,
      recentHalfBestEstimated1Rm: 128.33,
      estimated1RmTrend: 'up',
    });
  });

  it('keeps all-time records separate from the selected period', () => {
    const analytics = buildTrainingProgressAnalytics(
      [
        makeSession({
          id: 'old-pr',
          finishedAt: '2026-06-01T10:00:00.000Z',
          sets: [makeSet({ id: 'old-pr-bench', reps: 3, weight: 120 })],
        }),
        makeSession({
          id: 'period',
          finishedAt: '2026-08-15T10:00:00.000Z',
          sets: [makeSet({ id: 'period-bench', reps: 5, weight: 110 })],
        }),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 28 },
    );

    expect(analytics.frequency.sessionCount).toBe(1);
    expect(analytics.exercises[0]).toMatchObject({
      periodBestWeight: 110,
      periodBestEstimated1Rm: 128.33,
      allTimeBestWeight: 120,
      allTimeBestEstimated1Rm: 132,
      allTimeEstimated1RmRecordAt: '2026-06-01T10:00:00.000Z',
    });
  });

  it('does not invent estimated 1RM for bodyweight, invalid, or high-rep sets', () => {
    expect(calculateComparableEstimated1Rm(0, 8)).toBeNull();
    expect(calculateComparableEstimated1Rm(100, 0)).toBeNull();
    expect(calculateComparableEstimated1Rm(100, 13)).toBeNull();
    expect(calculateComparableEstimated1Rm(100, 5)).toBe(116.67);

    const analytics = buildTrainingProgressAnalytics(
      [
        makeSession({
          id: 'bodyweight',
          finishedAt: '2026-08-15T10:00:00.000Z',
          sets: [
            makeSet({
              id: 'pull-up',
              exerciseId: 'pull-up',
              exerciseName: 'Pull-up',
              reps: 10,
              weight: 0,
            }),
            makeSet({ id: 'high-rep', reps: 15, weight: 60 }),
            makeSet({ id: 'not-completed', reps: 5, weight: 200, completed: false }),
          ],
        }),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 28 },
    );

    expect(analytics.evidence).toMatchObject({
      workingSetCount: 2,
      weightedSetCount: 1,
      estimated1RmSetCount: 0,
    });
    expect(analytics.exercises.find((exercise) => exercise.exerciseId === 'pull-up')).toMatchObject({
      periodBestWeight: null,
      periodBestEstimated1Rm: null,
      estimated1RmTrend: 'insufficient_data',
    });
  });

  it('clamps period and exercise-result bounds', () => {
    const sets = Array.from({ length: 60 }, (_, index) =>
      makeSet({
        id: `set-${index}`,
        exerciseId: `exercise-${index}`,
        exerciseName: `Exercise ${index}`,
        reps: 5,
        weight: 20 + index,
      }),
    );
    const analytics = buildTrainingProgressAnalytics(
      [makeSession({ id: 'many', finishedAt: '2026-08-18T10:00:00.000Z', sets })],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 999, maxExercises: 999 },
    );

    expect(analytics.period.days).toBe(180);
    expect(analytics.exercises).toHaveLength(50);
  });

  it('returns explicit insufficient-data facts when the period has no sessions', () => {
    const analytics = buildTrainingProgressAnalytics([], {
      endAt: '2026-08-18T12:00:00.000Z',
      periodDays: 28,
    });

    expect(analytics.frequency.sessionCount).toBe(0);
    expect(analytics.volume).toMatchObject({
      totalVolume: 0,
      previousHalfVolume: null,
      recentHalfVolume: null,
      comparableSessionCount: 0,
      trend: 'insufficient_data',
    });
    expect(analytics.exercises).toEqual([]);
  });

  it('rejects an invalid analysis anchor instead of silently using wall-clock time', () => {
    expect(() =>
      buildTrainingProgressAnalytics([], {
        endAt: 'not-a-date',
      }),
    ).toThrow('valid endAt timestamp');
  });
});
