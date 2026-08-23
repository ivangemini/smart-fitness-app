import {
  getReviewedExerciseIntelligence,
  type ExerciseMovementPattern,
} from '@/features/exercises/exerciseIntelligence';
import {
  CANONICAL_MUSCLES,
  mapMuscleNamesToCanonicalIds,
  type CanonicalMuscleId,
} from '@/features/exercises/muscleTaxonomy';
import type { Exercise } from '@/features/exercises/types';
import type { WorkoutSession, WorkoutSet } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

export type TrainingCoverageWindowDays = 7 | 30 | 90;

export type TrainingCoverageContributor = {
  exerciseId: string;
  exerciseName: string;
  workingSetCount: number;
  volume: number;
  exposureSessions: number;
  lastTrainedAt: string;
};

export type TrainingCoverageMuscleFact = {
  id: CanonicalMuscleId;
  primarySets: number;
  primaryVolume: number;
  secondarySets: number;
  secondaryVolume: number;
  exposureSessions: number;
  lastTrainedAt: string | null;
  contributors: TrainingCoverageContributor[];
};

export type TrainingCoverageMovementFact = {
  pattern: ExerciseMovementPattern;
  workingSetCount: number;
  volume: number;
  exposureSessions: number;
  lastTrainedAt: string;
  contributors: TrainingCoverageContributor[];
};

export type TrainingCoverage = {
  endAt: string;
  windowDays: TrainingCoverageWindowDays;
  eligibleWorkingSetCount: number;
  mappedMuscleSetCount: number;
  unmappedMuscleSetCount: number;
  reviewedPatternSetCount: number;
  unmappedPatternSetCount: number;
  muscleExposure: TrainingCoverageMuscleFact[];
  movementPatterns: TrainingCoverageMovementFact[];
};

type ContributorBucket = {
  exerciseId: string;
  exerciseName: string;
  workingSetCount: number;
  volume: number;
  sessions: Set<string>;
  lastTrainedAt: string;
};

type MuscleBucket = {
  primarySets: number;
  primaryVolume: number;
  secondarySets: number;
  secondaryVolume: number;
  sessions: Set<string>;
  lastTrainedAt: string | null;
  contributors: Map<string, ContributorBucket>;
};

