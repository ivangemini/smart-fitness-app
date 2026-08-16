import { describe, expect, it } from 'vitest';

import {
  createHealthConnectStepBridge,
  type HealthConnectStepApi,
} from './health-connect-step-adapter';

const api = (overrides: Partial<HealthConnectStepApi> = {}): HealthConnectStepApi => ({
  isAvailable: async () => true,
  hasReadPermission: async () => true,
  requestReadPermission: async () => true,
  readCumulativeSteps: async () => 9876.4,
  ...overrides,
});

describe('Health Connect step adapter', () => {
  it('reports granted permission when Steps read access exists', async () => {
    const bridge = createHealthConnectStepBridge(api());
    await expect(bridge.getPermissionState()).resolves.toBe('granted');
  });

  it('remembers a denied request for the current process', async () => {
    const bridge = createHealthConnectStepBridge(
      api({
        hasReadPermission: async () => false,
        requestReadPermission: async () => false,
      }),
    );
    await expect(bridge.getPermissionState()).resolves.toBe('not_determined');
    await expect(bridge.requestPermission()).resolves.toBe('denied');
    await expect(bridge.getPermissionState()).resolves.toBe('denied');
  });

  it('reads a bounded aggregate only with permission', async () => {
    const bridge = createHealthConnectStepBridge(api());
    await expect(
      bridge.readStepCount({
        startDate: '2026-08-16T00:00:00.000Z',
        endDate: '2026-08-17T00:00:00.000Z',
      }),
    ).resolves.toEqual({
      steps: 9876,
      measuredAt: '2026-08-17T00:00:00.000Z',
    });
  });

  it('returns no data when permission is absent', async () => {
    const bridge = createHealthConnectStepBridge(
      api({ hasReadPermission: async () => false }),
    );
    await expect(
      bridge.readStepCount({
        startDate: '2026-08-16T00:00:00.000Z',
        endDate: '2026-08-17T00:00:00.000Z',
      }),
    ).resolves.toBeNull();
  });
});
