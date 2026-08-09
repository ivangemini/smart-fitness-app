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

const footerSource = readSource(
  'src/features/workouts/components/session/WorkoutSessionFooterActions.tsx',
);
const emptyCardSource = readSource(
  'src/features/workouts/components/session/WorkoutSessionEmptyWorkoutCard.tsx',
);
const stylesSource = readSource(
  'src/features/workouts/styles/workoutSessionScreenStyles.ts',
);

describe('workout session footer material contract', () => {
  it('uses shared primary and secondary controls for visible-session footer actions', () => {
    expect(footerSource).toContain('PrimaryButton');
    expect(footerSource).toContain('SecondaryButton');
    expect(footerSource).toContain("t('workouts.session.addExercises')");
    expect(footerSource).toContain("t('workouts.session.testGif')");
    expect(footerSource).not.toContain('<Pressable');
  });

  it('keeps footer spacing content-driven instead of offset-positioned', () => {
    expect(footerSource).toContain('styles.sessionFooterActions');
    expect(stylesSource).toContain('sessionFooterActions: {');
    expect(stylesSource).toContain('gap: Spacing.two');
    expect(stylesSource).toContain('paddingVertical: Spacing.six');
    expect(stylesSource).not.toContain('marginTop: 38');
    expect(stylesSource).not.toContain('addExerciseFooterButton:');
    expect(stylesSource).not.toContain('addExerciseFooterLabel:');
    expect(stylesSource).not.toContain('testGifFooterButton:');
  });

  it('does not remove the separate empty-workout actions', () => {
    expect(emptyCardSource).toContain('styles.addExercisesButton');
    expect(emptyCardSource).toContain('styles.testGifButton');
    expect(stylesSource).toContain('addExercisesButton:');
    expect(stylesSource).toContain('testGifButton:');
    expect(stylesSource).toContain('testGifLabel:');
  });
});
