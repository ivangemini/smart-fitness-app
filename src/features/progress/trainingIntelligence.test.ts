import { describe, expect, it } from 'vitest';

import type { Exercise } from '@/features/exercises/types';
import type { WorkoutSession } from '@/types';

import {
  buildCanonicalTrainingIntelligence,
  TRAINING_INTELLIGENCE_RULESET_VERSION,
} from './trainingIntelligence';

const exercise = (overrides: Partial<Exercise> & Pick<Exercise, 'id' | 'name'>): Exercise => ({
  id: overrides.id,
  name: overrides.name,
  source: { provider: 'local-fixture' },
  aliases: [],
  equipment: ['barbell'],
  bodyPart: 'strength',
  primaryMuscles: [],
  secondaryMuscles: [],
  instructions: [],
  coachingTips: [],
  media: {},
  ...overrides,
});

const session = (
  id: string,
  finishedAt: string,
  sets: Array<{ exerciseId: string; exerciseName: string; weight: number; reps: number }>,
): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: 'Training',
  startedAt: finishedAt,
  finishedAt,
  sets: sets.map((set, index) => ({ id: `${id}-${index}`, completed: true, ...set })),
});

describe('buildCanonicalTrainingIntelligence', () => {
  it('uses exact canonical exercise metadata and keeps unknown mappings out of muscle load', () => {
    const exercises = [
      exercise({ id: 'bench', name: 'Bench press', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'] }),
      exercise({ id: 'mystery', name: 'Push magic', primaryMuscles: ['unknown pec zone'] }),
    ];
    const sessions = [
      session('s1', '2026-08-20T12:00:00.000Z', [
        { exerciseId: 'bench', exerciseName: 'Bench press', weight: 100, reps: 5 },
        { exerciseId: 'mystery', exerciseName: 'Push magic', weight: 50, reps: 10 },
      ]),
    ];

    const result = buildCanonicalTrainingIntelligence({
      exercises,
      sessions,
      endAt: '2026-08-22T12:00:00.000Z',
      windowDays: 7,
    });
    const chest = result.muscleLoad.find((fact) => fact.id === 'chest');
    const triceps = result.muscleLoad.find((fact) => fact.id === 'triceps');

    expect(chest).toMatchObject({ primarySets: 1, primaryVolume: 500, exposureSessions: 1 });
    expect(triceps).toMatchObject({ primarySets: 0, secondarySets: 1, exposureSessions: 1 });
    expect(result.unmappedWorkingSetCount).toBe(1);
  });

  it('compares the selected window with the immediately preceding equal window', () => {
    const exercises = [exercise({ id: 'bench', name: 'Bench press', primaryMuscles: ['chest'] })];
    const sessions = [
      session('previous', '2026-08-10T12:00:00.000Z', [
        { exerciseId: 'bench', exerciseName: 'Bench press', weight: 50, reps: 10 },
      ]),
      session('current', '2026-08-20T12:00:00.000Z', [
        { exerciseId: 'bench', exerciseName: 'Bench press', weight: 100, reps: 10 },
      ]),
    ];

    const result = buildCanonicalTrainingIntelligence({
      exercises,
      sessions,
      endAt: '2026-08-22T12:00:00.000Z',
      windowDays: 7,
    });
    const chest = result.muscleLoad.find((fact) => fact.id === 'chest');

    expect(chest?.primaryVolume).toBe(1000);
    expect(chest?.previousPrimaryVolume).toBe(500);
    expect(chest?.volumeChangePercent).toBe(100);
  });

  it('emits explicit deterministic PR types with versioned evidence', () => {
    const exercises = [exercise({ id: 'bench', name: 'Bench press', primaryMuscles: ['chest'] })];
    const sessions = [
      session('old', '2026-08-01T12:00:00.000Z', [
        { exerciseId: 'bench', exerciseName: 'Bench press', weight: 90, reps: 5 },
      ]),
      session('new', '2026-08-21T12:00:00.000Z', [
        { exerciseId: 'bench', exerciseName: 'Bench press', weight: 100, reps: 6 },
      ]),
    ];

    const result = buildCanonicalTrainingIntelligence({
      exercises,
      sessions,
      endAt: '2026-08-22T12:00:00.000Z',
      windowDays: 30,
    });
    const prs = result.findings.filter((finding) => finding.kind === 'new_pr');

    expect(prs.some((finding) => finding.prType === 'load')).toBe(true);
    expect(prs.some((finding) => finding.prType === 'estimated_1rm')).toBe(true);
    expect(prs.every((finding) => finding.rulesetVersion === TRAINING_INTELLIGENCE_RULESET_VERSION)).toBe(true);
  });

  it('detects rising reps at stable load without treating an estimate as a measured max', () => {
    const exercises = [exercise({ id: 'row', name: 'Row', primaryMuscles: ['lats'] })];
    const sessions = [
      session('a', '2026-08-10T12:00:00.000Z', [{ exerciseId: 'row', exerciseName: 'Row', weight: 80, reps: 6 }]),
      session('b', '2026-08-15T12:00:00.000Z', [{ exerciseId: 'row', exerciseName: 'Row', weight: 80, reps: 7 }]),
      session('c', '2026-08-20T12:00:00.000Z', [{ exerciseId: 'row', exerciseName: 'Row', weight: 80, reps: 8 }]),
    ];

    const result = buildCanonicalTrainingIntelligence({
      exercises,
      sessions,
      endAt: '2026-08-22T12:00:00.000Z',
      windowDays: 30,
    });
    const finding = result.findings.find((candidate) => candidate.kind === 'rep_progression');

    expect(finding?.evidence).toMatchObject({ load: 80, firstReps: 6, latestReps: 8 });
  });

  it('detects a bounded repeated e1RM plateau from three comparable exposures', () => {
    const exercises = [exercise({ id: 'curl', name: 'Curl', primaryMuscles: ['biceps'] })];
    const sessions = [
      session('a', '2026-08-10T12:00:00.000Z', [{ exerciseId: 'curl', exerciseName: 'Curl', weight: 40, reps: 8 }]),
      session('b', '2026-08-15T12:00:00.000Z', [{ exerciseId: 'curl', exerciseName: 'Curl', weight: 40, reps: 8 }]),
      session('c', '2026-08-20T12:00:00.000Z', [{ exerciseId: 'curl', exerciseName: 'Curl', weight: 40, reps: 8 }]),
    ];

    const result = buildCanonicalTrainingIntelligence({
      exercises,
      sessions,
      endAt: '2026-08-22T12:00:00.000Z',
      windowDays: 30,
    });

    expect(result.findings.some((finding) => finding.kind === 'plateau')).toBe(true);
  });
});