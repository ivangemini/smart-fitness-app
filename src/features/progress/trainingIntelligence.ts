import type { Exercise } from '@/features/exercises/types';
import {
  CANONICAL_MUSCLES,
  mapMuscleNamesToCanonicalIds,
  type CanonicalMuscleId,
} from '@/features/exercises/muscleTaxonomy';
import { calculateComparableEstimated1Rm } from '@/lib/progress/trainingAnalytics';
import type { WorkoutSession, WorkoutSet } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const PLATEAU_RANGE = 0.02;
const REGRESSION_RANGE = 0.05;
const VOLUME_SPIKE_RATIO = 1.5;
const GAP_DAYS = 21;

export const TRAINING_INTELLIGENCE_RULESET_VERSION = 'training-intelligence-v1' as const;
export type TrainingIntelligenceWindowDays = 7 | 30 | 90;
export type TrainingFindingKind =
  | 'new_pr'
  | 'plateau'
  | 'rep_progression'
  | 'regression'
  | 'volume_spike'
  | 'muscle_exposure_imbalance'
  | 'muscle_gap'
  | 'exercise_gap';
export type TrainingPrType = 'load' | 'reps' | 'estimated_1rm' | 'session_volume';

export type CanonicalMuscleLoadFact = {
  id: CanonicalMuscleId;
  label: string;
  primarySets: number;
  primaryVolume: number;
  secondarySets: number;
  exposureSessions: number;
  previousPrimarySets: number;
  previousPrimaryVolume: number;
  volumeChangePercent: number | null;
  lastTrainedAt: string | null;
};

export type TrainingFinding = {
  id: string;
  kind: TrainingFindingKind;
  rulesetVersion: typeof TRAINING_INTELLIGENCE_RULESET_VERSION;
  occurredAt: string;
  exerciseId?: string;
  exerciseName?: string;
  muscleId?: CanonicalMuscleId;
  prType?: TrainingPrType;
  evidence: Record<string, number | string | null>;
};

export type CanonicalTrainingIntelligence = {
  endAt: string;
  windowDays: TrainingIntelligenceWindowDays;
  mappedExerciseCount: number;
  unmappedWorkingSetCount: number;
  muscleLoad: CanonicalMuscleLoadFact[];
  findings: TrainingFinding[];
};

type Exposure = {
  exerciseId: string;
  exerciseName: string;
  sessionId: string;
  finishedAt: string;
  bestWeight: number;
  bestRepsAtBestWeight: number;
  bestEstimated1Rm: number | null;
  volume: number;
  sets: WorkoutSet[];
};

type MuscleBucket = {
  primarySets: number;
  primaryVolume: number;
  secondarySets: number;
  sessions: Set<string>;
  lastTrainedAt: string | null;
};

const round = (value: number, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
};
const normalizeName = (value: string) => value.trim().toLocaleLowerCase();
const timestamp = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const isWorkingSet = (set: WorkoutSet) =>
  set.completed !== false && Number.isFinite(set.reps) && set.reps > 0 && Number.isFinite(set.weight) && set.weight >= 0;
const latestTimestamp = (current: string | null, candidate: string) => {
  if (!current) return candidate;
  const currentAt = timestamp(current);
  const candidateAt = timestamp(candidate);
  if (candidateAt === null) return current;
  return currentAt === null || candidateAt > currentAt ? candidate : current;
};

const buildExerciseResolver = (exercises: Exercise[]) => {
  const byId = new Map(exercises.map((exercise) => [exercise.id, exercise] as const));
  const byName = new Map<string, Exercise | null>();
  for (const exercise of exercises) {
    const key = normalizeName(exercise.name);
    byName.set(key, byName.has(key) ? null : exercise);
  }
  return (set: WorkoutSet) => byId.get(set.exerciseId) ?? byName.get(normalizeName(set.exerciseName)) ?? null;
};

const createMuscleBuckets = () =>
  new Map<CanonicalMuscleId, MuscleBucket>(
    CANONICAL_MUSCLES.map((muscle) => [
      muscle.id,
      { primarySets: 0, primaryVolume: 0, secondarySets: 0, sessions: new Set<string>(), lastTrainedAt: null },
    ]),
  );

