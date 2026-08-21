import { useCallback, useEffect, useState } from 'react';

import type { KnowledgeLocale, PublishedKnowledgeArticle } from '@/api/knowledge';

import { isExpectedKnowledgeArticleVersion } from './knowledgeArticleVersionPolicy';
import { useKnowledgeApi } from './useKnowledgeApi';

export const useKnowledgeArticle = (input: {
  slug: string | null;
  locale: KnowledgeLocale;
  expectedArticleVersionId?: string | null;
}) => {
  const api = useKnowledgeApi();
  const expectedArticleVersionId = input.expectedArticleVersionId ?? null;
  const [article, setArticle] = useState<PublishedKnowledgeArticle | null>(null);
  const [loading, setLoading] = useState(Boolean(input.slug));
  const [error, setError] = useState(!input.slug);
  const [versionMismatch, setVersionMismatch] = useState(false);
  const [reloadRevision, setReloadRevision] = useState(0);
  const reload = useCallback(() => setReloadRevision((value) => value + 1), []);

  useEffect(() => {
    if (!input.slug) {
      setArticle(null);
      setLoading(false);
      setError(true);
      setVersionMismatch(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);
    setVersionMismatch(false);
    void api
      .getArticle({ slug: input.slug, locale: input.locale })
      .then((result) => {
        if (cancelled) return;
        if (!isExpectedKnowledgeArticleVersion(result, expectedArticleVersionId)) {
          setArticle(null);
          setVersionMismatch(true);
          setError(true);
          setLoading(false);
          return;
        }
        setArticle(result);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setArticle(null);
        setError(true);
        setVersionMismatch(false);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    api,
    expectedArticleVersionId,
    input.locale,
    input.slug,
    reloadRevision,
  ]);

  return { article, error, loading, reload, versionMismatch };
};
