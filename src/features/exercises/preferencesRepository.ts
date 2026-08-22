import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCE_STORAGE_PREFIX = 'exercise-preference-v1:';

export const EXERCISE_PREFERENCE_NOTE_MAX_LENGTH = 240;

export type ExercisePreference = {
  avoid: boolean;
  note: string;
};

export const EMPTY_EXERCISE_PREFERENCE: ExercisePreference = {
  avoid: false,
  note: '',
};

const storageKey = (exerciseId: string) =>
  `${PREFERENCE_STORAGE_PREFIX}${encodeURIComponent(exerciseId)}`;

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

export const loadExercisePreference = async (
  exerciseId: string,
): Promise<ExercisePreference> => {
  if (!exerciseId) return { ...EMPTY_EXERCISE_PREFERENCE };

  const raw = await AsyncStorage.getItem(storageKey(exerciseId));
  if (!raw) return { ...EMPTY_EXERCISE_PREFERENCE };

  try {
    return normalizeExercisePreference(JSON.parse(raw) as unknown);
  } catch {
    return { ...EMPTY_EXERCISE_PREFERENCE };
  }
};

export const saveExercisePreference = async (
  exerciseId: string,
  preference: ExercisePreference,
): Promise<ExercisePreference> => {
  const normalized = normalizeExercisePreference(preference);
  if (!exerciseId) return normalized;

  const key = storageKey(exerciseId);
  if (!normalized.avoid && !normalized.note) {
    await AsyncStorage.removeItem(key);
    return normalized;
  }

  await AsyncStorage.setItem(key, JSON.stringify(normalized));
  return normalized;
};
