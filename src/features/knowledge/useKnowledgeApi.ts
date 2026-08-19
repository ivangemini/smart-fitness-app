import { useMemo } from 'react';

import { createKnowledgeApi } from '@/api/knowledge';
import { useAuthSession } from '@/hooks/useAuthSession';

export const useKnowledgeApi = () => {
  const { refresh, session } = useAuthSession();

  return useMemo(
    () =>
      createKnowledgeApi({
        getAccessToken: async () => session?.tokens.accessToken ?? null,
        refreshAccessToken: async () =>
          (await refresh())?.tokens.accessToken ?? null,
      }),
    [refresh, session?.tokens.accessToken],
  );
};
