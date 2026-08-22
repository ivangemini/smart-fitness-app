import type { ReviewedExerciseSubstitution } from './exerciseIntelligence';
import type { ExercisePreference } from './preferences';
import type { Exercise } from './types';

export type SmartReplaceReasonCode =
  | 'reviewed-substitution'
  | 'equipment-match';

export type SmartReplaceCandidate = {
  exercise: Exercise;
  reviewedSubstitution: ReviewedExerciseSubstitution;
  reasonCodes: SmartReplaceReasonCode[];
};

export type BuildSmartReplaceCandidatesInput = {
  currentExerciseId: string;
  reviewedSubstitutions: ReviewedExerciseSubstitution[];
  resolvedExercises: Exercise[];
  preferences?: Readonly<Record<string, ExercisePreference | undefined>>;
  equipmentContext?: readonly string[];
  limit?: number;
};

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 3;

const boundedLimit = (value: number | undefined) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.max(0, Math.min(MAX_LIMIT, Math.floor(value)));
};

const hasEquipmentMatch = (
  exercise: Exercise,
  equipmentContext: readonly string[] | undefined,
) => {
  if (!equipmentContext?.length) return false;
  const requested = new Set(equipmentContext);
  return exercise.equipment.some((equipment) => requested.has(equipment));
};

export function buildSmartReplaceCandidates({
  currentExerciseId,
  reviewedSubstitutions,
  resolvedExercises,
  preferences = {},
  equipmentContext,
  limit,
}: BuildSmartReplaceCandidatesInput): SmartReplaceCandidate[] {
  const maxCandidates = boundedLimit(limit);
  if (!currentExerciseId || maxCandidates === 0 || reviewedSubstitutions.length === 0) {
    return [];
  }

  const exercisesById = new Map(
    resolvedExercises.map((exercise) => [exercise.id, exercise] as const),
  );
  const seen = new Set<string>();

  return reviewedSubstitutions
    .map((reviewedSubstitution, reviewedIndex) => {
      const exercise = exercisesById.get(reviewedSubstitution.exerciseId);
      if (
        !exercise ||
        exercise.id === currentExerciseId ||
        seen.has(exercise.id) ||
        preferences[exercise.id]?.avoid === true
      ) {
        return null;
      }

      seen.add(exercise.id);
      const equipmentMatch = hasEquipmentMatch(exercise, equipmentContext);
      return {
        candidate: {
          exercise,
          reviewedSubstitution,
          reasonCodes: [
            'reviewed-substitution' as const,
            ...(equipmentMatch ? (['equipment-match'] as const) : []),
          ],
        },
        equipmentMatch,
        reviewedIndex,
      };
    })
    .filter(
      (
        item,
      ): item is {
        candidate: SmartReplaceCandidate;
        equipmentMatch: boolean;
        reviewedIndex: number;
      } => item !== null,
    )
    .sort((left, right) => {
      if (left.equipmentMatch !== right.equipmentMatch) {
        return left.equipmentMatch ? -1 : 1;
      }
      return left.reviewedIndex - right.reviewedIndex;
    })
    .slice(0, maxCandidates)
    .map(({ candidate }) => candidate);
}
