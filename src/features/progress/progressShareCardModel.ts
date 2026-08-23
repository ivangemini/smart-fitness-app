import type { BodyMeasurement, WeightEntry, WorkoutSession } from '@/types';

import type {
  TrainingFinding,
  TrainingFindingKind,
  TrainingPrType,
} from './trainingIntelligence';
import type { WeeklyTrainingReview } from './weeklyTrainingReview';

export const PROGRESS_SHARE_CARD_SCHEMA_VERSION = 1 as const;

export type ProgressShareCardUnavailableReason =
  | 'source_not_ready'
  | 'invalid_timestamp'
  | 'identity_unresolved'
  | 'invalid_evidence'
  | 'unsupported_finding';

export type ProgressShareCardSource = {
  entity:
    | 'workout_session'
    | 'training_finding'
    | 'weekly_review'
    | 'weight_entry'
    | 'body_measurement';
  id: string;
  occurredAt: string;
  sourceDate?: string;
};

export type ProgressShareCardPrivacy = {
  includesNotes: false;
  includesPhoto: false;
  publishesAutomatically: false;
};

export type ProgressShareCardSignal = {
  id: string;
  kind: TrainingFindingKind;
  prType: TrainingPrType | null;
  exerciseId: string | null;
  exerciseLabel: string | null;
  muscleId: string | null;
};

type ProgressShareCardBase = {
  schemaVersion: typeof PROGRESS_SHARE_CARD_SCHEMA_VERSION;
  source: ProgressShareCardSource;
  subjectLabel: string | null;
  privacy: ProgressShareCardPrivacy;
};

export type WorkoutSummaryShareCard = ProgressShareCardBase & {
  kind: 'workout_summary';
  data: {
    durationMinutes: number;
    exerciseCount: number;
    workingSetCount: number;
    workingVolumeKgReps: number;
  };
};

export type TrainingPrShareCard = ProgressShareCardBase & {
  kind: 'training_pr';
  data:
    | {
        metric: 'load' | 'estimated_1rm' | 'session_volume';
        previousValue: number;
        newValue: number;
        unit: 'kg' | 'kg_reps';
      }
    | {
        metric: 'reps';
        loadKg: number;
        previousValue: number;
        newValue: number;
        unit: 'reps';
      };
};

export type WeeklyReviewShareCard = ProgressShareCardBase & {
  kind: 'weekly_review';
  data: {
    windowDays: 7;
    plan: null | {
      plannedSessionCount: number;
      completedPlannedSessionCount: number;
      otherCompletedSessionCount: number;
      unresolvedPlannedSessionCount: number;
    };
    coverage: {
      workingSetCount: number;
      activeMuscleCount: number;
      movementPatternCount: number;
    };
    recovery: {
      state: WeeklyTrainingReview['recovery']['state'];
      signalCodes: WeeklyTrainingReview['recovery']['signals'];
    };
    adaptive: WeeklyTrainingReview['adaptive'];
    keySignals: ProgressShareCardSignal[];
  };
};

export type WeightMilestoneShareCard = ProgressShareCardBase & {
  kind: 'weight_milestone';
  data: {
    weightKg: number;
    previousWeightKg: number | null;
    deltaKg: number | null;
  };
};

export type BodyMeasurementShareCard = ProgressShareCardBase & {
  kind: 'body_measurement';
  data: {
    metric: NonNullable<BodyMeasurement['metric']>;
    value: number;
    unit: NonNullable<BodyMeasurement['unit']>;
    previousValue: number | null;
    delta: number | null;
  };
};

export type ProgressShareCardViewModel =
  | WorkoutSummaryShareCard
  | TrainingPrShareCard
  | WeeklyReviewShareCard
  | WeightMilestoneShareCard
  | BodyMeasurementShareCard;

export type ProgressShareCardResult =
  | { status: 'ready'; card: ProgressShareCardViewModel }
  | { status: 'unavailable'; reason: ProgressShareCardUnavailableReason };

const PRIVACY: ProgressShareCardPrivacy = {
  includesNotes: false,
  includesPhoto: false,
  publishesAutomatically: false,
};
const MAX_SUBJECT_LENGTH = 80;

const timestamp = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const cleanLabel = (value: string | undefined) => {
  const normalized = value?.replace(/\s+/g, ' ').trim() ?? '';
  return normalized.length > 0 ? normalized.slice(0, MAX_SUBJECT_LENGTH) : null;
};
const finite = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);
const positive = (value: unknown): value is number => finite(value) && value > 0;
const nonNegative = (value: unknown): value is number => finite(value) && value >= 0;
const readEvidenceNumber = (finding: TrainingFinding, key: string) => {
  const value = finding.evidence[key];
  return finite(value) ? value : null;
};
const sourceId = (value: string) => value.trim();

