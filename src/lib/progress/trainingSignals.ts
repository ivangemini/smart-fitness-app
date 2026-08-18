import type { WorkoutSession, WorkoutSet } from '@/types';

import { calculateComparableEstimated1Rm } from './trainingAnalytics';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PERIOD_DAYS = 42;
const MAX_PERIOD_DAYS = 180;
const DEFAULT_MAX_EXERCISES = 12;
const MAX_EXERCISES = 30;
const MIN_PLATEAU_SESSIONS = 4;
const MIN_PLATEAU_SPAN_DAYS = 21;
const PLATEAU_CHANGE_THRESHOLD = 0.025;
const MIN_RPE_SETS_PER_HALF = 2;
const RPE_TREND_THRESHOLD = 0.25;

export type RecordedRpeTrend = 'higher' | 'lower' | 'stable' | 'insufficient_data';
export type ExerciseProgressSignal = 'progressing' | 'plateau' | 'declining' | 'insufficient_data';

export type TrainingRpeSignal = {
  workingSetCount: number;
  recordedSetCount: number;
  coverage: number;
  averageActualRpe: number | null;
  previousHalfAverageActualRpe: number | null;
  recentHalfAverageActualRpe: number | null;
  trend: RecordedRpeTrend;
};

export type ExerciseTrainingSignal = {
  exerciseId: string;
  exerciseName: string;
  comparableSessionCount: number;
  comparableSpanDays: number | null;
  previousBestEstimated1Rm: number | null;
  recentBestEstimated1Rm: number | null;
  estimated1RmChangeRatio: number | null;
  progressSignal: ExerciseProgressSignal;
  recordedRpeSetCount: number;
  averageActualRpe: number | null;
};

export type TrainingSignalAnalytics = {
  period: { startAt: string; endAt: string; days: number };
  rpe: TrainingRpeSignal;
  exercises: ExerciseTrainingSignal[];
  evidence: {
    sessionCount: number;
    workingSetCount: number;
    comparableEstimated1RmSetCount: number;
    recordedRpeSetCount: number;
  };
};

type TimestampedSession = { session: WorkoutSession; timestamp: number };
type TimestampedSet = { set: WorkoutSet; timestamp: number; sessionId: string };

const clampInteger = (value: number | undefined, fallback: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value as number)));
};

const round = (value: number, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
};

const parseTimestamp = (value: string | undefined) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const getSessionTimestamp = (session: WorkoutSession) =>
  parseTimestamp(session.finishedAt) ?? parseTimestamp(session.startedAt);

const isWorkingSet = (set: WorkoutSet) =>
  set.completed !== false &&
  Number.isFinite(set.reps) &&
  set.reps > 0 &&
  Number.isFinite(set.weight) &&
  set.weight >= 0;

const hasRecordedRpe = (set: WorkoutSet) =>
  isWorkingSet(set) && set.actualRpe !== undefined && Number.isFinite(set.actualRpe);

const average = (values: number[]) =>
  values.length > 0 ? round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;

const normalizeExerciseName = (value: string) => value.trim().toLocaleLowerCase();

const exerciseKey = (set: WorkoutSet) => {
  const id = set.exerciseId.trim();
  return id ? `id:${id}` : `name:${normalizeExerciseName(set.exerciseName)}`;
};

const getRpeTrend = (
  previousValues: number[],
  recentValues: number[],
): RecordedRpeTrend => {
  if (
    previousValues.length < MIN_RPE_SETS_PER_HALF ||
    recentValues.length < MIN_RPE_SETS_PER_HALF
  ) {
    return 'insufficient_data';
  }
  const previous = average(previousValues) as number;
  const recent = average(recentValues) as number;
  const delta = recent - previous;
  if (delta > RPE_TREND_THRESHOLD) return 'higher';
  if (delta < -RPE_TREND_THRESHOLD) return 'lower';
  return 'stable';
};

const buildExerciseProgressSignal = (
  sessionBests: Array<{ timestamp: number; estimate: number }>,
): Pick<
  ExerciseTrainingSignal,
  | 'comparableSpanDays'
  | 'previousBestEstimated1Rm'
  | 'recentBestEstimated1Rm'
  | 'estimated1RmChangeRatio'
  | 'progressSignal'
> => {
  if (sessionBests.length < MIN_PLATEAU_SESSIONS) {
    return {
      comparableSpanDays: null,
      previousBestEstimated1Rm: null,
      recentBestEstimated1Rm: null,
      estimated1RmChangeRatio: null,
      progressSignal: 'insufficient_data',
    };
  }

  const sorted = [...sessionBests].sort((a, b) => a.timestamp - b.timestamp);
  const spanDays = (sorted[sorted.length - 1].timestamp - sorted[0].timestamp) / DAY_MS;
  if (spanDays < MIN_PLATEAU_SPAN_DAYS) {
    return {
      comparableSpanDays: round(spanDays, 1),
      previousBestEstimated1Rm: null,
      recentBestEstimated1Rm: null,
      estimated1RmChangeRatio: null,
      progressSignal: 'insufficient_data',
    };
  }

  const splitIndex = Math.floor(sorted.length / 2);
  const previous = sorted.slice(0, splitIndex);
  const recent = sorted.slice(splitIndex);
  const previousBest = Math.max(...previous.map((item) => item.estimate));
  const recentBest = Math.max(...recent.map((item) => item.estimate));
  const changeRatio = previousBest > 0 ? (recentBest - previousBest) / previousBest : null;
  const progressSignal: ExerciseProgressSignal =
    changeRatio === null
      ? 'insufficient_data'
      : changeRatio > PLATEAU_CHANGE_THRESHOLD
        ? 'progressing'
        : changeRatio < -PLATEAU_CHANGE_THRESHOLD
          ? 'declining'
          : 'plateau';

  return {
    comparableSpanDays: round(spanDays, 1),
    previousBestEstimated1Rm: round(previousBest),
    recentBestEstimated1Rm: round(recentBest),
    estimated1RmChangeRatio: changeRatio === null ? null : round(changeRatio, 4),
    progressSignal,
  };
};

