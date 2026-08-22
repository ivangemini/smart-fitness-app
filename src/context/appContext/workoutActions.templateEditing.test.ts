import { describe, expect, it } from 'vitest';

import { defaultState } from '@/data/defaults';
import type { AppState, Workout } from '@/types';

import { updateCustomWorkoutTemplateInState } from './workoutActions';

const createState = (): AppState => {
  const workout: Workout = {
    id: 'template-1',
    title: 'Template',
    duration: '30 min',
    createdAt: '2026-08-22T00:00:00.000Z',
    isCustom: true,
    exercises: [
      {
        id: 'bench-press',
        name: 'Bench Press',
        createdAt: '2026-08-20T00:00:00.000Z',
        isCustom: false,
      },
    ],
    prescription: [
      {
        sourceSetId: 'set-1',
        exerciseId: 'bench-press',
        exerciseName: 'Bench Press',
        weight: 100,
        reps: 5,
        targetRpe: 8,
      },
    ],
  };

  return {
    ...defaultState,
    exercises: [
      ...defaultState.exercises,
      {
        id: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        createdAt: '2026-08-21T00:00:00.000Z',
        isCustom: false,
        equipment: ['dumbbell'],
        primaryMuscles: ['upper-chest'],
      },
    ],
    workouts: [workout],
  };
};

describe('updateCustomWorkoutTemplateInState', () => {
  it('returns the same state when explicit source identity is stale', () => {
    const state = createState();
    const result = updateCustomWorkoutTemplateInState(
      state,
      'template-1',
      {
        title: 'Should not apply',
        exercises: [
          { sourceExerciseId: 'missing-id', name: 'Bench Press' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result).toBe(state);
  });

  it('updates a retained exercise while preserving its prescription identity', () => {
    const state = createState();
    const result = updateCustomWorkoutTemplateInState(
      state,
      'template-1',
      {
        title: 'Updated',
        exercises: [
          { sourceExerciseId: 'bench-press', name: 'Paused Bench Press' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result).not.toBe(state);
    expect(result.workouts[0]?.exercises[0]?.id).toBe('bench-press');
    expect(result.workouts[0]?.prescription?.[0]).toMatchObject({
      exerciseId: 'bench-press',
      exerciseName: 'Paused Bench Press',
      weight: 100,
      reps: 5,
      targetRpe: 8,
    });
  });

  it('resolves an exact replacement from the app exercise catalog', () => {
    const state = createState();
    const result = updateCustomWorkoutTemplateInState(
      state,
      'template-1',
      {
        title: 'Updated',
        exercises: [
          {
            sourceExerciseId: 'bench-press',
            replacementExerciseId: 'incline-dumbbell-press',
            name: 'Incline Dumbbell Press',
          },
        ],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result).not.toBe(state);
    expect(result.workouts[0]?.exercises[0]).toMatchObject({
      id: 'incline-dumbbell-press',
      name: 'Incline Dumbbell Press',
      equipment: ['dumbbell'],
      primaryMuscles: ['upper-chest'],
    });
    expect(result.workouts[0]?.prescription?.[0]).toMatchObject({
      exerciseId: 'incline-dumbbell-press',
      exerciseName: 'Incline Dumbbell Press',
      weight: 100,
      reps: 5,
      targetRpe: 8,
    });
  });
});
