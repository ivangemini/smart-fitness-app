import { describe, expect, it } from 'vitest';

import type {
  BodyMeasurement,
  FoodEntry,
  ProfileState,
  TrainingProgram,
  UserLimitation,
  WeightEntry,
  Workout,
} from '@/types';

import {
  readBodyMetrics,
  readCoachProfileFacts,
  readConfirmedLabs,
  readCurrentProgram,
  readNutritionSummary,
} from './coachCanonicalCapabilities';

const profile: ProfileState = {
  height: '175',
  weight: '72.5',
  goal: 'Build muscle',
  activityLevel: 'moderate',
  targetWeight: 78,
  goalType: 'gain_muscle',
  weeklyWeightChangeGoal: 0.25,
  trainingDaysPerWeek: 4,
  dateOfBirth: '2007-05-01',
  calculationSex: 'male',
  trainingExperience: 'intermediate',
  activeTrainingProgramId: 'program-1',
};

const trainingProgram: TrainingProgram = {
  id: 'program-1',
  name: 'Upper Lower',
  description: 'Four-day split',
  goal: 'Hypertrophy',
  difficulty: 'intermediate',
  durationWeeks: 8,
  days: [
    {
      id: 'day-private-id',
      weekday: 'monday',
      workoutTemplateId: 'workout-1',
      workoutTemplateName: 'Upper A',
      notes: 'private program note',
    },
    { id: 'rest-id', weekday: 'tuesday', restDay: true },
  ],
  progression: {
    targetReps: 10,
    targetWeight: 80,
    rir: 2,
    strategy: 'double progression',
  },
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-02T00:00:00.000Z',
  isCustom: true,
  metadata: { secret: 'internal-metadata' },
};

const workout: Workout = {
  id: 'workout-1',
  title: 'Upper A',
  description: 'private workout description',
  duration: '60 min',
  exercises: [
    {
      id: 'exercise-private-id',
      name: 'Bench Press',
      muscleGroup: 'Chest',
      notes: 'private exercise note',
      metadata: { hidden: true },
      createdAt: '2026-08-01T00:00:00.000Z',
    },
  ],
  coachMetadata: {
    schemaVersion: 1,
    runId: 'private-run-id',
    sourceSessionId: 'private-session-id',
    strategy: 'progress',
    confirmedAt: '2026-08-01T00:00:00.000Z',
  },
};

const limitation: UserLimitation = {
  id: 'private-limitation-id',
  kind: 'pain',
  bodyRegion: 'shoulder',
  side: 'left',
  severity: 'moderate',
  status: 'active',
  trainingImpact: 'reduce_load',
  movementPatterns: ['horizontal_push', 'overhead'],
  onsetDate: '2026-08-01',
  resolvedDate: null,
  notes: 'private limitation note',
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-02T00:00:00.000Z',
};

