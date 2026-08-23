import type { Exercise, Workout, WorkoutPrescriptionSet } from '@/types';

import {
  applyWorkoutTemplateEdit,
  buildWorkoutTemplateExerciseEdits,
  type WorkoutTemplateEdit,
} from './workoutTemplateEditing';

export type TemplateSmartReplaceUnavailableReason =
  | 'template_not_custom'
  | 'source_unresolved'
  | 'replacement_unresolved'
  | 'replacement_collision'
  | 'same_exercise'
  | 'unsafe_remap';

export type TemplateSmartReplacePrescriptionChange = {
  index: number;
  sourceSetId: string | null;
  beforeExerciseId: string;
  beforeExerciseName: string;
  afterExerciseId: string;
  afterExerciseName: string;
};

export type TemplateSmartReplacePreview =
  | {
      status: 'unavailable';
      reason: TemplateSmartReplaceUnavailableReason;
    }
  | {
      status: 'ready';
      templateId: string;
      templateTitle: string;
      sourceExercise: Pick<Exercise, 'id' | 'name'> & { index: number };
      replacementExercise: Pick<Exercise, 'id' | 'name'>;
      affectedPrescriptionRows: TemplateSmartReplacePrescriptionChange[];
      unaffectedExerciseCount: number;
      expectedFingerprint: string;
      edit: WorkoutTemplateEdit;
      projectedWorkout: Workout;
    };

const normalizePrescriptionRow = (set: WorkoutPrescriptionSet) => ({
  sourceSetId: set.sourceSetId ?? null,
  exerciseId: set.exerciseId,
  exerciseName: set.exerciseName,
  weight: set.weight,
  reps: set.reps,
  targetRpe: set.targetRpe,
  adjustment: set.adjustment ?? null,
  rationaleCode: set.rationaleCode ?? null,
});

const prescriptionRowsMatch = (
  left: WorkoutPrescriptionSet,
  right: WorkoutPrescriptionSet,
) =>
  JSON.stringify(normalizePrescriptionRow(left)) ===
  JSON.stringify(normalizePrescriptionRow(right));

const valuesMatch = (left: unknown, right: unknown) =>
  JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

export const buildTemplateSmartReplaceFingerprint = (workout: Workout) =>
  JSON.stringify({
    templateId: workout.id,
    title: workout.title,
    description: workout.description ?? null,
    duration: workout.duration,
    createdAt: workout.createdAt ?? null,
    isCustom: workout.isCustom === true,
    coachMetadata: workout.coachMetadata ?? null,
    exercises: workout.exercises,
    prescription: workout.prescription?.map(normalizePrescriptionRow) ?? null,
  });

const resolveExactExercise = (
  exerciseId: string,
  exercises: readonly Exercise[],
) => {
  const matches = exercises.filter((exercise) => exercise.id === exerciseId);
  return matches.length === 1 ? matches[0] : undefined;
};

const buildReplacementEdit = (
  workout: Workout,
  sourceExerciseId: string,
  replacement: Exercise,
): WorkoutTemplateEdit => ({
  title: workout.title,
  description: workout.description,
  exercises: buildWorkoutTemplateExerciseEdits(workout.exercises).map((exercise) =>
    typeof exercise !== 'string' && exercise.sourceExerciseId === sourceExerciseId
      ? {
          ...exercise,
          name: replacement.name,
          replacementExerciseId: replacement.id,
        }
      : exercise,
  ),
});

const prescriptionIdentityChanges = (
  workout: Workout,
  sourceExerciseId: string,
  replacement: Exercise,
): TemplateSmartReplacePrescriptionChange[] =>
  (workout.prescription ?? []).flatMap((set, index) =>
    set.exerciseId === sourceExerciseId
      ? [
          {
            index,
            sourceSetId: set.sourceSetId ?? null,
            beforeExerciseId: set.exerciseId,
            beforeExerciseName: set.exerciseName,
            afterExerciseId: replacement.id,
            afterExerciseName: replacement.name,
          },
        ]
      : [],
  );

