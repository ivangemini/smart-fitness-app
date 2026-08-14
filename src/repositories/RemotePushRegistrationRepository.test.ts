import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/api/client';
import { createRemotePushRegistrationRepository } from './RemotePushRegistrationRepository';

const auth = {
  getAccessToken: async () => 'access-token',
  refreshAccessToken: async () => null,
};

describe('RemotePushRegistrationRepository', () => {
  it('registers the native token without exposing it in the returned device', async () => {
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

    const registration = {
      deviceId: 'device-1',
      platform: 'ios' as const,
      provider: 'apns' as const,
      token: '1234567890abcdef',
    };

    await expect(repository.register(registration)).resolves.toEqual({
      deviceId: 'device-1',
      platform: 'ios',
      provider: 'apns',
    });
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
      repository.register({
        deviceId: 'device-1',
        platform: 'ios',
        provider: 'apns',
        token: '1234567890abcdef',
      }),
    ).rejects.toThrow('invalid_push_registration_response');
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
