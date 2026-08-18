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

describe('Progress Highlights drilldown source contract', () => {
  it('links the summary card to the dedicated Highlights route', () => {
    const progress = readSource('src/app/(tabs)/progress.tsx');
    expect(progress).toContain("router.push('/progress-highlights')");
    expect(progress).toContain('label={copy.highlightDetails}');
  });

  it('keeps detailed signals bounded and routes charts to Strength & Training', () => {
    const detail = readSource('src/app/progress-highlights.tsx');
    const analytics = readSource('src/lib/progress/highlightAnalytics.ts');
    expect(detail).toContain("type PeriodKey = '28' | '90' | '180'");
    expect(detail).toContain("router.push('/training-progress')");
    expect(analytics).toContain('MAX_PERIOD_DAYS = 180');
    expect(analytics).toContain('MAX_ITEMS_PER_GROUP = 12');
  });
});
