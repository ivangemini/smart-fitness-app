import type { WorkoutSession, WorkoutSet } from '@/types';

import { calculateComparableEstimated1Rm } from './trainingAnalytics';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PERIOD_DAYS = 28;
const MAX_PERIOD_DAYS = 180;
const DEFAULT_MAX_POINTS = 24;
const MAX_POINTS = 60;

export type ExerciseProgressPoint = {
  sessionId: string;
  workoutTitle: string;
  completedAt: string;
  workingSetCount: number;
  bestWeight: number | null;
  bestEstimated1Rm: number | null;
  totalVolume: number;
};

export type ExerciseProgressSeries = {
  exerciseId: string | null;
  exerciseName: string | null;
  period: {
    startAt: string;
    endAt: string;
    days: number;
  };
  points: ExerciseProgressPoint[];
  totalMatchingSessions: number;
  pointsTruncated: boolean;
};

const clampInteger = (value: number | undefined, fallback: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value as number)));
};

const parseTimestamp = (value: string | undefined) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const sessionTimestamp = (session: WorkoutSession) =>
  parseTimestamp(session.finishedAt) ?? parseTimestamp(session.startedAt);

const isWorkingSet = (set: WorkoutSet) =>
  set.completed !== false &&
  Number.isFinite(set.reps) &&
  set.reps > 0 &&
  Number.isFinite(set.weight) &&
  set.weight >= 0;

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const matchesExercise = (set: WorkoutSet, exerciseId?: string, exerciseName?: string) => {
  const normalizedId = exerciseId?.trim();
  if (normalizedId) return set.exerciseId === normalizedId;
  const normalizedName = exerciseName ? normalize(exerciseName) : '';
  return normalizedName.length > 0 && normalize(set.exerciseName) === normalizedName;
};

export const buildExerciseProgressSeries = ({
  sessions,
  endAt,
  exerciseId,
  exerciseName,
  periodDays,
  maxPoints,
}: {
  sessions: WorkoutSession[];
  endAt: string;
  exerciseId?: string;
  exerciseName?: string;
  periodDays?: number;
  maxPoints?: number;
}): ExerciseProgressSeries => {
  const endTimestamp = parseTimestamp(endAt);
  if (endTimestamp === null) {
    throw new Error('buildExerciseProgressSeries requires a valid endAt timestamp');
  }
  if (!exerciseId?.trim() && !exerciseName?.trim()) {
    throw new Error('buildExerciseProgressSeries requires exerciseId or exerciseName');
  }

  const days = clampInteger(periodDays, DEFAULT_PERIOD_DAYS, 1, MAX_PERIOD_DAYS);
  const pointLimit = clampInteger(maxPoints, DEFAULT_MAX_POINTS, 1, MAX_POINTS);
  const startTimestamp = endTimestamp - days * DAY_MS;
  const matches = sessions
    .map((session) => ({ session, timestamp: sessionTimestamp(session) }))
    .filter(
      (entry): entry is { session: WorkoutSession; timestamp: number } =>
        entry.timestamp !== null &&
        entry.timestamp >= startTimestamp &&
        entry.timestamp <= endTimestamp,
    )
    .map(({ session, timestamp }) => ({
      session,
      timestamp,
      sets: session.sets.filter(
        (set) => isWorkingSet(set) && matchesExercise(set, exerciseId, exerciseName),
      ),
    }))
    .filter(({ sets }) => sets.length > 0)
    .sort((a, b) => a.timestamp - b.timestamp);
  const bounded = matches.slice(Math.max(0, matches.length - pointLimit));

  return {
    exerciseId: exerciseId?.trim() || null,
    exerciseName: exerciseName?.trim() || bounded.at(-1)?.sets.at(-1)?.exerciseName || null,
    period: {
      startAt: new Date(startTimestamp).toISOString(),
      endAt: new Date(endTimestamp).toISOString(),
      days,
    },
    points: bounded.map(({ session, timestamp, sets }) => {
      const weightedSets = sets.filter((set) => set.weight > 0);
      const estimates = sets
        .map((set) => calculateComparableEstimated1Rm(set.weight, set.reps))
        .filter((estimate): estimate is number => estimate !== null);
      return {
        sessionId: session.id,
        workoutTitle: session.workoutTitle,
        completedAt: new Date(timestamp).toISOString(),
        workingSetCount: sets.length,
        bestWeight:
          weightedSets.length > 0 ? Math.max(...weightedSets.map((set) => set.weight)) : null,
        bestEstimated1Rm: estimates.length > 0 ? Math.max(...estimates) : null,
        totalVolume: weightedSets.reduce((total, set) => total + set.weight * set.reps, 0),
      };
    }),
    totalMatchingSessions: matches.length,
    pointsTruncated: matches.length > bounded.length,
  };
};
