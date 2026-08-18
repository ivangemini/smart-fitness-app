import { describe, expect, it } from 'vitest';

import type { BodyMeasurement } from '@/types';

import { buildBodyMeasurementProgressAnalytics } from './bodyMeasurementSeries';

const measurement = (
  id: string,
  createdAt: string,
  metric: BodyMeasurement['metric'],
  label: string,
  numericValue: number,
  unit: BodyMeasurement['unit'],
): BodyMeasurement => ({
  id,
  createdAt,
  metric,
  label,
  numericValue,
  unit,
  value: `${numericValue} ${unit === 'percent' ? '%' : unit}`,
});

describe('buildBodyMeasurementProgressAnalytics', () => {
  it('normalizes mixed cm/in entries into one comparable series', () => {
    const analytics = buildBodyMeasurementProgressAnalytics(
      [
        measurement('waist-1', '2026-07-20T10:00:00.000Z', 'waist', 'Waist', 80, 'cm'),
        measurement('waist-2', '2026-08-15T10:00:00.000Z', 'waist', 'Waist', 30, 'in'),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 90 },
    );

    expect(analytics.groups).toHaveLength(1);
    expect(analytics.groups[0]).toMatchObject({
      metric: 'waist',
      label: 'Waist',
      canonicalUnit: 'cm',
      currentCanonicalValue: 76.2,
      periodDeltaCanonical: -3.8,
      totalMatchingPoints: 2,
    });
    expect(analytics.groups[0].points.map((point) => point.canonicalValue)).toEqual([80, 76.2]);
  });

  it('keeps percent measurements separate from circumference measurements', () => {
    const analytics = buildBodyMeasurementProgressAnalytics(
      [
        measurement('waist', '2026-08-15T10:00:00.000Z', 'waist', 'Waist', 75, 'cm'),
        measurement('bf', '2026-08-16T10:00:00.000Z', 'body_fat', 'Body fat', 12, 'percent'),
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 30 },
    );

    expect(analytics.groups).toHaveLength(2);
    expect(analytics.groups.find((group) => group.metric === 'body_fat')).toMatchObject({
      canonicalUnit: 'percent',
      currentCanonicalValue: 12,
    });
  });

  it('tracks unresolved legacy values without inventing numeric data', () => {
    const analytics = buildBodyMeasurementProgressAnalytics(
      [
        {
          id: 'legacy',
          label: 'Legacy note',
          value: 'looks smaller',
          createdAt: '2026-08-16T10:00:00.000Z',
        },
      ],
      { endAt: '2026-08-18T12:00:00.000Z', periodDays: 30 },
    );

    expect(analytics.groups).toEqual([]);
    expect(analytics.unresolvedEntryCount).toBe(1);
  });

  it('bounds point history and the selected period', () => {
    const entries = Array.from({ length: 30 }, (_, index) =>
      measurement(
        `waist-${index}`,
        new Date(Date.parse('2026-08-18T10:00:00.000Z') - index * 24 * 60 * 60 * 1000).toISOString(),
        'waist',
        'Waist',
        80 - index * 0.1,
        'cm',
      ),
    );
    const analytics = buildBodyMeasurementProgressAnalytics(entries, {
      endAt: '2026-08-18T12:00:00.000Z',
      periodDays: 999,
    });

    expect(analytics.period.days).toBe(180);
    expect(analytics.groups[0].totalMatchingPoints).toBe(30);
    expect(analytics.groups[0].points).toHaveLength(24);
    expect(analytics.groups[0].pointsTruncated).toBe(true);
  });

  it('rejects an invalid anchor', () => {
    expect(() =>
      buildBodyMeasurementProgressAnalytics([], { endAt: 'invalid' }),
    ).toThrow('valid endAt timestamp');
  });
});
