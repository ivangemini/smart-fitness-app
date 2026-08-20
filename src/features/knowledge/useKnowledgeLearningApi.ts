import { useMemo } from 'react';

import { createKnowledgeLearningApi } from '@/api/knowledge/learningClient';
import type { AuthSession } from '@/auth/types';
import { useAuthSession } from '@/hooks/useAuthSession';

type KnowledgeLearningAuthSession = Pick<AuthSession, 'tokens' | 'user'>;

export const selectKnowledgeLearningAccessToken = (
  session: KnowledgeLearningAuthSession | null,
  expectedUserId: string | null,
): string | null =>
  expectedUserId && session?.user.id === expectedUserId
    ? session.tokens.accessToken
    : null;

export const useKnowledgeLearningApi = () => {
  const { refresh, session, user } = useAuthSession();
  const userId = user?.id ?? null;
  const accessToken = selectKnowledgeLearningAccessToken(session, userId);

  return useMemo(
    () =>
      createKnowledgeLearningApi({
        getAccessToken: async () => accessToken,
        refreshAccessToken: async () =>
          selectKnowledgeLearningAccessToken(await refresh(), userId),
      }),
    [accessToken, refresh, userId],
  );
};
