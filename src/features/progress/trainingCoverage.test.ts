import { describe, expect, it } from 'vitest';

import type { Exercise } from '@/features/exercises/types';
import type { WorkoutSession, WorkoutSet } from '@/types';

import { buildTrainingCoverage } from './trainingCoverage';

const exercise = (overrides: Partial<Exercise> & Pick<Exercise, 'id' | 'name'>): Exercise => {
  const { id, name, ...rest } = overrides;
  return {
    id,
    name,
    source: { provider: 'local-fixture' },
    aliases: [],
    equipment: ['barbell'],
    bodyPart: 'strength',
    primaryMuscles: [],
    secondaryMuscles: [],
    instructions: [],
    coachingTips: [],
    media: {},
    ...rest,
  };
};

const session = (
  id: string,
  finishedAt: string,
  sets: Array<{
    exerciseId: string;
    exerciseName: string;
    weight: number;
    reps: number;
    setType?: WorkoutSet['setType'];
    completed?: boolean;
  }>,
): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: 'Training',
  startedAt: finishedAt,
  finishedAt,
  sets: sets.map((set, index) => ({ id: `${id}-${index}`, completed: true, ...set })),
});

const bench = exercise({
  id: 'bench-press',
  name: 'Bench Press',
  primaryMuscles: ['chest'],
  secondaryMuscles: ['triceps'],
});

const row = exercise({
  id: 'barbell-row',
  name: 'Barbell Row',
  primaryMuscles: ['lats'],
  secondaryMuscles: ['biceps'],
});

describe('buildTrainingCoverage', () => {
  it('derives muscle and reviewed movement coverage only from eligible working sets', () => {
    const result = buildTrainingCoverage({
      exercises: [bench],
      sessions: [
        session('s1', '2026-08-22T12:00:00.000Z', [
          { exerciseId: bench.id, exerciseName: bench.name, weight: 100, reps: 5 },
          { exerciseId: bench.id, exerciseName: bench.name, weight: 60, reps: 10, setType: 'warmup' },
          { exerciseId: bench.id, exerciseName: bench.name, weight: 110, reps: 3, completed: false },
        ]),
      ],
      endAt: '2026-08-23T12:00:00.000Z',
      windowDays: 7,
    });

    expect(result.eligibleWorkingSetCount).toBe(1);
    expect(result.mappedMuscleSetCount).toBe(1);
    expect(result.reviewedPatternSetCount).toBe(1);
    expect(result.unmappedPatternSetCount).toBe(0);
    expect(result.muscleExposure.find((fact) => fact.id === 'chest')).toMatchObject({
      primarySets: 1,
      primaryVolume: 500,
      exposureSessions: 1,
    });
    expect(result.muscleExposure.find((fact) => fact.id === 'triceps')).toMatchObject({
      secondarySets: 1,
      secondaryVolume: 500,
      exposureSessions: 1,
    });
    expect(result.movementPatterns).toHaveLength(1);
    expect(result.movementPatterns[0]).toMatchObject({
      pattern: 'horizontal-push',
      workingSetCount: 1,
      volume: 500,
      exposureSessions: 1,
    });
  });

  it('fails closed instead of using an exercise-name fallback for canonical identity', () => {
    const result = buildTrainingCoverage({
      exercises: [bench],
      sessions: [
        session('s1', '2026-08-22T12:00:00.000Z', [
          {
            exerciseId: 'remote-bench-copy',
            exerciseName: bench.name,
            weight: 100,
            reps: 5,
          },
        ]),
      ],
      endAt: '2026-08-23T12:00:00.000Z',
      windowDays: 7,
    });

    expect(result.mappedMuscleSetCount).toBe(0);
    expect(result.unmappedMuscleSetCount).toBe(1);
    expect(result.reviewedPatternSetCount).toBe(0);
    expect(result.unmappedPatternSetCount).toBe(1);
    expect(result.movementPatterns).toEqual([]);
  });

  it('uses reviewed movement authority by exact canonical id and exposes contributing evidence', () => {
    const result = buildTrainingCoverage({
      exercises: [bench, row],
      sessions: [
        session('s1', '2026-08-20T12:00:00.000Z', [
          { exerciseId: bench.id, exerciseName: bench.name, weight: 100, reps: 5 },
          { exerciseId: row.id, exerciseName: row.name, weight: 80, reps: 8 },
        ]),
        session('s2', '2026-08-22T12:00:00.000Z', [
          { exerciseId: bench.id, exerciseName: bench.name, weight: 102.5, reps: 5 },
        ]),
      ],
      endAt: '2026-08-23T12:00:00.000Z',
      windowDays: 7,
    });

    const push = result.movementPatterns.find((fact) => fact.pattern === 'horizontal-push');
    const pull = result.movementPatterns.find((fact) => fact.pattern === 'horizontal-pull');

    expect(push).toMatchObject({ workingSetCount: 2, exposureSessions: 2, lastTrainedAt: '2026-08-22T12:00:00.000Z' });
    expect(push?.contributors).toEqual([
      expect.objectContaining({
        exerciseId: bench.id,
        exerciseName: bench.name,
        workingSetCount: 2,
        exposureSessions: 2,
      }),
    ]);
    expect(pull).toMatchObject({ workingSetCount: 1, exposureSessions: 1 });
  });

  it('keeps evidence inside the explicit selected recent window', () => {
    const result = buildTrainingCoverage({
      exercises: [bench],
      sessions: [
        session('old', '2026-08-01T12:00:00.000Z', [
          { exerciseId: bench.id, exerciseName: bench.name, weight: 90, reps: 5 },
        ]),
        session('recent', '2026-08-22T12:00:00.000Z', [
          { exerciseId: bench.id, exerciseName: bench.name, weight: 100, reps: 5 },
        ]),
      ],
      endAt: '2026-08-23T12:00:00.000Z',
      windowDays: 7,
    });

    expect(result.eligibleWorkingSetCount).toBe(1);
    expect(result.movementPatterns[0]?.workingSetCount).toBe(1);
    expect(result.movementPatterns[0]?.contributors[0]?.workingSetCount).toBe(1);
  });
});
