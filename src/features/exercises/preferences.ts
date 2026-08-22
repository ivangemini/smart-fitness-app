export const EXERCISE_PREFERENCE_NOTE_MAX_LENGTH = 240;

export type ExercisePreference = {
  avoid: boolean;
  note: string;
};

export const EMPTY_EXERCISE_PREFERENCE: ExercisePreference = {
  avoid: false,
  note: '',
};

export const normalizeExercisePreference = (value: unknown): ExercisePreference => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ...EMPTY_EXERCISE_PREFERENCE };
  }

  const candidate = value as Record<string, unknown>;
  const note =
    typeof candidate.note === 'string'
      ? candidate.note.trim().slice(0, EXERCISE_PREFERENCE_NOTE_MAX_LENGTH)
      : '';

  return {
    avoid: candidate.avoid === true,
    note,
  };
};

export const exercisePreferencesEqual = (
  left: ExercisePreference,
  right: ExercisePreference,
): boolean => left.avoid === right.avoid && left.note === right.note;
