import { describe, expect, it } from 'vitest';

import type { WorkoutSession } from '@/types';

import { readTrainingSignals } from './coachTrainingSignalCapability';

const makeSession = (id: string, finishedAt: string): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets: [
    {
      id: `set-${id}`,
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 5,
      completed: true,
      actualRpe: 8,
    },
  ],
});

describe('readTrainingSignals', () => {
  it('caps Coach-visible signal history at 90 days', () => {
    const result = readTrainingSignals({
      sessions: [
        makeSession('inside', '2026-08-17T10:00:00.000Z'),
        makeSession('outside', '2026-04-01T10:00:00.000Z'),
      ],
      endAt: '2026-08-18T12:00:00.000Z',
      days: 999,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.period.days).toBe(90);
    expect(result.data.evidence.sessionCount).toBe(1);
    expect(result.data.rpe.recordedSetCount).toBe(1);
  });

  it('returns the established typed error for an invalid analysis anchor', () => {
    expect(readTrainingSignals({ sessions: [], endAt: 'invalid' })).toEqual({
      ok: false,
      error: {
        code: 'invalid_end_at',
        message: 'A valid endAt timestamp is required.',
      },
    });
  });
});
