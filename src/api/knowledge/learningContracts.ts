import type { KnowledgeLocale } from './contracts';

export const KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION =
  'knowledge-learning-state-v1' as const;
export const KNOWLEDGE_LEARNING_STATE_LIST_MAX_LIMIT = 500;
export const KNOWLEDGE_LEARNING_MAX_QUIZ_ITEMS = 64;

export type KnowledgeLearningEvidenceState = 'read' | 'understood';
export type KnowledgeLearningStateValue =
  | 'unseen'
  | 'read'
  | 'understood'
  | 'refresh_useful';
export type KnowledgeRefreshReason = 'newer_published_version';

export type KnowledgeLearningState = {
  schemaVersion: typeof KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION;
  articleId: string;
  articleVersionId: string;
  locale: KnowledgeLocale;
  version: number;
  state: KnowledgeLearningStateValue;
  evidenceState: KnowledgeLearningEvidenceState | null;
  readAt: string | null;
  understoodAt: string | null;
  understoodQuizItemIds: string[];
  revision: number;
  contentAvailable: boolean;
  latestArticleVersionId: string | null;
  latestVersion: number | null;
  refreshReason: KnowledgeRefreshReason | null;
};

export type KnowledgeLearningStateList = {
  schemaVersion: typeof KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION;
  states: KnowledgeLearningState[];
};

export type KnowledgeQuizAnswer = {
  quizItemId: string;
  selectedOptionId: string;
};

export type KnowledgeQuizEvaluationItem = {
  quizItemId: string;
  correct: boolean;
  feedback: string;
};

export type KnowledgeQuizSubmissionResult = {
  schemaVersion: typeof KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION;
  passed: boolean;
  correctCount: number;
  totalCount: number;
  evaluations: KnowledgeQuizEvaluationItem[];
  learningState: KnowledgeLearningState;
};

export type KnowledgeLearningApi = {
  listStates(input?: { limit?: number }): Promise<KnowledgeLearningStateList>;
  getState(input: { articleVersionId: string }): Promise<KnowledgeLearningState>;
  markRead(input: { articleVersionId: string }): Promise<KnowledgeLearningState>;
  evaluateQuiz(input: {
    articleVersionId: string;
    answers: KnowledgeQuizAnswer[];
  }): Promise<KnowledgeQuizSubmissionResult>;
};
