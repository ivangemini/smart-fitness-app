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
const stylesSource = readFileSync(
  resolve(projectRoot, 'src/features/workouts/styles/newRoutineScreenStyles.ts'),
  'utf8',
);
const screenSource = readFileSync(
  resolve(projectRoot, 'src/features/workouts/screens/NewRoutineScreen.tsx'),
  'utf8',
);

describe('New Routine editor touch targets', () => {
  it('keeps the expanded exercise notes input at the 44 px interaction minimum', () => {
    expect(stylesSource).toMatch(/exerciseNotesInput:\s*\{[\s\S]*?minHeight: 44/);
    expect(screenSource).toContain('style={styles.exerciseNotesInput}');
  });

  it('retains keyboard-aware scrolling for the routine editor', () => {
    expect(screenSource).toContain('automaticallyAdjustKeyboardInsets');
    expect(screenSource).toContain('keyboardShouldPersistTaps="handled"');
    expect(screenSource).toContain('paddingBottom: insets.bottom + Spacing.six');
  });

  it('virtualizes the user-growing exercise collection with stable exercise ids', () => {
    expect(screenSource).toContain('<FlatList');
    expect(screenSource).toContain('data={planExercises}');
    expect(screenSource).toContain('keyExtractor={(item) => item.exercise.id}');
    expect(screenSource).not.toContain('planExercises.map((item)');
  });
});
