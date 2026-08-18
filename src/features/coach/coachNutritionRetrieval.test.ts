import { describe, expect, it } from 'vitest';

import type { CoachRetrievalSources } from './coachRetrieval';
import { buildCoachFactPacket, buildCoachRetrievalPlan } from './coachRetrieval';

const endAt = '2026-08-18T23:59:59.999Z';

const sources = {
  foodEntries: [
    {
      id: 'private-food-id',
      name: 'Private meal',
      brandName: 'Private brand',
      date: '2026-08-17',
      mealType: 'dinner',
      calories: 2400,
      protein: 190,
      carbs: 250,
      fats: 75,
      source: 'fatsecret',
      externalId: 'private-provider-id',
      createdAt: '2026-08-17T18:00:00.000Z',
    },
  ],
  nutritionTargets: { calories: 2400, protein: 180, carbs: 260, fats: 70 },
} as CoachRetrievalSources;

describe('nutrition overview retrieval', () => {
  it('plans only daily nutrition facts and aggregate nutrition analytics', () => {
    expect(buildCoachRetrievalPlan({ intent: 'nutrition_overview', endAt })).toEqual({
      intent: 'nutrition_overview',
      capabilities: ['nutrition_summary', 'nutrition_analytics'],
    });
  });

  it('returns bounded model-visible facts without item identity or provider metadata', () => {
    const result = buildCoachFactPacket({
      request: { intent: 'nutrition_overview', endAt, days: 14 },
      sources,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Object.keys(result.data.facts)).toEqual(['nutritionSummary', 'nutritionAnalytics']);
    expect(result.data.facts.nutritionAnalytics).toMatchObject({
      loggedDayCount: 1,
      proteinTargetMetLoggedDayCount: 1,
    });
    expect(result.data.facts.nutritionAnalytics).not.toHaveProperty('loggedDays');
    const serialized = JSON.stringify(result.data);
    expect(serialized).not.toContain('Private meal');
    expect(serialized).not.toContain('Private brand');
    expect(serialized).not.toContain('private-provider-id');
    expect(serialized).not.toContain('private-food-id');
  });
});
