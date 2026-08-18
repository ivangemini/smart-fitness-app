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

describe('Progress Activity drilldown source contract', () => {
  it('keeps the Progress summary linked to the dedicated Activity route', () => {
    const progress = readSource('src/app/(tabs)/progress.tsx');
    expect(progress).toContain("router.push('/activity-progress')");
    expect(progress).toContain('label={copy.activityDetails}');
  });

  it('uses bounded deterministic activity analytics in the detail screen', () => {
    const detail = readSource('src/app/activity-progress.tsx');
    expect(detail).toContain('buildActivityProgressAnalytics');
    expect(detail).toContain("type PeriodKey = '28' | '90' | '180'");
    expect(detail).toContain('ProgressTrendChart');
    expect(detail).toContain("router.push('/workout-history')");
  });
});
