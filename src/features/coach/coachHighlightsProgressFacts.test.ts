import { describe, expect, it } from 'vitest';

import type { WorkoutSession, WorkoutSet } from '@/types';

import { buildCoachHighlightsProgressFacts } from './coachHighlightsProgressFacts';

const makeSet = (id: string, weight: number): WorkoutSet => ({
  id,
  exerciseId: 'bench',
  exerciseName: 'Bench Press',
  weight,
  reps: 5,
  completed: true,
});

const makeSession = (
  id: string,
  finishedAt: string,
  weight: number,
): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets: [makeSet(`set-${id}`, weight)],
});

describe('buildCoachHighlightsProgressFacts', () => {
  it('drops sessions older than the bounded Coach window before analytics', () => {
    const facts = buildCoachHighlightsProgressFacts({
      sessions: [
        makeSession('old', '2026-04-01T10:00:00.000Z', 200),
        makeSession('early', '2026-06-15T10:00:00.000Z', 100),
        makeSession('recent', '2026-08-10T10:00:00.000Z', 110),
      ],
      endAt: '2026-08-19T10:00:00.000Z',
      days: 180,
    });

    expect(facts.period.days).toBe(90);
    expect(facts.evidence.sessionCount).toBe(2);
    expect(facts.improving).toHaveLength(1);
    expect(facts.improving[0]).toMatchObject({
      exerciseId: 'bench',
      previousEstimated1Rm: 116.67,
      recentEstimated1Rm: 128.33,
    });
    expect(facts.allTimeRecordEvidenceIncluded).toBe(false);
  });

  it('rejects an invalid anchor instead of broadening retrieval', () => {
    expect(() =>
      buildCoachHighlightsProgressFacts({
        sessions: [],
        endAt: 'invalid',
        days: 28,
      }),
    ).toThrow('requires a valid endAt timestamp');
  });
});
