import { describe, expect, it } from 'vitest';

import type { AuthSession } from '@/auth/types';

import { selectKnowledgeLearningAccessToken } from './useKnowledgeLearningApi';

const USER_A_ID = '11111111-1111-4111-8111-111111111111';
const USER_B_ID = '22222222-2222-4222-8222-222222222222';

const sessionFor = (userId: string, accessToken: string): AuthSession => ({
  user: {
    id: userId,
    email: `${userId}@example.test`,
    displayName: null,
    avatarUrl: null,
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
  },
  device: {
    id: '33333333-3333-4333-8333-333333333333',
    userId,
    deviceName: 'Test device',
    platform: 'ios',
    appVersion: '1.0.0',
    lastSeenAt: '2026-08-20T10:00:00.000Z',
  },
  session: {
    id: '44444444-4444-4444-8444-444444444444',
    userId,
    deviceId: '33333333-3333-4333-8333-333333333333',
    expiresAt: '2026-08-21T10:00:00.000Z',
    revokedAt: null,
  },
  tokens: {
    accessToken,
    refreshToken: `refresh-${userId}`,
    tokenType: 'Bearer',
  },
});

describe('Knowledge learning auth binding', () => {
  it('returns a token only for the expected authenticated account', () => {
    const session = sessionFor(USER_A_ID, 'access-a');

    expect(selectKnowledgeLearningAccessToken(session, USER_A_ID)).toBe(
      'access-a',
    );
    expect(selectKnowledgeLearningAccessToken(session, USER_B_ID)).toBeNull();
    expect(selectKnowledgeLearningAccessToken(session, null)).toBeNull();
    expect(selectKnowledgeLearningAccessToken(null, USER_A_ID)).toBeNull();
  });

  it('rejects a refreshed session that belongs to another account', () => {
    const refreshedSession = sessionFor(USER_B_ID, 'access-b');

    expect(
      selectKnowledgeLearningAccessToken(refreshedSession, USER_A_ID),
    ).toBeNull();
  });
});
