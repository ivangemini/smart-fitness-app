import { describe, expect, it } from 'vitest';

import { parseCoachGoalProgressContext } from './coachGoalProgressContext';

describe('parseCoachGoalProgressContext', () => {
  it('accepts only the reviewed Progress goal intent with a valid anchor', () => {
    expect(
      parseCoachGoalProgressContext({
        contextSource: 'progress',
        contextIntent: 'goal_progress',
        endAt: '2026-08-19T12:00:00.000Z',
      }),
    ).toEqual({
      source: 'progress',
      endAt: '2026-08-19T12:00:00.000Z',
    });
  });

  it('fails closed for malformed or unrelated route context', () => {
    expect(
      parseCoachGoalProgressContext({
        contextSource: 'progress',
        contextIntent: 'goal_progress',
        endAt: 'not-a-date',
      }),
    ).toBeNull();
    expect(
      parseCoachGoalProgressContext({
        contextSource: 'profile',
        contextIntent: 'goal_progress',
        endAt: '2026-08-19T12:00:00.000Z',
      }),
    ).toBeNull();
  });
});
