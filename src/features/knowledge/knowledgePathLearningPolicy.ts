import type { KnowledgeLearningStateValue } from '@/api/knowledge';

export type KnowledgePathStepLearningView =
  | KnowledgeLearningStateValue
  | 'unseen'
  | 'loading'
  | 'unavailable';

export const resolveKnowledgePathStepLearningView = (input: {
  available: boolean;
  loading: boolean;
  state: KnowledgeLearningStateValue | null;
}): KnowledgePathStepLearningView => {
  if (input.loading) return 'loading';
  if (!input.available) return 'unavailable';
  return input.state ?? 'unseen';
};
