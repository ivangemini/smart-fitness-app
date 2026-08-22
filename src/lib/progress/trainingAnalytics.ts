import { calculateEstimated1RM } from '@/lib/workouts';
import type { WorkoutSession, WorkoutSet } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PERIOD_DAYS = 28;
const MIN_PERIOD_DAYS = 1;
const MAX_PERIOD_DAYS = 180;
const DEFAULT_MAX_EXERCISES = 12;
const MAX_EXERCISES = 50;
const VOLUME_TREND_THRESHOLD = 0.05;
const STRENGTH_TREND_THRESHOLD = 0.025;

export type TrainingTrend = 'up' | 'down' | 'stable' | 'insufficient_data';

export type TrainingAnalyticsPeriod = {
  startAt: string;
  endAt: string;
  days: number;
};

export type TrainingFrequencyFact = {
  sessionCount: number;
  activeDayCount: number;
  workoutsPerWeek: number;
};

export type TrainingVolumeFact = {
  totalVolume: number;
  previousHalfVolume: number | null;
  recentHalfVolume: number | null;
  comparableSessionCount: number;
  trend: TrainingTrend;
};

export type ExerciseTrainingFact = {
  exerciseId: string;
  exerciseName: string;
  sessionCount: number;
  workingSetCount: number;
  periodBestWeight: number | null;
  periodBestEstimated1Rm: number | null;
  previousHalfBestEstimated1Rm: number | null;
  recentHalfBestEstimated1Rm: number | null;
  estimated1RmTrend: TrainingTrend;
  allTimeBestWeight: number | null;
  allTimeBestEstimated1Rm: number | null;
  allTimeEstimated1RmRecordAt: string | null;
};

export type TrainingProgressAnalytics = {
  period: TrainingAnalyticsPeriod;
  frequency: TrainingFrequencyFact;
  volume: TrainingVolumeFact;
  exercises: ExerciseTrainingFact[];
  evidence: {
    sessionCount: number;
    workingSetCount: number;
    weightedSetCount: number;
    estimated1RmSetCount: number;
  };
};

export type BuildTrainingProgressAnalyticsOptions = {
  endAt: string;
  periodDays?: number;
  maxExercises?: number;
};

type TimestampedSession = {
  session: WorkoutSession;
  timestamp: number;
};

type TimestampedSet = {
  set: WorkoutSet;
  timestamp: number;
};

const clampInteger = (value: number | undefined, fallback: number, min: number, max: number) => {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(value as number)));
};

const round = (value: number, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
};

const parseTimestamp = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const getSessionTimestamp = (session: WorkoutSession) =>
  parseTimestamp(session.finishedAt) ?? parseTimestamp(session.startedAt);

const isWorkingSet = (set: WorkoutSet) =>
  set.setType !== 'warmup' &&
  set.completed !== false &&
  Number.isFinite(set.reps) &&
  set.reps > 0 &&
  Number.isFinite(set.weight) &&
  set.weight >= 0;

const isWeightedSet = (set: WorkoutSet) => isWorkingSet(set) && set.weight > 0;

export const calculateComparableEstimated1Rm = (weight: number, reps: number) => {
  if (!Number.isFinite(weight) || !Number.isFinite(reps) || weight <= 0 || reps < 1 || reps > 12) {
    return null;
  }

  return round(calculateEstimated1RM(weight, reps));
};

const sumSessionVolume = (session: WorkoutSession) =>
  session.sets.reduce((total, set) => {
    if (!isWeightedSet(set)) {
      return total;
    }

    return total + set.weight * set.reps;
  }, 0);

const getTrend = (
  previousValue: number | null,
  recentValue: number | null,
  threshold: number,
): TrainingTrend => {
  if (previousValue === null || recentValue === null || previousValue <= 0) {
    return 'insufficient_data';
  }

  const relativeChange = (recentValue - previousValue) / previousValue;

  if (relativeChange > threshold) {
    return 'up';
  }

  if (relativeChange < -threshold) {
    return 'down';
  }

  return 'stable';
};

const normalizeExerciseName = (value: string) => value.trim().toLocaleLowerCase();

const exerciseKey = (set: WorkoutSet) => {
  const id = set.exerciseId.trim();
  return id ? `id:${id}` : `name:${normalizeExerciseName(set.exerciseName)}`;
};

const toTimestampedSessions = (sessions: WorkoutSession[]) =>
  sessions
    .map((session) => {
      const timestamp = getSessionTimestamp(session);
      return timestamp === null ? null : { session, timestamp };
    })
    .filter((value): value is TimestampedSession => value !== null)
    .sort((a, b) => a.timestamp - b.timestamp);

const bestEstimated1Rm = (sets: TimestampedSet[]) => {
  let best: number | null = null;

  sets.forEach(({ set }) => {
    const estimate = calculateComparableEstimated1Rm(set.weight, set.reps);
    if (estimate !== null && (best === null || estimate > best)) {
      best = estimate;
    }
  });

  return best;
};

const bestWeight = (sets: TimestampedSet[]) => {
  const weights = sets.filter(({ set }) => isWeightedSet(set)).map(({ set }) => set.weight);
  return weights.length > 0 ? Math.max(...weights) : null;
};

