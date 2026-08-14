import { isApiError, type ApiClient } from '@/api/client';
import type { PushRegistrationPayload } from '@/features/notifications/push-registration';

export type RegisteredPushDevice = {
  deviceId: string;
  platform: 'ios' | 'android';
  provider: 'apns' | 'fcm';
};

export type PushRegistrationAuthGateway = {
  getAccessToken(): Promise<string | null>;
  refreshAccessToken(): Promise<string | null>;
};

export type RemotePushRegistrationRepository = {
  register(registration: PushRegistrationPayload): Promise<RegisteredPushDevice>;
  unregister(deviceId: string): Promise<void>;
};

export class PushRegistrationAuthenticationRequiredError extends Error {
  constructor() {
    super('Authentication is required for push registration');
    this.name = 'PushRegistrationAuthenticationRequiredError';
  }
}

const authHeader = (token: string): Record<string, string> => ({
  authorization: `Bearer ${token}`,
});

const parseRegisteredDevice = (value: unknown): RegisteredPushDevice => {
  if (!value || typeof value !== 'object') {
    throw new Error('invalid_push_registration_response');
  }

  const registration = (value as { registration?: unknown }).registration;
  if (!registration || typeof registration !== 'object') {
    throw new Error('invalid_push_registration_response');
  }

  const { deviceId, platform, provider } = registration as Record<string, unknown>;
  if (
    typeof deviceId !== 'string' ||
    deviceId.length === 0 ||
    (platform !== 'ios' && platform !== 'android') ||
    (provider !== 'apns' && provider !== 'fcm') ||
    (platform === 'ios' && provider !== 'apns') ||
    (platform === 'android' && provider !== 'fcm')
  ) {
    throw new Error('invalid_push_registration_response');
  }

  return { deviceId, platform, provider };
};

const assertRegistrationMatchesRequest = (
  registered: RegisteredPushDevice,
  requested: PushRegistrationPayload,
): RegisteredPushDevice => {
  if (
    registered.deviceId !== requested.deviceId ||
    registered.platform !== requested.platform ||
    registered.provider !== requested.provider
  ) {
    throw new Error('push_registration_response_mismatch');
  }
  return registered;
};

export const createRemotePushRegistrationRepository = (
  apiClient: ApiClient,
  auth: PushRegistrationAuthGateway,
): RemotePushRegistrationRepository => {
  const withAuth = async <Result>(
    operation: (token: string) => Promise<Result>,
  ): Promise<Result> => {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) throw new PushRegistrationAuthenticationRequiredError();

    try {
      return await operation(accessToken);
    } catch (error) {
      if (!isApiError(error) || error.status !== 401) throw error;
      const refreshedToken = await auth.refreshAccessToken();
      if (!refreshedToken) throw new PushRegistrationAuthenticationRequiredError();
      return operation(refreshedToken);
    }
  };

  return {
    async register(registration) {
      const response = await withAuth((token) =>
        apiClient.post<unknown, PushRegistrationPayload>(
          '/v1/push/registrations',
          registration,
          {
            headers: authHeader(token),
            retry: false,
          },
        ),
      );
      return assertRegistrationMatchesRequest(
        parseRegisteredDevice(response),
        registration,
      );
    },
    async unregister(deviceId) {
      await withAuth((token) =>
        apiClient.delete<void>(
          `/v1/push/registrations/${encodeURIComponent(deviceId)}`,
          {
            headers: authHeader(token),
            retry: false,
          },
        ),
      );
    },
  };
};
