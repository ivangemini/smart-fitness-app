export const COACH_QUESTION_MAX_LENGTH = 600;
export const COACH_QUESTION_RESPONSE_SCHEMA_VERSION = 1 as const;
export const COACH_QUESTION_ANSWER_SCHEMA_VERSION =
  'coach-question-answer-v3' as const;

export type CoachQuestionScope =
  | 'strength'
  | 'nutrition'
  | 'safety_recovery'
  | 'labs'
  | 'goal';

export type CoachQuestionIntent =
  | 'strength_progress'
  | 'strength_recent_records'
  | 'nutrition_pattern'
  | 'recovery_readiness'
  | 'nutrition_recovery'
  | 'labs_overview'
  | 'labs_marker_history'
  | 'goal_progress'
  | 'cross_domain_review';

export type CoachQuestionCaveatCode =
  | 'limited_history'
  | 'exercise_not_resolved'
  | 'rpe_data_incomplete'
  | 'nutrition_logging_incomplete'
  | 'recovery_checkins_limited'
  | 'weight_data_limited'
  | 'labs_history_limited'
  | 'labs_reference_context_limited'
  | 'association_not_causation'
  | 'active_limitation_present';

export type CoachQuestionUnsupportedReason =
  | 'labs_context_not_available'
  | 'body_metrics_context_not_available'
  | 'outside_coach_scope'
  | 'insufficient_question_detail';

export type CoachQuestionAnswer = {
  schemaVersion: typeof COACH_QUESTION_ANSWER_SCHEMA_VERSION;
  answer: string;
  evidenceScopes: CoachQuestionScope[];
  evidenceSummary: string[];
  caveatCodes: CoachQuestionCaveatCode[];
  dataQuality: 'sufficient' | 'limited';
  confidence: number;
};

export type CoachQuestionResponse =
  | {
      schemaVersion: typeof COACH_QUESTION_RESPONSE_SCHEMA_VERSION;
      status: 'answered';
      intent: CoachQuestionIntent;
      scopes: CoachQuestionScope[];
      answer: CoachQuestionAnswer;
    }
  | {
      schemaVersion: typeof COACH_QUESTION_RESPONSE_SCHEMA_VERSION;
      status: 'unsupported';
      reason: CoachQuestionUnsupportedReason;
    };

