import type { ExerciseHistoryGroup } from './history';

export type ExerciseProgressTrendPoint = {
  key: string;
  finishedAt: string;
  value: number;
};

export type ExerciseProgressTopSet = {
  id: string;
  weight: number;
  reps: number;
  actualRpe: number | null;
  estimatedOneRepMax: number;
};

export type ExerciseSessionPerformance = {
  sessionId: string;
  workoutTitle: string;
  finishedAt: string;
  volume: number;
  bestWeight: number;
  bestReps: number;
  estimatedOneRepMax: number;
  averageActualRpe: number | null;
  topSet: ExerciseProgressTopSet | null;
};

export type ExerciseRecentComparison = {
  latest: ExerciseSessionPerformance;
  previous: ExerciseSessionPerformance | null;
  volumeDeltaPercent: number | null;
  estimatedOneRepMaxDeltaPercent: number | null;
};

export type ExerciseProgressMetrics = {
  bestWeight: number;
  bestReps: number;
  totalVolume: number;
  estimatedOneRepMax: number;
  volumeTrend: ExerciseProgressTrendPoint[];
  loadTrend: ExerciseProgressTrendPoint[];
  estimatedOneRepMaxTrend: ExerciseProgressTrendPoint[];
  recentSessions: ExerciseSessionPerformance[];
  recentComparison: ExerciseRecentComparison | null;
};

export const calculateEstimatedOneRepMax = (weight: number, reps: number) => {
  if (weight <= 0 || reps <= 0) {
    return 0;
  }

  return weight * (1 + reps / 30);
};

const percentDelta = (current: number, previous: number) => {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
};

const summarizeSession = (
  group: ExerciseHistoryGroup,
): ExerciseSessionPerformance | null => {
  const sets = group.sets.filter((set) => set.setType !== 'warmup');
  if (sets.length === 0) return null;

  const rpeValues = sets.flatMap((set) =>
    set.actualRpe === undefined ? [] : [set.actualRpe],
  );
  const topSet = sets.reduce<ExerciseProgressTopSet | null>((best, set) => {
    const estimatedOneRepMax = calculateEstimatedOneRepMax(set.weight, set.reps);
    const candidate: ExerciseProgressTopSet = {
      id: set.id,
      weight: set.weight,
      reps: set.reps,
      actualRpe: set.actualRpe ?? null,
      estimatedOneRepMax,
    };

    if (!best) return candidate;
    if (candidate.estimatedOneRepMax !== best.estimatedOneRepMax) {
      return candidate.estimatedOneRepMax > best.estimatedOneRepMax ? candidate : best;
    }
    if (candidate.weight !== best.weight) {
      return candidate.weight > best.weight ? candidate : best;
    }
    return candidate.reps > best.reps ? candidate : best;
  }, null);

  return {
    sessionId: group.sessionId,
    workoutTitle: group.workoutTitle,
    finishedAt: group.finishedAt,
    volume: sets.reduce((total, set) => total + set.weight * set.reps, 0),
    bestWeight: sets.reduce((best, set) => Math.max(best, set.weight), 0),
    bestReps: sets.reduce((best, set) => Math.max(best, set.reps), 0),
    estimatedOneRepMax: topSet?.estimatedOneRepMax ?? 0,
    averageActualRpe:
      rpeValues.length === 0
        ? null
        : rpeValues.reduce((total, value) => total + value, 0) / rpeValues.length,
    topSet,
  };
};

export const calculateExerciseProgressMetrics = (
  historyGroups: ExerciseHistoryGroup[],
): ExerciseProgressMetrics => {
  const recentSessions = historyGroups
    .map(summarizeSession)
    .filter((session): session is ExerciseSessionPerformance => Boolean(session));
  const sets = historyGroups.flatMap((group) =>
    group.sets.filter((set) => set.setType !== 'warmup'),
  );
  const totalVolume = sets.reduce((total, set) => total + set.weight * set.reps, 0);
  const estimatedOneRepMax = sets.reduce(
    (best, set) => Math.max(best, calculateEstimatedOneRepMax(set.weight, set.reps)),
    0,
  );
  const bestWeight = sets.reduce((best, set) => Math.max(best, set.weight), 0);
  const bestReps = sets.reduce((best, set) => Math.max(best, set.reps), 0);
  const trendSessions = recentSessions.slice(0, 6).reverse();
  const latest = recentSessions[0] ?? null;
  const previous = recentSessions[1] ?? null;

  return {
    bestWeight,
    bestReps,
    totalVolume,
    estimatedOneRepMax,
    volumeTrend: trendSessions.map((session) => ({
      key: session.sessionId,
      finishedAt: session.finishedAt,
      value: session.volume,
    })),
    loadTrend: trendSessions.map((session) => ({
      key: session.sessionId,
      finishedAt: session.finishedAt,
      value: session.bestWeight,
    })),
    estimatedOneRepMaxTrend: trendSessions.map((session) => ({
      key: session.sessionId,
      finishedAt: session.finishedAt,
      value: session.estimatedOneRepMax,
    })),
    recentSessions,
    recentComparison: latest
      ? {
          latest,
          previous,
          volumeDeltaPercent: previous
            ? percentDelta(latest.volume, previous.volume)
            : null,
          estimatedOneRepMaxDeltaPercent: previous
            ? percentDelta(latest.estimatedOneRepMax, previous.estimatedOneRepMax)
            : null,
        }
      : null,
  };
};
