import type { WorkoutSession } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PERIOD_DAYS = 28;
const MAX_PERIOD_DAYS = 180;
const MAX_RECENT_SESSIONS = 12;

export type ActivityBucket = {
  key: string;
  startAt: string;
  endAt: string;
  sessionCount: number;
  activeDayCount: number;
};

export type ActivityRecentSession = {
  sessionId: string;
  workoutTitle: string;
  completedAt: string;
};

export type ActivityProgressAnalytics = {
  period: {
    startAt: string;
    endAt: string;
    days: number;
  };
  sessionCount: number;
  activeDayCount: number;
  workoutsPerWeek: number;
  sessionsLast7Days: number;
  latestWorkoutAt: string | null;
  bucketDays: number;
  buckets: ActivityBucket[];
  recentSessions: ActivityRecentSession[];
  recentSessionsTruncated: boolean;
};

const clampDays = (days: number | undefined) => {
  if (!Number.isFinite(days)) return DEFAULT_PERIOD_DAYS;
  return Math.min(MAX_PERIOD_DAYS, Math.max(1, Math.trunc(days as number)));
};

const getTimestamp = (session: WorkoutSession) => {
  const finishedAt = Date.parse(session.finishedAt);
  if (Number.isFinite(finishedAt)) return finishedAt;
  const startedAt = Date.parse(session.startedAt);
  return Number.isFinite(startedAt) ? startedAt : null;
};

const getBucketDays = (periodDays: number) => {
  if (periodDays <= 35) return 7;
  if (periodDays <= 100) return 14;
  return 30;
};

const getDayKey = (timestamp: number) => new Date(timestamp).toISOString().slice(0, 10);

export const buildActivityProgressAnalytics = (
  sessions: WorkoutSession[],
  options: { endAt: string; periodDays?: number },
): ActivityProgressAnalytics => {
  const endTimestamp = Date.parse(options.endAt);
  if (!Number.isFinite(endTimestamp)) {
    throw new Error('buildActivityProgressAnalytics requires a valid endAt timestamp');
  }

  const periodDays = clampDays(options.periodDays);
  const startTimestamp = endTimestamp - periodDays * DAY_MS;
  const timestampedSessions = sessions
    .map((session) => ({ session, timestamp: getTimestamp(session) }))
    .filter(
      (entry): entry is { session: WorkoutSession; timestamp: number } =>
        entry.timestamp !== null &&
        entry.timestamp >= startTimestamp &&
        entry.timestamp <= endTimestamp,
    )
    .sort((a, b) => a.timestamp - b.timestamp);
  const activeDays = new Set(timestampedSessions.map(({ timestamp }) => getDayKey(timestamp)));
  const sevenDayStart = endTimestamp - 7 * DAY_MS;
  const sessionsLast7Days = timestampedSessions.filter(
    ({ timestamp }) => timestamp >= sevenDayStart,
  ).length;
  const bucketDays = getBucketDays(periodDays);
  const bucketMs = bucketDays * DAY_MS;
  const bucketCount = Math.ceil(periodDays / bucketDays);
  const buckets = Array.from({ length: bucketCount }, (_, index): ActivityBucket => {
    const bucketStart = startTimestamp + index * bucketMs;
    const bucketEnd = Math.min(endTimestamp, bucketStart + bucketMs);
    const isLastBucket = index === bucketCount - 1;
    const bucketSessions = timestampedSessions.filter(
      ({ timestamp }) =>
        timestamp >= bucketStart &&
        (timestamp < bucketEnd || (isLastBucket && timestamp <= bucketEnd)),
    );
    return {
      key: `${index}:${new Date(bucketStart).toISOString()}`,
      startAt: new Date(bucketStart).toISOString(),
      endAt: new Date(bucketEnd).toISOString(),
      sessionCount: bucketSessions.length,
      activeDayCount: new Set(bucketSessions.map(({ timestamp }) => getDayKey(timestamp))).size,
    };
  });
  const recent = [...timestampedSessions].reverse();
  const recentSessions = recent.slice(0, MAX_RECENT_SESSIONS).map(({ session, timestamp }) => ({
    sessionId: session.id,
    workoutTitle: session.workoutTitle,
    completedAt: new Date(timestamp).toISOString(),
  }));

  return {
    period: {
      startAt: new Date(startTimestamp).toISOString(),
      endAt: new Date(endTimestamp).toISOString(),
      days: periodDays,
    },
    sessionCount: timestampedSessions.length,
    activeDayCount: activeDays.size,
    workoutsPerWeek: Math.round(((timestampedSessions.length * 7) / periodDays) * 100) / 100,
    sessionsLast7Days,
    latestWorkoutAt: recent[0] ? new Date(recent[0].timestamp).toISOString() : null,
    bucketDays,
    buckets,
    recentSessions,
    recentSessionsTruncated: recent.length > recentSessions.length,
  };
};
