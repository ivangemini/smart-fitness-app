import { type Href, useRouter } from 'expo-router';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';

import { getMobileApiBaseUrl } from '@/api';
import { createApiClient } from '@/api/client';
import { AuthContext } from '@/auth/AuthContext';
import { createRemotePushRegistrationRepository } from '@/repositories/RemotePushRegistrationRepository';

import { createExpoNativePushClient } from './expo-native-push-client';
import { shouldRenewPushRegistrationOnAppStateChange } from './push-app-state-renewal';
import type { NativePushClient } from './push-contract';
import { PushRuntime, type PushRuntimeSnapshot } from './push-runtime';

export type PushRuntimeContextValue = PushRuntimeSnapshot & {
  requestPermission(): Promise<void>;
  syncRegistration(): Promise<void>;
};

const PushRuntimeContext = createContext<PushRuntimeContextValue | null>(null);

type PushRuntimeProviderProps = PropsWithChildren<{
  client?: NativePushClient;
}>;

export function PushRuntimeProvider({ children, client }: PushRuntimeProviderProps) {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const authRef = useRef(auth);
  const appStateRef = useRef(AppState.currentState);
  const [snapshot, setSnapshot] = useState<PushRuntimeSnapshot>({
    permission: 'not_requested',
    registration: 'idle',
  });

  authRef.current = auth;

  const nativeClient = useMemo(
    () => client ?? createExpoNativePushClient(),
    [client],
  );
  const apiClient = useMemo(
    () => createApiClient({ baseUrl: getMobileApiBaseUrl() }),
    [],
  );
  const repository = useMemo(
    () =>
      createRemotePushRegistrationRepository(apiClient, {
        getAccessToken: async () =>
          authRef.current?.session?.tokens.accessToken ?? null,
        refreshAccessToken: async () =>
          (await authRef.current?.refresh())?.tokens.accessToken ?? null,
      }),
    [apiClient],
  );
  const runtime = useMemo(
    () =>
      new PushRuntime({
        client: nativeClient,
        repository,
        getSession: () => authRef.current?.session ?? null,
        navigate: (destination) => router.push(destination as Href),
        onSnapshot: setSnapshot,
      }),
    [nativeClient, repository, router],
  );

  useEffect(() => {
    void runtime.start();
    return () => runtime.stop();
  }, [runtime]);

  useEffect(() => {
    if (!auth?.ready) return;
    void runtime.syncCurrentRegistration();
  }, [auth?.ready, auth?.session?.device.id, runtime]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;
      if (
        shouldRenewPushRegistrationOnAppStateChange(previousState, nextState) &&
        authRef.current?.ready &&
        authRef.current.session
      ) {
        void runtime.syncCurrentRegistration();
      }
    });
    return () => subscription.remove();
  }, [runtime]);

  const value = useMemo<PushRuntimeContextValue>(
    () => ({
      ...snapshot,
      async requestPermission() {
        await runtime.requestPermissionAndSync();
      },
      syncRegistration: () => runtime.syncCurrentRegistration(),
    }),
    [runtime, snapshot],
  );

  return (
    <PushRuntimeContext.Provider value={value}>
      {children}
    </PushRuntimeContext.Provider>
  );
}

export function usePushRuntime(): PushRuntimeContextValue {
  const value = useContext(PushRuntimeContext);
  if (!value) {
    throw new Error('usePushRuntime must be used within PushRuntimeProvider');
  }
  return value;
}
