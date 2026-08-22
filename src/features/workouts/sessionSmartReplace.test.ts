import { describe, expect, it } from 'vitest';

import type { SmartReplaceCandidate } from '@/features/exercises/smartReplace';
import type { Exercise as LibraryExercise } from '@/features/exercises/types';
import type { Exercise } from '@/types';

import {
  mapSmartReplaceCandidatesToWorkoutCatalog,
  selectWorkoutSessionSmartReplaceText,
} from './sessionSmartReplaceModel';

const libraryExercise = (id: string, name: string): LibraryExercise => ({
  id,
  source: { provider: 'local-fixture' },
  name,
  aliases: [name],
  equipment: [],
  bodyPart: 'test',
  primaryMuscles: [],
  secondaryMuscles: [],
  instructions: [],
  coachingTips: [],
  media: {},
});

const workoutExercise = (id: string, name: string): Exercise => ({
  id,
  name,
  createdAt: '2026-08-22T00:00:00.000Z',
  isCustom: false,
});

const candidate = (id: string, name: string): SmartReplaceCandidate => ({
  exercise: libraryExercise(id, name),
  reviewedSubstitution: {
    exerciseId: id,
    label: { en: name, ru: `RU ${name}` },
    rationale: { en: `Why ${name}`, ru: `Почему ${name}` },
  },
  reasonCodes: ['reviewed-substitution'],
});

describe('active-session Smart Replace adapter', () => {
  it('maps candidates into the workout catalog by exact canonical ID', () => {
    const canonical = workoutExercise('push-up', 'Push-Up');
    const result = mapSmartReplaceCandidatesToWorkoutCatalog(
      [candidate('push-up', 'Push-Up')],
      [canonical],
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.exercise).toBe(canonical);
    expect(result[0]?.exercise.id).toBe('push-up');
  });

  it('fails closed instead of falling back to a name match', () => {
    const result = mapSmartReplaceCandidatesToWorkoutCatalog(
      [candidate('push-up', 'Push-Up')],
      [workoutExercise('different-id', 'Push-Up')],
    );

    expect(result).toEqual([]);
  });

  it('preserves reviewed order while dropping unavailable workout identities', () => {
    const result = mapSmartReplaceCandidatesToWorkoutCatalog(
      [
        candidate('missing', 'Missing'),
        candidate('push-up', 'Push-Up'),
        candidate('cable-fly', 'Cable Fly'),
      ],
      [
        workoutExercise('cable-fly', 'Cable Fly'),
        workoutExercise('push-up', 'Push-Up'),
      ],
    );

    expect(result.map((item) => item.exercise.id)).toEqual([
      'push-up',
      'cable-fly',
    ]);
  });

  it('uses RU text only for RU locales', () => {
    const text = { en: 'Reviewed', ru: 'Проверенная' };

    expect(selectWorkoutSessionSmartReplaceText(text, 'ru')).toBe('Проверенная');
    expect(selectWorkoutSessionSmartReplaceText(text, 'ru-RU')).toBe('Проверенная');
    expect(selectWorkoutSessionSmartReplaceText(text, 'en-US')).toBe('Reviewed');
  });
});
