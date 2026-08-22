import { describe, expect, it } from 'vitest';

import type { Workout } from '@/types';

import {
  buildProgramWorkoutEditorSavePayload,
  createWorkoutDraftFromWorkout,
} from './programEditorModel';
import { parseWorkoutPlanDescription } from './historyModel';

const workout: Workout = {
  id: 'workout-1',
  title: 'Upper',
  duration: '45 min',
  createdAt: '2026-08-22T00:00:00.000Z',
  isCustom: true,
  description: [
    'Keep the session controlled.',
    '',
    'Workout plan:',
    '1. Bench Press — 4 sets x 6 reps · 150 sec rest',
    '   Notes: Pause on the chest.',
    '2. Barbell Row — 3 sets x 8 reps · 120 sec rest',
  ].join('\n'),
  exercises: [
    {
      id: 'bench-id',
      name: 'Bench Press',
      isCustom: false,
      createdAt: '2026-08-20T00:00:00.000Z',
    },
    {
      id: 'row-id',
      name: 'Barbell Row',
      isCustom: false,
      createdAt: '2026-08-20T00:00:00.000Z',
    },
  ],
};

describe('program workout editor model', () => {
  it('hydrates base notes, plan fields, and persisted source IDs', () => {
    const draft = createWorkoutDraftFromWorkout(workout);

    expect(draft.description).toBe('Keep the session controlled.');
    expect(draft.exercises).toEqual([
      {
        id: 'bench-id',
        sourceExerciseId: 'bench-id',
        name: 'Bench Press',
        notes: 'Pause on the chest.',
        restSeconds: '150',
        targetReps: '6',
        targetSets: '4',
      },
      {
        id: 'row-id',
        sourceExerciseId: 'row-id',
        name: 'Barbell Row',
        notes: '',
        restSeconds: '120',
        targetReps: '8',
        targetSets: '3',
      },
    ]);
  });

  it('serializes the edited plan once and keeps explicit source identity', () => {
    const draft = createWorkoutDraftFromWorkout(workout);
    const payload = buildProgramWorkoutEditorSavePayload(
      ' Updated Upper ',
      draft.description,
      [
        { ...draft.exercises[1], targetSets: '5' },
        { ...draft.exercises[0], name: 'Paused Bench Press' },
      ],
    );
    const parsed = parseWorkoutPlanDescription(payload.description);

    expect(payload.title).toBe('Updated Upper');
    expect(payload.exercises).toEqual([
      { name: 'Barbell Row', sourceExerciseId: 'row-id' },
      { name: 'Paused Bench Press', sourceExerciseId: 'bench-id' },
    ]);
    expect(parsed.baseDescription).toBe('Keep the session controlled.');
    expect(parsed.exercises).toEqual([
      {
        name: 'Barbell Row',
        targetSets: 5,
        targetReps: 8,
        restSeconds: 120,
      },
      {
        name: 'Paused Bench Press',
        targetSets: 4,
        targetReps: 6,
        restSeconds: 150,
        notes: 'Pause on the chest.',
      },
    ]);
    expect(payload.description?.match(/Workout plan:/g)).toHaveLength(1);
  });

  it('marks duplicated/new draft rows as new identities when source ID is absent', () => {
    const payload = buildProgramWorkoutEditorSavePayload(
      'Upper',
      '',
      [
        {
          id: 'draft-new',
          name: 'Cable Fly',
          notes: '',
          restSeconds: '90',
          targetReps: '12',
          targetSets: '3',
        },
      ],
    );

    expect(payload.exercises).toEqual([
      { name: 'Cable Fly', sourceExerciseId: undefined },
    ]);
  });
});
