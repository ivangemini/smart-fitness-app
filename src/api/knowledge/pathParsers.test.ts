import { describe, expect, it } from 'vitest';

import {
  KNOWLEDGE_PATH_SCHEMA_VERSION,
  KNOWLEDGE_SCHEMA_VERSION,
  parsePublishedKnowledgePath,
  parsePublishedKnowledgePathList,
} from './index';

const article = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  articleId: '11111111-1111-4111-8111-111111111111',
  articleVersionId: '22222222-2222-4222-8222-222222222222',
  slug: 'rir-basics',
  locale: 'en',
  version: 1,
  primaryConceptId: 'rir',
  conceptIds: ['rir'],
  category: 'training',
  format: 'quick_lesson',
  riskTier: 'tier_1',
  title: 'RIR basics',
  summary: 'Summary',
  publishedAt: '2026-08-20T12:00:00.000Z',
} as const;

const path = {
  schemaVersion: KNOWLEDGE_PATH_SCHEMA_VERSION,
  pathId: '33333333-3333-4333-8333-333333333333',
  pathVersionId: '44444444-4444-4444-8444-444444444444',
  slug: 'training-fundamentals',
  locale: 'en',
  version: 1,
  title: 'Training fundamentals',
  summary: 'Reviewed curriculum',
  publishedAt: '2026-08-20T13:00:00.000Z',
  stepCount: 1,
  steps: [{ position: 1, article }],
} as const;

describe('Knowledge path parsers', () => {
  it('parses strict exact-version path detail and list projections', () => {
    expect(parsePublishedKnowledgePath(path)).toEqual(path);
    expect(
      parsePublishedKnowledgePathList({
        schemaVersion: KNOWLEDGE_PATH_SCHEMA_VERSION,
        paths: [{ ...path, steps: undefined }].map(({ steps: _steps, ...summary }) => summary),
      }).paths[0]?.pathVersionId,
    ).toBe(path.pathVersionId);
  });

  it('fails closed for unknown fields, non-contiguous positions, or locale drift', () => {
    expect(() => parsePublishedKnowledgePath({ ...path, internalReview: true })).toThrow();
    expect(() =>
      parsePublishedKnowledgePath({
        ...path,
        steps: [{ position: 2, article }],
      }),
    ).toThrow();
    expect(() =>
      parsePublishedKnowledgePath({
        ...path,
        steps: [{ position: 1, article: { ...article, locale: 'ru' } }],
      }),
    ).toThrow();
  });
});
