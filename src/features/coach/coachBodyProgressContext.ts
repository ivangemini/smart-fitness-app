import type { CoachRetrievalRequest } from './coachRetrieval';
import type { CoachProgressSearchParams } from './coachProgressContext';

export type CoachBodyProgressContext = {
  source: 'progress';
  metric: 'weight';
  requestedDays: number;
  request: CoachRetrievalRequest & { intent: 'body_progress' };
};

const MAX_BODY_CONTEXT_DAYS = 90;

const readSingleParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value.trim() : '';

const parseDays = (value: string) => {
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > MAX_BODY_CONTEXT_DAYS) {
    return null;
  }
  return parsed;
};

export const parseCoachBodyProgressContext = (
  params: CoachProgressSearchParams,
): CoachBodyProgressContext | null => {
  if (readSingleParam(params.contextSource) !== 'progress') return null;
  if (readSingleParam(params.contextIntent) !== 'body_progress') return null;
  if (readSingleParam(params.metric) !== 'weight') return null;

  const endAt = readSingleParam(params.endAt);
  if (!endAt || !Number.isFinite(Date.parse(endAt))) return null;

  const requestedDays = parseDays(readSingleParam(params.days));
  if (requestedDays === null) return null;

  return {
    source: 'progress',
    metric: 'weight',
    requestedDays,
    request: {
      intent: 'body_progress',
      endAt,
      days: requestedDays,
    },
  };
};
