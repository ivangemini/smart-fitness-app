import { describe, expect, it } from 'vitest';

import { filterLabHistoryWindow } from './labHistoryWindow';
import type { LabResultDto } from './types';

const result = (id: string, collectedAt: string): LabResultDto => ({
  id,
  documentId: `document-${id}`,
  markerId: 'glucose',
  value: 5,
  unit: 'mmol/L',
  sourceValue: 5,
  sourceUnit: 'mmol/L',
  referenceInterval: null,
  semanticState: 'unknown',
  collectedAt,
});

describe('Lab history windows', () => {
  const history = [
    result('old', '2025-01-01T12:00:00.000Z'),
    result('year', '2025-08-15T12:00:00.000Z'),
    result('six', '2026-02-15T12:00:00.000Z'),
    result('three', '2026-05-20T12:00:00.000Z'),
    result('latest', '2026-08-01T12:00:00.000Z'),
  ];

  it('anchors rolling windows to the latest confirmed result', () => {
    expect(filterLabHistoryWindow(history, '3m').map((entry) => entry.id)).toEqual([
      'three',
      'latest',
    ]);
    expect(filterLabHistoryWindow(history, '6m').map((entry) => entry.id)).toEqual([
      'six',
      'three',
      'latest',
    ]);
    expect(filterLabHistoryWindow(history, '1y').map((entry) => entry.id)).toEqual([
      'year',
      'six',
      'three',
      'latest',
    ]);
  });

  it('keeps all valid history and discards invalid timestamps', () => {
    const invalid = result('invalid', 'not-a-date');
    expect(filterLabHistoryWindow([invalid, ...history], 'all').map((entry) => entry.id)).toEqual([
      'old',
      'year',
      'six',
      'three',
      'latest',
    ]);
  });
});
