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

const presentationSource = () =>
  [
    readSource('src/features/workouts/screens/ProgramDetailScreen.tsx'),
    readSource('src/features/workouts/screens/NewRoutineScreen.tsx'),
    readSource('src/features/workouts/components/NewRoutineModals.tsx'),
  ].join('\n');

describe('program and routine localization', () => {
  it('provides English and Russian copy for program detail and routine creation', () => {
    const source = presentationSource();
    const copy = readSource('src/localization/programRoutineCopy.ts');

    expect(source).toContain('getProgramRoutineCopy');
    expect(copy).toContain('Загрузка программы…');
    expect(copy).toContain('Добавить тренировку в программу');
    expect(copy).toContain('Новая тренировка');
    expect(copy).toContain('Удалить упражнение?');
    expect(copy).toContain('Loading program…');
    expect(copy).toContain('Add routine to program');
    expect(copy).toContain('New Routine');
    expect(copy).toContain('Delete exercise?');
  });

  it('uses locale, stable title mapping and selected weight-unit boundaries', () => {
    const program = readSource(
      'src/features/workouts/screens/ProgramDetailScreen.tsx',
    );
    const routine = readSource(
      'src/features/workouts/screens/NewRoutineScreen.tsx',
    );
    const source = presentationSource();

    expect(program).toContain('getWorkoutsHubProgramTitle');
    expect(program).toContain('getWorkoutsHubWorkoutTitle');
    expect(program).toContain('formatNumber');
    expect(routine).toContain('useUnitPreferences');
    expect(routine).toContain('{weight}');
    expect(routine).toContain('copy.emptySetLine');
    expect(source).not.toContain('new Intl.');
    expect(source).not.toContain('toLocaleString');
    expect(source).not.toMatch(/['"`]\s*kg\b/);
    expect(source).not.toContain('>kg<');
  });

  it('preserves program favorite, removal, deletion and navigation contracts', () => {
    const program = readSource(
      'src/features/workouts/screens/ProgramDetailScreen.tsx',
    );

    expect(program).toContain('saveTrainingProgram');
    expect(program).toContain('deleteTrainingProgram(program.id)');
    expect(program).toContain('favorite: !Boolean(program.metadata?.favorite)');
    expect(program).toContain('workoutTemplateId: undefined');
    expect(program).toContain('workoutTemplateName: undefined');
    expect(program).toContain("pathname: '/workouts/routine/new'");
    expect(program).toContain("pathname: '/workouts/template/[workoutId]'");
    expect(program).not.toContain('deleteWorkoutSession');
  });

  it('preserves routine template creation and program attachment contracts', () => {
    const routine = readSource(
      'src/features/workouts/screens/NewRoutineScreen.tsx',
    );

    expect(routine).toContain('formatWorkoutPlanDescription');
    expect(routine).toContain('addWorkoutTemplate({');
    expect(routine).toContain('attachWorkoutsToProgramDraft');
    expect(routine).toContain('saveTrainingProgram(');
    expect(routine).toContain("pathname: '/workouts/program/[programId]'");
    expect(routine).toContain("savedWorkout: '1'");
    expect(routine).toContain('id: workoutId');
    expect(routine).toContain('createdAt: now');
  });

  it('localizes accessibility and removes hard-coded user controls', () => {
    const source = presentationSource();

    expect(source).toContain('accessibilityLabel={copy.addRoutine}');
    expect(source).toContain('accessibilityState={{ disabled: !canSave }}');
    expect(source).toContain('accessibilityState={{ expanded }}');
    expect(source).toContain('accessibilityLabel={copy.addExercises}');
    expect(source).not.toContain('>Add routine to program<');
    expect(source).not.toContain('>New Routine<');
    expect(source).not.toContain('placeholder="Routine name"');
    expect(source).not.toContain('>Replace exercise<');
    expect(source).not.toContain("Alert.alert('Delete exercise?'");
  });

  it('keeps the routine exercise picker virtualized, complete and inset-safe', () => {
    const modals = readSource(
      'src/features/workouts/components/NewRoutineModals.tsx',
    );
    const styles = readSource(
      'src/features/workouts/styles/newRoutineScreenStyles.ts',
    );
    const pickerPanelStart = styles.indexOf('pickerPanel: {');
    const pickerPanelEnd = styles.indexOf('pickerRow: {', pickerPanelStart);
    const pickerPanel = styles.slice(pickerPanelStart, pickerPanelEnd);

    expect(modals).toContain('<LiquidGlassSurface');
    expect(modals).toContain('variant="elevated"');
    expect(modals).toContain('data={exercises}');
    expect(modals).toContain('initialNumToRender={8}');
    expect(modals).toContain('maxToRenderPerBatch={8}');
    expect(modals).toContain('windowSize={5}');
    expect(modals).toContain('paddingBottom: insets.bottom + Spacing.three');
    expect(modals).toContain('accessibilityState={{ selected: selected && mode?.type === \'add\' }}');
    expect(modals).toContain('onReplace(mode.exerciseId, exercise)');
    expect(modals).toContain('onAdd(exercise)');
    expect(modals).not.toContain('exercises.slice(0, 100)');
    expect(pickerPanel).not.toContain('backgroundColor');
    expect(styles).toMatch(/textButton:\s*\{[\s\S]*?minHeight:\s*44/);
  });

  it('uses stack-screen safe-area clearance for new routine content', () => {
    const routine = readSource(
      'src/features/workouts/screens/NewRoutineScreen.tsx',
    );
    const rootLayout = readSource('src/app/_layout.tsx');

    expect(rootLayout).toContain('name="workouts/routine/new"');
    expect(rootLayout).toContain('options={{ headerShown: false }}');
    expect(routine).toContain('{ paddingBottom: insets.bottom + Spacing.six }');
    expect(routine).not.toContain('BottomTabInset');
  });
});
