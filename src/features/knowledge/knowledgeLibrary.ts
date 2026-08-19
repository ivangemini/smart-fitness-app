import type {
  KnowledgeCategory,
  PublishedKnowledgeArticleSummary,
} from '@/api/knowledge';

export const KNOWLEDGE_LIBRARY_SEARCH_MAX_LENGTH = 120;

export type KnowledgeLibraryCategoryFilter = KnowledgeCategory | 'all';

export const filterKnowledgeArticles = (input: {
  articles: readonly PublishedKnowledgeArticleSummary[];
  category: KnowledgeLibraryCategoryFilter;
  query: string;
}): PublishedKnowledgeArticleSummary[] => {
  const query = input.query
    .trim()
    .slice(0, KNOWLEDGE_LIBRARY_SEARCH_MAX_LENGTH)
    .toLocaleLowerCase();

  return input.articles.filter((article) => {
    if (input.category !== 'all' && article.category !== input.category) {
      return false;
    }
    if (!query) return true;
    const searchText = [
      article.title,
      article.summary,
      article.primaryConceptId,
      ...article.conceptIds,
    ]
      .join(' ')
      .toLocaleLowerCase();
    return searchText.includes(query);
  });
};
