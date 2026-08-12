import { ensureUuid } from '@/lib/ids';
import type { AppState, TrainingProgram, Workout } from '@/types';

import { createDefaultTrainingProgram } from './defaults';

const isValidCustomProgram = (program: TrainingProgram): boolean =>
  program.isCustom === true && Boolean(program.name.trim()) && program.days.length > 0;

export const getActiveTrainingProgramSelectorId = (programId: string): string =>
  ensureUuid(programId);

export const findCustomTrainingProgramBySelector = (
  programs: TrainingProgram[],
  activeTrainingProgramId: string,
): TrainingProgram | null =>
  programs.find(
    (program) =>
      isValidCustomProgram(program) &&
      getActiveTrainingProgramSelectorId(program.id) === activeTrainingProgramId,
  ) ?? null;

export type ActiveTrainingProgramResolution = {
  program: TrainingProgram;
  mode: 'custom' | 'default';
  repairedSelector: boolean;
};

export const resolveActiveTrainingProgram = (input: {
  activeTrainingProgramId: string | null;
  trainingPrograms: TrainingProgram[];
  workouts: Workout[];
}): ActiveTrainingProgramResolution => {
  if (input.activeTrainingProgramId) {
    const selected = findCustomTrainingProgramBySelector(
      input.trainingPrograms,
      input.activeTrainingProgramId,
    );
    if (selected) {
      return {
        program: selected,
        mode: 'custom',
        repairedSelector: false,
      };
    }
  }

  return {
    program: createDefaultTrainingProgram(input.workouts),
    mode: 'default',
    repairedSelector: input.activeTrainingProgramId !== null,
  };
};

export const setActiveTrainingProgramInState = (
  state: AppState,
  programId: string | null,
): AppState => {
  if (programId === null) {
    if (state.profile.activeTrainingProgramId === null) return state;
    return {
      ...state,
      profile: { ...state.profile, activeTrainingProgramId: null },
    };
  }

  const program = state.trainingPrograms.find(
    (candidate) =>
      isValidCustomProgram(candidate) &&
      (candidate.id === programId ||
        getActiveTrainingProgramSelectorId(candidate.id) === programId),
  );
  if (!program) return state;

  const selectorId = getActiveTrainingProgramSelectorId(program.id);
  if (state.profile.activeTrainingProgramId === selectorId) return state;

  return {
    ...state,
    profile: { ...state.profile, activeTrainingProgramId: selectorId },
  };
};

export const clearActiveTrainingProgramForDeletedProgram = (
  state: AppState,
  programId: string,
): AppState => {
  if (
    state.profile.activeTrainingProgramId !==
    getActiveTrainingProgramSelectorId(programId)
  ) {
    return state;
  }

  return {
    ...state,
    profile: { ...state.profile, activeTrainingProgramId: null },
  };
};

export const repairActiveTrainingProgramSelection = (state: AppState): AppState => {
  const selectorId = state.profile.activeTrainingProgramId;
  if (!selectorId) return state;

  const selected = findCustomTrainingProgramBySelector(
    state.trainingPrograms,
    selectorId,
  );
  if (selected) return state;

  return {
    ...state,
    profile: { ...state.profile, activeTrainingProgramId: null },
  };
};
