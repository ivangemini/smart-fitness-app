import { describe, expect, it } from 'vitest';

import {
  normalizeDailyStepAggregate,
  unavailableStepActivitySource,
} from './steps-contract';

describe('Steps health activity contract', () => {
  it('normalizes a bounded daily aggregate', () => {
    expect(
      normalizeDailyStepAggregate({
        localDate: '2026-08-13',
        steps: 1234.9,
        source: 'healthkit',
        measuredAt: '2026-08-13T18:00:00+03:00',
      }),
    ).toEqual({
      localDate: '2026-08-13',
      steps: 1234,
      source: 'healthkit',
      measuredAt: '2026-08-13T15:00:00.000Z',
    });
  });

  it('rejects negative or non-finite step counts', () => {
    expect(() =>
      normalizeDailyStepAggregate({
        localDate: '2026-08-13',
        steps: -1,
        source: 'healthkit',
        measuredAt: '2026-08-13T15:00:00.000Z',
      }),
    ).toThrow('invalid_step_count');
  });

  it('keeps unsupported native health fail closed', async () => {
    const source = unavailableStepActivitySource();

    await expect(source.getAvailability()).resolves.toBe('unsupported');
    await expect(source.requestReadPermission()).resolves.toBe('unsupported');
    await expect(source.readDailySteps('2026-08-13')).resolves.toBeNull();
  });
});
