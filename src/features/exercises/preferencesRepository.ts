import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  EMPTY_EXERCISE_PREFERENCE,
  normalizeExercisePreference,
  type ExercisePreference,
} from './preferences';

const PREFERENCE_STORAGE_PREFIX = 'exercise-preference-v1:';

const storageKey = (exerciseId: string) =>
  `${PREFERENCE_STORAGE_PREFIX}${encodeURIComponent(exerciseId)}`;

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
