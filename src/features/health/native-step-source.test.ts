import { describe, expect, it } from 'vitest';

import {
  createLocalDayStepWindow,
  createNativeStepActivitySource,
  type NativeStepBridge,
} from './native-step-source';

const bridge = (permission: 'not_determined' | 'granted' | 'denied' = 'granted'): NativeStepBridge => ({
  async isAvailable() {
    return true;
  },
  async getPermissionState() {
    return permission;
  },
  async requestPermission() {
    return permission === 'denied' ? 'denied' : 'granted';
  },
  async readStepCount() {
    return { steps: 4321.8, measuredAt: '2026-08-13T18:00:00+03:00' };
  },
});

describe('native Steps source', () => {
  it('maps an undecided permission to permission_required', async () => {
    const source = createNativeStepActivitySource(bridge('not_determined'), 'healthkit');
    await expect(source.getAvailability()).resolves.toBe('permission_required');
  });

  it('keeps an unavailable native bridge unsupported without reading data', async () => {
    let readCalls = 0;
    const source = createNativeStepActivitySource(
      {
        async isAvailable() {
          return false;
        },
        async getPermissionState() {
          throw new Error('permission_state_must_not_be_read');
        },
        async requestPermission() {
          throw new Error('permission_must_not_be_requested');
        },
        async readStepCount() {
          readCalls += 1;
          return null;
        },
      },
      'health_connect',
    );

    await expect(source.getAvailability()).resolves.toBe('unsupported');
    await expect(source.requestReadPermission()).resolves.toBe('unsupported');
    await expect(source.readDailySteps('2026-08-13')).resolves.toBeNull();
    expect(readCalls).toBe(0);
  });

  it('returns a normalized daily aggregate when available', async () => {
    const source = createNativeStepActivitySource(bridge(), 'healthkit');
    await expect(source.readDailySteps('2026-08-13')).resolves.toEqual({
      localDate: '2026-08-13',
      steps: 4321,
      source: 'healthkit',
      measuredAt: '2026-08-13T15:00:00.000Z',
    });
  });

  it('uses a half-open local day window at the native bridge boundary', async () => {
    let readInput: { startDate: string; endDate: string } | null = null;
    const source = createNativeStepActivitySource(
      {
        ...bridge(),
        async readStepCount(input) {
          readInput = input;
          return { steps: 10, measuredAt: input.startDate };
        },
      },
      'healthkit',
    );

    await source.readDailySteps('2026-08-13');

    const expectedStart = new Date(2026, 7, 13);
    const expectedEnd = new Date(2026, 7, 14);
    expect(readInput).toEqual({
      startDate: expectedStart.toISOString(),
      endDate: expectedEnd.toISOString(),
    });
  });

  it('preserves 23-hour and 25-hour local calendar days across DST', () => {
    const previousTimeZone = process.env.TZ;
    process.env.TZ = 'America/New_York';

    try {
      const spring = createLocalDayStepWindow('2026-03-08');
      const fall = createLocalDayStepWindow('2026-11-01');

      expect(new Date(spring.endDate).getTime() - new Date(spring.startDate).getTime()).toBe(
        23 * 60 * 60 * 1000,
      );
      expect(new Date(fall.endDate).getTime() - new Date(fall.startDate).getTime()).toBe(
        25 * 60 * 60 * 1000,
      );
    } finally {
      if (previousTimeZone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = previousTimeZone;
      }
    }
  });

  it('rejects impossible local calendar dates before querying native health', () => {
    expect(() => createLocalDayStepWindow('2026-02-31')).toThrow('invalid_local_date');
  });

  it('returns no data when access is denied', async () => {
    const source = createNativeStepActivitySource(bridge('denied'), 'healthkit');
    await expect(source.readDailySteps('2026-08-13')).resolves.toBeNull();
  });
});
