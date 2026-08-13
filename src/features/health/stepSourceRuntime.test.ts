import { describe, expect, it } from 'vitest';

import {
  getStepActivitySource,
  resetStepActivitySource,
  setStepActivitySource,
} from './stepSourceRuntime';

describe('step source runtime', () => {
  it('defaults to unavailable', async () => {
    resetStepActivitySource();
    await expect(getStepActivitySource().getAvailability()).resolves.toBe('unavailable');
  });

  it('accepts a native-backed source', async () => {
    setStepActivitySource({
      async getAvailability() { return 'available'; },
      async requestReadPermission() { return 'available'; },
      async readDailySteps(localDate) {
        return {
          localDate,
          steps: 4321,
          source: 'healthkit',
          measuredAt: '2026-08-13T15:00:00.000Z',
        };
      },
    });

    await expect(getStepActivitySource().readDailySteps('2026-08-13')).resolves.toMatchObject({
      steps: 4321,
      source: 'healthkit',
    });
    resetStepActivitySource();
  });
});
