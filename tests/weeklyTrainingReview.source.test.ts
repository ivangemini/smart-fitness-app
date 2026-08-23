import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

const section = readSource(
  'src/features/progress/WeeklyTrainingReviewSection.tsx',
);
const progress = readSource('src/app/(tabs)/progress.tsx');
const trainingProgress = readSource('src/app/training-progress.tsx');

describe('Weekly Training Review source contract', () => {
  it('composes existing deterministic authorities without mutation actions', () => {
    expect(section).toContain('buildCanonicalTrainingIntelligence');
    expect(section).toContain('buildTrainingCoverage');
    expect(section).toContain('buildTrainingIntelligenceReview');
    expect(section).toContain('buildRecoveryModifier');
    expect(section).toContain('buildAdaptiveProgramReview');
    expect(section).toContain('buildWeeklyTrainingReview');
    expect(section).not.toContain('useAppActions');
    expect(section).not.toContain('applyWorkout');
    expect(section).not.toContain('saveTrainingProgram');
    expect(section).not.toContain('updateWorkoutTemplate');
  });

  it('surfaces the compact review in Progress and drills into the explicit 7-day detail window', () => {
    expect(progress).toContain('<WeeklyTrainingReviewSection');
    expect(section).toContain("params: { period: '7' }");
    expect(trainingProgress).toContain("period?: string | string[]");
    expect(trainingProgress).toContain("requestedPeriodKey ?? '30'");
  });
});
