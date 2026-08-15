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

import { AuthContext } from '@/auth/AuthContext';
import type { RemotePushRegistrationRepository } from '@/repositories/RemotePushRegistrationRepository';

import { createExpoNativePushClient } from './expo-native-push-client';
import type { NativePushClient } from './push-contract';
import { PushRuntime, type PushRuntimeSnapshot } from './push-runtime';

export type PushRuntimeContextValue = PushRuntimeSnapshot & {
  requestPermission(): Promise<void>;
  syncRegistration(): Promise<void>;
};

const PushRuntimeContext = createContext<PushRuntimeContextValue | null>(null);

type PushRuntimeProviderProps = PropsWithChildren<{
  repository: RemotePushRegistrationRepository;
  client?: NativePushClient;
}>;

export function PushRuntimeProvider({
  children,
  repository,
  client,
}: PushRuntimeProviderProps) {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const sessionRef = useRef(auth?.session ?? null);
  const [snapshot, setSnapshot] = useState<PushRuntimeSnapshot>({
    permission: 'not_requested',
    registration: 'idle',
  });

  sessionRef.current = auth?.session ?? null;

  const nativeClient = useMemo(
    () => client ?? createExpoNativePushClient(),
    [client],
  );
  const runtime = useMemo(
    () =>
      new PushRuntime({
        client: nativeClient,
        repository,
        getSession: () => sessionRef.current,
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
  if (!value) throw new Error('usePushRuntime must be used within PushRuntimeProvider');
  return value;
}
