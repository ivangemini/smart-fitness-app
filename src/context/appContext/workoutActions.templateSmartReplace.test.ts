import { describe, expect, it } from 'vitest';

import { defaultState } from '@/data/defaults';
import { buildTemplateSmartReplaceFingerprint } from '@/features/workouts/templateSmartReplacePreview';
import type { Exercise, Workout, WorkoutSession } from '@/types';

import { applyWorkoutTemplateReplacementPatchInState } from './workoutActions';

const sourceExercise: Exercise = {
  id: 'bench-press',
  name: 'Bench Press',
  createdAt: '2026-08-01T00:00:00.000Z',
};

const replacement: Exercise = {
  id: 'incline-dumbbell-press',
  name: 'Incline Dumbbell Press',
  createdAt: '2026-08-01T00:00:00.000Z',
};

const workout: Workout = {
  id: 'push',
  title: 'Push',
  duration: '45 min',
  isCustom: true,
  exercises: [sourceExercise],
  prescription: [
    {
      exerciseId: sourceExercise.id,
      exerciseName: sourceExercise.name,
      weight: 100,
      reps: 8,
      targetRpe: 8,
    },
  ],
};

const completedSession: WorkoutSession = {
  id: 'done',
  workoutId: 'push',
  workoutTitle: 'Push',
  startedAt: '2026-08-22T10:00:00.000Z',
  finishedAt: '2026-08-22T11:00:00.000Z',
  sets: [
    {
      id: 'set',
      exerciseId: sourceExercise.id,
      exerciseName: sourceExercise.name,
      weight: 100,
      reps: 8,
      completed: true,
    },
  ],
};

describe('applyWorkoutTemplateReplacementPatchInState', () => {
  it('changes only the future template and preserves completed session history', () => {
    const state = {
      ...defaultState,
      exercises: [sourceExercise, replacement],
      workouts: [workout],
      workoutSessions: [completedSession],
    };
    const result = applyWorkoutTemplateReplacementPatchInState(state, {
      templateId: workout.id,
      sourceExerciseId: sourceExercise.id,
      replacementExerciseId: replacement.id,
      expectedFingerprint: buildTemplateSmartReplaceFingerprint(workout),
    });

    expect(result.status).toBe('applied');
    expect(result.nextState.workouts[0]?.exercises[0]?.id).toBe(replacement.id);
    expect(result.nextState.workouts[0]?.prescription?.[0]?.exerciseId).toBe(
      replacement.id,
    );
    expect(result.nextState.workoutSessions).toEqual([completedSession]);
    expect(result.nextState.workoutSessions[0]?.sets[0]?.exerciseId).toBe(
      sourceExercise.id,
    );
  });

  it('returns stale without changing state when the template changed after preview', () => {
    const state = {
      ...defaultState,
      exercises: [sourceExercise, replacement],
      workouts: [{ ...workout, title: 'Changed title' }],
      workoutSessions: [completedSession],
    };
    const result = applyWorkoutTemplateReplacementPatchInState(state, {
      templateId: workout.id,
      sourceExerciseId: sourceExercise.id,
      replacementExerciseId: replacement.id,
      expectedFingerprint: buildTemplateSmartReplaceFingerprint(workout),
    });

    expect(result.status).toBe('stale');
    expect(result.nextState).toBe(state);
  });
});
