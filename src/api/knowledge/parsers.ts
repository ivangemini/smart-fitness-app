import {
  KNOWLEDGE_SCHEMA_VERSION,
  type KnowledgeArticleFormat,
  type KnowledgeCategory,
  type KnowledgeEvidenceStrength,
  type KnowledgeLocale,
  type KnowledgeQuizQuestionType,
  type KnowledgeRiskTier,
  type KnowledgeSourceType,
  type PublishedKnowledgeArticle,
  type PublishedKnowledgeArticleList,
  type PublishedKnowledgeArticleSummary,
  type PublishedKnowledgeClaim,
  type PublishedKnowledgeQuizItem,
  type PublishedKnowledgeQuizOption,
  type PublishedKnowledgeSource,
} from './contracts';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONCEPT_PATTERN = /^[a-z0-9_]+$/;

const LOCALES = new Set<KnowledgeLocale>(['en', 'ru']);
const CATEGORIES = new Set<KnowledgeCategory>([
  'training',
  'nutrition',
  'physiology',
  'recovery',
  'body_composition',
  'labs',
]);
const FORMATS = new Set<KnowledgeArticleFormat>([
  'quick_lesson',
  'standard',
  'deep_dive',
  'practical_guide',
  'reference',
]);
const RISK_TIERS = new Set<KnowledgeRiskTier>(['tier_1', 'tier_2', 'tier_3']);
const EVIDENCE_STRENGTHS = new Set<KnowledgeEvidenceStrength>([
  'limited',
  'moderate',
  'strong',
]);
const SOURCE_TYPES = new Set<KnowledgeSourceType>([
  'systematic_review',
  'meta_analysis',
  'position_statement',
  'guideline',
  'randomized_trial',
  'observational_study',
  'narrative_review',
  'other',
]);
const QUESTION_TYPES = new Set<KnowledgeQuizQuestionType>([
  'recall',
  'understanding',
  'application',
  'misconception',
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

const fail = (field: string): never => {
  throw new Error(`Invalid Knowledge response: ${field}`);
};

const readString = (
  value: unknown,
  field: string,
  options: { min?: number; max: number; pattern?: RegExp },
): string => {
  if (typeof value !== 'string') return fail(field);
  const normalized = value.trim();
  if (
    normalized.length < (options.min ?? 1) ||
    normalized.length > options.max ||
    (options.pattern && !options.pattern.test(normalized))
  ) {
    return fail(field);
  }
  return normalized;
};

const readUuid = (value: unknown, field: string): string =>
  readString(value, field, { max: 36, pattern: UUID_PATTERN });

const readIsoDateTime = (value: unknown, field: string): string => {
  const result = readString(value, field, { max: 64 });
  if (!result.includes('T') || Number.isNaN(Date.parse(result))) return fail(field);
  return result;
};

const readNullableIsoDateTime = (value: unknown, field: string): string | null =>
  value === null ? null : readIsoDateTime(value, field);

const readNullableString = (
  value: unknown,
  field: string,
  max: number,
): string | null => (value === null ? null : readString(value, field, { max }));

const readNullableUrl = (value: unknown, field: string): string | null => {
  if (value === null) return null;
  const result = readString(value, field, { max: 2_000 });
  try {
    new URL(result);
  } catch {
    return fail(field);
  }
  return result;
};

const readEnum = <T extends string>(
  value: unknown,
  field: string,
  allowed: ReadonlySet<T>,
): T => {
  if (typeof value !== 'string' || !allowed.has(value as T)) return fail(field);
  return value as T;
};

const readStringArray = (
  value: unknown,
  field: string,
  options: { min: number; max: number; maxItemLength: number; pattern?: RegExp },
): string[] => {
  if (!Array.isArray(value) || value.length < options.min || value.length > options.max) {
    return fail(field);
  }
  const result = value.map((item, index) =>
    readString(item, `${field}[${index}]`, {
      max: options.maxItemLength,
      pattern: options.pattern,
    }),
  );
  if (new Set(result).size !== result.length) return fail(field);
  return result;
};

const readPositiveInteger = (value: unknown, field: string): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return fail(field);
  }
  return value;
};

export const parsePublishedKnowledgeArticleSummary = (
  value: unknown,
): PublishedKnowledgeArticleSummary => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'schemaVersion',
      'articleId',
      'articleVersionId',
      'slug',
      'locale',
      'version',
      'primaryConceptId',
      'conceptIds',
      'category',
      'format',
      'riskTier',
      'title',
      'summary',
      'publishedAt',
    ]) ||
    value.schemaVersion !== KNOWLEDGE_SCHEMA_VERSION
  ) {
    return fail('articleSummary');
  }

  return {
    schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
    articleId: readUuid(value.articleId, 'articleId'),
    articleVersionId: readUuid(value.articleVersionId, 'articleVersionId'),
    slug: readString(value.slug, 'slug', { max: 120, pattern: SLUG_PATTERN }),
    locale: readEnum(value.locale, 'locale', LOCALES),
    version: readPositiveInteger(value.version, 'version'),
    primaryConceptId: readString(value.primaryConceptId, 'primaryConceptId', {
      max: 80,
      pattern: CONCEPT_PATTERN,
    }),
    conceptIds: readStringArray(value.conceptIds, 'conceptIds', {
      min: 1,
      max: 24,
      maxItemLength: 80,
      pattern: CONCEPT_PATTERN,
    }),
    category: readEnum(value.category, 'category', CATEGORIES),
    format: readEnum(value.format, 'format', FORMATS),
    riskTier: readEnum(value.riskTier, 'riskTier', RISK_TIERS),
    title: readString(value.title, 'title', { max: 240 }),
    summary: readString(value.summary, 'summary', { max: 800 }),
    publishedAt: readIsoDateTime(value.publishedAt, 'publishedAt'),
  };
};

