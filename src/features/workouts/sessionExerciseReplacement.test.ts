import { describe, expect, it } from 'vitest';

import {
  canReplacePendingWorkoutSessionExercise,
  replacePendingWorkoutSessionExercise,
} from './sessionScreenModel';
import type { WorkoutSessionDraft } from './types';

const createDraft = (): WorkoutSessionDraft => ({
  id: 'draft-1',
  workoutId: 'workout-1',
  workoutTitle: 'Workout',
  startedAt: '2026-08-22T10:00:00.000Z',
  sets: [
    {
      id: 'completed-set',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 5,
      completed: true,
      targetRpe: 8,
      actualRpe: 8.5,
      setType: 'working',
      supersetId: 'superset-a',
    },
    {
      id: 'pending-set',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 95,
      reps: 6,
      completed: false,
      targetRpe: 8,
      actualRpe: 7.5,
      setType: 'backoff',
      supersetId: 'superset-a',
    },
    {
      id: 'legacy-set',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 90,
      reps: 8,
    },
    {
      id: 'other-set',
      exerciseId: 'row',
      exerciseName: 'Row',
      weight: 80,
      reps: 8,
      completed: false,
      setType: 'working',
    },
  ],
});

describe('replacePendingWorkoutSessionExercise', () => {
  it('relabels only explicitly pending source sets', () => {
    const draft = createDraft();
    const result = replacePendingWorkoutSessionExercise(draft, 'bench', {
      id: 'incline-bench',
      name: 'Incline Bench Press',
    });

    expect(result.sets[0]).toEqual(draft.sets[0]);
    expect(result.sets[1]).toEqual({
      ...draft.sets[1],
      exerciseId: 'incline-bench',
      exerciseName: 'Incline Bench Press',
    });
    expect(result.sets[2]).toEqual(draft.sets[2]);
    expect(result.sets[3]).toEqual(draft.sets[3]);
  });

  it('preserves prescription and set identity fields on the pending set', () => {
    const result = replacePendingWorkoutSessionExercise(createDraft(), 'bench', {
      id: 'incline-bench',
      name: 'Incline Bench Press',
    });
    const pending = result.sets.find((set) => set.id === 'pending-set');

    expect(pending).toMatchObject({
      id: 'pending-set',
      weight: 95,
      reps: 6,
      completed: false,
      targetRpe: 8,
      actualRpe: 7.5,
      setType: 'backoff',
      supersetId: 'superset-a',
    });
  });

  it('treats undefined completion as preserved legacy/completed evidence', () => {
    const result = replacePendingWorkoutSessionExercise(createDraft(), 'bench', {
      id: 'incline-bench',
      name: 'Incline Bench Press',
    });
    const legacy = result.sets.find((set) => set.id === 'legacy-set');

    expect(legacy?.exerciseId).toBe('bench');
    expect(legacy?.exerciseName).toBe('Bench Press');
  });

  it('requires at least one explicitly pending source set', () => {
    const draft: WorkoutSessionDraft = {
      ...createDraft(),
      sets: createDraft().sets.filter((set) => set.completed !== false),
    };

    expect(
      canReplacePendingWorkoutSessionExercise(draft, 'bench', 'incline-bench'),
    ).toBe(false);
    expect(
      replacePendingWorkoutSessionExercise(draft, 'bench', {
        id: 'incline-bench',
        name: 'Incline Bench Press',
      }).sets,
    ).toEqual(draft.sets);
  });

  it('fails closed when source and replacement IDs are equal', () => {
    const draft = createDraft();
    const result = replacePendingWorkoutSessionExercise(draft, 'bench', {
      id: 'bench',
      name: 'Renamed Bench',
    });

    expect(
      canReplacePendingWorkoutSessionExercise(draft, 'bench', 'bench'),
    ).toBe(false);
    expect(result).not.toBe(draft);
    expect(result.sets).toEqual(draft.sets);
    expect(result.sets).not.toBe(draft.sets);
  });
});
