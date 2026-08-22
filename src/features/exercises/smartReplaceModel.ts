import type { ReviewedExerciseSubstitution } from './exerciseIntelligence';

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
