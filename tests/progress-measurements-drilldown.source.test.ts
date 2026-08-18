import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as { resolve(...parts: string[]): string };
const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Progress body measurement drilldown source contract', () => {
  it('links the first-level Body actions to the dedicated measurement route', () => {
    const progress = readSource('src/app/(tabs)/progress.tsx');
    expect(progress).toContain("router.push('/measurement-progress')");
    expect(progress).toContain('label={copy.measurementDetails}');
  });

  it('uses bounded canonical measurement analytics instead of charting raw values', () => {
    const detail = readSource('src/app/measurement-progress.tsx');
    const analytics = readSource('src/lib/progress/bodyMeasurementSeries.ts');

    expect(detail).toContain("type PeriodKey = '30' | '90' | '180'");
    expect(detail).toContain('buildBodyMeasurementProgressAnalytics');
    expect(detail).toContain('ProgressTrendChart');
    expect(analytics).toContain('MAX_PERIOD_DAYS = 180');
    expect(analytics).toContain('MAX_GROUPS = 20');
    expect(analytics).toContain('MAX_POINTS_PER_GROUP = 24');
    expect(analytics).toContain('resolveBodyMeasurementStructuredValue');
  });

  it('keeps unresolved legacy values explicit rather than inventing numeric points', () => {
    const analytics = readSource('src/lib/progress/bodyMeasurementSeries.ts');
    expect(analytics).toContain('unresolvedEntryCount += 1');
    expect(analytics).not.toContain('parseFloat(measurement.value)');
  });
});
