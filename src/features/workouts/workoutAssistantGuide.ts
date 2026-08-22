import type { WorkoutPrescriptionSet, WorkoutRpe } from '@/types';

const WORKOUT_RPE_VALUES = new Set<WorkoutRpe>([6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]);

export type WorkoutAssistantPreviousSet = {
  weight: number;
  reps: number;
  actualRpe?: WorkoutRpe;
};

export type WorkoutAssistantTargetSource = 'prescription' | 'plan' | 'none';

export type WorkoutAssistantSetGuide = {
  previous: WorkoutAssistantPreviousSet | null;
  targetWeight: number | null;
  targetReps: number | null;
  targetRpe: WorkoutRpe | null;
  targetSource: WorkoutAssistantTargetSource;
};

const isValidWeight = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const isValidReps = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const isValidRpe = (value: unknown): value is WorkoutRpe =>
  typeof value === 'number' && WORKOUT_RPE_VALUES.has(value as WorkoutRpe);

const copyPreviousSet = (
  value: WorkoutAssistantPreviousSet | undefined,
): WorkoutAssistantPreviousSet | null => {
  if (!value || !isValidWeight(value.weight) || !isValidReps(value.reps)) return null;
  return {
    weight: value.weight,
    reps: value.reps,
    ...(isValidRpe(value.actualRpe) ? { actualRpe: value.actualRpe } : {}),
  };
};

export const buildWorkoutAssistantSetGuides = ({
  exerciseId,
  plannedTargetReps,
  prescription,
  previousSets = [],
  rowCount,
}: {
  exerciseId: string;
  plannedTargetReps?: number;
  prescription: readonly WorkoutPrescriptionSet[];
  previousSets?: readonly WorkoutAssistantPreviousSet[];
  rowCount: number;
}): WorkoutAssistantSetGuide[] => {
  const exercisePrescription = prescription.filter((set) => set.exerciseId === exerciseId);
  const planReps = isValidReps(plannedTargetReps) ? plannedTargetReps : null;
  const safeRowCount = Number.isFinite(rowCount) ? Math.max(0, Math.floor(rowCount)) : 0;

  return Array.from({ length: safeRowCount }, (_, index) => {
    const prescribed = exercisePrescription[index];
    const targetWeight = isValidWeight(prescribed?.weight) ? prescribed.weight : null;
    const prescribedReps = isValidReps(prescribed?.reps) ? prescribed.reps : null;
    const targetRpe = isValidRpe(prescribed?.targetRpe) ? prescribed.targetRpe : null;
    const hasPrescriptionTarget =
      targetWeight !== null || prescribedReps !== null || targetRpe !== null;

    return {
      previous: copyPreviousSet(previousSets[index]),
      targetWeight,
      targetReps: prescribedReps ?? planReps,
      targetRpe,
      targetSource: hasPrescriptionTarget
        ? 'prescription'
        : planReps !== null
          ? 'plan'
          : 'none',
    };
  });
};
