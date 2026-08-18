import {
  buildCoachFactPacket,
  type CoachFactPacket,
  type CoachRetrievalRequest,
  type CoachRetrievalResult,
  type CoachRetrievalSources,
} from './coachRetrieval';

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
