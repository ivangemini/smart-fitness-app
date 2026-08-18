import { describe, expect, it } from 'vitest';

import type { TrainingProgressAnalytics } from '@/lib/progress';

import { countImprovingExercises, getRecentTrainingHighlights } from './progressSummaryModel';

const analytics: TrainingProgressAnalytics = {
  period: {
    startAt: '2026-07-21T12:00:00.000Z',
    endAt: '2026-08-18T12:00:00.000Z',
    days: 28,
  },
  frequency: { sessionCount: 8, activeDayCount: 8, workoutsPerWeek: 2 },
  volume: {
    totalVolume: 1000,
    previousHalfVolume: 480,
    recentHalfVolume: 520,
    comparableSessionCount: 8,
    trend: 'stable',
  },
  exercises: [
    {
      exerciseId: 'pull-up',
      exerciseName: 'Pull-up',
      sessionCount: 4,
      workingSetCount: 12,
      periodBestWeight: 20,
      periodBestEstimated1Rm: 30,
      previousHalfBestEstimated1Rm: 27,
      recentHalfBestEstimated1Rm: 30,
      estimated1RmTrend: 'up',
      allTimeBestWeight: 20,
      allTimeBestEstimated1Rm: 30,
      allTimeEstimated1RmRecordAt: '2026-08-17T12:00:00.000Z',
    },
    {
      exerciseId: 'bench',
      exerciseName: 'Bench press',
      sessionCount: 3,
      workingSetCount: 9,
      periodBestWeight: 80,
      periodBestEstimated1Rm: 100,
      previousHalfBestEstimated1Rm: 100,
      recentHalfBestEstimated1Rm: 100,
      estimated1RmTrend: 'stable',
      allTimeBestWeight: 80,
      allTimeBestEstimated1Rm: 100,
      allTimeEstimated1RmRecordAt: '2026-08-10T12:00:00.000Z',
    },
    {
      exerciseId: 'row',
      exerciseName: 'Row',
      sessionCount: 2,
      workingSetCount: 6,
      periodBestWeight: 70,
      periodBestEstimated1Rm: 90,
      previousHalfBestEstimated1Rm: 92,
      recentHalfBestEstimated1Rm: 90,
      estimated1RmTrend: 'down',
      allTimeBestWeight: 75,
      allTimeBestEstimated1Rm: 95,
      allTimeEstimated1RmRecordAt: '2026-06-01T12:00:00.000Z',
    },
  ],
  evidence: {
    sessionCount: 8,
    workingSetCount: 27,
    weightedSetCount: 27,
    estimated1RmSetCount: 27,
  },
};

describe('progressSummaryModel', () => {
  it('counts only exercises with an observed upward estimated-1RM trend', () => {
    expect(countImprovingExercises(analytics)).toBe(1);
  });

  it('returns only all-time estimated-1RM records inside the selected period', () => {
    expect(getRecentTrainingHighlights(analytics)).toEqual([
      {
        exerciseId: 'pull-up',
        exerciseName: 'Pull-up',
        estimatedOneRepMax: 30,
        recordedAt: '2026-08-17T12:00:00.000Z',
      },
      {
        exerciseId: 'bench',
        exerciseName: 'Bench press',
        estimatedOneRepMax: 100,
        recordedAt: '2026-08-10T12:00:00.000Z',
      },
    ]);
  });

  it('keeps highlights bounded and newest-first', () => {
    expect(getRecentTrainingHighlights(analytics, 1).map((item) => item.exerciseId)).toEqual([
      'pull-up',
    ]);
  });

  it('does not promote a first single-session estimate into Highlights', () => {
    const singleSessionAnalytics: TrainingProgressAnalytics = {
      ...analytics,
      exercises: [{ ...analytics.exercises[0], sessionCount: 1 }],
    };

    expect(getRecentTrainingHighlights(singleSessionAnalytics)).toEqual([]);
  });
});
