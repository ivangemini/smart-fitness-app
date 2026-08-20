import { useEffect, useMemo, useState } from 'react';

import type { KnowledgeLearningState } from '@/api/knowledge';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useKnowledgeLearningApi } from './useKnowledgeLearningApi';

export const useKnowledgePathLearningStates = (
  articleVersionIds: readonly string[],
) => {
  const api = useKnowledgeLearningApi();
  const { user } = useAuthSession();
  const userId = user?.id ?? null;
  const versionKey = [...new Set(articleVersionIds)].sort().join(':');
  const [states, setStates] = useState<KnowledgeLearningState[]>([]);
  const [loading, setLoading] = useState(Boolean(userId && versionKey));
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const ids = new Set(articleVersionIds);
    if (!userId || ids.size === 0) {
      setStates([]);
      setLoading(false);
      setAvailable(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setAvailable(false);
    void api
      .listStates({ limit: 500 })
      .then((result) => {
        if (cancelled) return;
        setStates(
          result.states.filter((state) => ids.has(state.articleVersionId)),
        );
        setAvailable(true);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setStates([]);
        setAvailable(false);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, articleVersionIds, userId, versionKey]);

  return useMemo(
    () => ({
      available,
      loading,
      statesByVersionId: new Map(
        states.map((state) => [state.articleVersionId, state] as const),
      ),
    }),
    [available, loading, states],
  );
};
