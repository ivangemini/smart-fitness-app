import { useMemo } from 'react';

import { createKnowledgeLearningApi } from '@/api/knowledge/learningClient';
import { useAuthSession } from '@/hooks/useAuthSession';

export const useKnowledgeLearningApi = () => {
  const { refresh, session } = useAuthSession();
  const accessToken = session?.tokens.accessToken ?? null;

  return useMemo(
    () =>
      createKnowledgeLearningApi({
        getAccessToken: async () => accessToken,
        refreshAccessToken: async () =>
          (await refresh())?.tokens.accessToken ?? null,
      }),
    [accessToken, refresh],
  );
};
