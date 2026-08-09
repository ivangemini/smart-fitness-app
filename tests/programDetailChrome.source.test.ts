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

const screen = readSource('src/features/workouts/screens/ProgramDetailScreen.tsx');
const styles = readSource('src/features/workouts/screens/programDetailScreen.styles.ts');

describe('program detail chrome', () => {
  it('uses shared glass navigation controls', () => {
    expect(screen.match(/<LiquidGlassIconButton/g)?.length).toBe(2);
    expect(screen).toContain('accessibilityLabel={copy.back}');
    expect(screen).toContain('Icon={ChevronLeft}');
    expect(screen).toContain('accessibilityLabel={copy.moreOptions}');
    expect(screen).toContain('Icon={Ellipsis}');
    expect(screen).toContain('onPress={openMenu}');
    expect(styles).not.toContain('circleButton:');
    expect(styles).not.toContain('moreNavLabel:');
    expect(styles).not.toContain('backLabel:');
  });

  it('keeps routine-row secondary actions at 44 by 44', () => {
    expect(styles).toMatch(/playButton:\s*\{[\s\S]*?height:\s*44[\s\S]*?width:\s*44/);
    expect(styles).toMatch(/moreButton:\s*\{[\s\S]*?height:\s*44[\s\S]*?width:\s*44/);
    expect(styles).not.toContain('width: 36');
    expect(styles).not.toContain('width: 28');
  });

  it('preserves program mutation and navigation contracts', () => {
    expect(screen).toContain('saveTrainingProgram({');
    expect(screen).toContain('favorite: !Boolean(program.metadata?.favorite)');
    expect(screen).toContain('deleteTrainingProgram(program.id)');
    expect(screen).toContain('workoutTemplateId: undefined');
    expect(screen).toContain('workoutTemplateName: undefined');
    expect(screen).toContain("pathname: '/workouts/routine/new'");
    expect(screen).toContain("pathname: '/workouts/template/[workoutId]'");
    expect(screen).toContain('onPress={() => openWorkoutOrExplain(workoutId)}');
    expect(screen).toContain('onPress: () => removeWorkout(row.dayId)');
  });

  it('keeps localized copy and inset-aware content', () => {
    expect(screen).toContain('getProgramRoutineCopy(locale)');
    expect(screen).toContain('getWorkoutsHubProgramTitle(t, program)');
    expect(screen).toContain('getWorkoutsHubWorkoutTitle(t, workout)');
    expect(screen).toContain('paddingBottom: insets.bottom + Spacing.six');
    expect(screen).toContain('paddingBottom: insets.bottom + Spacing.three');
  });
});
