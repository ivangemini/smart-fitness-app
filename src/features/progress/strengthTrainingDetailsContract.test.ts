import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '../../..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Strength & Training detail boundary', () => {
  it('keeps the Progress overview summary-first and links to a dedicated detail route', () => {
    const progress = readSource('src/app/(tabs)/progress.tsx');

    expect(progress).toContain("router.push('/strength-training-details')");
    expect(progress).toContain("router.push('/workout-history')");
    expect(progress).not.toContain('buildExerciseProgressSeries');
    expect(progress).not.toContain('<ProgressTrendChart');
  });

  it('keeps exercise analytics bounded and charted only inside the detail route', () => {
    const detail = readSource('src/app/strength-training-details.tsx');

    expect(detail).toContain("type PeriodKey = '28' | '90' | '180'");
    expect(detail).toContain('const MAX_EXERCISE_OPTIONS = 20');
    expect(detail).toContain('buildExerciseProgressSeries({');
    expect(detail).toContain('periodDays: Number(periodKey)');
    expect(detail).toContain('estimated1RmPoints.length >= 2');
    expect(detail).toContain('<ProgressTrendChart');
    expect(detail).toContain("router.push('/workout-history')");
  });
});