type MovementBucket = {
  workingSetCount: number;
  volume: number;
  sessions: Set<string>;
  lastTrainedAt: string;
  contributors: Map<string, ContributorBucket>;
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

const setVolume = (set: WorkoutSet) => (set.weight > 0 ? set.weight * set.reps : 0);

const latestTimestamp = (current: string | null, candidate: string) => {
  if (!current) return candidate;
  const currentAt = timestamp(current);
  const candidateAt = timestamp(candidate);
  if (candidateAt === null) return current;
  return currentAt === null || candidateAt > currentAt ? candidate : current;
};

const addContributor = (
  contributors: Map<string, ContributorBucket>,
  exerciseId: string,
  exerciseName: string,
  sessionId: string,
  finishedAt: string,
  volume: number,
) => {
  const existing = contributors.get(exerciseId);
  if (existing) {
    existing.workingSetCount += 1;
    existing.volume += volume;
    existing.sessions.add(sessionId);
    existing.lastTrainedAt = latestTimestamp(existing.lastTrainedAt, finishedAt);
    return;
  }

  contributors.set(exerciseId, {
    exerciseId,
    exerciseName,
    workingSetCount: 1,
    volume,
    sessions: new Set([sessionId]),
    lastTrainedAt: finishedAt,
  });
};

const materializeContributors = (contributors: Map<string, ContributorBucket>) =>
  [...contributors.values()]
    .map((contributor) => ({
      exerciseId: contributor.exerciseId,
      exerciseName: contributor.exerciseName,
      workingSetCount: contributor.workingSetCount,
      volume: contributor.volume,
      exposureSessions: contributor.sessions.size,
      lastTrainedAt: contributor.lastTrainedAt,
    }))
    .sort(
      (left, right) =>
        right.workingSetCount - left.workingSetCount ||
        right.volume - left.volume ||
        left.exerciseName.localeCompare(right.exerciseName),
    );

const createMuscleBuckets = () =>
  new Map<CanonicalMuscleId, MuscleBucket>(
    CANONICAL_MUSCLES.map((muscle) => [
      muscle.id,
      {
        primarySets: 0,
        primaryVolume: 0,
        secondarySets: 0,
        secondaryVolume: 0,
        sessions: new Set<string>(),
        lastTrainedAt: null,
        contributors: new Map<string, ContributorBucket>(),
      },
    ]),
  );

export function buildTrainingCoverage(input: {
  exercises: readonly Exercise[];
  sessions: readonly WorkoutSession[];
  endAt: string;
  windowDays: TrainingCoverageWindowDays;
}): TrainingCoverage {
  const endAt = timestamp(input.endAt);
  if (endAt === null) throw new Error('buildTrainingCoverage requires a valid endAt timestamp');

  const startAt = endAt - input.windowDays * DAY_MS;
  const exerciseById = new Map(input.exercises.map((exercise) => [exercise.id, exercise] as const));
  const muscles = createMuscleBuckets();
  const movements = new Map<ExerciseMovementPattern, MovementBucket>();
  let eligibleWorkingSetCount = 0;
  let mappedMuscleSetCount = 0;
  let unmappedMuscleSetCount = 0;
  let reviewedPatternSetCount = 0;
  let unmappedPatternSetCount = 0;

  for (const session of input.sessions) {
    const finishedAt = session.finishedAt || session.startedAt;
    const sessionAt = timestamp(finishedAt);
    if (sessionAt === null || sessionAt < startAt || sessionAt > endAt) continue;

    for (const set of session.sets) {
      if (!isEligibleWorkingSet(set)) continue;
      eligibleWorkingSetCount += 1;
      const volume = setVolume(set);
      const exactExerciseId = set.exerciseId.trim();
      const exercise = exactExerciseId ? exerciseById.get(exactExerciseId) : undefined;

      if (exercise) {
        const primary = mapMuscleNamesToCanonicalIds(exercise.primaryMuscles);
        const primaryIds = new Set(primary);
        const secondary = mapMuscleNamesToCanonicalIds(exercise.secondaryMuscles).filter(
          (id) => !primaryIds.has(id),
        );

        if (primary.length > 0 || secondary.length > 0) {
          mappedMuscleSetCount += 1;
          for (const muscleId of primary) {
            const bucket = muscles.get(muscleId)!;
            bucket.primarySets += 1;
            bucket.primaryVolume += volume;
            bucket.sessions.add(session.id);
            bucket.lastTrainedAt = latestTimestamp(bucket.lastTrainedAt, finishedAt);
            addContributor(
              bucket.contributors,
              exercise.id,
              exercise.name,
              session.id,
              finishedAt,
              volume,
            );
          }
          for (const muscleId of secondary) {
            const bucket = muscles.get(muscleId)!;
            bucket.secondarySets += 1;
            bucket.secondaryVolume += volume;
            bucket.sessions.add(session.id);
            bucket.lastTrainedAt = latestTimestamp(bucket.lastTrainedAt, finishedAt);
            addContributor(
              bucket.contributors,
              exercise.id,
              exercise.name,
              session.id,
              finishedAt,
              volume,
            );
          }
        } else {
          unmappedMuscleSetCount += 1;
        }
      } else {
        unmappedMuscleSetCount += 1;
      }

      const reviewed = exactExerciseId
        ? getReviewedExerciseIntelligence(exactExerciseId)
        : null;
      if (!reviewed) {
        unmappedPatternSetCount += 1;
        continue;
      }

      reviewedPatternSetCount += 1;
      const pattern = reviewed.movementPattern;
      const existing = movements.get(pattern);
      const exerciseName = exercise?.name ?? set.exerciseName;
      if (existing) {
        existing.workingSetCount += 1;
        existing.volume += volume;
        existing.sessions.add(session.id);
        existing.lastTrainedAt = latestTimestamp(existing.lastTrainedAt, finishedAt);
        addContributor(
          existing.contributors,
          exactExerciseId,
          exerciseName,
          session.id,
          finishedAt,
          volume,
        );
      } else {
        const contributors = new Map<string, ContributorBucket>();
        addContributor(
          contributors,
          exactExerciseId,
          exerciseName,
          session.id,
          finishedAt,
          volume,
        );
        movements.set(pattern, {
          workingSetCount: 1,
          volume,
          sessions: new Set([session.id]),
          lastTrainedAt: finishedAt,
          contributors,
        });
      }
    }
  }

  const muscleExposure = [...muscles.entries()]
    .map(([id, bucket]) => ({
      id,
      primarySets: bucket.primarySets,
      primaryVolume: bucket.primaryVolume,
      secondarySets: bucket.secondarySets,
      secondaryVolume: bucket.secondaryVolume,
      exposureSessions: bucket.sessions.size,
      lastTrainedAt: bucket.lastTrainedAt,
      contributors: materializeContributors(bucket.contributors),
    }))
    .sort(
      (left, right) =>
        right.primarySets - left.primarySets ||
        right.primaryVolume - left.primaryVolume ||
        right.secondarySets - left.secondarySets ||
        left.id.localeCompare(right.id),
    );

  const movementPatterns = [...movements.entries()]
    .map(([pattern, bucket]) => ({
      pattern,
      workingSetCount: bucket.workingSetCount,
      volume: bucket.volume,
      exposureSessions: bucket.sessions.size,
      lastTrainedAt: bucket.lastTrainedAt,
      contributors: materializeContributors(bucket.contributors),
    }))
    .sort(
      (left, right) =>
        right.workingSetCount - left.workingSetCount ||
        right.volume - left.volume ||
        left.pattern.localeCompare(right.pattern),
    );

  return {
    endAt: input.endAt,
    windowDays: input.windowDays,
    eligibleWorkingSetCount,
    mappedMuscleSetCount,
    unmappedMuscleSetCount,
    reviewedPatternSetCount,
    unmappedPatternSetCount,
    muscleExposure,
    movementPatterns,
  };
}
