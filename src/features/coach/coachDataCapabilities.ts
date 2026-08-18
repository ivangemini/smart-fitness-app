import {
  buildTrainingProgressAnalytics,
  type TrainingProgressAnalytics,
} from '@/lib/progress/trainingAnalytics';
import type { WorkoutSession, WorkoutSet } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_HISTORY_DAYS = 28;
export const COACH_HISTORY_MAX_DAYS = 90;
const DEFAULT_WORKOUT_LIMIT = 20;
const MAX_WORKOUT_LIMIT = 30;
const DEFAULT_EXERCISE_SESSION_LIMIT = 12;
const MAX_EXERCISE_SESSION_LIMIT = 20;
const MAX_SETS_PER_SESSION = 30;
const TRAINING_SUMMARY_MAX_EXERCISES = 10;

export type CoachCapabilityError = {
  code: 'invalid_end_at' | 'missing_exercise_query';
  message: string;
};

export type CoachCapabilityResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: CoachCapabilityError };

export type CoachWorkingSetFact = {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  actualRpe?: number;
};

export type CoachWorkoutHistoryFact = {
  sessionId: string;
  workoutId: string;
  workoutTitle: string;
  startedAt: string;
  finishedAt: string;
  workingSets: CoachWorkingSetFact[];
  workingSetCount: number;
  setsTruncated: boolean;
};

export type CoachWorkoutHistoryData = {
  period: {
    startAt: string;
    endAt: string;
    days: number;
  };
  workouts: CoachWorkoutHistoryFact[];
  totalMatchingSessions: number;
  resultsTruncated: boolean;
};

export type CoachExerciseHistoryFact = {
  sessionId: string;
  workoutTitle: string;
  finishedAt: string;
  workingSets: CoachWorkingSetFact[];
  setsTruncated: boolean;
};

export type CoachExerciseHistoryData = {
  exercise: {
    exerciseId: string | null;
    exerciseName: string | null;
  };
  period: {
    startAt: string;
    endAt: string;
    days: number;
  };
  sessions: CoachExerciseHistoryFact[];
  totalMatchingSessions: number;
  resultsTruncated: boolean;
};

export type CoachTrainingSummaryData = TrainingProgressAnalytics;

type BoundedPeriod = {
  startTimestamp: number;
  endTimestamp: number;
  startAt: string;
  endAt: string;
  days: number;
};

const clampInteger = (value: number | undefined, fallback: number, min: number, max: number) => {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(value as number)));
};

const resolvePeriod = (endAt: string, days: number | undefined): CoachCapabilityResult<BoundedPeriod> => {
  const endTimestamp = Date.parse(endAt);

  if (!Number.isFinite(endTimestamp)) {
    return {
      ok: false,
      error: {
        code: 'invalid_end_at',
        message: 'A valid endAt timestamp is required.',
      },
    };
  }

  const boundedDays = clampInteger(days, DEFAULT_HISTORY_DAYS, 1, COACH_HISTORY_MAX_DAYS);
  const startTimestamp = endTimestamp - boundedDays * DAY_MS;

  return {
    ok: true,
    data: {
      startTimestamp,
      endTimestamp,
      startAt: new Date(startTimestamp).toISOString(),
      endAt: new Date(endTimestamp).toISOString(),
      days: boundedDays,
    },
  };
};

const sessionTimestamp = (session: WorkoutSession) => {
  const finishedTimestamp = Date.parse(session.finishedAt);
  if (Number.isFinite(finishedTimestamp)) {
    return finishedTimestamp;
  }

  const startedTimestamp = Date.parse(session.startedAt);
  return Number.isFinite(startedTimestamp) ? startedTimestamp : null;
};

const isWorkingSet = (set: WorkoutSet) =>
  set.completed !== false && Number.isFinite(set.reps) && set.reps > 0 && Number.isFinite(set.weight) && set.weight >= 0;

const toWorkingSetFact = (set: WorkoutSet): CoachWorkingSetFact => ({
  exerciseId: set.exerciseId,
  exerciseName: set.exerciseName,
  weight: set.weight,
  reps: set.reps,
  ...(set.actualRpe !== undefined ? { actualRpe: set.actualRpe } : {}),
});

const getBoundedSessions = (sessions: WorkoutSession[], period: BoundedPeriod) =>
  sessions
    .map((session) => ({ session, timestamp: sessionTimestamp(session) }))
    .filter(
      (entry): entry is { session: WorkoutSession; timestamp: number } =>
        entry.timestamp !== null && entry.timestamp >= period.startTimestamp && entry.timestamp <= period.endTimestamp,
    )
    .sort((a, b) => b.timestamp - a.timestamp);

