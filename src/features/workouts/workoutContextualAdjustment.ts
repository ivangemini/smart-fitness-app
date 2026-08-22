import type { WorkoutPrescriptionSet, WorkoutSet } from '@/types';

export type WorkoutContextualAdjustment = {
  adjustedWeight: number;
  direction: 'decrease' | 'increase';
  exerciseId: string;
  loadMultiplier: number;
  sourceSetId: string;
};

const roundToHalf = (value: number) => Math.round(value * 2) / 2;

export const getWorkoutContextualAdjustment = ({
  completedSet,
  prescription,
  workingSetIndex,
}: {
  completedSet: WorkoutSet;
  prescription: readonly WorkoutPrescriptionSet[];
  workingSetIndex: number;
}): WorkoutContextualAdjustment | null => {
  if (
    completedSet.completed === false ||
    completedSet.setType === 'warmup' ||
    completedSet.actualRpe === undefined ||
    !Number.isInteger(workingSetIndex) ||
    workingSetIndex < 0
  ) {
    return null;
  }

  const exercisePrescription = prescription.filter(
    (set) => set.exerciseId === completedSet.exerciseId,
  );
  const target = exercisePrescription[workingSetIndex];
  if (!target || !Number.isFinite(target.weight) || target.weight <= 0) return null;

  const rpeDelta = completedSet.actualRpe - target.targetRpe;
  const repsDelta = completedSet.reps - target.reps;
  const shouldDecrease =
    (rpeDelta >= 1.5 && repsDelta <= 0) ||
    (rpeDelta >= 1 && repsDelta <= -2);
  const shouldIncrease = rpeDelta <= -1.5 && repsDelta >= 2;
  if (!shouldDecrease && !shouldIncrease) return null;

  const direction = shouldDecrease ? 'decrease' : 'increase';
  const loadMultiplier = direction === 'decrease' ? 0.95 : 1.025;
  const adjustedWeight = roundToHalf(target.weight * loadMultiplier);
  if (adjustedWeight <= 0 || adjustedWeight === target.weight) return null;

  return {
    adjustedWeight,
    direction,
    exerciseId: completedSet.exerciseId,
    loadMultiplier,
    sourceSetId: completedSet.id,
  };
};
