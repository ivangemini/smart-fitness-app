export type PushPermissionState =
  | 'not_requested'
  | 'granted'
  | 'provisional'
  | 'denied'
  | 'unsupported';

export type NativePushToken = {
  platform: 'ios' | 'android';
  provider: 'apns' | 'fcm';
  token: string;
};

export interface NativePushClient {
  getPermissionState(): Promise<PushPermissionState>;
  requestPermission(): Promise<PushPermissionState>;
  getDeviceToken(): Promise<NativePushToken | null>;
}

export function normalizeNativePushToken(
  value: NativePushToken,
): NativePushToken {
  const token = value.token.trim();
  if (token.length < 16 || token.length > 4096) {
    throw new Error('invalid_push_token');
  }

  if (value.platform === 'ios' && value.provider !== 'apns') {
    throw new Error('invalid_push_provider');
  }

  if (value.platform === 'android' && value.provider !== 'fcm') {
    throw new Error('invalid_push_provider');
  }

  return { ...value, token };
}

export function unavailableNativePushClient(): NativePushClient {
  return {
    async getPermissionState() {
      return 'unsupported';
    },
    async requestPermission() {
      return 'unsupported';
    },
    async getDeviceToken() {
      return null;
    },
  };
}
