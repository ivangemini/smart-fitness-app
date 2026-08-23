import { describe, expect, it } from 'vitest';

import type { Exercise, Workout } from '@/types';

import {
  buildTemplateSmartReplaceFingerprint,
  buildTemplateSmartReplacePreview,
} from './templateSmartReplacePreview';

const replacement: Exercise = {
  id: 'incline-dumbbell-press',
  name: 'Incline Dumbbell Press',
  createdAt: '2026-08-23T00:00:00.000Z',
  isCustom: false,
  equipment: ['dumbbell'],
  primaryMuscles: ['upper-chest'],
  secondaryMuscles: ['triceps'],
};

const workout = (): Workout => ({
  id: 'template-1',
  title: 'Push A',
  description: 'Keep this note',
  duration: '47 min',
  createdAt: '2026-08-22T00:00:00.000Z',
  isCustom: true,
  coachMetadata: {
    schemaVersion: 1,
    runId: 'coach-run',
    sourceSessionId: 'session-1',
    strategy: 'maintain',
    confirmedAt: '2026-08-22T12:00:00.000Z',
  },
  exercises: [
    {
      id: 'bench-press',
      name: 'Bench Press',
      createdAt: '2026-08-20T00:00:00.000Z',
      isCustom: false,
      equipment: ['barbell'],
      primaryMuscles: ['chest'],
    },
    {
      id: 'barbell-row',
      name: 'Barbell Row',
      createdAt: '2026-08-20T00:00:00.000Z',
      isCustom: false,
      equipment: ['barbell'],
      primaryMuscles: ['back'],
    },
  ],
  prescription: [
    {
      sourceSetId: 'bench-set-1',
      exerciseId: 'bench-press',
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 5,
      targetRpe: 8,
      adjustment: 'maintain',
      rationaleCode: 'keep-load',
    },
    {
      sourceSetId: 'row-set-1',
      exerciseId: 'barbell-row',
      exerciseName: 'Barbell Row',
      weight: 80,
      reps: 8,
      targetRpe: 7.5,
    },
  ],
});

const build = (
  source = workout(),
  overrides: Partial<Parameters<typeof buildTemplateSmartReplacePreview>[0]> = {},
) =>
  buildTemplateSmartReplacePreview({
    workout: source,
    sourceExerciseId: 'bench-press',
    replacementExerciseId: replacement.id,
    exerciseCatalog: [replacement],
    ...overrides,
  });

