import { describe, expect, it } from 'vitest';

import type { ExerciseHistoryGroup, ExerciseHistorySet } from './history';
import { calculateExerciseProgressMetrics } from './progress';

const createSet = (
  id: string,
  finishedAt: string,
  weight: number,
  reps: number,
  options: Pick<ExerciseHistorySet, 'actualRpe' | 'completed' | 'setType'> = {},
): ExerciseHistorySet => ({
  id,
  exerciseId: 'bench-press',
  exerciseName: 'Bench Press',
  weight,
  reps,
  completed: options.completed ?? true,
  actualRpe: options.actualRpe,
  setType: options.setType,
  workoutId: 'workout-1',
  workoutTitle: 'Push',
  finishedAt,
});

const createGroup = (
  sessionId: string,
  finishedAt: string,
  sets: ExerciseHistorySet[],
): ExerciseHistoryGroup => ({
  sessionId,
  workoutId: 'workout-1',
  workoutTitle: 'Push',
  finishedAt,
  sets,
});

describe('calculateExerciseProgressMetrics', () => {
  it('excludes warm-up sets and compares the latest two working sessions deterministically', () => {
    const latestAt = '2026-08-22T18:00:00.000Z';
    const previousAt = '2026-08-15T18:00:00.000Z';
    const metrics = calculateExerciseProgressMetrics([
      createGroup('latest', latestAt, [
        createSet('warmup', latestAt, 60, 10, { setType: 'warmup' }),
        createSet('latest-1', latestAt, 100, 5, { actualRpe: 8, setType: 'working' }),
        createSet('latest-2', latestAt, 90, 8, { actualRpe: 8.5, setType: 'backoff' }),
      ]),
      createGroup('previous', previousAt, [
        createSet('previous-1', previousAt, 95, 5, {
          actualRpe: 7.5,
          setType: 'working',
        }),
      ]),
    ]);

    expect(metrics.bestWeight).toBe(100);
    expect(metrics.bestReps).toBe(8);
    expect(metrics.totalVolume).toBe(1695);
    expect(metrics.volumeTrend.map((point) => point.key)).toEqual(['previous', 'latest']);
    expect(metrics.loadTrend.map((point) => point.value)).toEqual([95, 100]);
    expect(metrics.recentComparison?.latest.averageActualRpe).toBeCloseTo(8.25);
    expect(metrics.recentComparison?.latest.topSet).toMatchObject({
      id: 'latest-1',
      weight: 100,
      reps: 5,
      actualRpe: 8,
    });
    expect(metrics.recentComparison?.previous?.topSet).toMatchObject({
      id: 'previous-1',
      weight: 95,
      reps: 5,
    });
    expect(metrics.recentComparison?.volumeDeltaPercent).toBeGreaterThan(0);
    expect(metrics.recentComparison?.estimatedOneRepMaxDeltaPercent).toBeGreaterThan(0);
  });

  it('keeps missing RPE and previous-session evidence explicitly unknown', () => {
    const finishedAt = '2026-08-22T18:00:00.000Z';
    const metrics = calculateExerciseProgressMetrics([
      createGroup('only', finishedAt, [
        createSet('only-1', finishedAt, 80, 8, { setType: 'working' }),
      ]),
    ]);

    expect(metrics.recentComparison?.latest.averageActualRpe).toBeNull();
    expect(metrics.recentComparison?.previous).toBeNull();
    expect(metrics.recentComparison?.volumeDeltaPercent).toBeNull();
    expect(metrics.recentComparison?.estimatedOneRepMaxDeltaPercent).toBeNull();
  });

  it('returns empty trends when history contains only warm-up evidence', () => {
    const finishedAt = '2026-08-22T18:00:00.000Z';
    const metrics = calculateExerciseProgressMetrics([
      createGroup('warmup-only', finishedAt, [
        createSet('warmup', finishedAt, 70, 12, { setType: 'warmup' }),
      ]),
    ]);

    expect(metrics.bestWeight).toBe(0);
    expect(metrics.bestReps).toBe(0);
    expect(metrics.totalVolume).toBe(0);
    expect(metrics.volumeTrend).toEqual([]);
    expect(metrics.loadTrend).toEqual([]);
    expect(metrics.estimatedOneRepMaxTrend).toEqual([]);
    expect(metrics.recentComparison).toBeNull();
  });

  it('keeps trends to the six most recent eligible sessions in chronological order', () => {
    const groups = Array.from({ length: 8 }, (_, index) => {
      const day = 22 - index;
      const finishedAt = `2026-08-${String(day).padStart(2, '0')}T18:00:00.000Z`;
      return createGroup(`session-${index}`, finishedAt, [
        createSet(`set-${index}`, finishedAt, 100 - index, 5, { setType: 'working' }),
      ]);
    });

    const metrics = calculateExerciseProgressMetrics(groups);

    expect(metrics.volumeTrend.map((point) => point.key)).toEqual([
      'session-5',
      'session-4',
      'session-3',
      'session-2',
      'session-1',
      'session-0',
    ]);
    expect(metrics.loadTrend).toHaveLength(6);
    expect(metrics.estimatedOneRepMaxTrend).toHaveLength(6);
  });

  it('sorts eligible sessions by finished time before selecting latest and previous', () => {
    const latestAt = '2026-08-22T18:00:00.000Z';
    const previousAt = '2026-08-15T18:00:00.000Z';
    const metrics = calculateExerciseProgressMetrics([
      createGroup('previous', previousAt, [
        createSet('previous-1', previousAt, 90, 5, { setType: 'working' }),
      ]),
      createGroup('latest', latestAt, [
        createSet('latest-1', latestAt, 100, 5, { setType: 'working' }),
      ]),
    ]);

    expect(metrics.recentComparison?.latest.sessionId).toBe('latest');
    expect(metrics.recentComparison?.previous?.sessionId).toBe('previous');
    expect(metrics.volumeTrend.map((point) => point.key)).toEqual(['previous', 'latest']);
  });

  it('excludes explicitly incomplete sets and sessions from all progress evidence', () => {
    const latestAt = '2026-08-22T18:00:00.000Z';
    const previousAt = '2026-08-15T18:00:00.000Z';
    const metrics = calculateExerciseProgressMetrics([
      createGroup('incomplete-only', latestAt, [
        createSet('incomplete-heavy', latestAt, 200, 10, {
          completed: false,
          setType: 'working',
        }),
      ]),
      createGroup('eligible', previousAt, [
        createSet('eligible-1', previousAt, 100, 5, { setType: 'working' }),
        createSet('incomplete-2', previousAt, 180, 12, {
          completed: false,
          setType: 'working',
        }),
      ]),
    ]);

    expect(metrics.bestWeight).toBe(100);
    expect(metrics.bestReps).toBe(5);
    expect(metrics.totalVolume).toBe(500);
    expect(metrics.recentSessions.map((session) => session.sessionId)).toEqual(['eligible']);
    expect(metrics.recentComparison?.latest.sessionId).toBe('eligible');
    expect(metrics.recentComparison?.previous).toBeNull();
  });
});
