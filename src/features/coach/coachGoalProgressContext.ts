import type { CoachProgressSearchParams } from './coachProgressContext';

export type CoachGoalProgressContext = {
  source: 'progress';
  endAt: string;
};

const readSingleParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value.trim() : '';

export const parseCoachGoalProgressContext = (
  params: CoachProgressSearchParams,
): CoachGoalProgressContext | null => {
  if (readSingleParam(params.contextSource) !== 'progress') return null;
  if (readSingleParam(params.contextIntent) !== 'goal_progress') return null;

  const endAt = readSingleParam(params.endAt);
  if (!endAt || !Number.isFinite(Date.parse(endAt))) return null;

  return {
    source: 'progress',
    endAt: new Date(endAt).toISOString(),
  };
};
