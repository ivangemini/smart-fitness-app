import { useMemo, useRef } from 'react';

import { createKnowledgeLearningApi } from '@/api/knowledge/learningClient';
import type { AuthSession } from '@/auth/types';
import { useAuthSession } from '@/hooks/useAuthSession';

type KnowledgeLearningAuthSession = Pick<AuthSession, 'tokens' | 'user'>;

export const isKnowledgeLearningAuthCurrent = (
  currentUserId: string | null,
  expectedUserId: string | null,
): boolean =>
  expectedUserId !== null && currentUserId === expectedUserId;

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
  const activeUserIdRef = useRef(userId);
  activeUserIdRef.current = userId;

  return useMemo(
    () =>
      createKnowledgeLearningApi({
        getAccessToken: async () =>
          isKnowledgeLearningAuthCurrent(activeUserIdRef.current, userId)
            ? accessToken
            : null,
        refreshAccessToken: async () => {
          if (!isKnowledgeLearningAuthCurrent(activeUserIdRef.current, userId)) {
            return null;
          }
          const refreshedSession = await refresh();
          if (!isKnowledgeLearningAuthCurrent(activeUserIdRef.current, userId)) {
            return null;
          }
          return selectKnowledgeLearningAccessToken(refreshedSession, userId);
        },
      }),
    [accessToken, refresh, userId],
  );
};
