import { areProfileGoalsSnapshotsEqual } from '@/lib/profileGoals';
import type {
  ProfileGoalType,
  ProfileGoalsSnapshot,
} from '@/types';

export const GOAL_PROPOSAL_SCHEMA_VERSION = 1 as const;

export type GoalProposalChange =
  | {
      field: 'goalType';
      current: ProfileGoalType;
      proposed: ProfileGoalType;
    }
  | {
      field: 'targetWeight';
      current: number;
      proposed: number;
    }
  | {
      field: 'weeklyWeightChangeGoal';
      current: number;
      proposed: number;
    }
  | {
      field: 'trainingDaysPerWeek';
      current: number;
      proposed: number;
    };

export type GoalProposal = {
  schemaVersion: typeof GOAL_PROPOSAL_SCHEMA_VERSION;
  source: ProfileGoalsSnapshot;
  proposed: ProfileGoalsSnapshot;
  changes: GoalProposalChange[];
};

export const buildGoalProposal = ({
  proposed,
  source,
}: {
  proposed: ProfileGoalsSnapshot;
  source: ProfileGoalsSnapshot;
}): GoalProposal | null => {
  const changes: GoalProposalChange[] = [];

  if (source.goalType !== proposed.goalType) {
    changes.push({
      field: 'goalType',
      current: source.goalType,
      proposed: proposed.goalType,
    });
  }
  if (source.targetWeight !== proposed.targetWeight) {
    changes.push({
      field: 'targetWeight',
      current: source.targetWeight,
      proposed: proposed.targetWeight,
    });
  }
  if (source.weeklyWeightChangeGoal !== proposed.weeklyWeightChangeGoal) {
    changes.push({
      field: 'weeklyWeightChangeGoal',
      current: source.weeklyWeightChangeGoal,
      proposed: proposed.weeklyWeightChangeGoal,
    });
  }
  if (source.trainingDaysPerWeek !== proposed.trainingDaysPerWeek) {
    changes.push({
      field: 'trainingDaysPerWeek',
      current: source.trainingDaysPerWeek,
      proposed: proposed.trainingDaysPerWeek,
    });
  }

  if (changes.length === 0) return null;

  return {
    schemaVersion: GOAL_PROPOSAL_SCHEMA_VERSION,
    source: { ...source },
    proposed: { ...proposed },
    changes,
  };
};

export const isGoalProposalCurrent = (
  proposal: GoalProposal,
  current: ProfileGoalsSnapshot,
): boolean => areProfileGoalsSnapshotsEqual(proposal.source, current);
