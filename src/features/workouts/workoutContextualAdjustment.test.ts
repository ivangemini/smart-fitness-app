import { describe, expect, it } from 'vitest';

import type { WorkoutPrescriptionSet, WorkoutSet } from '@/types';

import { getWorkoutContextualAdjustment } from './workoutContextualAdjustment';

const target: WorkoutPrescriptionSet = {
  exerciseId: 'bench',
  exerciseName: 'Bench Press',
  weight: 100,
  reps: 8,
  targetRpe: 8,
};

const completed = (overrides: Partial<WorkoutSet> = {}): WorkoutSet => ({
  id: 'set-1',
  exerciseId: 'bench',
  exerciseName: 'Bench Press',
  weight: 100,
  reps: 8,
  completed: true,
  actualRpe: 8,
  ...overrides,
});

describe('workout contextual adjustment', () => {
  it('stays quiet for normal target-level performance', () => {
    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed(),
        prescription: [target],
        workingSetIndex: 0,
      }),
    ).toBeNull();
  });

  it('suggests a decrease only after material high-effort divergence', () => {
    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed({ actualRpe: 9.5 }),
        prescription: [target],
        workingSetIndex: 0,
      }),
    ).toEqual({
      adjustedWeight: 95,
      direction: 'decrease',
      exerciseId: 'bench',
      loadMultiplier: 0.95,
      sourceSetId: 'set-1',
    });
  });

  it('suggests a small increase only with low RPE plus extra reps', () => {
    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed({ actualRpe: 6.5, reps: 10 }),
        prescription: [target],
        workingSetIndex: 0,
      }),
    ).toEqual({
      adjustedWeight: 102.5,
      direction: 'increase',
      exerciseId: 'bench',
      loadMultiplier: 1.025,
      sourceSetId: 'set-1',
    });
  });

  it('uses the prescribed row aligned to the completed working-set index', () => {
    const secondTarget: WorkoutPrescriptionSet = {
      ...target,
      weight: 90,
      reps: 10,
      targetRpe: 7,
    };
    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed({ actualRpe: 8.5, reps: 10 }),
        prescription: [target, secondTarget],
        workingSetIndex: 1,
      }),
    ).toEqual(
      expect.objectContaining({
        adjustedWeight: 85.5,
        direction: 'decrease',
        loadMultiplier: 0.95,
      }),
    );
  });

  it('does not shift later prescription rows when an earlier load is unusable', () => {
    const unusableFirstTarget: WorkoutPrescriptionSet = { ...target, weight: 0 };
    const secondTarget: WorkoutPrescriptionSet = {
      ...target,
      weight: 90,
      reps: 10,
      targetRpe: 7,
    };

    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed({ actualRpe: 8.5, reps: 10 }),
        prescription: [unusableFirstTarget, secondTarget],
        workingSetIndex: 1,
      }),
    ).toEqual(
      expect.objectContaining({
        adjustedWeight: 85.5,
        direction: 'decrease',
        loadMultiplier: 0.95,
      }),
    );
  });

  it('fails closed without actual RPE, an aligned row, or explicit prescribed load', () => {
    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed({ actualRpe: undefined }),
        prescription: [target],
        workingSetIndex: 0,
      }),
    ).toBeNull();
    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed(),
        prescription: [],
        workingSetIndex: 0,
      }),
    ).toBeNull();
    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed({ actualRpe: 10 }),
        prescription: [target],
        workingSetIndex: 1,
      }),
    ).toBeNull();
  });

  it('never suggests changes from warm-up sets', () => {
    expect(
      getWorkoutContextualAdjustment({
        completedSet: completed({ actualRpe: 10, reps: 4, setType: 'warmup' }),
        prescription: [target],
        workingSetIndex: 0,
      }),
    ).toBeNull();
  });
});
