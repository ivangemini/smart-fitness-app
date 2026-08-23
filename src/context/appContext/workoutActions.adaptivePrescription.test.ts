import { describe, expect, it } from 'vitest';

import { defaultState } from '@/data/defaults';
import { buildWorkoutPrescriptionFingerprint } from '@/features/workouts/workoutPrescriptionPatch';
import type { Workout, WorkoutSession } from '@/types';

import { applyWorkoutPrescriptionPatchInState } from './workoutActions';

const workout: Workout = {
  id: 'push',
  title: 'Push',
  duration: '45 min',
  isCustom: true,
  exercises: [{ id: 'bench', name: 'Bench', createdAt: '2026-08-01T00:00:00.000Z' }],
  prescription: [
    { exerciseId: 'bench', exerciseName: 'Bench', weight: 100, reps: 8, targetRpe: 8 },
  ],
};

const completedSession: WorkoutSession = {
  id: 'done',
  workoutId: 'push',
  workoutTitle: 'Push',
  startedAt: '2026-08-22T10:00:00.000Z',
  finishedAt: '2026-08-22T11:00:00.000Z',
  sets: [{ id: 'set', exerciseId: 'bench', exerciseName: 'Bench', weight: 100, reps: 8, completed: true }],
};

describe('applyWorkoutPrescriptionPatchInState', () => {
  it('changes only the future template prescription and preserves completed session history', () => {
    const state = { ...defaultState, workouts: [workout], workoutSessions: [completedSession] };
    const result = applyWorkoutPrescriptionPatchInState(state, {
      templateId: 'push',
      exerciseId: 'bench',
      expectedFingerprint: buildWorkoutPrescriptionFingerprint(workout),
      rows: [{
        index: 0,
        exerciseId: 'bench',
        expectedWeight: 100,
        expectedReps: 8,
        expectedTargetRpe: 8,
        nextWeight: 105,
        nextReps: 8,
        nextAdjustment: 'increase',
        nextRationaleCode: 'adaptive-program-v1:f1',
      }],
    });

    expect(result.status).toBe('applied');
    expect(result.nextState.workouts[0].prescription?.[0].weight).toBe(105);
    expect(result.nextState.workoutSessions).toEqual([completedSession]);
    expect(result.nextState.workoutSessions[0].sets[0].weight).toBe(100);
  });
});
