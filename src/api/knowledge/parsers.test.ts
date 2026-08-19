import { describe, expect, it } from 'vitest';

import {
  KNOWLEDGE_SCHEMA_VERSION,
  parsePublishedKnowledgeArticle,
  parsePublishedKnowledgeArticleList,
} from './index';

const article = () => ({
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
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
  publishedAt: '2026-08-19T11:00:00.000Z',
  bodyMarkdown: '## Protein\n\nProtein supplies amino acids.',
  claims: [
    {
      id: '33333333-3333-4333-8333-333333333333',
      text: 'Protein supplies amino acids.',
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
        { id: 'b', label: 'Only glucose' },
        { id: 'c', label: 'Only minerals' },
        { id: 'd', label: 'Only water' },
      ],
    },
  ],
});

describe('Knowledge published response parser', () => {
  it('accepts the exact published article/list projection', () => {
    const fixture = article();
    const { bodyMarkdown: _body, claims: _claims, quizItems: _quiz, ...summary } =
      fixture;
    const parsed = parsePublishedKnowledgeArticle(fixture);

    expect(parsed.slug).toBe('protein-basics');
    expect(parsed.claims[0]?.sources[0]?.title).toBe('Protein review');
    expect(
      parsePublishedKnowledgeArticleList({ articles: [summary] }).articles[0]
        ?.slug,
    ).toBe('protein-basics');
  });

  it('rejects editorial authority and quiz answer-key fields', () => {
    const withEditorialState = { ...article(), reviewState: 'approved' };
    expect(() => parsePublishedKnowledgeArticle(withEditorialState)).toThrow();

    const withAnswerKey = article();
    withAnswerKey.quizItems[0] = {
      ...withAnswerKey.quizItems[0]!,
      correctOptionId: 'a',
    } as (typeof withAnswerKey.quizItems)[number];
    expect(() => parsePublishedKnowledgeArticle(withAnswerKey)).toThrow();
  });

  it('rejects sources without a stable locator', () => {
    const fixture = article();
    const withoutLocator = {
      ...fixture,
      claims: [
        {
          ...fixture.claims[0]!,
          sources: [
            {
              ...fixture.claims[0]!.sources[0]!,
              url: null,
              doi: null,
            },
          ],
        },
      ],
    };

    expect(() => parsePublishedKnowledgeArticle(withoutLocator)).toThrow();
  });
});
