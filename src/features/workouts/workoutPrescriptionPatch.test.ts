import { describe, expect, it } from 'vitest';

import type { Workout, WorkoutPrescriptionPatch } from '@/types';

import {
  applyWorkoutPrescriptionPatch,
  buildWorkoutPrescriptionFingerprint,
} from './workoutPrescriptionPatch';

const workout = (): Workout => ({
  id: 'push',
  title: 'Push',
  duration: '45 min',
  isCustom: true,
  exercises: [{ id: 'bench', name: 'Bench', createdAt: '2026-08-01T00:00:00.000Z' }],
  prescription: [
    { sourceSetId: 's1', exerciseId: 'bench', exerciseName: 'Bench', weight: 100, reps: 8, targetRpe: 8 },
    { sourceSetId: 's2', exerciseId: 'bench', exerciseName: 'Bench', weight: 90, reps: 10, targetRpe: 8.5 },
  ],
});

const patchFor = (source: Workout): WorkoutPrescriptionPatch => ({
  templateId: source.id,
  exerciseId: 'bench',
  expectedFingerprint: buildWorkoutPrescriptionFingerprint(source),
  rows: [
    {
      index: 0,
      exerciseId: 'bench',
      expectedWeight: 100,
      expectedReps: 8,
      expectedTargetRpe: 8,
      nextWeight: 102.5,
      nextReps: 8,
      nextAdjustment: 'increase',
      nextRationaleCode: 'adaptive-program-v1:f1',
    },
  ],
});

describe('applyWorkoutPrescriptionPatch', () => {
  it('applies an exact patch while preserving unrelated prescription fields', () => {
    const source = workout();
    const result = applyWorkoutPrescriptionPatch(source, patchFor(source));

    expect(result.status).toBe('applied');
    expect(result.workout.id).toBe(source.id);
    expect(result.workout.exercises).toEqual(source.exercises);
    expect(result.workout.prescription?.[0]).toMatchObject({
      sourceSetId: 's1',
      weight: 102.5,
      reps: 8,
      targetRpe: 8,
      adjustment: 'increase',
      rationaleCode: 'adaptive-program-v1:f1',
    });
    expect(result.workout.prescription?.[1]).toEqual(source.prescription?.[1]);
  });

  it('fails stale when the prescription changed after preview', () => {
    const source = workout();
    const patch = patchFor(source);
    const changed = {
      ...source,
      prescription: source.prescription?.map((set, index) =>
        index === 0 ? { ...set, weight: 101 } : set,
      ),
    };

    const result = applyWorkoutPrescriptionPatch(changed, patch);
    expect(result.status).toBe('stale');
    expect(result.workout).toBe(changed);
  });

  it('blocks non-custom templates and invalid row snapshots', () => {
    const source = workout();
    expect(
      applyWorkoutPrescriptionPatch({ ...source, isCustom: false }, patchFor(source)).status,
    ).toBe('blocked');

    const invalid = patchFor(source);
    invalid.rows[0] = { ...invalid.rows[0], exerciseId: 'row' };
    expect(applyWorkoutPrescriptionPatch(source, invalid).status).toBe('blocked');
  });
});
