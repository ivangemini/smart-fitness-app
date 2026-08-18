import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: string): string };
const { resolve } = require('path') as { resolve(...parts: string[]): string };
const projectRoot = resolve(__dirname, '../..', '..');
const readSource = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('weight Progress and Companion contextual linking', () => {
  it('passes only weight scope, selected period, and time anchor from Weight details', () => {
    const weightDetails = readSource('src/app/weight-details.tsx');

    expect(weightDetails).toContain("pathname: '/(tabs)/coach'");
    expect(weightDetails).toContain("contextIntent: 'body_progress'");
    expect(weightDetails).toContain("metric: 'weight'");
    expect(weightDetails).toContain('days: String(rangeDays)');
    expect(weightDetails).toContain('endAt: latestSelectedEntry.createdAt');
    expect(weightDetails).not.toContain('JSON.stringify(selectedEntries)');
    expect(weightDetails).not.toContain('JSON.stringify(weightHistory)');
  });

  it('minimizes body measurements before rebuilding the packet inside Companion', () => {
    const coach = readSource('src/app/(tabs)/coach.tsx');
    const scopedRetrieval = readSource('src/features/coach/coachScopedRetrieval.ts');

    expect(coach).toContain('parseCoachBodyProgressContext');
    expect(coach).toContain('buildCoachWeightProgressFactPacket');
    expect(coach).toContain("router.push('/weight-details')");
    expect(scopedRetrieval).toContain('bodyMeasurements: []');
    expect(scopedRetrieval).not.toContain('bodyMetrics: {');
  });
});
