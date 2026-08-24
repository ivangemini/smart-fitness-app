import { isUuid } from './trainerCollaborationModel';

export const TRAINER_PROPOSAL_SCHEMA_VERSION = 1 as const;
export const TRAINER_PROPOSAL_TYPE = 'workout_template_metadata_patch' as const;
export const TRAINER_PROPOSAL_FIELDS = [
  'name',
  'goal',
  'difficulty',
  'durationWeeks',
  'cadencePerWeek',
] as const;

export type TrainerProposalField = (typeof TRAINER_PROPOSAL_FIELDS)[number];
export type TrainerProposalStatus = 'pending' | 'withdrawn' | 'applied' | 'rejected';
export type TrainerProposalTargetState = 'current' | 'stale' | 'unavailable';

export type TrainerWorkoutTemplateMetadata = {
  name: string;
  goal: string;
  difficulty: string;
  durationWeeks: number;
  cadencePerWeek: number;
};

export type TrainerWorkoutTemplateMetadataPatch = Partial<
  TrainerWorkoutTemplateMetadata
>;

export type TrainerProposalChange = {
  field: TrainerProposalField;
  before: string | number;
  after: string | number;
};

export type TrainerProposal = {
  schemaVersion: 1;
  id: string;
  relationshipId: string;
  author: { role: 'trainer'; displayName: string | null };
  status: TrainerProposalStatus;
  proposalType: typeof TRAINER_PROPOSAL_TYPE;
  target: {
    type: 'workout_template';
    id: string;
    expectedRevision: string;
    currentRevision: string | null;
    state: TrainerProposalTargetState;
  };
  before: TrainerWorkoutTemplateMetadata;
  patch: TrainerWorkoutTemplateMetadataPatch;
  changes: TrainerProposalChange[];
  message: string | null;
  createdAt: string;
  withdrawnAt: string | null;
  resolvedAt: string | null;
  appliedRevision: string | null;
  appliedSyncOperationId: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const requireRecord = (value: unknown, label: string): Record<string, unknown> => {
  if (!isRecord(value)) throw new Error(`Invalid trainer proposal ${label}`);
  return value;
};

const requireString = (value: unknown, label: string): string => {
  if (typeof value !== 'string') throw new Error(`Invalid trainer proposal ${label}`);
  return value;
};

const requireBoundedString = (value: unknown, label: string, max: number): string => {
  const text = requireString(value, label);
  if (!text.trim() || text !== text.trim() || text.length > max) {
    throw new Error(`Invalid trainer proposal ${label}`);
  }
  return text;
};

const requireUuid = (value: unknown, label: string): string => {
  if (!isUuid(value)) throw new Error(`Invalid trainer proposal ${label}`);
  return value;
};

const requireNullableUuid = (value: unknown, label: string): string | null =>
  value === null ? null : requireUuid(value, label);

const requireTimestamp = (value: unknown, label: string): string => {
  const timestamp = requireString(value, label);
  if (!Number.isFinite(Date.parse(timestamp))) {
    throw new Error(`Invalid trainer proposal ${label}`);
  }
  return timestamp;
};

const requireNullableTimestamp = (value: unknown, label: string): string | null =>
  value === null ? null : requireTimestamp(value, label);

const requirePositiveRevision = (value: unknown, label: string): string => {
  const revision = requireString(value, label);
  if (!/^[1-9]\d*$/.test(revision)) throw new Error(`Invalid trainer proposal ${label}`);
  return revision;
};

const requireNullablePositiveRevision = (
  value: unknown,
  label: string,
): string | null => (value === null ? null : requirePositiveRevision(value, label));

const requireInteger = (
  value: unknown,
  label: string,
  min: number,
  max: number,
): number => {
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) {
    throw new Error(`Invalid trainer proposal ${label}`);
  }
  return value as number;
};

