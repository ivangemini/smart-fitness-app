import { describe, expect, it } from 'vitest';

import type { FoodEntry } from '@/types';

import { buildNutritionProgressAnalytics } from './nutritionAnalytics';

const makeEntry = (id: string, date: string): FoodEntry => ({
  id,
  name: `Food ${id}`,
  date,
  mealType: 'dinner',
  calories: 100,
  protein: 10,
  carbs: 10,
  fats: 2,
  source: 'manual',
  createdAt: `${date}T12:00:00.000Z`,
});

describe('nutrition logged-day coverage', () => {
  it('never exceeds 100% on an inclusive midnight boundary', () => {
    const entries = [
      '2026-08-11',
      '2026-08-12',
      '2026-08-13',
      '2026-08-14',
      '2026-08-15',
      '2026-08-16',
      '2026-08-17',
      '2026-08-18',
    ].map((date, index) => makeEntry(`entry-${index}`, date));
    const analytics = buildNutritionProgressAnalytics(
      entries,
      { calories: 2400, protein: 180, carbs: 260, fats: 70 },
      { endAt: '2026-08-18T00:00:00.000Z', periodDays: 7 },
    );

    expect(analytics.loggedDayCount).toBe(8);
    expect(analytics.loggedDayCoverage).toBe(1);
  });
});
