import { COACH_HISTORY_MAX_DAYS } from './coachDataCapabilities';
import type { CoachRetrievalRequest } from './coachRetrieval';

export type CoachProgressSearchParams = Record<string, string | string[] | undefined>;

export type CoachProgressContext = {
  source: 'progress';
  requestedDays: number;
  retrievalDays: number;
  request: CoachRetrievalRequest & { intent: 'exercise_progress' };
};

const MAX_ACCEPTED_REQUESTED_DAYS = 365;

const readSingleParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value.trim() : '';

const parseRequestedDays = (value: string) => {
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > MAX_ACCEPTED_REQUESTED_DAYS) {
    return null;
  }
  return parsed;
};

export const parseCoachProgressContext = (
  params: CoachProgressSearchParams,
): CoachProgressContext | null => {
  if (readSingleParam(params.contextSource) !== 'progress') return null;
  if (readSingleParam(params.contextIntent) !== 'exercise_progress') return null;

  const endAt = readSingleParam(params.endAt);
  if (!endAt || !Number.isFinite(Date.parse(endAt))) return null;

  const requestedDays = parseRequestedDays(readSingleParam(params.days));
  if (requestedDays === null) return null;

  const exerciseId = readSingleParam(params.exerciseId);
  const exerciseName = readSingleParam(params.exerciseName);
  if (!exerciseId && !exerciseName) return null;

  const retrievalDays = Math.min(requestedDays, COACH_HISTORY_MAX_DAYS);

  return {
    source: 'progress',
    requestedDays,
    retrievalDays,
    request: {
      intent: 'exercise_progress',
      endAt,
      days: retrievalDays,
      ...(exerciseId ? { exerciseId } : {}),
      ...(exerciseName ? { exerciseName } : {}),
    },
  };
};