const parseMetadata = (value: unknown): TrainerWorkoutTemplateMetadata => {
  const metadata = requireRecord(value, 'before snapshot');
  const allowed = new Set(TRAINER_PROPOSAL_FIELDS);
  for (const key of Object.keys(metadata)) {
    if (!allowed.has(key as TrainerProposalField)) {
      throw new Error('Invalid trainer proposal before snapshot field');
    }
  }
  return {
    name: requireBoundedString(metadata.name, 'name', 160),
    goal: requireBoundedString(metadata.goal, 'goal', 160),
    difficulty: requireBoundedString(metadata.difficulty, 'difficulty', 32),
    durationWeeks: requireInteger(metadata.durationWeeks, 'duration weeks', 1, 104),
    cadencePerWeek: requireInteger(metadata.cadencePerWeek, 'cadence', 1, 14),
  };
};

const parsePatch = (value: unknown): TrainerWorkoutTemplateMetadataPatch => {
  const raw = requireRecord(value, 'patch');
  const allowed = new Set(TRAINER_PROPOSAL_FIELDS);
  for (const key of Object.keys(raw)) {
    if (!allowed.has(key as TrainerProposalField)) {
      throw new Error('Invalid trainer proposal patch field');
    }
  }
  const patch: TrainerWorkoutTemplateMetadataPatch = {};
  if (raw.name !== undefined) patch.name = requireBoundedString(raw.name, 'name', 160);
  if (raw.goal !== undefined) patch.goal = requireBoundedString(raw.goal, 'goal', 160);
  if (raw.difficulty !== undefined) {
    patch.difficulty = requireBoundedString(raw.difficulty, 'difficulty', 32);
  }
  if (raw.durationWeeks !== undefined) {
    patch.durationWeeks = requireInteger(raw.durationWeeks, 'duration weeks', 1, 104);
  }
  if (raw.cadencePerWeek !== undefined) {
    patch.cadencePerWeek = requireInteger(raw.cadencePerWeek, 'cadence', 1, 14);
  }
  if (Object.keys(patch).length === 0) throw new Error('Invalid trainer proposal empty patch');
  return patch;
};

const buildChanges = (
  before: TrainerWorkoutTemplateMetadata,
  patch: TrainerWorkoutTemplateMetadataPatch,
): TrainerProposalChange[] =>
  TRAINER_PROPOSAL_FIELDS.flatMap((field) => {
    const after = patch[field];
    if (after === undefined || after === before[field]) return [];
    return [{ field, before: before[field], after }];
  });

const parseChanges = (
  value: unknown,
  expected: TrainerProposalChange[],
): TrainerProposalChange[] => {
  if (!Array.isArray(value) || value.length !== expected.length) {
    throw new Error('Invalid trainer proposal changes');
  }
  const parsed = value.map((raw, index) => {
    const change = requireRecord(raw, 'change');
    const expectedChange = expected[index];
    if (!expectedChange) throw new Error('Invalid trainer proposal change');
    if (
      change.field !== expectedChange.field ||
      change.before !== expectedChange.before ||
      change.after !== expectedChange.after
    ) {
      throw new Error('Invalid trainer proposal change');
    }
    return expectedChange;
  });
  if (parsed.length === 0) throw new Error('Invalid trainer proposal no-op');
  return parsed;
};

const parseLifecycle = (
  raw: Record<string, unknown>,
  status: TrainerProposalStatus,
) => {
  const withdrawnAt = requireNullableTimestamp(raw.withdrawnAt, 'withdrawn at');
  const resolvedAt = requireNullableTimestamp(raw.resolvedAt, 'resolved at');
  const appliedRevision = requireNullablePositiveRevision(
    raw.appliedRevision,
    'applied revision',
  );
  const appliedSyncOperationId = requireNullableUuid(
    raw.appliedSyncOperationId,
    'applied sync operation id',
  );

  const pending =
    status === 'pending' &&
    withdrawnAt === null &&
    resolvedAt === null &&
    appliedRevision === null &&
    appliedSyncOperationId === null;
  const withdrawn =
    status === 'withdrawn' &&
    withdrawnAt !== null &&
    resolvedAt === null &&
    appliedRevision === null &&
    appliedSyncOperationId === null;
  const rejected =
    status === 'rejected' &&
    withdrawnAt === null &&
    resolvedAt !== null &&
    appliedRevision === null &&
    appliedSyncOperationId === null;
  const applied =
    status === 'applied' &&
    withdrawnAt === null &&
    resolvedAt !== null &&
    appliedRevision !== null &&
    appliedSyncOperationId !== null;

  if (!pending && !withdrawn && !rejected && !applied) {
    throw new Error('Invalid trainer proposal lifecycle');
  }

  return { withdrawnAt, resolvedAt, appliedRevision, appliedSyncOperationId };
};

