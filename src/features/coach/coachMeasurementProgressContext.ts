import type { CoachRetrievalRequest } from './coachRetrieval';
import type { CoachProgressSearchParams } from './coachProgressContext';

export type CoachMeasurementProgressContext = {
  source: 'progress';
  metric: 'measurement';
  measurementKey: string;
  requestedDays: number;
  retrievalDays: number;
  request: CoachRetrievalRequest & { intent: 'body_progress' };
};

const MAX_ACCEPTED_REQUESTED_DAYS = 180;
const MAX_RETRIEVAL_DAYS = 90;
const MAX_MEASUREMENT_KEY_LENGTH = 160;

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

export const parseCoachMeasurementProgressContext = (
  params: CoachProgressSearchParams,
): CoachMeasurementProgressContext | null => {
  if (readSingleParam(params.contextSource) !== 'progress') return null;
  if (readSingleParam(params.contextIntent) !== 'body_progress') return null;
  if (readSingleParam(params.metric) !== 'measurement') return null;

  const endAt = readSingleParam(params.endAt);
  if (!endAt || !Number.isFinite(Date.parse(endAt))) return null;

  const requestedDays = parseRequestedDays(readSingleParam(params.days));
  if (requestedDays === null) return null;

  const measurementKey = readSingleParam(params.measurementKey);
  if (!measurementKey || measurementKey.length > MAX_MEASUREMENT_KEY_LENGTH) return null;

  const retrievalDays = Math.min(requestedDays, MAX_RETRIEVAL_DAYS);
  return {
    source: 'progress',
    metric: 'measurement',
    measurementKey,
    requestedDays,
    retrievalDays,
    request: {
      intent: 'body_progress',
      endAt,
      days: retrievalDays,
    },
  };
};
