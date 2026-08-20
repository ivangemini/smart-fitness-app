import { useCallback, useEffect, useState } from 'react';

import type { KnowledgeLocale, PublishedKnowledgePath } from '@/api/knowledge';
import { useKnowledgeApi } from './useKnowledgeApi';

export const useKnowledgePath = (input: {
  slug: string | null;
  locale: KnowledgeLocale;
}) => {
  const api = useKnowledgeApi();
  const [path, setPath] = useState<PublishedKnowledgePath | null>(null);
  const [loading, setLoading] = useState(Boolean(input.slug));
  const [error, setError] = useState(!input.slug);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!input.slug) {
      setPath(null);
      setLoading(false);
      setError(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    void api
      .getPath({ slug: input.slug, locale: input.locale })
      .then((result) => {
        if (cancelled) return;
        setPath(result);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPath(null);
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, input.locale, input.slug, revision]);

  return { error, loading, path, reload };
};
