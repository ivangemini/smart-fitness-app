import { describe, expect, it } from 'vitest';

import type { WorkoutSession } from '@/types';

import { buildExerciseProgressSeries } from './exerciseProgressSeries';

const sessions: WorkoutSession[] = [
  {
    id: 'old',
    workoutId: 'upper',
    workoutTitle: 'Upper A',
    startedAt: '2026-07-01T09:00:00.000Z',
    finishedAt: '2026-07-01T10:00:00.000Z',
    sets: [
      { id: 'old-bench', exerciseId: 'bench', exerciseName: 'Bench Press', weight: 80, reps: 5, completed: true },
    ],
  },
  {
    id: 'early',
    workoutId: 'upper',
    workoutTitle: 'Upper A',
    startedAt: '2026-08-03T09:00:00.000Z',
    finishedAt: '2026-08-03T10:00:00.000Z',
    sets: [
      { id: 'early-bench', exerciseId: 'bench', exerciseName: 'Bench Press', weight: 90, reps: 5, completed: true },
      { id: 'row', exerciseId: 'row', exerciseName: 'Row', weight: 70, reps: 8, completed: true },
    ],
  },
  {
    id: 'recent',
    workoutId: 'upper',
    workoutTitle: 'Upper B',
    startedAt: '2026-08-17T09:00:00.000Z',
    finishedAt: '2026-08-17T10:00:00.000Z',
    sets: [
      { id: 'recent-bench-1', exerciseId: 'bench', exerciseName: 'Bench Press', weight: 100, reps: 5, completed: true },
      { id: 'recent-bench-2', exerciseId: 'bench', exerciseName: 'Bench Press', weight: 90, reps: 8, completed: true },
    ],
  },
];

describe('exerciseProgressSeries', () => {
  it('returns chronological comparable session points for one exercise', () => {
    const series = buildExerciseProgressSeries({
      sessions,
      endAt: '2026-08-18T12:00:00.000Z',
      exerciseId: 'bench',
      periodDays: 28,
    });

    expect(series.totalMatchingSessions).toBe(2);
    expect(series.points.map((point) => point.sessionId)).toEqual(['early', 'recent']);
    expect(series.points[0]).toMatchObject({ bestWeight: 90, bestEstimated1Rm: 105, totalVolume: 450, workingSetCount: 1 });
    expect(series.points[1]).toMatchObject({ bestWeight: 100, bestEstimated1Rm: 116.67, totalVolume: 1220, workingSetCount: 2 });
  });

  it('supports name matching, period bounds, and point truncation', () => {
    const series = buildExerciseProgressSeries({
      sessions,
      endAt: '2026-08-18T12:00:00.000Z',
      exerciseName: 'bench press',
      periodDays: 180,
      maxPoints: 1,
    });

    expect(series.period.days).toBe(180);
    expect(series.totalMatchingSessions).toBe(3);
    expect(series.points).toHaveLength(1);
    expect(series.points[0].sessionId).toBe('recent');
    expect(series.pointsTruncated).toBe(true);
  });

  it('keeps bodyweight and high-rep evidence without inventing estimated 1RM', () => {
    const evidenceSessions: WorkoutSession[] = [
      {
        id: 'bodyweight', workoutId: 'pull', workoutTitle: 'Pull',
        startedAt: '2026-08-17T09:00:00.000Z', finishedAt: '2026-08-17T10:00:00.000Z',
        sets: [{ id: 'pull-up', exerciseId: 'pull-up', exerciseName: 'Pull-up', weight: 0, reps: 10, completed: true }],
      },
      {
        id: 'high-rep', workoutId: 'upper', workoutTitle: 'Upper',
        startedAt: '2026-08-16T09:00:00.000Z', finishedAt: '2026-08-16T10:00:00.000Z',
        sets: [{ id: 'bench-high-rep', exerciseId: 'bench', exerciseName: 'Bench Press', weight: 60, reps: 15, completed: true }],
      },
    ];

    const bodyweight = buildExerciseProgressSeries({ sessions: evidenceSessions, endAt: '2026-08-18T12:00:00.000Z', exerciseId: 'pull-up' });
    expect(bodyweight.points[0]).toMatchObject({ bestWeight: null, bestEstimated1Rm: null, totalVolume: 0, workingSetCount: 1 });

    const highRep = buildExerciseProgressSeries({ sessions: evidenceSessions, endAt: '2026-08-18T12:00:00.000Z', exerciseId: 'bench' });
    expect(highRep.points[0]).toMatchObject({ bestWeight: 60, bestEstimated1Rm: null, totalVolume: 900, workingSetCount: 1 });
  });

  it('rejects invalid anchors and missing exercise queries', () => {
    expect(() => buildExerciseProgressSeries({ sessions: [], endAt: 'invalid', exerciseId: 'bench' })).toThrow('valid endAt timestamp');
    expect(() => buildExerciseProgressSeries({ sessions: [], endAt: '2026-08-18T12:00:00.000Z' })).toThrow('exerciseId or exerciseName');
  });
});
