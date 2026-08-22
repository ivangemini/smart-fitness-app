import { describe, expect, it } from 'vitest';

import {
  buildWorkoutTemplateExerciseEdits,
  buildWorkoutTemplateExercises,
} from './workoutTemplateEditing';

describe('workout template exercise edits', () => {
  it('carries canonical library IDs through the new-template create path', () => {
    const edits = buildWorkoutTemplateExerciseEdits([
      { id: 'bench-press', name: 'Bench Press' },
      { id: 'barbell-row', name: 'Barbell Row' },
    ]);

    expect(edits).toEqual([
      { sourceExerciseId: 'bench-press', name: 'Bench Press' },
      { sourceExerciseId: 'barbell-row', name: 'Barbell Row' },
    ]);

    expect(buildWorkoutTemplateExercises(edits, '2026-08-23T00:00:00.000Z')).toMatchObject([
      { id: 'bench-press', name: 'Bench Press' },
      { id: 'barbell-row', name: 'Barbell Row' },
    ]);
  });
});
