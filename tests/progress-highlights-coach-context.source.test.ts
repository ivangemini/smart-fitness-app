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

describe('Progress Highlights → Companion source contract', () => {
  it('passes only selector context through navigation', () => {
    const detail = readSource('src/app/progress-highlights.tsx');
    expect(detail).toContain("contextIntent: 'training_highlights'");
    expect(detail).toContain("contextMetric: 'highlights'");
    expect(detail).toContain('days: String(PERIOD_DAYS[periodKey])');
    expect(detail).toContain('endAt: anchorAt');
    expect(detail).not.toContain('workoutSessions:');
    expect(detail).not.toContain('analytics:');
  });

  it('rebuilds bounded trend facts inside Companion and excludes all-time record evidence', () => {
    const coach = readSource('src/app/(tabs)/coach.tsx');
    const facts = readSource('src/features/coach/coachHighlightsProgressFacts.ts');
    expect(coach).toContain('buildCoachHighlightsProgressFacts');
    expect(facts).toContain('buildTrainingProgressAnalytics');
    expect(facts).toContain('allTimeRecordEvidenceIncluded: false');
    expect(facts).not.toContain('allTimeBestEstimated1Rm');
    expect(facts).not.toContain('allTimeEstimated1RmRecordAt');
  });
});
