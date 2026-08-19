import { describe, expect, it } from 'vitest';

import {
  buildGoalPlanningSourceFingerprint,
  createGoalPlanningProposal,
  isGoalPlanningProposalStale,
  type GoalPlanningValues,
} from './goalPlanningProposal';

const source: GoalPlanningValues = {
  goalType: 'gain_muscle',
  targetWeight: 75,
  weeklyWeightChangeGoal: 0.25,
  trainingDaysPerWeek: 4,
};

describe('goal planning proposal', () => {
  it('captures only explicit changed goal fields', () => {
    const proposal = createGoalPlanningProposal({
      source,
      proposed: {
        ...source,
        targetWeight: 77,
        trainingDaysPerWeek: 5,
      },
    });

    expect(proposal).toMatchObject({
      schemaVersion: 1,
      source,
      proposed: {
        ...source,
        targetWeight: 77,
        trainingDaysPerWeek: 5,
      },
      changes: [
        {
          field: 'targetWeight',
          currentValue: 75,
          proposedValue: 77,
        },
        {
          field: 'trainingDaysPerWeek',
          currentValue: 4,
          proposedValue: 5,
        },
      ],
    });
    expect(proposal.sourceFingerprint).toMatch(/^goal-planning-v1:[0-9a-f]{8}$/);
  });

  it('normalizes equivalent numeric precision before fingerprinting', () => {
    expect(
      buildGoalPlanningSourceFingerprint({
        ...source,
        targetWeight: 75.0004,
        weeklyWeightChangeGoal: 0.2504,
      }),
    ).toBe(buildGoalPlanningSourceFingerprint(source));
  });

  it('detects a canonical source change before proposal application', () => {
    const proposal = createGoalPlanningProposal({
      source,
      proposed: { ...source, targetWeight: 77 },
    });

    expect(isGoalPlanningProposalStale(proposal, source)).toBe(false);
    expect(
      isGoalPlanningProposalStale(proposal, {
        ...source,
        targetWeight: 76,
      }),
    ).toBe(true);
    expect(
      isGoalPlanningProposalStale(proposal, {
        ...source,
        trainingDaysPerWeek: 3,
      }),
    ).toBe(true);
  });

  it('allows a no-change preview to remain explicitly empty', () => {
    expect(
      createGoalPlanningProposal({ source, proposed: source }).changes,
    ).toEqual([]);
  });

  it('rejects invalid proposed values before preview creation', () => {
    expect(() =>
      createGoalPlanningProposal({
        source,
        proposed: { ...source, targetWeight: 0 },
      }),
    ).toThrow('targetWeight');
    expect(() =>
      createGoalPlanningProposal({
        source,
        proposed: { ...source, weeklyWeightChangeGoal: -0.1 },
      }),
    ).toThrow('weeklyWeightChangeGoal');
    expect(() =>
      createGoalPlanningProposal({
        source,
        proposed: { ...source, trainingDaysPerWeek: 8 },
      }),
    ).toThrow('trainingDaysPerWeek');
  });
});
