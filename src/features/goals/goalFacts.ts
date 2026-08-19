import type { ProfileState, WeightEntry, WorkoutSession } from '@/types';

export type GoalFacts = {
  goalType: ProfileState['goalType'];
  weight: {
    currentWeightKg: number | null;
    targetWeightKg: number;
    deltaToTargetKg: number | null;
    latestWeightAt: string | null;
  };
  training: {
    activeDaysLast7Days: number;
    targetDaysPerWeek: number;
    deltaToTargetDays: number;
    completedSessionCount: number;
    windowStartAt: string;
    windowEndAt: string;
  };
};

const parseTime = (value: string): number | null => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const getLatestWeight = (entries: WeightEntry[]): WeightEntry | null =>
  entries.reduce<WeightEntry | null>((latest, entry) => {
    const entryAt = parseTime(entry.date) ?? parseTime(entry.createdAt);
    if (entryAt === null || !Number.isFinite(entry.weight) || entry.weight <= 0) {
      return latest;
    }
    if (!latest) return entry;
    const latestAt = parseTime(latest.date) ?? parseTime(latest.createdAt) ?? Number.NEGATIVE_INFINITY;
    return entryAt > latestAt ? entry : latest;
  }, null);

const localDayKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const startOfLocalDay = (date: Date): Date => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

export const buildGoalFacts = ({
  endAt,
  profile,
  weightHistory,
  workoutSessions,
}: {
  endAt: string;
  profile: ProfileState;
  weightHistory: WeightEntry[];
  workoutSessions: WorkoutSession[];
}): GoalFacts => {
  const parsedEnd = new Date(endAt);
  const safeEnd = Number.isFinite(parsedEnd.getTime()) ? parsedEnd : new Date(0);
  const windowEnd = startOfLocalDay(safeEnd);
  windowEnd.setDate(windowEnd.getDate() + 1);
  const windowStart = new Date(windowEnd);
  windowStart.setDate(windowStart.getDate() - 7);

  const activeDays = new Set<string>();
  let completedSessionCount = 0;

  workoutSessions.forEach((session) => {
    const finishedAt = parseTime(session.finishedAt);
    if (finishedAt === null || finishedAt < windowStart.getTime() || finishedAt >= windowEnd.getTime()) {
      return;
    }
    completedSessionCount += 1;
    activeDays.add(localDayKey(new Date(finishedAt)));
  });

  const latestWeight = getLatestWeight(weightHistory);
  const currentWeightKg = latestWeight?.weight ?? null;
  const targetWeightKg = Number.isFinite(profile.targetWeight) && profile.targetWeight > 0
    ? profile.targetWeight
    : 0;
  const targetDaysPerWeek = Number.isFinite(profile.trainingDaysPerWeek)
    ? Math.min(7, Math.max(1, Math.round(profile.trainingDaysPerWeek)))
    : 1;

  return {
    goalType: profile.goalType,
    weight: {
      currentWeightKg,
      targetWeightKg,
      deltaToTargetKg:
        currentWeightKg === null || targetWeightKg <= 0
          ? null
          : targetWeightKg - currentWeightKg,
      latestWeightAt: latestWeight?.date ?? latestWeight?.createdAt ?? null,
    },
    training: {
      activeDaysLast7Days: activeDays.size,
      targetDaysPerWeek,
      deltaToTargetDays: targetDaysPerWeek - activeDays.size,
      completedSessionCount,
      windowStartAt: windowStart.toISOString(),
      windowEndAt: new Date(windowEnd.getTime() - 1).toISOString(),
    },
  };
};
