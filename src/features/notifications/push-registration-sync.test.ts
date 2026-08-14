import { describe, expect, it, vi } from 'vitest';

import type { RemotePushRegistrationRepository } from '@/repositories/RemotePushRegistrationRepository';
import type { NativePushClient } from './push-contract';
import { syncPushRegistration } from './push-registration-sync';

const remote = (register = vi.fn()) =>
  ({ register, unregister: vi.fn() }) as unknown as RemotePushRegistrationRepository;

const readyClient = (): NativePushClient => ({
  getPermissionState: vi.fn(async () => 'granted' as const),
  requestPermission: vi.fn(async () => 'granted' as const),
  getDeviceToken: vi.fn(async () => ({
    platform: 'ios' as const,
    provider: 'apns' as const,
    token: 'x'.repeat(16),
  })),
});

describe('syncPushRegistration', () => {
  it('registers an already-ready native boundary without requesting permission', async () => {
    const register = vi.fn(async () => ({
      deviceId: 'device-1',
      platform: 'ios' as const,
      provider: 'apns' as const,
    }));
    const client = readyClient();

    await expect(syncPushRegistration(client, remote(register), 'device-1')).resolves.toMatchObject({
      status: 'registered',
      registration: { deviceId: 'device-1' },
    });
    expect(register).toHaveBeenCalledOnce();
    expect(client.requestPermission).not.toHaveBeenCalled();
  });

  it('does not contact the remote repository before permission exists', async () => {
    const register = vi.fn();
    const client: NativePushClient = {
      getPermissionState: vi.fn(async () => 'not_requested' as const),
      requestPermission: vi.fn(async () => 'granted' as const),
      getDeviceToken: vi.fn(async () => null),
    };

    await expect(syncPushRegistration(client, remote(register), 'device-1')).resolves.toEqual({
      status: 'permission_required',
    });
    expect(register).not.toHaveBeenCalled();
    expect(client.requestPermission).not.toHaveBeenCalled();
  });

  it('fails closed when native push is unsupported', async () => {
    const register = vi.fn();
    const client: NativePushClient = {
      getPermissionState: vi.fn(async () => 'unsupported' as const),
      requestPermission: vi.fn(async () => 'unsupported' as const),
      getDeviceToken: vi.fn(async () => null),
    };

    await expect(syncPushRegistration(client, remote(register), 'device-1')).resolves.toEqual({
      status: 'unavailable',
    });
    expect(register).not.toHaveBeenCalled();
  });
});
