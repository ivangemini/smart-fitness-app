import {
  KNOWLEDGE_PATH_SCHEMA_VERSION,
  type PublishedKnowledgePath,
  type PublishedKnowledgePathList,
  type PublishedKnowledgePathSummary,
  type PublishedKnowledgePathStep,
} from './pathContracts';
import { parsePublishedKnowledgeArticleSummary } from './parsers';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasExactKeys = (
  record: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
};

const fail = (field: string): never => {
  throw new Error(`Invalid Knowledge path response: ${field}`);
};

const readString = (
  value: unknown,
  field: string,
  max: number,
  pattern?: RegExp,
): string => {
  if (typeof value !== 'string') return fail(field);
  const normalized = value.trim();
  if (
    normalized.length < 1 ||
    normalized.length > max ||
    (pattern && !pattern.test(normalized))
  ) {
    return fail(field);
  }
  return normalized;
};

const readUuid = (value: unknown, field: string): string =>
  readString(value, field, 36, UUID_PATTERN);

const readInteger = (
  value: unknown,
  field: string,
  min: number,
  max: number,
): number => {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    return fail(field);
  }
  return value;
};

const readDateTime = (value: unknown, field: string): string => {
  const result = readString(value, field, 64);
  if (!result.includes('T') || Number.isNaN(Date.parse(result))) return fail(field);
  return result;
};

export const parsePublishedKnowledgePathSummary = (
  value: unknown,
): PublishedKnowledgePathSummary => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'schemaVersion',
      'pathId',
      'pathVersionId',
      'slug',
      'locale',
      'version',
      'title',
      'summary',
      'publishedAt',
      'stepCount',
    ]) ||
    value.schemaVersion !== KNOWLEDGE_PATH_SCHEMA_VERSION ||
    (value.locale !== 'en' && value.locale !== 'ru')
  ) {
    return fail('pathSummary');
  }

  return {
    schemaVersion: KNOWLEDGE_PATH_SCHEMA_VERSION,
    pathId: readUuid(value.pathId, 'pathId'),
    pathVersionId: readUuid(value.pathVersionId, 'pathVersionId'),
    slug: readString(value.slug, 'slug', 120, SLUG_PATTERN),
    locale: value.locale,
    version: readInteger(value.version, 'version', 1, Number.MAX_SAFE_INTEGER),
    title: readString(value.title, 'title', 240),
    summary: readString(value.summary, 'summary', 800),
    publishedAt: readDateTime(value.publishedAt, 'publishedAt'),
    stepCount: readInteger(value.stepCount, 'stepCount', 1, 64),
  };
};

const parseStep = (
  value: unknown,
  path: PublishedKnowledgePathSummary,
): PublishedKnowledgePathStep => {
  if (!isRecord(value) || !hasExactKeys(value, ['position', 'article'])) {
    return fail('step');
  }
  const article = parsePublishedKnowledgeArticleSummary(value.article);
  if (article.locale !== path.locale) return fail('step.article.locale');
  return {
    position: readInteger(value.position, 'step.position', 1, 64),
    article,
  };
};

export const parsePublishedKnowledgePath = (
  value: unknown,
): PublishedKnowledgePath => {
  if (!isRecord(value)) return fail('path');
  const summaryKeys = [
    'schemaVersion',
    'pathId',
    'pathVersionId',
    'slug',
    'locale',
    'version',
    'title',
    'summary',
    'publishedAt',
    'stepCount',
  ] as const;
  if (!hasExactKeys(value, [...summaryKeys, 'steps']) || !Array.isArray(value.steps)) {
    return fail('path');
  }
  const summary = parsePublishedKnowledgePathSummary(
    Object.fromEntries(summaryKeys.map((key) => [key, value[key]])),
  );
  if (value.steps.length !== summary.stepCount) return fail('path.stepCount');
  const steps = value.steps.map((step) => parseStep(step, summary));
  if (steps.some((step, index) => step.position !== index + 1)) {
    return fail('path.positions');
  }
  const versionIds = steps.map((step) => step.article.articleVersionId);
  if (new Set(versionIds).size !== versionIds.length) {
    return fail('path.articleVersions');
  }
  return { ...summary, steps };
};

export const parsePublishedKnowledgePathList = (
  value: unknown,
): PublishedKnowledgePathList => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['schemaVersion', 'paths']) ||
    value.schemaVersion !== KNOWLEDGE_PATH_SCHEMA_VERSION ||
    !Array.isArray(value.paths) ||
    value.paths.length > 100
  ) {
    return fail('pathList');
  }
  const paths = value.paths.map(parsePublishedKnowledgePathSummary);
  if (new Set(paths.map((path) => path.pathId)).size !== paths.length) {
    return fail('pathList.paths');
  }
  return { schemaVersion: KNOWLEDGE_PATH_SCHEMA_VERSION, paths };
};
