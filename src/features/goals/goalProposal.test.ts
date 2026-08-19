import { describe, expect, it } from 'vitest';

import { buildGoalProposal, isGoalProposalCurrent } from './goalProposal';

const source = {
  goalType: 'maintain' as const,
  targetWeight: 72,
  weeklyWeightChangeGoal: 0.2,
  trainingDaysPerWeek: 4,
};

describe('goal proposal contract', () => {
  it('returns null when the proposed goals do not change canonical values', () => {
    expect(buildGoalProposal({ source, proposed: { ...source } })).toBeNull();
  });

  it('records only explicit current-to-proposed field changes', () => {
    expect(
      buildGoalProposal({
        source,
        proposed: {
          ...source,
          goalType: 'gain_muscle',
          targetWeight: 76,
          trainingDaysPerWeek: 5,
        },
      }),
    ).toEqual({
      schemaVersion: 1,
      source,
      proposed: {
        ...source,
        goalType: 'gain_muscle',
        targetWeight: 76,
        trainingDaysPerWeek: 5,
      },
      changes: [
        {
          field: 'goalType',
          current: 'maintain',
          proposed: 'gain_muscle',
        },
        { field: 'targetWeight', current: 72, proposed: 76 },
        { field: 'trainingDaysPerWeek', current: 4, proposed: 5 },
      ],
    });
  });

  it('fails current-source validation when any canonical goal field changed', () => {
    const proposal = buildGoalProposal({
      source,
      proposed: { ...source, targetWeight: 74 },
    });
    expect(proposal).not.toBeNull();
    if (!proposal) return;

    expect(isGoalProposalCurrent(proposal, source)).toBe(true);
    expect(
      isGoalProposalCurrent(proposal, {
        ...source,
        weeklyWeightChangeGoal: 0.3,
      }),
    ).toBe(false);
  });
});
