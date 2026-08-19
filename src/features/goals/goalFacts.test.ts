import { describe, expect, it } from 'vitest';

import type { ProfileState, WeightEntry, WorkoutSession } from '@/types';

import { buildGoalFacts } from './goalFacts';

const profile: ProfileState = {
  height: '175',
  weight: '70',
  goal: '',
  activityLevel: 'moderate',
  targetWeight: 75,
  goalType: 'gain_muscle',
  weeklyWeightChangeGoal: 0.25,
  trainingDaysPerWeek: 4,
  dateOfBirth: null,
  calculationSex: null,
  trainingExperience: 'intermediate',
  activeTrainingProgramId: null,
};

const weight = (id: string, date: string, value: number): WeightEntry => ({
  id,
  date,
  weight: value,
  createdAt: date,
});

const session = (id: string, finishedAt: string): WorkoutSession => ({
  id,
  workoutId: `workout-${id}`,
  workoutTitle: `Workout ${id}`,
  startedAt: new Date(Date.parse(finishedAt) - 60 * 60 * 1000).toISOString(),
  finishedAt,
  sets: [],
});

describe('buildGoalFacts', () => {
  it('uses the latest valid weight and exposes a signed target delta', () => {
    const facts = buildGoalFacts({
      endAt: '2026-08-19T12:00:00.000Z',
      profile,
      weightHistory: [
        weight('older', '2026-08-10T08:00:00.000Z', 70),
        weight('latest', '2026-08-18T08:00:00.000Z', 71.5),
      ],
      workoutSessions: [],
    });

    expect(facts.weight.currentWeightKg).toBe(71.5);
    expect(facts.weight.targetWeightKg).toBe(75);
    expect(facts.weight.deltaToTargetKg).toBe(3.5);
    expect(facts.weight.latestWeightAt).toBe('2026-08-18T08:00:00.000Z');
  });

  it('counts unique completed local training days instead of rewarding duplicate same-day sessions', () => {
    const facts = buildGoalFacts({
      endAt: '2026-08-19T12:00:00.000Z',
      profile,
      weightHistory: [],
      workoutSessions: [
        session('a', '2026-08-18T08:00:00.000Z'),
        session('b', '2026-08-18T18:00:00.000Z'),
        session('c', '2026-08-16T08:00:00.000Z'),
        session('d', '2026-08-13T08:00:00.000Z'),
      ],
    });

    expect(facts.training.completedSessionCount).toBe(4);
    expect(facts.training.activeDaysLast7Days).toBe(3);
    expect(facts.training.targetDaysPerWeek).toBe(4);
    expect(facts.training.deltaToTargetDays).toBe(1);
  });

  it('excludes sessions before the bounded seven-local-day window', () => {
    const facts = buildGoalFacts({
      endAt: '2026-08-19T12:00:00.000Z',
      profile,
      weightHistory: [],
      workoutSessions: [
        session('inside', '2026-08-13T08:00:00.000Z'),
        session('outside', '2026-08-12T08:00:00.000Z'),
      ],
    });

    expect(facts.training.completedSessionCount).toBe(1);
    expect(facts.training.activeDaysLast7Days).toBe(1);
  });

  it('keeps missing weight evidence missing', () => {
    const facts = buildGoalFacts({
      endAt: '2026-08-19T12:00:00.000Z',
      profile,
      weightHistory: [],
      workoutSessions: [],
    });

    expect(facts.weight.currentWeightKg).toBeNull();
    expect(facts.weight.deltaToTargetKg).toBeNull();
  });
});
