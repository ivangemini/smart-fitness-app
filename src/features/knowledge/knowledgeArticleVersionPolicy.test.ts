import { describe, expect, it } from 'vitest';

import type { PublishedKnowledgeArticle } from '@/api/knowledge';
import { isExpectedKnowledgeArticleVersion } from './knowledgeArticleVersionPolicy';

const article = {
  articleVersionId: '11111111-1111-4111-8111-111111111111',
} as PublishedKnowledgeArticle;

describe('isExpectedKnowledgeArticleVersion', () => {
  it('allows ordinary reader navigation without an exact-version expectation', () => {
    expect(isExpectedKnowledgeArticleVersion(article, null)).toBe(true);
  });

  it('fails closed when a path/recommendation expects another exact version', () => {
    expect(
      isExpectedKnowledgeArticleVersion(
        article,
        '22222222-2222-4222-8222-222222222222',
      ),
    ).toBe(false);
  });
});
