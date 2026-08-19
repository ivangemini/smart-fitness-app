import { describe, expect, it } from 'vitest';

import type { WorkoutSession } from '@/types';

import { selectProactiveInsight } from './proactiveInsights';

const session = (id: string, finishedAt: string): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets: [],
});

describe('proactive insight source boundary', () => {
  it('does not let sessions older than 28 days satisfy consistency evidence', () => {
    const result = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions: [
        session('old-1', '2026-07-01T10:00:00.000Z'),
        session('old-2', '2026-07-03T10:00:00.000Z'),
        session('recent-1', '2026-08-08T10:00:00.000Z'),
        session('recent-2', '2026-08-11T10:00:00.000Z'),
        session('recent-3', '2026-08-14T10:00:00.000Z'),
        session('recent-4', '2026-08-18T10:00:00.000Z'),
      ],
    });

    expect(result).toBeNull();
  });

  it('does not count one local midpoint day in both consistency halves', () => {
    const result = selectProactiveInsight({
      nowAt: '2026-08-19T12:00:00.000Z',
      sessions: [
        session('midpoint-morning', '2026-08-05T10:00:00.000Z'),
        session('midpoint-evening', '2026-08-05T18:00:00.000Z'),
        session('recent-1', '2026-08-08T10:00:00.000Z'),
        session('recent-2', '2026-08-11T10:00:00.000Z'),
        session('recent-3', '2026-08-14T10:00:00.000Z'),
      ],
    });

    expect(result).toBeNull();
  });
});
