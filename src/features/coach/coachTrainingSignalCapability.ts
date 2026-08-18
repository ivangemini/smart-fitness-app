import type { WorkoutSession } from '@/types';
import {
  buildTrainingSignalAnalytics,
  type TrainingSignalAnalytics,
} from '@/lib/progress/trainingSignals';

import {
  COACH_HISTORY_MAX_DAYS,
  type CoachCapabilityResult,
} from './coachDataCapabilities';

const DEFAULT_COACH_SIGNAL_DAYS = 28;
const MAX_COACH_SIGNAL_EXERCISES = 12;

const clampDays = (value: number | undefined) => {
  if (!Number.isFinite(value)) return DEFAULT_COACH_SIGNAL_DAYS;
  return Math.min(COACH_HISTORY_MAX_DAYS, Math.max(1, Math.trunc(value as number)));
};

export type CoachTrainingSignalData = TrainingSignalAnalytics;

export const readTrainingSignals = ({
  sessions,
  endAt,
  days,
}: {
  sessions: WorkoutSession[];
  endAt: string;
  days?: number;
}): CoachCapabilityResult<CoachTrainingSignalData> => {
  if (!Number.isFinite(Date.parse(endAt))) {
    return {
      ok: false,
      error: {
        code: 'invalid_end_at',
        message: 'A valid endAt timestamp is required.',
      },
    };
  }

  return {
    ok: true,
    data: buildTrainingSignalAnalytics(sessions, {
      endAt,
      periodDays: clampDays(days),
      maxExercises: MAX_COACH_SIGNAL_EXERCISES,
    }),
  };
};
