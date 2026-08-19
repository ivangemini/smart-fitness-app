import { COACH_HISTORY_MAX_DAYS } from './coachDataCapabilities';
import type { CoachProgressSearchParams } from './coachProgressContext';

export type CoachHighlightsProgressContext = {
  source: 'progress';
  requestedDays: number;
  retrievalDays: number;
  endAt: string;
};

const MAX_ACCEPTED_REQUESTED_DAYS = 365;

const readSingleParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value.trim() : '';

const parseRequestedDays = (value: string) => {
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) &&
    parsed >= 1 &&
    parsed <= MAX_ACCEPTED_REQUESTED_DAYS
    ? parsed
    : null;
};

export const parseCoachHighlightsProgressContext = (
  params: CoachProgressSearchParams,
): CoachHighlightsProgressContext | null => {
  if (readSingleParam(params.contextSource) !== 'progress') return null;
  if (readSingleParam(params.contextIntent) !== 'training_highlights') return null;
  if (readSingleParam(params.contextMetric) !== 'highlights') return null;

  const endAt = readSingleParam(params.endAt);
  if (!endAt || !Number.isFinite(Date.parse(endAt))) return null;

  const requestedDays = parseRequestedDays(readSingleParam(params.days));
  if (requestedDays === null) return null;

  return {
    source: 'progress',
    requestedDays,
    retrievalDays: Math.min(requestedDays, COACH_HISTORY_MAX_DAYS),
    endAt,
  };
};
