import type { ProfileGoalsSnapshot, ProfileState } from '@/types';

export const getProfileGoalsSnapshot = (
  profile: ProfileState,
): ProfileGoalsSnapshot => ({
  goalType: profile.goalType,
  targetWeight: profile.targetWeight,
  weeklyWeightChangeGoal: profile.weeklyWeightChangeGoal,
  trainingDaysPerWeek: profile.trainingDaysPerWeek,
});

export const areProfileGoalsSnapshotsEqual = (
  left: ProfileGoalsSnapshot,
  right: ProfileGoalsSnapshot,
): boolean =>
  left.goalType === right.goalType &&
  left.targetWeight === right.targetWeight &&
  left.weeklyWeightChangeGoal === right.weeklyWeightChangeGoal &&
  left.trainingDaysPerWeek === right.trainingDaysPerWeek;
