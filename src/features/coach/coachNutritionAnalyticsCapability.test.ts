import { describe, expect, it } from 'vitest';

import type { FoodEntry } from '@/types';

import { readNutritionAnalytics } from './coachNutritionAnalyticsCapability';

const entry: FoodEntry = {
  id: 'private-food-id',
  name: 'Private food name',
  brandName: 'Private brand',
  date: '2026-08-17',
  mealType: 'dinner',
  calories: 2400,
  protein: 190,
  carbs: 250,
  fats: 75,
  source: 'fatsecret',
  externalId: 'provider-private-id',
  createdAt: '2026-08-17T18:00:00.000Z',
};

const targets = { calories: 2400, protein: 180, carbs: 260, fats: 70 };

describe('readNutritionAnalytics', () => {
  it('returns only bounded aggregate facts and omits diary item identity', () => {
    const result = readNutritionAnalytics({
      foodEntries: [entry],
      nutritionTargets: targets,
      endAt: '2026-08-18T23:59:59.999Z',
      days: 14,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toMatchObject({
      loggedDayCount: 1,
      totalEntryCount: 1,
      averagesAcrossLoggedDays: {
        calories: 2400,
        protein: 190,
        carbs: 250,
        fats: 75,
      },
      proteinTargetMetLoggedDayCount: 1,
    });
    const serialized = JSON.stringify(result.data);
    expect(serialized).not.toContain('Private food name');
    expect(serialized).not.toContain('Private brand');
    expect(serialized).not.toContain('provider-private-id');
    expect(serialized).not.toContain('private-food-id');
  });

  it('caps Coach-visible nutrition analytics at 90 days', () => {
    const result = readNutritionAnalytics({
      foodEntries: [entry],
      nutritionTargets: targets,
      endAt: '2026-08-18T23:59:59.999Z',
      days: 999,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.period.days).toBe(90);
  });

  it('returns a typed error for an invalid anchor', () => {
    expect(
      readNutritionAnalytics({
        foodEntries: [],
        nutritionTargets: targets,
        endAt: 'invalid',
      }),
    ).toEqual({
      ok: false,
      error: {
        code: 'invalid_end_at',
        message: 'A valid endAt timestamp is required.',
      },
    });
  });
});
