import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const programScreen = readSource('src/features/workouts/screens/ProgramDetailScreen.tsx');
const programStyles = readSource('src/features/workouts/screens/programDetailScreen.styles.ts');
const routineScreen = readSource('src/features/workouts/screens/NewRoutineScreen.tsx');
const routineStyles = readSource('src/features/workouts/styles/newRoutineScreenStyles.ts');
const templateScreen = readSource('src/features/workouts/screens/WorkoutTemplateDetailScreen.tsx');

describe('LG-5 Workouts creation/detail secondary material convergence', () => {
  it('uses Liquid Glass materials for program detail secondary surfaces', () => {
    expect(programScreen).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(programScreen).toContain('createProgramDetailScreenStyles(colors, glass)');
    expect(programStyles).toContain('backgroundColor: glass.elevatedFill');
    expect(programStyles).toContain('backgroundColor: glass.cardFill');
    expect(programStyles).toContain('backgroundColor: glass.controlFill');
    expect(programStyles).toContain('borderColor: glass.cardBorder');
    expect(programStyles).toContain('borderColor: glass.controlBorder');
    expect(programStyles).not.toContain('colors.surfaceSecondary');
  });

  it('uses glass card/control material for routine thumbnails and set inputs', () => {
    expect(routineScreen).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(routineScreen).toContain('createStyles(colors, glass)');
    expect(routineStyles).toContain('backgroundColor: glass.cardFill');
    expect(routineStyles).toContain('borderColor: glass.cardBorder');
    expect(routineStyles).toContain('backgroundColor: glass.controlFill');
    expect(routineStyles).toContain('borderColor: glass.controlBorder');
    expect(routineStyles).not.toContain('colors.surfacePrimary');
  });

  it('drives template detail chrome and thumbnails from the active appearance palette', () => {
    expect(templateScreen).toContain("import { useAppTheme } from '@/theme/AppThemeProvider'");
    expect(templateScreen).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(templateScreen).toContain('createStyles(colors, glass)');
    expect(templateScreen).toContain('backgroundColor: glass.elevatedFill');
    expect(templateScreen).toContain('backgroundColor: glass.cardFill');
    expect(templateScreen).toContain('borderColor: glass.cardBorder');
    expect(templateScreen).not.toContain('colors.backgroundSecondary');
  });

  it('preserves workout creation, editing and start/delete routing contracts', () => {
    expect(programScreen).toContain("pathname: '/workouts/routine/new'");
    expect(programScreen).toContain('saveTrainingProgram({');
    expect(routineScreen).toContain('addWorkoutTemplate({');
    expect(routineScreen).toContain('attachWorkoutsToProgramDraft');
    expect(templateScreen).toContain('startWorkoutSession(workout)');
    expect(templateScreen).toContain("pathname: '/workout-session'");
    expect(templateScreen).toContain('deleteWorkoutTemplate(workout.id)');
  });
});
