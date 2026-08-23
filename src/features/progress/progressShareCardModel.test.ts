import { describe, expect, it } from 'vitest';

import type { BodyMeasurement, WeightEntry, WorkoutSession } from '@/types';

import type { TrainingFinding } from './trainingIntelligence';
import type { WeeklyTrainingReview } from './weeklyTrainingReview';
import {
  buildBodyMeasurementShareCard,
  buildTrainingPrShareCard,
  buildWeeklyReviewShareCard,
  buildWeightMilestoneShareCard,
  buildWorkoutSummaryShareCard,
} from './progressShareCardModel';

const session = (): WorkoutSession => ({
  id: 'session-1',
  workoutId: 'workout-1',
  workoutTitle: ' Push day ',
  startedAt: '2026-08-23T10:00:00.000Z',
  finishedAt: '2026-08-23T11:05:00.000Z',
  notes: 'private note that must never enter the card model',
  photoUri: 'file:///private-progress-photo.jpg',
  sets: [
    {
      id: 'warmup-1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 40,
      reps: 10,
      completed: true,
      setType: 'warmup',
    },
    {
      id: 'set-1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 5,
      completed: true,
      setType: 'working',
    },
    {
      id: 'set-2',
      exerciseId: 'row',
      exerciseName: 'Row',
      weight: 80,
      reps: 8,
      completed: true,
    },
    {
      id: 'pending',
      exerciseId: 'row',
      exerciseName: 'Row',
      weight: 80,
      reps: 8,
      completed: false,
    },
  ],
});

const loadPr = (): TrainingFinding => ({
  id: 'finding-1',
  kind: 'new_pr',
  rulesetVersion: 'training-intelligence-v1',
  occurredAt: '2026-08-23T11:05:00.000Z',
  exerciseId: 'bench',
  exerciseName: 'Bench Press',
  prType: 'load',
  evidence: {
    previousBest: 100,
    newBest: 105,
    arbitraryPrivateField: 'must-not-be-serialized',
  },
});

const weeklyReview = (): WeeklyTrainingReview => ({
  endAt: '2026-08-23T12:00:00.000Z',
  windowDays: 7,
  plan: {
    status: 'available',
    plannedSessionCount: 4,
    completedPlannedSessionCount: 3,
    unresolvedPlannedSessionCount: 1,
    otherCompletedSessionCount: 1,
    slots: [],
  },
  coverage: {
    eligibleWorkingSetCount: 24,
    activeMuscleCount: 7,
    reviewedMovementPatternCount: 4,
    topMovementPatterns: [],
  },
  keyFindings: [
    loadPr(),
    {
      id: 'finding-2',
      kind: 'muscle_gap',
      rulesetVersion: 'training-intelligence-v1',
      occurredAt: '2026-08-22T12:00:00.000Z',
      muscleId: 'lats',
      evidence: { gapDays: 21, secret: 'not-shared' },
    },
  ],
  recovery: {
    state: 'caution',
    checkInId: 'check-1',
    recordedAt: '2026-08-23T08:00:00.000Z',
    signals: ['short_sleep'],
  },
  adaptive: {
    available: true,
    plannedExerciseCount: 6,
    unresolvedTemplateCount: 1,
    adjustedByRecoveryCount: 2,
    actionCounts: { progress: 2, maintain: 3, review: 1 },
  },
});