const aggregateMuscles = (
  sessions: WorkoutSession[],
  exercises: Exercise[],
  startAt: number,
  endAt: number,
) => {
  const buckets = createMuscleBuckets();
  const resolveExercise = buildExerciseResolver(exercises);
  let unmappedWorkingSetCount = 0;
  const mappedExerciseIds = new Set<string>();

  for (const session of sessions) {
    const completedAt = session.finishedAt || session.startedAt;
    const sessionAt = timestamp(completedAt);
    if (sessionAt === null || sessionAt < startAt || sessionAt > endAt) continue;
    for (const set of session.sets) {
      if (!isWorkingSet(set)) continue;
      const exercise = resolveExercise(set);
      if (!exercise) {
        unmappedWorkingSetCount += 1;
        continue;
      }
      const primary = mapMuscleNamesToCanonicalIds(exercise.primaryMuscles);
      const primarySet = new Set(primary);
      const secondary = mapMuscleNamesToCanonicalIds(exercise.secondaryMuscles).filter((id) => !primarySet.has(id));
      if (primary.length === 0 && secondary.length === 0) {
        unmappedWorkingSetCount += 1;
        continue;
      }
      mappedExerciseIds.add(exercise.id);
      const volume = set.weight > 0 ? set.weight * set.reps : 0;
      for (const id of primary) {
        const bucket = buckets.get(id)!;
        bucket.primarySets += 1;
        bucket.primaryVolume += volume;
        bucket.sessions.add(session.id);
        bucket.lastTrainedAt = latestTimestamp(bucket.lastTrainedAt, completedAt);
      }
      for (const id of secondary) {
        const bucket = buckets.get(id)!;
        bucket.secondarySets += 1;
        bucket.sessions.add(session.id);
        bucket.lastTrainedAt = latestTimestamp(bucket.lastTrainedAt, completedAt);
      }
    }
  }
  return { buckets, mappedExerciseCount: mappedExerciseIds.size, unmappedWorkingSetCount };
};

const buildExposures = (sessions: WorkoutSession[]) => {
  const byExercise = new Map<string, Exposure[]>();
  const ordered = sessions
    .map((session) => ({ session, at: timestamp(session.finishedAt || session.startedAt) }))
    .filter((item): item is { session: WorkoutSession; at: number } => item.at !== null)
    .sort((left, right) => left.at - right.at);

  for (const { session } of ordered) {
    const grouped = new Map<string, WorkoutSet[]>();
    for (const set of session.sets) {
      if (!isWorkingSet(set)) continue;
      const key = set.exerciseId.trim() ? `id:${set.exerciseId.trim()}` : `name:${normalizeName(set.exerciseName)}`;
      const values = grouped.get(key) ?? [];
      values.push(set);
      grouped.set(key, values);
    }
    for (const [key, sets] of grouped) {
      const bestWeight = Math.max(...sets.map((set) => set.weight));
      const bestRepsAtBestWeight = Math.max(...sets.filter((set) => set.weight === bestWeight).map((set) => set.reps));
      const estimates = sets.map((set) => calculateComparableEstimated1Rm(set.weight, set.reps)).filter((value): value is number => value !== null);
      const exposure: Exposure = {
        exerciseId: sets[0].exerciseId,
        exerciseName: sets[0].exerciseName,
        sessionId: session.id,
        finishedAt: session.finishedAt || session.startedAt,
        bestWeight,
        bestRepsAtBestWeight,
        bestEstimated1Rm: estimates.length > 0 ? Math.max(...estimates) : null,
        volume: round(sets.reduce((total, set) => total + (set.weight > 0 ? set.weight * set.reps : 0), 0)),
        sets,
      };
      const values = byExercise.get(key) ?? [];
      values.push(exposure);
      byExercise.set(key, values);
    }
  }
  return byExercise;
};

const makeFinding = (input: Omit<TrainingFinding, 'rulesetVersion'>): TrainingFinding => ({
  ...input,
  rulesetVersion: TRAINING_INTELLIGENCE_RULESET_VERSION,
});

