import type { LocalizedExerciseText } from '@/features/exercises/exerciseIntelligence';
import type {
  SmartReplaceCandidate,
  SmartReplaceReasonCode,
} from '@/features/exercises/smartReplace';
import type { Exercise } from '@/types';

export type WorkoutSessionSmartReplaceCandidate = {
  exercise: Exercise;
  label: LocalizedExerciseText;
  rationale: LocalizedExerciseText;
  reasonCodes: SmartReplaceReasonCode[];
};

export const selectWorkoutSessionSmartReplaceText = (
  value: LocalizedExerciseText,
  locale: string,
) => (locale.toLowerCase().startsWith('ru') ? value.ru : value.en);

export function mapSmartReplaceCandidatesToWorkoutCatalog(
  candidates: readonly SmartReplaceCandidate[],
  workoutCatalog: readonly Exercise[],
): WorkoutSessionSmartReplaceCandidate[] {
  const workoutById = new Map(
    workoutCatalog.map((exercise) => [exercise.id, exercise] as const),
  );

  return candidates
    .map((candidate) => {
      const workoutExercise = workoutById.get(candidate.exercise.id);
      if (!workoutExercise) return null;
      return {
        exercise: workoutExercise,
        label: candidate.reviewedSubstitution.label,
        rationale: candidate.reviewedSubstitution.rationale,
        reasonCodes: candidate.reasonCodes,
      } satisfies WorkoutSessionSmartReplaceCandidate;
    })
    .filter(
      (candidate): candidate is WorkoutSessionSmartReplaceCandidate =>
        candidate !== null,
    );
}
