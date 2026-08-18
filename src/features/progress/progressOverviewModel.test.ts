import { describe, expect, it } from 'vitest';

import type { BodyMeasurement, WeightEntry, WorkoutSession } from '@/types';

import { buildProgressOverview } from './progressOverviewModel';

const weightHistory: WeightEntry[] = [
  { id: 'w1', date: '2026-08-10', weight: 70, createdAt: '2026-08-10T08:00:00.000Z' },
  { id: 'w2', date: '2026-08-17', weight: 71, createdAt: '2026-08-17T08:00:00.000Z' },
];

const bodyMeasurements: BodyMeasurement[] = [
  {
    id: 'm1',
    metric: 'waist',
    label: 'Waist',
    value: '80',
    numericValue: 80,
    unit: 'cm',
    createdAt: '2026-08-16T08:00:00.000Z',
  },
];

const sessions: WorkoutSession[] = [
  {
    id: 'early',
    workoutId: 'upper',
    workoutTitle: 'Upper',
    startedAt: '2026-08-03T09:00:00.000Z',
    finishedAt: '2026-08-03T10:00:00.000Z',
    sets: [
      {
        id: 's1',
        exerciseId: 'bench',
        exerciseName: 'Bench Press',
        weight: 90,
        reps: 5,
        completed: true,
      },
    ],
  },
  {
    id: 'recent',
    workoutId: 'upper',
    workoutTitle: 'Upper',
    startedAt: '2026-08-17T09:00:00.000Z',
    finishedAt: '2026-08-17T10:00:00.000Z',
    sets: [
      {
        id: 's2',
        exerciseId: 'bench',
        exerciseName: 'Bench Press',
        weight: 100,
        reps: 5,
        completed: true,
      },
    ],
  },
];

describe('progressOverviewModel', () => {
  it('builds body, strength, activity, and highlight facts from canonical state', () => {
    const overview = buildProgressOverview({
      bodyMeasurements,
      endAt: '2026-08-18T12:00:00.000Z',
      weightHistory,
      workoutSessions: sessions,
    });

    expect(overview.body).toMatchObject({
      currentWeight: 71,
      measurementCount: 1,
      latestMeasurementAt: '2026-08-16T08:00:00.000Z',
    });
    expect(overview.strengthTraining).toMatchObject({
      sessionCount: 2,
      workoutsPerWeek: 0.5,
      volumeTrend: 'up',
      topExercise: {
        exerciseName: 'Bench Press',
        estimated1RmTrend: 'up',
      },
    });
    expect(overview.activity).toEqual({
      activeDayCount: 2,
      sessionsLast7Days: 1,
      latestWorkoutAt: '2026-08-17T10:00:00.000Z',
    });
    expect(overview.highlights).toEqual({
      recentEstimated1RmRecordCount: 1,
      improvingExerciseCount: 1,
      decliningExerciseCount: 0,
      hasTrainingEvidence: true,
    });
  });

  it('returns explicit empty overview states without inventing trends', () => {
    const overview = buildProgressOverview({
      bodyMeasurements: [],
      endAt: '2026-08-18T12:00:00.000Z',
      weightHistory: [],
      workoutSessions: [],
    });

    expect(overview.body).toEqual({
      currentWeight: null,
      weightDelta7Days: null,
      measurementCount: 0,
      latestMeasurementAt: null,
    });
    expect(overview.strengthTraining).toEqual({
      sessionCount: 0,
      workoutsPerWeek: 0,
      volumeTrend: 'insufficient_data',
      topExercise: null,
    });
    expect(overview.activity).toEqual({
      activeDayCount: 0,
      sessionsLast7Days: 0,
      latestWorkoutAt: null,
    });
    expect(overview.highlights.hasTrainingEvidence).toBe(false);
  });
});
