import { COACH_HISTORY_MAX_DAYS } from './coachDataCapabilities';
import type { CoachRetrievalRequest } from './coachRetrieval';
import type { CoachProgressSearchParams } from './coachProgressContext';

export type CoachActivityProgressContext = {
  source: 'progress';
  requestedDays: number;
  retrievalDays: number;
  request: CoachRetrievalRequest & { intent: 'training_overview' };
};

const MAX_ACCEPTED_REQUESTED_DAYS = 180;

const readSingleParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value.trim() : '';

const parseRequestedDays = (value: string) => {
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (
    !Number.isSafeInteger(parsed) ||
    parsed < 1 ||
    parsed > MAX_ACCEPTED_REQUESTED_DAYS
  ) {
    return null;
  }
  return parsed;
};

export const parseCoachActivityProgressContext = (
  params: CoachProgressSearchParams,
): CoachActivityProgressContext | null => {
  if (readSingleParam(params.contextSource) !== 'progress') return null;
  if (readSingleParam(params.contextIntent) !== 'training_overview') return null;
  if (readSingleParam(params.metric) !== 'activity') return null;

  const endAt = readSingleParam(params.endAt);
  if (!endAt || !Number.isFinite(Date.parse(endAt))) return null;

  const requestedDays = parseRequestedDays(readSingleParam(params.days));
  if (requestedDays === null) return null;

  const retrievalDays = Math.min(requestedDays, COACH_HISTORY_MAX_DAYS);
  return {
    source: 'progress',
    requestedDays,
    retrievalDays,
    request: {
      intent: 'training_overview',
      endAt,
      days: retrievalDays,
    },
  };
};
