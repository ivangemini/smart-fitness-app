import type { FoodEntry, NutritionTargets } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PERIOD_DAYS = 14;
const MAX_PERIOD_DAYS = 90;

export type LoggedNutritionDay = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  entryCount: number;
};

export type NutritionLoggedDayAverages = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type NutritionTargetDeltaAverages = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type NutritionProgressAnalytics = {
  period: {
    startAt: string;
    endAt: string;
    days: number;
  };
  loggedDayCount: number;
  loggedDayCoverage: number;
  totalEntryCount: number;
  averagesAcrossLoggedDays: NutritionLoggedDayAverages | null;
  averageTargetDeltaAcrossLoggedDays: NutritionTargetDeltaAverages | null;
  proteinTargetMetLoggedDayCount: number;
  loggedDays: LoggedNutritionDay[];
};

const clampDays = (value: number | undefined) => {
  if (!Number.isFinite(value)) return DEFAULT_PERIOD_DAYS;
  return Math.min(MAX_PERIOD_DAYS, Math.max(1, Math.trunc(value as number)));
};

const round = (value: number, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
};

const parseTimestamp = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const averageLoggedDays = (days: LoggedNutritionDay[]): NutritionLoggedDayAverages | null => {
  if (days.length === 0) return null;
  const totals = days.reduce(
    (sum, day) => ({
      calories: sum.calories + day.calories,
      protein: sum.protein + day.protein,
      carbs: sum.carbs + day.carbs,
      fats: sum.fats + day.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );
  return {
    calories: round(totals.calories / days.length),
    protein: round(totals.protein / days.length),
    carbs: round(totals.carbs / days.length),
    fats: round(totals.fats / days.length),
  };
};

export const buildNutritionProgressAnalytics = (
  foodEntries: FoodEntry[],
  nutritionTargets: NutritionTargets,
  options: { endAt: string; periodDays?: number },
): NutritionProgressAnalytics => {
  const endTimestamp = parseTimestamp(options.endAt);
  if (endTimestamp === null) {
    throw new Error('buildNutritionProgressAnalytics requires a valid endAt timestamp');
  }

  const periodDays = clampDays(options.periodDays);
  const startTimestamp = endTimestamp - periodDays * DAY_MS;
  const totalsByDate = new Map<string, LoggedNutritionDay>();

  foodEntries.forEach((entry) => {
    const timestamp = parseTimestamp(entry.date);
    if (timestamp === null || timestamp < startTimestamp || timestamp > endTimestamp) return;
    const current = totalsByDate.get(entry.date) ?? {
      date: entry.date,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      entryCount: 0,
    };
    current.calories += entry.calories;
    current.protein += entry.protein;
    current.carbs += entry.carbs;
    current.fats += entry.fats;
    current.entryCount += 1;
    totalsByDate.set(entry.date, current);
  });

  const loggedDays = Array.from(totalsByDate.values())
    .map((day) => ({
      ...day,
      calories: round(day.calories),
      protein: round(day.protein),
      carbs: round(day.carbs),
      fats: round(day.fats),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
  const averages = averageLoggedDays(loggedDays);

  return {
    period: {
      startAt: new Date(startTimestamp).toISOString(),
      endAt: new Date(endTimestamp).toISOString(),
      days: periodDays,
    },
    loggedDayCount: loggedDays.length,
    loggedDayCoverage: round(loggedDays.length / periodDays, 4),
    totalEntryCount: loggedDays.reduce((sum, day) => sum + day.entryCount, 0),
    averagesAcrossLoggedDays: averages,
    averageTargetDeltaAcrossLoggedDays: averages
      ? {
          calories: round(averages.calories - nutritionTargets.calories),
          protein: round(averages.protein - nutritionTargets.protein),
          carbs: round(averages.carbs - nutritionTargets.carbs),
          fats: round(averages.fats - nutritionTargets.fats),
        }
      : null,
    proteinTargetMetLoggedDayCount: loggedDays.filter(
      (day) => day.protein >= nutritionTargets.protein,
    ).length,
    loggedDays,
  };
};
