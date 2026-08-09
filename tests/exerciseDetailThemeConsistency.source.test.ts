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

const detailSource = readSource(
  'src/features/exercises/screens/ExerciseDetailScreen.tsx',
);
const detailStylesSource = readSource(
  'src/features/exercises/screens/ExerciseDetailScreen.styles.ts',
);
const muscleMapSource = readSource(
  'src/features/exercises/components/MuscleMap.tsx',
);
const statChipSource = readSource('src/components/ui/StatChip.tsx');

describe('Exercise detail theme consistency', () => {
  it('uses the active app theme and shared floating control', () => {
    expect(detailSource).toContain('useAppTheme');
    expect(detailSource).toContain('createExerciseDetailStyles(colors)');
    expect(detailSource).toContain('LiquidGlassIconButton');
    expect(detailSource).toContain('testID="exercise-detail-back"');
    expect(detailSource).not.toContain('accessibilityLabel={copy.more}');
    expect(detailStylesSource).not.toContain('Colors.dark.');
  });

  it('keeps exercise secondary visualizations theme adaptive', () => {
    expect(muscleMapSource).toContain('createStyles(colors)');
    expect(muscleMapSource).not.toContain('Colors.dark.');
    expect(statChipSource).toContain('useAppTheme');
    expect(statChipSource).toContain('createStyles(colors)');
    expect(statChipSource).not.toContain('Colors.dark.');
  });

  it('preserves responsive and media behavior', () => {
    expect(detailSource).toContain('useSafeAreaInsets');
    expect(detailSource).toContain('paddingBottom: insets.bottom + Spacing.eight');
    expect(detailSource).toContain('paddingTop: insets.top + Spacing.three');
    expect(detailSource).toContain('ExerciseMediaPreview');
    expect(detailSource).toContain('setPlaying((current) => !current)');
    expect(detailStylesSource).toContain("flexWrap: 'wrap'");
  });
});
