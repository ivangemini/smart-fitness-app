import type { TrainingProgressAnalytics } from '@/lib/progress';

const DEFAULT_HIGHLIGHT_LIMIT = 3;
const MAX_HIGHLIGHT_LIMIT = 5;
const MIN_HIGHLIGHT_SESSION_COUNT = 2;

export type ProgressTrainingHighlight = {
  exerciseId: string;
  exerciseName: string;
  estimatedOneRepMax: number;
  recordedAt: string;
};

const toTimestamp = (value: string | null | undefined) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const clampHighlightLimit = (value: number | undefined) => {
  if (!Number.isFinite(value)) return DEFAULT_HIGHLIGHT_LIMIT;
  return Math.min(MAX_HIGHLIGHT_LIMIT, Math.max(1, Math.trunc(value as number)));
};

export const countImprovingExercises = (analytics: TrainingProgressAnalytics) =>
  analytics.exercises.filter((exercise) => exercise.estimated1RmTrend === 'up').length;

export const getRecentTrainingHighlights = (
  analytics: TrainingProgressAnalytics,
  limit?: number,
): ProgressTrainingHighlight[] => {
  const startAt = toTimestamp(analytics.period.startAt);
  const endAt = toTimestamp(analytics.period.endAt);
  if (startAt === null || endAt === null) return [];

  return analytics.exercises
    .map((exercise) => {
      const recordedAt = exercise.allTimeEstimated1RmRecordAt;
      const timestamp = toTimestamp(recordedAt);
      if (
        exercise.sessionCount < MIN_HIGHLIGHT_SESSION_COUNT ||
        timestamp === null ||
        timestamp < startAt ||
        timestamp > endAt ||
        exercise.allTimeBestEstimated1Rm === null
      ) {
        return null;
      }

      return {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        estimatedOneRepMax: exercise.allTimeBestEstimated1Rm,
        recordedAt: recordedAt!,
      } satisfies ProgressTrainingHighlight;
    })
    .filter((value): value is ProgressTrainingHighlight => value !== null)
    .sort((left, right) => Date.parse(right.recordedAt) - Date.parse(left.recordedAt))
    .slice(0, clampHighlightLimit(limit));
};
