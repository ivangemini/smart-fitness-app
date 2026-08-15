import { describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/auth';
import type { RemotePushRegistrationRepository } from '@/repositories/RemotePushRegistrationRepository';

import type {
  NativePushClient,
  NativePushToken,
  PushNotificationResponse,
} from './push-contract';
import { PushRuntime } from './push-runtime';

const session = {
  user: { id: 'user-1' },
  device: { id: 'device-1' },
  session: { id: 'session-1' },
  tokens: { accessToken: 'access', refreshToken: 'refresh', tokenType: 'Bearer' },
} as AuthSession;

const createClient = (permission: 'not_requested' | 'granted' = 'granted') => {
  let currentPermission = permission;
  let tokenListener: ((token: NativePushToken) => void) | null = null;
  let responseListener: ((response: PushNotificationResponse) => void) | null = null;
  const client: NativePushClient = {
    getPermissionState: vi.fn(async () => currentPermission),
    requestPermission: vi.fn(async () => {
      currentPermission = 'granted';
      return 'granted' as const;
    }),
    getDeviceToken: vi.fn(async () => ({
      platform: 'ios' as const,
      provider: 'apns' as const,
      token: 'a'.repeat(64),
    })),
    subscribeToTokenChanges(listener) {
      tokenListener = listener;
      return { remove: vi.fn() };
    },
    subscribeToNotificationResponses(listener) {
      responseListener = listener;
      return { remove: vi.fn() };
    },
    getLastNotificationResponse: vi.fn(async () => null),
  };
  return {
    client,
    emitToken(token: NativePushToken) {
      tokenListener?.(token);
    },
    emitResponse(response: PushNotificationResponse) {
      responseListener?.(response);
    },
  };
};

const createRepository = () => {
  const register = vi.fn(async () => ({
    deviceId: 'device-1',
    platform: 'ios' as const,
    provider: 'apns' as const,
  }));
  return {
    repository: { register, unregister: vi.fn() } as RemotePushRegistrationRepository,
    register,
  };
};

describe('PushRuntime', () => {
  it('syncs an already-authorized token on start', async () => {
    const { client } = createClient();
    const { repository, register } = createRepository();
    const runtime = new PushRuntime({
      client,
      repository,
      getSession: () => session,
      navigate: vi.fn(),
    });

    await runtime.start();

    expect(register).toHaveBeenCalledWith(
      { platform: 'ios', provider: 'apns', token: 'a'.repeat(64) },
      'device-1',
    );
    expect(runtime.getSnapshot().registration).toBe('registered');
  });

  it('requests permission only from the explicit enable action', async () => {
    const { client } = createClient('not_requested');
    const { repository, register } = createRepository();
    const runtime = new PushRuntime({
      client,
      repository,
      getSession: () => session,
      navigate: vi.fn(),
    });

    await runtime.start();
    expect(client.requestPermission).not.toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();

    await runtime.requestPermissionAndSync();
    expect(client.requestPermission).toHaveBeenCalledOnce();
    expect(register).toHaveBeenCalledOnce();
  });

  it('re-registers a rotated native token', async () => {
    const { client, emitToken } = createClient();
    const { repository, register } = createRepository();
    const runtime = new PushRuntime({
      client,
      repository,
      getSession: () => session,
      navigate: vi.fn(),
    });
    await runtime.start();
    register.mockClear();

    emitToken({ platform: 'ios', provider: 'apns', token: 'b'.repeat(64) });
    await vi.waitFor(() => expect(register).toHaveBeenCalledOnce());

    expect(register).toHaveBeenCalledWith(
      { platform: 'ios', provider: 'apns', token: 'b'.repeat(64) },
      'device-1',
    );
  });

  it('navigates only through the destination allowlist', async () => {
    const navigate = vi.fn();
    const { client, emitResponse } = createClient();
    const { repository } = createRepository();
    const runtime = new PushRuntime({
      client,
      repository,
      getSession: () => session,
      navigate,
    });
    await runtime.start();

    emitResponse({ destination: 'https://example.com/phish' });
    emitResponse({ destination: '/social/story/story-1' });

    expect(navigate).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith('/social/story/story-1');
  });

  it('does not register or route without an authenticated session', async () => {
    const navigate = vi.fn();
    const { client, emitToken, emitResponse } = createClient();
    const { repository, register } = createRepository();
    const runtime = new PushRuntime({
      client,
      repository,
      getSession: () => null,
      navigate,
    });

    await runtime.start();
    emitToken({ platform: 'ios', provider: 'apns', token: 'b'.repeat(64) });
    emitResponse({ destination: '/social/story/story-1' });

    expect(register).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
