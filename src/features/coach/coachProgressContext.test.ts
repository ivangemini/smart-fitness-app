import { describe, expect, it } from 'vitest';

import { parseCoachProgressContext } from './coachProgressContext';

const baseParams = {
  contextSource: 'progress',
  contextIntent: 'exercise_progress',
  exerciseId: 'bench-press',
  exerciseName: 'Bench Press',
  days: '28',
  endAt: '2026-08-19T08:00:00.000Z',
};

describe('parseCoachProgressContext', () => {
  it('builds only the reviewed exercise-progress retrieval request', () => {
    expect(parseCoachProgressContext(baseParams)).toEqual({
      source: 'progress',
      requestedDays: 28,
      retrievalDays: 28,
      request: {
        intent: 'exercise_progress',
        endAt: '2026-08-19T08:00:00.000Z',
        days: 28,
        exerciseId: 'bench-press',
        exerciseName: 'Bench Press',
      },
    });
  });

  it('preserves the selected period while bounding Coach retrieval to 90 days', () => {
    const result = parseCoachProgressContext({ ...baseParams, days: '180' });
    expect(result?.requestedDays).toBe(180);
    expect(result?.retrievalDays).toBe(90);
    expect(result?.request.days).toBe(90);
  });

  it('supports canonical-name fallback without inventing an exercise id', () => {
    const result = parseCoachProgressContext({ ...baseParams, exerciseId: '' });
    expect(result?.request).toMatchObject({ exerciseName: 'Bench Press' });
    expect(result?.request).not.toHaveProperty('exerciseId');
  });

  it.each([
    { ...baseParams, contextSource: 'external' },
    { ...baseParams, contextIntent: 'training_overview' },
    { ...baseParams, endAt: 'invalid' },
    { ...baseParams, days: '0' },
    { ...baseParams, days: '999' },
    { ...baseParams, exerciseId: '', exerciseName: '' },
    { ...baseParams, days: ['28', '90'] },
  ])('fails closed for malformed or unreviewed context', (params) => {
    expect(parseCoachProgressContext(params)).toBeNull();
  });
});
