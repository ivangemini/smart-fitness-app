import type {
  AdaptiveProgramAction,
  AdaptiveProgramReview,
  RecoveryModifierEvidence,
} from './adaptiveProgramEngine';
import type {
  TrainingIntelligenceReview,
  TrainingPlanComparison,
} from './trainingIntelligenceReview';
import type { TrainingCoverageMovementFact } from './trainingCoverage';
import type { TrainingFinding } from './trainingIntelligence';

export const WEEKLY_TRAINING_REVIEW_WINDOW_DAYS = 7 as const;

export type WeeklyAdaptiveActionCounts = Record<AdaptiveProgramAction, number>;

export type WeeklyTrainingReview = {
  endAt: string;
  windowDays: typeof WEEKLY_TRAINING_REVIEW_WINDOW_DAYS;
  plan: TrainingPlanComparison;
  coverage: {
    eligibleWorkingSetCount: number;
    activeMuscleCount: number;
    reviewedMovementPatternCount: number;
    topMovementPatterns: TrainingCoverageMovementFact[];
  };
  keyFindings: TrainingFinding[];
  recovery: RecoveryModifierEvidence;
  adaptive: {
    available: boolean;
    plannedExerciseCount: number;
    unresolvedTemplateCount: number;
    adjustedByRecoveryCount: number;
    actionCounts: WeeklyAdaptiveActionCounts;
  };
};

export type WeeklyTrainingReviewResult =
  | { status: 'ready'; review: WeeklyTrainingReview }
  | { status: 'unavailable'; reason: 'window_mismatch' | 'evidence_mismatch' };

const emptyActionCounts = (): WeeklyAdaptiveActionCounts => ({
  progress: 0,
  maintain: 0,
  review: 0,
});

const sameRecoveryEvidence = (
  left: RecoveryModifierEvidence,
  right: RecoveryModifierEvidence,
) =>
  left.state === right.state &&
  left.checkInId === right.checkInId &&
  left.recordedAt === right.recordedAt &&
  left.signals.length === right.signals.length &&
  left.signals.every((signal, index) => signal === right.signals[index]);

export function buildWeeklyTrainingReview(input: {
  trainingReview: TrainingIntelligenceReview;
  recovery: RecoveryModifierEvidence;
  adaptiveReview?: AdaptiveProgramReview | null;
}): WeeklyTrainingReviewResult {
  const { adaptiveReview, recovery, trainingReview } = input;

  if (trainingReview.windowDays !== WEEKLY_TRAINING_REVIEW_WINDOW_DAYS) {
    return { status: 'unavailable', reason: 'window_mismatch' };
  }

  if (adaptiveReview && !sameRecoveryEvidence(adaptiveReview.recovery, recovery)) {
    return { status: 'unavailable', reason: 'evidence_mismatch' };
  }

  const actionCounts = emptyActionCounts();
  let adjustedByRecoveryCount = 0;

  for (const proposal of adaptiveReview?.proposals ?? []) {
    actionCounts[proposal.action] += 1;
    if (proposal.adjustedByRecovery) adjustedByRecoveryCount += 1;
  }

  return {
    status: 'ready',
    review: {
      endAt: trainingReview.endAt,
      windowDays: WEEKLY_TRAINING_REVIEW_WINDOW_DAYS,
      plan: trainingReview.plan,
      coverage: {
        eligibleWorkingSetCount: trainingReview.eligibleWorkingSetCount,
        activeMuscleCount: trainingReview.activeMuscleCount,
        reviewedMovementPatternCount: trainingReview.reviewedMovementPatternCount,
        topMovementPatterns: trainingReview.topMovementPatterns,
      },
      keyFindings: trainingReview.keyFindings.slice(0, 3),
      recovery,
      adaptive: {
        available: Boolean(adaptiveReview),
        plannedExerciseCount: adaptiveReview?.plannedExerciseCount ?? 0,
        unresolvedTemplateCount: adaptiveReview?.unresolvedTemplateCount ?? 0,
        adjustedByRecoveryCount,
        actionCounts,
      },
    },
  };
}
