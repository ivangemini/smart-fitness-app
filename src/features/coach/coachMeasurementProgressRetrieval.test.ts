import { describe, expect, it } from 'vitest';

import type { CoachRetrievalSources } from './coachRetrieval';
import { buildCoachMeasurementProgressFactPacket } from './coachScopedRetrieval';

const sources = {
  weightHistory: [
    {
      id: 'weight-1',
      date: '2026-08-18T08:00:00.000Z',
      createdAt: '2026-08-18T08:00:00.000Z',
      weight: 70,
    },
  ],
  bodyMeasurements: [
    {
      id: 'waist-1',
      label: 'Waist',
      value: '80',
      createdAt: '2026-08-10T08:00:00.000Z',
      metric: 'waist',
      numericValue: 80,
      unit: 'cm',
    },
    {
      id: 'waist-2',
      label: 'Waist',
      value: '79',
      createdAt: '2026-08-18T08:00:00.000Z',
      metric: 'waist',
      numericValue: 79,
      unit: 'cm',
    },
    {
      id: 'chest-1',
      label: 'Chest',
      value: '100',
      createdAt: '2026-08-18T08:00:00.000Z',
      metric: 'chest',
      numericValue: 100,
      unit: 'cm',
    },
  ],
} as unknown as CoachRetrievalSources;

describe('buildCoachMeasurementProgressFactPacket', () => {
  it('rebuilds only the selected measurement facts and excludes weight history', () => {
    const result = buildCoachMeasurementProgressFactPacket({
      request: {
        intent: 'body_progress',
        endAt: '2026-08-19T08:00:00.000Z',
        days: 30,
      },
      sources,
      measurementKey: 'waist:',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.facts.bodyMetrics?.weights).toEqual([]);
    expect(result.data.facts.bodyMetrics?.measurements).toHaveLength(2);
    expect(result.data.facts.bodyMetrics?.measurements.map((entry) => entry.label)).toEqual([
      'Waist',
      'Waist',
    ]);
    expect(JSON.stringify(result.data)).not.toContain('Chest');
    expect(JSON.stringify(result.data)).not.toContain('weight-1');
  });
});
