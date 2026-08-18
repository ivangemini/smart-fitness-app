import { describe, expect, it } from 'vitest';

import type { CoachRetrievalSources } from './coachRetrieval';
import { buildCoachFactPacket, buildCoachRetrievalPlan } from './coachRetrieval';

const sources: CoachRetrievalSources = {
  workoutSessions: [
    {
      id: 'session-private-id',
      workoutId: 'workout-1',
      workoutTitle: 'Upper A',
      startedAt: '2026-08-17T09:00:00.000Z',
      finishedAt: '2026-08-17T10:00:00.000Z',
      sets: [
        {
          id: 'set-private-id',
          exerciseId: 'bench',
          exerciseName: 'Bench Press',
          weight: 100,
          reps: 5,
          completed: true,
          actualRpe: 8,
        },
      ],
      notes: 'private session note',
    },
  ],
  trainingPrograms: [
    {
      id: 'program-1',
      name: 'Upper Lower',
      goal: 'Hypertrophy',
      difficulty: 'intermediate',
      durationWeeks: 8,
      days: [{ id: 'day-id', weekday: 'monday', workoutTemplateId: 'workout-1' }],
      createdAt: '2026-08-01T00:00:00.000Z',
    },
  ],
  workouts: [
    {
      id: 'workout-1',
      title: 'Upper A',
      duration: '60 min',
      exercises: [
        {
          id: 'bench',
          name: 'Bench Press',
          muscleGroup: 'Chest',
          createdAt: '2026-08-01T00:00:00.000Z',
        },
      ],
    },
  ],
  profile: {
    height: '175',
    weight: '72',
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
  },
  userLimitations: [],
  weightHistory: [
    { id: 'weight-id', date: '2026-08-17', weight: 72, createdAt: '2026-08-17T08:00:00.000Z' },
  ],
  bodyMeasurements: [],
  foodEntries: [
    {
      id: 'food-id',
      name: 'Private food',
      date: '2026-08-17',
      mealType: 'dinner',
      calories: 800,
      protein: 60,
      carbs: 90,
      fats: 22,
      source: 'manual',
      createdAt: '2026-08-17T18:00:00.000Z',
    },
  ],
  nutritionTargets: { calories: 2400, protein: 180, carbs: 260, fats: 70 },
  labResults: [
    {
      status: 'draft',
      lab_name: 'Draft lab',
      created_at: '2026-08-18T08:00:00.000Z',
      markers: [
        {
          canonical_name: 'ferritin',
          display_name: 'Ferritin',
          category: 'iron',
          canonical_unit: 'ng/mL',
          numeric_value: 99,
          value_text: null,
          status: 'normal',
        },
      ],
    },
    {
      status: 'confirmed',
      lab_name: 'Confirmed lab',
      collected_at: '2026-08-17T08:00:00.000Z',
      confirmed_at: '2026-08-17T10:00:00.000Z',
      created_at: '2026-08-17T09:00:00.000Z',
      markers: [
        {
          canonical_name: 'ferritin',
          display_name: 'Ferritin',
          category: 'iron',
          canonical_unit: 'ng/mL',
          numeric_value: 61,
          value_text: null,
          status: 'normal',
        },
        {
          canonical_name: 'alt',
          display_name: 'ALT',
          category: 'liver',
          canonical_unit: 'U/L',
          numeric_value: 35,
          value_text: null,
          status: 'normal',
        },
      ],
    },
  ],
};

const endAt = '2026-08-18T12:00:00.000Z';

describe('coachRetrieval', () => {
  it('plans only the capability required for a training overview', () => {
    expect(buildCoachRetrievalPlan({ intent: 'training_overview', endAt })).toEqual({
      intent: 'training_overview',
      capabilities: ['training_summary'],
    });
  });

  it('adds body-weight context to exercise progress only when explicitly requested', () => {
    expect(
      buildCoachRetrievalPlan({ intent: 'exercise_progress', endAt, exerciseName: 'Bench Press' }).capabilities,
    ).toEqual(['exercise_history']);
    expect(
      buildCoachRetrievalPlan({
        intent: 'exercise_progress',
        endAt,
        exerciseName: 'Bench Press',
        includeBodyWeightContext: true,
      }).capabilities,
    ).toEqual(['exercise_history', 'body_metrics']);
  });

  it('builds a training packet without unrelated profile, nutrition, Labs, or raw state', () => {
    const result = buildCoachFactPacket({
      request: { intent: 'training_overview', endAt, days: 28 },
      sources,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Object.keys(result.data.facts)).toEqual(['trainingSummary']);
    expect(result.data.facts.trainingSummary?.frequency.sessionCount).toBe(1);
    const serialized = JSON.stringify(result.data);
    expect(serialized).not.toContain('Private food');
    expect(serialized).not.toContain('Confirmed lab');
    expect(serialized).not.toContain('private session note');
    expect(serialized).not.toContain('2007-05-01');
  });

  it('returns the existing typed exercise-query error instead of broadening retrieval', () => {
    expect(buildCoachFactPacket({ request: { intent: 'exercise_progress', endAt }, sources })).toEqual({
      ok: false,
      error: {
        code: 'missing_exercise_query',
        message: 'exerciseId or exerciseName is required.',
      },
    });
  });

  it('returns confirmed exact-marker Labs history and excludes other markers and drafts', () => {
    const result = buildCoachFactPacket({
      request: { intent: 'labs_marker_history', endAt, labMarkerName: 'Ferritin' },
      sources,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Object.keys(result.data.facts)).toEqual(['labsMarkerHistory']);
    expect(result.data.facts.labsMarkerHistory).toMatchObject({
      markerQuery: 'Ferritin',
      totalMatchingResults: 1,
      results: [
        {
          labName: 'Confirmed lab',
          markers: [{ canonicalName: 'ferritin', numericValue: 61 }],
        },
      ],
    });
    const markerFacts = result.data.facts.labsMarkerHistory?.results.flatMap((entry) => entry.markers) ?? [];
    expect(markerFacts.every((marker) => marker.canonicalName === 'ferritin')).toBe(true);
    expect(JSON.stringify(result.data)).not.toContain('Draft lab');
  });

  it('requires an explicit marker query for Labs retrieval', () => {
    expect(buildCoachFactPacket({ request: { intent: 'labs_marker_history', endAt }, sources })).toEqual({
      ok: false,
      error: {
        code: 'missing_lab_marker_query',
        message: 'labMarkerName is required for Labs marker history retrieval.',
      },
    });
  });

  it('builds a current-program review packet from only the reviewed program context', () => {
    const result = buildCoachFactPacket({
      request: { intent: 'current_program_review', endAt, days: 28 },
      sources,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Object.keys(result.data.facts)).toEqual([
      'currentProgram',
      'trainingSummary',
      'profileFacts',
    ]);
    expect(result.data.facts.currentProgram?.program?.name).toBe('Upper Lower');
    expect(JSON.stringify(result.data)).not.toContain('program-1');
    expect(JSON.stringify(result.data)).not.toContain('2007-05-01');
  });

  it('propagates invalid time anchors before producing model-visible facts', () => {
    expect(
      buildCoachFactPacket({ request: { intent: 'nutrition_overview', endAt: 'invalid' }, sources }),
    ).toEqual({
      ok: false,
      error: { code: 'invalid_end_at', message: 'A valid endAt timestamp is required.' },
    });
  });
});
