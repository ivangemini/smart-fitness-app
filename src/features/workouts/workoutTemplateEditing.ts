import { createExerciseId } from '@/lib/appState';
import type { Exercise, Workout } from '@/types';

export type WorkoutTemplateExerciseEdit =
  | string
  | {
      name: string;
      replacementExerciseId?: string;
      sourceExerciseId?: string;
    };

export type WorkoutTemplateEdit = {
  title: string;
  description?: string;
  exercises: WorkoutTemplateExerciseEdit[];
};

type NormalizedExerciseEdit = {
  name: string;
  replacementExerciseId?: string;
  sourceExerciseId?: string;
};

export const buildWorkoutTemplateExerciseEdits = (
  exercises: readonly Pick<Exercise, 'id' | 'name'>[],
): WorkoutTemplateExerciseEdit[] =>
  exercises.map((exercise) => ({
    name: exercise.name,
    sourceExerciseId: exercise.id,
  }));

const normalizeExerciseEdit = (
  exercise: WorkoutTemplateExerciseEdit,
): NormalizedExerciseEdit =>
  typeof exercise === 'string'
    ? { name: exercise.trim() }
    : {
        name: exercise.name.trim(),
        replacementExerciseId: exercise.replacementExerciseId?.trim() || undefined,
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
  exercise: NormalizedExerciseEdit,
  index: number,
  createdAt: string,
  reservedIds: Set<string>,
): Exercise => {
  const preferredId = exercise.sourceExerciseId;
  const id =
    preferredId && !reservedIds.has(preferredId)
      ? preferredId
      : allocateExerciseId(exercise.name, index, reservedIds);

  reservedIds.add(id);
  return {
    id,
    name: exercise.name,
    isCustom: true,
    createdAt,
  };
};

export const buildWorkoutTemplateExercises = (
  exercises: WorkoutTemplateExerciseEdit[],
  createdAt: string,
): Exercise[] => {
  const reservedIds = new Set<string>();

  return exercises
    .map(normalizeExerciseEdit)
    .filter((exercise) => exercise.name.length > 0)
    .map((exercise, index) =>
      createTemplateExercise(exercise, index, createdAt, reservedIds),
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

const hasInvalidExplicitSourceIdentity = (
  edits: NormalizedExerciseEdit[],
  existingExercises: Workout['exercises'],
) => {
  const existingIds = new Set(existingExercises.map((exercise) => exercise.id));
  const explicitIds = edits.flatMap((exercise) =>
    exercise.sourceExerciseId ? [exercise.sourceExerciseId] : [],
  );

  return (
    explicitIds.some((sourceExerciseId) => !existingIds.has(sourceExerciseId)) ||
    new Set(explicitIds).size !== explicitIds.length
  );
};

const hasInvalidReplacementIdentity = (
  edits: NormalizedExerciseEdit[],
  existingExercises: Workout['exercises'],
  exerciseCatalog: readonly Exercise[],
) => {
  const catalogIds = new Set(exerciseCatalog.map((exercise) => exercise.id));
  const existingIds = new Set(existingExercises.map((exercise) => exercise.id));
  const replacementIds = edits.flatMap((exercise) =>
    exercise.replacementExerciseId ? [exercise.replacementExerciseId] : [],
  );

  return (
    edits.some(
      (exercise) =>
        exercise.replacementExerciseId &&
        (!exercise.sourceExerciseId ||
          !catalogIds.has(exercise.replacementExerciseId) ||
          (exercise.replacementExerciseId !== exercise.sourceExerciseId &&
            existingIds.has(exercise.replacementExerciseId))),
    ) || new Set(replacementIds).size !== replacementIds.length
  );
};

export const applyWorkoutTemplateEdit = (
  workout: Workout,
  edit: WorkoutTemplateEdit,
  fallbackCreatedAt: string,
  exerciseCatalog: readonly Exercise[] = [],
): Workout => {
  const normalizedEdits = edit.exercises
    .map(normalizeExerciseEdit)
    .filter((exercise) => exercise.name.length > 0);

  if (
    hasInvalidExplicitSourceIdentity(normalizedEdits, workout.exercises) ||
    hasInvalidReplacementIdentity(normalizedEdits, workout.exercises, exerciseCatalog)
  ) {
    return workout;
  }

  const consumedSourceIds = new Set<string>();
  const reservedIds = new Set(workout.exercises.map((exercise) => exercise.id));
  const catalogById = new Map(
    exerciseCatalog.map((exercise) => [exercise.id, exercise] as const),
  );
  const sourceToResult = new Map<string, Exercise>();
  const createdAt = workout.createdAt ?? fallbackCreatedAt;

  const exercises = normalizedEdits.map((exercise, index) => {
    const source = resolveLegacySourceExercise(
      exercise,
      index,
      workout.exercises,
      consumedSourceIds,
    );
    const replacement = exercise.replacementExerciseId
      ? catalogById.get(exercise.replacementExerciseId)
      : undefined;

    if (source) {
      consumedSourceIds.add(source.id);
      const result = replacement ? { ...replacement } : { ...source, name: exercise.name };
      sourceToResult.set(source.id, result);
      return result;
    }

    return createTemplateExercise(
      { ...exercise, replacementExerciseId: undefined, sourceExerciseId: undefined },
      index,
      createdAt,
      reservedIds,
    );
  });

  if (new Set(exercises.map((exercise) => exercise.id)).size !== exercises.length) {
    return workout;
  }

  const prescription = workout.prescription?.flatMap((set) => {
    const result = sourceToResult.get(set.exerciseId);
    return result
      ? [{ ...set, exerciseId: result.id, exerciseName: result.name }]
      : [];
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
