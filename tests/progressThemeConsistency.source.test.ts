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

const themeAwareFiles = [
  'src/app/(tabs)/progress.tsx',
  'src/components/progress/AddBodyMeasurementCard.tsx',
  'src/components/progress/ProgressTrendChart.tsx',
  'src/components/progress/WeeklyWorkoutVolumeCard.tsx',
  'src/components/progress/SafetyRecoveryProgressCard.tsx',
  'src/components/progress/SafetyRecoveryProgressCard.styles.ts',
  'src/components/progress/SafetyRecoveryWeeklyTrendCard.tsx',
  'src/components/progress/SafetyRecoveryWeeklyTrendCard.styles.ts',
];

describe('Progress theme consistency', () => {
  it.each(themeAwareFiles)('%s does not hard-code the dark palette', (path) => {
    const source = readSource(path);
    expect(source).not.toContain('Colors.dark.');
  });

  it.each([
    'src/app/(tabs)/progress.tsx',
    'src/components/progress/AddBodyMeasurementCard.tsx',
    'src/components/progress/ProgressTrendChart.tsx',
    'src/components/progress/WeeklyWorkoutVolumeCard.tsx',
    'src/components/progress/SafetyRecoveryProgressCard.tsx',
    'src/components/progress/SafetyRecoveryWeeklyTrendCard.tsx',
  ])('%s resolves presentation from AppThemeProvider', (path) => {
    const source = readSource(path);
    expect(source).toContain('useAppTheme');
  });

  it('preserves Progress data, routes and body-measurement behavior', () => {
    const source = readSource('src/app/(tabs)/progress.tsx');
    expect(source).toContain('getProgressAnalytics');
    expect(source).toContain('getWeightTrendEntries');
    expect(source).toContain("router.push('/weight-details')");
    expect(source).toContain("router.push('/weight-entry')");
    expect(source).toContain("router.push('/workout-history')");
    expect(source).toContain('buildBodyMeasurement');
    expect(source).toContain('addBodyMeasurement(result.measurement)');
  });

  it('preserves Safety/Recovery analytics and selected-state interaction semantics', () => {
    const progress = readSource(
      'src/components/progress/SafetyRecoveryProgressCard.tsx',
    );
    const weekly = readSource(
      'src/components/progress/SafetyRecoveryWeeklyTrendCard.tsx',
    );
    expect(progress).toContain('buildSafetyRecoveryProgressAnalytics');
    expect(progress).toContain('accessibilityState={{ selected }}');
    expect(weekly).toContain('buildSafetyRecoveryWeeklyTrend');
    expect(weekly).toContain('accessibilityState={{ selected }}');
  });
});
