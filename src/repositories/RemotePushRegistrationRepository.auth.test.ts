import { describe, expect, it, vi } from 'vitest';

import { ApiError, type ApiClient } from '@/api/client';
import { createRemotePushRegistrationRepository } from './RemotePushRegistrationRepository';

const payload = {
  deviceId: 'device-auth-test',
  platform: 'ios' as const,
  provider: 'apns' as const,
  token: 'x'.repeat(16),
};

const response = {
  registration: {
    deviceId: payload.deviceId,
    platform: payload.platform,
    provider: payload.provider,
  },
};

describe('RemotePushRegistrationRepository auth', () => {
  it('refreshes once after a 401 and retries with the refreshed access token', async () => {
    const post = vi
      .fn()
      .mockRejectedValueOnce(
        new ApiError({
          code: 'unauthorized',
          message: 'expired session',
          status: 401,
        }),
      )
      .mockResolvedValueOnce(response);
    const refreshAccessToken = vi.fn(async () => 'fresh-access');
    const repository = createRemotePushRegistrationRepository(
      { post } as unknown as ApiClient,
      {
        getAccessToken: async () => 'stale-access',
        refreshAccessToken,
      },
    );

    await expect(repository.register(payload)).resolves.toEqual(response.registration);
    expect(refreshAccessToken).toHaveBeenCalledOnce();
    expect(post).toHaveBeenNthCalledWith(
      2,
      '/v1/push/registrations',
      payload,
      expect.objectContaining({
        headers: { authorization: 'Bearer fresh-access' },
        retry: false,
      }),
    );
  });

  it('fails before making a request when no authenticated session exists', async () => {
    const post = vi.fn();
    const repository = createRemotePushRegistrationRepository(
      { post } as unknown as ApiClient,
      {
        getAccessToken: async () => null,
        refreshAccessToken: async () => null,
      },
    );

    await expect(repository.register(payload)).rejects.toMatchObject({
      name: 'PushRegistrationAuthenticationRequiredError',
    });
    expect(post).not.toHaveBeenCalled();
  });
});
