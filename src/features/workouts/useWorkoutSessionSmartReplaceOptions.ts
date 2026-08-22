import { useEffect, useMemo, useState } from 'react';

import { getSmartReplaceCopy } from '@/localization/smartReplaceCopy';
import type { Exercise } from '@/types';

import { loadWorkoutSessionSmartReplaceCandidates } from './sessionSmartReplace';
import {
  selectWorkoutSessionSmartReplaceText,
  type WorkoutSessionSmartReplaceCandidate,
} from './sessionSmartReplaceModel';

type CandidateState = {
  sourceExerciseId: string;
  candidates: WorkoutSessionSmartReplaceCandidate[];
};

export function useWorkoutSessionSmartReplaceOptions({
  catalog,
  enabled,
  locale,
  sourceExerciseId,
}: {
  catalog: readonly Exercise[];
  enabled: boolean;
  locale: string;
  sourceExerciseId: string | null;
}): Exercise[] {
  const [candidateState, setCandidateState] = useState<CandidateState | null>(null);
  const copy = useMemo(() => getSmartReplaceCopy(locale), [locale]);

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !sourceExerciseId) {
      setCandidateState(null);
      return () => {
        cancelled = true;
      };
    }

    void loadWorkoutSessionSmartReplaceCandidates(sourceExerciseId, catalog).then(
      (candidates) => {
        if (!cancelled) setCandidateState({ sourceExerciseId, candidates });
      },
      () => {
        if (!cancelled) setCandidateState({ sourceExerciseId, candidates: [] });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [catalog, enabled, sourceExerciseId]);

  return useMemo(() => {
    if (!sourceExerciseId) return [...catalog];

    const candidates =
      candidateState?.sourceExerciseId === sourceExerciseId
        ? candidateState.candidates
        : [];
    const candidateIds = new Set(candidates.map((candidate) => candidate.exercise.id));
    const smartOptions = candidates.map((candidate) => ({
      ...candidate.exercise,
      muscleGroup: `${copy.title} · ${selectWorkoutSessionSmartReplaceText(candidate.rationale, locale)}`,
    }));
    const manualOptions = catalog.filter(
      (exercise) =>
        exercise.id !== sourceExerciseId && !candidateIds.has(exercise.id),
    );

    return [...smartOptions, ...manualOptions];
  }, [candidateState, catalog, copy.title, locale, sourceExerciseId]);
}
