import type { RecoveryCheckIn, TrainingProgram, Workout } from '@/types';

import type { TrainingFinding } from './trainingIntelligence';

const HOUR_MS = 60 * 60 * 1000;
const RECOVERY_FRESHNESS_MS = 48 * HOUR_MS;

export type RecoveryModifierState = 'unknown' | 'neutral' | 'caution' | 'strong_caution';
export type AdaptiveProgramAction = 'progress' | 'maintain' | 'review';

export type RecoveryModifierEvidence = {
  state: RecoveryModifierState;
  checkInId: string | null;
  recordedAt: string | null;
  signals: Array<
    | 'short_sleep'
    | 'low_sleep_quality'
    | 'high_fatigue'
    | 'high_soreness'
    | 'high_stress'
    | 'pain_interference'
    | 'low_self_reported_readiness'
  >;
};

export type AdaptiveProgramProposal = {
  exerciseId: string;
  exerciseName: string;
  baseAction: AdaptiveProgramAction;
  action: AdaptiveProgramAction;
  finding: TrainingFinding;
  recoveryModifier: RecoveryModifierState;
  adjustedByRecovery: boolean;
};

export type AdaptiveProgramReview = {
  recovery: RecoveryModifierEvidence;
  proposals: AdaptiveProgramProposal[];
  plannedExerciseCount: number;
  unresolvedTemplateCount: number;
};

const timestamp = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getLatestFreshCheckIn = (
  checkIns: readonly RecoveryCheckIn[],
  endAt: number,
): RecoveryCheckIn | null =>
  [...checkIns]
    .map((checkIn) => ({ checkIn, at: timestamp(checkIn.recordedAt) }))
    .filter(
      (entry): entry is { checkIn: RecoveryCheckIn; at: number } =>
        entry.at !== null && entry.at <= endAt && endAt - entry.at <= RECOVERY_FRESHNESS_MS,
    )
    .sort((left, right) => right.at - left.at || left.checkIn.id.localeCompare(right.checkIn.id))[0]
    ?.checkIn ?? null;

export const buildRecoveryModifier = (
  checkIns: readonly RecoveryCheckIn[],
  endAtValue: string,
): RecoveryModifierEvidence => {
  const endAt = timestamp(endAtValue);
  if (endAt === null) throw new Error('buildRecoveryModifier requires a valid endAt timestamp');

  const latest = getLatestFreshCheckIn(checkIns, endAt);
  if (!latest) {
    return { state: 'unknown', checkInId: null, recordedAt: null, signals: [] };
  }

  const signals: RecoveryModifierEvidence['signals'] = [];
  if (latest.sleepDurationHours !== null && latest.sleepDurationHours < 6) signals.push('short_sleep');
  if (latest.sleepQuality !== null && latest.sleepQuality <= 2) signals.push('low_sleep_quality');
  if (latest.fatigue !== null && latest.fatigue >= 4) signals.push('high_fatigue');
  if (latest.soreness !== null && latest.soreness >= 4) signals.push('high_soreness');
  if (latest.stress !== null && latest.stress >= 4) signals.push('high_stress');
  if (latest.painInterference !== null && latest.painInterference >= 3) signals.push('pain_interference');
  if (latest.readiness !== null && latest.readiness <= 2) signals.push('low_self_reported_readiness');

  const strong =
    (latest.fatigue !== null && latest.fatigue >= 5) ||
    (latest.painInterference !== null && latest.painInterference >= 3) ||
    (latest.readiness !== null && latest.readiness <= 2);

  return {
    state: strong ? 'strong_caution' : signals.length > 0 ? 'caution' : 'neutral',
    checkInId: latest.id,
    recordedAt: latest.recordedAt,
    signals,
  };
};

const actionForFinding = (finding: TrainingFinding): AdaptiveProgramAction | null => {
  switch (finding.kind) {
    case 'new_pr':
    case 'rep_progression':
      return 'progress';
    case 'plateau':
      return 'maintain';
    case 'regression':
    case 'exercise_gap':
      return 'review';
    default:
      return null;
  }
};

const findingPriority: Record<TrainingFinding['kind'], number> = {
  regression: 6,
  exercise_gap: 5,
  new_pr: 4,
  rep_progression: 3,
  plateau: 2,
  volume_spike: 0,
  muscle_exposure_imbalance: 0,
  muscle_gap: 0,
};

const applyRecoveryModifier = (
  action: AdaptiveProgramAction,
  recovery: RecoveryModifierState,
): AdaptiveProgramAction => {
  if (recovery === 'strong_caution') {
    return action === 'review' ? 'review' : action === 'progress' ? 'maintain' : 'review';
  }
  if (recovery === 'caution' && action === 'progress') return 'maintain';
  return action;
};

export function buildAdaptiveProgramReview(input: {
  endAt: string;
  findings: readonly TrainingFinding[];
  program: TrainingProgram;
  recoveryCheckIns: readonly RecoveryCheckIn[];
  workouts: readonly Workout[];
}): AdaptiveProgramReview {
  const recovery = buildRecoveryModifier(input.recoveryCheckIns, input.endAt);
  const workoutById = new Map(input.workouts.map((workout) => [workout.id, workout] as const));
  const plannedExercises = new Map<string, string>();
  let unresolvedTemplateCount = 0;

  for (const day of input.program.days) {
    if (day.restDay === true) continue;
    const templateId = day.workoutTemplateId?.trim() ?? '';
    if (!templateId) {
      unresolvedTemplateCount += 1;
      continue;
    }
    const workout = workoutById.get(templateId);
    if (!workout) {
      unresolvedTemplateCount += 1;
      continue;
    }
    for (const exercise of workout.exercises) {
      const id = exercise.id.trim();
      if (id) plannedExercises.set(id, exercise.name);
    }
  }

  const latestFindingByExercise = new Map<string, TrainingFinding>();
  const ordered = [...input.findings].sort((left, right) => {
    const priority = findingPriority[right.kind] - findingPriority[left.kind];
    if (priority !== 0) return priority;
    return (timestamp(right.occurredAt) ?? 0) - (timestamp(left.occurredAt) ?? 0) ||
      left.id.localeCompare(right.id);
  });

  for (const finding of ordered) {
    const exerciseId = finding.exerciseId?.trim() ?? '';
    if (!exerciseId || !plannedExercises.has(exerciseId) || latestFindingByExercise.has(exerciseId)) continue;
    if (actionForFinding(finding) === null) continue;
    latestFindingByExercise.set(exerciseId, finding);
  }

  const proposals = [...latestFindingByExercise.entries()]
    .map(([exerciseId, finding]): AdaptiveProgramProposal => {
      const baseAction = actionForFinding(finding)!;
      const action = applyRecoveryModifier(baseAction, recovery.state);
      return {
        exerciseId,
        exerciseName: plannedExercises.get(exerciseId) ?? finding.exerciseName ?? exerciseId,
        baseAction,
        action,
        finding,
        recoveryModifier: recovery.state,
        adjustedByRecovery: action !== baseAction,
      };
    })
    .sort((left, right) => {
      const actionPriority: Record<AdaptiveProgramAction, number> = { review: 3, maintain: 2, progress: 1 };
      return actionPriority[right.action] - actionPriority[left.action] ||
        left.exerciseName.localeCompare(right.exerciseName);
    });

  return {
    recovery,
    proposals,
    plannedExerciseCount: plannedExercises.size,
    unresolvedTemplateCount,
  };
}
