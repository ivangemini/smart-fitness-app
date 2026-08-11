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

describe('program builder Liquid Glass interaction states', () => {
  test('workout picker uses adaptive material fills instead of shared pressed opacity', () => {
    const source = readSource('src/components/workouts/ProgramWorkoutPickerModal.tsx');

    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.semanticAccentFill');
    expect(source).not.toMatch(/pressed:\s*\{\s*opacity:/);
  });

  test('builder exercise actions distinguish control, destructive and disabled materials', () => {
    const source = readSource('src/components/workouts/WorkoutBuilderExerciseRow.tsx');

    expect(source).toContain("type MiniActionTone = 'control' | 'destructive'");
    expect(source).toContain('tone="destructive"');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
    expect(source).toContain('backgroundColor: colors.errorSoft');
    expect(source).not.toMatch(/pressed:\s*\{\s*opacity:/);
  });

  test('collapsible workout builder header owns visible pressed material feedback', () => {
    const source = readSource('src/components/workouts/WorkoutBuilderCard.tsx');

    expect(source).toContain('pressed && styles.collapsibleHeaderPressed');
    expect(source).toMatch(
      /collapsibleHeaderPressed:\s*\{[\s\S]*?backgroundColor: glass\.controlPressedFill/,
    );
  });
});
