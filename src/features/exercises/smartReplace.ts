import {
  getReviewedExerciseIntelligence,
  type ReviewedExerciseSubstitution,
} from './exerciseIntelligence';
import { loadExercisePreference } from './preferencesRepository';
import { exerciseRepository } from './repository';

export const SMART_REPLACE_MAX_CANDIDATES = 3;

export type SmartReplacementCandidate = ReviewedExerciseSubstitution;

type SelectSmartReplacementCandidatesInput = {
  avoidedExerciseIds: ReadonlySet<string>;
  currentExerciseId: string;
  resolvedExerciseIds: ReadonlySet<string>;
  substitutions: readonly ReviewedExerciseSubstitution[];
};

export const selectSmartReplacementCandidates = ({
  avoidedExerciseIds,
  currentExerciseId,
  resolvedExerciseIds,
  substitutions,
}: SelectSmartReplacementCandidatesInput): SmartReplacementCandidate[] => {
  const seen = new Set<string>();
  const selected: SmartReplacementCandidate[] = [];

  for (const substitution of substitutions) {
    const candidateId = substitution.exerciseId;
    if (
      candidateId === currentExerciseId ||
      seen.has(candidateId) ||
      !resolvedExerciseIds.has(candidateId) ||
      avoidedExerciseIds.has(candidateId)
    ) {
      continue;
    }

    seen.add(candidateId);
    selected.push(substitution);
    if (selected.length >= SMART_REPLACE_MAX_CANDIDATES) break;
  }

  return selected;
};

export const loadSmartReplacementCandidates = async (
  exerciseId: string,
): Promise<SmartReplacementCandidate[]> => {
  const intelligence = getReviewedExerciseIntelligence(exerciseId);
  if (!intelligence || intelligence.substitutions.length === 0) return [];

  const candidateIds = Array.from(
    new Set(
      intelligence.substitutions
        .map((substitution) => substitution.exerciseId)
        .filter((candidateId) => candidateId !== exerciseId),
    ),
  );

  const resolutions = await Promise.all(
    candidateIds.map(async (candidateId) => {
      const [exercise, preference] = await Promise.all([
        exerciseRepository.getExerciseById(candidateId),
        loadExercisePreference(candidateId),
      ]);

      return {
        candidateId,
        avoided: preference.avoid,
        resolved: Boolean(exercise),
      };
    }),
  );

  const avoidedExerciseIds = new Set(
    resolutions.filter((entry) => entry.avoided).map((entry) => entry.candidateId),
  );
  const resolvedExerciseIds = new Set(
    resolutions.filter((entry) => entry.resolved).map((entry) => entry.candidateId),
  );

  return selectSmartReplacementCandidates({
    avoidedExerciseIds,
    currentExerciseId: exerciseId,
    resolvedExerciseIds,
    substitutions: intelligence.substitutions,
  });
};
