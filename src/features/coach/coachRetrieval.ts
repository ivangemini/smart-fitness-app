import type { AppState } from '@/types';

import {
  readBoundedWorkoutHistory,
  readExerciseHistory,
  readTrainingSummary,
  type CoachCapabilityError,
  type CoachExerciseHistoryData,
  type CoachTrainingSummaryData,
  type CoachWorkoutHistoryData,
} from './coachDataCapabilities';
import {
  readBodyMetrics,
  readCoachProfileFacts,
  readConfirmedLabs,
  readCurrentProgram,
  readNutritionSummary,
  type CoachBodyMetricsData,
  type CoachCanonicalCapabilityError,
  type CoachConfirmedLabsData,
  type CoachCurrentProgramData,
  type CoachLabResultInput,
  type CoachNutritionSummaryData,
  type CoachProfileFacts,
} from './coachCanonicalCapabilities';

export type CoachRetrievalIntent =
  | 'training_overview'
  | 'exercise_progress'
  | 'workout_history'
  | 'current_program_review'
  | 'body_progress'
  | 'nutrition_overview'
  | 'labs_marker_history';

export type CoachRetrievalCapability =
  | 'training_summary'
  | 'exercise_history'
  | 'workout_history'
  | 'current_program'
  | 'profile_facts'
  | 'body_metrics'
  | 'nutrition_summary'
  | 'confirmed_labs';

export type CoachRetrievalRequest = {
  intent: CoachRetrievalIntent;
  endAt: string;
  days?: number;
  exerciseId?: string;
  exerciseName?: string;
  includeBodyWeightContext?: boolean;
  labMarkerName?: string;
};

export type CoachRetrievalPlan = {
  intent: CoachRetrievalIntent;
  capabilities: CoachRetrievalCapability[];
};

export type CoachRetrievalError = {
  code:
    | CoachCapabilityError['code']
    | CoachCanonicalCapabilityError['code']
    | 'missing_lab_marker_query';
  message: string;
};

export type CoachRetrievalResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: CoachRetrievalError };

export type CoachRetrievalSources = Pick<
  AppState,
  | 'workoutSessions'
  | 'trainingPrograms'
  | 'workouts'
  | 'profile'
  | 'userLimitations'
  | 'weightHistory'
  | 'bodyMeasurements'
  | 'foodEntries'
  | 'nutritionTargets'
> & {
  labResults?: CoachLabResultInput[];
};

export type CoachLabsMarkerHistoryFact = {
  markerQuery: string;
  results: Array<{
    labName: string | null;
    collectedAt: string | null;
    confirmedAt: string | null;
    markers: CoachConfirmedLabsData['results'][number]['markers'];
  }>;
  totalMatchingResults: number;
  resultsTruncated: boolean;
};

export type CoachFactPacket = {
  schemaVersion: 1;
  intent: CoachRetrievalIntent;
  periodAnchor: string;
  facts: Partial<{
    trainingSummary: CoachTrainingSummaryData;
    exerciseHistory: CoachExerciseHistoryData;
    workoutHistory: CoachWorkoutHistoryData;
    currentProgram: CoachCurrentProgramData;
    profileFacts: CoachProfileFacts;
    bodyMetrics: CoachBodyMetricsData;
    nutritionSummary: CoachNutritionSummaryData;
    labsMarkerHistory: CoachLabsMarkerHistoryFact;
  }>;
};

export const buildCoachRetrievalPlan = (request: CoachRetrievalRequest): CoachRetrievalPlan => {
  switch (request.intent) {
    case 'training_overview':
      return { intent: request.intent, capabilities: ['training_summary'] };
    case 'exercise_progress':
      return {
        intent: request.intent,
        capabilities: request.includeBodyWeightContext
          ? ['exercise_history', 'body_metrics']
          : ['exercise_history'],
      };
    case 'workout_history':
      return { intent: request.intent, capabilities: ['workout_history'] };
    case 'current_program_review':
      return {
        intent: request.intent,
        capabilities: ['current_program', 'training_summary', 'profile_facts'],
      };
    case 'body_progress':
      return { intent: request.intent, capabilities: ['body_metrics'] };
    case 'nutrition_overview':
      return { intent: request.intent, capabilities: ['nutrition_summary'] };
    case 'labs_marker_history':
      return { intent: request.intent, capabilities: ['confirmed_labs'] };
  }
};

