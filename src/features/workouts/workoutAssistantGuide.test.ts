import { describe, expect, it } from 'vitest';

import type { WorkoutPrescriptionSet, WorkoutSession } from '@/types';

import { getPreviousCompletedSetsForExercise } from './sessionScreenModel';
import { buildWorkoutAssistantSetGuides } from './workoutAssistantGuide';

const prescription: WorkoutPrescriptionSet[] = [
  {
    exerciseId: 'bench-press',
    exerciseName: 'Bench Press',
    weight: 92.5,
    reps: 8,
    targetRpe: 8,
    adjustment: 'increase',
  },
  {
    exerciseId: 'bench-press',
    exerciseName: 'Bench Press',
    weight: 92.5,
    reps: 7,
    targetRpe: 8.5,
  },
];

describe('workout assistant set guidance', () => {
  it('uses exact confirmed prescription order for today targets', () => {
    const guides = buildWorkoutAssistantSetGuides({
      exerciseId: 'bench-press',
      prescription,
      rowCount: 2,
    });

    expect(guides).toMatchObject([
      {
        targetWeight: 92.5,
        targetReps: 8,
        targetRpe: 8,
        targetSource: 'prescription',
      },
      {
        targetWeight: 92.5,
        targetReps: 7,
        targetRpe: 8.5,
        targetSource: 'prescription',
      },
    ]);
  });

  it('fails closed instead of matching a prescription by exercise name', () => {
    const guides = buildWorkoutAssistantSetGuides({
      exerciseId: 'different-bench-id',
      plannedTargetReps: 10,
      prescription,
      rowCount: 1,
    });

    expect(guides[0]).toMatchObject({
      targetWeight: null,
      targetReps: 10,
      targetRpe: null,
      targetSource: 'plan',
    });
  });

  it('uses only canonical plan reps when no confirmed prescription exists', () => {
    const [guide] = buildWorkoutAssistantSetGuides({
      exerciseId: 'pull-up',
      plannedTargetReps: 8,
      prescription: [],
      previousSets: [{ weight: 20, reps: 7, actualRpe: 9 }],
      rowCount: 1,
    });

    expect(guide).toEqual({
      previous: { weight: 20, reps: 7, actualRpe: 9 },
      targetWeight: null,
      targetReps: 8,
      targetRpe: null,
      targetSource: 'plan',
    });
  });

  it('does not promote previous load into a today target', () => {
    const [guide] = buildWorkoutAssistantSetGuides({
      exerciseId: 'squat',
      prescription: [],
      previousSets: [{ weight: 140, reps: 5, actualRpe: 8.5 }],
      rowCount: 1,
    });

    expect(guide.previous).toEqual({ weight: 140, reps: 5, actualRpe: 8.5 });
    expect(guide.targetWeight).toBeNull();
    expect(guide.targetReps).toBeNull();
    expect(guide.targetSource).toBe('none');
  });

  it('fails closed per malformed prescription field while retaining safe plan reps', () => {
    const malformed = [
      {
        exerciseId: 'bench-press',
        exerciseName: 'Bench Press',
        weight: Number.NaN,
        reps: 0,
        targetRpe: 11,
      },
    ] as unknown as WorkoutPrescriptionSet[];

    const [guide] = buildWorkoutAssistantSetGuides({
      exerciseId: 'bench-press',
      plannedTargetReps: 9,
      prescription: malformed,
      rowCount: 1,
    });

    expect(guide).toMatchObject({
      targetWeight: null,
      targetReps: 9,
      targetRpe: null,
      targetSource: 'plan',
    });
  });

  it('preserves actual RPE from the latest completed matching session', () => {
    const sessions: WorkoutSession[] = [
      {
        id: 'older',
        workoutId: 'push',
        workoutTitle: 'Push',
        startedAt: '2026-08-18T10:00:00.000Z',
        finishedAt: '2026-08-18T11:00:00.000Z',
        sets: [
          {
            id: 'older-set',
            exerciseId: 'bench-press',
            exerciseName: 'Bench Press',
            weight: 87.5,
            reps: 8,
            completed: true,
            actualRpe: 8,
          },
        ],
      },
      {
        id: 'latest',
        workoutId: 'push',
        workoutTitle: 'Push',
        startedAt: '2026-08-20T10:00:00.000Z',
        finishedAt: '2026-08-20T11:00:00.000Z',
        sets: [
          {
            id: 'latest-set',
            exerciseId: 'bench-press',
            exerciseName: 'Bench Press',
            weight: 90,
            reps: 8,
            completed: true,
            actualRpe: 8.5,
          },
        ],
      },
    ];

    expect(getPreviousCompletedSetsForExercise('bench-press', sessions)).toEqual([
      { weight: 90, reps: 8, actualRpe: 8.5 },
    ]);
  });
});
