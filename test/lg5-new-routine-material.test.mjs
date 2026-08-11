import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const screen = readSource('src/features/workouts/screens/NewRoutineScreen.tsx');
const modals = readSource('src/features/workouts/components/NewRoutineModals.tsx');
const styles = readSource('src/features/workouts/styles/newRoutineScreenStyles.ts');

describe('LG-5 New Routine interaction materials', () => {
  it('uses material-specific pressed feedback in the routine editor', () => {
    expect(screen).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(screen).toContain('pressed && styles.textButtonPressed');
    expect(screen).toContain('pressed && styles.navButtonPressed');
    expect(screen).toContain('pressed && styles.exerciseHeaderPressed');
    expect(screen).toContain('pressed && styles.exerciseMenuButtonPressed');
    expect(screen).toContain('pressed && styles.addSetButtonPressed');
    expect(screen).toContain('pressed && styles.addButtonPressed');
    expect(screen).not.toContain('pressed && styles.pressed');
  });

  it('uses material-specific pressed feedback in picker and action modals', () => {
    expect(modals.match(/resolveLiquidGlassPalette\(resolvedAppearance\)/g)?.length).toBe(2);
    expect(modals).toContain('pressed && styles.textButtonPressed');
    expect(modals).toContain('pressed && styles.pickerRowPressed');
    expect(modals).toContain('pressed && styles.menuActionPressed');
    expect(modals).toContain('pressed && styles.deleteMenuActionPressed');
    expect(modals).not.toContain('pressed && styles.pressed');
  });

  it('owns normal and pressed materials with Liquid Glass tokens', () => {
    expect(styles).toContain('glass.accentFill');
    expect(styles).toContain('glass.accentBorder');
    expect(styles).toContain('glass.accentPressedFill');
    expect(styles).toContain('glass.controlFill');
    expect(styles).toContain('glass.controlBorder');
    expect(styles).toContain('glass.controlPressedFill');
    expect(styles).toContain('glass.semanticAccentFill');
    expect(styles).toContain('backgroundColor: colors.errorSoft');
    expect(styles).not.toContain('opacity: 0.72');
    expect(styles).toContain('opacity: 0.35');
  });

  it('preserves routine creation, virtualization, keyboard and safe-area contracts', () => {
    expect(screen).toContain('formatWorkoutPlanDescription');
    expect(screen).toContain('addWorkoutTemplate({');
    expect(screen).toContain('attachWorkoutsToProgramDraft');
    expect(screen).toContain('saveTrainingProgram(');
    expect(screen).toContain("pathname: '/workouts/program/[programId]'");
    expect(screen).toContain("savedWorkout: '1'");
    expect(screen).toContain('automaticallyAdjustKeyboardInsets');
    expect(screen).toContain('keyboardShouldPersistTaps="handled"');
    expect(screen).toContain('paddingBottom: insets.bottom + Spacing.six');

    expect(modals).toContain('data={exercises}');
    expect(modals).toContain('keyExtractor={(exercise) => exercise.id}');
    expect(modals).toContain('initialNumToRender={8}');
    expect(modals).toContain('maxToRenderPerBatch={8}');
    expect(modals).toContain('windowSize={5}');
    expect(modals).toContain('paddingBottom: insets.bottom + Spacing.three');
  });
});
