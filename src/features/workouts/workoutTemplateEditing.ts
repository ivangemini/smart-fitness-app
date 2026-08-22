import { createExerciseId } from '@/lib/appState';
import type { Exercise, Workout } from '@/types';

export type WorkoutTemplateExerciseEdit =
  | string
  | {
      name: string;
      sourceExerciseId?: string;
    };

export type WorkoutTemplateEdit = {
  title: string;
  description?: string;
  exercises: WorkoutTemplateExerciseEdit[];
};

type NormalizedExerciseEdit = {
  name: string;
  sourceExerciseId?: string;
};

const normalizeExerciseEdit = (
  exercise: WorkoutTemplateExerciseEdit,
): NormalizedExerciseEdit =>
  typeof exercise === 'string'
    ? { name: exercise.trim() }
    : {
        name: exercise.name.trim(),
        sourceExerciseId: exercise.sourceExerciseId?.trim() || undefined,
      };

const allocateExerciseId = (
  name: string,
  index: number,
  reservedIds: Set<string>,
) => {
  const base = createExerciseId(name) || 'exercise';
  let candidate = `${base}-${index}`;
  let suffix = 1;

  while (reservedIds.has(candidate)) {
    candidate = `${base}-${index}-${suffix}`;
    suffix += 1;
  }

  reservedIds.add(candidate);
  return candidate;
};

const createTemplateExercise = (
  name: string,
  index: number,
  createdAt: string,
  reservedIds: Set<string>,
): Exercise => ({
  id: allocateExerciseId(name, index, reservedIds),
  name,
  isCustom: true,
  createdAt,
});

export const buildWorkoutTemplateExercises = (
  exercises: WorkoutTemplateExerciseEdit[],
  createdAt: string,
): Exercise[] => {
  const reservedIds = new Set<string>();

  return exercises
    .map(normalizeExerciseEdit)
    .filter((exercise) => exercise.name.length > 0)
    .map((exercise, index) =>
      createTemplateExercise(exercise.name, index, createdAt, reservedIds),
    );
};

const resolveLegacySourceExercise = (
  exercise: NormalizedExerciseEdit,
  index: number,
  existingExercises: Workout['exercises'],
  consumedSourceIds: Set<string>,
) => {
  if (exercise.sourceExerciseId) {
    const explicit = existingExercises.find(
      (item) => item.id === exercise.sourceExerciseId,
    );
    if (explicit && !consumedSourceIds.has(explicit.id)) return explicit;
    return undefined;
  }

  const exactNameMatches = existingExercises.filter(
    (item) => item.name === exercise.name && !consumedSourceIds.has(item.id),
  );
  if (exactNameMatches.length === 1) return exactNameMatches[0];

  const positional = existingExercises[index];
  return positional && !consumedSourceIds.has(positional.id) ? positional : undefined;
};

export const applyWorkoutTemplateEdit = (
  workout: Workout,
  edit: WorkoutTemplateEdit,
  fallbackCreatedAt: string,
): Workout => {
  const normalizedEdits = edit.exercises
    .map(normalizeExerciseEdit)
    .filter((exercise) => exercise.name.length > 0);
  const consumedSourceIds = new Set<string>();
  const reservedIds = new Set(workout.exercises.map((exercise) => exercise.id));
  const createdAt = workout.createdAt ?? fallbackCreatedAt;

  const exercises = normalizedEdits.map((exercise, index) => {
    const source = resolveLegacySourceExercise(
      exercise,
      index,
      workout.exercises,
      consumedSourceIds,
    );

    if (source) {
      consumedSourceIds.add(source.id);
      return { ...source, name: exercise.name };
    }

    return createTemplateExercise(
      exercise.name,
      index,
      createdAt,
      reservedIds,
    );
  });
  const exerciseNamesById = new Map(
    exercises.map((exercise) => [exercise.id, exercise.name] as const),
  );
  const prescription = workout.prescription?.flatMap((set) => {
    const exerciseName = exerciseNamesById.get(set.exerciseId);
    return exerciseName ? [{ ...set, exerciseName }] : [];
  });

  return {
    ...workout,
    title: edit.title,
    description: edit.description,
    duration: `${Math.max(15, exercises.length * 10)} min`,
    exercises,
    ...(workout.prescription ? { prescription } : {}),
  };
};
