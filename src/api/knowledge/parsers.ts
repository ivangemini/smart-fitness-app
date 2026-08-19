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
const LOCALES = new Set<KnowledgeLocale>(['en', 'ru']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONCEPT_PATTERN = /^[a-z0-9_]+$/;

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

const readString = (
  value: unknown,
  field: string,
  maxLength: number,
): string => {
  if (
    typeof value !== 'string' ||
    value.trim().length === 0 ||
    value.length > maxLength
  ) {
    throw new Error(`Invalid Knowledge response: ${field}`);
  }
  return value.trim();
};

const readUuid = (value: unknown, field: string): string => {
  const text = readString(value, field, 64);
  if (!UUID_PATTERN.test(text)) {
    throw new Error(`Invalid Knowledge response: ${field}`);
  }
  return text;
};

const readDateTime = (value: unknown, field: string): string => {
  const text = readString(value, field, 64);
  if (!Number.isFinite(Date.parse(text))) {
    throw new Error(`Invalid Knowledge response: ${field}`);
  }
  return text;
};

const readNullableString = (
  value: unknown,
  field: string,
  maxLength: number,
): string | null => {
  if (value === null) return null;
  return readString(value, field, maxLength);
};

const readStringArray = (
  value: unknown,
  field: string,
  options: { min: number; max: number; maxItemLength: number; pattern?: RegExp },
): string[] => {
  if (
    !Array.isArray(value) ||
    value.length < options.min ||
    value.length > options.max
  ) {
    throw new Error(`Invalid Knowledge response: ${field}`);
  }
  const values = value.map((item) =>
    readString(item, field, options.maxItemLength),
  );
  if (
    new Set(values).size !== values.length ||
    (options.pattern && values.some((item) => !options.pattern!.test(item)))
  ) {
    throw new Error(`Invalid Knowledge response: ${field}`);
  }
  return values;
};

const parseSummary = (value: unknown): PublishedKnowledgeArticleSummary => {
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
    value.schemaVersion !== KNOWLEDGE_SCHEMA_VERSION ||
    typeof value.locale !== 'string' ||
    !LOCALES.has(value.locale as KnowledgeLocale) ||
    typeof value.category !== 'string' ||
    !CATEGORIES.has(value.category as KnowledgeCategory) ||
    typeof value.format !== 'string' ||
    !FORMATS.has(value.format as KnowledgeArticleFormat) ||
    typeof value.riskTier !== 'string' ||
    !RISK_TIERS.has(value.riskTier as KnowledgeRiskTier) ||
    typeof value.version !== 'number' ||
    !Number.isInteger(value.version) ||
    value.version < 1
  ) {
    throw new Error('Invalid Knowledge article summary');
  }

  const slug = readString(value.slug, 'slug', 120);
  const primaryConceptId = readString(
    value.primaryConceptId,
    'primaryConceptId',
    80,
  );
  const conceptIds = readStringArray(value.conceptIds, 'conceptIds', {
    min: 1,
    max: 24,
    maxItemLength: 80,
    pattern: CONCEPT_PATTERN,
  });
  if (!SLUG_PATTERN.test(slug) || !CONCEPT_PATTERN.test(primaryConceptId)) {
    throw new Error('Invalid Knowledge article identity');
  }

  return {
    schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
    articleId: readUuid(value.articleId, 'articleId'),
    articleVersionId: readUuid(value.articleVersionId, 'articleVersionId'),
    slug,
    locale: value.locale as KnowledgeLocale,
    version: value.version,
    primaryConceptId,
    conceptIds,
    category: value.category as KnowledgeCategory,
    format: value.format as KnowledgeArticleFormat,
    riskTier: value.riskTier as KnowledgeRiskTier,
    title: readString(value.title, 'title', 240),
    summary: readString(value.summary, 'summary', 800),
    publishedAt: readDateTime(value.publishedAt, 'publishedAt'),
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
    ]) ||
    typeof value.sourceType !== 'string' ||
    !SOURCE_TYPES.has(value.sourceType as KnowledgeSourceType)
  ) {
    throw new Error('Invalid Knowledge source');
  }
  const publishedAt =
    value.publishedAt === null
      ? null
      : readDateTime(value.publishedAt, 'source.publishedAt');
  const url = readNullableString(value.url, 'source.url', 2_000);
  if (url !== null && !/^https?:\/\//i.test(url)) {
    throw new Error('Invalid Knowledge source URL');
  }
  const doi = readNullableString(value.doi, 'source.doi', 200);
  if (!url && !doi) throw new Error('Invalid Knowledge source locator');

  return {
    id: readUuid(value.id, 'source.id'),
    sourceType: value.sourceType as KnowledgeSourceType,
    title: readString(value.title, 'source.title', 500),
    publisher: readString(value.publisher, 'source.publisher', 240),
    publishedAt,
    url,
    doi,
  };
};

