import { useMemo } from 'react';

import { useNutritionState, useWorkoutState } from '@/context/AppContext';
import { useProfileState } from '@/context/ProfileStateContext';
import { useProgressState } from '@/context/ProgressStateContext';
import { useSafetyRecoveryState } from '@/context/SafetyRecoveryStateContext';

import type { CoachRetrievalSources } from './coachRetrieval';

export function useCoachRetrievalSources(): CoachRetrievalSources {
  const workoutState = useWorkoutState();
  const nutritionState = useNutritionState();
  const progressState = useProgressState();
  const { profile } = useProfileState();
  const { userLimitations } = useSafetyRecoveryState();

  return useMemo(
    () => ({
      workoutSessions: workoutState.workoutSessions,
      trainingPrograms: workoutState.trainingPrograms,
      workouts: workoutState.workouts,
      profile,
      userLimitations,
      weightHistory: progressState.weightHistory,
      bodyMeasurements: progressState.bodyMeasurements,
      foodEntries: nutritionState.foodEntries,
      nutritionTargets: nutritionState.nutritionTargets,
    }),
    [
      nutritionState.foodEntries,
      nutritionState.nutritionTargets,
      profile,
      progressState.bodyMeasurements,
      progressState.weightHistory,
      userLimitations,
      workoutState.trainingPrograms,
      workoutState.workoutSessions,
      workoutState.workouts,
    ],
  );
}
