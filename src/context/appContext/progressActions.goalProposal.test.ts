import { describe, expect, it } from 'vitest';

import { defaultState } from '@/data/defaults';
import { getProfileGoalsSnapshot } from '@/lib/profileGoals';

import { updateProfileGoalsIfCurrentInState } from './progressActions';

const makeState = () => ({
  ...defaultState,
  profile: { ...defaultState.profile },
});

describe('guarded profile goal updates', () => {
  it('applies a proposal when all canonical source fields still match', () => {
    const state = makeState();
    const expectedCurrent = getProfileGoalsSnapshot(state.profile);
    const proposed = { ...expectedCurrent, targetWeight: 80, trainingDaysPerWeek: 4 };

    const result = updateProfileGoalsIfCurrentInState(
      state,
      proposed,
      expectedCurrent,
    );

    expect(result.status).toBe('applied');
    expect(result.nextState).not.toBe(state);
    expect(result.nextState.profile).toMatchObject(proposed);
    expect(state.profile.targetWeight).toBe(defaultState.profile.targetWeight);
  });

  it('rejects the proposal without mutation when canonical goal state changed', () => {
    const state = makeState();
    const expectedCurrent = getProfileGoalsSnapshot(state.profile);
    const changedState = {
      ...state,
      profile: { ...state.profile, trainingDaysPerWeek: 5 },
    };

    const result = updateProfileGoalsIfCurrentInState(
      changedState,
      { ...expectedCurrent, targetWeight: 80 },
      expectedCurrent,
    );

    expect(result).toEqual({ nextState: changedState, status: 'stale' });
    expect(result.nextState.profile.targetWeight).toBe(state.profile.targetWeight);
    expect(result.nextState.profile.trainingDaysPerWeek).toBe(5);
  });
});
