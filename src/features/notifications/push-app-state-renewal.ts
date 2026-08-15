import type { AppStateStatus } from 'react-native';

export type PushRegistrationRenewalContext = {
  authReady: boolean;
  deviceId?: string | null;
};

export const shouldRenewPushRegistrationOnAppStateChange = (
  previous: AppStateStatus,
  next: AppStateStatus,
  context: PushRegistrationRenewalContext,
): boolean =>
  previous !== 'active' &&
  next === 'active' &&
  context.authReady &&
  Boolean(context.deviceId?.trim());
