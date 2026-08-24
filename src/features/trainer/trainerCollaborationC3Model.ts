import { isUuid, type TrainerReadScope } from './trainerCollaborationModel';

export const TRAINER_EVIDENCE_SCHEMA_VERSION = 1 as const;
export const TRAINER_COMMENT_SCHEMA_VERSION = 1 as const;

export type TrainerWorkoutHistoryItem = {
  sessionId: string;
  templateId: string | null;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number | null;
  exerciseCount: number;
  completedSetCount: number;
  volume: number;
};

export type TrainerWorkoutTemplateItem = {
  id: string;
  name: string;
  goal: string | null;
  difficulty: string | null;
  durationWeeks: number | null;
  cadencePerWeek: number | null;
};

export type TrainerTrainingProgramItem = {
  id: string;
  name: string;
  goal: string | null;
  difficulty: string | null;
  durationWeeks: number | null;
  isActive: boolean;
  startedAt: string | null;
  endedAt: string | null;
};

export type TrainerProgressWeightItem = {
  id: string;
  measuredAt: string;
  value: number;
  unit: string;
};

export type TrainerProgressMeasurementItem = {
  id: string;
  measuredAt: string;
  measurementType: string;
  bodyPart: string | null;
  value: number;
  unit: string;
};

export type TrainerRecoveryItem = {
  id: string;
  recordedAt: string;
  sleepDurationHours: number | null;
  sleepQuality: number | null;
  fatigue: number | null;
  soreness: number | null;
  stress: number | null;
  painInterference: number | null;
  readiness: number | null;
};

export type TrainerEvidence =
  | {
      schemaVersion: 1;
      relationshipId: string;
      scope: 'workout_history_summary';
      data: TrainerWorkoutHistoryItem[];
    }
  | {
      schemaVersion: 1;
      relationshipId: string;
      scope: 'workout_templates';
      data: TrainerWorkoutTemplateItem[];
    }
  | {
      schemaVersion: 1;
      relationshipId: string;
      scope: 'training_programs';
      data: TrainerTrainingProgramItem[];
    }
  | {
      schemaVersion: 1;
      relationshipId: string;
      scope: 'progress_summary';
      data: {
        weights: TrainerProgressWeightItem[];
        measurements: TrainerProgressMeasurementItem[];
      };
    }
  | {
      schemaVersion: 1;
      relationshipId: string;
      scope: 'recovery_summary';
      data: TrainerRecoveryItem[];
    };

