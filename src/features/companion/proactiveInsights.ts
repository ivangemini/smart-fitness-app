import { buildTrainingProgressAnalytics } from '@/lib/progress/trainingAnalytics';
import type { WorkoutSession } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const PERIOD_DAYS = 28;
const HALF_PERIOD_DAYS = PERIOD_DAYS / 2;
const GLOBAL_COOLDOWN_DAYS = 7;
const MIN_PROGRESS_SESSIONS = 4;
const MIN_PROGRESS_SETS = 8;
const MIN_STAGNATION_SESSIONS = 6;
const MIN_STAGNATION_SETS = 12;
const PROGRESS_THRESHOLD = 0.05;

export type ProactiveInsightPresentationState = {
  lastShownAt?: string | null;
  dismissedKeys?: readonly string[];
};

export type ProactiveInsight =
  | {
      schemaVersion: 1;
      kind: 'strength_progress';
      key: string;
      exerciseId: string;
      exerciseName: string;
      periodDays: typeof PERIOD_DAYS;
      evidence: {
        sessionCount: number;
        workingSetCount: number;
        previousEstimated1Rm: number;
        recentEstimated1Rm: number;
        relativeChange: number;
      };
    }
  | {
      schemaVersion: 1;
      kind: 'strength_stagnation';
      key: string;
      exerciseId: string;
      exerciseName: string;
      periodDays: typeof PERIOD_DAYS;
      evidence: {
        sessionCount: number;
        workingSetCount: number;
        previousEstimated1Rm: number;
        recentEstimated1Rm: number;
      };
    }
  | {
      schemaVersion: 1;
      kind: 'consistency_up';
      key: string;
      periodDays: typeof PERIOD_DAYS;
      evidence: {
        previousActiveDays: number;
        recentActiveDays: number;
      };
    };

const parseTimestamp = (value: string | null | undefined) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const sessionTimestamp = (session: WorkoutSession) =>
  parseTimestamp(session.finishedAt) ?? parseTimestamp(session.startedAt);

const toLocalDayKey = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const stableExerciseKey = (exerciseId: string, exerciseName: string) => {
  const id = exerciseId.trim();
  if (id) return `id:${id}`;
  const name = exerciseName.trim().toLocaleLowerCase().replace(/[\s_-]+/g, '_');
  return `name:${name || 'unknown'}`;
};

const round = (value: number, digits = 4) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const isSuppressed = (
  insight: ProactiveInsight,
  presentation: ProactiveInsightPresentationState,
) => presentation.dismissedKeys?.includes(insight.key) ?? false;

const cooldownActive = (
  nowTimestamp: number,
  presentation: ProactiveInsightPresentationState,
) => {
  if (!presentation.lastShownAt) return false;
  const lastShownTimestamp = parseTimestamp(presentation.lastShownAt);
  if (lastShownTimestamp === null || lastShownTimestamp > nowTimestamp) return true;
  return nowTimestamp - lastShownTimestamp < GLOBAL_COOLDOWN_DAYS * DAY_MS;
};

const buildConsistencyInsight = (
  sessions: WorkoutSession[],
  nowTimestamp: number,
): ProactiveInsight | null => {
  const midpointTimestamp = nowTimestamp - HALF_PERIOD_DAYS * DAY_MS;
  const previousDays = new Set<string>();
  const recentDays = new Set<string>();

  sessions.forEach((session) => {
    const timestamp = sessionTimestamp(session);
    if (timestamp === null) return;
    const day = toLocalDayKey(timestamp);
    if (timestamp < midpointTimestamp) previousDays.add(day);
    else recentDays.add(day);
  });

  const previousActiveDays = previousDays.size;
  const recentActiveDays = recentDays.size;
  if (
    previousActiveDays < 1 ||
    recentActiveDays < 4 ||
    recentActiveDays < previousActiveDays + 2
  ) {
    return null;
  }

  return {
    schemaVersion: 1,
    kind: 'consistency_up',
    key: `consistency_up:${previousActiveDays}:${recentActiveDays}`,
    periodDays: PERIOD_DAYS,
    evidence: { previousActiveDays, recentActiveDays },
  };
};

