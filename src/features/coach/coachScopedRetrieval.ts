import type { BodyMeasurement } from '@/types';

import {
  buildCoachFactPacket,
  type CoachFactPacket,
  type CoachRetrievalRequest,
  type CoachRetrievalResult,
  type CoachRetrievalSources,
} from './coachRetrieval';

const bodyMeasurementKey = (measurement: BodyMeasurement) =>
  measurement.metric
    ? `${measurement.metric}:${
        measurement.metric === 'custom' ? measurement.label.trim().toLocaleLowerCase() : ''
      }`
    : `label:${measurement.label.trim().toLocaleLowerCase()}`;

export const buildCoachWeightProgressFactPacket = ({
  request,
  sources,
}: {
  request: CoachRetrievalRequest & { intent: 'body_progress' };
  sources: CoachRetrievalSources;
}): CoachRetrievalResult<CoachFactPacket> =>
  buildCoachFactPacket({
    request,
    sources: {
      ...sources,
      bodyMeasurements: [],
    },
  });

export const buildCoachMeasurementProgressFactPacket = ({
  request,
  sources,
  measurementKey,
}: {
  request: CoachRetrievalRequest & { intent: 'body_progress' };
  sources: CoachRetrievalSources;
  measurementKey: string;
}): CoachRetrievalResult<CoachFactPacket> =>
  buildCoachFactPacket({
    request,
    sources: {
      ...sources,
      weightHistory: [],
      bodyMeasurements: sources.bodyMeasurements.filter(
        (measurement) => bodyMeasurementKey(measurement) === measurementKey,
      ),
    },
  });
