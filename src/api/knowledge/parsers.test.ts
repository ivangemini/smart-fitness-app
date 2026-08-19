import { describe, expect, it } from 'vitest';

import {
  parsePublishedKnowledgeArticle,
  parsePublishedKnowledgeArticleList,
} from './parsers';

const summary = () => ({
  schemaVersion: 'knowledge-v1',
  articleId: '11111111-1111-4111-8111-111111111111',
  articleVersionId: '22222222-2222-4222-8222-222222222222',
  slug: 'protein-basics',
  locale: 'en',
  version: 1,
  primaryConceptId: 'protein_basics',
  conceptIds: ['protein_basics'],
  category: 'nutrition',
  format: 'quick_lesson',
  riskTier: 'tier_1',
  title: 'Protein basics',
  summary: 'A concise introduction to dietary protein.',
  publishedAt: '2026-08-19T12:00:00.000Z',
});

const detail = () => ({
  ...summary(),
  bodyMarkdown: '## Protein\n\nDietary protein supplies amino acids.',
  claims: [
    {
      id: '33333333-3333-4333-8333-333333333333',
      text: 'Dietary protein supplies amino acids.',
      evidenceStrength: 'strong',
      sources: [
        {
          id: '44444444-4444-4444-8444-444444444444',
          sourceType: 'systematic_review',
          title: 'Protein review',
          publisher: 'Example Journal',
          publishedAt: '2025-01-01T00:00:00.000Z',
          url: 'https://example.com/protein-review',
          doi: null,
        },
      ],
    },
  ],
  quizItems: [
    {
      id: '55555555-5555-4555-8555-555555555555',
      conceptIds: ['protein_basics'],
      questionType: 'recall',
      question: 'What does dietary protein supply?',
      options: [
        { id: 'a', label: 'Amino acids' },
        { id: 'b', label: 'Only water' },
        { id: 'c', label: 'Only minerals' },
        { id: 'd', label: 'Only glucose' },
      ],
    },
  ],
});

describe('Knowledge published reader parsers', () => {
  it('accepts the strict knowledge-v1 list and detail projections', () => {
    expect(parsePublishedKnowledgeArticleList({ articles: [summary()] }).articles).toHaveLength(
      1,
    );
    const parsed = parsePublishedKnowledgeArticle(detail());
    expect(parsed.slug).toBe('protein-basics');
    expect(parsed.claims[0]?.sources[0]?.title).toBe('Protein review');
    expect(parsed.quizItems[0]?.options).toHaveLength(4);
  });

  it('fails closed on editorial or answer-key fields that are not reader contract', () => {
    expect(() =>
      parsePublishedKnowledgeArticle({
        ...detail(),
        reviewState: 'approved',
      }),
    ).toThrow();

    const leakedAnswer = detail();
    leakedAnswer.quizItems[0] = {
      ...leakedAnswer.quizItems[0]!,
      correctOptionId: 'a',
    } as (typeof leakedAnswer.quizItems)[number];
    expect(() => parsePublishedKnowledgeArticle(leakedAnswer)).toThrow();
  });

  it('rejects unknown versions, locales and duplicate quiz option identities', () => {
    expect(() =>
      parsePublishedKnowledgeArticleList({
        articles: [{ ...summary(), schemaVersion: 'knowledge-v2' }],
      }),
    ).toThrow();
    expect(() =>
      parsePublishedKnowledgeArticleList({
        articles: [{ ...summary(), locale: 'de' }],
      }),
    ).toThrow();

    const duplicateOptions = detail();
    duplicateOptions.quizItems[0]!.options[1] = {
      ...duplicateOptions.quizItems[0]!.options[1]!,
      id: 'a',
    };
    expect(() => parsePublishedKnowledgeArticle(duplicateOptions)).toThrow();
  });
});