export const selectProactiveInsight = ({
  sessions,
  nowAt,
  presentation = {},
}: {
  sessions: WorkoutSession[];
  nowAt: string;
  presentation?: ProactiveInsightPresentationState;
}): ProactiveInsight | null => {
  const nowTimestamp = parseTimestamp(nowAt);
  if (nowTimestamp === null) {
    throw new Error('selectProactiveInsight requires a valid nowAt timestamp');
  }
  if (cooldownActive(nowTimestamp, presentation)) return null;

  const startTimestamp = nowTimestamp - PERIOD_DAYS * DAY_MS;
  const boundedSessions = sessions.filter((session) => {
    const timestamp = sessionTimestamp(session);
    return (
      timestamp !== null &&
      timestamp >= startTimestamp &&
      timestamp <= nowTimestamp
    );
  });
  const analytics = buildTrainingProgressAnalytics(boundedSessions, {
    endAt: nowAt,
    periodDays: PERIOD_DAYS,
    maxExercises: 50,
  });

  const progressCandidates = analytics.exercises
    .filter(
      (exercise) =>
        exercise.sessionCount >= MIN_PROGRESS_SESSIONS &&
        exercise.workingSetCount >= MIN_PROGRESS_SETS &&
        exercise.previousHalfBestEstimated1Rm !== null &&
        exercise.recentHalfBestEstimated1Rm !== null &&
        exercise.previousHalfBestEstimated1Rm > 0,
    )
    .map((exercise) => ({
      exercise,
      relativeChange:
        (exercise.recentHalfBestEstimated1Rm! -
          exercise.previousHalfBestEstimated1Rm!) /
        exercise.previousHalfBestEstimated1Rm!,
    }))
    .filter(({ relativeChange }) => relativeChange >= PROGRESS_THRESHOLD)
    .sort((left, right) => right.relativeChange - left.relativeChange);

  for (const { exercise, relativeChange } of progressCandidates) {
    const exerciseKey = stableExerciseKey(exercise.exerciseId, exercise.exerciseName);
    const insight: ProactiveInsight = {
      schemaVersion: 1,
      kind: 'strength_progress',
      key: `strength_progress:${exerciseKey}:${exercise.recentHalfBestEstimated1Rm}`,
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.exerciseName,
      periodDays: PERIOD_DAYS,
      evidence: {
        sessionCount: exercise.sessionCount,
        workingSetCount: exercise.workingSetCount,
        previousEstimated1Rm: exercise.previousHalfBestEstimated1Rm!,
        recentEstimated1Rm: exercise.recentHalfBestEstimated1Rm!,
        relativeChange: round(relativeChange),
      },
    };
    if (!isSuppressed(insight, presentation)) return insight;
  }

  const stagnationCandidates = analytics.exercises
    .filter(
      (exercise) =>
        exercise.estimated1RmTrend === 'stable' &&
        exercise.sessionCount >= MIN_STAGNATION_SESSIONS &&
        exercise.workingSetCount >= MIN_STAGNATION_SETS &&
        exercise.previousHalfBestEstimated1Rm !== null &&
        exercise.recentHalfBestEstimated1Rm !== null,
    )
    .sort(
      (left, right) =>
        right.sessionCount - left.sessionCount ||
        right.workingSetCount - left.workingSetCount,
    );

  for (const exercise of stagnationCandidates) {
    const exerciseKey = stableExerciseKey(exercise.exerciseId, exercise.exerciseName);
    const insight: ProactiveInsight = {
      schemaVersion: 1,
      kind: 'strength_stagnation',
      key: `strength_stagnation:${exerciseKey}:${exercise.recentHalfBestEstimated1Rm}`,
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.exerciseName,
      periodDays: PERIOD_DAYS,
      evidence: {
        sessionCount: exercise.sessionCount,
        workingSetCount: exercise.workingSetCount,
        previousEstimated1Rm: exercise.previousHalfBestEstimated1Rm!,
        recentEstimated1Rm: exercise.recentHalfBestEstimated1Rm!,
      },
    };
    if (!isSuppressed(insight, presentation)) return insight;
  }

  const consistencyInsight = buildConsistencyInsight(
    boundedSessions,
    nowTimestamp,
  );
  if (consistencyInsight && !isSuppressed(consistencyInsight, presentation)) {
    return consistencyInsight;
  }

  return null;
};
