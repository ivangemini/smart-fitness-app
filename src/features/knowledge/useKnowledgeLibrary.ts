import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  KnowledgeCategory,
  KnowledgeLocale,
  PublishedKnowledgeArticleSummary,
} from '@/api/knowledge';

import { useKnowledgeApi } from './useKnowledgeApi';

type KnowledgeLibraryState = {
  articles: PublishedKnowledgeArticleSummary[];
  conceptIds: string[];
  error: boolean;
  loading: boolean;
  category: KnowledgeCategory | null;
  conceptId: string | null;
  query: string;
  setCategory(category: KnowledgeCategory | null): void;
  setConceptId(conceptId: string | null): void;
  setQuery(query: string): void;
  reload(): void;
};

export const useKnowledgeLibrary = (locale: KnowledgeLocale): KnowledgeLibraryState => {
  const api = useKnowledgeApi();
  const [articles, setArticles] = useState<PublishedKnowledgeArticleSummary[]>([]);
  const [knownConceptIds, setKnownConceptIds] = useState<string[]>([]);
  const [category, setCategory] = useState<KnowledgeCategory | null>(null);
  const [conceptId, setConceptId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadRevision, setReloadRevision] = useState(0);

  const reload = useCallback(() => setReloadRevision((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(false);
      void api
        .listArticles({
          locale,
          ...(category ? { category } : {}),
          ...(conceptId ? { conceptId } : {}),
          ...(query.trim() ? { query: query.trim() } : {}),
          limit: 100,
        })
        .then((result) => {
          if (cancelled) return;
          setArticles(result.articles);
          setKnownConceptIds((current) => {
            const next = new Set(current);
            for (const article of result.articles) {
              for (const id of article.conceptIds) next.add(id);
            }
            return [...next].sort();
          });
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setArticles([]);
          setError(true);
          setLoading(false);
        });
    }, query.trim() ? 250 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [api, category, conceptId, locale, query, reloadRevision]);

  return useMemo(
    () => ({
      articles,
      conceptIds: knownConceptIds,
      error,
      loading,
      category,
      conceptId,
      query,
      setCategory,
      setConceptId,
      setQuery,
      reload,
    }),
    [articles, category, conceptId, error, knownConceptIds, loading, query, reload],
  );
};
