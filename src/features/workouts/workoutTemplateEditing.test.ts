import { describe, expect, it } from 'vitest';

import type { Exercise, Workout } from '@/types';

import {
  applyWorkoutTemplateEdit,
  buildWorkoutTemplateExercises,
} from './workoutTemplateEditing';

const workout = (): Workout => ({
  id: 'template-1',
  title: 'Template',
  description: 'Notes',
  duration: '30 min',
  isCustom: true,
  createdAt: '2026-08-22T00:00:00.000Z',
  exercises: [
    {
      id: 'bench-row',
      name: 'Bench Press',
      isCustom: false,
      createdAt: '2026-08-20T00:00:00.000Z',
      equipment: ['barbell'],
      primaryMuscles: ['chest'],
    },
    {
      id: 'row-row',
      name: 'Barbell Row',
      isCustom: false,
      createdAt: '2026-08-20T00:00:00.000Z',
      equipment: ['barbell'],
      primaryMuscles: ['back'],
    },
  ],
  prescription: [
    {
      sourceSetId: 'set-bench',
      exerciseId: 'bench-row',
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 5,
      targetRpe: 8,
      adjustment: 'maintain',
      rationaleCode: 'keep-load',
    },
    {
      sourceSetId: 'set-row',
      exerciseId: 'row-row',
      exerciseName: 'Barbell Row',
      weight: 80,
      reps: 8,
      targetRpe: 7.5,
    },
  ],
});

const replacement: Exercise = {
  id: 'incline-dumbbell-press',
  name: 'Incline Dumbbell Press',
  isCustom: false,
  createdAt: '2026-08-21T00:00:00.000Z',
  equipment: ['dumbbell'],
  primaryMuscles: ['upper-chest'],
  secondaryMuscles: ['triceps'],
};

describe('workout template exercise identity', () => {
  it('keeps explicit source IDs when creating a template', () => {
    const exercises = buildWorkoutTemplateExercises(
      [
        { sourceExerciseId: 'bench-press', name: 'Bench Press' },
        { sourceExerciseId: 'barbell-row', name: 'Barbell Row' },
      ],
      '2026-08-22T12:00:00.000Z',
    );

    expect(exercises.map((exercise) => exercise.id)).toEqual([
      'bench-press',
      'barbell-row',
    ]);
  });

  it('falls back to a fresh ID when a preferred source ID is duplicated', () => {
    const exercises = buildWorkoutTemplateExercises(
      [
        { sourceExerciseId: 'bench-press', name: 'Bench Press' },
        { sourceExerciseId: 'bench-press', name: 'Bench Press Copy' },
      ],
      '2026-08-22T12:00:00.000Z',
    );

    expect(exercises[0]?.id).toBe('bench-press');
    expect(exercises[1]?.id).not.toBe('bench-press');
  });
});

