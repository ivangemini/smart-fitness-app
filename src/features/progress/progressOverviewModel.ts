import { buildTrainingProgressAnalytics, getWeightAnalytics } from '@/lib/progress';
import type { BodyMeasurement, WeightEntry, WorkoutSession } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PERIOD_DAYS = 28;
const OVERVIEW_MAX_EXERCISES = 50;

export type ProgressOverview = {
  period: {
    startAt: string;
    endAt: string;
    days: number;
  };
  body: {
    currentWeight: number | null;
    weightDelta7Days: number | null;
    measurementCount: number;
    latestMeasurementAt: string | null;
  };
  strengthTraining: {
    sessionCount: number;
    workoutsPerWeek: number;
    volumeTrend: 'up' | 'down' | 'stable' | 'insufficient_data';
    topExercise: {
      exerciseName: string;
      periodBestEstimated1Rm: number | null;
      estimated1RmTrend: 'up' | 'down' | 'stable' | 'insufficient_data';
    } | null;
  };
  activity: {
    activeDayCount: number;
    sessionsLast7Days: number;
    latestWorkoutAt: string | null;
  };
  highlights: {
    recentEstimated1RmRecordCount: number;
    improvingExerciseCount: number;
    decliningExerciseCount: number;
    hasTrainingEvidence: boolean;
  };
};

const parseTimestamp = (value: string | undefined) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const sessionTimestamp = (session: WorkoutSession) =>
  parseTimestamp(session.finishedAt) ?? parseTimestamp(session.startedAt);

const latestTimestamp = (values: Array<string | undefined>) => {
  const timestamps = values
    .map(parseTimestamp)
    .filter((value): value is number => value !== null);
  return timestamps.length > 0 ? Math.max(...timestamps) : null;
};

export const buildProgressOverview = ({
  bodyMeasurements,
  endAt,
  periodDays = DEFAULT_PERIOD_DAYS,
  weightHistory,
  workoutSessions,
}: {
  bodyMeasurements: BodyMeasurement[];
  endAt: string;
  periodDays?: number;
  weightHistory: WeightEntry[];
  workoutSessions: WorkoutSession[];
}): ProgressOverview => {
  const training = buildTrainingProgressAnalytics(workoutSessions, {
    endAt,
    periodDays,
    maxExercises: OVERVIEW_MAX_EXERCISES,
  });
  const endTimestamp = Date.parse(training.period.endAt);
  const last7DaysStart = endTimestamp - 7 * DAY_MS;
  const weight = getWeightAnalytics(weightHistory);
  const latestMeasurementTimestamp = latestTimestamp(
    bodyMeasurements.map((measurement) => measurement.createdAt),
  );
  const relevantSessions = workoutSessions
    .map((session) => ({ session, timestamp: sessionTimestamp(session) }))
    .filter(
      (entry): entry is { session: WorkoutSession; timestamp: number } =>
        entry.timestamp !== null && entry.timestamp <= endTimestamp,
    );
  const latestWorkoutTimestamp = relevantSessions.reduce<number | null>(
    (latest, entry) => (latest === null || entry.timestamp > latest ? entry.timestamp : latest),
    null,
  );
  const sessionsLast7Days = relevantSessions.filter(
    ({ timestamp }) => timestamp >= last7DaysStart && timestamp <= endTimestamp,
  ).length;
  const recentEstimated1RmRecordCount = training.exercises.filter((exercise) => {
    const recordTimestamp = parseTimestamp(exercise.allTimeEstimated1RmRecordAt ?? undefined);
    return (
      recordTimestamp !== null &&
      recordTimestamp >= Date.parse(training.period.startAt) &&
      recordTimestamp <= endTimestamp
    );
  }).length;
  const topExercise = training.exercises[0] ?? null;

  return {
    period: training.period,
    body: {
      currentWeight: weight.currentWeight,
      weightDelta7Days: weight.delta7Days,
      measurementCount: bodyMeasurements.length,
      latestMeasurementAt:
        latestMeasurementTimestamp === null
          ? null
          : new Date(latestMeasurementTimestamp).toISOString(),
    },
    strengthTraining: {
      sessionCount: training.frequency.sessionCount,
      workoutsPerWeek: training.frequency.workoutsPerWeek,
      volumeTrend: training.volume.trend,
      topExercise: topExercise
        ? {
            exerciseName: topExercise.exerciseName,
            periodBestEstimated1Rm: topExercise.periodBestEstimated1Rm,
            estimated1RmTrend: topExercise.estimated1RmTrend,
          }
        : null,
    },
    activity: {
      activeDayCount: training.frequency.activeDayCount,
      sessionsLast7Days,
      latestWorkoutAt:
        latestWorkoutTimestamp === null ? null : new Date(latestWorkoutTimestamp).toISOString(),
    },
    highlights: {
      recentEstimated1RmRecordCount,
      improvingExerciseCount: training.exercises.filter(
        (exercise) => exercise.estimated1RmTrend === 'up',
      ).length,
      decliningExerciseCount: training.exercises.filter(
        (exercise) => exercise.estimated1RmTrend === 'down',
      ).length,
      hasTrainingEvidence: training.evidence.sessionCount > 0,
    },
  };
};
