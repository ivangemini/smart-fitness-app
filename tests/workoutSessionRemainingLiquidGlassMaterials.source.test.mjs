import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const sources = {
  navigator: read('src/components/workouts/WorkoutSessionExerciseNavigator.tsx'),
  header: read('src/components/workouts/WorkoutSessionHeader.tsx'),
  progress: read('src/components/workouts/WorkoutSessionProgressCard.tsx'),
  sessionHeader: read('src/features/workouts/components/session/SessionHeader.tsx'),
  setRow: read('src/features/workouts/components/session/SessionSetRow.tsx'),
  modals: read('src/features/workouts/components/session/WorkoutSessionModals.tsx'),
  notes: read('src/features/workouts/components/finish/FinishWorkoutNotes.tsx'),
};

describe('remaining workout-session Liquid Glass materials', () => {
  it('routes interactive session surfaces through the active glass palette', () => {
    expect(sources.navigator).toContain('glass.controlFill');
    expect(sources.navigator).toContain('glass.semanticAccentFill');
    expect(sources.header).toContain('glass.controlFill');
    expect(sources.progress).toContain('glass.controlFill');
    expect(sources.sessionHeader).toContain('glass.disabledFill');
    expect(sources.sessionHeader).toContain('glass.accentPressedFill');
    expect(sources.setRow).toContain('glass.controlBorder');
    expect(sources.modals).toContain('false: glass.controlFill');
    expect(sources.notes).toContain('backgroundColor: glass.controlFill');
  });

  it('does not fall back to the inventoried legacy session material tokens', () => {
    const combined = Object.values(sources).join('\n');
    expect(combined).not.toMatch(
      /colors\.(surfaceSecondary|surfaceElevated|backgroundSelected|accentSoft|borderSubtle)\b/,
    );
  });
});
