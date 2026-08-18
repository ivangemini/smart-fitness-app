import type { FoodEntry, NutritionTargets } from '@/types';
import {
  buildNutritionProgressAnalytics,
  type NutritionProgressAnalytics,
} from '@/lib/progress/nutritionAnalytics';

import type { CoachCanonicalCapabilityResult } from './coachCanonicalCapabilities';

const DEFAULT_COACH_NUTRITION_DAYS = 14;
const MAX_COACH_NUTRITION_DAYS = 90;

const clampDays = (value: number | undefined) => {
  if (!Number.isFinite(value)) return DEFAULT_COACH_NUTRITION_DAYS;
  return Math.min(MAX_COACH_NUTRITION_DAYS, Math.max(1, Math.trunc(value as number)));
};

export type CoachNutritionAnalyticsData = Omit<NutritionProgressAnalytics, 'loggedDays'>;

export const readNutritionAnalytics = ({
  foodEntries,
  nutritionTargets,
  endAt,
  days,
}: {
  foodEntries: FoodEntry[];
  nutritionTargets: NutritionTargets;
  endAt: string;
  days?: number;
}): CoachCanonicalCapabilityResult<CoachNutritionAnalyticsData> => {
  if (!Number.isFinite(Date.parse(endAt))) {
    return {
      ok: false,
      error: {
        code: 'invalid_end_at',
        message: 'A valid endAt timestamp is required.',
      },
    };
  }

  const { loggedDays: _loggedDays, ...analytics } = buildNutritionProgressAnalytics(
    foodEntries,
    nutritionTargets,
    { endAt, periodDays: clampDays(days) },
  );
  return { ok: true, data: analytics };
};
