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

const modals = readSource(
  'src/features/workouts/components/session/WorkoutSessionModals.tsx',
);
const missing = readSource(
  'src/features/workouts/components/session/WorkoutSessionMissingState.tsx',
);
const styles = readSource(
  'src/features/workouts/styles/workoutSessionScreenStyles.ts',
);

describe('workout session overflow material', () => {
  it('uses shared elevated material for both overflow sheets', () => {
    expect(modals.match(/<LiquidGlassSurface radius=\{24\} style=\{styles\.overflowSheet\} variant="elevated">/g)?.length).toBe(2);
    expect(modals.match(/style=\{styles\.overflowSheetHitArea\}/g)?.length).toBe(2);
    expect(styles).toContain('backgroundColor: colors.overlay');

    const sheetStart = styles.indexOf('overflowSheet: {');
    const sheetEnd = styles.indexOf('overflowSheetHitArea: {', sheetStart);
    const sheet = styles.slice(sheetStart, sheetEnd);
    expect(sheet).not.toContain('backgroundColor');
    expect(styles).not.toContain("backgroundColor: 'rgba(0, 0, 0, 0.5)'");
  });

  it('preserves exercise overflow replace/delete/cancel contracts', () => {
    expect(modals).toContain('onPress={() => exercise && onReplace(exercise)}');
    expect(modals).toContain('onPress={() => exercise && onDelete(exercise)}');
    expect(modals).toContain('onPress={onCancel}');
    expect(modals).toContain('onRequestClose={onDismiss}');
    expect(modals).toContain('paddingBottom: bottomInset + Spacing.three');
  });

  it('preserves workout overflow RPE/add/discard contracts', () => {
    expect(modals).toContain('onValueChange={onTrackRpeChange}');
    expect(modals).toContain('onPress={onAddExercises}');
    expect(modals).toContain('onPress={onDiscard}');
    expect(modals).toContain('onRequestClose={onClose}');
  });

  it('uses a shared accessible missing-state action', () => {
    expect(missing).toContain('<SecondaryButton');
    expect(missing).toContain("label={t('workouts.session.backToWorkouts')}");
    expect(missing).toContain('onPress={onBackToWorkouts}');
    expect(styles).not.toContain('textAction:');
    expect(styles).not.toContain('textActionLabel:');
  });

  it('leaves replacement-exercise virtualization intact', () => {
    expect(modals).toContain('data={exercises}');
    expect(modals).toContain('initialNumToRender={12}');
    expect(modals).toContain('maxToRenderPerBatch={12}');
    expect(modals).toContain('windowSize={7}');
    expect(modals).toContain('onPress={() => onSelect(exercise)}');
  });
});
