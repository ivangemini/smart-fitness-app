import type { WorkoutPrescriptionSet } from '@/types';

export type WorkoutWarmupSetProposal = {
  weight: number;
  reps: number;
};

const roundWarmupWeight = (weight: number) => Math.round(weight * 2) / 2;

export const buildWorkoutWarmupProposal = ({
  exerciseId,
  prescription,
}: {
  exerciseId: string;
  prescription: readonly WorkoutPrescriptionSet[];
}): WorkoutWarmupSetProposal[] => {
  const workingSet = prescription.find(
    (set) =>
      set.exerciseId === exerciseId &&
      Number.isFinite(set.weight) &&
      set.weight > 0,
  );
  if (!workingSet) return [];

  const workingWeight = workingSet.weight;
  const stages =
    workingWeight >= 40
      ? [
          { fraction: 0.5, reps: 8 },
          { fraction: 0.7, reps: 5 },
          { fraction: 0.85, reps: 3 },
        ]
      : workingWeight >= 20
        ? [
            { fraction: 0.5, reps: 8 },
            { fraction: 0.75, reps: 4 },
          ]
        : [{ fraction: 0.5, reps: 6 }];

  return stages
    .map(({ fraction, reps }) => ({
      weight: roundWarmupWeight(workingWeight * fraction),
      reps,
    }))
    .filter((set) => set.weight > 0 && set.weight < workingWeight);
};
