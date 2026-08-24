export const TRAINER_COLLABORATION_SCHEMA_VERSION = 1 as const;

export const TRAINER_READ_SCOPES = [
  'workout_history_summary',
  'workout_templates',
  'training_programs',
  'progress_summary',
  'recovery_summary',
] as const;

export type TrainerReadScope = (typeof TRAINER_READ_SCOPES)[number];
export type TrainerRelationshipStatus = 'invited' | 'active' | 'revoked';

export type TrainerRelationshipParticipant = {
  userId: string;
  displayName: string | null;
};

export type TrainerRelationship = {
  schemaVersion: typeof TRAINER_COLLABORATION_SCHEMA_VERSION;
  id: string;
  client: TrainerRelationshipParticipant;
  trainer: TrainerRelationshipParticipant;
  status: TrainerRelationshipStatus;
  scopes: TrainerReadScope[];
  createdAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
};

export type TrainerRelationshipRole = 'client' | 'trainer';

export type TrainerRelationshipView = TrainerRelationship & {
  role: TrainerRelationshipRole;
  counterpart: TrainerRelationshipParticipant;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const scopeSet = new Set<string>(TRAINER_READ_SCOPES);
const statusSet = new Set<string>(['invited', 'active', 'revoked']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIsoTimestamp = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));

const parseNullableTimestamp = (value: unknown): string | null => {
  if (value === null) return null;
  if (!isIsoTimestamp(value)) throw new Error('Invalid trainer relationship timestamp');
  return value;
};

const parseParticipant = (value: unknown): TrainerRelationshipParticipant => {
  if (!isRecord(value) || !isUuid(value.userId)) {
    throw new Error('Invalid trainer relationship participant');
  }
  if (value.displayName !== null && typeof value.displayName !== 'string') {
    throw new Error('Invalid trainer relationship display name');
  }
  return {
    userId: value.userId,
    displayName: value.displayName,
  };
};

const parseScopes = (value: unknown): TrainerReadScope[] => {
  if (!Array.isArray(value) || value.length === 0 || value.length > TRAINER_READ_SCOPES.length) {
    throw new Error('Invalid trainer relationship scopes');
  }
  const unique = new Set<string>();
  for (const scope of value) {
    if (typeof scope !== 'string' || !scopeSet.has(scope) || unique.has(scope)) {
      throw new Error('Invalid trainer relationship scope');
    }
    unique.add(scope);
  }
  return TRAINER_READ_SCOPES.filter((scope) => unique.has(scope));
};

export const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_PATTERN.test(value.trim());

export const parseTrainerRelationship = (value: unknown): TrainerRelationship => {
  if (!isRecord(value)) throw new Error('Invalid trainer relationship response');
  if (value.schemaVersion !== TRAINER_COLLABORATION_SCHEMA_VERSION) {
    throw new Error('Unsupported trainer relationship schema');
  }
  if (!isUuid(value.id) || !statusSet.has(String(value.status))) {
    throw new Error('Invalid trainer relationship identity');
  }
  if (!isIsoTimestamp(value.createdAt)) {
    throw new Error('Invalid trainer relationship createdAt');
  }

  return {
    schemaVersion: TRAINER_COLLABORATION_SCHEMA_VERSION,
    id: value.id,
    client: parseParticipant(value.client),
    trainer: parseParticipant(value.trainer),
    status: value.status as TrainerRelationshipStatus,
    scopes: parseScopes(value.scopes),
    createdAt: value.createdAt,
    acceptedAt: parseNullableTimestamp(value.acceptedAt),
    revokedAt: parseNullableTimestamp(value.revokedAt),
  };
};

export const parseTrainerRelationshipsEnvelope = (value: unknown): TrainerRelationship[] => {
  if (!isRecord(value) || !Array.isArray(value.relationships)) {
    throw new Error('Invalid trainer relationships response');
  }
  return value.relationships.map(parseTrainerRelationship);
};

export const parseTrainerRelationshipEnvelope = (value: unknown): TrainerRelationship => {
  if (!isRecord(value)) throw new Error('Invalid trainer relationship response');
  return parseTrainerRelationship(value.relationship);
};

export const toTrainerRelationshipView = (
  relationship: TrainerRelationship,
  currentUserId: string,
): TrainerRelationshipView | null => {
  if (relationship.client.userId === currentUserId) {
    return { ...relationship, role: 'client', counterpart: relationship.trainer };
  }
  if (relationship.trainer.userId === currentUserId) {
    return { ...relationship, role: 'trainer', counterpart: relationship.client };
  }
  return null;
};

export const toggleTrainerScope = (
  scopes: readonly TrainerReadScope[],
  scope: TrainerReadScope,
): TrainerReadScope[] => {
  const next = new Set(scopes);
  if (next.has(scope)) next.delete(scope);
  else next.add(scope);
  return TRAINER_READ_SCOPES.filter((candidate) => next.has(candidate));
};