export function buildWorkoutSummaryShareCard(
  session: WorkoutSession,
): ProgressShareCardResult {
  const id = sourceId(session.id);
  const startedAt = timestamp(session.startedAt);
  const finishedAt = timestamp(session.finishedAt);
  if (!id) return { status: 'unavailable', reason: 'identity_unresolved' };
  if (startedAt === null || finishedAt === null || finishedAt < startedAt) {
    return { status: 'unavailable', reason: 'invalid_timestamp' };
  }

  const workingSets = session.sets.filter(
    (set) => set.completed !== false && set.setType !== 'warmup',
  );
  if (workingSets.length === 0) {
    return { status: 'unavailable', reason: 'source_not_ready' };
  }
  if (
    workingSets.some(
      (set) =>
        !sourceId(set.exerciseId) ||
        !nonNegative(set.weight) ||
        !positive(set.reps),
    )
  ) {
    return { status: 'unavailable', reason: 'invalid_evidence' };
  }

  const exerciseCount = new Set(
    workingSets.map((set) => sourceId(set.exerciseId)),
  ).size;
  const workingVolumeKgReps = workingSets.reduce(
    (total, set) => total + set.weight * set.reps,
    0,
  );

  return {
    status: 'ready',
    card: {
      schemaVersion: PROGRESS_SHARE_CARD_SCHEMA_VERSION,
      kind: 'workout_summary',
      source: {
        entity: 'workout_session',
        id,
        occurredAt: session.finishedAt,
      },
      subjectLabel: cleanLabel(session.workoutTitle),
      privacy: PRIVACY,
      data: {
        durationMinutes: Math.floor((finishedAt - startedAt) / 60_000),
        exerciseCount,
        workingSetCount: workingSets.length,
        workingVolumeKgReps,
      },
    },
  };
}

export function buildTrainingPrShareCard(
  finding: TrainingFinding,
): ProgressShareCardResult {
  if (finding.kind !== 'new_pr' || !finding.prType) {
    return { status: 'unavailable', reason: 'unsupported_finding' };
  }
  if (!sourceId(finding.id) || !sourceId(finding.exerciseId ?? '')) {
    return { status: 'unavailable', reason: 'identity_unresolved' };
  }
  if (timestamp(finding.occurredAt) === null) {
    return { status: 'unavailable', reason: 'invalid_timestamp' };
  }

  const previousValue = readEvidenceNumber(finding, 'previousBest');
  const newValue = readEvidenceNumber(finding, 'newBest');
  let data: TrainingPrShareCard['data'];

  if (finding.prType === 'reps') {
    const loadKg = readEvidenceNumber(finding, 'load');
    const previousReps = readEvidenceNumber(finding, 'previousBestReps');
    const newReps = readEvidenceNumber(finding, 'newBestReps');
    if (
      loadKg === null ||
      previousReps === null ||
      newReps === null ||
      loadKg < 0 ||
      previousReps <= 0 ||
      newReps <= previousReps
    ) {
      return { status: 'unavailable', reason: 'invalid_evidence' };
    }
    data = {
      metric: 'reps',
      loadKg,
      previousValue: previousReps,
      newValue: newReps,
      unit: 'reps',
    };
  } else {
    if (
      previousValue === null ||
      newValue === null ||
      previousValue < 0 ||
      newValue <= previousValue
    ) {
      return { status: 'unavailable', reason: 'invalid_evidence' };
    }
    data = {
      metric: finding.prType,
      previousValue,
      newValue,
      unit: finding.prType === 'session_volume' ? 'kg_reps' : 'kg',
    };
  }

  return {
    status: 'ready',
    card: {
      schemaVersion: PROGRESS_SHARE_CARD_SCHEMA_VERSION,
      kind: 'training_pr',
      source: {
        entity: 'training_finding',
        id: finding.id,
        occurredAt: finding.occurredAt,
      },
      subjectLabel: cleanLabel(finding.exerciseName),
      privacy: PRIVACY,
      data,
    },
  };
}

const buildSignal = (finding: TrainingFinding): ProgressShareCardSignal | null => {
  if (!sourceId(finding.id) || timestamp(finding.occurredAt) === null) return null;
  return {
    id: finding.id,
    kind: finding.kind,
    prType: finding.prType ?? null,
    exerciseId: sourceId(finding.exerciseId ?? '') || null,
    exerciseLabel: cleanLabel(finding.exerciseName),
    muscleId: finding.muscleId ?? null,
  };
};

