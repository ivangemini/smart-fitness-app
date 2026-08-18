import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const sources = {
  picker: read('src/components/workouts/ProgramWorkoutPickerModal.tsx'),
  builder: read('src/components/workouts/WorkoutBuilderCard.tsx'),
  exercise: read('src/components/workouts/WorkoutBuilderExerciseRow.tsx'),
};

describe('workout builder residual Liquid Glass materials', () => {
  it('uses active glass materials for empty, form, row and destructive owners', () => {
    expect(sources.picker).toContain('backgroundColor: glass.controlFill');
    expect(sources.picker).toContain('borderColor: glass.accentBorder');
    expect(sources.builder).toContain('borderColor: glass.controlBorder');
    expect(sources.exercise).toContain('backgroundColor: glass.cardFill');
    expect(sources.exercise).toContain('backgroundColor: glass.destructivePressedFill');
  });

  it('does not fall back to inventoried legacy builder material tokens', () => {
    const combined = Object.values(sources).join('\n');
    expect(combined).not.toMatch(
      /colors\.(surfaceSecondary|backgroundElement|errorSoft|borderSubtle)\b/,
    );
  });
});
