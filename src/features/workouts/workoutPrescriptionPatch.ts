import type { Workout, WorkoutPrescriptionSet } from '@/types';

export type WorkoutPrescriptionPatchStatus = 'applied' | 'stale' | 'blocked';

export type WorkoutPrescriptionRowPatch = {
  index: number;
  exerciseId: string;
  expectedWeight: number;
  expectedReps: number;
  expectedTargetRpe: WorkoutPrescriptionSet['targetRpe'];
  nextWeight: number;
  nextReps: number;
  nextAdjustment?: WorkoutPrescriptionSet['adjustment'];
  nextRationaleCode?: string;
};

export type WorkoutPrescriptionPatch = {
  templateId: string;
  exerciseId: string;
  expectedFingerprint: string;
  rows: WorkoutPrescriptionRowPatch[];
};

export type WorkoutPrescriptionPatchResult = {
  status: WorkoutPrescriptionPatchStatus;
  workout: Workout;
};

const normalizePrescriptionRow = (set: WorkoutPrescriptionSet) => ({
  sourceSetId: set.sourceSetId ?? null,
  exerciseId: set.exerciseId,
  exerciseName: set.exerciseName,
  weight: set.weight,
  reps: set.reps,
  targetRpe: set.targetRpe,
  adjustment: set.adjustment ?? null,
  rationaleCode: set.rationaleCode ?? null,
});

export const buildWorkoutPrescriptionFingerprint = (workout: Workout) =>
  JSON.stringify({
    templateId: workout.id,
    exerciseIds: workout.exercises.map((exercise) => exercise.id),
    prescription: workout.prescription?.map(normalizePrescriptionRow) ?? null,
  });

const isValidNextTarget = (row: WorkoutPrescriptionRowPatch) =>
  Number.isFinite(row.nextWeight) &&
  row.nextWeight >= 0 &&
  Number.isFinite(row.nextReps) &&
  Number.isInteger(row.nextReps) &&
  row.nextReps > 0;

const rowMatchesSnapshot = (
  current: WorkoutPrescriptionSet | undefined,
  row: WorkoutPrescriptionRowPatch,
) =>
  Boolean(
    current &&
      current.exerciseId === row.exerciseId &&
      current.weight === row.expectedWeight &&
      current.reps === row.expectedReps &&
      current.targetRpe === row.expectedTargetRpe,
  );

export function applyWorkoutPrescriptionPatch(
  workout: Workout,
  patch: WorkoutPrescriptionPatch,
): WorkoutPrescriptionPatchResult {
  if (
    workout.id !== patch.templateId ||
    workout.isCustom !== true ||
    !workout.prescription ||
    patch.rows.length === 0 ||
    !workout.exercises.some((exercise) => exercise.id === patch.exerciseId)
  ) {
    return { status: 'blocked', workout };
  }

  if (buildWorkoutPrescriptionFingerprint(workout) !== patch.expectedFingerprint) {
    return { status: 'stale', workout };
  }

  const seenIndexes = new Set<number>();
  for (const row of patch.rows) {
    if (
      seenIndexes.has(row.index) ||
      row.exerciseId !== patch.exerciseId ||
      !isValidNextTarget(row) ||
      !rowMatchesSnapshot(workout.prescription[row.index], row)
    ) {
      return { status: 'blocked', workout };
    }
    seenIndexes.add(row.index);
  }

  let changed = false;
  const prescription = workout.prescription.map((set, index) => {
    const row = patch.rows.find((candidate) => candidate.index === index);
    if (!row) return set;

    if (
      set.weight !== row.nextWeight ||
      set.reps !== row.nextReps ||
      (row.nextAdjustment !== undefined && set.adjustment !== row.nextAdjustment) ||
      (row.nextRationaleCode !== undefined && set.rationaleCode !== row.nextRationaleCode)
    ) {
      changed = true;
    }

    return {
      ...set,
      weight: row.nextWeight,
      reps: row.nextReps,
      ...(row.nextAdjustment !== undefined ? { adjustment: row.nextAdjustment } : {}),
      ...(row.nextRationaleCode !== undefined ? { rationaleCode: row.nextRationaleCode } : {}),
    };
  });

  return changed
    ? { status: 'applied', workout: { ...workout, prescription } }
    : { status: 'blocked', workout };
}
