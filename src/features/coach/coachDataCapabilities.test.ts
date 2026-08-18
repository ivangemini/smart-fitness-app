import { describe, expect, it } from 'vitest';

import type { WorkoutSession, WorkoutSet } from '@/types';

import {
  readBoundedWorkoutHistory,
  readExerciseHistory,
  readTrainingSummary,
} from './coachDataCapabilities';

const makeSet = ({
  exerciseId = 'bench',
  exerciseName = 'Bench Press',
  id,
  reps = 5,
  weight = 100,
}: {
  exerciseId?: string;
  exerciseName?: string;
  id: string;
  reps?: number;
  weight?: number;
}): WorkoutSet => ({
  id,
  exerciseId,
  exerciseName,
  reps,
  weight,
  completed: true,
  actualRpe: 8,
});

const makeSession = ({
  day,
  id,
  sets = [makeSet({ id: `set-${id}` })],
}: {
  day: number;
  id: string;
  sets?: WorkoutSet[];
}): WorkoutSession => {
  const finishedAt = `2026-08-${String(day).padStart(2, '0')}T10:00:00.000Z`;
  return {
    id,
    workoutId: `workout-${id}`,
    workoutTitle: `Workout ${id}`,
    startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
    finishedAt,
    sets,
    notes: 'private session note that must not enter model-visible capability output',
    photoUri: 'file:///private/workout-photo.jpg',
    safetyRecovery: {
      schemaVersion: 1,
      gateKind: 'ready',
      acknowledgedAt: finishedAt,
      acknowledgementRequired: false,
      explicitlyAcknowledged: false,
      reviewRunId: 'internal-run-id',
      reviewStatus: 'ready',
      sourceFingerprint: 'internal-fingerprint',
      recommendedLoadMultiplier: null,
      restrictions: [],
      issues: [],
    },
  };
};

describe('coachDataCapabilities', () => {
  it('returns recent workout facts without leaking private or internal session fields', () => {
    const result = readBoundedWorkoutHistory({
      sessions: [makeSession({ day: 17, id: 'recent' })],
      endAt: '2026-08-18T12:00:00.000Z',
      days: 28,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.workouts[0]).toEqual({
      sessionId: 'recent',
      workoutId: 'workout-recent',
      workoutTitle: 'Workout recent',
      startedAt: '2026-08-17T09:00:00.000Z',
      finishedAt: '2026-08-17T10:00:00.000Z',
      workingSets: [
        {
          exerciseId: 'bench',
          exerciseName: 'Bench Press',
          weight: 100,
          reps: 5,
          actualRpe: 8,
        },
      ],
      workingSetCount: 1,
      setsTruncated: false,
    });

    const serialized = JSON.stringify(result.data);
    expect(serialized).not.toContain('private session note');
    expect(serialized).not.toContain('file:///private');
    expect(serialized).not.toContain('internal-run-id');
    expect(serialized).not.toContain('internal-fingerprint');
  });

  it('clamps requested periods, result counts, and per-session working sets', () => {
    const manySets = Array.from({ length: 35 }, (_, index) => makeSet({ id: `set-${index}` }));
    const sessions = Array.from({ length: 31 }, (_, index) =>
      makeSession({ day: 18 - (index % 18), id: `session-${index}`, sets: manySets }),
    );

    const result = readBoundedWorkoutHistory({
      sessions,
      endAt: '2026-08-18T12:00:00.000Z',
      days: 999,
      limit: 999,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.period.days).toBe(90);
    expect(result.data.workouts).toHaveLength(30);
    expect(result.data.totalMatchingSessions).toBe(31);
    expect(result.data.resultsTruncated).toBe(true);
    expect(result.data.workouts[0].workingSets).toHaveLength(30);
    expect(result.data.workouts[0].workingSetCount).toBe(35);
    expect(result.data.workouts[0].setsTruncated).toBe(true);
  });

  it('retrieves exact exercise history by id and preserves recorded working-set evidence', () => {
    const result = readExerciseHistory({
      sessions: [
        makeSession({
          day: 17,
          id: 'mixed',
          sets: [
            makeSet({ id: 'bench', exerciseId: 'bench', exerciseName: 'Bench Press', weight: 105 }),
            makeSet({ id: 'row', exerciseId: 'row', exerciseName: 'Chest Supported Row', weight: 80 }),
          ],
        }),
      ],
      endAt: '2026-08-18T12:00:00.000Z',
      exerciseId: 'bench',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.sessions).toHaveLength(1);
    expect(result.data.sessions[0].workingSets).toEqual([
      {
        exerciseId: 'bench',
        exerciseName: 'Bench Press',
        weight: 105,
        reps: 5,
        actualRpe: 8,
      },
    ]);
  });

  it('requires an explicit exercise query and returns typed errors for invalid time anchors', () => {
    expect(
      readExerciseHistory({
        sessions: [],
        endAt: '2026-08-18T12:00:00.000Z',
      }),
    ).toEqual({
      ok: false,
      error: {
        code: 'missing_exercise_query',
        message: 'exerciseId or exerciseName is required.',
      },
    });

    expect(
      readBoundedWorkoutHistory({
        sessions: [],
        endAt: 'invalid',
      }),
    ).toEqual({
      ok: false,
      error: {
        code: 'invalid_end_at',
        message: 'A valid endAt timestamp is required.',
      },
    });
  });

  it('serves Coach training summaries from the same deterministic analytics used by Progress', () => {
    const sessions = [
      makeSession({ day: 2, id: 'early', sets: [makeSet({ id: 'early', weight: 90 })] }),
      makeSession({ day: 17, id: 'recent', sets: [makeSet({ id: 'recent', weight: 100 })] }),
    ];
    const result = readTrainingSummary({
      sessions,
      endAt: '2026-08-18T12:00:00.000Z',
      days: 28,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.frequency.sessionCount).toBe(2);
    expect(result.data.exercises[0]).toMatchObject({
      exerciseId: 'bench',
      previousHalfBestEstimated1Rm: 105,
      recentHalfBestEstimated1Rm: 116.67,
      estimated1RmTrend: 'up',
    });
  });
});