const parseClaim = (value: unknown): PublishedKnowledgeClaim => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['id', 'text', 'evidenceStrength', 'sources']) ||
    typeof value.evidenceStrength !== 'string' ||
    !EVIDENCE_STRENGTHS.has(value.evidenceStrength as KnowledgeEvidenceStrength) ||
    !Array.isArray(value.sources) ||
    value.sources.length < 1 ||
    value.sources.length > 24
  ) {
    throw new Error('Invalid Knowledge claim');
  }
  return {
    id: readUuid(value.id, 'claim.id'),
    text: readString(value.text, 'claim.text', 1_200),
    evidenceStrength: value.evidenceStrength as KnowledgeEvidenceStrength,
    sources: value.sources.map(parseSource),
  };
};

const parseQuizOption = (value: unknown): PublishedKnowledgeQuizOption => {
  if (!isRecord(value) || !hasExactKeys(value, ['id', 'label'])) {
    throw new Error('Invalid Knowledge quiz option');
  }
  return {
    id: readString(value.id, 'quiz.option.id', 16),
    label: readString(value.label, 'quiz.option.label', 500),
  };
};

const parseQuizItem = (value: unknown): PublishedKnowledgeQuizItem => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['id', 'conceptIds', 'questionType', 'question', 'options']) ||
    typeof value.questionType !== 'string' ||
    !QUESTION_TYPES.has(value.questionType as KnowledgeQuizQuestionType) ||
    !Array.isArray(value.options) ||
    value.options.length !== 4
  ) {
    throw new Error('Invalid Knowledge quiz item');
  }
  const options = value.options.map(parseQuizOption);
  if (new Set(options.map((option) => option.id)).size !== options.length) {
    throw new Error('Invalid Knowledge quiz option identities');
  }
  return {
    id: readUuid(value.id, 'quiz.id'),
    conceptIds: readStringArray(value.conceptIds, 'quiz.conceptIds', {
      min: 1,
      max: 8,
      maxItemLength: 80,
      pattern: CONCEPT_PATTERN,
    }),
    questionType: value.questionType as KnowledgeQuizQuestionType,
    question: readString(value.question, 'quiz.question', 1_000),
    options,
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
    throw new Error('Invalid Knowledge article list');
  }
  return { articles: value.articles.map(parseSummary) };
};

export const parsePublishedKnowledgeArticle = (
  value: unknown,
): PublishedKnowledgeArticle => {
  if (!isRecord(value)) throw new Error('Invalid Knowledge article');
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
  if (
    !hasExactKeys(value, [...summaryKeys, 'bodyMarkdown', 'claims', 'quizItems']) ||
    !Array.isArray(value.claims) ||
    value.claims.length < 1 ||
    value.claims.length > 80 ||
    !Array.isArray(value.quizItems) ||
    value.quizItems.length < 1 ||
    value.quizItems.length > 80
  ) {
    throw new Error('Invalid Knowledge article detail');
  }
  const summary = parseSummary(
    Object.fromEntries(summaryKeys.map((key) => [key, value[key]])),
  );
  return {
    ...summary,
    bodyMarkdown: readString(value.bodyMarkdown, 'bodyMarkdown', 80_000),
    claims: value.claims.map(parseClaim),
    quizItems: value.quizItems.map(parseQuizItem),
  };
};