const SCOPES = new Set<CoachQuestionScope>([
  'strength',
  'nutrition',
  'safety_recovery',
  'labs',
  'goal',
]);
const INTENTS = new Set<CoachQuestionIntent>([
  'strength_progress',
  'strength_recent_records',
  'nutrition_pattern',
  'recovery_readiness',
  'nutrition_recovery',
  'labs_overview',
  'labs_marker_history',
  'goal_progress',
  'cross_domain_review',
]);
const CAVEAT_CODES = new Set<CoachQuestionCaveatCode>([
  'limited_history',
  'exercise_not_resolved',
  'rpe_data_incomplete',
  'nutrition_logging_incomplete',
  'recovery_checkins_limited',
  'weight_data_limited',
  'labs_history_limited',
  'labs_reference_context_limited',
  'association_not_causation',
  'active_limitation_present',
]);
const UNSUPPORTED_REASONS = new Set<CoachQuestionUnsupportedReason>([
  'labs_context_not_available',
  'body_metrics_context_not_available',
  'outside_coach_scope',
  'insufficient_question_detail',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (record: Record<string, unknown>, keys: readonly string[]) => {
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
};

const readStringArray = (
  value: unknown,
  field: string,
  options: { min: number; max: number; maxItemLength: number },
) => {
  if (
    !Array.isArray(value) ||
    value.length < options.min ||
    value.length > options.max ||
    value.some(
      (item) =>
        typeof item !== 'string' ||
        item.trim().length === 0 ||
        item.length > options.maxItemLength,
    )
  ) {
    throw new Error(`Invalid Coach question response: ${field}`);
  }
  return value as string[];
};

const parseScopes = (value: unknown, min: number): CoachQuestionScope[] => {
  const values = readStringArray(value, 'scopes', {
    min,
    max: 5,
    maxItemLength: 32,
  });
  if (
    values.some((scope) => !SCOPES.has(scope as CoachQuestionScope)) ||
    new Set(values).size !== values.length
  ) {
    throw new Error('Invalid Coach question response: scopes');
  }
  return values as CoachQuestionScope[];
};

const parseAnswer = (value: unknown): CoachQuestionAnswer => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'schemaVersion',
      'answer',
      'evidenceScopes',
      'evidenceSummary',
      'caveatCodes',
      'dataQuality',
      'confidence',
    ]) ||
    value.schemaVersion !== COACH_QUESTION_ANSWER_SCHEMA_VERSION ||
    typeof value.answer !== 'string' ||
    value.answer.trim().length === 0 ||
    value.answer.length > 1_200 ||
    (value.dataQuality !== 'sufficient' && value.dataQuality !== 'limited') ||
    typeof value.confidence !== 'number' ||
    !Number.isFinite(value.confidence) ||
    value.confidence < 0 ||
    value.confidence > 1
  ) {
    throw new Error('Invalid Coach question response: answer');
  }
  const evidenceScopes = parseScopes(value.evidenceScopes, 1);
  const evidenceSummary = readStringArray(value.evidenceSummary, 'evidenceSummary', {
    min: 1,
    max: 6,
    maxItemLength: 240,
  });
  const caveatCodes = readStringArray(value.caveatCodes, 'caveatCodes', {
    min: 0,
    max: 8,
    maxItemLength: 64,
  });
  if (caveatCodes.some((code) => !CAVEAT_CODES.has(code as CoachQuestionCaveatCode))) {
    throw new Error('Invalid Coach question response: caveatCodes');
  }
  return {
    schemaVersion: COACH_QUESTION_ANSWER_SCHEMA_VERSION,
    answer: value.answer.trim(),
    evidenceScopes,
    evidenceSummary,
    caveatCodes: caveatCodes as CoachQuestionCaveatCode[],
    dataQuality: value.dataQuality,
    confidence: value.confidence,
  };
};

export const parseCoachQuestionResponse = (value: unknown): CoachQuestionResponse => {
  if (!isRecord(value) || value.schemaVersion !== COACH_QUESTION_RESPONSE_SCHEMA_VERSION) {
    throw new Error('Invalid Coach question response');
  }
  if (value.status === 'unsupported') {
    if (
      !hasExactKeys(value, ['schemaVersion', 'status', 'reason']) ||
      typeof value.reason !== 'string' ||
      !UNSUPPORTED_REASONS.has(value.reason as CoachQuestionUnsupportedReason)
    ) {
      throw new Error('Invalid Coach question unsupported response');
    }
    return {
      schemaVersion: COACH_QUESTION_RESPONSE_SCHEMA_VERSION,
      status: 'unsupported',
      reason: value.reason as CoachQuestionUnsupportedReason,
    };
  }
  if (
    value.status !== 'answered' ||
    !hasExactKeys(value, ['schemaVersion', 'status', 'intent', 'scopes', 'answer']) ||
    typeof value.intent !== 'string' ||
    !INTENTS.has(value.intent as CoachQuestionIntent)
  ) {
    throw new Error('Invalid Coach question answered response');
  }
  const scopes = parseScopes(value.scopes, 1);
  const answer = parseAnswer(value.answer);
  if (
    answer.evidenceScopes.some((scope) => !scopes.includes(scope)) ||
    (value.intent === 'goal_progress' &&
      (scopes.length !== 1 || scopes[0] !== 'goal'))
  ) {
    throw new Error('Invalid Coach question evidence scope');
  }
  return {
    schemaVersion: COACH_QUESTION_RESPONSE_SCHEMA_VERSION,
    status: 'answered',
    intent: value.intent as CoachQuestionIntent,
    scopes,
    answer,
  };
};
