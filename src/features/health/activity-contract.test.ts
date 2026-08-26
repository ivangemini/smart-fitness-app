import { describe, expect, it } from 'vitest';

import {
  normalizeDailyActivityFacts,
  unavailableActivityFactSource,
} from './activity-contract';

describe('daily activity facts contract', () => {
  it('normalizes read-only HealthKit facts without fabricating missing metrics', () => {
    expect(
      normalizeDailyActivityFacts({
        localDate: '2026-08-24',
        steps: 4321.9,
        distanceMeters: 3012.45,
        activeEnergyKcal: null,
        source: 'healthkit',
        measuredAt: '2026-08-25T00:00:00.000Z',
      }),
    ).toEqual({
      localDate: '2026-08-24',
      steps: 4321,
      distanceMeters: 3012.45,
      activeEnergyKcal: null,
      source: 'healthkit',
      measuredAt: '2026-08-25T00:00:00.000Z',
    });
  });

  it('fails closed for invalid or empty activity facts', () => {
    expect(() =>
      normalizeDailyActivityFacts({
        localDate: '2026-08-24',
        steps: null,
        distanceMeters: -1,
        activeEnergyKcal: null,
        source: 'healthkit',
        measuredAt: '2026-08-25T00:00:00.000Z',
      }),
    ).toThrow('invalid_distance');

    expect(() =>
      normalizeDailyActivityFacts({
        localDate: '2026-08-24',
        steps: null,
        distanceMeters: null,
        activeEnergyKcal: null,
        source: 'healthkit',
        measuredAt: '2026-08-25T00:00:00.000Z',
      }),
    ).toThrow('empty_activity_facts');
  });

  it('keeps unsupported platforms explicit', async () => {
    const source = unavailableActivityFactSource('unsupported');
    await expect(source.getAvailability()).resolves.toBe('unsupported');
    await expect(source.requestReadPermission()).resolves.toBe('unsupported');
    await expect(source.readDailyActivity('2026-08-24')).resolves.toBeNull();
  });
});
