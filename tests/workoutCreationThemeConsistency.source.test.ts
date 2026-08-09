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

const picker = readSource('src/components/workouts/ProgramWorkoutPickerModal.tsx');
const editor = readSource('src/components/workouts/ProgramWorkoutEditorModal.tsx');
const builder = readSource('src/components/workouts/WorkoutBuilderCard.tsx');
const exerciseRow = readSource('src/components/workouts/WorkoutBuilderExerciseRow.tsx');
const boundary = [picker, editor, builder, exerciseRow].join('\n');

describe('workout creation theme consistency', () => {
  it('uses the active semantic theme across the creation boundary', () => {
    expect(boundary).not.toContain('Colors.dark');
    for (const source of [picker, editor, builder, exerciseRow]) {
      expect(source).toContain('useAppTheme');
      expect(source).toContain('createStyles(colors)');
    }
    expect(builder).toContain('placeholderTextColor={colors.textMuted}');
    expect(exerciseRow).toContain('placeholderTextColor={colors.textMuted}');
  });

  it('uses shared elevated modal chrome without changing picker virtualization', () => {
    expect(picker).toContain('<LiquidGlassSurface');
    expect(picker).toContain('<LiquidGlassIconButton');
    expect(picker).toContain('<PrimaryButton');
    expect(picker).toContain('data={availableWorkouts}');
    expect(picker).toContain('initialNumToRender={6}');
    expect(picker).toContain('maxToRenderPerBatch={6}');
    expect(picker).toContain('windowSize={5}');
    expect(picker).toContain('accessibilityRole="checkbox"');
    expect(picker).toContain('accessibilityState={{ checked: selected }}');
  });

  it('preserves editor keyboard safety and save/draft mutation contracts', () => {
    expect(editor).toContain('<KeyboardAvoidingView');
    expect(editor).toContain('automaticallyAdjustKeyboardInsets');
    expect(editor).toContain("workoutTitle.trim().length === 0 || draftExercises.length === 0");
    expect(editor).toContain('onSaveWorkout({');
    expect(editor).toContain('setDraftExercises((current) =>');
    expect(editor).toContain('onMoveExercise={moveExercise}');
    expect(editor).toContain('onDuplicateExercise={duplicateExercise}');
    expect(editor).toContain('onRemoveDraftExercise={removeExercise}');
  });

  it('preserves builder actions with usable wrapping touch targets', () => {
    expect(builder).toContain('<AppCard>');
    expect(builder).toContain('<AppButton');
    expect(builder).toContain('draftExercises.map((exercise, index)');
    expect(exerciseRow).toContain('onPress={() => onMove(exercise.id, -1)}');
    expect(exerciseRow).toContain('onPress={() => onMove(exercise.id, 1)}');
    expect(exerciseRow).toContain('onPress={() => onDuplicate(exercise.id)}');
    expect(exerciseRow).toContain('onPress={() => onDelete(exercise.id)}');
    expect(exerciseRow).toContain("flexWrap: 'wrap'");
    expect(exerciseRow).toContain('minHeight: 44');
    expect(exerciseRow).not.toContain('minHeight: 34');
    expect(exerciseRow).toContain('selectionColor={colors.accent}');
  });
});
