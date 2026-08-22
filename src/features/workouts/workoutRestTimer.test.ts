import { describe, expect, it } from 'vitest';

import {
  adjustWorkoutRestTimer,
  formatWorkoutRestTimer,
  getWorkoutRestTimerRemainingSeconds,
  pauseWorkoutRestTimer,
  resumeWorkoutRestTimer,
  startWorkoutRestTimer,
} from './workoutRestTimer';

describe('workout rest timer', () => {
  it('starts only from a valid explicit exercise rest duration', () => {
    expect(
      startWorkoutRestTimer({ exerciseId: 'bench', restSeconds: 120, nowMs: 1_000 }),
    ).toEqual({
      exerciseId: 'bench',
      durationSeconds: 120,
      status: 'running',
      endsAtMs: 121_000,
    });

    expect(startWorkoutRestTimer({ exerciseId: 'bench', nowMs: 1_000 })).toBeNull();
    expect(
      startWorkoutRestTimer({ exerciseId: 'bench', restSeconds: 0, nowMs: 1_000 }),
    ).toBeNull();
  });

  it('derives remaining time from the clock so background time is not lost', () => {
    const timer = startWorkoutRestTimer({ exerciseId: 'squat', restSeconds: 90, nowMs: 0 });
    expect(timer).not.toBeNull();
    expect(getWorkoutRestTimerRemainingSeconds(timer!, 30_250)).toBe(60);
    expect(getWorkoutRestTimerRemainingSeconds(timer!, 90_001)).toBe(0);
  });

  it('pauses and resumes without mutating workout-set truth', () => {
    const timer = startWorkoutRestTimer({ exerciseId: 'row', restSeconds: 60, nowMs: 0 });
    const paused = pauseWorkoutRestTimer(timer!, 20_000);

    expect(paused).toEqual({
      exerciseId: 'row',
      durationSeconds: 60,
      status: 'paused',
      remainingSeconds: 40,
    });

    const resumed = resumeWorkoutRestTimer(paused!, 100_000);
    expect(resumed).toEqual({
      exerciseId: 'row',
      durationSeconds: 60,
      status: 'running',
      endsAtMs: 140_000,
    });
  });

  it('supports quick manual overrides and treats zero as skipped/finished', () => {
    const timer = startWorkoutRestTimer({ exerciseId: 'curl', restSeconds: 60, nowMs: 0 });
    expect(getWorkoutRestTimerRemainingSeconds(adjustWorkoutRestTimer(timer!, 15, 10_000)!, 10_000)).toBe(65);
    expect(adjustWorkoutRestTimer(timer!, -60, 10_000)).toBeNull();
  });

  it('formats compact minute-second labels', () => {
    expect(formatWorkoutRestTimer(0)).toBe('0:00');
    expect(formatWorkoutRestTimer(9)).toBe('0:09');
    expect(formatWorkoutRestTimer(125)).toBe('2:05');
  });
});
