import { describe, expect, it } from 'vitest';

import {
  normalizeNativePushToken,
  unavailableNativePushClient,
} from './push-contract';

describe('native push contract', () => {
  it('normalizes an APNs token for iOS', () => {
    expect(
      normalizeNativePushToken({
        platform: 'ios',
        provider: 'apns',
        token: ' 0123456789abcdef0123456789abcdef ',
      }),
    ).toEqual({
      platform: 'ios',
      provider: 'apns',
      token: '0123456789abcdef0123456789abcdef',
    });
  });

  it('rejects provider/platform mismatches', () => {
    expect(() =>
      normalizeNativePushToken({
        platform: 'ios',
        provider: 'fcm',
        token: '0123456789abcdef',
      }),
    ).toThrow('invalid_push_provider');
  });

  it('rejects unsafe token lengths', () => {
    expect(() =>
      normalizeNativePushToken({
        platform: 'android',
        provider: 'fcm',
        token: 'short',
      }),
    ).toThrow('invalid_push_token');
  });

  it('fails closed when native push is unavailable', async () => {
    const client = unavailableNativePushClient();

    await expect(client.getPermissionState()).resolves.toBe('unsupported');
    await expect(client.requestPermission()).resolves.toBe('unsupported');
    await expect(client.getDeviceToken()).resolves.toBeNull();
  });
});
