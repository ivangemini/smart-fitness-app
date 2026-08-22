import { createUuid } from '@/lib/ids';
import type { WorkoutSet, WorkoutSetType } from '@/types';

import type { WorkoutSessionDraft } from './types';
import type { WorkoutWarmupSetProposal } from './workoutWarmupGuide';

const SET_TYPE_ORDER: readonly WorkoutSetType[] = [
  'working',
  'warmup',
  'backoff',
  'drop',
  'amrap',
];

const roundToHalf = (value: number) => Math.round(value * 2) / 2;

export const addWorkoutWarmupSets = (
  draft: WorkoutSessionDraft,
  exercise: { id: string; name: string },
  proposal: readonly WorkoutWarmupSetProposal[],
): WorkoutSessionDraft => {
  if (proposal.length === 0) return draft;

  const warmups: WorkoutSet[] = proposal.map((set) => ({
    id: createUuid(),
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    weight: set.weight,
    reps: set.reps,
    completed: false,
    setType: 'warmup',
  }));
  const firstExerciseIndex = draft.sets.findIndex((set) => set.exerciseId === exercise.id);
  const insertionIndex = firstExerciseIndex >= 0 ? firstExerciseIndex : draft.sets.length;

  return {
    ...draft,
    sets: [
      ...draft.sets.slice(0, insertionIndex).map((set) => ({ ...set })),
      ...warmups,
      ...draft.sets.slice(insertionIndex).map((set) => ({ ...set })),
    ],
  };
};

export const getNextWorkoutSetType = (current?: WorkoutSetType): WorkoutSetType => {
  const normalized = current ?? 'working';
  const index = SET_TYPE_ORDER.indexOf(normalized);
  return SET_TYPE_ORDER[(index + 1) % SET_TYPE_ORDER.length] ?? 'working';
};

export const updateWorkoutSessionSetType = (
  draft: WorkoutSessionDraft,
  setId: string,
  setType: WorkoutSetType,
): WorkoutSessionDraft => ({
  ...draft,
  sets: draft.sets.map((set) =>
    set.id === setId
      ? { ...set, setType: setType === 'working' ? undefined : setType }
      : { ...set },
  ),
});

export const toggleWorkoutSessionSuperset = (
  draft: WorkoutSessionDraft,
  sourceSetId: string,
  partnerSetId: string,
): WorkoutSessionDraft => {
  const source = draft.sets.find((set) => set.id === sourceSetId);
  const partner = draft.sets.find((set) => set.id === partnerSetId);
  if (!source || !partner || source.exerciseId === partner.exerciseId) return draft;

  const unlink = Boolean(source.supersetId && source.supersetId === partner.supersetId);
  const supersetId = unlink ? undefined : createUuid();
  return {
    ...draft,
    sets: draft.sets.map((set) =>
      set.id === sourceSetId || set.id === partnerSetId
        ? { ...set, supersetId }
        : { ...set },
    ),
  };
};

export const findWorkoutSupersetPartnerSet = (
  draft: WorkoutSessionDraft,
  setId: string,
  orderedExerciseIds: readonly string[],
) => {
  const source = draft.sets.find((set) => set.id === setId);
  if (!source || orderedExerciseIds.length < 2) return null;

  if (source.supersetId) {
    return (
      draft.sets.find(
        (set) => set.id !== source.id && set.supersetId === source.supersetId,
      ) ?? null
    );
  }

  const sourceExerciseSets = draft.sets.filter(
    (set) => set.exerciseId === source.exerciseId && set.setType !== 'warmup',
  );
  const ordinal = sourceExerciseSets.findIndex((set) => set.id === setId);
  if (ordinal < 0) return null;

  const sourceExerciseIndex = orderedExerciseIds.indexOf(source.exerciseId);
  if (sourceExerciseIndex < 0) return null;
  const partnerExerciseId =
    orderedExerciseIds[(sourceExerciseIndex + 1) % orderedExerciseIds.length];
  if (!partnerExerciseId || partnerExerciseId === source.exerciseId) return null;

  return (
    draft.sets.filter(
      (set) => set.exerciseId === partnerExerciseId && set.setType !== 'warmup',
    )[ordinal] ?? null
  );
};

