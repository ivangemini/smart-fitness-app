import { describe, expect, it } from 'vitest';

import { defaultState } from '@/data/defaults';
import type { AppState, TrainingProgram } from '@/types';

import {
  clearActiveTrainingProgramForDeletedProgram,
  getActiveTrainingProgramSelectorId,
  repairActiveTrainingProgramSelection,
  resolveActiveTrainingProgram,
  setActiveTrainingProgramInState,
} from './activeProgramSelection';

const customProgram: TrainingProgram = {
  id: 'program-12345',
  name: 'Custom strength',
  goal: 'Strength',
  difficulty: 'intermediate',
  durationWeeks: 8,
  days: [
    {
      id: 'monday-0',
      weekday: 'monday',
      workoutTemplateId: 'push-a',
      workoutTemplateName: 'Upper Body Strength',
      restDay: false,
    },
  ],
  createdAt: '2026-08-12T00:00:00.000Z',
  isCustom: true,
};

const stateWithProgram = (): AppState => ({
  ...defaultState,
  profile: { ...defaultState.profile },
  trainingPrograms: [customProgram],
});

describe('active training program selection', () => {
  it('stores the canonical training-program sync UUID for a local program id', () => {
    const nextState = setActiveTrainingProgramInState(
      stateWithProgram(),
      customProgram.id,
    );

    expect(nextState.profile.activeTrainingProgramId).toBe(
      getActiveTrainingProgramSelectorId(customProgram.id),
    );
  });

  it('resolves a selected custom program without depending on list position', () => {
    const selectorId = getActiveTrainingProgramSelectorId(customProgram.id);
    const result = resolveActiveTrainingProgram({
      activeTrainingProgramId: selectorId,
      trainingPrograms: [
        { ...customProgram, id: 'program-other', name: 'Other program' },
        customProgram,
      ],
      workouts: defaultState.workouts,
    });

    expect(result.mode).toBe('custom');
    expect(result.program.id).toBe(customProgram.id);
    expect(result.repairedSelector).toBe(false);
  });

  it('keeps selection stable when a pulled program now uses its canonical UUID', () => {
    const selectorId = getActiveTrainingProgramSelectorId(customProgram.id);
    const result = resolveActiveTrainingProgram({
      activeTrainingProgramId: selectorId,
      trainingPrograms: [{ ...customProgram, id: selectorId }],
      workouts: defaultState.workouts,
    });

    expect(result.mode).toBe('custom');
    expect(result.program.id).toBe(selectorId);
  });

  it('uses the product default when the selector is null', () => {
    const result = resolveActiveTrainingProgram({
      activeTrainingProgramId: null,
      trainingPrograms: [customProgram],
      workouts: defaultState.workouts,
    });

    expect(result.mode).toBe('default');
    expect(result.program.isCustom).toBe(false);
    expect(result.repairedSelector).toBe(false);
  });

  it('repairs a stale selector to default-program mode', () => {
    const state = stateWithProgram();
    state.profile.activeTrainingProgramId =
      '11111111-1111-4111-8111-111111111111';

    const repaired = repairActiveTrainingProgramSelection(state);

    expect(repaired.profile.activeTrainingProgramId).toBeNull();
    expect(
      resolveActiveTrainingProgram({
        activeTrainingProgramId: repaired.profile.activeTrainingProgramId,
        trainingPrograms: repaired.trainingPrograms,
        workouts: repaired.workouts,
      }).mode,
    ).toBe('default');
  });

  it('clears the selector immediately when the active custom program is deleted', () => {
    const selected = setActiveTrainingProgramInState(
      stateWithProgram(),
      customProgram.id,
    );
    const withoutProgram = {
      ...selected,
      trainingPrograms: [],
    };

    const cleared = clearActiveTrainingProgramForDeletedProgram(
      withoutProgram,
      customProgram.id,
    );

    expect(cleared.profile.activeTrainingProgramId).toBeNull();
  });
});