const parseSource = (value: unknown): PublishedKnowledgeSource => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'id',
      'sourceType',
      'title',
      'publisher',
      'publishedAt',
      'url',
      'doi',
    ])
  ) {
    return fail('source');
  }
  const url = readNullableUrl(value.url, 'source.url');
  const doi = readNullableString(value.doi, 'source.doi', 200);
  if (url === null && doi === null) return fail('source.locator');

  return {
    id: readUuid(value.id, 'source.id'),
    sourceType: readEnum(value.sourceType, 'source.sourceType', SOURCE_TYPES),
    title: readString(value.title, 'source.title', { max: 500 }),
    publisher: readString(value.publisher, 'source.publisher', { max: 240 }),
    publishedAt: readNullableIsoDateTime(value.publishedAt, 'source.publishedAt'),
    url,
    doi,
  };
};

const parseClaim = (value: unknown): PublishedKnowledgeClaim => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['id', 'text', 'evidenceStrength', 'sources']) ||
    !Array.isArray(value.sources) ||
    value.sources.length < 1 ||
    value.sources.length > 24
  ) {
    return fail('claim');
  }
  const sources = value.sources.map(parseSource);
  if (new Set(sources.map((source) => source.id)).size !== sources.length) {
    return fail('claim.sources');
  }
  return {
    id: readUuid(value.id, 'claim.id'),
    text: readString(value.text, 'claim.text', { max: 1_200 }),
    evidenceStrength: readEnum(
      value.evidenceStrength,
      'claim.evidenceStrength',
      EVIDENCE_STRENGTHS,
    ),
    sources,
  };
};

const parseQuizOption = (value: unknown): PublishedKnowledgeQuizOption => {
  if (!isRecord(value) || !hasExactKeys(value, ['id', 'label'])) {
    return fail('quizOption');
  }
  return {
    id: readString(value.id, 'quizOption.id', { max: 16 }),
    label: readString(value.label, 'quizOption.label', { max: 500 }),
  };
};

const parseQuizItem = (value: unknown): PublishedKnowledgeQuizItem => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['id', 'conceptIds', 'questionType', 'question', 'options']) ||
    !Array.isArray(value.options) ||
    value.options.length !== 4
  ) {
    return fail('quizItem');
  }
  const options = value.options.map(parseQuizOption);
  if (new Set(options.map((option) => option.id)).size !== options.length) {
    return fail('quizItem.options');
  }
  return {
    id: readUuid(value.id, 'quizItem.id'),
    conceptIds: readStringArray(value.conceptIds, 'quizItem.conceptIds', {
      min: 1,
      max: 8,
      maxItemLength: 80,
      pattern: CONCEPT_PATTERN,
    }),
    questionType: readEnum(
      value.questionType,
      'quizItem.questionType',
      QUESTION_TYPES,
    ),
    question: readString(value.question, 'quizItem.question', { max: 1_000 }),
    options,
  };
};

export const parsePublishedKnowledgeArticle = (
  value: unknown,
): PublishedKnowledgeArticle => {
  if (!isRecord(value)) return fail('article');
  const summaryKeys = [
    'schemaVersion',
    'articleId',
    'articleVersionId',
    'slug',
    'locale',
    'version',
    'primaryConceptId',
    'conceptIds',
    'category',
    'format',
    'riskTier',
    'title',
    'summary',
    'publishedAt',
  ] as const;
  if (!hasExactKeys(value, [...summaryKeys, 'bodyMarkdown', 'claims', 'quizItems'])) {
    return fail('article');
  }
  const summary = parsePublishedKnowledgeArticleSummary(
    Object.fromEntries(summaryKeys.map((key) => [key, value[key]])),
  );
  if (
    !Array.isArray(value.claims) ||
    value.claims.length < 1 ||
    value.claims.length > 80 ||
    !Array.isArray(value.quizItems) ||
    value.quizItems.length < 1 ||
    value.quizItems.length > 80
  ) {
    return fail('article.collections');
  }
  const claims = value.claims.map(parseClaim);
  const quizItems = value.quizItems.map(parseQuizItem);
  if (new Set(claims.map((claim) => claim.id)).size !== claims.length) {
    return fail('article.claims');
  }
  if (new Set(quizItems.map((item) => item.id)).size !== quizItems.length) {
    return fail('article.quizItems');
  }

  return {
    ...summary,
    bodyMarkdown: readString(value.bodyMarkdown, 'bodyMarkdown', { max: 80_000 }),
    claims,
    quizItems,
  };
};

export const parsePublishedKnowledgeArticleList = (
  value: unknown,
): PublishedKnowledgeArticleList => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['articles']) ||
    !Array.isArray(value.articles) ||
    value.articles.length > 200
  ) {
    return fail('articleList');
  }
  const articles = value.articles.map(parsePublishedKnowledgeArticleSummary);
  if (new Set(articles.map((article) => article.articleId)).size !== articles.length) {
    return fail('articleList.articles');
  }
  return { articles };
};
