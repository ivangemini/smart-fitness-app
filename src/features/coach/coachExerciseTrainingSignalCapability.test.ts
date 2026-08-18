import { describe, expect, it } from 'vitest';

import type { WorkoutSession } from '@/types';

import { readExerciseTrainingSignals } from './coachTrainingSignalCapability';

const sessions: WorkoutSession[] = [
  {
    id: 'session-1',
    workoutId: 'upper',
    workoutTitle: 'Upper',
    startedAt: '2026-08-01T09:00:00.000Z',
    finishedAt: '2026-08-01T10:00:00.000Z',
    sets: [
      {
        id: 'bench-private-set',
        exerciseId: 'bench',
        exerciseName: 'Bench Press',
        weight: 100,
        reps: 5,
        completed: true,
        actualRpe: 8,
      },
      {
        id: 'row-private-set',
        exerciseId: 'row',
        exerciseName: 'Barbell Row',
        weight: 90,
        reps: 8,
        completed: true,
        actualRpe: 9,
      },
    ],
  },
];

describe('readExerciseTrainingSignals', () => {
  it('filters unrelated exercise sets before deterministic analysis', () => {
    const result = readExerciseTrainingSignals({
      sessions,
      endAt: '2026-08-18T12:00:00.000Z',
      days: 28,
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.evidence).toMatchObject({
      sessionCount: 1,
      workingSetCount: 1,
      recordedRpeSetCount: 1,
    });
    expect(result.data.exercises).toHaveLength(1);
    expect(result.data.exercises[0]).toMatchObject({
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      averageActualRpe: 8,
    });
    const serialized = JSON.stringify(result.data);
    expect(serialized).not.toContain('Barbell Row');
    expect(serialized).not.toContain('row-private-set');
    expect(serialized).not.toContain('bench-private-set');
  });

  it('supports exact normalized-name fallback without broad matching', () => {
    const result = readExerciseTrainingSignals({
      sessions,
      endAt: '2026-08-18T12:00:00.000Z',
      exerciseName: ' bench press ',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.exercises[0]?.exerciseId).toBe('bench');
  });

  it('fails closed without an exercise query', () => {
    expect(
      readExerciseTrainingSignals({
        sessions,
        endAt: '2026-08-18T12:00:00.000Z',
      }),
    ).toEqual({
      ok: false,
      error: {
        code: 'missing_exercise_query',
        message: 'exerciseId or exerciseName is required.',
      },
    });
  });
});
