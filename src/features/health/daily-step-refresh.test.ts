import { describe, expect, it } from 'vitest';

import { getNextLocalDayRefreshDelay } from './daily-step-refresh';

const SECOND_MS = 1000;
const HOUR_MS = 60 * 60 * SECOND_MS;

describe('daily Steps refresh boundary', () => {
  it('schedules refresh immediately after the next local midnight', () => {
    const now = new Date(2026, 7, 15, 23, 59, 30, 0);

    expect(getNextLocalDayRefreshDelay(now)).toBe(31 * SECOND_MS);
  });

  it('preserves DST-length local days', () => {
    const previousTimeZone = process.env.TZ;
    process.env.TZ = 'America/New_York';

    try {
      expect(
        getNextLocalDayRefreshDelay(new Date(2026, 2, 8, 0, 0, 0)),
      ).toBe(23 * HOUR_MS + SECOND_MS);
      expect(
        getNextLocalDayRefreshDelay(new Date(2026, 10, 1, 0, 0, 0)),
      ).toBe(25 * HOUR_MS + SECOND_MS);
    } finally {
      if (previousTimeZone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = previousTimeZone;
      }
    }
  });
});
