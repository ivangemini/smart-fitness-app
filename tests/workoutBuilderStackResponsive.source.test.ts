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

const screen = readSource('src/features/workouts/screens/WorkoutBuilderScreen.tsx');
const rows = readSource('src/features/workouts/screens/WorkoutBuilderProgramWorkouts.tsx');
const styles = readSource('src/features/workouts/styles/workoutBuilderScreenStyles.ts');
const rootLayout = readSource('src/app/_layout.tsx');

describe('workout builder stack responsiveness', () => {
  it('uses root-stack safe-area clearance without floating-tab padding', () => {
    expect(rootLayout).toContain('name="workouts/builder"');
    expect(rootLayout).toContain('options={{ headerShown: false }}');
    expect(screen).toContain('{ paddingBottom: insets.bottom + Spacing.four }');
    expect(screen).not.toContain('BottomTabInset');
  });

  it('keeps start-next workout at the 44 px interaction minimum', () => {
    expect(rows).toContain('accessibilityLabel={copy.startNextWorkout}');
    expect(rows).toContain("pathname: '/workouts/template/[workoutId]'");
    expect(rows).toContain('params: { workoutId: nextWorkout.id }');
    expect(styles).toMatch(/startNextButton:\s*\{[\s\S]*?minHeight:\s*44/);
    expect(styles).not.toMatch(/startNextButton:\s*\{[\s\S]*?minHeight:\s*36/);
  });

  it('preserves program save, discard and workout-attachment contracts', () => {
    expect(screen).toContain("navigation.addListener('beforeRemove'");
    expect(screen).toContain('serializeProgramDraft(program)');
    expect(screen).toContain('saveTrainingProgram(saved);');
    expect(screen).not.toContain('saveWorkoutProgram(');
    expect(screen).toContain('attachWorkoutsToProgramDraft(current, workouts, workoutIds)');
    expect(screen).toContain('addWorkoutTemplate({');
    expect(screen).toContain('updateWorkoutTemplate(workoutEditorTarget.id, payload)');
    expect(screen).toContain("pathname: '/workouts/program/[programId]'");
  });

  it('retains keyboard-safe builder scrolling', () => {
    expect(screen).toContain('<KeyboardAvoidingView');
    expect(screen).toContain('automaticallyAdjustKeyboardInsets');
    expect(screen).toContain('keyboardShouldPersistTaps="handled"');
  });
});
