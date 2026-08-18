import { buildTrainingProgressAnalytics, type TrainingTrend } from './trainingAnalytics';
import type { WorkoutSession } from '@/types';

const DEFAULT_PERIOD_DAYS = 28;
const MAX_PERIOD_DAYS = 180;
const MAX_EXERCISES = 50;
const MAX_ITEMS_PER_GROUP = 12;

export type ProgressHighlightItem = {
  exerciseId: string;
  exerciseName: string;
  trend: TrainingTrend;
  previousEstimated1Rm: number | null;
  recentEstimated1Rm: number | null;
  allTimeEstimated1Rm: number | null;
  recordAt: string | null;
};

export type ProgressHighlightAnalytics = {
  period: { startAt: string; endAt: string; days: number };
  recordExercises: ProgressHighlightItem[];
  improvingExercises: ProgressHighlightItem[];
  decliningExercises: ProgressHighlightItem[];
  stableExercises: ProgressHighlightItem[];
  counts: {
    records: number;
    improving: number;
    declining: number;
    stable: number;
  };
  truncated: {
    records: boolean;
    improving: boolean;
    declining: boolean;
    stable: boolean;
  };
  evidence: {
    sessionCount: number;
    estimated1RmSetCount: number;
  };
};

const clampDays = (value: number | undefined) => {
  if (!Number.isFinite(value)) return DEFAULT_PERIOD_DAYS;
  return Math.min(MAX_PERIOD_DAYS, Math.max(1, Math.trunc(value as number)));
};

const toItem = (exercise: ReturnType<typeof buildTrainingProgressAnalytics>['exercises'][number]): ProgressHighlightItem => ({
  exerciseId: exercise.exerciseId,
  exerciseName: exercise.exerciseName,
  trend: exercise.estimated1RmTrend,
  previousEstimated1Rm: exercise.previousHalfBestEstimated1Rm,
  recentEstimated1Rm: exercise.recentHalfBestEstimated1Rm,
  allTimeEstimated1Rm: exercise.allTimeBestEstimated1Rm,
  recordAt: exercise.allTimeEstimated1RmRecordAt,
});

const bound = (items: ProgressHighlightItem[]) => items.slice(0, MAX_ITEMS_PER_GROUP);

export const buildProgressHighlightAnalytics = (
  sessions: WorkoutSession[],
  options: { endAt: string; periodDays?: number },
): ProgressHighlightAnalytics => {
  const periodDays = clampDays(options.periodDays);
  const training = buildTrainingProgressAnalytics(sessions, {
    endAt: options.endAt,
    periodDays,
    maxExercises: MAX_EXERCISES,
  });
  const startTimestamp = Date.parse(training.period.startAt);
  const endTimestamp = Date.parse(training.period.endAt);
  const items = training.exercises.map(toItem);
  const recordExercises = items.filter((item) => {
    if (!item.recordAt) return false;
    const timestamp = Date.parse(item.recordAt);
    return Number.isFinite(timestamp) && timestamp >= startTimestamp && timestamp <= endTimestamp;
  });
  const improvingExercises = items.filter((item) => item.trend === 'up');
  const decliningExercises = items.filter((item) => item.trend === 'down');
  const stableExercises = items.filter((item) => item.trend === 'stable');

  return {
    period: training.period,
    recordExercises: bound(recordExercises),
    improvingExercises: bound(improvingExercises),
    decliningExercises: bound(decliningExercises),
    stableExercises: bound(stableExercises),
    counts: {
      records: recordExercises.length,
      improving: improvingExercises.length,
      declining: decliningExercises.length,
      stable: stableExercises.length,
    },
    truncated: {
      records: recordExercises.length > MAX_ITEMS_PER_GROUP,
      improving: improvingExercises.length > MAX_ITEMS_PER_GROUP,
      declining: decliningExercises.length > MAX_ITEMS_PER_GROUP,
      stable: stableExercises.length > MAX_ITEMS_PER_GROUP,
    },
    evidence: {
      sessionCount: training.evidence.sessionCount,
      estimated1RmSetCount: training.evidence.estimated1RmSetCount,
    },
  };
};
