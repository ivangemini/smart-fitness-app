import type { AppStateStatus } from 'react-native';

export const shouldRenewPushRegistrationOnAppStateChange = (
  previous: AppStateStatus,
  next: AppStateStatus,
): boolean => previous !== 'active' && next === 'active';