export function buildWeeklyReviewShareCard(
  review: WeeklyTrainingReview,
): ProgressShareCardResult {
  if (review.windowDays !== 7) {
    return { status: 'unavailable', reason: 'invalid_evidence' };
  }
  if (timestamp(review.endAt) === null) {
    return { status: 'unavailable', reason: 'invalid_timestamp' };
  }
  const keySignals = review.keyFindings.map(buildSignal);
  if (keySignals.some((signal) => signal === null)) {
    return { status: 'unavailable', reason: 'invalid_evidence' };
  }

  return {
    status: 'ready',
    card: {
      schemaVersion: PROGRESS_SHARE_CARD_SCHEMA_VERSION,
      kind: 'weekly_review',
      source: {
        entity: 'weekly_review',
        id: `weekly-review:${review.endAt}`,
        occurredAt: review.endAt,
      },
      subjectLabel: null,
      privacy: PRIVACY,
      data: {
        windowDays: 7,
        plan:
          review.plan.status === 'available'
            ? {
                plannedSessionCount: review.plan.plannedSessionCount,
                completedPlannedSessionCount:
                  review.plan.completedPlannedSessionCount,
                otherCompletedSessionCount: review.plan.otherCompletedSessionCount,
                unresolvedPlannedSessionCount:
                  review.plan.unresolvedPlannedSessionCount,
              }
            : null,
        coverage: {
          workingSetCount: review.coverage.eligibleWorkingSetCount,
          activeMuscleCount: review.coverage.activeMuscleCount,
          movementPatternCount: review.coverage.reviewedMovementPatternCount,
        },
        recovery: {
          state: review.recovery.state,
          signalCodes: [...review.recovery.signals],
        },
        adaptive: {
          ...review.adaptive,
          actionCounts: { ...review.adaptive.actionCounts },
        },
        keySignals: keySignals as ProgressShareCardSignal[],
      },
    },
  };
}

export function buildWeightMilestoneShareCard(input: {
  entry: WeightEntry;
  previousEntry?: WeightEntry | null;
}): ProgressShareCardResult {
  const { entry, previousEntry } = input;
  if (!sourceId(entry.id)) {
    return { status: 'unavailable', reason: 'identity_unresolved' };
  }
  const occurredAt = timestamp(entry.createdAt);
  const sourceDate = timestamp(entry.date);
  if (occurredAt === null || sourceDate === null) {
    return { status: 'unavailable', reason: 'invalid_timestamp' };
  }
  if (!positive(entry.weight)) {
    return { status: 'unavailable', reason: 'invalid_evidence' };
  }

  let previousWeightKg: number | null = null;
  if (previousEntry) {
    const previousAt = timestamp(previousEntry.date);
    if (
      !sourceId(previousEntry.id) ||
      previousAt === null ||
      previousAt > sourceDate ||
      !positive(previousEntry.weight)
    ) {
      return { status: 'unavailable', reason: 'invalid_evidence' };
    }
    previousWeightKg = previousEntry.weight;
  }

  return {
    status: 'ready',
    card: {
      schemaVersion: PROGRESS_SHARE_CARD_SCHEMA_VERSION,
      kind: 'weight_milestone',
      source: {
        entity: 'weight_entry',
        id: entry.id,
        occurredAt: entry.createdAt,
        sourceDate: entry.date,
      },
      subjectLabel: null,
      privacy: PRIVACY,
      data: {
        weightKg: entry.weight,
        previousWeightKg,
        deltaKg:
          previousWeightKg === null ? null : entry.weight - previousWeightKg,
      },
    },
  };
}

export function buildBodyMeasurementShareCard(input: {
  measurement: BodyMeasurement;
  previousMeasurement?: BodyMeasurement | null;
}): ProgressShareCardResult {
  const { measurement, previousMeasurement } = input;
  if (!sourceId(measurement.id)) {
    return { status: 'unavailable', reason: 'identity_unresolved' };
  }
  if (timestamp(measurement.createdAt) === null) {
    return { status: 'unavailable', reason: 'invalid_timestamp' };
  }
  if (!measurement.metric || !measurement.unit || !positive(measurement.numericValue)) {
    return { status: 'unavailable', reason: 'invalid_evidence' };
  }

  let previousValue: number | null = null;
  if (previousMeasurement) {
    const previousAt = timestamp(previousMeasurement.createdAt);
    if (
      !sourceId(previousMeasurement.id) ||
      previousAt === null ||
      previousAt > (timestamp(measurement.createdAt) as number) ||
      previousMeasurement.metric !== measurement.metric ||
      previousMeasurement.unit !== measurement.unit ||
      !positive(previousMeasurement.numericValue)
    ) {
      return { status: 'unavailable', reason: 'invalid_evidence' };
    }
    previousValue = previousMeasurement.numericValue;
  }

  return {
    status: 'ready',
    card: {
      schemaVersion: PROGRESS_SHARE_CARD_SCHEMA_VERSION,
      kind: 'body_measurement',
      source: {
        entity: 'body_measurement',
        id: measurement.id,
        occurredAt: measurement.createdAt,
      },
      subjectLabel: cleanLabel(measurement.label),
      privacy: PRIVACY,
      data: {
        metric: measurement.metric,
        value: measurement.numericValue,
        unit: measurement.unit,
        previousValue,
        delta:
          previousValue === null ? null : measurement.numericValue - previousValue,
      },
    },
  };
}