const normalizeExerciseName = (value: string) => value.trim().toLocaleLowerCase();

const matchesExercise = (set: WorkoutSet, exerciseId?: string, exerciseName?: string) => {
  const normalizedId = exerciseId?.trim();
  if (normalizedId) {
    return set.exerciseId === normalizedId;
  }

  const normalizedName = exerciseName?.trim();
  return normalizedName
    ? normalizeExerciseName(set.exerciseName) === normalizeExerciseName(normalizedName)
    : false;
};

export const readBoundedWorkoutHistory = ({
  sessions,
  endAt,
  days,
  limit,
}: {
  sessions: WorkoutSession[];
  endAt: string;
  days?: number;
  limit?: number;
}): CoachCapabilityResult<CoachWorkoutHistoryData> => {
  const period = resolvePeriod(endAt, days);
  if (!period.ok) return period;

  const boundedLimit = clampInteger(limit, DEFAULT_WORKOUT_LIMIT, 1, MAX_WORKOUT_LIMIT);
  const matchingSessions = getBoundedSessions(sessions, period.data);
  const workouts = matchingSessions.slice(0, boundedLimit).map(({ session }) => {
    const workingSets = session.sets.filter(isWorkingSet);
    return {
      sessionId: session.id,
      workoutId: session.workoutId,
      workoutTitle: session.workoutTitle,
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      workingSets: workingSets.slice(0, MAX_SETS_PER_SESSION).map(toWorkingSetFact),
      workingSetCount: workingSets.length,
      setsTruncated: workingSets.length > MAX_SETS_PER_SESSION,
    };
  });

  return {
    ok: true,
    data: {
      period: {
        startAt: period.data.startAt,
        endAt: period.data.endAt,
        days: period.data.days,
      },
      workouts,
      totalMatchingSessions: matchingSessions.length,
      resultsTruncated: matchingSessions.length > workouts.length,
    },
  };
};

export const readExerciseHistory = ({
  sessions,
  endAt,
  days,
  exerciseId,
  exerciseName,
  limit,
}: {
  sessions: WorkoutSession[];
  endAt: string;
  days?: number;
  exerciseId?: string;
  exerciseName?: string;
  limit?: number;
}): CoachCapabilityResult<CoachExerciseHistoryData> => {
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

  const period = resolvePeriod(endAt, days);
  if (!period.ok) return period;

  const boundedLimit = clampInteger(limit, DEFAULT_EXERCISE_SESSION_LIMIT, 1, MAX_EXERCISE_SESSION_LIMIT);
  const matchingSessions = getBoundedSessions(sessions, period.data)
    .map(({ session }) => {
      const workingSets = session.sets
        .filter(isWorkingSet)
        .filter((set) => matchesExercise(set, normalizedExerciseId, normalizedExerciseName));
      if (workingSets.length === 0) return null;
      return {
        session,
        workingSets,
      };
    })
    .filter(
      (entry): entry is { session: WorkoutSession; workingSets: WorkoutSet[] } => entry !== null,
    );

  const selected = matchingSessions.slice(0, boundedLimit).map(({ session, workingSets }) => ({
    sessionId: session.id,
    workoutTitle: session.workoutTitle,
    finishedAt: session.finishedAt,
    workingSets: workingSets.slice(0, MAX_SETS_PER_SESSION).map(toWorkingSetFact),
    setsTruncated: workingSets.length > MAX_SETS_PER_SESSION,
  }));

  return {
    ok: true,
    data: {
      exercise: {
        exerciseId: normalizedExerciseId || null,
        exerciseName: normalizedExerciseName || null,
      },
      period: {
        startAt: period.data.startAt,
        endAt: period.data.endAt,
        days: period.data.days,
      },
      sessions: selected,
      totalMatchingSessions: matchingSessions.length,
      resultsTruncated: matchingSessions.length > selected.length,
    },
  };
};

export const readTrainingSummary = ({
  sessions,
  endAt,
  days,
}: {
  sessions: WorkoutSession[];
  endAt: string;
  days?: number;
}): CoachCapabilityResult<CoachTrainingSummaryData> => {
  const period = resolvePeriod(endAt, days);
  if (!period.ok) return period;

  return {
    ok: true,
    data: buildTrainingProgressAnalytics(sessions, {
      endAt: period.data.endAt,
      periodDays: period.data.days,
      maxExercises: TRAINING_SUMMARY_MAX_EXERCISES,
    }),
  };
};