const normalizeText = (value: string) => value.trim().toLocaleLowerCase();

const filterLabMarkerHistory = ({
  labResults,
  markerQuery,
}: {
  labResults: CoachLabResultInput[];
  markerQuery: string;
}): CoachLabsMarkerHistoryFact => {
  const normalizedQuery = normalizeText(markerQuery);
  const confirmedLabs = readConfirmedLabs({ results: labResults, limit: 12 });
  const matchingResults = confirmedLabs.results
    .map((result) => ({
      labName: result.labName,
      collectedAt: result.collectedAt,
      confirmedAt: result.confirmedAt,
      markers: result.markers.filter((marker) =>
        [marker.canonicalName, marker.displayName].some(
          (candidate) => normalizeText(candidate) === normalizedQuery,
        ),
      ),
    }))
    .filter((result) => result.markers.length > 0);

  return {
    markerQuery,
    results: matchingResults,
    totalMatchingResults: matchingResults.length,
    resultsTruncated: confirmedLabs.resultsTruncated,
  };
};

const returnCapabilityError = (
  error: CoachCapabilityError | CoachCanonicalCapabilityError,
): CoachRetrievalResult<never> => ({ ok: false, error });

export const buildCoachFactPacket = ({
  request,
  sources,
}: {
  request: CoachRetrievalRequest;
  sources: CoachRetrievalSources;
}): CoachRetrievalResult<CoachFactPacket> => {
  const plan = buildCoachRetrievalPlan(request);
  const facts: CoachFactPacket['facts'] = {};

  for (const capability of plan.capabilities) {
    switch (capability) {
      case 'training_summary': {
        const result = readTrainingSummary({
          sessions: sources.workoutSessions,
          endAt: request.endAt,
          days: request.days,
        });
        if (!result.ok) return returnCapabilityError(result.error);
        facts.trainingSummary = result.data;
        break;
      }
      case 'exercise_history': {
        const result = readExerciseHistory({
          sessions: sources.workoutSessions,
          endAt: request.endAt,
          days: request.days,
          exerciseId: request.exerciseId,
          exerciseName: request.exerciseName,
        });
        if (!result.ok) return returnCapabilityError(result.error);
        facts.exerciseHistory = result.data;
        break;
      }
      case 'workout_history': {
        const result = readBoundedWorkoutHistory({
          sessions: sources.workoutSessions,
          endAt: request.endAt,
          days: request.days,
        });
        if (!result.ok) return returnCapabilityError(result.error);
        facts.workoutHistory = result.data;
        break;
      }
      case 'current_program':
        facts.currentProgram = readCurrentProgram({
          profile: sources.profile,
          trainingPrograms: sources.trainingPrograms,
          workouts: sources.workouts,
        });
        break;
      case 'profile_facts':
        facts.profileFacts = readCoachProfileFacts({
          profile: sources.profile,
          userLimitations: sources.userLimitations,
        });
        break;
      case 'body_metrics': {
        const result = readBodyMetrics({
          weightHistory: sources.weightHistory,
          bodyMeasurements: sources.bodyMeasurements,
          endAt: request.endAt,
          days: request.days,
        });
        if (!result.ok) return returnCapabilityError(result.error);
        facts.bodyMetrics = result.data;
        break;
      }
      case 'nutrition_summary': {
        const result = readNutritionSummary({
          foodEntries: sources.foodEntries,
          nutritionTargets: sources.nutritionTargets,
          endAt: request.endAt,
          days: request.days,
        });
        if (!result.ok) return returnCapabilityError(result.error);
        facts.nutritionSummary = result.data;
        break;
      }
      case 'confirmed_labs': {
        const markerQuery = request.labMarkerName?.trim();
        if (!markerQuery) {
          return {
            ok: false,
            error: {
              code: 'missing_lab_marker_query',
              message: 'labMarkerName is required for Labs marker history retrieval.',
            },
          };
        }
        facts.labsMarkerHistory = filterLabMarkerHistory({
          labResults: sources.labResults ?? [],
          markerQuery,
        });
        break;
      }
    }
  }

  return {
    ok: true,
    data: {
      schemaVersion: 1,
      intent: plan.intent,
      periodAnchor: request.endAt,
      facts,
    },
  };
};
