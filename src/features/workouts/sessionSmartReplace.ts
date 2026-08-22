import { getReviewedExerciseIntelligence } from '@/features/exercises/exerciseIntelligence';
import { loadExercisePreference } from '@/features/exercises/preferencesRepository';
import { exerciseRepository } from '@/features/exercises/repository';
import { buildSmartReplaceCandidates } from '@/features/exercises/smartReplace';
import type { Exercise } from '@/types';

import {
  mapSmartReplaceCandidatesToWorkoutCatalog,
  type WorkoutSessionSmartReplaceCandidate,
} from './sessionSmartReplaceModel';

export async function loadWorkoutSessionSmartReplaceCandidates(
  sourceExerciseId: string,
  workoutCatalog: readonly Exercise[],
): Promise<WorkoutSessionSmartReplaceCandidate[]> {
  const intelligence = getReviewedExerciseIntelligence(sourceExerciseId);
  if (!intelligence || intelligence.substitutions.length === 0) return [];

  try {
    const resolved = await Promise.all(
      intelligence.substitutions.map((substitution) =>
        exerciseRepository.getExerciseById(substitution.exerciseId),
      ),
    );
    const resolvedExercises = resolved.filter(
      (exercise): exercise is NonNullable<typeof exercise> => exercise !== null,
    );
    const preferences = Object.fromEntries(
      await Promise.all(
        resolvedExercises.map(async (exercise) => [
          exercise.id,
          await loadExercisePreference(exercise.id),
        ] as const),
      ),
    );
    const ranked = buildSmartReplaceCandidates({
      currentExerciseId: sourceExerciseId,
      reviewedSubstitutions: intelligence.substitutions,
      resolvedExercises,
      preferences,
    });

    return mapSmartReplaceCandidatesToWorkoutCatalog(ranked, workoutCatalog);
  } catch {
    return [];
  }
}
