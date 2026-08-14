import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';
import type { StorageAdapter } from '@/storage/StorageAdapter';

import {
  AUTH_SESSION_STORAGE_KEY,
  createAuthService,
} from './createAuthService';
import { AUTH_TOKENS_STORAGE_KEY, createTokenManager } from './token-manager';
import type { AuthEnvelope } from './types';

const createMemoryStorage = (): StorageAdapter & {
  values: Map<string, string>;
} => {
  const values = new Map<string, string>();
  return {
    values,
    async read(key) {
      return values.get(key) ?? null;
    },
    async write(key, value) {
      values.set(key, value);
    },
    async remove(key) {
      values.delete(key);
    },
  };
};

const envelope: AuthEnvelope = {
  user: {
    id: 'user-offline-logout',
    email: 'offline@example.com',
    displayName: 'Offline User',
    avatarUrl: null,
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
  },
  device: {
    id: 'device-offline-logout',
    userId: 'user-offline-logout',
    deviceName: 'Offline iPhone',
    platform: 'ios',
    appVersion: '1.0.0',
    lastSeenAt: '2026-08-15T00:00:00.000Z',
  },
  session: {
    id: 'session-offline-logout',
    userId: 'user-offline-logout',
    deviceId: 'device-offline-logout',
    expiresAt: '2026-09-15T00:00:00.000Z',
    revokedAt: null,
  },
  accessToken: 'offline-access-token',
  refreshToken: 'offline-refresh-token',
  tokenType: 'Bearer',
};

describe('createAuthService offline logout', () => {
  it('clears local session metadata and tokens when remote logout fails', async () => {
    const sessionStorage = createMemoryStorage();
    const tokenStorage = createMemoryStorage();
    const post = vi.fn(async (path: string) => {
      if (path === '/v1/auth/login') return envelope;
      if (path === '/v1/auth/logout') throw new Error('network unavailable');
      throw new Error(`unexpected request: ${path}`);
    });
    const service = createAuthService({
      apiClient: { post } as unknown as ApiClient,
      sessionStorage,
      tokenManager: createTokenManager(tokenStorage),
    });

    await service.login({
      email: 'offline@example.com',
      password: 'StrongPass123!',
    });

    expect(await sessionStorage.read(AUTH_SESSION_STORAGE_KEY)).not.toBeNull();
    expect(await tokenStorage.read(AUTH_TOKENS_STORAGE_KEY)).not.toBeNull();

    await expect(service.logout()).resolves.toBeUndefined();

    expect(post).toHaveBeenCalledWith(
      '/v1/auth/logout',
      undefined,
      expect.objectContaining({
        headers: { authorization: 'Bearer offline-access-token' },
        retry: false,
      }),
    );
    expect(await sessionStorage.read(AUTH_SESSION_STORAGE_KEY)).toBeNull();
    expect(await tokenStorage.read(AUTH_TOKENS_STORAGE_KEY)).toBeNull();
    expect(await service.loadSession()).toBeNull();
  });
});
