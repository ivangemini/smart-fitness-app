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
const screenSource = readSource('src/features/exercises/screens/ExerciseDetailScreen.tsx');
const progressSource = readSource(
  'src/features/exercises/components/ExerciseProgressSection.tsx',
);

describe('exercise detail unit boundaries', () => {
  it('formats history and progress weights through the selected preference', () => {
    expect(screenSource).toContain('useUnitPreferences');
    expect(screenSource).toContain('formatWeightValue, weight: weightUnit');
    expect(screenSource).toContain('formatWeight(set.weight)');
    expect(progressSource).toContain('useUnitPreferences');
    expect(progressSource).toContain('formatWeightValue, weight: weightUnit');
    expect(progressSource).toContain('formatWeight(metrics.bestWeight)');
    expect(progressSource).toContain('formatWeight(metrics.estimatedOneRepMax)');
    expect(screenSource).not.toContain('{set.weight} kg');
    expect(progressSource).not.toContain('`${metrics.bestWeight} kg`');
  });

  it('converts volume metrics and chart points from canonical kilograms', () => {
    expect(progressSource).toContain('weightFromKg(valueKg, weightUnit)');
    expect(progressSource).toContain('weightFromKg(point.value, weightUnit)');
    expect(progressSource).toContain('points={volumeTrend}');
    expect(progressSource).toContain('unit={weightUnit}');
    expect(progressSource).toContain('maxLabel={copy.high(unit)}');
    expect(progressSource).toContain('minLabel={copy.low(unit)}');
    expect(progressSource).toContain('formatNumber(value, { maximumFractionDigits: digits })');
    expect(progressSource).not.toContain('Math.round(metrics.totalVolume).toLocaleString()} kg');
  });
});
