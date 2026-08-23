import { describe, expect, it } from 'vitest';

import type { AdaptiveProgramReview, RecoveryModifierEvidence } from './adaptiveProgramEngine';
import type { TrainingIntelligenceReview } from './trainingIntelligenceReview';
import { buildWeeklyTrainingReview } from './weeklyTrainingReview';

const recovery: RecoveryModifierEvidence = {
  state: 'caution',
  checkInId: 'check-1',
  recordedAt: '2026-08-23T08:00:00.000Z',
  signals: ['short_sleep'],
};

const trainingReview = (): TrainingIntelligenceReview => ({
  endAt: '2026-08-23T12:00:00.000Z',
  windowDays: 7,
  plan: {
    status: 'available',
    plannedSessionCount: 4,
    completedPlannedSessionCount: 3,
    unresolvedPlannedSessionCount: 0,
    otherCompletedSessionCount: 1,
    slots: [],
  },
  eligibleWorkingSetCount: 24,
  activeMuscleCount: 7,
  reviewedMovementPatternCount: 4,
  topMovementPatterns: [],
  keyFindings: [
    {
      id: 'finding-1',
      kind: 'new_pr',
      prType: 'load',
      exerciseId: 'bench-press',
      exerciseName: 'Bench Press',
      occurredAt: '2026-08-22T12:00:00.000Z',
      evidence: { previousBest: 100, newBest: 105 },
      rulesetVersion: 'training-intelligence-v1',
    },
    {
      id: 'finding-2',
      kind: 'rep_progression',
      exerciseId: 'row',
      exerciseName: 'Row',
      occurredAt: '2026-08-21T12:00:00.000Z',
      evidence: { load: 80, firstReps: 8, latestReps: 10 },
      rulesetVersion: 'training-intelligence-v1',
    },
    {
      id: 'finding-3',
      kind: 'plateau',
      exerciseId: 'squat',
      exerciseName: 'Squat',
      occurredAt: '2026-08-20T12:00:00.000Z',
      evidence: { exposureCount: 3 },
      rulesetVersion: 'training-intelligence-v1',
    },
    {
      id: 'finding-4',
      kind: 'exercise_gap',
      exerciseId: 'curl',
      exerciseName: 'Curl',
      occurredAt: '2026-08-19T12:00:00.000Z',
      evidence: { gapDays: 14 },
      rulesetVersion: 'training-intelligence-v1',
    },
  ],
});

const adaptiveReview = (): AdaptiveProgramReview => ({
  recovery,
  plannedExerciseCount: 5,
  unresolvedTemplateCount: 1,
  proposals: [
    {
      exerciseId: 'bench-press',
      exerciseName: 'Bench Press',
      workoutTemplateIds: ['push'],
      baseAction: 'progress',
      action: 'maintain',
      finding: trainingReview().keyFindings[0]!,
      recoveryModifier: 'caution',
      adjustedByRecovery: true,
    },
    {
      exerciseId: 'row',
      exerciseName: 'Row',
      workoutTemplateIds: ['pull'],
      baseAction: 'progress',
      action: 'progress',
      finding: trainingReview().keyFindings[1]!,
      recoveryModifier: 'caution',
      adjustedByRecovery: false,
    },
    {
      exerciseId: 'squat',
      exerciseName: 'Squat',
      workoutTemplateIds: ['legs'],
      baseAction: 'maintain',
      action: 'maintain',
      finding: trainingReview().keyFindings[2]!,
      recoveryModifier: 'caution',
      adjustedByRecovery: false,
    },
  ],
});

describe('buildWeeklyTrainingReview', () => {
  it('composes existing deterministic authorities without recalculating them', () => {
    const source = trainingReview();
    const adaptive = adaptiveReview();
    const result = buildWeeklyTrainingReview({
      trainingReview: source,
      recovery,
      adaptiveReview: adaptive,
    });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;

    expect(result.review.plan).toBe(source.plan);
    expect(result.review.coverage).toEqual({
      eligibleWorkingSetCount: 24,
      activeMuscleCount: 7,
      reviewedMovementPatternCount: 4,
      topMovementPatterns: source.topMovementPatterns,
    });
    expect(result.review.keyFindings.map((finding) => finding.id)).toEqual([
      'finding-1',
      'finding-2',
      'finding-3',
    ]);
    expect(result.review.recovery).toBe(recovery);
    expect(result.review.adaptive).toEqual({
      available: true,
      plannedExerciseCount: 5,
      unresolvedTemplateCount: 1,
      adjustedByRecoveryCount: 1,
      actionCounts: { progress: 1, maintain: 2, review: 0 },
    });
  });

  it('keeps adaptive context explicitly unavailable when no program review exists', () => {
    const result = buildWeeklyTrainingReview({
      trainingReview: trainingReview(),
      recovery: { state: 'unknown', checkInId: null, recordedAt: null, signals: [] },
      adaptiveReview: null,
    });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(result.review.adaptive.available).toBe(false);
    expect(result.review.adaptive.actionCounts).toEqual({
      progress: 0,
      maintain: 0,
      review: 0,
    });
  });

  it('fails closed when the source review is not the explicit 7-day window', () => {
    const result = buildWeeklyTrainingReview({
      trainingReview: { ...trainingReview(), windowDays: 30 },
      recovery,
      adaptiveReview: adaptiveReview(),
    });

    expect(result).toEqual({ status: 'unavailable', reason: 'window_mismatch' });
  });

  it('fails closed when adaptive and recovery evidence disagree', () => {
    const adaptive = adaptiveReview();
    adaptive.recovery = { ...recovery, state: 'neutral', signals: [] };

    const result = buildWeeklyTrainingReview({
      trainingReview: trainingReview(),
      recovery,
      adaptiveReview: adaptive,
    });

    expect(result).toEqual({ status: 'unavailable', reason: 'evidence_mismatch' });
  });
});
