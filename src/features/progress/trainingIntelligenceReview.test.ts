import { describe, expect, it } from 'vitest';

import type { TrainingProgram, WorkoutSession } from '@/types';

import type { TrainingCoverage } from './trainingCoverage';
import {
  buildTrainingIntelligenceReview,
  selectTrainingReviewFindings,
} from './trainingIntelligenceReview';
import {
  TRAINING_INTELLIGENCE_RULESET_VERSION,
  type TrainingFinding,
} from './trainingIntelligence';

const coverage = (overrides: Partial<TrainingCoverage> = {}): TrainingCoverage => ({
  endAt: '2026-08-24T12:00:00.000Z',
  windowDays: 7,
  eligibleWorkingSetCount: 4,
  mappedMuscleSetCount: 4,
  unmappedMuscleSetCount: 0,
  reviewedPatternSetCount: 4,
  unmappedPatternSetCount: 0,
  muscleExposure: [],
  movementPatterns: [],
  ...overrides,
});

const program = (days: TrainingProgram['days']): TrainingProgram => ({
  id: 'program-1',
  name: 'Plan',
  goal: 'Strength',
  difficulty: 'intermediate',
  durationWeeks: 8,
  days,
  createdAt: '2026-08-01T00:00:00.000Z',
  isCustom: true,
});

const session = (
  id: string,
  workoutId: string,
  finishedAt: string,
): WorkoutSession => ({
  id,
  workoutId,
  workoutTitle: 'Workout',
  startedAt: finishedAt,
  finishedAt,
  sets: [],
});

const finding = (
  id: string,
  kind: TrainingFinding['kind'],
  overrides: Partial<TrainingFinding> = {},
): TrainingFinding => ({
  id,
  kind,
  rulesetVersion: TRAINING_INTELLIGENCE_RULESET_VERSION,
  occurredAt: '2026-08-24T10:00:00.000Z',
  evidence: {},
  ...overrides,
});

