import { describe, expect, it } from 'vitest';

import type { WorkoutPrescriptionSet } from '@/types';

import { buildWorkoutWarmupProposal } from './workoutWarmupGuide';

const prescribed = (exerciseId: string, weight: number): WorkoutPrescriptionSet => ({
  exerciseId,
  exerciseName: exerciseId,
  weight,
  reps: 8,
  targetRpe: 8,
});

describe('workout warm-up guide', () => {
  it('builds a deterministic ramp from an exact prescribed working load', () => {
    expect(
      buildWorkoutWarmupProposal({
        exerciseId: 'bench',
        prescription: [prescribed('bench', 100)],
      }),
    ).toEqual([
      { weight: 50, reps: 8 },
      { weight: 70, reps: 5 },
      { weight: 85, reps: 3 },
    ]);
  });

  it('uses a shorter ramp for lower working loads', () => {
    expect(
      buildWorkoutWarmupProposal({
        exerciseId: 'curl',
        prescription: [prescribed('curl', 30)],
      }),
    ).toEqual([
      { weight: 15, reps: 8 },
      { weight: 22.5, reps: 4 },
    ]);
  });

  it('fails closed without an exact prescribed working load', () => {
    expect(
      buildWorkoutWarmupProposal({
        exerciseId: 'different-id',
        prescription: [prescribed('bench', 100)],
      }),
    ).toEqual([]);
    expect(
      buildWorkoutWarmupProposal({ exerciseId: 'bench', prescription: [] }),
    ).toEqual([]);
  });

  it('never treats zero/bodyweight history as a guessed working load', () => {
    expect(
      buildWorkoutWarmupProposal({
        exerciseId: 'pull-up',
        prescription: [prescribed('pull-up', 0)],
      }),
    ).toEqual([]);
  });
});
