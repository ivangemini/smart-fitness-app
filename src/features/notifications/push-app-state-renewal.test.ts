import { describe, expect, it } from 'vitest';

import { shouldRenewPushRegistrationOnAppStateChange } from './push-app-state-renewal';

const authenticated = { authReady: true, deviceId: 'device-1' } as const;

describe('shouldRenewPushRegistrationOnAppStateChange', () => {
  it('renews when an authenticated app returns from background to active', () => {
    expect(
      shouldRenewPushRegistrationOnAppStateChange(
        'background',
        'active',
        authenticated,
      ),
    ).toBe(true);
  });

  it('renews when an authenticated app returns from inactive to active', () => {
    expect(
      shouldRenewPushRegistrationOnAppStateChange(
        'inactive',
        'active',
        authenticated,
      ),
    ).toBe(true);
  });

  it('does not renew before auth hydration completes', () => {
    expect(
      shouldRenewPushRegistrationOnAppStateChange('background', 'active', {
        authReady: false,
        deviceId: 'device-1',
      }),
    ).toBe(false);
  });

  it.each([undefined, null, '', '   '])(
    'does not renew without an authenticated device id (%s)',
    (deviceId) => {
      expect(
        shouldRenewPushRegistrationOnAppStateChange('background', 'active', {
          authReady: true,
          deviceId,
        }),
      ).toBe(false);
    },
  );

  it('does not renew for active-to-active noise', () => {
    expect(
      shouldRenewPushRegistrationOnAppStateChange(
        'active',
        'active',
        authenticated,
      ),
    ).toBe(false);
  });

  it('does not renew while leaving the foreground', () => {
    expect(
      shouldRenewPushRegistrationOnAppStateChange(
        'active',
        'background',
        authenticated,
      ),
    ).toBe(false);
  });
});