describe('buildTrainingIntelligenceReview', () => {
  it('matches planned completion only by exact workout template id on the planned UTC calendar day', () => {
    const result = buildTrainingIntelligenceReview({
      coverage: coverage(),
      findings: [],
      program: program([
        {
          id: 'monday',
          weekday: 'monday',
          workoutTemplateId: 'template-a',
          workoutTemplateName: 'Push',
        },
      ]),
      sessions: [
        session('done', 'template-a', '2026-08-24T09:00:00.000Z'),
        session('other', 'template-b', '2026-08-24T10:00:00.000Z'),
      ],
    });

    expect(result.plan).toMatchObject({
      status: 'available',
      plannedSessionCount: 1,
      completedPlannedSessionCount: 1,
      unresolvedPlannedSessionCount: 0,
      otherCompletedSessionCount: 1,
    });
    expect(result.plan.slots).toEqual([
      expect.objectContaining({
        date: '2026-08-24',
        weekday: 'monday',
        workoutTemplateId: 'template-a',
        completedSessionId: 'done',
      }),
    ]);
  });

  it('does not use workout names as a fallback for planned completion', () => {
    const result = buildTrainingIntelligenceReview({
      coverage: coverage(),
      findings: [],
      program: program([
        {
          id: 'monday',
          weekday: 'monday',
          workoutTemplateId: 'template-a',
          workoutTemplateName: 'Same visible name',
        },
      ]),
      sessions: [
        {
          ...session('wrong-id', 'remote-copy', '2026-08-24T09:00:00.000Z'),
          workoutTitle: 'Same visible name',
        },
      ],
    });

    expect(result.plan.completedPlannedSessionCount).toBe(0);
    expect(result.plan.otherCompletedSessionCount).toBe(1);
    expect(result.plan.slots[0]?.completedSessionId).toBeNull();
  });

  it('marks plan comparison partial when a scheduled non-rest day has no canonical template id', () => {
    const result = buildTrainingIntelligenceReview({
      coverage: coverage(),
      findings: [],
      program: program([
        { id: 'monday', weekday: 'monday', workoutTemplateName: 'Name only' },
      ]),
      sessions: [],
    });

    expect(result.plan).toMatchObject({
      status: 'partial',
      plannedSessionCount: 0,
      completedPlannedSessionCount: 0,
      unresolvedPlannedSessionCount: 1,
    });
  });

  it('keeps planned comparison unavailable when there is no canonical program', () => {
    const result = buildTrainingIntelligenceReview({
      coverage: coverage(),
      findings: [],
      program: null,
      sessions: [session('done', 'template-a', '2026-08-24T09:00:00.000Z')],
    });

    expect(result.plan.status).toBe('unavailable');
    expect(result.plan.plannedSessionCount).toBe(0);
  });

  it('summarizes coverage and exposes only the top movement-pattern evidence', () => {
    const result = buildTrainingIntelligenceReview({
      coverage: coverage({
        eligibleWorkingSetCount: 9,
        muscleExposure: [
          {
            id: 'chest',
            primarySets: 3,
            primaryVolume: 300,
            secondarySets: 0,
            secondaryVolume: 0,
            exposureSessions: 1,
            lastTrainedAt: '2026-08-24T09:00:00.000Z',
            contributors: [],
          },
        ],
        movementPatterns: [
          {
            pattern: 'horizontal-push',
            workingSetCount: 4,
            volume: 400,
            exposureSessions: 2,
            lastTrainedAt: '2026-08-24T09:00:00.000Z',
            contributors: [],
          },
          {
            pattern: 'horizontal-pull',
            workingSetCount: 3,
            volume: 300,
            exposureSessions: 1,
            lastTrainedAt: '2026-08-23T09:00:00.000Z',
            contributors: [],
          },
          {
            pattern: 'squat',
            workingSetCount: 2,
            volume: 200,
            exposureSessions: 1,
            lastTrainedAt: '2026-08-22T09:00:00.000Z',
            contributors: [],
          },
          {
            pattern: 'hinge',
            workingSetCount: 1,
            volume: 100,
            exposureSessions: 1,
            lastTrainedAt: '2026-08-21T09:00:00.000Z',
            contributors: [],
          },
        ],
      }),
      findings: [],
      program: null,
      sessions: [],
    });

    expect(result.eligibleWorkingSetCount).toBe(9);
    expect(result.activeMuscleCount).toBe(1);
    expect(result.reviewedMovementPatternCount).toBe(4);
    expect(result.topMovementPatterns.map((item) => item.pattern)).toEqual([
      'horizontal-push',
      'horizontal-pull',
      'squat',
    ]);
  });
});

describe('selectTrainingReviewFindings', () => {
  it('suppresses repeated low-value copies of the same finding scope and prioritizes material signals', () => {
    const selected = selectTrainingReviewFindings([
      finding('plateau-new', 'plateau', { exerciseId: 'bench', occurredAt: '2026-08-24T10:00:00.000Z' }),
      finding('plateau-old', 'plateau', { exerciseId: 'bench', occurredAt: '2026-08-20T10:00:00.000Z' }),
      finding('pr', 'new_pr', { exerciseId: 'squat', prType: 'load' }),
      finding('regression', 'regression', { exerciseId: 'row' }),
      finding('progression', 'rep_progression', { exerciseId: 'curl' }),
      finding('volume', 'volume_spike'),
    ], 4);

    expect(selected.map((item) => item.id)).toEqual([
      'pr',
      'regression',
      'volume',
      'progression',
    ]);
    expect(selectTrainingReviewFindings([
      finding('plateau-new', 'plateau', { exerciseId: 'bench', occurredAt: '2026-08-24T10:00:00.000Z' }),
      finding('plateau-old', 'plateau', { exerciseId: 'bench', occurredAt: '2026-08-20T10:00:00.000Z' }),
    ])).toHaveLength(1);
  });
});
