import { describe, expect, it } from 'vitest';

import type { NativePushClient, PushPermissionState } from './push-contract';
import { resolvePushRegistration } from './push-registration';

const client = (
  permission: PushPermissionState,
  token = '0123456789abcdef0123456789abcdef',
): NativePushClient => ({
  async getPermissionState() {
    return permission;
  },
  async requestPermission() {
    return permission;
  },
  async getDeviceToken() {
    return permission === 'granted'
      ? ({ platform: 'ios', provider: 'apns', token } as const)
      : null;
  },
});

describe('push registration readiness', () => {
  it('does not request permission implicitly', async () => {
    await expect(
      resolvePushRegistration(client('not_requested')),
    ).resolves.toEqual({
      status: 'permission_required',
      permission: 'not_requested',
    });
  });

  it('fails closed for denied permissions', async () => {
    await expect(resolvePushRegistration(client('denied'))).resolves.toEqual({
      status: 'unavailable',
      permission: 'denied',
    });
  });

  it('returns provider routing data without client-selected device authority', async () => {
    const readiness = await resolvePushRegistration(client('granted'));

    expect(readiness).toEqual({
      status: 'ready',
      registration: {
        platform: 'ios',
        provider: 'apns',
        token: '0123456789abcdef0123456789abcdef',
      },
    });
    if (readiness.status === 'ready') {
      expect(readiness.registration).not.toHaveProperty('deviceId');
    }
  });
});
