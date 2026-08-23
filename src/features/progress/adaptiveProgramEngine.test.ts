import { describe, expect, it } from 'vitest';

import type { RecoveryCheckIn, TrainingProgram, Workout } from '@/types';
import { TRAINING_INTELLIGENCE_RULESET_VERSION, type TrainingFinding } from './trainingIntelligence';
import { buildAdaptiveProgramReview, buildRecoveryModifier } from './adaptiveProgramEngine';

const checkIn = (overrides: Partial<RecoveryCheckIn> = {}): RecoveryCheckIn => ({
  id: 'r1', recordedAt: '2026-08-23T10:00:00.000Z', sleepDurationHours: 8, sleepQuality: 4,
  fatigue: 2, soreness: 1, stress: 2, painInterference: 0, readiness: 4,
  createdAt: '2026-08-23T10:00:00.000Z', updatedAt: '2026-08-23T10:00:00.000Z', ...overrides,
});
const finding = (kind: TrainingFinding['kind'], exerciseId = 'bench'): TrainingFinding => ({
  id: `${kind}-${exerciseId}`, kind, rulesetVersion: TRAINING_INTELLIGENCE_RULESET_VERSION,
  occurredAt: '2026-08-23T09:00:00.000Z', exerciseId, exerciseName: exerciseId, evidence: {},
});
const workout: Workout = {
  id: 'push', title: 'Push', duration: '45 min', createdAt: '2026-08-01T00:00:00.000Z',
  exercises: [{ id: 'bench', name: 'Bench', createdAt: '2026-08-01T00:00:00.000Z' }],
};
const program: TrainingProgram = {
  id: 'p1', name: 'Plan', goal: 'Strength', difficulty: 'intermediate', durationWeeks: 8,
  createdAt: '2026-08-01T00:00:00.000Z', days: [{ id: 'm', weekday: 'monday', workoutTemplateId: 'push' }],
};

describe('buildRecoveryModifier', () => {
  it('keeps missing or stale recovery evidence unknown', () => {
    expect(buildRecoveryModifier([], '2026-08-23T12:00:00.000Z').state).toBe('unknown');
    expect(buildRecoveryModifier([checkIn({ recordedAt: '2026-08-20T10:00:00.000Z' })], '2026-08-23T12:00:00.000Z').state).toBe('unknown');
  });
  it('uses explicit self-reported signals without producing a score', () => {
    const result = buildRecoveryModifier([checkIn({ fatigue: 5, readiness: 2 })], '2026-08-23T12:00:00.000Z');
    expect(result.state).toBe('strong_caution');
    expect(result.signals).toEqual(expect.arrayContaining(['high_fatigue', 'low_self_reported_readiness']));
  });
});

describe('buildAdaptiveProgramReview', () => {
  it('proposes progress only for exact planned exercise identities', () => {
    const result = buildAdaptiveProgramReview({ endAt: '2026-08-23T12:00:00.000Z', findings: [finding('new_pr'), finding('new_pr', 'row')], program, recoveryCheckIns: [checkIn()], workouts: [workout] });
    expect(result.proposals).toHaveLength(1);
    expect(result.proposals[0]).toMatchObject({ exerciseId: 'bench', baseAction: 'progress', action: 'progress', adjustedByRecovery: false });
  });
  it('fails closed when a planned template cannot be resolved', () => {
    const result = buildAdaptiveProgramReview({ endAt: '2026-08-23T12:00:00.000Z', findings: [finding('new_pr')], program, recoveryCheckIns: [], workouts: [] });
    expect(result.proposals).toEqual([]);
    expect(result.unresolvedTemplateCount).toBe(1);
  });
  it('downgrades a progress proposal to maintain under fresh caution evidence', () => {
    const result = buildAdaptiveProgramReview({ endAt: '2026-08-23T12:00:00.000Z', findings: [finding('rep_progression')], program, recoveryCheckIns: [checkIn({ sleepDurationHours: 5.5 })], workouts: [workout] });
    expect(result.proposals[0]).toMatchObject({ baseAction: 'progress', action: 'maintain', recoveryModifier: 'caution', adjustedByRecovery: true });
  });
  it('turns maintain into review only for strong caution and never mutates source data', () => {
    const sourceFinding = finding('plateau');
    const result = buildAdaptiveProgramReview({ endAt: '2026-08-23T12:00:00.000Z', findings: [sourceFinding], program, recoveryCheckIns: [checkIn({ painInterference: 4 })], workouts: [workout] });
    expect(result.proposals[0]).toMatchObject({ baseAction: 'maintain', action: 'review', recoveryModifier: 'strong_caution' });
    expect(sourceFinding.kind).toBe('plateau');
  });
});
