import { createApiClient, isApiError, type ApiClient } from '@/api/client';
import { getMobileApiBaseUrl } from '@/api/config';

import type { KnowledgeApi, KnowledgeLocale } from './contracts';
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

const normalizeLimit = (value: number | undefined): number | undefined => {
  if (value === undefined) return undefined;
  if (!Number.isInteger(value) || value < 1 || value > 200) {
    throw new Error('Knowledge article limit must be between 1 and 200.');
  }
  return value;
};

const normalizeSlug = (value: string): string => {
  const slug = value.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    throw new Error('Invalid Knowledge article slug.');
  }
  return slug;
};

const normalizeLocale = (value: KnowledgeLocale): KnowledgeLocale => {
  if (value !== 'en' && value !== 'ru') {
    throw new Error('Unsupported Knowledge locale.');
  }
  return value;
};

export const createKnowledgeApi = (
  auth: KnowledgeApiAuth,
  apiClient: ApiClient = defaultApiClient,
): KnowledgeApi => {
  const requestWithAuth = async <T>(
    request: (accessToken: string) => Promise<T>,
  ): Promise<T> => {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) throw new Error('Sign in is required to use Knowledge.');
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
    listArticles: async ({ locale, limit }) => {
      const normalizedLocale = normalizeLocale(locale);
      const normalizedLimit = normalizeLimit(limit);
      return requestWithAuth(async (accessToken) =>
        parsePublishedKnowledgeArticleList(
          await apiClient.get<unknown>('/v1/knowledge/articles', {
            headers: { authorization: `Bearer ${accessToken}` },
            query: {
              locale: normalizedLocale,
              ...(normalizedLimit ? { limit: normalizedLimit } : {}),
            },
          }),
        ),
      );
    },
    getArticle: async ({ slug, locale }) => {
      const normalizedSlug = normalizeSlug(slug);
      const normalizedLocale = normalizeLocale(locale);
      return requestWithAuth(async (accessToken) =>
        parsePublishedKnowledgeArticle(
          await apiClient.get<unknown>(
            `/v1/knowledge/articles/${encodeURIComponent(normalizedSlug)}`,
            {
              headers: { authorization: `Bearer ${accessToken}` },
              query: { locale: normalizedLocale },
            },
          ),
        ),
      );
    },
  };
};
