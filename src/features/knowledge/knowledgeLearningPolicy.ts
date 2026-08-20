import type { KnowledgeLearningState } from '@/api/knowledge/learningContracts';

export const canSubmitKnowledgeQuiz = (input: {
  learningState: KnowledgeLearningState | null;
  pendingRead: boolean;
}): boolean =>
  !input.pendingRead &&
  input.learningState?.contentAvailable === true &&
  input.learningState.evidenceState !== null;
