import { describe, expect, it, vi } from 'vitest';

import {
  createNativeActivityFactSource,
  type NativeActivityFactsBridge,
} from './native-activity-source';

const bridge = (
  overrides: Partial<NativeActivityFactsBridge> = {},
): NativeActivityFactsBridge => ({
  isAvailable: async () => true,
  getPermissionState: async () => 'granted',
  requestPermission: async () => 'granted',
  readDailyActivity: async ({ endDate }) => ({
    steps: 4321.9,
    distanceMeters: 3012.45,
    activeEnergyKcal: 456.7,
    measuredAt: endDate,
  }),
  ...overrides,
});

describe('native activity fact source', () => {
  it('reads one local calendar day and normalizes HealthKit facts', async () => {
    const readDailyActivity = vi.fn(
      async ({ endDate }: { startDate: string; endDate: string }) => ({
        steps: 4321.9,
        distanceMeters: 3012.45,
        activeEnergyKcal: 456.7,
        measuredAt: endDate,
      }),
    );
    const source = createNativeActivityFactSource(
      bridge({ readDailyActivity }),
      'healthkit',
    );

    const facts = await source.readDailyActivity('2026-08-24');
    expect(facts).toMatchObject({
      localDate: '2026-08-24',
      steps: 4321,
      distanceMeters: 3012.45,
      activeEnergyKcal: 456.7,
      source: 'healthkit',
    });
    expect(readDailyActivity).toHaveBeenCalledTimes(1);
    const input = readDailyActivity.mock.calls[0]?.[0];
    expect(input).toBeTruthy();
    expect(new Date(input!.endDate).getTime()).toBeGreaterThan(
      new Date(input!.startDate).getTime(),
    );
  });

  it('does not query native data before read permission is available', async () => {
    const readDailyActivity = vi.fn();
    const source = createNativeActivityFactSource(
      bridge({
        getPermissionState: async () => 'not_determined',
        readDailyActivity,
      }),
      'healthkit',
    );

    await expect(source.getAvailability()).resolves.toBe('permission_required');
    await expect(source.readDailyActivity('2026-08-24')).resolves.toBeNull();
    expect(readDailyActivity).not.toHaveBeenCalled();
  });

  it('keeps unsupported devices explicit and skips permission prompts', async () => {
    const requestPermission = vi.fn();
    const source = createNativeActivityFactSource(
      bridge({ isAvailable: async () => false, requestPermission }),
      'healthkit',
    );

    await expect(source.getAvailability()).resolves.toBe('unsupported');
    await expect(source.requestReadPermission()).resolves.toBe('unsupported');
    expect(requestPermission).not.toHaveBeenCalled();
  });
});
