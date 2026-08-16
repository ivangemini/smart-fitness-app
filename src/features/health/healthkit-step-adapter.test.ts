import { describe, expect, it, vi } from 'vitest';

import { createHealthKitStepBridge, type HealthKitStepApi } from './healthkit-step-adapter';

const api = (overrides: Partial<HealthKitStepApi> = {}): HealthKitStepApi => ({
  isAvailable: () => true,
  authorizationRequestNeeded: async () => false,
  requestReadAuthorization: async () => undefined,
  readCumulativeSteps: async () => 4321.9,
  ...overrides,
});

describe('HealthKit step adapter', () => {
  it('treats a completed authorization request status as readable without inventing read-denied state', async () => {
    const bridge = createHealthKitStepBridge(api());
    await expect(bridge.getPermissionState()).resolves.toBe('granted');
  });

  it('requests authorization only when HealthKit says a request is needed', async () => {
    const bridge = createHealthKitStepBridge(
      api({ authorizationRequestNeeded: async () => true }),
    );
    await expect(bridge.getPermissionState()).resolves.toBe('not_determined');
  });

  it('returns a bounded cumulative step count for the requested day', async () => {
    const readCumulativeSteps = vi.fn().mockResolvedValue(4321.9);
    const bridge = createHealthKitStepBridge(api({ readCumulativeSteps }));
    await expect(
      bridge.readStepCount({
        startDate: '2026-08-16T00:00:00.000Z',
        endDate: '2026-08-17T00:00:00.000Z',
      }),
    ).resolves.toEqual({
      steps: 4321,
      measuredAt: '2026-08-17T00:00:00.000Z',
    });
    expect(readCumulativeSteps).toHaveBeenCalledWith({
      startDate: new Date('2026-08-16T00:00:00.000Z'),
      endDate: new Date('2026-08-17T00:00:00.000Z'),
    });
  });

  it('keeps no-data distinct from zero steps', async () => {
    const bridge = createHealthKitStepBridge(
      api({ readCumulativeSteps: async () => null }),
    );
    await expect(
      bridge.readStepCount({
        startDate: '2026-08-16T00:00:00.000Z',
        endDate: '2026-08-17T00:00:00.000Z',
      }),
    ).resolves.toBeNull();
  });
});
