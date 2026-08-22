import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Exercise, WorkoutSession } from '@/types';

import { getMuscleAnalytics } from './muscleAnalytics';

afterEach(() => {
  vi.useRealTimers();
});

describe('muscleAnalytics', () => {
  it('excludes warm-up sets from working-set and volume analytics', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-22T12:00:00.000Z'));

    const exercises = [
      {
        id: 'bench',
        name: 'Bench Press',
        muscleGroup: 'Chest',
      } as unknown as Exercise,
    ];
    const workoutSessions: WorkoutSession[] = [
      {
        id: 'session-1',
        workoutId: 'upper',
        workoutTitle: 'Upper',
        startedAt: '2026-08-21T10:00:00.000Z',
        finishedAt: '2026-08-21T11:00:00.000Z',
        sets: [
          {
            id: 'warmup',
            exerciseId: 'bench',
            exerciseName: 'Bench Press',
            weight: 200,
            reps: 10,
            completed: true,
            setType: 'warmup',
          },
          {
            id: 'working',
            exerciseId: 'bench',
            exerciseName: 'Bench Press',
            weight: 100,
            reps: 5,
            completed: true,
          },
        ],
      },
    ];

    const analytics = getMuscleAnalytics({ exercises, workoutSessions });
    const chest = analytics.groups.find((group) => group.key === 'chest');

    expect(analytics.totalWorkingSets).toBe(1);
    expect(analytics.totalVolume).toBe(500);
    expect(chest).toMatchObject({ workingSets: 1, volume: 500 });
  });
});