export const buildTrainingProgressAnalytics = (
  sessions: WorkoutSession[],
  options: BuildTrainingProgressAnalyticsOptions,
): TrainingProgressAnalytics => {
  const endTimestamp = parseTimestamp(options.endAt);

  if (endTimestamp === null) {
    throw new Error('buildTrainingProgressAnalytics requires a valid endAt timestamp');
  }

  const periodDays = clampInteger(options.periodDays, DEFAULT_PERIOD_DAYS, MIN_PERIOD_DAYS, MAX_PERIOD_DAYS);
  const maxExercises = clampInteger(options.maxExercises, DEFAULT_MAX_EXERCISES, 1, MAX_EXERCISES);
  const startTimestamp = endTimestamp - periodDays * DAY_MS;
  const midpointTimestamp = startTimestamp + (endTimestamp - startTimestamp) / 2;
  const timestampedSessions = toTimestampedSessions(sessions).filter(({ timestamp }) => timestamp <= endTimestamp);
  const periodSessions = timestampedSessions.filter(
    ({ timestamp }) => timestamp >= startTimestamp && timestamp <= endTimestamp,
  );
  const previousHalfSessions = periodSessions.filter(({ timestamp }) => timestamp < midpointTimestamp);
  const recentHalfSessions = periodSessions.filter(({ timestamp }) => timestamp >= midpointTimestamp);
  const previousHalfVolume = previousHalfSessions.length > 0
    ? round(previousHalfSessions.reduce((total, { session }) => total + sumSessionVolume(session), 0))
    : null;
  const recentHalfVolume = recentHalfSessions.length > 0
    ? round(recentHalfSessions.reduce((total, { session }) => total + sumSessionVolume(session), 0))
    : null;
  const activeDays = new Set(
    periodSessions.map(({ timestamp }) => new Date(timestamp).toISOString().slice(0, 10)),
  );
  const periodSets = periodSessions.flatMap(({ session, timestamp }) =>
    session.sets.filter(isWorkingSet).map((set) => ({ set, timestamp })),
  );
  const allHistorySets = timestampedSessions.flatMap(({ session, timestamp }) =>
    session.sets.filter(isWorkingSet).map((set) => ({ set, timestamp })),
  );
  const groupedPeriodSets = new Map<string, TimestampedSet[]>();

  periodSets.forEach((item) => {
    const key = exerciseKey(item.set);
    const existing = groupedPeriodSets.get(key) ?? [];
    existing.push(item);
    groupedPeriodSets.set(key, existing);
  });

  const exercises = Array.from(groupedPeriodSets.entries())
    .map(([key, sets]): ExerciseTrainingFact => {
      const representative = sets[sets.length - 1].set;
      const previousSets = sets.filter(({ timestamp }) => timestamp < midpointTimestamp);
      const recentSets = sets.filter(({ timestamp }) => timestamp >= midpointTimestamp);
      const previousBest = bestEstimated1Rm(previousSets);
      const recentBest = bestEstimated1Rm(recentSets);
      const allTimeSets = allHistorySets.filter((item) => exerciseKey(item.set) === key);
      const allTimeEstimatedSets = allTimeSets
        .map((item) => ({ ...item, estimate: calculateComparableEstimated1Rm(item.set.weight, item.set.reps) }))
        .filter((item): item is TimestampedSet & { estimate: number } => item.estimate !== null);
      const allTimeRecord = allTimeEstimatedSets.reduce<
        (TimestampedSet & { estimate: number }) | null
      >((best, item) => (best === null || item.estimate > best.estimate ? item : best), null);
      const sessionKeys = new Set(
        periodSessions
          .filter(({ session }) => session.sets.some((set) => isWorkingSet(set) && exerciseKey(set) === key))
          .map(({ session }) => session.id),
      );

      return {
        exerciseId: representative.exerciseId,
        exerciseName: representative.exerciseName,
        sessionCount: sessionKeys.size,
        workingSetCount: sets.length,
        periodBestWeight: bestWeight(sets),
        periodBestEstimated1Rm: bestEstimated1Rm(sets),
        previousHalfBestEstimated1Rm: previousBest,
        recentHalfBestEstimated1Rm: recentBest,
        estimated1RmTrend: getTrend(previousBest, recentBest, STRENGTH_TREND_THRESHOLD),
        allTimeBestWeight: bestWeight(allTimeSets),
        allTimeBestEstimated1Rm: allTimeRecord?.estimate ?? null,
        allTimeEstimated1RmRecordAt: allTimeRecord ? new Date(allTimeRecord.timestamp).toISOString() : null,
      };
    })
    .sort((a, b) => b.sessionCount - a.sessionCount || b.workingSetCount - a.workingSetCount || a.exerciseName.localeCompare(b.exerciseName))
    .slice(0, maxExercises);

  const weightedSetCount = periodSets.filter(({ set }) => isWeightedSet(set)).length;
  const estimated1RmSetCount = periodSets.filter(
    ({ set }) => calculateComparableEstimated1Rm(set.weight, set.reps) !== null,
  ).length;
  const comparableSessionCount = periodSessions.filter(({ session }) => sumSessionVolume(session) > 0).length;

  return {
    period: {
      startAt: new Date(startTimestamp).toISOString(),
      endAt: new Date(endTimestamp).toISOString(),
      days: periodDays,
    },
    frequency: {
      sessionCount: periodSessions.length,
      activeDayCount: activeDays.size,
      workoutsPerWeek: round((periodSessions.length * 7) / periodDays),
    },
    volume: {
      totalVolume: round(periodSessions.reduce((total, { session }) => total + sumSessionVolume(session), 0)),
      previousHalfVolume,
      recentHalfVolume,
      comparableSessionCount,
      trend: getTrend(previousHalfVolume, recentHalfVolume, VOLUME_TREND_THRESHOLD),
    },
    exercises,
    evidence: {
      sessionCount: periodSessions.length,
      workingSetCount: periodSets.length,
      weightedSetCount,
      estimated1RmSetCount,
    },
  };
};
