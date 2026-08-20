import type { KnowledgeLocale } from './contracts';
import {
  KNOWLEDGE_LEARNING_MAX_QUIZ_ITEMS,
  KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
  type KnowledgeLearningEvidenceState,
  type KnowledgeLearningState,
  type KnowledgeLearningStateList,
  type KnowledgeLearningStateValue,
  type KnowledgeQuizEvaluationItem,
  type KnowledgeQuizSubmissionResult,
  type KnowledgeRefreshReason,
} from './learningContracts';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LOCALES = new Set<KnowledgeLocale>(['en', 'ru']);
const EVIDENCE_STATES = new Set<KnowledgeLearningEvidenceState>([
  'read',
  'understood',
]);
const STATES = new Set<KnowledgeLearningStateValue>([
  'unseen',
  'read',
  'understood',
  'refresh_useful',
]);
const REFRESH_REASONS = new Set<KnowledgeRefreshReason>([
  'newer_published_version',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (record: Record<string, unknown>, keys: readonly string[]) => {
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
};

const fail = (field: string): never => {
  throw new Error(`Invalid Knowledge learning response: ${field}`);
};

const readUuid = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) return fail(field);
  return value;
};

const readIsoDateTime = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.includes('T') || Number.isNaN(Date.parse(value))) {
    return fail(field);
  }
  return value;
};

const readNullableIsoDateTime = (value: unknown, field: string): string | null =>
  value === null ? null : readIsoDateTime(value, field);

const readEnum = <T extends string>(
  value: unknown,
  field: string,
  allowed: ReadonlySet<T>,
): T => {
  if (typeof value !== 'string' || !allowed.has(value as T)) return fail(field);
  return value as T;
};

const readInteger = (
  value: unknown,
  field: string,
  options: { min: number; max?: number },
): number => {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < options.min ||
    (options.max !== undefined && value > options.max)
  ) {
    return fail(field);
  }
  return value;
};

const readNullablePositiveInteger = (value: unknown, field: string): number | null =>
  value === null ? null : readInteger(value, field, { min: 1 });

const readUuidArray = (value: unknown, field: string): string[] => {
  if (!Array.isArray(value) || value.length > KNOWLEDGE_LEARNING_MAX_QUIZ_ITEMS) {
    return fail(field);
  }
  const ids = value.map((item, index) => readUuid(item, `${field}[${index}]`));
  if (new Set(ids).size !== ids.length) return fail(field);
  return ids;
};

export const parseKnowledgeLearningState = (value: unknown): KnowledgeLearningState => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'schemaVersion',
      'articleId',
      'articleVersionId',
      'locale',
      'version',
      'state',
      'evidenceState',
      'readAt',
      'understoodAt',
      'understoodQuizItemIds',
      'revision',
      'contentAvailable',
      'latestArticleVersionId',
      'latestVersion',
      'refreshReason',
    ]) ||
    value.schemaVersion !== KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION ||
    typeof value.contentAvailable !== 'boolean'
  ) {
    return fail('learningState');
  }

  return {
    schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
    articleId: readUuid(value.articleId, 'articleId'),
    articleVersionId: readUuid(value.articleVersionId, 'articleVersionId'),
    locale: readEnum(value.locale, 'locale', LOCALES),
    version: readInteger(value.version, 'version', { min: 1 }),
    state: readEnum(value.state, 'state', STATES),
    evidenceState:
      value.evidenceState === null
        ? null
        : readEnum(value.evidenceState, 'evidenceState', EVIDENCE_STATES),
    readAt: readNullableIsoDateTime(value.readAt, 'readAt'),
    understoodAt: readNullableIsoDateTime(value.understoodAt, 'understoodAt'),
    understoodQuizItemIds: readUuidArray(
      value.understoodQuizItemIds,
      'understoodQuizItemIds',
    ),
    revision: readInteger(value.revision, 'revision', { min: 0 }),
    contentAvailable: value.contentAvailable,
    latestArticleVersionId:
      value.latestArticleVersionId === null
        ? null
        : readUuid(value.latestArticleVersionId, 'latestArticleVersionId'),
    latestVersion: readNullablePositiveInteger(value.latestVersion, 'latestVersion'),
    refreshReason:
      value.refreshReason === null
        ? null
        : readEnum(value.refreshReason, 'refreshReason', REFRESH_REASONS),
  };
};

export const parseKnowledgeLearningStateList = (
  value: unknown,
): KnowledgeLearningStateList => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['schemaVersion', 'states']) ||
    value.schemaVersion !== KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION ||
    !Array.isArray(value.states) ||
    value.states.length > 500
  ) {
    return fail('learningStateList');
  }
  const states = value.states.map(parseKnowledgeLearningState);
  if (new Set(states.map((state) => state.articleVersionId)).size !== states.length) {
    return fail('learningStateList.states');
  }
  return { schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION, states };
};

const parseEvaluation = (value: unknown): KnowledgeQuizEvaluationItem => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['quizItemId', 'correct', 'feedback']) ||
    typeof value.correct !== 'boolean' ||
    typeof value.feedback !== 'string' ||
    value.feedback.trim().length < 1 ||
    value.feedback.trim().length > 1_000
  ) {
    return fail('quizEvaluation');
  }
  return {
    quizItemId: readUuid(value.quizItemId, 'quizEvaluation.quizItemId'),
    correct: value.correct,
    feedback: value.feedback.trim(),
  };
};

export const parseKnowledgeQuizSubmissionResult = (
  value: unknown,
): KnowledgeQuizSubmissionResult => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'schemaVersion',
      'passed',
      'correctCount',
      'totalCount',
      'evaluations',
      'learningState',
    ]) ||
    value.schemaVersion !== KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION ||
    typeof value.passed !== 'boolean' ||
    !Array.isArray(value.evaluations)
  ) {
    return fail('quizSubmissionResult');
  }

  const totalCount = readInteger(value.totalCount, 'totalCount', {
    min: 1,
    max: KNOWLEDGE_LEARNING_MAX_QUIZ_ITEMS,
  });
  const correctCount = readInteger(value.correctCount, 'correctCount', {
    min: 0,
    max: totalCount,
  });
  if (value.evaluations.length !== totalCount) return fail('evaluations');
  const evaluations = value.evaluations.map(parseEvaluation);
  if (new Set(evaluations.map((item) => item.quizItemId)).size !== evaluations.length) {
    return fail('evaluations.quizItemId');
  }

  return {
    schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
    passed: value.passed,
    correctCount,
    totalCount,
    evaluations,
    learningState: parseKnowledgeLearningState(value.learningState),
  };
};