export const parseTrainerProposal = (
  value: unknown,
  expectedRelationshipId: string,
): TrainerProposal => {
  const raw = requireRecord(value, 'record');
  if (raw.schemaVersion !== TRAINER_PROPOSAL_SCHEMA_VERSION) {
    throw new Error('Unsupported trainer proposal schema');
  }
  const relationshipId = requireUuid(raw.relationshipId, 'relationship id');
  if (relationshipId !== expectedRelationshipId) {
    throw new Error('Trainer proposal relationship mismatch');
  }
  if (raw.proposalType !== TRAINER_PROPOSAL_TYPE) {
    throw new Error('Unsupported trainer proposal type');
  }
  if (
    raw.status !== 'pending' &&
    raw.status !== 'withdrawn' &&
    raw.status !== 'applied' &&
    raw.status !== 'rejected'
  ) {
    throw new Error('Invalid trainer proposal status');
  }
  const status = raw.status;
  const author = requireRecord(raw.author, 'author');
  if (author.role !== 'trainer') throw new Error('Invalid trainer proposal provenance');
  const target = requireRecord(raw.target, 'target');
  if (target.type !== 'workout_template') throw new Error('Invalid trainer proposal target type');
  if (target.state !== 'current' && target.state !== 'stale' && target.state !== 'unavailable') {
    throw new Error('Invalid trainer proposal target state');
  }
  const expectedRevision = requirePositiveRevision(target.expectedRevision, 'expected revision');
  const currentRevision =
    target.currentRevision === null
      ? null
      : requirePositiveRevision(target.currentRevision, 'current revision');
  if (
    (target.state === 'current' && currentRevision !== expectedRevision) ||
    (target.state === 'stale' && (currentRevision === null || currentRevision === expectedRevision)) ||
    (target.state === 'unavailable' && currentRevision !== null)
  ) {
    throw new Error('Invalid trainer proposal target revision state');
  }
  const before = parseMetadata(raw.before);
  const patch = parsePatch(raw.patch);
  const changes = parseChanges(raw.changes, buildChanges(before, patch));
  const lifecycle = parseLifecycle(raw, status);
  const message =
    raw.message === null ? null : requireBoundedString(raw.message, 'message', 2000);
  return {
    schemaVersion: 1,
    id: requireUuid(raw.id, 'id'),
    relationshipId,
    author: {
      role: 'trainer',
      displayName:
        author.displayName === null
          ? null
          : requireBoundedString(author.displayName, 'author name', 160),
    },
    status,
    proposalType: TRAINER_PROPOSAL_TYPE,
    target: {
      type: 'workout_template',
      id: requireUuid(target.id, 'target id'),
      expectedRevision,
      currentRevision,
      state: target.state,
    },
    before,
    patch,
    changes,
    message,
    createdAt: requireTimestamp(raw.createdAt, 'created at'),
    ...lifecycle,
  };
};

export const parseTrainerProposalsEnvelope = (
  value: unknown,
  expectedRelationshipId: string,
): TrainerProposal[] => {
  const envelope = requireRecord(value, 'list envelope');
  if (!Array.isArray(envelope.proposals)) throw new Error('Invalid trainer proposal list');
  return envelope.proposals.map((proposal) =>
    parseTrainerProposal(proposal, expectedRelationshipId),
  );
};

export const parseTrainerProposalEnvelope = (
  value: unknown,
  expectedRelationshipId: string,
): TrainerProposal => {
  const envelope = requireRecord(value, 'envelope');
  return parseTrainerProposal(envelope.proposal, expectedRelationshipId);
};