export type TrainerComment = {
  schemaVersion: 1;
  id: string;
  relationshipId: string;
  author: {
    role: 'trainer';
    displayName: string | null;
  };
  body: string;
  createdAt: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const requireRecord = (value: unknown, label: string): Record<string, unknown> => {
  if (!isRecord(value)) throw new Error(`Invalid trainer ${label}`);
  return value;
};

const requireArray = (value: unknown, label: string): unknown[] => {
  if (!Array.isArray(value)) throw new Error(`Invalid trainer ${label}`);
  return value;
};

const requireString = (value: unknown, label: string): string => {
  if (typeof value !== 'string') throw new Error(`Invalid trainer ${label}`);
  return value;
};

const requireNullableString = (value: unknown, label: string): string | null => {
  if (value === null) return null;
  return requireString(value, label);
};

const requireNumber = (value: unknown, label: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid trainer ${label}`);
  }
  return value;
};

const requireNullableNumber = (value: unknown, label: string): number | null => {
  if (value === null) return null;
  return requireNumber(value, label);
};

const requireUuid = (value: unknown, label: string): string => {
  if (!isUuid(value)) throw new Error(`Invalid trainer ${label}`);
  return value;
};

const requireNullableUuid = (value: unknown, label: string): string | null => {
  if (value === null) return null;
  return requireUuid(value, label);
};

const requireTimestamp = (value: unknown, label: string): string => {
  const timestamp = requireString(value, label);
  if (!Number.isFinite(Date.parse(timestamp))) throw new Error(`Invalid trainer ${label}`);
  return timestamp;
};

const requireNullableTimestamp = (value: unknown, label: string): string | null => {
  if (value === null) return null;
  return requireTimestamp(value, label);
};

const requireBoolean = (value: unknown, label: string): boolean => {
  if (typeof value !== 'boolean') throw new Error(`Invalid trainer ${label}`);
  return value;
};

const parseWorkoutHistory = (value: unknown): TrainerWorkoutHistoryItem[] =>
  requireArray(value, 'workout history').map((raw) => {
    const item = requireRecord(raw, 'workout history item');
    return {
      sessionId: requireUuid(item.sessionId, 'workout session id'),
      templateId: requireNullableUuid(item.templateId, 'workout template id'),
      startedAt: requireTimestamp(item.startedAt, 'workout start'),
      endedAt: requireNullableTimestamp(item.endedAt, 'workout end'),
      durationMinutes: requireNullableNumber(item.durationMinutes, 'workout duration'),
      exerciseCount: requireNumber(item.exerciseCount, 'exercise count'),
      completedSetCount: requireNumber(item.completedSetCount, 'completed set count'),
      volume: requireNumber(item.volume, 'workout volume'),
    };
  });

const parseWorkoutTemplates = (value: unknown): TrainerWorkoutTemplateItem[] =>
  requireArray(value, 'workout templates').map((raw) => {
    const item = requireRecord(raw, 'workout template');
    return {
      id: requireUuid(item.id, 'workout template id'),
      name: requireString(item.name, 'workout template name'),
      goal: requireNullableString(item.goal, 'workout template goal'),
      difficulty: requireNullableString(item.difficulty, 'workout template difficulty'),
      durationWeeks: requireNullableNumber(item.durationWeeks, 'workout template duration'),
      cadencePerWeek: requireNullableNumber(item.cadencePerWeek, 'workout template cadence'),
    };
  });

const parseTrainingPrograms = (value: unknown): TrainerTrainingProgramItem[] =>
  requireArray(value, 'training programs').map((raw) => {
    const item = requireRecord(raw, 'training program');
    return {
      id: requireUuid(item.id, 'training program id'),
      name: requireString(item.name, 'training program name'),
      goal: requireNullableString(item.goal, 'training program goal'),
      difficulty: requireNullableString(item.difficulty, 'training program difficulty'),
      durationWeeks: requireNullableNumber(item.durationWeeks, 'training program duration'),
      isActive: requireBoolean(item.isActive, 'training program active state'),
      startedAt: requireNullableTimestamp(item.startedAt, 'training program start'),
      endedAt: requireNullableTimestamp(item.endedAt, 'training program end'),
    };
  });

const parseProgress = (value: unknown) => {
  const progress = requireRecord(value, 'progress summary');
  return {
    weights: requireArray(progress.weights, 'progress weights').map((raw) => {
      const item = requireRecord(raw, 'progress weight');
      return {
        id: requireUuid(item.id, 'progress weight id'),
        measuredAt: requireTimestamp(item.measuredAt, 'progress weight timestamp'),
        value: requireNumber(item.value, 'progress weight value'),
        unit: requireString(item.unit, 'progress weight unit'),
      };
    }),
    measurements: requireArray(progress.measurements, 'progress measurements').map((raw) => {
      const item = requireRecord(raw, 'progress measurement');
      return {
        id: requireUuid(item.id, 'progress measurement id'),
        measuredAt: requireTimestamp(item.measuredAt, 'progress measurement timestamp'),
        measurementType: requireString(item.measurementType, 'progress measurement type'),
        bodyPart: requireNullableString(item.bodyPart, 'progress body part'),
        value: requireNumber(item.value, 'progress measurement value'),
        unit: requireString(item.unit, 'progress measurement unit'),
      };
    }),
  };
};

const parseRecovery = (value: unknown): TrainerRecoveryItem[] =>
  requireArray(value, 'recovery summary').map((raw) => {
    const item = requireRecord(raw, 'recovery item');
    return {
      id: requireUuid(item.id, 'recovery id'),
      recordedAt: requireTimestamp(item.recordedAt, 'recovery timestamp'),
      sleepDurationHours: requireNullableNumber(item.sleepDurationHours, 'sleep duration'),
      sleepQuality: requireNullableNumber(item.sleepQuality, 'sleep quality'),
      fatigue: requireNullableNumber(item.fatigue, 'fatigue'),
      soreness: requireNullableNumber(item.soreness, 'soreness'),
      stress: requireNullableNumber(item.stress, 'stress'),
      painInterference: requireNullableNumber(item.painInterference, 'pain interference'),
      readiness: requireNullableNumber(item.readiness, 'readiness'),
    };
  });

export const parseTrainerEvidenceEnvelope = (
  value: unknown,
  expectedRelationshipId: string,
  expectedScope: TrainerReadScope,
): TrainerEvidence => {
  const envelope = requireRecord(value, 'evidence response');
  const evidence = requireRecord(envelope.evidence, 'evidence');
  if (evidence.schemaVersion !== TRAINER_EVIDENCE_SCHEMA_VERSION) {
    throw new Error('Unsupported trainer evidence schema');
  }
  const relationshipId = requireUuid(evidence.relationshipId, 'evidence relationship id');
  if (relationshipId !== expectedRelationshipId || evidence.scope !== expectedScope) {
    throw new Error('Trainer evidence authority mismatch');
  }

  switch (expectedScope) {
    case 'workout_history_summary':
      return { schemaVersion: 1, relationshipId, scope: expectedScope, data: parseWorkoutHistory(evidence.data) };
    case 'workout_templates':
      return { schemaVersion: 1, relationshipId, scope: expectedScope, data: parseWorkoutTemplates(evidence.data) };
    case 'training_programs':
      return { schemaVersion: 1, relationshipId, scope: expectedScope, data: parseTrainingPrograms(evidence.data) };
    case 'progress_summary':
      return { schemaVersion: 1, relationshipId, scope: expectedScope, data: parseProgress(evidence.data) };
    case 'recovery_summary':
      return { schemaVersion: 1, relationshipId, scope: expectedScope, data: parseRecovery(evidence.data) };
  }
};

const parseTrainerComment = (value: unknown, expectedRelationshipId: string): TrainerComment => {
  const comment = requireRecord(value, 'comment');
  if (comment.schemaVersion !== TRAINER_COMMENT_SCHEMA_VERSION) {
    throw new Error('Unsupported trainer comment schema');
  }
  const relationshipId = requireUuid(comment.relationshipId, 'comment relationship id');
  if (relationshipId !== expectedRelationshipId) {
    throw new Error('Trainer comment authority mismatch');
  }
  const author = requireRecord(comment.author, 'comment author');
  if (author.role !== 'trainer') throw new Error('Invalid trainer comment provenance');
  return {
    schemaVersion: 1,
    id: requireUuid(comment.id, 'comment id'),
    relationshipId,
    author: {
      role: 'trainer',
      displayName: requireNullableString(author.displayName, 'comment author name'),
    },
    body: requireString(comment.body, 'comment body'),
    createdAt: requireTimestamp(comment.createdAt, 'comment timestamp'),
  };
};

export const parseTrainerCommentsEnvelope = (
  value: unknown,
  expectedRelationshipId: string,
): TrainerComment[] => {
  const envelope = requireRecord(value, 'comments response');
  return requireArray(envelope.comments, 'comments').map((comment) =>
    parseTrainerComment(comment, expectedRelationshipId),
  );
};

export const parseTrainerCommentEnvelope = (
  value: unknown,
  expectedRelationshipId: string,
): TrainerComment => {
  const envelope = requireRecord(value, 'comment response');
  return parseTrainerComment(envelope.comment, expectedRelationshipId);
};
