import type { AuthSession } from '@/auth';
import type { RemotePushRegistrationRepository } from '@/repositories/RemotePushRegistrationRepository';

import type {
  NativePushClient,
  NativePushToken,
  PushPermissionState,
  PushSubscription,
} from './push-contract';
import { parsePushDestination, type PushDestination } from './push-destination';
import { syncPushRegistration } from './push-registration-sync';

export type PushRuntimeSnapshot = {
  permission: PushPermissionState;
  registration: 'idle' | 'registered' | 'unavailable' | 'token_unavailable' | 'error';
};

export type PushRuntimeOptions = {
  client: NativePushClient;
  repository: RemotePushRegistrationRepository;
  getSession(): AuthSession | null;
  navigate(destination: PushDestination): void;
  onSnapshot?(snapshot: PushRuntimeSnapshot): void;
};

const initialSnapshot: PushRuntimeSnapshot = {
  permission: 'not_requested',
  registration: 'idle',
};

export class PushRuntime {
  private snapshot = initialSnapshot;
  private subscriptions: PushSubscription[] = [];

  constructor(private readonly options: PushRuntimeOptions) {}

  getSnapshot(): PushRuntimeSnapshot {
    return this.snapshot;
  }

  async start(): Promise<void> {
    this.stop();
    const permission = await this.options.client.getPermissionState();
    this.setSnapshot({ permission, registration: 'idle' });

    if (permission === 'granted' || permission === 'provisional') {
      await this.syncCurrentRegistration();
    }

    const tokenSubscription = this.options.client.subscribeToTokenChanges?.(
      (token) => {
        void this.syncToken(token);
      },
    );
    if (tokenSubscription) this.subscriptions.push(tokenSubscription);

    const responseSubscription =
      this.options.client.subscribeToNotificationResponses?.((response) => {
        this.handleDestination(response.destination);
      });
    if (responseSubscription) this.subscriptions.push(responseSubscription);

    const lastResponse = await this.options.client.getLastNotificationResponse?.();
    if (lastResponse) this.handleDestination(lastResponse.destination);
  }

  stop(): void {
    for (const subscription of this.subscriptions.splice(0)) {
      subscription.remove();
    }
  }

  async requestPermissionAndSync(): Promise<PushRuntimeSnapshot> {
    const permission = await this.options.client.requestPermission();
    this.setSnapshot({ permission, registration: 'idle' });
    if (permission === 'granted' || permission === 'provisional') {
      await this.syncCurrentRegistration();
    } else {
      this.setSnapshot({ permission, registration: 'unavailable' });
    }
    return this.snapshot;
  }

  async syncCurrentRegistration(): Promise<void> {
    const session = this.options.getSession();
    if (!session) {
      this.setSnapshot({ ...this.snapshot, registration: 'idle' });
      return;
    }

    try {
      const result = await syncPushRegistration(
        this.options.client,
        this.options.repository,
        session.device.id,
      );
      this.setSnapshot({
        permission: this.snapshot.permission,
        registration:
          result.status === 'registered'
            ? 'registered'
            : result.status === 'permission_required'
              ? 'idle'
              : result.status,
      });
    } catch {
      this.setSnapshot({ ...this.snapshot, registration: 'error' });
    }
  }

  private async syncToken(token: NativePushToken): Promise<void> {
    const session = this.options.getSession();
    if (!session) return;

    try {
      await this.options.repository.register(token, session.device.id);
      this.setSnapshot({ ...this.snapshot, registration: 'registered' });
    } catch {
      this.setSnapshot({ ...this.snapshot, registration: 'error' });
    }
  }

  private handleDestination(value: unknown): void {
    const destination = parsePushDestination(value);
    if (destination) this.options.navigate(destination);
  }

  private setSnapshot(snapshot: PushRuntimeSnapshot): void {
    this.snapshot = snapshot;
    this.options.onSnapshot?.(snapshot);
  }
}