export const buildTrainingSignalAnalytics = (
  sessions: WorkoutSession[],
  options: { endAt: string; periodDays?: number; maxExercises?: number },
): TrainingSignalAnalytics => {
  const endTimestamp = Date.parse(options.endAt);
  if (!Number.isFinite(endTimestamp)) {
    throw new Error('buildTrainingSignalAnalytics requires a valid endAt timestamp');
  }

  const periodDays = clampInteger(options.periodDays, DEFAULT_PERIOD_DAYS, 1, MAX_PERIOD_DAYS);
  const maxExercises = clampInteger(options.maxExercises, DEFAULT_MAX_EXERCISES, 1, MAX_EXERCISES);
  const startTimestamp = endTimestamp - periodDays * DAY_MS;
  const midpointTimestamp = startTimestamp + (endTimestamp - startTimestamp) / 2;
  const timestampedSessions = sessions
    .map((session) => ({ session, timestamp: getSessionTimestamp(session) }))
    .filter(
      (entry): entry is TimestampedSession =>
        entry.timestamp !== null && entry.timestamp >= startTimestamp && entry.timestamp <= endTimestamp,
    )
    .sort((a, b) => a.timestamp - b.timestamp);
  const sets: TimestampedSet[] = timestampedSessions.flatMap(({ session, timestamp }) =>
    session.sets
      .filter(isWorkingSet)
      .map((set) => ({ set, timestamp, sessionId: session.id })),
  );
  const rpeSets = sets.filter(({ set }) => hasRecordedRpe(set));
  const previousRpeValues = rpeSets
    .filter(({ timestamp }) => timestamp < midpointTimestamp)
    .map(({ set }) => set.actualRpe as number);
  const recentRpeValues = rpeSets
    .filter(({ timestamp }) => timestamp >= midpointTimestamp)
    .map(({ set }) => set.actualRpe as number);
  const groupedSets = new Map<string, TimestampedSet[]>();
  sets.forEach((item) => {
    const key = exerciseKey(item.set);
    const group = groupedSets.get(key) ?? [];
    group.push(item);
    groupedSets.set(key, group);
  });

  const exercises = Array.from(groupedSets.values())
    .map((exerciseSets): ExerciseTrainingSignal => {
      const representative = exerciseSets[exerciseSets.length - 1].set;
      const sessionBestById = new Map<string, { timestamp: number; estimate: number }>();
      exerciseSets.forEach(({ sessionId, set, timestamp }) => {
        const estimate = calculateComparableEstimated1Rm(set.weight, set.reps);
        if (estimate === null) return;
        const current = sessionBestById.get(sessionId);
        if (!current || estimate > current.estimate) {
          sessionBestById.set(sessionId, { timestamp, estimate });
        }
      });
      const exerciseRpeValues = exerciseSets
        .filter(({ set }) => hasRecordedRpe(set))
        .map(({ set }) => set.actualRpe as number);
      const progress = buildExerciseProgressSignal(Array.from(sessionBestById.values()));

      return {
        exerciseId: representative.exerciseId,
        exerciseName: representative.exerciseName,
        comparableSessionCount: sessionBestById.size,
        ...progress,
        recordedRpeSetCount: exerciseRpeValues.length,
        averageActualRpe: average(exerciseRpeValues),
      };
    })
    .sort(
      (a, b) =>
        b.comparableSessionCount - a.comparableSessionCount ||
        b.recordedRpeSetCount - a.recordedRpeSetCount ||
        a.exerciseName.localeCompare(b.exerciseName),
    )
    .slice(0, maxExercises);
  const comparableEstimated1RmSetCount = sets.filter(
    ({ set }) => calculateComparableEstimated1Rm(set.weight, set.reps) !== null,
  ).length;

  return {
    period: {
      startAt: new Date(startTimestamp).toISOString(),
      endAt: new Date(endTimestamp).toISOString(),
      days: periodDays,
    },
    rpe: {
      workingSetCount: sets.length,
      recordedSetCount: rpeSets.length,
      coverage: sets.length > 0 ? round(rpeSets.length / sets.length, 4) : 0,
      averageActualRpe: average(rpeSets.map(({ set }) => set.actualRpe as number)),
      previousHalfAverageActualRpe: average(previousRpeValues),
      recentHalfAverageActualRpe: average(recentRpeValues),
      trend: getRpeTrend(previousRpeValues, recentRpeValues),
    },
    exercises,
    evidence: {
      sessionCount: timestampedSessions.length,
      workingSetCount: sets.length,
      comparableEstimated1RmSetCount,
      recordedRpeSetCount: rpeSets.length,
    },
  };
};