const projectedIdentityMatches = (
  workout: Workout,
  projected: Workout,
  sourceExerciseId: string,
  replacement: Exercise,
) => {
  const sourceIndex = workout.exercises.findIndex(
    (exercise) => exercise.id === sourceExerciseId,
  );
  if (sourceIndex < 0 || projected.exercises.length !== workout.exercises.length) {
    return false;
  }

  const exercisesMatch = workout.exercises.every((exercise, index) => {
    const next = projected.exercises[index];
    if (!next) return false;
    if (index === sourceIndex) {
      return next.id === replacement.id && next.name === replacement.name;
    }
    return valuesMatch(next, exercise);
  });
  if (!exercisesMatch) return false;

  if (
    projected.id !== workout.id ||
    projected.title !== workout.title ||
    projected.description !== workout.description ||
    projected.duration !== workout.duration ||
    projected.createdAt !== workout.createdAt ||
    projected.isCustom !== workout.isCustom ||
    !valuesMatch(projected.coachMetadata, workout.coachMetadata)
  ) {
    return false;
  }

  const beforePrescription = workout.prescription ?? [];
  const afterPrescription = projected.prescription ?? [];
  if (beforePrescription.length !== afterPrescription.length) return false;

  return beforePrescription.every((set, index) => {
    const next = afterPrescription[index];
    if (!next) return false;
    const expected =
      set.exerciseId === sourceExerciseId
        ? {
            ...set,
            exerciseId: replacement.id,
            exerciseName: replacement.name,
          }
        : set;
    return prescriptionRowsMatch(next, expected);
  });
};

export function buildTemplateSmartReplacePreview(input: {
  workout: Workout;
  sourceExerciseId: string;
  replacementExerciseId: string;
  exerciseCatalog: readonly Exercise[];
}): TemplateSmartReplacePreview {
  const { workout, sourceExerciseId, replacementExerciseId, exerciseCatalog } = input;

  if (workout.isCustom !== true) {
    return { status: 'unavailable', reason: 'template_not_custom' };
  }

  const source = resolveExactExercise(sourceExerciseId, workout.exercises);
  if (!source) {
    return { status: 'unavailable', reason: 'source_unresolved' };
  }

  if (sourceExerciseId === replacementExerciseId) {
    return { status: 'unavailable', reason: 'same_exercise' };
  }

  const replacement = resolveExactExercise(replacementExerciseId, exerciseCatalog);
  if (!replacement) {
    return { status: 'unavailable', reason: 'replacement_unresolved' };
  }

  if (
    workout.exercises.some(
      (exercise) =>
        exercise.id === replacementExerciseId && exercise.id !== sourceExerciseId,
    )
  ) {
    return { status: 'unavailable', reason: 'replacement_collision' };
  }

  const edit = buildReplacementEdit(workout, sourceExerciseId, replacement);
  const editedWorkout = applyWorkoutTemplateEdit(
    workout,
    edit,
    workout.createdAt ?? '1970-01-01T00:00:00.000Z',
    exerciseCatalog,
  );
  const projectedWorkout =
    editedWorkout === workout
      ? workout
      : {
          ...editedWorkout,
          duration: workout.duration,
        };

  if (
    projectedWorkout === workout ||
    !projectedIdentityMatches(
      workout,
      projectedWorkout,
      sourceExerciseId,
      replacement,
    )
  ) {
    return { status: 'unavailable', reason: 'unsafe_remap' };
  }

  const sourceIndex = workout.exercises.findIndex(
    (exercise) => exercise.id === sourceExerciseId,
  );

  return {
    status: 'ready',
    templateId: workout.id,
    templateTitle: workout.title,
    sourceExercise: {
      id: source.id,
      name: source.name,
      index: sourceIndex,
    },
    replacementExercise: {
      id: replacement.id,
      name: replacement.name,
    },
    affectedPrescriptionRows: prescriptionIdentityChanges(
      workout,
      sourceExerciseId,
      replacement,
    ),
    unaffectedExerciseCount: Math.max(0, workout.exercises.length - 1),
    expectedFingerprint: buildTemplateSmartReplaceFingerprint(workout),
    edit,
    projectedWorkout,
  };
}
