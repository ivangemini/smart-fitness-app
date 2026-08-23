import { describe, expect, it } from 'vitest';

import type { Exercise, Workout } from '@/types';

import {
  buildTemplateSmartReplaceFingerprint,
} from './templateSmartReplacePreview';
import { applyTemplateSmartReplacePatch } from './templateSmartReplacePatch';

const replacement: Exercise = {
  id: 'incline-dumbbell-press',
  name: 'Incline Dumbbell Press',
  createdAt: '2026-08-23T00:00:00.000Z',
  isCustom: false,
};

const workout = (): Workout => ({
  id: 'template-1',
  title: 'Push A',
  duration: '20 min',
  isCustom: true,
  createdAt: '2026-08-22T00:00:00.000Z',
  exercises: [
    {
      id: 'bench-press',
      name: 'Bench Press',
      createdAt: '2026-08-20T00:00:00.000Z',
      isCustom: false,
    },
    {
      id: 'barbell-row',
      name: 'Barbell Row',
      createdAt: '2026-08-20T00:00:00.000Z',
      isCustom: false,
    },
  ],
  prescription: [
    {
      sourceSetId: 'bench-set',
      exerciseId: 'bench-press',
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 5,
      targetRpe: 8,
      adjustment: 'maintain',
      rationaleCode: 'keep-load',
    },
  ],
});

const patchFor = (source: Workout) => ({
  templateId: source.id,
  sourceExerciseId: 'bench-press',
  replacementExerciseId: replacement.id,
  expectedFingerprint: buildTemplateSmartReplaceFingerprint(source),
});

describe('applyTemplateSmartReplacePatch', () => {
  it('applies the exact replacement and preserves prescription targets', () => {
    const source = workout();
    const result = applyTemplateSmartReplacePatch(
      source,
      patchFor(source),
      [replacement],
    );

    expect(result.status).toBe('applied');
    expect(result.workout.exercises[0]).toEqual(replacement);
    expect(result.workout.exercises[1]).toEqual(source.exercises[1]);
    expect(result.workout.prescription?.[0]).toEqual({
      sourceSetId: 'bench-set',
      exerciseId: replacement.id,
      exerciseName: replacement.name,
      weight: 100,
      reps: 5,
      targetRpe: 8,
      adjustment: 'maintain',
      rationaleCode: 'keep-load',
    });
  });

  it('returns stale when the template changed after preview', () => {
    const source = workout();
    const patch = patchFor(source);
    const changed = {
      ...source,
      title: 'Push A updated elsewhere',
    };

    const result = applyTemplateSmartReplacePatch(changed, patch, [replacement]);

    expect(result).toEqual({ status: 'stale', workout: changed });
  });

  it('blocks invalid identity or a non-custom template', () => {
    const source = workout();
    expect(
      applyTemplateSmartReplacePatch(
        source,
        { ...patchFor(source), replacementExerciseId: 'missing' },
        [replacement],
      ),
    ).toEqual({ status: 'blocked', workout: source });

    const builtIn = { ...source, isCustom: false };
    expect(
      applyTemplateSmartReplacePatch(
        builtIn,
        {
          ...patchFor(source),
          expectedFingerprint: buildTemplateSmartReplaceFingerprint(builtIn),
        },
        [replacement],
      ),
    ).toEqual({ status: 'blocked', workout: builtIn });
  });
});
