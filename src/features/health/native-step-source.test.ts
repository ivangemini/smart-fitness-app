import { describe, expect, it } from 'vitest';

import { createNativeStepActivitySource, type NativeStepBridge } from './native-step-source';

const bridge = (permission: 'not_determined' | 'granted' | 'denied' = 'granted'): NativeStepBridge => ({
  async isAvailable() { return true; },
  async getPermissionState() { return permission; },
  async requestPermission() { return permission === 'denied' ? 'denied' : 'granted'; },
  async readStepCount() {
    return { steps: 4321.8, measuredAt: '2026-08-13T18:00:00+03:00' };
  },
});

describe('native Steps source', () => {
  it('maps an undecided permission to permission_required', async () => {
    const source = createNativeStepActivitySource(bridge('not_determined'), 'healthkit');
    await expect(source.getAvailability()).resolves.toBe('permission_required');
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

  it('returns no data when access is denied', async () => {
    const source = createNativeStepActivitySource(bridge('denied'), 'healthkit');
    await expect(source.readDailySteps('2026-08-13')).resolves.toBeNull();
  });
});
