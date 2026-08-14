import type { NativePushClient } from './push-contract';
import { resolvePushRegistration } from './push-registration';
import type {
  RegisteredPushDevice,
  RemotePushRegistrationRepository,
} from '@/repositories/RemotePushRegistrationRepository';

export type PushRegistrationSyncResult =
  | { status: 'registered'; registration: RegisteredPushDevice }
  | { status: 'permission_required' }
  | { status: 'unavailable' }
  | { status: 'token_unavailable' };

export async function syncPushRegistration(
  client: NativePushClient,
  repository: RemotePushRegistrationRepository,
  deviceId: string,
): Promise<PushRegistrationSyncResult> {
  const readiness = await resolvePushRegistration(client, deviceId);

  if (readiness.status !== 'ready') {
    return { status: readiness.status };
  }

  return {
    status: 'registered',
    registration: await repository.register(readiness.registration),
  };
}
