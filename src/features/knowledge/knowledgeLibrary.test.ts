import { describe, expect, it } from 'vitest';

import type { PublishedKnowledgeArticleSummary } from '@/api/knowledge';
import { filterKnowledgeArticles } from './knowledgeLibrary';

const article = (
  overrides: Partial<PublishedKnowledgeArticleSummary> = {},
): PublishedKnowledgeArticleSummary => ({
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
  ...overrides,
});

describe('filterKnowledgeArticles', () => {
  it('filters by category and normalized title/summary/concept text', () => {
    const articles = [
      article(),
      article({
        articleId: '33333333-3333-4333-8333-333333333333',
        articleVersionId: '44444444-4444-4444-8444-444444444444',
        slug: 'training-volume',
        primaryConceptId: 'training_volume',
        conceptIds: ['training_volume', 'fatigue_management'],
        category: 'training',
        title: 'Training volume',
        summary: 'How to think about sets and fatigue.',
      }),
    ];

    expect(
      filterKnowledgeArticles({ articles, category: 'training', query: '' }).map(
        (item) => item.slug,
      ),
    ).toEqual(['training-volume']);
    expect(
      filterKnowledgeArticles({
        articles,
        category: 'all',
        query: 'FATIGUE',
      }).map((item) => item.slug),
    ).toEqual(['training-volume']);
  });

  it('truncates oversized search input instead of expanding query work', () => {
    const articles = [article({ title: `${'x'.repeat(120)} ending` })];
    expect(
      filterKnowledgeArticles({
        articles,
        category: 'all',
        query: 'x'.repeat(140),
      }),
    ).toHaveLength(1);
  });
});
