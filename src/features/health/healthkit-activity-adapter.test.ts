import { describe, expect, it, vi } from 'vitest';

import {
  createHealthKitActivityBridge,
  type HealthKitActivityApi,
} from './healthkit-activity-adapter';

const api = (overrides: Partial<HealthKitActivityApi> = {}): HealthKitActivityApi => ({
  isAvailable: () => true,
  authorizationRequestNeeded: async () => false,
  requestReadAuthorization: async () => undefined,
  readDailyActivity: async () => ({
    steps: 4321.9,
    distanceMeters: 3012.45,
    activeEnergyKcal: 456.7,
  }),
  ...overrides,
});

describe('HealthKit activity adapter', () => {
  it('preserves the HealthKit authorization request boundary', async () => {
    const bridge = createHealthKitActivityBridge(
      api({ authorizationRequestNeeded: async () => true }),
    );
    await expect(bridge.getPermissionState()).resolves.toBe('not_determined');
  });

  it('returns the requested-day read-only facts with explicit measurement time', async () => {
    const readDailyActivity = vi.fn().mockResolvedValue({
      steps: 4321.9,
      distanceMeters: 3012.45,
      activeEnergyKcal: 456.7,
    });
    const bridge = createHealthKitActivityBridge(api({ readDailyActivity }));

    await expect(
      bridge.readDailyActivity({
        startDate: '2026-08-24T00:00:00.000Z',
        endDate: '2026-08-25T00:00:00.000Z',
      }),
    ).resolves.toEqual({
      steps: 4321.9,
      distanceMeters: 3012.45,
      activeEnergyKcal: 456.7,
      measuredAt: '2026-08-25T00:00:00.000Z',
    });
    expect(readDailyActivity).toHaveBeenCalledWith({
      startDate: new Date('2026-08-24T00:00:00.000Z'),
      endDate: new Date('2026-08-25T00:00:00.000Z'),
    });
  });

  it('keeps no HealthKit samples distinct from zero-valued facts', async () => {
    const bridge = createHealthKitActivityBridge(
      api({ readDailyActivity: async () => null }),
    );
    await expect(
      bridge.readDailyActivity({
        startDate: '2026-08-24T00:00:00.000Z',
        endDate: '2026-08-25T00:00:00.000Z',
      }),
    ).resolves.toBeNull();
  });

  it('fails permission requests closed when native authorization rejects', async () => {
    const bridge = createHealthKitActivityBridge(
      api({
        requestReadAuthorization: async () => {
          throw new Error('denied');
        },
      }),
    );
    await expect(bridge.requestPermission()).resolves.toBe('denied');
  });
});
