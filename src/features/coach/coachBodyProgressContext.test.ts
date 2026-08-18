import { describe, expect, it } from 'vitest';

import type { BodyMeasurement, WeightEntry } from '@/types';

import { parseCoachBodyProgressContext } from './coachBodyProgressContext';
import type { CoachRetrievalSources } from './coachRetrieval';
import { buildCoachWeightProgressFactPacket } from './coachScopedRetrieval';

const params = {
  contextSource: 'progress',
  contextIntent: 'body_progress',
  metric: 'weight',
  days: '30',
  endAt: '2026-08-19T23:59:59.999Z',
};

describe('weight Progress context', () => {
  it('accepts only the reviewed weight metric and bounded period', () => {
    expect(parseCoachBodyProgressContext(params)).toEqual({
      source: 'progress',
      metric: 'weight',
      requestedDays: 30,
      request: {
        intent: 'body_progress',
        endAt: '2026-08-19T23:59:59.999Z',
        days: 30,
      },
    });
  });

  it.each([
    { ...params, metric: 'measurements' },
    { ...params, days: '0' },
    { ...params, days: '180' },
    { ...params, endAt: 'invalid' },
    { ...params, contextIntent: 'nutrition_overview' },
  ])('fails closed for unreviewed or malformed body context', (candidate) => {
    expect(parseCoachBodyProgressContext(candidate)).toBeNull();
  });

  it('removes body measurements from a weight-scoped fact packet', () => {
    const weights: WeightEntry[] = [
      { id: 'weight-id', date: '2026-08-18', weight: 72, createdAt: '2026-08-18T10:00:00.000Z' },
    ];
    const measurements: BodyMeasurement[] = [
      {
        id: 'measurement-id',
        label: 'Waist',
        value: '74',
        metric: 'waist',
        numericValue: 74,
        unit: 'cm',
        createdAt: '2026-08-18T11:00:00.000Z',
      },
    ];
    const sources = {
      weightHistory: weights,
      bodyMeasurements: measurements,
    } as CoachRetrievalSources;
    const result = buildCoachWeightProgressFactPacket({
      request: {
        intent: 'body_progress',
        endAt: '2026-08-19T23:59:59.999Z',
        days: 30,
      },
      sources,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.facts.bodyMetrics?.weights).toEqual([
      { date: '2026-08-18', weightKg: 72 },
    ]);
    expect(result.data.facts.bodyMetrics?.measurements).toEqual([]);
    expect(JSON.stringify(result.data)).not.toContain('Waist');
    expect(JSON.stringify(result.data)).not.toContain('measurement-id');
  });
});
