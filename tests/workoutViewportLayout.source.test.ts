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

const viewportStyleFiles = [
  'src/features/workouts/styles/workoutSessionScreenStyles.ts',
  'src/features/workouts/screens/workoutSafetyGateScreen.styles.ts',
  'src/features/workouts/screens/workoutHistoryScreen.styles.ts',
  'src/features/workouts/screens/programDetailScreen.styles.ts',
  'src/features/workouts/screens/workoutsScreen.styles.ts',
  'src/features/nutrition/styles/nutritionScreenStyles.ts',
  'src/app/workouts/history.tsx',
] as const;

const workoutsRoute = readSource('src/app/(tabs)/workouts.tsx');
const workoutsScreen = readSource('src/features/workouts/screens/WorkoutsScreen.tsx');

describe('viewport layout regression guards', () => {
  it('keeps scroll/list content viewport-bound without center-shrinking cell owners', () => {
    viewportStyleFiles.forEach((path) => {
      const source = readSource(path);
      expect(source, path).toMatch(
        /container:\s*\{[\s\S]*?alignSelf: 'center',[\s\S]*?minWidth: 0,[\s\S]*?width: '100%',/,
      );
      expect(source, path).toMatch(
        /content:\s*\{[\s\S]*?minWidth: 0,[\s\S]*?width: '100%',/,
      );
      expect(source, path).not.toMatch(/content:\s*\{\s*alignItems: 'center',/);
    });
  });

  it('keeps the sticky workout action above the history and Companion row', () => {
    expect(workoutsScreen).toContain('FLOATING_COMPANION_ENTRY_GAP');
    expect(workoutsScreen).toContain('FLOATING_COMPANION_ENTRY_SIZE');
    expect(workoutsScreen).toContain('export const getWorkoutsStickyActionBottom');
    expect(workoutsScreen).toContain('style={[styles.footer, { bottom: stickyActionBottom }]}');
    expect(workoutsScreen).toContain(
      'stickyActionBottom + WORKOUTS_STICKY_ACTION_MIN_HEIGHT + Spacing.six',
    );
    expect(workoutsRoute).toContain(
      'getFloatingTabBarBottomClearance(insets.bottom, Spacing.two)',
    );
  });
});
