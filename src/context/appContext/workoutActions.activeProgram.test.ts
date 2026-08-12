import { describe, expect, it } from 'vitest';

import { defaultState } from '@/data/defaults';
import { getActiveTrainingProgramSelectorId } from '@/features/workouts/activeProgramSelection';
import type { AppState, TrainingProgram } from '@/types';

import { deleteTrainingProgramFromState } from './workoutActions';

const program: TrainingProgram = {
  id: 'program-active-delete',
  name: 'Active program',
  goal: 'Strength',
  difficulty: 'intermediate',
  durationWeeks: 8,
  days: [
    {
      id: 'monday-0',
      weekday: 'monday',
      workoutTemplateId: 'push-a',
      restDay: false,
    },
  ],
  createdAt: '2026-08-12T00:00:00.000Z',
  isCustom: true,
};

describe('deleteTrainingProgramFromState active selector behavior', () => {
  it('clears the selector in the same state mutation that deletes the active program', () => {
    const state: AppState = {
      ...defaultState,
      trainingPrograms: [program],
      profile: {
        ...defaultState.profile,
        activeTrainingProgramId: getActiveTrainingProgramSelectorId(program.id),
      },
    };

    const nextState = deleteTrainingProgramFromState(state, program.id);

    expect(nextState.trainingPrograms).toEqual([]);
    expect(nextState.profile.activeTrainingProgramId).toBeNull();
  });

  it('does not clear a different active selector', () => {
    const otherSelector = getActiveTrainingProgramSelectorId('program-other');
    const state: AppState = {
      ...defaultState,
      trainingPrograms: [program],
      profile: {
        ...defaultState.profile,
        activeTrainingProgramId: otherSelector,
      },
    };

    const nextState = deleteTrainingProgramFromState(state, program.id);

    expect(nextState.profile.activeTrainingProgramId).toBe(otherSelector);
  });
});
