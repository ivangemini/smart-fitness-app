import {
  normalizeNativePushToken,
  type NativePushClient,
  type NativePushToken,
  type PushPermissionState,
} from './push-contract';

export type PushRegistrationPayload = NativePushToken;

export type PushRegistrationReadiness =
  | { status: 'ready'; registration: PushRegistrationPayload }
  | { status: 'permission_required'; permission: PushPermissionState }
  | { status: 'unavailable'; permission: PushPermissionState }
  | { status: 'token_unavailable'; permission: PushPermissionState };

export async function resolvePushRegistration(
  client: NativePushClient,
): Promise<PushRegistrationReadiness> {
  const permission = await client.getPermissionState();
  if (permission === 'not_requested') {
    return { status: 'permission_required', permission };
  }
  if (permission === 'denied' || permission === 'unsupported') {
    return { status: 'unavailable', permission };
  }

  const token = await client.getDeviceToken();
  if (!token) return { status: 'token_unavailable', permission };

  return {
    status: 'ready',
    registration: normalizeNativePushToken(token),
  };
}
