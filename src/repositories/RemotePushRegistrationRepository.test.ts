import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';
import { createRemotePushRegistrationRepository } from './RemotePushRegistrationRepository';

const auth = {
  getAccessToken: async () => 'access-token',
  refreshAccessToken: async () => null,
};

const registration = {
  platform: 'ios' as const,
  provider: 'apns' as const,
  token: '1234567890abcdef',
};

describe('RemotePushRegistrationRepository', () => {
  it('registers the native token without sending client-selected device authority', async () => {
    const post = vi.fn(async () => ({
      registration: {
        deviceId: 'device-1',
        platform: 'ios' as const,
        provider: 'apns' as const,
      },
    }));
    const repository = createRemotePushRegistrationRepository(
      { post } as unknown as ApiClient,
      auth,
    );

    await expect(repository.register(registration, 'device-1')).resolves.toEqual({
      deviceId: 'device-1',
      platform: 'ios',
      provider: 'apns',
    });
    expect(post).toHaveBeenCalledOnce();
    expect(post).toHaveBeenCalledWith(
      '/v1/push/registrations',
      registration,
      expect.objectContaining({
        headers: { authorization: 'Bearer access-token' },
        retry: false,
      }),
    );
  });

  it('rejects a mismatched platform/provider response', async () => {
    const post = vi.fn(async () => ({
      registration: {
        deviceId: 'device-1',
        platform: 'ios' as const,
        provider: 'fcm' as const,
      },
    }));
    const repository = createRemotePushRegistrationRepository(
      { post } as unknown as ApiClient,
      auth,
    );

    await expect(
      repository.register(registration, 'device-1'),
    ).rejects.toThrow('invalid_push_registration_response');
  });

  it('rejects a valid response bound to a different authenticated device', async () => {
    const post = vi.fn(async () => ({
      registration: {
        deviceId: 'device-2',
        platform: 'ios' as const,
        provider: 'apns' as const,
      },
    }));
    const repository = createRemotePushRegistrationRepository(
      { post } as unknown as ApiClient,
      auth,
    );

    await expect(
      repository.register(registration, 'device-1'),
    ).rejects.toThrow('push_registration_response_mismatch');
  });

  it('unregisters the authenticated device using an encoded path', async () => {
    const remove = vi.fn(async () => undefined);
    const repository = createRemotePushRegistrationRepository(
      { delete: remove } as unknown as ApiClient,
      auth,
    );

    await repository.unregister('device/1');

    expect(remove).toHaveBeenCalledWith(
      '/v1/push/registrations/device%2F1',
      expect.objectContaining({
        headers: { authorization: 'Bearer access-token' },
        retry: false,
      }),
    );
  });
});
