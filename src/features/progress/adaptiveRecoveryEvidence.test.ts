import { describe, expect, it } from 'vitest';

import type { Exercise } from '@/features/exercises/types';
import type { RecoveryCheckIn, WorkoutSession, WorkoutSet } from '@/types';
import { TRAINING_INTELLIGENCE_RULESET_VERSION } from './trainingIntelligence';
import type { AdaptiveProgramProposal } from './adaptiveProgramEngine';
import { buildAdaptiveRecoveryEvidence } from './adaptiveRecoveryEvidence';

const exercise = (id: string, name: string, primaryMuscles: string[]): Exercise => ({
  id,
  name,
  aliases: [],
  equipment: [],
  bodyPart: 'strength',
  primaryMuscles,
  secondaryMuscles: [],
  instructions: [],
  coachingTips: [],
  media: {},
  source: { provider: 'local-fixture' },
});

const proposal = (exerciseId = 'bench'): AdaptiveProgramProposal => ({
  exerciseId,
  exerciseName: 'Bench',
  baseAction: 'progress',
  action: 'progress',
  recoveryModifier: 'neutral',
  adjustedByRecovery: false,
  finding: {
    id: 'finding',
    kind: 'new_pr',
    rulesetVersion: TRAINING_INTELLIGENCE_RULESET_VERSION,
    occurredAt: '2026-08-23T09:00:00.000Z',
    exerciseId,
    exerciseName: 'Bench',
    prType: 'load',
    evidence: {},
  },
});

const session = (
  id: string,
  finishedAt: string,
  sets: Array<Partial<WorkoutSet> & Pick<WorkoutSet, 'exerciseId'>>,
): WorkoutSession => ({
  id,
  workoutId: 'workout',
  workoutTitle: 'Workout',
  startedAt: finishedAt,
  finishedAt,
  sets: sets.map((set, index) => ({
    id: `${id}-${index}`,
    exerciseId: set.exerciseId,
    exerciseName: set.exerciseName ?? set.exerciseId,
    weight: set.weight ?? 100,
    reps: set.reps ?? 5,
    completed: set.completed ?? true,
    setType: set.setType,
  })),
});

const checkIn = (id: string, recordedAt: string, overrides: Partial<RecoveryCheckIn> = {}): RecoveryCheckIn => ({
  id,
  recordedAt,
  sleepDurationHours: 7.5,
  sleepQuality: 4,
  fatigue: 2,
  soreness: 1,
  stress: 2,
  painInterference: 0,
  readiness: 4,
  createdAt: recordedAt,
  updatedAt: recordedAt,
  ...overrides,
});

describe('buildAdaptiveRecoveryEvidence', () => {
  it('returns raw latest check-in values and a bounded recent check-in count without a score', () => {
    const result = buildAdaptiveRecoveryEvidence({
      endAt: '2026-08-23T12:00:00.000Z',
      exercises: [],
      proposals: [],
      sessions: [],
      recoveryCheckIns: [
        checkIn('older', '2026-08-17T12:00:00.000Z'),
        checkIn('latest', '2026-08-23T09:00:00.000Z', { fatigue: 4, readiness: 2 }),
      ],
    });

    expect(result.recentCheckInCount).toBe(2);
    expect(result.latestCheckIn).toMatchObject({
      checkInId: 'latest',
      ageHours: 3,
      fatigue: 4,
      selfReportedReadiness: 2,
    });
    expect(result.latestCheckIn).not.toHaveProperty('score');
  });

  it('counts only completed non-warmup exact-ID sets in the explicit 72-hour exposure display window', () => {
    const bench = exercise('bench', 'Bench', ['chest']);
    const fly = exercise('fly', 'Fly', ['chest']);
    const row = exercise('row', 'Row', ['lats']);
    const result = buildAdaptiveRecoveryEvidence({
      endAt: '2026-08-23T12:00:00.000Z',
      exercises: [bench, fly, row],
      proposals: [proposal()],
      recoveryCheckIns: [],
      sessions: [
        session('recent', '2026-08-22T12:00:00.000Z', [
          { exerciseId: 'bench' },
          { exerciseId: 'fly' },
          { exerciseId: 'bench', setType: 'warmup' },
          { exerciseId: 'bench', completed: false },
          { exerciseId: 'row' },
          { exerciseId: 'remote-copy', exerciseName: 'Bench' },
        ]),
        session('old', '2026-08-19T12:00:00.000Z', [{ exerciseId: 'bench' }]),
      ],
    });

    expect(result.proposalExposure[0]).toEqual({
      exerciseId: 'bench',
      primaryMuscleIds: ['chest'],
      windowHours: 72,
      workingSetCount: 2,
      exposureSessionCount: 1,
      lastExposureAt: '2026-08-22T12:00:00.000Z',
      contributingExerciseIds: ['bench', 'fly'],
    });
  });

  it('fails closed for proposal exercises without exact exercise metadata', () => {
    const result = buildAdaptiveRecoveryEvidence({
      endAt: '2026-08-23T12:00:00.000Z',
      exercises: [exercise('bench', 'Bench', ['chest'])],
      proposals: [proposal('remote-copy')],
      recoveryCheckIns: [],
      sessions: [session('recent', '2026-08-23T10:00:00.000Z', [{ exerciseId: 'bench' }])],
    });

    expect(result.proposalExposure[0]).toMatchObject({
      exerciseId: 'remote-copy',
      primaryMuscleIds: [],
      workingSetCount: 0,
      exposureSessionCount: 0,
      lastExposureAt: null,
    });
  });
});
