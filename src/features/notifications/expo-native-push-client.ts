import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type {
  NativePushClient,
  NativePushToken,
  PushNotificationResponse,
  PushPermissionState,
} from './push-contract';

const DEFAULT_ANDROID_CHANNEL = 'default';

const mapPermission = (
  permissions: Notifications.NotificationPermissionsStatus,
): PushPermissionState => {
  if (Platform.OS !== 'ios') {
    if (permissions.granted) return 'granted';
    return permissions.status === Notifications.PermissionStatus.UNDETERMINED
      ? 'not_requested'
      : 'denied';
  }

  const iosStatus = permissions.ios?.status;
  if (
    iosStatus === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    iosStatus === Notifications.IosAuthorizationStatus.EPHEMERAL
  ) {
    return 'provisional';
  }
  if (permissions.granted) return 'granted';
  return permissions.status === Notifications.PermissionStatus.UNDETERMINED
    ? 'not_requested'
    : 'denied';
};

const normalizeDeviceToken = (
  deviceToken: Notifications.DevicePushToken,
): NativePushToken | null => {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return null;
  const token =
    typeof deviceToken.data === 'string'
      ? deviceToken.data
      : JSON.stringify(deviceToken.data);
  return {
    platform: Platform.OS,
    provider: Platform.OS === 'ios' ? 'apns' : 'fcm',
    token,
  };
};

const responseData = (
  response: Notifications.NotificationResponse,
): PushNotificationResponse => ({
  destination: response.notification.request.content.data?.destination,
});

const ensureAndroidChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(DEFAULT_ANDROID_CHANNEL, {
    name: 'Notifications',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

export const createExpoNativePushClient = (): NativePushClient => ({
  async getPermissionState() {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return 'unsupported';
    await ensureAndroidChannel();
    return mapPermission(await Notifications.getPermissionsAsync());
  },

  async requestPermission() {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return 'unsupported';
    await ensureAndroidChannel();
    const permissions = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return mapPermission(permissions);
  },

  async getDeviceToken() {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return null;
    await ensureAndroidChannel();
    return normalizeDeviceToken(await Notifications.getDevicePushTokenAsync());
  },

  subscribeToTokenChanges(listener) {
    const subscription = Notifications.addPushTokenListener((token) => {
      const normalized = normalizeDeviceToken(token);
      if (normalized) listener(normalized);
    });
    return { remove: () => subscription.remove() };
  },

  subscribeToNotificationResponses(listener) {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => listener(responseData(response)),
    );
    return { remove: () => subscription.remove() };
  },

  async getLastNotificationResponse() {
    const response = await Notifications.getLastNotificationResponseAsync();
    return response ? responseData(response) : null;
  },
});
