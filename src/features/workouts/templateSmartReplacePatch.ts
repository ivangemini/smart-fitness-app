import type {
  Exercise,
  Workout,
  WorkoutTemplateReplacementPatch,
  WorkoutTemplateReplacementPatchStatus,
} from '@/types';

import {
  buildTemplateSmartReplaceFingerprint,
  buildTemplateSmartReplacePreview,
} from './templateSmartReplacePreview';

export type TemplateSmartReplacePatchResult = {
  status: WorkoutTemplateReplacementPatchStatus;
  workout: Workout;
};

export function applyTemplateSmartReplacePatch(
  workout: Workout,
  patch: WorkoutTemplateReplacementPatch,
  exerciseCatalog: readonly Exercise[],
): TemplateSmartReplacePatchResult {
  if (
    workout.id !== patch.templateId ||
    workout.isCustom !== true ||
    !patch.sourceExerciseId ||
    !patch.replacementExerciseId
  ) {
    return { status: 'blocked', workout };
  }

  if (buildTemplateSmartReplaceFingerprint(workout) !== patch.expectedFingerprint) {
    return { status: 'stale', workout };
  }

  const preview = buildTemplateSmartReplacePreview({
    workout,
    sourceExerciseId: patch.sourceExerciseId,
    replacementExerciseId: patch.replacementExerciseId,
    exerciseCatalog,
  });

  return preview.status === 'ready'
    ? { status: 'applied', workout: preview.projectedWorkout }
    : { status: 'blocked', workout };
}
