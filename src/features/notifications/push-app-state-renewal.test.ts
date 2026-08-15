import { describe, expect, it } from 'vitest';

import { shouldRenewPushRegistrationOnAppStateChange } from './push-app-state-renewal';

describe('shouldRenewPushRegistrationOnAppStateChange', () => {
  it('renews when the app returns from background to active', () => {
    expect(
      shouldRenewPushRegistrationOnAppStateChange('background', 'active'),
    ).toBe(true);
  });

  it('renews when the app returns from inactive to active', () => {
    expect(
      shouldRenewPushRegistrationOnAppStateChange('inactive', 'active'),
    ).toBe(true);
  });

  it('does not renew for active-to-active noise', () => {
    expect(shouldRenewPushRegistrationOnAppStateChange('active', 'active')).toBe(
      false,
    );
  });

  it('does not renew while leaving the foreground', () => {
    expect(
      shouldRenewPushRegistrationOnAppStateChange('active', 'background'),
    ).toBe(false);
  });
});