const buildExposureFindings = (key: string, exposures: Exposure[]) => {
  const findings: TrainingFinding[] = [];
  for (let index = 0; index < exposures.length; index += 1) {
    const current = exposures[index];
    const previous = exposures.slice(0, index);
    if (previous.length > 0) {
      const previousBestWeight = Math.max(...previous.map((item) => item.bestWeight));
      const previousBestVolume = Math.max(...previous.map((item) => item.volume));
      const previousE1Rm = previous.map((item) => item.bestEstimated1Rm).filter((value): value is number => value !== null);
      const previousBestE1Rm = previousE1Rm.length > 0 ? Math.max(...previousE1Rm) : null;

      if (current.bestWeight > previousBestWeight) {
        findings.push(makeFinding({ id: `${key}:${current.sessionId}:load`, kind: 'new_pr', occurredAt: current.finishedAt, exerciseId: current.exerciseId, exerciseName: current.exerciseName, prType: 'load', evidence: { previousBest: previousBestWeight, newBest: current.bestWeight } }));
      }
      if (current.volume > previousBestVolume) {
        findings.push(makeFinding({ id: `${key}:${current.sessionId}:volume`, kind: 'new_pr', occurredAt: current.finishedAt, exerciseId: current.exerciseId, exerciseName: current.exerciseName, prType: 'session_volume', evidence: { previousBest: previousBestVolume, newBest: current.volume } }));
      }
      if (current.bestEstimated1Rm !== null && previousBestE1Rm !== null && current.bestEstimated1Rm > previousBestE1Rm) {
        findings.push(makeFinding({ id: `${key}:${current.sessionId}:e1rm`, kind: 'new_pr', occurredAt: current.finishedAt, exerciseId: current.exerciseId, exerciseName: current.exerciseName, prType: 'estimated_1rm', evidence: { previousBest: previousBestE1Rm, newBest: current.bestEstimated1Rm } }));
      }
      for (const set of current.sets) {
        const priorSameLoad = previous.flatMap((item) => item.sets).filter((prior) => prior.weight === set.weight);
        if (priorSameLoad.length === 0) continue;
        const priorBestReps = Math.max(...priorSameLoad.map((prior) => prior.reps));
        if (set.reps > priorBestReps) {
          findings.push(makeFinding({ id: `${key}:${current.sessionId}:reps:${set.weight}`, kind: 'new_pr', occurredAt: current.finishedAt, exerciseId: current.exerciseId, exerciseName: current.exerciseName, prType: 'reps', evidence: { load: set.weight, previousBestReps: priorBestReps, newBestReps: set.reps } }));
          break;
        }
      }
    }

    const recent = exposures.slice(Math.max(0, index - 2), index + 1);
    if (recent.length < 3) continue;
    const e1rms = recent.map((item) => item.bestEstimated1Rm);
    if (e1rms.every((value): value is number => value !== null)) {
      const high = Math.max(...e1rms);
      const low = Math.min(...e1rms);
      if (high > 0 && (high - low) / high <= PLATEAU_RANGE) {
        findings.push(makeFinding({ id: `${key}:${current.sessionId}:plateau`, kind: 'plateau', occurredAt: current.finishedAt, exerciseId: current.exerciseId, exerciseName: current.exerciseName, evidence: { exposureCount: 3, lowEstimated1Rm: low, highEstimated1Rm: high, allowedRangePercent: PLATEAU_RANGE * 100 } }));
      } else if (e1rms[2] < e1rms[0] * (1 - REGRESSION_RANGE) && e1rms[2] <= e1rms[1]) {
        findings.push(makeFinding({ id: `${key}:${current.sessionId}:regression`, kind: 'regression', occurredAt: current.finishedAt, exerciseId: current.exerciseId, exerciseName: current.exerciseName, evidence: { firstEstimated1Rm: e1rms[0], latestEstimated1Rm: e1rms[2], thresholdPercent: REGRESSION_RANGE * 100 } }));
      }
    }
    const sameLoad = recent.every((item) => item.bestWeight === recent[0].bestWeight);
    const risingReps = recent[0].bestRepsAtBestWeight < recent[1].bestRepsAtBestWeight && recent[1].bestRepsAtBestWeight < recent[2].bestRepsAtBestWeight;
    if (sameLoad && recent[0].bestWeight > 0 && risingReps) {
      findings.push(makeFinding({ id: `${key}:${current.sessionId}:rep-progression`, kind: 'rep_progression', occurredAt: current.finishedAt, exerciseId: current.exerciseId, exerciseName: current.exerciseName, evidence: { load: recent[0].bestWeight, firstReps: recent[0].bestRepsAtBestWeight, latestReps: recent[2].bestRepsAtBestWeight } }));
    }
  }
  return findings;
};

const buildExerciseFindings = (sessions: WorkoutSession[], endAt: number) => {
  const findings: TrainingFinding[] = [];
  for (const [key, exposures] of buildExposures(sessions)) {
    const eligible = exposures.filter((item) => (timestamp(item.finishedAt) ?? Infinity) <= endAt);
    findings.push(...buildExposureFindings(key, eligible));

    const latest = eligible.at(-1);
    if (!latest || eligible.length < 2) continue;
    const latestAt = timestamp(latest.finishedAt);
    if (latestAt !== null && endAt - latestAt >= GAP_DAYS * DAY_MS) {
      findings.push(makeFinding({ id: `${key}:gap:${latest.finishedAt}`, kind: 'exercise_gap', occurredAt: new Date(endAt).toISOString(), exerciseId: latest.exerciseId, exerciseName: latest.exerciseName, evidence: { lastTrainedAt: latest.finishedAt, gapDays: Math.floor((endAt - latestAt) / DAY_MS), historicalSessionCount: eligible.length } }));
    }
  }
  return findings;
};

const totalWeightedVolume = (sessions: WorkoutSession[], startAt: number, endAt: number) =>
  sessions.reduce((total, session) => {
    const at = timestamp(session.finishedAt || session.startedAt);
    if (at === null || at < startAt || at > endAt) return total;
    return total + session.sets.reduce((sum, set) => sum + (isWorkingSet(set) && set.weight > 0 ? set.weight * set.reps : 0), 0);
  }, 0);

