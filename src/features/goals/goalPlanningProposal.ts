import type { ProfileGoalType, ProfileState } from '@/types';

export const GOAL_PLANNING_PROPOSAL_SCHEMA_VERSION = 1 as const;

export type GoalPlanningValues = Pick<
  ProfileState,
  | 'goalType'
  | 'targetWeight'
  | 'weeklyWeightChangeGoal'
  | 'trainingDaysPerWeek'
>;

export type GoalPlanningField = keyof GoalPlanningValues;

export type GoalPlanningChange =
  | {
      field: 'goalType';
      currentValue: ProfileGoalType;
      proposedValue: ProfileGoalType;
    }
  | {
      field: 'targetWeight';
      currentValue: number;
      proposedValue: number;
    }
  | {
      field: 'weeklyWeightChangeGoal';
      currentValue: number;
      proposedValue: number;
    }
  | {
      field: 'trainingDaysPerWeek';
      currentValue: number;
      proposedValue: number;
    };

export type GoalPlanningProposal = {
  schemaVersion: typeof GOAL_PLANNING_PROPOSAL_SCHEMA_VERSION;
  sourceFingerprint: string;
  source: GoalPlanningValues;
  proposed: GoalPlanningValues;
  changes: GoalPlanningChange[];
};

const GOAL_TYPES = new Set<ProfileGoalType>([
  'lose_fat',
  'maintain',
  'gain_muscle',
]);

const round = (value: number): number => Math.round(value * 1000) / 1000;

const normalizeValues = (values: GoalPlanningValues): GoalPlanningValues => {
  if (!GOAL_TYPES.has(values.goalType)) {
    throw new Error('Invalid goal planning proposal: goalType');
  }
  if (!Number.isFinite(values.targetWeight) || values.targetWeight <= 0) {
    throw new Error('Invalid goal planning proposal: targetWeight');
  }
  if (
    !Number.isFinite(values.weeklyWeightChangeGoal) ||
    values.weeklyWeightChangeGoal < 0
  ) {
    throw new Error('Invalid goal planning proposal: weeklyWeightChangeGoal');
  }
  if (
    !Number.isInteger(values.trainingDaysPerWeek) ||
    values.trainingDaysPerWeek < 1 ||
    values.trainingDaysPerWeek > 7
  ) {
    throw new Error('Invalid goal planning proposal: trainingDaysPerWeek');
  }

  return {
    goalType: values.goalType,
    targetWeight: round(values.targetWeight),
    weeklyWeightChangeGoal: round(values.weeklyWeightChangeGoal),
    trainingDaysPerWeek: values.trainingDaysPerWeek,
  };
};

const fnv1a = (value: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const buildGoalPlanningSourceFingerprint = (
  values: GoalPlanningValues,
): string => {
  const normalized = normalizeValues(values);
  return `goal-planning-v1:${fnv1a(JSON.stringify(normalized))}`;
};

const buildChanges = (
  source: GoalPlanningValues,
  proposed: GoalPlanningValues,
): GoalPlanningChange[] => {
  const changes: GoalPlanningChange[] = [];
  if (source.goalType !== proposed.goalType) {
    changes.push({
      field: 'goalType',
      currentValue: source.goalType,
      proposedValue: proposed.goalType,
    });
  }
  if (source.targetWeight !== proposed.targetWeight) {
    changes.push({
      field: 'targetWeight',
      currentValue: source.targetWeight,
      proposedValue: proposed.targetWeight,
    });
  }
  if (source.weeklyWeightChangeGoal !== proposed.weeklyWeightChangeGoal) {
    changes.push({
      field: 'weeklyWeightChangeGoal',
      currentValue: source.weeklyWeightChangeGoal,
      proposedValue: proposed.weeklyWeightChangeGoal,
    });
  }
  if (source.trainingDaysPerWeek !== proposed.trainingDaysPerWeek) {
    changes.push({
      field: 'trainingDaysPerWeek',
      currentValue: source.trainingDaysPerWeek,
      proposedValue: proposed.trainingDaysPerWeek,
    });
  }
  return changes;
};

export const createGoalPlanningProposal = (input: {
  source: GoalPlanningValues;
  proposed: GoalPlanningValues;
}): GoalPlanningProposal => {
  const source = normalizeValues(input.source);
  const proposed = normalizeValues(input.proposed);
  return {
    schemaVersion: GOAL_PLANNING_PROPOSAL_SCHEMA_VERSION,
    sourceFingerprint: buildGoalPlanningSourceFingerprint(source),
    source,
    proposed,
    changes: buildChanges(source, proposed),
  };
};

export const isGoalPlanningProposalStale = (
  proposal: GoalPlanningProposal,
  current: GoalPlanningValues,
): boolean =>
  proposal.sourceFingerprint !== buildGoalPlanningSourceFingerprint(current);
