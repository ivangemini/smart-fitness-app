import { useEffect, useMemo, useState } from 'react';

import type { KnowledgeLearningState } from '@/api/knowledge';
import { useAuthSession } from '@/hooks/useAuthSession';
import {
  KNOWLEDGE_PATH_STATE_LIST_LIMIT,
  getKnowledgePathExactStateFallbackIds,
} from './knowledgePathStateHydration';
import { useKnowledgeLearningApi } from './useKnowledgeLearningApi';

const EXACT_STATE_BATCH_SIZE = 6;

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

    const load = async () => {
      const listed = await api.listStates({
        limit: KNOWLEDGE_PATH_STATE_LIST_LIMIT,
      });
      const relevant = listed.states.filter((state) =>
        ids.has(state.articleVersionId),
      );
      const fallbackIds = getKnowledgePathExactStateFallbackIds({
        requestedArticleVersionIds: [...ids],
        listedStates: listed.states,
      });
      const exactStates: KnowledgeLearningState[] = [];
      for (
        let offset = 0;
        offset < fallbackIds.length;
        offset += EXACT_STATE_BATCH_SIZE
      ) {
        if (cancelled) return;
        const batch = fallbackIds.slice(offset, offset + EXACT_STATE_BATCH_SIZE);
        exactStates.push(
          ...(await Promise.all(
            batch.map((articleVersionId) =>
              api.getState({ articleVersionId }),
            ),
          )),
        );
      }
      if (cancelled) return;

      const byId = new Map(
        [...relevant, ...exactStates].map((state) => [
          state.articleVersionId,
          state,
        ]),
      );
      setStates([...byId.values()]);
      setAvailable(true);
      setLoading(false);
    };

    void load().catch(() => {
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
