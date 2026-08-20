import { useCallback, useEffect, useState } from 'react';

import type {
  KnowledgeLocale,
  PublishedKnowledgePathSummary,
} from '@/api/knowledge';
import { useKnowledgeApi } from './useKnowledgeApi';

export const useKnowledgePaths = (locale: KnowledgeLocale) => {
  const api = useKnowledgeApi();
  const [paths, setPaths] = useState<PublishedKnowledgePathSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    void api
      .listPaths({ locale, limit: 100 })
      .then((result) => {
        if (cancelled) return;
        setPaths(result.paths);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPaths([]);
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, locale, revision]);

  return { error, loading, paths, reload };
};
