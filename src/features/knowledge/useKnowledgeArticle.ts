import { useCallback, useEffect, useState } from 'react';

import type { KnowledgeLocale, PublishedKnowledgeArticle } from '@/api/knowledge';

import { useKnowledgeApi } from './useKnowledgeApi';

export const useKnowledgeArticle = (input: {
  slug: string | null;
  locale: KnowledgeLocale;
}) => {
  const api = useKnowledgeApi();
  const [article, setArticle] = useState<PublishedKnowledgeArticle | null>(null);
  const [loading, setLoading] = useState(Boolean(input.slug));
  const [error, setError] = useState(!input.slug);
  const [reloadRevision, setReloadRevision] = useState(0);
  const reload = useCallback(() => setReloadRevision((value) => value + 1), []);

  useEffect(() => {
    if (!input.slug) {
      setArticle(null);
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);
    void api
      .getArticle({ slug: input.slug, locale: input.locale })
      .then((result) => {
        if (cancelled) return;
        setArticle(result);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setArticle(null);
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api, input.locale, input.slug, reloadRevision]);

  return { article, error, loading, reload };
};
