import { describe, expect, it } from 'vitest';

import {
  buildLabTrendPoints,
  isMarkerCompatibleWithSelection,
  toLabTrendPoint,
} from './labMultiTrend';
import type { LabResultDto } from './types';

const result = (input: {
  markerId: string;
  value: number;
  unit: string;
  low?: number | null;
  high?: number | null;
  referenceUnit?: string;
  collectedAt?: string;
}): LabResultDto => ({
  id: `${input.markerId}-${input.collectedAt ?? 'latest'}`,
  documentId: 'document',
  markerId: input.markerId,
  value: input.value,
  unit: input.unit,
  sourceValue: input.value,
  sourceUnit: input.unit,
  referenceInterval:
    input.low === undefined && input.high === undefined
      ? null
      : {
          low: input.low ?? null,
          high: input.high ?? null,
          unit: input.referenceUnit ?? input.unit,
        },
  semanticState: 'unknown',
  collectedAt: input.collectedAt ?? '2026-08-01T12:00:00.000Z',
});

describe('multi-marker Lab trend normalization', () => {
  it('keeps absolute values only on compatible axes', () => {
    const glucose = result({ markerId: 'glucose', value: 5, unit: 'mmol/L' });
    const potassium = result({ markerId: 'potassium', value: 4, unit: 'mmol/L' });
    const hemoglobin = result({ markerId: 'hemoglobin', value: 150, unit: 'g/L' });

    expect(
      isMarkerCompatibleWithSelection({
        candidate: potassium,
        selected: [glucose],
        mode: 'absolute',
      }),
    ).toBe(true);
    expect(
      isMarkerCompatibleWithSelection({
        candidate: hemoglobin,
        selected: [glucose],
        mode: 'absolute',
      }),
    ).toBe(false);
  });

  it('normalizes a two-sided matching reference interval to a shared percentage axis', () => {
    const point = toLabTrendPoint(
      result({ markerId: 'glucose', value: 5, unit: 'mmol/L', low: 4, high: 6 }),
      'relative_reference',
    );
    expect(point?.value).toBe(50);

    const above = toLabTrendPoint(
      result({ markerId: 'glucose', value: 7, unit: 'mmol/L', low: 4, high: 6 }),
      'relative_reference',
    );
    expect(above?.value).toBe(150);
  });

  it('fails closed when a relative reference is incomplete, invalid, or uses another unit', () => {
    expect(
      toLabTrendPoint(
        result({ markerId: 'a', value: 5, unit: 'mmol/L', low: 4, high: null }),
        'relative_reference',
      ),
    ).toBeNull();
    expect(
      toLabTrendPoint(
        result({ markerId: 'b', value: 5, unit: 'mmol/L', low: 6, high: 4 }),
        'relative_reference',
      ),
    ).toBeNull();
    expect(
      toLabTrendPoint(
        result({
          markerId: 'c',
          value: 5,
          unit: 'mmol/L',
          low: 4,
          high: 6,
          referenceUnit: 'mg/dL',
        }),
        'relative_reference',
      ),
    ).toBeNull();
  });

  it('sorts valid points chronologically and drops invalid timestamps', () => {
    const points = buildLabTrendPoints(
      [
        result({ markerId: 'a', value: 6, unit: 'x', collectedAt: '2026-08-02T00:00:00.000Z' }),
        result({ markerId: 'a', value: 5, unit: 'x', collectedAt: '2026-08-01T00:00:00.000Z' }),
        result({ markerId: 'a', value: 7, unit: 'x', collectedAt: 'invalid' }),
      ],
      'absolute',
    );
    expect(points.map((point) => point.value)).toEqual([5, 6]);
  });
});
