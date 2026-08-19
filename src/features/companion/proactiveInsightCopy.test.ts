import { describe, expect, it } from 'vitest';

import type { ProactiveInsight } from './proactiveInsights';
import { getProactiveInsightCopy } from './proactiveInsightCopy';

const formatNumber = (value: number) => String(value);

describe('proactive insight copy', () => {
  it('keeps stagnation wording observational rather than prescriptive', () => {
    const insight: ProactiveInsight = {
      schemaVersion: 1,
      kind: 'strength_stagnation',
      key: 'strength_stagnation:id:bench:100',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      periodDays: 28,
      evidence: {
        sessionCount: 6,
        workingSetCount: 12,
        previousEstimated1Rm: 100,
        recentEstimated1Rm: 101,
      },
    };

    const en = getProactiveInsightCopy('en', insight, formatNumber);
    const ru = getProactiveInsightCopy('ru', insight, formatNumber);

    expect(en.body).toContain('data pattern');
    expect(en.body).toContain('not a judgment');
    expect(ru.body).toContain('наблюдение');
    expect(ru.body).toContain('не оценка программы');
  });

  it('states the unique-day boundary for consistency without negative framing', () => {
    const insight: ProactiveInsight = {
      schemaVersion: 1,
      kind: 'consistency_up',
      key: 'consistency_up:2:5',
      periodDays: 28,
      evidence: { previousActiveDays: 2, recentActiveDays: 5 },
    };

    const en = getProactiveInsightCopy('en', insight, formatNumber);
    expect(en.body).toContain('5 unique days');
    expect(en.body).toContain('Multiple sessions on one day count as one active day');
    expect(en.body.toLowerCase()).not.toContain('missed');
    expect(en.body.toLowerCase()).not.toContain('streak');
  });
});
