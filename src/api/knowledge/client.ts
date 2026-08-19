import { createApiClient, isApiError, type ApiClient } from '@/api/client';
import { getMobileApiBaseUrl } from '@/api/config';

import {
  KNOWLEDGE_LIST_MAX_LIMIT,
  KNOWLEDGE_SEARCH_MAX_LENGTH,
  type KnowledgeApi,
  type KnowledgeListInput,
} from './contracts';
import {
  parsePublishedKnowledgeArticle,
  parsePublishedKnowledgeArticleList,
} from './parsers';

type KnowledgeApiAuth = {
  getAccessToken(): Promise<string | null>;
  refreshAccessToken(): Promise<string | null>;
};

const defaultApiClient = createApiClient({
  baseUrl: getMobileApiBaseUrl(),
  defaultTimeoutMs: 20_000,
  defaultRetry: { attempts: 1, delayMs: 350, factor: 2 },
});

const CONCEPT_PATTERN = /^[a-z0-9_]+$/;

const normalizeListInput = (input: KnowledgeListInput): KnowledgeListInput => {
  const query = input.query?.trim();
  const conceptId = input.conceptId?.trim();
  if (query && query.length > KNOWLEDGE_SEARCH_MAX_LENGTH) {
    throw new Error(
      `Knowledge search must be at most ${KNOWLEDGE_SEARCH_MAX_LENGTH} characters.`,
    );
  }
  if (conceptId && (conceptId.length > 80 || !CONCEPT_PATTERN.test(conceptId))) {
    throw new Error('Knowledge concept filter is invalid.');
  }
  if (
    input.limit !== undefined &&
    (!Number.isInteger(input.limit) ||
      input.limit < 1 ||
      input.limit > KNOWLEDGE_LIST_MAX_LIMIT)
  ) {
    throw new Error(
      `Knowledge result limit must be between 1 and ${KNOWLEDGE_LIST_MAX_LIMIT}.`,
    );
  }
  return {
    ...input,
    ...(query ? { query } : { query: undefined }),
    ...(conceptId ? { conceptId } : { conceptId: undefined }),
  };
};

const buildListPath = (input: KnowledgeListInput): string => {
  const normalized = normalizeListInput(input);
  const params: string[] = [`locale=${encodeURIComponent(normalized.locale)}`];
  if (normalized.category) {
    params.push(`category=${encodeURIComponent(normalized.category)}`);
  }
  if (normalized.conceptId) {
    params.push(`conceptId=${encodeURIComponent(normalized.conceptId)}`);
  }
  if (normalized.query) {
    params.push(`query=${encodeURIComponent(normalized.query)}`);
  }
  if (normalized.limit !== undefined) {
    params.push(`limit=${normalized.limit}`);
  }
  return `/v1/knowledge/articles?${params.join('&')}`;
};

export const createKnowledgeApi = (
  auth: KnowledgeApiAuth,
  apiClient: ApiClient = defaultApiClient,
): KnowledgeApi => {
  const requestWithAuth = async <T>(
    request: (accessToken: string) => Promise<T>,
  ): Promise<T> => {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) throw new Error('Sign in is required to open Knowledge.');
    try {
      return await request(accessToken);
    } catch (error) {
      if (!isApiError(error) || error.status !== 401) throw error;
      const refreshedToken = await auth.refreshAccessToken();
      if (!refreshedToken) {
        throw new Error('Your session expired. Sign in again to continue.');
      }
      return request(refreshedToken);
    }
  };

  return {
    listArticles: async (input) =>
      requestWithAuth(async (accessToken) =>
        parsePublishedKnowledgeArticleList(
          await apiClient.get<unknown>(buildListPath(input), {
            headers: { authorization: `Bearer ${accessToken}` },
          }),
        ),
      ),
    getArticle: async ({ slug, locale }) => {
      const normalizedSlug = slug.trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
        throw new Error('Knowledge article identifier is invalid.');
      }
      return requestWithAuth(async (accessToken) =>
        parsePublishedKnowledgeArticle(
          await apiClient.get<unknown>(
            `/v1/knowledge/articles/${encodeURIComponent(normalizedSlug)}?locale=${encodeURIComponent(locale)}`,
            { headers: { authorization: `Bearer ${accessToken}` } },
          ),
        ),
      );
    },
  };
};
