import { describe, expect, test } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync: (path: string, encoding: string) => string;
};
const { resolve } = require('path') as {
  resolve: (...parts: string[]) => string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Workout Safety Gate responsive and accessibility contracts', () => {
  test('review metrics share narrow width instead of owning intrinsic copy width', () => {
    const screen = readSource(
      'src/features/workouts/screens/WorkoutSafetyGateScreen.tsx',
    );
    const styles = readSource(
      'src/features/workouts/screens/workoutSafetyGateScreen.styles.ts',
    );

    expect(screen.match(/<View style={styles\.metricCell}>/g)).toHaveLength(2);
    expect(styles).toMatch(/metricCell:\s*\{[\s\S]*?flex: 1,[\s\S]*?minWidth: 0/);
    expect(styles).toMatch(/metricLabel:\s*\{[\s\S]*?flexShrink: 1/);
  });

  test('secondary Safety Gate navigation actions expose button semantics and shrinkable copy', () => {
    const screen = readSource(
      'src/features/workouts/screens/WorkoutSafetyGateScreen.tsx',
    );
    const styles = readSource(
      'src/features/workouts/screens/workoutSafetyGateScreen.styles.ts',
    );

    expect(screen).toContain('accessibilityLabel={copy.recoveryCheckIn}');
    expect(screen).toContain('accessibilityLabel={copy.limitations}');
    expect(screen.match(/accessibilityRole="button"/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(styles).toMatch(/smallAction:\s*\{[\s\S]*?minWidth: 0/);
    expect(styles).toMatch(/smallActionLabel:\s*\{[\s\S]*?flexShrink: 1[\s\S]*?textAlign: 'center'/);
  });
});