describe('Progress share-card deterministic view models', () => {
  it('builds a workout summary from completed working evidence only', () => {
    const result = buildWorkoutSummaryShareCard(session());

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(result.card.kind).toBe('workout_summary');
    if (result.card.kind !== 'workout_summary') return;

    expect(result.card.source).toEqual({
      entity: 'workout_session',
      id: 'session-1',
      occurredAt: '2026-08-23T11:05:00.000Z',
    });
    expect(result.card.subjectLabel).toBe('Push day');
    expect(result.card.data).toEqual({
      durationMinutes: 65,
      exerciseCount: 2,
      workingSetCount: 2,
      workingVolumeKgReps: 1140,
    });
    expect(result.card.privacy).toEqual({
      includesNotes: false,
      includesPhoto: false,
      publishesAutomatically: false,
    });
    expect(JSON.stringify(result.card)).not.toContain('private note');
    expect(JSON.stringify(result.card)).not.toContain('private-progress-photo');
  });

  it('fails closed when a workout working set lacks exact exercise identity', () => {
    const input = session();
    input.sets[1] = { ...input.sets[1], exerciseId: ' ' };

    expect(buildWorkoutSummaryShareCard(input)).toEqual({
      status: 'unavailable',
      reason: 'invalid_evidence',
    });
  });

  it('maps a load PR from the known finding allowlist without copying arbitrary evidence', () => {
    const result = buildTrainingPrShareCard(loadPr());

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(result.card.kind).toBe('training_pr');
    if (result.card.kind !== 'training_pr') return;

    expect(result.card.source.id).toBe('finding-1');
    expect(result.card.subjectLabel).toBe('Bench Press');
    expect(result.card.data).toEqual({
      metric: 'load',
      previousValue: 100,
      newValue: 105,
      unit: 'kg',
    });
    expect(JSON.stringify(result.card)).not.toContain('arbitraryPrivateField');
    expect(JSON.stringify(result.card)).not.toContain('must-not-be-serialized');
  });

  it('maps a repetitions PR with its exact load context', () => {
    const finding: TrainingFinding = {
      ...loadPr(),
      id: 'finding-reps',
      prType: 'reps',
      evidence: { load: 100, previousBestReps: 5, newBestReps: 7 },
    };
    const result = buildTrainingPrShareCard(finding);

    expect(result.status).toBe('ready');
    if (result.status !== 'ready' || result.card.kind !== 'training_pr') return;
    expect(result.card.data).toEqual({
      metric: 'reps',
      loadKg: 100,
      previousValue: 5,
      newValue: 7,
      unit: 'reps',
    });
  });

  it('rejects non-PR findings and invalid PR evidence', () => {
    expect(
      buildTrainingPrShareCard({ ...loadPr(), kind: 'plateau', prType: undefined }),
    ).toEqual({ status: 'unavailable', reason: 'unsupported_finding' });
    expect(
      buildTrainingPrShareCard({
        ...loadPr(),
        evidence: { previousBest: 105, newBest: 100 },
      }),
    ).toEqual({ status: 'unavailable', reason: 'invalid_evidence' });
  });

  it('builds a weekly card from already-derived aggregates and bounded finding identity only', () => {
    const result = buildWeeklyReviewShareCard(weeklyReview());

    expect(result.status).toBe('ready');
    if (result.status !== 'ready' || result.card.kind !== 'weekly_review') return;

    expect(result.card.source).toEqual({
      entity: 'weekly_review',
      id: 'weekly-review:2026-08-23T12:00:00.000Z',
      occurredAt: '2026-08-23T12:00:00.000Z',
    });
    expect(result.card.data.plan).toEqual({
      plannedSessionCount: 4,
      completedPlannedSessionCount: 3,
      otherCompletedSessionCount: 1,
      unresolvedPlannedSessionCount: 1,
    });
    expect(result.card.data.coverage).toEqual({
      workingSetCount: 24,
      activeMuscleCount: 7,
      movementPatternCount: 4,
    });
    expect(result.card.data.recovery).toEqual({
      state: 'caution',
      signalCodes: ['short_sleep'],
    });
    expect(result.card.data.keySignals).toEqual([
      {
        id: 'finding-1',
        kind: 'new_pr',
        prType: 'load',
        exerciseId: 'bench',
        exerciseLabel: 'Bench Press',
        muscleId: null,
      },
      {
        id: 'finding-2',
        kind: 'muscle_gap',
        prType: null,
        exerciseId: null,
        exerciseLabel: null,
        muscleId: 'lats',
      },
    ]);
    expect(JSON.stringify(result.card)).not.toContain('previousBest');
    expect(JSON.stringify(result.card)).not.toContain('secret');
  });

  it('fails closed when weekly finding provenance has an invalid timestamp', () => {
    const review = weeklyReview();
    review.keyFindings[0] = { ...review.keyFindings[0], occurredAt: 'invalid' };

    expect(buildWeeklyReviewShareCard(review)).toEqual({
      status: 'unavailable',
      reason: 'invalid_evidence',
    });
  });

  it('builds a weight milestone with explicit kg provenance and deterministic delta', () => {
    const entry: WeightEntry = {
      id: 'weight-2',
      date: '2026-08-23',
      weight: 75.2,
      createdAt: '2026-08-23T08:00:00.000Z',
    };
    const previousEntry: WeightEntry = {
      id: 'weight-1',
      date: '2026-08-16',
      weight: 74.4,
      createdAt: '2026-08-16T08:00:00.000Z',
    };
    const result = buildWeightMilestoneShareCard({ entry, previousEntry });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready' || result.card.kind !== 'weight_milestone') return;
    expect(result.card.source.sourceDate).toBe('2026-08-23');
    expect(result.card.data).toEqual({
      weightKg: 75.2,
      previousWeightKg: 74.4,
      deltaKg: 0.7999999999999972,
    });
  });

  it('rejects a weight comparison whose previous source date is after the current one', () => {
    expect(
      buildWeightMilestoneShareCard({
        entry: {
          id: 'current',
          date: '2026-08-20',
          weight: 75,
          createdAt: '2026-08-20T08:00:00.000Z',
        },
        previousEntry: {
          id: 'future',
          date: '2026-08-21',
          weight: 74,
          createdAt: '2026-08-21T08:00:00.000Z',
        },
      }),
    ).toEqual({ status: 'unavailable', reason: 'invalid_evidence' });
  });

  it('builds typed body-measurement evidence and rejects legacy untyped values', () => {
    const measurement: BodyMeasurement = {
      id: 'waist-2',
      label: 'Waist',
      value: '80',
      createdAt: '2026-08-23T08:00:00.000Z',
      metric: 'waist',
      numericValue: 80,
      unit: 'cm',
    };
    const previousMeasurement: BodyMeasurement = {
      id: 'waist-1',
      label: 'Waist',
      value: '82',
      createdAt: '2026-08-16T08:00:00.000Z',
      metric: 'waist',
      numericValue: 82,
      unit: 'cm',
    };
    const result = buildBodyMeasurementShareCard({
      measurement,
      previousMeasurement,
    });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready' || result.card.kind !== 'body_measurement') return;
    expect(result.card.data).toEqual({
      metric: 'waist',
      value: 80,
      unit: 'cm',
      previousValue: 82,
      delta: -2,
    });

    expect(
      buildBodyMeasurementShareCard({
        measurement: {
          id: 'legacy',
          label: 'Waist',
          value: '80 cm',
          createdAt: '2026-08-23T08:00:00.000Z',
        },
      }),
    ).toEqual({ status: 'unavailable', reason: 'invalid_evidence' });
  });
});