describe('applyWorkoutTemplateEdit', () => {
  it('preserves explicit exercise identity and prescription through reorder', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: source.title,
        description: source.description,
        exercises: [
          { sourceExerciseId: 'row-row', name: 'Barbell Row' },
          { sourceExerciseId: 'bench-row', name: 'Bench Press' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result.exercises.map((exercise) => exercise.id)).toEqual([
      'row-row',
      'bench-row',
    ]);
    expect(result.exercises[0]?.equipment).toEqual(['barbell']);
    expect(result.exercises[1]?.primaryMuscles).toEqual(['chest']);
    expect(result.prescription).toEqual(source.prescription);
  });

  it('renames an explicitly retained exercise without changing its ID or prescription fields', () => {
    const result = applyWorkoutTemplateEdit(
      workout(),
      {
        title: 'Renamed template',
        description: 'Updated notes',
        exercises: [
          { sourceExerciseId: 'bench-row', name: 'Paused Bench Press' },
          { sourceExerciseId: 'row-row', name: 'Barbell Row' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result.exercises[0]).toMatchObject({
      id: 'bench-row',
      name: 'Paused Bench Press',
      equipment: ['barbell'],
      primaryMuscles: ['chest'],
    });
    expect(result.prescription?.[0]).toEqual({
      sourceSetId: 'set-bench',
      exerciseId: 'bench-row',
      exerciseName: 'Paused Bench Press',
      weight: 100,
      reps: 5,
      targetRpe: 8,
      adjustment: 'maintain',
      rationaleCode: 'keep-load',
    });
  });

  it('replaces an exact source with canonical replacement metadata and remaps prescription identity', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: source.title,
        description: source.description,
        exercises: [
          {
            sourceExerciseId: 'bench-row',
            replacementExerciseId: replacement.id,
            name: 'Untrusted display name',
          },
          { sourceExerciseId: 'row-row', name: 'Barbell Row' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
      [replacement],
    );

    expect(result.exercises[0]).toEqual(replacement);
    expect(result.exercises[1]).toEqual(source.exercises[1]);
    expect(result.prescription?.[0]).toEqual({
      sourceSetId: 'set-bench',
      exerciseId: replacement.id,
      exerciseName: replacement.name,
      weight: 100,
      reps: 5,
      targetRpe: 8,
      adjustment: 'maintain',
      rationaleCode: 'keep-load',
    });
    expect(result.prescription?.[1]).toEqual(source.prescription?.[1]);
  });

  it('fails closed when a replacement ID cannot be resolved exactly', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: source.title,
        exercises: [
          {
            sourceExerciseId: 'bench-row',
            replacementExerciseId: 'missing-replacement',
            name: 'Missing',
          },
          { sourceExerciseId: 'row-row', name: 'Barbell Row' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
      [replacement],
    );

    expect(result).toBe(source);
  });

  it('fails closed when a replacement would collide with another existing row', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: source.title,
        exercises: [
          {
            sourceExerciseId: 'bench-row',
            replacementExerciseId: 'row-row',
            name: 'Barbell Row',
          },
          { sourceExerciseId: 'row-row', name: 'Barbell Row' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
      [source.exercises[1]!],
    );

    expect(result).toBe(source);
  });

  it('fails closed when a replacement is supplied without explicit source identity', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: source.title,
        exercises: [
          {
            replacementExerciseId: replacement.id,
            name: replacement.name,
          },
          { sourceExerciseId: 'row-row', name: 'Barbell Row' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
      [replacement],
    );

    expect(result).toBe(source);
  });

  it('drops prescription rows for removed exercises without mutating retained rows', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: source.title,
        description: source.description,
        exercises: [{ sourceExerciseId: 'row-row', name: 'Barbell Row' }],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result.exercises.map((exercise) => exercise.id)).toEqual(['row-row']);
    expect(result.prescription).toEqual([source.prescription?.[1]]);
  });

  it('creates a fresh collision-safe identity for genuinely new exercises', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: source.title,
        exercises: [
          { sourceExerciseId: 'bench-row', name: 'Bench Press' },
          { sourceExerciseId: 'row-row', name: 'Barbell Row' },
          { name: 'Bench Row' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result.exercises[2]?.id).not.toBe('bench-row');
    expect(new Set(result.exercises.map((exercise) => exercise.id)).size).toBe(3);
  });

  it('keeps legacy string edits stable across reorder when names are unique', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: source.title,
        exercises: ['Barbell Row', 'Bench Press'],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result.exercises.map((exercise) => exercise.id)).toEqual([
      'row-row',
      'bench-row',
    ]);
  });

  it('fails closed when an explicit source identity is stale', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: 'Should not apply',
        exercises: [
          { sourceExerciseId: 'missing-id', name: 'Bench Press' },
          { sourceExerciseId: 'row-row', name: 'Barbell Row' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result).toBe(source);
  });

  it('fails closed when an explicit source identity is reused twice', () => {
    const source = workout();
    const result = applyWorkoutTemplateEdit(
      source,
      {
        title: 'Should not apply',
        exercises: [
          { sourceExerciseId: 'bench-row', name: 'Bench Press' },
          { sourceExerciseId: 'bench-row', name: 'Bench Press Copy' },
        ],
      },
      '2026-08-22T12:00:00.000Z',
    );

    expect(result).toBe(source);
  });
});