describe('coachCanonicalCapabilities', () => {
  it('resolves the selected current program and exposes only bounded routine facts', () => {
    const result = readCurrentProgram({
      profile,
      trainingPrograms: [trainingProgram],
      workouts: [workout],
    });

    expect(result).toMatchObject({
      available: true,
      program: {
        name: 'Upper Lower',
        goal: 'Hypertrophy',
        difficulty: 'intermediate',
        durationWeeks: 8,
        days: [
          {
            weekday: 'monday',
            restDay: false,
            workout: {
              title: 'Upper A',
              duration: '60 min',
              exercises: [{ name: 'Bench Press', muscleGroup: 'Chest' }],
            },
          },
          { weekday: 'tuesday', restDay: true, workout: null },
        ],
      },
    });

    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('day-private-id');
    expect(serialized).not.toContain('exercise-private-id');
    expect(serialized).not.toContain('private program note');
    expect(serialized).not.toContain('private-run-id');
    expect(serialized).not.toContain('internal-metadata');
  });

  it('returns unavailable instead of guessing when no selected program resolves', () => {
    expect(
      readCurrentProgram({
        profile: { ...profile, activeTrainingProgramId: 'missing' },
        trainingPrograms: [trainingProgram],
        workouts: [workout],
      }),
    ).toEqual({ available: false, program: null });
  });

  it('returns structured profile and active limitation facts without notes or identifiers', () => {
    const result = readCoachProfileFacts({
      profile,
      userLimitations: [
        limitation,
        { ...limitation, id: 'resolved-private-id', status: 'resolved', resolvedDate: '2026-08-10' },
      ],
    });

    expect(result).toMatchObject({
      heightCm: 175,
      currentWeightKg: 72.5,
      goalType: 'gain_muscle',
      trainingDaysPerWeek: 4,
      activeLimitations: [
        {
          kind: 'pain',
          bodyRegion: 'shoulder',
          severity: 'moderate',
          trainingImpact: 'reduce_load',
          movementPatterns: ['horizontal_push', 'overhead'],
        },
      ],
    });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('private-limitation-id');
    expect(serialized).not.toContain('private limitation note');
    expect(serialized).not.toContain('resolved-private-id');
    expect(serialized).not.toContain('program-1');
  });

  it('bounds and sorts body metrics while omitting storage identifiers', () => {
    const weights: WeightEntry[] = [
      { id: 'weight-old-id', date: '2026-07-01', weight: 70, createdAt: '2026-07-01T10:00:00.000Z' },
      { id: 'weight-new-id', date: '2026-08-17', weight: 72, createdAt: '2026-08-17T10:00:00.000Z' },
      { id: 'weight-mid-id', date: '2026-08-10', weight: 71.5, createdAt: '2026-08-10T10:00:00.000Z' },
    ];
    const measurements: BodyMeasurement[] = [
      {
        id: 'measurement-id',
        label: 'Waist',
        value: '74',
        metric: 'waist',
        numericValue: 74,
        unit: 'cm',
        createdAt: '2026-08-16T10:00:00.000Z',
      },
    ];
    const result = readBodyMetrics({
      weightHistory: weights,
      bodyMeasurements: measurements,
      endAt: '2026-08-18T12:00:00.000Z',
      days: 28,
      limit: 1,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.weights).toEqual([{ date: '2026-08-17', weightKg: 72 }]);
    expect(result.data.weightsTruncated).toBe(true);
    expect(result.data.measurements[0]).toMatchObject({ label: 'Waist', numericValue: 74, unit: 'cm' });
    expect(JSON.stringify(result.data)).not.toContain('weight-new-id');
    expect(JSON.stringify(result.data)).not.toContain('measurement-id');
  });

  it('returns typed invalid-time errors instead of using wall-clock time', () => {
    expect(
      readBodyMetrics({ weightHistory: [], bodyMeasurements: [], endAt: 'invalid' }),
    ).toEqual({
      ok: false,
      error: { code: 'invalid_end_at', message: 'A valid endAt timestamp is required.' },
    });
  });

  it('aggregates nutrition by day without exposing food names, brands, providers, or entry ids', () => {
    const foodEntries: FoodEntry[] = [
      {
        id: 'private-food-id',
        name: 'Private food name',
        brandName: 'Private brand',
        date: '2026-08-17',
        mealType: 'breakfast',
        calories: 500,
        protein: 40,
        carbs: 50,
        fats: 15,
        source: 'fatsecret',
        externalId: 'private-provider-id',
        createdAt: '2026-08-17T08:00:00.000Z',
      },
      {
        id: 'private-food-id-2',
        name: 'Second private food',
        date: '2026-08-17',
        mealType: 'dinner',
        calories: 700,
        protein: 50,
        carbs: 80,
        fats: 20,
        source: 'manual',
        createdAt: '2026-08-17T18:00:00.000Z',
      },
    ];
    const result = readNutritionSummary({
      foodEntries,
      nutritionTargets: { calories: 2400, protein: 180, carbs: 260, fats: 70 },
      endAt: '2026-08-18T12:00:00.000Z',
      days: 7,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.days).toEqual([
      { date: '2026-08-17', calories: 1200, protein: 90, carbs: 130, fats: 35, entryCount: 2 },
    ]);
    const serialized = JSON.stringify(result.data);
    expect(serialized).not.toContain('Private food name');
    expect(serialized).not.toContain('Private brand');
    expect(serialized).not.toContain('private-provider-id');
    expect(serialized).not.toContain('private-food-id');
    expect(serialized).not.toContain('fatsecret');
  });

  it('exposes confirmed Labs only and strips result, user, asset, and marker identifiers structurally', () => {
    const result = readConfirmedLabs({
      results: [
        {
          status: 'draft',
          lab_name: 'Draft Lab',
          created_at: '2026-08-18T10:00:00.000Z',
          markers: [],
        },
        {
          status: 'confirmed',
          lab_name: 'Confirmed Lab',
          collected_at: '2026-08-17T09:00:00.000Z',
          created_at: '2026-08-17T10:00:00.000Z',
          confirmed_at: '2026-08-17T11:00:00.000Z',
          markers: [
            {
              canonical_name: 'alt',
              display_name: 'ALT',
              category: 'liver',
              canonical_unit: 'U/L',
              numeric_value: 42,
              value_text: null,
              status: 'high',
              reference_high: 40,
              previous_value: 35,
            },
          ],
        },
      ],
    });

    expect(result.totalConfirmedResults).toBe(1);
    expect(result.results).toEqual([
      {
        labName: 'Confirmed Lab',
        collectedAt: '2026-08-17T09:00:00.000Z',
        confirmedAt: '2026-08-17T11:00:00.000Z',
        markers: [
          {
            canonicalName: 'alt',
            displayName: 'ALT',
            category: 'liver',
            unit: 'U/L',
            numericValue: 42,
            valueText: null,
            status: 'high',
            referenceRangeText: null,
            referenceLow: null,
            referenceHigh: 40,
            deltaAbsolute: null,
            deltaPercent: null,
            previousValue: 35,
          },
        ],
        markersTruncated: false,
      },
    ]);
    expect(JSON.stringify(result)).not.toContain('Draft Lab');
  });
});
