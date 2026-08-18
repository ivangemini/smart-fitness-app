import { describe, expect, it } from 'vitest';

import type { WorkoutSession } from '@/types';

import { buildActivityProgressAnalytics } from './activityAnalytics';

const makeSession = (id: string, finishedAt: string): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets: [],
});

describe('buildActivityProgressAnalytics', () => {
  it('builds deterministic cadence facts and recent history', () => {
    const analytics = buildActivityProgressAnalytics(
      [
        makeSession('a', '2026-08-02T12:00:00.000Z'),
        makeSession('b', '2026-08-15T12:00:00.000Z'),
        makeSession('c', '2026-08-18T12:00:00.000Z'),
      ],
      { endAt: '2026-08-19T12:00:00.000Z', periodDays: 28 },
    );

    expect(analytics).toMatchObject({
      sessionCount: 3,
      activeDayCount: 3,
      sessionsLast7Days: 2,
      latestWorkoutAt: '2026-08-18T12:00:00.000Z',
      bucketDays: 7,
    });
    expect(analytics.workoutsPerWeek).toBe(0.75);
    expect(analytics.buckets).toHaveLength(4);
    expect(analytics.buckets.reduce((sum, bucket) => sum + bucket.sessionCount, 0)).toBe(3);
    expect(analytics.recentSessions.map((session) => session.sessionId)).toEqual(['c', 'b', 'a']);
  });

  it('keeps adjacent buckets disjoint at an exact boundary', () => {
    const analytics = buildActivityProgressAnalytics(
      [makeSession('boundary', '2026-08-05T12:00:00.000Z')],
      { endAt: '2026-08-19T12:00:00.000Z', periodDays: 28 },
    );

    expect(analytics.buckets.reduce((sum, bucket) => sum + bucket.sessionCount, 0)).toBe(1);
  });

  it('clamps the selected analysis period to 180 days', () => {
    const analytics = buildActivityProgressAnalytics([], {
      endAt: '2026-08-19T12:00:00.000Z',
      periodDays: 999,
    });

    expect(analytics.period.days).toBe(180);
    expect(analytics.bucketDays).toBe(30);
    expect(analytics.buckets).toHaveLength(6);
  });

  it('bounds recent-session output independently of total evidence', () => {
    const sessions = Array.from({ length: 20 }, (_, index) =>
      makeSession(
        `session-${index}`,
        new Date(Date.parse('2026-08-19T12:00:00.000Z') - index * 12 * 60 * 60 * 1000).toISOString(),
      ),
    );
    const analytics = buildActivityProgressAnalytics(sessions, {
      endAt: '2026-08-19T12:00:00.000Z',
      periodDays: 28,
    });

    expect(analytics.sessionCount).toBe(20);
    expect(analytics.recentSessions).toHaveLength(12);
    expect(analytics.recentSessionsTruncated).toBe(true);
  });

  it('fails explicitly for an invalid time anchor', () => {
    expect(() =>
      buildActivityProgressAnalytics([], { endAt: 'invalid', periodDays: 28 }),
    ).toThrow('valid endAt timestamp');
  });
});
