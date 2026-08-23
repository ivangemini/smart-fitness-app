import { describe, expect, it } from 'vitest';

import type { Workout } from '@/types';
import { TRAINING_INTELLIGENCE_RULESET_VERSION, type TrainingFinding } from './trainingIntelligence';
import type { AdaptiveProgramProposal } from './adaptiveProgramEngine';
import { buildAdaptiveProgramPrescriptionPreview } from './adaptiveProgramApply';

const workout = (overrides: Partial<Workout> = {}): Workout => ({
  id: 'push',
  title: 'Push',
  duration: '45 min',
  isCustom: true,
  exercises: [{ id: 'bench', name: 'Bench', createdAt: '2026-08-01T00:00:00.000Z' }],
  prescription: [
    { sourceSetId: 'a', exerciseId: 'bench', exerciseName: 'Bench', weight: 100, reps: 8, targetRpe: 8 },
    { sourceSetId: 'b', exerciseId: 'bench', exerciseName: 'Bench', weight: 90, reps: 10, targetRpe: 8.5 },
  ],
  ...overrides,
});

const proposal = (finding: TrainingFinding, overrides: Partial<AdaptiveProgramProposal> = {}): AdaptiveProgramProposal => ({
  exerciseId: 'bench',
  exerciseName: 'Bench',
  workoutTemplateIds: ['push'],
  baseAction: 'progress',
  action: 'progress',
  recoveryModifier: 'neutral',
  adjustedByRecovery: false,
  finding,
  ...overrides,
});

const finding = (
  kind: TrainingFinding['kind'],
  prType: TrainingFinding['prType'],
  evidence: TrainingFinding['evidence'],
): TrainingFinding => ({
  id: `${kind}-${prType ?? 'none'}`,
  kind,
  rulesetVersion: TRAINING_INTELLIGENCE_RULESET_VERSION,
  occurredAt: '2026-08-23T09:00:00.000Z',
  exerciseId: 'bench',
  exerciseName: 'Bench',
  prType,
  evidence,
});

describe('buildAdaptiveProgramPrescriptionPreview', () => {
  it('preserves prescription shape while bounding load progression to five percent', () => {
    const result = buildAdaptiveProgramPrescriptionPreview({
      proposal: proposal(finding('new_pr', 'load', { previousBest: 100, newBest: 120 })),
      workouts: [workout()],
    });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(result.preview.loadMultiplier).toBe(1.05);
    expect(result.preview.rows).toEqual([
      { index: 0, currentWeight: 100, nextWeight: 105, currentReps: 8, nextReps: 8, targetRpe: 8 },
      { index: 1, currentWeight: 90, nextWeight: 94.5, currentReps: 10, nextReps: 10, targetRpe: 8.5 },
    ]);
  });

  it('bounds rep progression to two reps and preserves weight and RPE', () => {
    const result = buildAdaptiveProgramPrescriptionPreview({
      proposal: proposal(finding('rep_progression', undefined, { firstReps: 8, latestReps: 12 })),
      workouts: [workout()],
    });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(result.preview.repIncrement).toBe(2);
    expect(result.preview.rows[0]).toMatchObject({ currentWeight: 100, nextWeight: 100, currentReps: 8, nextReps: 10, targetRpe: 8 });
  });

  it('fails closed for ambiguous templates, recovery-downgraded proposals and unsupported PR types', () => {
    const load = finding('new_pr', 'load', { previousBest: 100, newBest: 105 });
    expect(buildAdaptiveProgramPrescriptionPreview({
      proposal: proposal(load, { workoutTemplateIds: ['push', 'push-2'] }),
      workouts: [workout()],
    })).toEqual({ status: 'unavailable', reason: 'ambiguous_template' });

    expect(buildAdaptiveProgramPrescriptionPreview({
      proposal: proposal(load, { action: 'maintain', recoveryModifier: 'caution', adjustedByRecovery: true }),
      workouts: [workout()],
    })).toEqual({ status: 'unavailable', reason: 'proposal_not_progress' });

    expect(buildAdaptiveProgramPrescriptionPreview({
      proposal: proposal(finding('new_pr', 'estimated_1rm', { previousBest: 120, newBest: 125 })),
      workouts: [workout()],
    })).toEqual({ status: 'unavailable', reason: 'unsupported_finding' });
  });

  it('prevents applying the same deterministic finding twice', () => {
    const sourceFinding = finding('new_pr', 'load', { previousBest: 100, newBest: 105 });
    const marked = workout({
      prescription: [
        { exerciseId: 'bench', exerciseName: 'Bench', weight: 105, reps: 8, targetRpe: 8, rationaleCode: `adaptive-program-v1:${sourceFinding.id}` },
      ],
    });

    expect(buildAdaptiveProgramPrescriptionPreview({ proposal: proposal(sourceFinding), workouts: [marked] }))
      .toEqual({ status: 'unavailable', reason: 'already_applied' });
  });
});
