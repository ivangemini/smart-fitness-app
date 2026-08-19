import { describe, expect, it } from 'vitest';

import { parseCoachHighlightsProgressContext } from './coachHighlightsProgressContext';

describe('parseCoachHighlightsProgressContext', () => {
  it('accepts Progress Highlights context and clamps retrieval to 90 days', () => {
    expect(
      parseCoachHighlightsProgressContext({
        contextSource: 'progress',
        contextIntent: 'training_highlights',
        contextMetric: 'highlights',
        days: '180',
        endAt: '2026-08-19T06:00:00.000Z',
      }),
    ).toEqual({
      source: 'progress',
      requestedDays: 180,
      retrievalDays: 90,
      endAt: '2026-08-19T06:00:00.000Z',
    });
  });

  it('fails closed for malformed or unrelated params', () => {
    expect(
      parseCoachHighlightsProgressContext({
        contextSource: 'progress',
        contextIntent: 'training_highlights',
        contextMetric: 'highlights',
        days: '0',
        endAt: 'bad-date',
      }),
    ).toBeNull();
    expect(
      parseCoachHighlightsProgressContext({
        contextSource: 'progress',
        contextIntent: 'exercise_progress',
        contextMetric: 'highlights',
        days: '28',
        endAt: '2026-08-19T06:00:00.000Z',
      }),
    ).toBeNull();
  });
});
