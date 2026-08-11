import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const screen = readSource('src/features/workouts/screens/WorkoutSessionScreen.tsx');
const emptyWorkout = readSource(
  'src/features/workouts/components/session/WorkoutSessionEmptyWorkoutCard.tsx',
);
const exerciseSection = readSource(
  'src/features/workouts/components/session/SessionExerciseSection.tsx',
);
const setRow = readSource(
  'src/features/workouts/components/session/SessionSetRow.tsx',
);
const rpeSheet = readSource(
  'src/features/workouts/components/session/RpeBottomSheet.tsx',
);
const modals = readSource(
  'src/features/workouts/components/session/WorkoutSessionModals.tsx',
);
const sharedStyles = readSource(
  'src/features/workouts/styles/workoutSessionScreenStyles.ts',
);

describe('LG-5 Active Session interaction materials', () => {
  it('uses material-specific feedback for empty-workout actions', () => {
    expect(emptyWorkout).toContain('pressed && styles.addExercisesButtonPressed');
    expect(emptyWorkout).toContain('pressed && styles.testGifButtonPressed');
    expect(emptyWorkout).not.toContain('pressed && styles.pressed');

    expect(sharedStyles).toContain('backgroundColor: glass.accentFill');
    expect(sharedStyles).toContain('backgroundColor: glass.accentPressedFill');
    expect(sharedStyles).toContain('color: glass.accentText');
    expect(sharedStyles).toContain('testGifButtonPressed:');
  });

  it('uses fill-based feedback for exercise-section direct actions', () => {
    expect(exerciseSection).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(exerciseSection).toContain('pressed && styles.headerPressed');
    expect(exerciseSection).toContain('pressed && styles.menuButtonPressed');
    expect(exerciseSection).toContain('pressed && styles.restTimerPressed');
    expect(exerciseSection).toContain('pressed && styles.addSetButtonPressed');
    expect(exerciseSection).toContain('glass.controlPressedFill');
    expect(exerciseSection).toContain('glass.semanticAccentFill');
    expect(exerciseSection).not.toContain('pressed && styles.pressed');
    expect(exerciseSection).not.toContain('opacity: 0.72');
  });

  it('uses semantic material feedback for set completion and RPE editing', () => {
    expect(setRow).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(setRow).toContain('pressed && styles.rpeBadgePressed');
    expect(setRow).toContain(
      'pressed && (completed ? styles.iconCellCompletedPressed : styles.iconCellPressed)',
    );
    expect(setRow).toContain('glass.semanticPositiveFill');
    expect(setRow).toContain('glass.semanticPositiveBorder');
    expect(setRow).toContain('glass.semanticAccentFill');
    expect(setRow).not.toContain('pressed && styles.pressed');
    expect(setRow).not.toContain('opacity: 0.72');
  });

  it('distinguishes selected and unselected RPE pressed material', () => {
    expect(rpeSheet).toContain('RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]');
    expect(rpeSheet).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(rpeSheet).toContain(
      'pressed && (selected ? styles.valueButtonSelectedPressed : styles.valueButtonPressed)',
    );
    expect(rpeSheet).toContain('glass.controlFill');
    expect(rpeSheet).toContain('glass.controlPressedFill');
    expect(rpeSheet).toContain('glass.accentFill');
    expect(rpeSheet).toContain('glass.accentPressedFill');
    expect(rpeSheet).not.toContain('pressed && styles.pressed');
    expect(rpeSheet).not.toContain('opacity: 0.72');
  });

  it('uses material-specific feedback in overflow and replacement sheets', () => {
    expect(modals).toContain('styles.workoutSheetRowDestructivePressed');
    expect(modals).toContain('styles.workoutSheetRowPressed');
    expect(modals).toContain('pressed && styles.overflowActionPressed');
    expect(modals).toContain('pressed && styles.overflowDangerActionPressed');
    expect(modals).toContain('pressed && styles.overflowCancelPressed');
    expect(modals).toContain('pressed && styles.replacementRowPressed');
    expect(modals).not.toContain('pressed && styles.pressed');

    expect(sharedStyles).toContain('resolveLiquidGlassPalette');
    expect(sharedStyles).toContain('glass.controlFill');
    expect(sharedStyles).toContain('glass.controlPressedFill');
    expect(sharedStyles).toContain('backgroundColor: colors.errorSoft');
    expect(sharedStyles).not.toContain('opacity: 0.72');
  });

  it('preserves Active Session lifecycle, virtualization and RPE timing contracts', () => {
    expect(screen).toContain('setActiveWorkoutSessionDraft(draft)');
    expect(screen).toContain('clearActiveWorkoutSessionDraft()');
    expect(screen).toContain("router.replace('/workouts')");
    expect(screen).toContain("router.push('/workout-session-finish')");
    expect(screen).toContain("router.push('/workout-session/exercises')");

    expect(modals).toContain('data={exercises}');
    expect(modals).toContain('keyExtractor={(exercise) => exercise.id}');
    expect(modals).toContain('initialNumToRender={12}');
    expect(modals).toContain('maxToRenderPerBatch={12}');
    expect(modals).toContain('windowSize={7}');

    expect(rpeSheet).toContain('setLocalSelection(value)');
    expect(rpeSheet).toContain('onSelect(value)');
    expect(rpeSheet).toContain('setTimeout(() => dismissWithAnimation(), 120)');
    expect(rpeSheet).toContain('dismissWithAnimation(onSkip)');
  });
});
