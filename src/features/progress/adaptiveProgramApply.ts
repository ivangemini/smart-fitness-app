import { buildWorkoutPrescriptionFingerprint } from '@/features/workouts/workoutPrescriptionPatch';
import type { Workout, WorkoutPrescriptionPatch, WorkoutPrescriptionSet } from '@/types';

import type { AdaptiveProgramProposal } from './adaptiveProgramEngine';

const MAX_LOAD_MULTIPLIER = 1.05;
const MAX_REP_INCREMENT = 2;
const RATIONALE_PREFIX = 'adaptive-program-v1:';

export type AdaptiveProgramApplyUnavailableReason =
  | 'proposal_not_progress'
  | 'ambiguous_template'
  | 'template_unresolved'
  | 'template_not_custom'
  | 'prescription_missing'
  | 'unsupported_finding'
  | 'invalid_evidence'
  | 'already_applied'
  | 'no_change';

export type AdaptiveProgramPrescriptionPreviewRow = {
  index: number;
  currentWeight: number;
  nextWeight: number;
  currentReps: number;
  nextReps: number;
  targetRpe: WorkoutPrescriptionSet['targetRpe'];
};

export type AdaptiveProgramPrescriptionPreview = {
  proposalId: string;
  findingId: string;
  exerciseId: string;
  exerciseName: string;
  templateId: string;
  templateTitle: string;
  strategy: 'load_ratio' | 'rep_increment';
  loadMultiplier: number | null;
  repIncrement: number | null;
  rows: AdaptiveProgramPrescriptionPreviewRow[];
  patch: WorkoutPrescriptionPatch;
};

export type AdaptiveProgramPrescriptionPreviewResult =
  | { status: 'ready'; preview: AdaptiveProgramPrescriptionPreview }
  | { status: 'unavailable'; reason: AdaptiveProgramApplyUnavailableReason };

const numericEvidence = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const roundToHalfKg = (value: number) => Math.round(value * 2) / 2;

const getExactTemplate = (
  proposal: AdaptiveProgramProposal,
  workouts: readonly Workout[],
): { workout: Workout } | { reason: AdaptiveProgramApplyUnavailableReason } => {
  if (proposal.workoutTemplateIds.length !== 1) return { reason: 'ambiguous_template' };
  const workout = workouts.find((candidate) => candidate.id === proposal.workoutTemplateIds[0]);
  if (!workout) return { reason: 'template_unresolved' };
  if (workout.isCustom !== true) return { reason: 'template_not_custom' };
  if (!workout.prescription) return { reason: 'prescription_missing' };
  return { workout };
};

const buildLoadChange = (proposal: AdaptiveProgramProposal) => {
  if (proposal.finding.kind !== 'new_pr' || proposal.finding.prType !== 'load') return null;
  const previousBest = numericEvidence(proposal.finding.evidence.previousBest);
  const newBest = numericEvidence(proposal.finding.evidence.newBest);
  if (previousBest === null || newBest === null || previousBest <= 0 || newBest <= previousBest) return 'invalid' as const;
  return { multiplier: Math.min(newBest / previousBest, MAX_LOAD_MULTIPLIER) };
};

const buildRepChange = (proposal: AdaptiveProgramProposal) => {
  let previous: number | null = null;
  let next: number | null = null;

  if (proposal.finding.kind === 'new_pr' && proposal.finding.prType === 'reps') {
    previous = numericEvidence(proposal.finding.evidence.previousBestReps);
    next = numericEvidence(proposal.finding.evidence.newBestReps);
  } else if (proposal.finding.kind === 'rep_progression') {
    previous = numericEvidence(proposal.finding.evidence.firstReps);
    next = numericEvidence(proposal.finding.evidence.latestReps);
  } else {
    return null;
  }

  if (previous === null || next === null || next <= previous) return 'invalid' as const;
  return { increment: Math.min(MAX_REP_INCREMENT, Math.max(1, Math.round(next - previous))) };
};

export function buildAdaptiveProgramPrescriptionPreview(input: {
  proposal: AdaptiveProgramProposal;
  workouts: readonly Workout[];
}): AdaptiveProgramPrescriptionPreviewResult {
  const { proposal } = input;
  if (proposal.action !== 'progress') return { status: 'unavailable', reason: 'proposal_not_progress' };

  const templateResult = getExactTemplate(proposal, input.workouts);
  if ('reason' in templateResult) return { status: 'unavailable', reason: templateResult.reason };
  const { workout } = templateResult;
  const prescription = workout.prescription!;
  const targetRows = prescription
    .map((set, index) => ({ set, index }))
    .filter(({ set }) => set.exerciseId === proposal.exerciseId);
  if (targetRows.length === 0) return { status: 'unavailable', reason: 'prescription_missing' };

  const rationaleCode = `${RATIONALE_PREFIX}${proposal.finding.id}`;
  if (targetRows.some(({ set }) => set.rationaleCode === rationaleCode)) {
    return { status: 'unavailable', reason: 'already_applied' };
  }

  const loadChange = buildLoadChange(proposal);
  const repChange = buildRepChange(proposal);
  if (loadChange === 'invalid' || repChange === 'invalid') {
    return { status: 'unavailable', reason: 'invalid_evidence' };
  }
  if (!loadChange && !repChange) {
    return { status: 'unavailable', reason: 'unsupported_finding' };
  }

  const rows: AdaptiveProgramPrescriptionPreviewRow[] = [];
  const patchRows: WorkoutPrescriptionPatch['rows'] = [];
  for (const { set, index } of targetRows) {
    const nextWeight = loadChange && set.weight > 0
      ? roundToHalfKg(set.weight * loadChange.multiplier)
      : set.weight;
    const nextReps = repChange ? set.reps + repChange.increment : set.reps;
    if (nextWeight === set.weight && nextReps === set.reps) continue;

    rows.push({
      index,
      currentWeight: set.weight,
      nextWeight,
      currentReps: set.reps,
      nextReps,
      targetRpe: set.targetRpe,
    });
    patchRows.push({
      index,
      exerciseId: proposal.exerciseId,
      expectedWeight: set.weight,
      expectedReps: set.reps,
      expectedTargetRpe: set.targetRpe,
      nextWeight,
      nextReps,
      nextAdjustment: 'increase',
      nextRationaleCode: rationaleCode,
    });
  }

  if (rows.length === 0) return { status: 'unavailable', reason: 'no_change' };

  return {
    status: 'ready',
    preview: {
      proposalId: `${proposal.exerciseId}:${proposal.finding.id}`,
      findingId: proposal.finding.id,
      exerciseId: proposal.exerciseId,
      exerciseName: proposal.exerciseName,
      templateId: workout.id,
      templateTitle: workout.title,
      strategy: loadChange ? 'load_ratio' : 'rep_increment',
      loadMultiplier: loadChange ? loadChange.multiplier : null,
      repIncrement: repChange ? repChange.increment : null,
      rows,
      patch: {
        templateId: workout.id,
        exerciseId: proposal.exerciseId,
        expectedFingerprint: buildWorkoutPrescriptionFingerprint(workout),
        rows: patchRows,
      },
    },
  };
}
