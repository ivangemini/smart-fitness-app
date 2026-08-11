import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const detailScreen = readSource(
  'src/features/workouts/screens/ProgramDetailScreen.tsx',
);
const detailStyles = readSource(
  'src/features/workouts/screens/programDetailScreen.styles.ts',
);
const builderScreen = readSource(
  'src/features/workouts/screens/WorkoutBuilderScreen.tsx',
);
const builderRows = readSource(
  'src/features/workouts/screens/WorkoutBuilderProgramWorkouts.tsx',
);
const builderStyles = readSource(
  'src/features/workouts/styles/workoutBuilderScreenStyles.ts',
);

describe('LG-5 program interaction materials', () => {
  it('uses fill-based pressed feedback across Program Detail actions', () => {
    expect(detailScreen).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(detailScreen).toContain('pressed && styles.simpleButtonPressed');
    expect(detailScreen).toContain('pressed && styles.addRoutineRowPressed');
    expect(detailScreen).toContain('pressed && styles.routineBodyPressed');
    expect(detailScreen).toContain('pressed && styles.iconButtonPressed');
    expect(detailScreen).not.toContain('pressed && styles.pressed');

    expect(detailStyles).toContain('glass.controlFill');
    expect(detailStyles).toContain('glass.controlBorder');
    expect(detailStyles).toContain('glass.controlPressedFill');
    expect(detailStyles).not.toContain('opacity: 0.72');
  });

  it('uses material-specific pressed feedback across the Program Builder boundary', () => {
    expect(builderScreen).toContain(
      "resolveLiquidGlassPalette(isWorkoutDarkMode ? 'dark' : 'light')",
    );
    expect(builderScreen).toContain('pressed && styles.primaryButtonPressed');
    expect(builderScreen).toContain('pressed && styles.headerActionPressed');
    expect(builderScreen).toContain('pressed && !saveDisabled && styles.saveActionPressed');
    expect(builderScreen).not.toContain('pressed && styles.pressed');

    expect(builderRows).toContain('pressed && styles.startNextButtonPressed');
    expect(builderRows).toContain('pressed && styles.workoutRowBodyPressed');
    expect(builderRows).toContain('pressed && styles.overflowButtonPressed');
    expect(builderRows).toContain('pressed && styles.addWorkoutButtonPressed');
    expect(builderRows).not.toContain('pressed && styles.pressed');

    expect(builderStyles).toContain('glass.controlFill');
    expect(builderStyles).toContain('glass.controlPressedFill');
    expect(builderStyles).toContain('glass.accentFill');
    expect(builderStyles).toContain('glass.accentPressedFill');
    expect(builderStyles).toContain('glass.semanticAccentFill');
    expect(builderStyles).not.toContain('opacity: 0.72');
  });

  it('preserves program and workout lifecycle contracts', () => {
    expect(detailScreen).toContain('saveTrainingProgram({');
    expect(detailScreen).toContain('deleteTrainingProgram(program.id)');
    expect(detailScreen).toContain("pathname: '/workouts/routine/new'");
    expect(detailScreen).toContain("pathname: '/workouts/template/[workoutId]'");

    expect(builderScreen).toContain("navigation.addListener('beforeRemove'");
    expect(builderScreen).toContain('saveTrainingProgram(saved);');
    expect(builderScreen).not.toContain('saveWorkoutProgram(');
    expect(builderScreen).toContain('attachWorkoutsToProgramDraft(current, workouts, workoutIds)');
    expect(builderScreen).toContain('<KeyboardAvoidingView');
    expect(builderScreen).toContain('automaticallyAdjustKeyboardInsets');
    expect(builderRows).toContain("pathname: '/workouts/template/[workoutId]'");
  });
});
