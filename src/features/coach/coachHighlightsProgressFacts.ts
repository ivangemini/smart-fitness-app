import { buildTrainingProgressAnalytics } from '@/lib/progress/trainingAnalytics';
import type { WorkoutSession } from '@/types';

import { COACH_HISTORY_MAX_DAYS } from './coachDataCapabilities';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_ITEMS_PER_GROUP = 12;

export type CoachHighlightsProgressFacts = {
  schemaVersion: 1;
  intent: 'training_highlights';
  period: { startAt: string; endAt: string; days: number };
  evidence: { sessionCount: number; estimated1RmSetCount: number };
  improving: Array<{
    exerciseId: string;
    exerciseName: string;
    previousEstimated1Rm: number;
    recentEstimated1Rm: number;
  }>;
  declining: Array<{
    exerciseId: string;
    exerciseName: string;
    previousEstimated1Rm: number;
    recentEstimated1Rm: number;
  }>;
  stable: Array<{
    exerciseId: string;
    exerciseName: string;
    previousEstimated1Rm: number;
    recentEstimated1Rm: number;
  }>;
  truncated: { improving: boolean; declining: boolean; stable: boolean };
  allTimeRecordEvidenceIncluded: false;
};

type TrendItem = CoachHighlightsProgressFacts['improving'][number];

const sessionTimestamp = (session: WorkoutSession) => {
  const finishedAt = Date.parse(session.finishedAt);
  if (Number.isFinite(finishedAt)) return finishedAt;
  const startedAt = Date.parse(session.startedAt);
  return Number.isFinite(startedAt) ? startedAt : null;
};

const toTrendItem = (
  exercise: ReturnType<typeof buildTrainingProgressAnalytics>['exercises'][number],
): TrendItem | null =>
  exercise.previousHalfBestEstimated1Rm !== null &&
  exercise.recentHalfBestEstimated1Rm !== null
    ? {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        previousEstimated1Rm: exercise.previousHalfBestEstimated1Rm,
        recentEstimated1Rm: exercise.recentHalfBestEstimated1Rm,
      }
    : null;

const collect = (
  exercises: ReturnType<typeof buildTrainingProgressAnalytics>['exercises'],
  trend: 'up' | 'down' | 'stable',
) =>
  exercises
    .filter((exercise) => exercise.estimated1RmTrend === trend)
    .map(toTrendItem)
    .filter((item): item is TrendItem => item !== null);

export const buildCoachHighlightsProgressFacts = ({
  sessions,
  endAt,
  days,
}: {
  sessions: WorkoutSession[];
  endAt: string;
  days: number;
}): CoachHighlightsProgressFacts => {
  const endTimestamp = Date.parse(endAt);
  if (!Number.isFinite(endTimestamp)) {
    throw new Error('buildCoachHighlightsProgressFacts requires a valid endAt timestamp');
  }
  const boundedDays = Math.min(
    COACH_HISTORY_MAX_DAYS,
    Math.max(1, Math.trunc(Number.isFinite(days) ? days : COACH_HISTORY_MAX_DAYS)),
  );
  const startTimestamp = endTimestamp - boundedDays * DAY_MS;
  const boundedSessions = sessions.filter((session) => {
    const timestamp = sessionTimestamp(session);
    return (
      timestamp !== null &&
      timestamp >= startTimestamp &&
      timestamp <= endTimestamp
    );
  });
  const analytics = buildTrainingProgressAnalytics(boundedSessions, {
    endAt,
    periodDays: boundedDays,
    maxExercises: 50,
  });
  const improving = collect(analytics.exercises, 'up');
  const declining = collect(analytics.exercises, 'down');
  const stable = collect(analytics.exercises, 'stable');

  return {
    schemaVersion: 1,
    intent: 'training_highlights',
    period: analytics.period,
    evidence: {
      sessionCount: analytics.evidence.sessionCount,
      estimated1RmSetCount: analytics.evidence.estimated1RmSetCount,
    },
    improving: improving.slice(0, MAX_ITEMS_PER_GROUP),
    declining: declining.slice(0, MAX_ITEMS_PER_GROUP),
    stable: stable.slice(0, MAX_ITEMS_PER_GROUP),
    truncated: {
      improving: improving.length > MAX_ITEMS_PER_GROUP,
      declining: declining.length > MAX_ITEMS_PER_GROUP,
      stable: stable.length > MAX_ITEMS_PER_GROUP,
    },
    allTimeRecordEvidenceIncluded: false,
  };
};