type WorkoutAdjustmentApplyOptions = {
  loadMultiplier?: number;
  targetReps?: number;
  targetRepsByIndex?: readonly number[];
  targetSetCount?: number;
  targetWeightsByIndex?: readonly number[];
};

export const applyWorkoutAdjustmentToRemainingSets = (
  draft: WorkoutSessionDraft,
  sourceSetId: string,
  adjustedWeight: number,
  options: WorkoutAdjustmentApplyOptions = {},
): WorkoutSessionDraft => {
  const source = draft.sets.find((set) => set.id === sourceSetId);
  if (!source || !Number.isFinite(adjustedWeight) || adjustedWeight < 0) return draft;

  const currentWorkingSets = draft.sets.filter(
    (set) => set.exerciseId === source.exerciseId && set.setType !== 'warmup',
  );
  const sourceWorkingIndex = currentWorkingSets.findIndex((set) => set.id === sourceSetId);
  if (sourceWorkingIndex < 0) return draft;

  const requestedCount = Number.isFinite(options.targetSetCount)
    ? Math.max(currentWorkingSets.length, Math.floor(options.targetSetCount ?? 0))
    : currentWorkingSets.length;
  const resolveAdjustedWeight = (workingIndex: number) => {
    const targetWeight = options.targetWeightsByIndex?.[workingIndex];
    if (
      typeof targetWeight === 'number' &&
      Number.isFinite(targetWeight) &&
      targetWeight > 0 &&
      typeof options.loadMultiplier === 'number' &&
      Number.isFinite(options.loadMultiplier) &&
      options.loadMultiplier > 0
    ) {
      return roundToHalf(targetWeight * options.loadMultiplier);
    }
    return adjustedWeight;
  };
  const resolveReps = (workingIndex: number) => {
    const targetReps = options.targetRepsByIndex?.[workingIndex];
    if (typeof targetReps === 'number' && Number.isFinite(targetReps)) {
      return Math.max(0, Math.floor(targetReps));
    }
    if (typeof options.targetReps === 'number' && Number.isFinite(options.targetReps)) {
      return Math.max(0, Math.floor(options.targetReps));
    }
    return source.reps;
  };

  const missingCount = Math.max(0, requestedCount - currentWorkingSets.length);
  const newWorkingSets: WorkoutSet[] = Array.from({ length: missingCount }, (_, offset) => {
    const workingIndex = currentWorkingSets.length + offset;
    return {
      id: createUuid(),
      exerciseId: source.exerciseId,
      exerciseName: source.exerciseName,
      weight: resolveAdjustedWeight(workingIndex),
      reps: resolveReps(workingIndex),
      completed: false,
    };
  });

  let insertionIndex = draft.sets.length;
  for (let index = draft.sets.length - 1; index >= 0; index -= 1) {
    if (draft.sets[index]?.exerciseId === source.exerciseId) {
      insertionIndex = index + 1;
      break;
    }
  }
  const expandedSets: WorkoutSet[] = missingCount > 0
    ? [
        ...draft.sets.slice(0, insertionIndex).map((set) => ({ ...set })),
        ...newWorkingSets,
        ...draft.sets.slice(insertionIndex).map((set) => ({ ...set })),
      ]
    : draft.sets.map((set) => ({ ...set }));
  const workingIds = expandedSets
    .filter((set) => set.exerciseId === source.exerciseId && set.setType !== 'warmup')
    .map((set) => set.id);
  const workingIndexById = new Map(workingIds.map((id, index) => [id, index]));

  return {
    ...draft,
    sets: expandedSets.map((set) => {
      const workingIndex = workingIndexById.get(set.id);
      const eligible =
        workingIndex !== undefined &&
        workingIndex > sourceWorkingIndex &&
        set.completed === false;
      return eligible ? { ...set, weight: resolveAdjustedWeight(workingIndex) } : { ...set };
    }),
  };
};
