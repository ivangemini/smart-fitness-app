import type { KnowledgeLearningState } from '@/api/knowledge';

export const KNOWLEDGE_PATH_STATE_LIST_LIMIT = 500;

export const getKnowledgePathExactStateFallbackIds = (input: {
  requestedArticleVersionIds: readonly string[];
  listedStates: readonly KnowledgeLearningState[];
}): string[] => {
  if (input.listedStates.length < KNOWLEDGE_PATH_STATE_LIST_LIMIT) return [];

  const listedIds = new Set(
    input.listedStates.map((state) => state.articleVersionId),
  );
  return [...new Set(input.requestedArticleVersionIds)]
    .filter((articleVersionId) => !listedIds.has(articleVersionId))
    .sort();
};
