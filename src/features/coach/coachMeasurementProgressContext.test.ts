import { describe, expect, it } from 'vitest';

import { parseCoachMeasurementProgressContext } from './coachMeasurementProgressContext';

describe('parseCoachMeasurementProgressContext', () => {
  it('accepts a selected measurement and clamps Companion retrieval to 90 days', () => {
    expect(
      parseCoachMeasurementProgressContext({
        contextSource: 'progress',
        contextIntent: 'body_progress',
        metric: 'measurement',
        measurementKey: 'waist:',
        days: '180',
        endAt: '2026-08-19T08:00:00.000Z',
      }),
    ).toEqual({
      source: 'progress',
      metric: 'measurement',
      measurementKey: 'waist:',
      requestedDays: 180,
      retrievalDays: 90,
      request: {
        intent: 'body_progress',
        endAt: '2026-08-19T08:00:00.000Z',
        days: 90,
      },
    });
  });

  it('fails closed for malformed or unrelated navigation context', () => {
    const base = {
      contextSource: 'progress',
      contextIntent: 'body_progress',
      metric: 'measurement',
      measurementKey: 'waist:',
      days: '90',
      endAt: '2026-08-19T08:00:00.000Z',
    };

    expect(parseCoachMeasurementProgressContext({ ...base, contextSource: 'home' })).toBeNull();
    expect(parseCoachMeasurementProgressContext({ ...base, contextIntent: 'exercise_progress' })).toBeNull();
    expect(parseCoachMeasurementProgressContext({ ...base, metric: 'weight' })).toBeNull();
    expect(parseCoachMeasurementProgressContext({ ...base, measurementKey: '' })).toBeNull();
    expect(parseCoachMeasurementProgressContext({ ...base, measurementKey: 'x'.repeat(161) })).toBeNull();
    expect(parseCoachMeasurementProgressContext({ ...base, days: '181' })).toBeNull();
    expect(parseCoachMeasurementProgressContext({ ...base, endAt: 'not-a-date' })).toBeNull();
  });
});
