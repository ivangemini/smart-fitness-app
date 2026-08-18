import { describe, expect, it } from 'vitest';

import type { WorkoutSession, WorkoutSet } from '@/types';

import { buildProgressOverview } from './progressOverviewModel';

const makeSets = (prefix: string, weight: number): WorkoutSet[] =>
  Array.from({ length: 13 }, (_, index) => ({
    id: `${prefix}-${index}`,
    exerciseId: `exercise-${index}`,
    exerciseName: `Exercise ${index}`,
    weight,
    reps: 5,
    completed: true,
  }));

const makeSession = (id: string, finishedAt: string, sets: WorkoutSet[]): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets,
});

describe('Progress overview highlight bounds', () => {
  it('counts more than twelve exercise signals so summary and drilldown stay aligned', () => {
    const overview = buildProgressOverview({
      bodyMeasurements: [],
      endAt: '2026-08-18T12:00:00.000Z',
      weightHistory: [],
      workoutSessions: [
        makeSession('early', '2026-08-01T10:00:00.000Z', makeSets('early', 100)),
        makeSession('recent', '2026-08-15T10:00:00.000Z', makeSets('recent', 110)),
      ],
    });

    expect(overview.highlights.improvingExerciseCount).toBe(13);
    expect(overview.highlights.recentEstimated1RmRecordCount).toBe(13);
  });
});
