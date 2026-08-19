import { useMemo } from 'react';

import { createKnowledgeApi } from '@/api/knowledge';
import { useAuthSession } from '@/hooks/useAuthSession';

export const useKnowledgeApi = () => {
  const { refresh, session } = useAuthSession();
  const accessToken = session?.tokens.accessToken ?? null;

  return useMemo(
    () =>
      createKnowledgeApi({
        getAccessToken: async () => accessToken,
        refreshAccessToken: async () =>
          (await refresh())?.tokens.accessToken ?? null,
      }),
    [accessToken, refresh],
  );
};
