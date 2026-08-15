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

export type PushNotificationResponse = {
  destination?: unknown;
};

export type PushSubscription = {
  remove(): void;
};

export interface NativePushClient {
  getPermissionState(): Promise<PushPermissionState>;
  requestPermission(): Promise<PushPermissionState>;
  getDeviceToken(): Promise<NativePushToken | null>;
  subscribeToTokenChanges?(
    listener: (token: NativePushToken) => void,
  ): PushSubscription;
  subscribeToNotificationResponses?(
    listener: (response: PushNotificationResponse) => void,
  ): PushSubscription;
  getLastNotificationResponse?(): Promise<PushNotificationResponse | null>;
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
