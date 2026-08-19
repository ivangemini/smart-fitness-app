import { describe, expect, it } from 'vitest';

import { getRequestedTrainingProgressExerciseKey } from './trainingProgressSelection';

describe('requested training progress exercise', () => {
  it('prefers canonical exercise id', () => {
    expect(
      getRequestedTrainingProgressExerciseKey({
        exerciseId: ' bench-press ',
        exerciseName: 'Bench Press',
      }),
    ).toBe('bench-press');
  });

  it('falls back to the same normalized legacy-name key used by Training Progress', () => {
    expect(
      getRequestedTrainingProgressExerciseKey({ exerciseName: [' Bench Press '] }),
    ).toBe('name:bench press');
  });

  it('returns null for an empty request', () => {
    expect(getRequestedTrainingProgressExerciseKey({})).toBeNull();
  });
});