describe('buildTemplateSmartReplacePreview', () => {
  it('projects exact exercise and prescription identity changes without mutating source', () => {
    const source = workout();
    const preview = build(source);

    expect(preview.status).toBe('ready');
    if (preview.status !== 'ready') return;

    expect(preview.templateId).toBe(source.id);
    expect(preview.templateTitle).toBe(source.title);
    expect(preview.sourceExercise).toEqual({
      id: 'bench-press',
      name: 'Bench Press',
      index: 0,
    });
    expect(preview.replacementExercise).toEqual({
      id: replacement.id,
      name: replacement.name,
    });
    expect(preview.affectedPrescriptionRows).toEqual([
      {
        index: 0,
        sourceSetId: 'bench-set-1',
        beforeExerciseId: 'bench-press',
        beforeExerciseName: 'Bench Press',
        afterExerciseId: replacement.id,
        afterExerciseName: replacement.name,
      },
    ]);
    expect(preview.unaffectedExerciseCount).toBe(1);
    expect(preview.expectedFingerprint).toBe(
      buildTemplateSmartReplaceFingerprint(source),
    );

    expect(preview.projectedWorkout.exercises[0]).toEqual(replacement);
    expect(preview.projectedWorkout.exercises[1]).toEqual(source.exercises[1]);
    expect(preview.projectedWorkout.prescription?.[0]).toEqual({
      sourceSetId: 'bench-set-1',
      exerciseId: replacement.id,
      exerciseName: replacement.name,
      weight: 100,
      reps: 5,
      targetRpe: 8,
      adjustment: 'maintain',
      rationaleCode: 'keep-load',
    });
    expect(preview.projectedWorkout.prescription?.[1]).toEqual(
      source.prescription?.[1],
    );
    expect(preview.projectedWorkout.title).toBe(source.title);
    expect(preview.projectedWorkout.description).toBe(source.description);
    expect(preview.projectedWorkout.duration).toBe(source.duration);
    expect(preview.projectedWorkout.createdAt).toBe(source.createdAt);
    expect(preview.projectedWorkout.coachMetadata).toEqual(source.coachMetadata);
    expect(source.exercises[0]?.id).toBe('bench-press');
    expect(source.prescription?.[0]?.exerciseId).toBe('bench-press');
  });

  it('supports templates without prescription rows', () => {
    const source = { ...workout(), prescription: undefined };
    const preview = build(source);

    expect(preview.status).toBe('ready');
    if (preview.status !== 'ready') return;
    expect(preview.affectedPrescriptionRows).toEqual([]);
    expect(preview.projectedWorkout.prescription).toBeUndefined();
    expect(preview.projectedWorkout.exercises[0]?.id).toBe(replacement.id);
  });

  it('fails closed for a non-custom workout template', () => {
    expect(build({ ...workout(), isCustom: false })).toEqual({
      status: 'unavailable',
      reason: 'template_not_custom',
    });
  });

  it('fails closed when source identity is missing or ambiguous', () => {
    expect(build(workout(), { sourceExerciseId: 'missing' })).toEqual({
      status: 'unavailable',
      reason: 'source_unresolved',
    });

    const source = workout();
    source.exercises = [source.exercises[0]!, { ...source.exercises[0]! }];
    expect(build(source)).toEqual({
      status: 'unavailable',
      reason: 'source_unresolved',
    });
  });

  it('fails closed when replacement identity is missing or ambiguous', () => {
    expect(build(workout(), { exerciseCatalog: [] })).toEqual({
      status: 'unavailable',
      reason: 'replacement_unresolved',
    });

    expect(
      build(workout(), {
        exerciseCatalog: [replacement, { ...replacement }],
      }),
    ).toEqual({
      status: 'unavailable',
      reason: 'replacement_unresolved',
    });
  });

  it('fails closed when replacement already exists in the template', () => {
    const source = workout();
    const existingReplacement = {
      ...replacement,
      createdAt: '2026-08-20T00:00:00.000Z',
    };
    source.exercises = [source.exercises[0]!, existingReplacement];

    expect(
      build(source, {
        exerciseCatalog: [replacement],
      }),
    ).toEqual({
      status: 'unavailable',
      reason: 'replacement_collision',
    });
  });

  it('rejects selecting the same exercise as its replacement', () => {
    const source = workout();
    expect(
      build(source, {
        replacementExerciseId: 'bench-press',
        exerciseCatalog: [source.exercises[0]!],
      }),
    ).toEqual({
      status: 'unavailable',
      reason: 'same_exercise',
    });
  });
});

describe('buildTemplateSmartReplaceFingerprint', () => {
  it('changes when template identity-relevant state changes', () => {
    const source = workout();
    const fingerprint = buildTemplateSmartReplaceFingerprint(source);

    expect(
      buildTemplateSmartReplaceFingerprint({ ...source, title: 'Renamed' }),
    ).not.toBe(fingerprint);
    expect(
      buildTemplateSmartReplaceFingerprint({
        ...source,
        exercises: [...source.exercises].reverse(),
      }),
    ).not.toBe(fingerprint);
    expect(
      buildTemplateSmartReplaceFingerprint({
        ...source,
        prescription: source.prescription?.map((set, index) =>
          index === 0 ? { ...set, reps: set.reps + 1 } : set,
        ),
      }),
    ).not.toBe(fingerprint);
    expect(
      buildTemplateSmartReplaceFingerprint({
        ...source,
        coachMetadata: source.coachMetadata
          ? { ...source.coachMetadata, runId: 'different-run' }
          : undefined,
      }),
    ).not.toBe(fingerprint);
  });
});
