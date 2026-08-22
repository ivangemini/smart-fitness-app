import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: string): string };
const { resolve } = require('path') as { resolve(...parts: string[]): string };

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Strength & Training drilldown', () => {
  it('uses shared deterministic analytics and bounded period/exercise selection', () => {
    const screen = readSource('src/app/training-progress.tsx');

    expect(screen).toContain('buildTrainingProgressAnalytics(workoutSessions');
    expect(screen).toContain('buildExerciseProgressSeries({');
    expect(screen).toContain('maxExercises: 12');
    expect(screen).toContain('maxPoints: 24');
    expect(screen).toContain("type PeriodKey = '7' | '30' | '90'");
    expect(screen).toContain("{ label: '7D', value: '7' }");
    expect(screen).toContain("{ label: '30D', value: '30' }");
    expect(screen).toContain("{ label: '90D', value: '90' }");
    expect(screen).toContain('<SegmentedControl');
    expect(screen).toContain('selected={key === selectedExerciseKey}');
    expect(screen).toContain('<TrainingIntelligenceSection');
    expect(screen).toContain('windowDays={periodDays}');
  });

  it('keeps unit conversion and conservative chart evidence explicit', () => {
    const screen = readSource('src/app/training-progress.tsx');
    const series = readSource('src/lib/progress/exerciseProgressSeries.ts');

    expect(screen).toContain('weightFromKg(latestPoint.totalVolume, weightUnit)');
    expect(screen).toContain('value: weightFromKg(point.bestEstimated1Rm as number, weightUnit)');
    expect(screen).toContain('point.bestEstimated1Rm !== null');
    expect(screen).toContain('comparablePoints.length >= 2');
    expect(screen).toContain('<ProgressTrendChart');
    expect(series).toContain('calculateComparableEstimated1Rm');
    expect(series).not.toContain('calculateEstimated1RM');
  });

  it('keeps raw workout history as a secondary evidence path', () => {
    const screen = readSource('src/app/training-progress.tsx');

    expect(screen).toContain("router.push('/workout-history')");
    expect(screen).not.toContain('getProgressAnalytics');
  });
});