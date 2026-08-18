import type { WorkoutSession, WorkoutSet } from '@/types';
import {
  buildTrainingSignalAnalytics,
  type TrainingSignalAnalytics,
} from '@/lib/progress/trainingSignals';

import {
  COACH_HISTORY_MAX_DAYS,
  type CoachCapabilityResult,
} from './coachDataCapabilities';

const DEFAULT_COACH_SIGNAL_DAYS = 28;
const MAX_COACH_SIGNAL_EXERCISES = 12;

const clampDays = (value: number | undefined) => {
  if (!Number.isFinite(value)) return DEFAULT_COACH_SIGNAL_DAYS;
  return Math.min(COACH_HISTORY_MAX_DAYS, Math.max(1, Math.trunc(value as number)));
};

const normalizeExerciseName = (value: string) => value.trim().toLocaleLowerCase();

const isWorkingSet = (set: WorkoutSet) =>
  set.completed !== false &&
  Number.isFinite(set.reps) &&
  set.reps > 0 &&
  Number.isFinite(set.weight) &&
  set.weight >= 0;

const matchesExercise = (set: WorkoutSet, exerciseId?: string, exerciseName?: string) => {
  const normalizedId = exerciseId?.trim();
  if (normalizedId) return set.exerciseId === normalizedId;
  const normalizedName = exerciseName?.trim();
  return normalizedName
    ? normalizeExerciseName(set.exerciseName) === normalizeExerciseName(normalizedName)
    : false;
};

const validateEndAt = (endAt: string): CoachCapabilityResult<never> | null =>
  Number.isFinite(Date.parse(endAt))
    ? null
    : {
        ok: false,
        error: {
          code: 'invalid_end_at',
          message: 'A valid endAt timestamp is required.',
        },
      };

export type CoachTrainingSignalData = TrainingSignalAnalytics;
export type CoachExerciseTrainingSignalData = TrainingSignalAnalytics;

export const readTrainingSignals = ({
  sessions,
  endAt,
  days,
}: {
  sessions: WorkoutSession[];
  endAt: string;
  days?: number;
}): CoachCapabilityResult<CoachTrainingSignalData> => {
  const endAtError = validateEndAt(endAt);
  if (endAtError) return endAtError;

  return {
    ok: true,
    data: buildTrainingSignalAnalytics(sessions, {
      endAt,
      periodDays: clampDays(days),
      maxExercises: MAX_COACH_SIGNAL_EXERCISES,
    }),
  };
};

export const readExerciseTrainingSignals = ({
  sessions,
  endAt,
  days,
  exerciseId,
  exerciseName,
}: {
  sessions: WorkoutSession[];
  endAt: string;
  days?: number;
  exerciseId?: string;
  exerciseName?: string;
}): CoachCapabilityResult<CoachExerciseTrainingSignalData> => {
  const normalizedExerciseId = exerciseId?.trim();
  const normalizedExerciseName = exerciseName?.trim();
  if (!normalizedExerciseId && !normalizedExerciseName) {
    return {
      ok: false,
      error: {
        code: 'missing_exercise_query',
        message: 'exerciseId or exerciseName is required.',
      },
    };
  }
  const endAtError = validateEndAt(endAt);
  if (endAtError) return endAtError;

  const scopedSessions = sessions
    .map((session) => ({
      ...session,
      sets: session.sets.filter(
        (set) =>
          isWorkingSet(set) &&
          matchesExercise(set, normalizedExerciseId, normalizedExerciseName),
      ),
    }))
    .filter((session) => session.sets.length > 0);

  return {
    ok: true,
    data: buildTrainingSignalAnalytics(scopedSessions, {
      endAt,
      periodDays: clampDays(days),
      maxExercises: 1,
    }),
  };
};
