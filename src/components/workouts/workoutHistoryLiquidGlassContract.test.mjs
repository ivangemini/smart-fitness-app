import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');
const history = read('src/components/workouts/WorkoutHistorySessionCard.tsx');
const libraryStyles = read(
  'src/components/workouts/exercise-library/workoutExerciseLibraryCardStyles.ts',
);

describe('workout Liquid Glass input source contract', () => {
  it('keeps history editor fields on palette-owned control material', () => {
    expect(history).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(history).toContain('backgroundColor: glass.controlFill');
    expect(history).toContain('borderColor: glass.controlBorder');
    expect(history).toContain('borderWidth: StyleSheet.hairlineWidth');
    expect(history).not.toContain('backgroundColor: colors.backgroundSecondary');
  });

  it('keeps exercise-library search and custom fields on palette-owned control material', () => {
    expect(libraryStyles).toContain('backgroundColor: glass.controlFill');
    expect(libraryStyles).toContain('borderColor: glass.controlBorder');
    expect(libraryStyles).not.toContain('backgroundColor: colors.surfacePrimary');
  });
});
