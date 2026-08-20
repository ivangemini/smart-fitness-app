import type {
  KnowledgeLocale,
  PublishedKnowledgeArticleSummary,
} from './contracts';

export const KNOWLEDGE_PATH_SCHEMA_VERSION = 'knowledge-path-v1' as const;
export const KNOWLEDGE_PATH_LIST_MAX_LIMIT = 100;

export type PublishedKnowledgePathSummary = {
  schemaVersion: typeof KNOWLEDGE_PATH_SCHEMA_VERSION;
  pathId: string;
  pathVersionId: string;
  slug: string;
  locale: KnowledgeLocale;
  version: number;
  title: string;
  summary: string;
  publishedAt: string;
  stepCount: number;
};

export type PublishedKnowledgePathStep = {
  position: number;
  article: PublishedKnowledgeArticleSummary;
};

export type PublishedKnowledgePath = PublishedKnowledgePathSummary & {
  steps: PublishedKnowledgePathStep[];
};

export type PublishedKnowledgePathList = {
  schemaVersion: typeof KNOWLEDGE_PATH_SCHEMA_VERSION;
  paths: PublishedKnowledgePathSummary[];
};

export type KnowledgePathApi = {
  listPaths(input: {
    locale: KnowledgeLocale;
    limit?: number;
  }): Promise<PublishedKnowledgePathList>;
  getPath(input: {
    slug: string;
    locale: KnowledgeLocale;
  }): Promise<PublishedKnowledgePath>;
};
