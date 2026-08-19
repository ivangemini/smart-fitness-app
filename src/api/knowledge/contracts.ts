export const KNOWLEDGE_SCHEMA_VERSION = 'knowledge-v1' as const;

export type KnowledgeLocale = 'en' | 'ru';
export type KnowledgeCategory =
  | 'training'
  | 'nutrition'
  | 'physiology'
  | 'recovery'
  | 'body_composition'
  | 'labs';
export type KnowledgeArticleFormat =
  | 'quick_lesson'
  | 'standard'
  | 'deep_dive'
  | 'practical_guide'
  | 'reference';
export type KnowledgeRiskTier = 'tier_1' | 'tier_2' | 'tier_3';
export type KnowledgeEvidenceStrength = 'limited' | 'moderate' | 'strong';
export type KnowledgeSourceType =
  | 'systematic_review'
  | 'meta_analysis'
  | 'position_statement'
  | 'guideline'
  | 'randomized_trial'
  | 'observational_study'
  | 'narrative_review'
  | 'other';
export type KnowledgeQuizQuestionType =
  | 'recall'
  | 'understanding'
  | 'application'
  | 'misconception';

export type PublishedKnowledgeArticleSummary = {
  schemaVersion: typeof KNOWLEDGE_SCHEMA_VERSION;
  articleId: string;
  articleVersionId: string;
  slug: string;
  locale: KnowledgeLocale;
  version: number;
  primaryConceptId: string;
  conceptIds: string[];
  category: KnowledgeCategory;
  format: KnowledgeArticleFormat;
  riskTier: KnowledgeRiskTier;
  title: string;
  summary: string;
  publishedAt: string;
};

export type PublishedKnowledgeSource = {
  id: string;
  sourceType: KnowledgeSourceType;
  title: string;
  publisher: string;
  publishedAt: string | null;
  url: string | null;
  doi: string | null;
};

export type PublishedKnowledgeClaim = {
  id: string;
  text: string;
  evidenceStrength: KnowledgeEvidenceStrength;
  sources: PublishedKnowledgeSource[];
};

export type PublishedKnowledgeQuizOption = {
  id: string;
  label: string;
};

export type PublishedKnowledgeQuizItem = {
  id: string;
  conceptIds: string[];
  questionType: KnowledgeQuizQuestionType;
  question: string;
  options: PublishedKnowledgeQuizOption[];
};

export type PublishedKnowledgeArticle = PublishedKnowledgeArticleSummary & {
  bodyMarkdown: string;
  claims: PublishedKnowledgeClaim[];
  quizItems: PublishedKnowledgeQuizItem[];
};

export type PublishedKnowledgeArticleList = {
  articles: PublishedKnowledgeArticleSummary[];
};

export type KnowledgeApi = {
  listArticles(input: {
    locale: KnowledgeLocale;
    limit?: number;
  }): Promise<PublishedKnowledgeArticleList>;
  getArticle(input: {
    slug: string;
    locale: KnowledgeLocale;
  }): Promise<PublishedKnowledgeArticle>;
};
