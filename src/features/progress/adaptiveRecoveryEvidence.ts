import { mapMuscleNamesToCanonicalIds, type CanonicalMuscleId } from '@/features/exercises/muscleTaxonomy';
import type { Exercise } from '@/features/exercises/types';
import type { RecoveryCheckIn, WorkoutSession, WorkoutSet } from '@/types';

import type { AdaptiveProgramProposal } from './adaptiveProgramEngine';

const HOUR_MS = 60 * 60 * 1000;
const RECENT_EXPOSURE_HOURS = 72;
const RECENT_CHECK_IN_DAYS = 7;

export type RecoveryCheckInSnapshot = {
  checkInId: string;
  recordedAt: string;
  ageHours: number;
  sleepDurationHours: number | null;
  sleepQuality: number | null;
  fatigue: number | null;
  soreness: number | null;
  stress: number | null;
  painInterference: number | null;
  selfReportedReadiness: number | null;
};

export type AdaptiveProposalExposureEvidence = {
  exerciseId: string;
  primaryMuscleIds: CanonicalMuscleId[];
  windowHours: typeof RECENT_EXPOSURE_HOURS;
  workingSetCount: number;
  exposureSessionCount: number;
  lastExposureAt: string | null;
  contributingExerciseIds: string[];
};

export type AdaptiveRecoveryEvidence = {
  latestCheckIn: RecoveryCheckInSnapshot | null;
  recentCheckInCount: number;
  proposalExposure: AdaptiveProposalExposureEvidence[];
};

const timestamp = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isEligibleWorkingSet = (set: WorkoutSet) =>
  set.completed !== false &&
  set.setType !== 'warmup' &&
  Number.isFinite(set.reps) &&
  set.reps > 0 &&
  Number.isFinite(set.weight) &&
  set.weight >= 0;

const latestTimestamp = (current: string | null, candidate: string) => {
  if (!current) return candidate;
  const currentAt = timestamp(current);
  const candidateAt = timestamp(candidate);
  if (candidateAt === null) return current;
  return currentAt === null || candidateAt > currentAt ? candidate : current;
};

const buildCheckInSnapshot = (
  checkIns: readonly RecoveryCheckIn[],
  endAt: number,
): { latest: RecoveryCheckInSnapshot | null; recentCount: number } => {
  const recentStart = endAt - RECENT_CHECK_IN_DAYS * 24 * HOUR_MS;
  const ordered = [...checkIns]
    .map((checkIn) => ({ checkIn, at: timestamp(checkIn.recordedAt) }))
    .filter(
      (entry): entry is { checkIn: RecoveryCheckIn; at: number } =>
        entry.at !== null && entry.at <= endAt,
    )
    .sort((left, right) => right.at - left.at || left.checkIn.id.localeCompare(right.checkIn.id));
  const latest = ordered[0];

  return {
    recentCount: ordered.filter((entry) => entry.at >= recentStart).length,
    latest: latest
      ? {
          checkInId: latest.checkIn.id,
          recordedAt: latest.checkIn.recordedAt,
          ageHours: Math.max(0, Math.round(((endAt - latest.at) / HOUR_MS) * 10) / 10),
          sleepDurationHours: latest.checkIn.sleepDurationHours,
          sleepQuality: latest.checkIn.sleepQuality,
          fatigue: latest.checkIn.fatigue,
          soreness: latest.checkIn.soreness,
          stress: latest.checkIn.stress,
          painInterference: latest.checkIn.painInterference,
          selfReportedReadiness: latest.checkIn.readiness,
        }
      : null,
  };
};

export function buildAdaptiveRecoveryEvidence(input: {
  endAt: string;
  exercises: readonly Exercise[];
  proposals: readonly AdaptiveProgramProposal[];
  recoveryCheckIns: readonly RecoveryCheckIn[];
  sessions: readonly WorkoutSession[];
}): AdaptiveRecoveryEvidence {
  const endAt = timestamp(input.endAt);
  if (endAt === null) throw new Error('buildAdaptiveRecoveryEvidence requires a valid endAt timestamp');

  const exerciseById = new Map(input.exercises.map((exercise) => [exercise.id, exercise] as const));
  const recentStart = endAt - RECENT_EXPOSURE_HOURS * HOUR_MS;
  const eligibleSets = input.sessions.flatMap((session) => {
    const finishedAt = session.finishedAt || session.startedAt;
    const at = timestamp(finishedAt);
    if (at === null || at < recentStart || at > endAt) return [];
    return session.sets
      .filter(isEligibleWorkingSet)
      .map((set) => ({ sessionId: session.id, finishedAt, set }));
  });

  const proposalExposure = input.proposals.map((proposal): AdaptiveProposalExposureEvidence => {
    const proposalExercise = exerciseById.get(proposal.exerciseId);
    const primaryMuscleIds = proposalExercise
      ? mapMuscleNamesToCanonicalIds(proposalExercise.primaryMuscles)
      : [];
    const targetMuscles = new Set(primaryMuscleIds);
    const sessions = new Set<string>();
    const contributingExerciseIds = new Set<string>();
    let workingSetCount = 0;
    let lastExposureAt: string | null = null;

    if (targetMuscles.size > 0) {
      for (const entry of eligibleSets) {
        const exerciseId = entry.set.exerciseId.trim();
        if (!exerciseId) continue;
        const exercise = exerciseById.get(exerciseId);
        if (!exercise) continue;
        const setPrimaryMuscles = mapMuscleNamesToCanonicalIds(exercise.primaryMuscles);
        if (!setPrimaryMuscles.some((muscleId) => targetMuscles.has(muscleId))) continue;

        workingSetCount += 1;
        sessions.add(entry.sessionId);
        contributingExerciseIds.add(exercise.id);
        lastExposureAt = latestTimestamp(lastExposureAt, entry.finishedAt);
      }
    }

    return {
      exerciseId: proposal.exerciseId,
      primaryMuscleIds,
      windowHours: RECENT_EXPOSURE_HOURS,
      workingSetCount,
      exposureSessionCount: sessions.size,
      lastExposureAt,
      contributingExerciseIds: [...contributingExerciseIds].sort(),
    };
  });

  const checkIns = buildCheckInSnapshot(input.recoveryCheckIns, endAt);
  return {
    latestCheckIn: checkIns.latest,
    recentCheckInCount: checkIns.recentCount,
    proposalExposure,
  };
}
