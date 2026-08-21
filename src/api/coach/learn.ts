import type { PublishedKnowledgeArticleSummary } from '../knowledge/contracts';
import { parsePublishedKnowledgeArticleSummary } from '../knowledge/parsers';

export const COACH_LEARN_SCHEMA_VERSION = 'knowledge-recommendation-v1' as const;

const FINDING_CODE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

export type CoachLearnRecommendation = {
  schemaVersion: typeof COACH_LEARN_SCHEMA_VERSION;
  article: PublishedKnowledgeArticleSummary;
  reasonFindingCodes: string[];
};

export type CoachLearnSelection = {
  schemaVersion: typeof COACH_LEARN_SCHEMA_VERSION;
  recommendations: CoachLearnRecommendation[];
};

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
  throw new Error(`Invalid Coach Learn response: ${field}`);
};

const parseReasonFindingCodes = (value: unknown): string[] => {
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) {
    return fail('reasonFindingCodes');
  }
  const result = value.map((item, index) => {
    if (
      typeof item !== 'string' ||
      item.length < 1 ||
      item.length > 80 ||
      item.trim() !== item ||
      !FINDING_CODE_PATTERN.test(item)
    ) {
      return fail(`reasonFindingCodes[${index}]`);
    }
    return item;
  });
  if (new Set(result).size !== result.length) {
    return fail('reasonFindingCodes');
  }
  return result;
};

const parseRecommendation = (value: unknown): CoachLearnRecommendation => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['schemaVersion', 'article', 'reasonFindingCodes']) ||
    value.schemaVersion !== COACH_LEARN_SCHEMA_VERSION
  ) {
    return fail('recommendation');
  }
  return {
    schemaVersion: COACH_LEARN_SCHEMA_VERSION,
    article: parsePublishedKnowledgeArticleSummary(value.article),
    reasonFindingCodes: parseReasonFindingCodes(value.reasonFindingCodes),
  };
};

export const parseCoachLearnSelection = (value: unknown): CoachLearnSelection => {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['schemaVersion', 'recommendations']) ||
    value.schemaVersion !== COACH_LEARN_SCHEMA_VERSION ||
    !Array.isArray(value.recommendations) ||
    value.recommendations.length > 10
  ) {
    return fail('selection');
  }

  const recommendations = value.recommendations.map(parseRecommendation);
  const articleVersionIds = recommendations.map(
    (recommendation) => recommendation.article.articleVersionId,
  );
  if (new Set(articleVersionIds).size !== articleVersionIds.length) {
    return fail('recommendations');
  }

  return {
    schemaVersion: COACH_LEARN_SCHEMA_VERSION,
    recommendations,
  };
};
