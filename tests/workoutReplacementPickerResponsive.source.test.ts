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

const modalsSource = readSource(
  'src/features/workouts/components/session/WorkoutSessionModals.tsx',
);
const stylesSource = readSource(
  'src/features/workouts/styles/workoutSessionScreenStyles.ts',
);
const replacementSource = modalsSource.slice(
  modalsSource.indexOf('export function ReplacementExerciseModal'),
);

describe('replacement exercise picker responsive contract', () => {
  it('virtualizes the full exercise collection instead of mapping a capped ScrollView', () => {
    expect(replacementSource).toContain('<FlatList');
    expect(replacementSource).toContain('data={exercises}');
    expect(replacementSource).toContain('initialNumToRender={12}');
    expect(replacementSource).toContain('maxToRenderPerBatch={12}');
    expect(replacementSource).toContain('windowSize={7}');
    expect(replacementSource).not.toContain('<ScrollView');
    expect(replacementSource).not.toContain('slice(0, 100)');
    expect(replacementSource).not.toContain('.map((exercise)');
  });

  it('uses shared material and respects the bottom safe area', () => {
    expect(replacementSource).toContain('<LiquidGlassSurface');
    expect(replacementSource).toContain('<LiquidGlassIconButton');
    expect(replacementSource).toContain('Icon={X}');
    expect(replacementSource).toContain('useSafeAreaInsets()');
    expect(replacementSource).toContain('paddingBottom: insets.bottom + Spacing.three');
    expect(stylesSource).toContain("maxHeight: '78%'");
    expect(stylesSource).toContain("overflow: 'hidden'");
  });

  it('preserves selection semantics and accessible rows', () => {
    expect(replacementSource).toContain('accessibilityLabel={exercise.name}');
    expect(replacementSource).toContain('accessibilityRole="button"');
    expect(replacementSource).toContain('onPress={() => onSelect(exercise)}');
    expect(replacementSource).toContain("t('workouts.session.exerciseFallback')");
  });
});
