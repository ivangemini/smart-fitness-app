import { describe, expect, it } from 'vitest';

import type { WorkoutRpe, WorkoutSession, WorkoutSet } from '@/types';

import { buildTrainingSignalAnalytics } from './trainingSignals';

const makeSet = ({
  actualRpe,
  exerciseId = 'bench',
  exerciseName = 'Bench Press',
  id,
  reps = 5,
  weight,
}: {
  actualRpe?: WorkoutRpe;
  exerciseId?: string;
  exerciseName?: string;
  id: string;
  reps?: number;
  weight: number;
}): WorkoutSet => ({
  id,
  exerciseId,
  exerciseName,
  weight,
  reps,
  completed: true,
  ...(actualRpe !== undefined ? { actualRpe } : {}),
});

const makeSession = (id: string, finishedAt: string, sets: WorkoutSet[]): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets,
});

describe('buildTrainingSignalAnalytics', () => {
  it('reports recorded RPE separately from a conservative plateau signal', () => {
    const analytics = buildTrainingSignalAnalytics(
      [
        makeSession('s1', '2026-07-20T10:00:00.000Z', [makeSet({ id: 'a', weight: 100, actualRpe: 7 })]),
        makeSession('s2', '2026-07-27T10:00:00.000Z', [makeSet({ id: 'b', weight: 100, actualRpe: 7 })]),
        makeSession('s3', '2026-08-10T10:00:00.000Z', [makeSet({ id: 'c', weight: 100, actualRpe: 8 })]),
        makeSession('s4', '2026-08-17T10:00:00.000Z', [makeSet({ id: 'd', weight: 100, actualRpe: 8 })]),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 42 },
    );

    expect(analytics.rpe).toMatchObject({
      workingSetCount: 4,
      recordedSetCount: 4,
      coverage: 1,
      averageActualRpe: 7.5,
      trend: 'higher',
    });
    expect(analytics.exercises[0]).toMatchObject({
      exerciseId: 'bench',
      comparableSessionCount: 4,
      progressSignal: 'plateau',
      recordedRpeSetCount: 4,
      averageActualRpe: 7.5,
    });
    expect(analytics.exercises[0].comparableSpanDays).toBeGreaterThanOrEqual(21);
    expect(analytics.exercises[0].estimated1RmChangeRatio).toBe(0);
  });

  it('distinguishes progression from plateau when recent best e1RM clears the threshold', () => {
    const analytics = buildTrainingSignalAnalytics(
      [
        makeSession('s1', '2026-07-20T10:00:00.000Z', [makeSet({ id: 'a', weight: 100 })]),
        makeSession('s2', '2026-07-27T10:00:00.000Z', [makeSet({ id: 'b', weight: 100 })]),
        makeSession('s3', '2026-08-10T10:00:00.000Z', [makeSet({ id: 'c', weight: 105 })]),
        makeSession('s4', '2026-08-17T10:00:00.000Z', [makeSet({ id: 'd', weight: 105 })]),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 42 },
    );

    expect(analytics.exercises[0]).toMatchObject({
      progressSignal: 'progressing',
      previousBestEstimated1Rm: 116.67,
      recentBestEstimated1Rm: 122.5,
      estimated1RmChangeRatio: 0.05,
    });
  });

  it('keeps plateau status insufficient with too few sessions or too short a span', () => {
    const tooFew = buildTrainingSignalAnalytics(
      [
        makeSession('s1', '2026-08-01T10:00:00.000Z', [makeSet({ id: 'a', weight: 100 })]),
        makeSession('s2', '2026-08-10T10:00:00.000Z', [makeSet({ id: 'b', weight: 100 })]),
        makeSession('s3', '2026-08-17T10:00:00.000Z', [makeSet({ id: 'c', weight: 100 })]),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 42 },
    );
    expect(tooFew.exercises[0].progressSignal).toBe('insufficient_data');

    const tooShort = buildTrainingSignalAnalytics(
      [
        makeSession('s1', '2026-08-10T10:00:00.000Z', [makeSet({ id: 'd', weight: 100 })]),
        makeSession('s2', '2026-08-12T10:00:00.000Z', [makeSet({ id: 'e', weight: 100 })]),
        makeSession('s3', '2026-08-14T10:00:00.000Z', [makeSet({ id: 'f', weight: 100 })]),
        makeSession('s4', '2026-08-17T10:00:00.000Z', [makeSet({ id: 'g', weight: 100 })]),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 42 },
    );
    expect(tooShort.exercises[0].progressSignal).toBe('insufficient_data');
    expect(tooShort.exercises[0].comparableSpanDays).toBe(7);
  });

  it('does not invent RPE when the user did not record it', () => {
    const analytics = buildTrainingSignalAnalytics(
      [makeSession('s1', '2026-08-17T10:00:00.000Z', [makeSet({ id: 'a', weight: 100 })])],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 42 },
    );

    expect(analytics.rpe).toEqual({
      workingSetCount: 1,
      recordedSetCount: 0,
      coverage: 0,
      averageActualRpe: null,
      previousHalfAverageActualRpe: null,
      recentHalfAverageActualRpe: null,
      trend: 'insufficient_data',
    });
    expect(analytics.exercises[0].recordedRpeSetCount).toBe(0);
    expect(analytics.exercises[0].averageActualRpe).toBeNull();
  });

  it('clamps analysis bounds and rejects invalid anchors', () => {
    const analytics = buildTrainingSignalAnalytics([], {
      endAt: '2026-08-18T12:00:00.000Z',
      periodDays: 999,
      maxExercises: 999,
    });
    expect(analytics.period.days).toBe(180);

    expect(() =>
      buildTrainingSignalAnalytics([], { endAt: 'invalid' }),
    ).toThrow('valid endAt timestamp');
  });
});
