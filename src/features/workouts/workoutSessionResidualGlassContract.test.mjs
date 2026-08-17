import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const notes = read('src/features/workouts/components/finish/FinishWorkoutNotes.tsx');
const navigator = read('src/components/workouts/WorkoutSessionExerciseNavigator.tsx');
const header = read('src/components/workouts/WorkoutSessionHeader.tsx');
const progress = read('src/components/workouts/WorkoutSessionProgressCard.tsx');

describe('Workout session residual Liquid Glass materials', () => {
  it('keeps finish notes on control glass material', () => {
    expect(notes).toContain('backgroundColor: glass.controlFill');
    expect(notes).toContain('borderColor: glass.controlBorder');
    expect(notes).not.toContain('colors.surfaceSecondary');
    expect(notes).not.toContain('colors.borderSubtle');
  });

  it('keeps exercise navigator states palette-owned', () => {
    expect(navigator).toContain('backgroundColor: glass.controlFill');
    expect(navigator).toContain('backgroundColor: glass.semanticAccentFill');
    expect(navigator).toContain('backgroundColor: glass.accentFill');
    expect(navigator).not.toContain('colors.surfaceSecondary');
    expect(navigator).not.toContain('colors.accentSoft');
    expect(navigator).not.toContain('colors.borderSubtle');
  });

  it('keeps session progress tracks on control glass material', () => {
    for (const source of [header, progress]) {
      expect(source).toContain('backgroundColor: glass.controlFill');
      expect(source).not.toContain('colors.backgroundSelected');
    }
  });
});