export const buildCanonicalTrainingIntelligence = (input: {
  exercises: Exercise[];
  sessions: WorkoutSession[];
  endAt: string;
  windowDays: TrainingIntelligenceWindowDays;
}): CanonicalTrainingIntelligence => {
  const endAt = timestamp(input.endAt);
  if (endAt === null) throw new Error('buildCanonicalTrainingIntelligence requires a valid endAt timestamp');
  const windowMs = input.windowDays * DAY_MS;
  const currentStart = endAt - windowMs;
  const previousStart = currentStart - windowMs;
  const current = aggregateMuscles(input.sessions, input.exercises, currentStart, endAt);
  const previous = aggregateMuscles(input.sessions, input.exercises, previousStart, currentStart - 1);
  const allHistory = aggregateMuscles(input.sessions, input.exercises, 0, endAt);

  const muscleLoad = CANONICAL_MUSCLES.map((muscle): CanonicalMuscleLoadFact => {
    const currentBucket = current.buckets.get(muscle.id)!;
    const previousBucket = previous.buckets.get(muscle.id)!;
    const historyBucket = allHistory.buckets.get(muscle.id)!;
    const volumeChangePercent = previousBucket.primaryVolume > 0
      ? round(((currentBucket.primaryVolume - previousBucket.primaryVolume) / previousBucket.primaryVolume) * 100, 1)
      : null;
    return {
      id: muscle.id,
      label: muscle.label,
      primarySets: currentBucket.primarySets,
      primaryVolume: round(currentBucket.primaryVolume),
      secondarySets: currentBucket.secondarySets,
      exposureSessions: currentBucket.sessions.size,
      previousPrimarySets: previousBucket.primarySets,
      previousPrimaryVolume: round(previousBucket.primaryVolume),
      volumeChangePercent,
      lastTrainedAt: historyBucket.lastTrainedAt,
    };
  });

  const findings = buildExerciseFindings(input.sessions, endAt)
    .filter((finding) => {
      const findingAt = timestamp(finding.occurredAt);
      return findingAt !== null && findingAt >= currentStart && findingAt <= endAt;
    });
  const current7Volume = totalWeightedVolume(input.sessions, endAt - 7 * DAY_MS, endAt);
  const previous7Volume = totalWeightedVolume(input.sessions, endAt - 14 * DAY_MS, endAt - 7 * DAY_MS - 1);
  if (previous7Volume > 0 && current7Volume >= previous7Volume * VOLUME_SPIKE_RATIO) {
    findings.push(makeFinding({ id: `volume-spike:${input.endAt}`, kind: 'volume_spike', occurredAt: input.endAt, evidence: { current7DayVolume: round(current7Volume), previous7DayVolume: round(previous7Volume), ratio: round(current7Volume / previous7Volume, 2) } }));
  }

  const activeMuscles = muscleLoad.filter((fact) => fact.primarySets > 0).sort((a, b) => b.primarySets - a.primarySets);
  if (activeMuscles.length >= 3) {
    const median = activeMuscles.map((fact) => fact.primarySets).sort((a, b) => a - b)[Math.floor(activeMuscles.length / 2)];
    const top = activeMuscles[0];
    if (median > 0 && top.primarySets >= 6 && top.primarySets >= median * 2) {
      findings.push(makeFinding({ id: `muscle-concentration:${top.id}:${input.endAt}`, kind: 'muscle_exposure_imbalance', occurredAt: input.endAt, muscleId: top.id, evidence: { topPrimarySets: top.primarySets, medianActiveMusclePrimarySets: median, activeMuscleCount: activeMuscles.length } }));
    }
  }

  for (const fact of muscleLoad) {
    if (!fact.lastTrainedAt) continue;
    const lastAt = timestamp(fact.lastTrainedAt);
    const history = allHistory.buckets.get(fact.id)!;
    if (lastAt !== null && history.sessions.size >= 2 && endAt - lastAt >= GAP_DAYS * DAY_MS) {
      findings.push(makeFinding({ id: `muscle-gap:${fact.id}:${fact.lastTrainedAt}`, kind: 'muscle_gap', occurredAt: input.endAt, muscleId: fact.id, evidence: { lastTrainedAt: fact.lastTrainedAt, gapDays: Math.floor((endAt - lastAt) / DAY_MS), historicalSessionCount: history.sessions.size } }));
    }
  }

  return {
    endAt: new Date(endAt).toISOString(),
    windowDays: input.windowDays,
    mappedExerciseCount: current.mappedExerciseCount,
    unmappedWorkingSetCount: current.unmappedWorkingSetCount,
    muscleLoad,
    findings: findings
      .sort((left, right) => (timestamp(right.occurredAt) ?? 0) - (timestamp(left.occurredAt) ?? 0))
      .slice(0, 12),
  };
};