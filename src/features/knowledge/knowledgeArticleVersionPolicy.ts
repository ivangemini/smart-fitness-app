import type { PublishedKnowledgeArticle } from '@/api/knowledge';

export const isExpectedKnowledgeArticleVersion = (
  article: PublishedKnowledgeArticle,
  expectedArticleVersionId: string | null,
): boolean =>
  expectedArticleVersionId === null ||
  article.articleVersionId === expectedArticleVersionId;
