import { describe, expect, it } from 'vitest';

import { parseCoachActivityProgressContext } from './coachActivityProgressContext';

describe('parseCoachActivityProgressContext', () => {
  it('accepts Activity context and clamps 180 days to the 90-day Coach boundary', () => {
    expect(
      parseCoachActivityProgressContext({
        contextSource: 'progress',
        contextIntent: 'training_overview',
        metric: 'activity',
        days: '180',
        endAt: '2026-08-19T08:00:00.000Z',
      }),
    ).toEqual({
      source: 'progress',
      requestedDays: 180,
      retrievalDays: 90,
      request: {
        intent: 'training_overview',
        endAt: '2026-08-19T08:00:00.000Z',
        days: 90,
      },
    });
  });

  it('fails closed for malformed or unrelated navigation params', () => {
    const base = {
      contextSource: 'progress',
      contextIntent: 'training_overview',
      metric: 'activity',
      days: '90',
      endAt: '2026-08-19T08:00:00.000Z',
    };

    expect(
      parseCoachActivityProgressContext({ ...base, contextSource: 'home' }),
    ).toBeNull();
    expect(
      parseCoachActivityProgressContext({
        ...base,
        contextIntent: 'exercise_progress',
      }),
    ).toBeNull();
    expect(
      parseCoachActivityProgressContext({ ...base, metric: 'weight' }),
    ).toBeNull();
    expect(
      parseCoachActivityProgressContext({ ...base, days: '181' }),
    ).toBeNull();
    expect(
      parseCoachActivityProgressContext({ ...base, endAt: 'not-a-date' }),
    ).toBeNull();
  });
});
