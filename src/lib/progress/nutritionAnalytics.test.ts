import { describe, expect, it } from 'vitest';

import type { FoodEntry } from '@/types';

import { buildNutritionProgressAnalytics } from './nutritionAnalytics';

const makeEntry = (
  id: string,
  date: string,
  values: { calories: number; protein: number; carbs: number; fats: number },
): FoodEntry => ({
  id,
  name: `Food ${id}`,
  date,
  mealType: 'dinner',
  ...values,
  source: 'manual',
  createdAt: `${date}T18:00:00.000Z`,
});

const targets = { calories: 2400, protein: 180, carbs: 260, fats: 70 };

describe('buildNutritionProgressAnalytics', () => {
  it('averages only logged days and keeps unlogged days missing', () => {
    const analytics = buildNutritionProgressAnalytics(
      [
        makeEntry('a', '2026-08-17', { calories: 1200, protein: 100, carbs: 120, fats: 30 }),
        makeEntry('b', '2026-08-17', { calories: 1200, protein: 90, carbs: 140, fats: 40 }),
        makeEntry('c', '2026-08-15', { calories: 2000, protein: 170, carbs: 210, fats: 60 }),
      ],
      targets,
      { endAt: '2026-08-18T23:59:59.999Z', periodDays: 7 },
    );

    expect(analytics).toMatchObject({
      loggedDayCount: 2,
      loggedDayCoverage: 0.2857,
      totalEntryCount: 3,
      averagesAcrossLoggedDays: {
        calories: 2200,
        protein: 180,
        carbs: 235,
        fats: 65,
      },
      averageTargetDeltaAcrossLoggedDays: {
        calories: -200,
        protein: 0,
        carbs: -25,
        fats: -5,
      },
      proteinTargetMetLoggedDayCount: 1,
    });
    expect(analytics.loggedDays.map((day) => day.date)).toEqual(['2026-08-17', '2026-08-15']);
  });

  it('returns explicit missing averages when there are no logged days', () => {
    const analytics = buildNutritionProgressAnalytics([], targets, {
      endAt: '2026-08-18T23:59:59.999Z',
      periodDays: 14,
    });

    expect(analytics.loggedDayCount).toBe(0);
    expect(analytics.loggedDayCoverage).toBe(0);
    expect(analytics.averagesAcrossLoggedDays).toBeNull();
    expect(analytics.averageTargetDeltaAcrossLoggedDays).toBeNull();
    expect(analytics.proteinTargetMetLoggedDayCount).toBe(0);
  });

  it('excludes entries outside the bounded period and clamps at 90 days', () => {
    const analytics = buildNutritionProgressAnalytics(
      [
        makeEntry('inside', '2026-08-17', { calories: 1000, protein: 100, carbs: 100, fats: 30 }),
        makeEntry('outside', '2026-04-01', { calories: 1000, protein: 100, carbs: 100, fats: 30 }),
      ],
      targets,
      { endAt: '2026-08-18T23:59:59.999Z', periodDays: 999 },
    );

    expect(analytics.period.days).toBe(90);
    expect(analytics.loggedDayCount).toBe(1);
    expect(analytics.totalEntryCount).toBe(1);
  });

  it('rejects an invalid analysis anchor', () => {
    expect(() =>
      buildNutritionProgressAnalytics([], targets, { endAt: 'invalid' }),
    ).toThrow('valid endAt timestamp');
  });
});
