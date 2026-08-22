import { describe, expect, it } from 'vitest';

import {
  EMPTY_EXERCISE_PREFERENCE,
  EXERCISE_PREFERENCE_NOTE_MAX_LENGTH,
  exercisePreferencesEqual,
  normalizeExercisePreference,
} from '@/features/exercises/preferences';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};
const projectRoot = resolve(__dirname, '..');
const readSource = (file: string) =>
  readFileSync(resolve(projectRoot, file), 'utf8');

describe('exercise preference model', () => {
  it('fails closed to a neutral preference for invalid data', () => {
    expect(normalizeExercisePreference(null)).toEqual(EMPTY_EXERCISE_PREFERENCE);
    expect(normalizeExercisePreference([])).toEqual(EMPTY_EXERCISE_PREFERENCE);
    expect(normalizeExercisePreference('avoid')).toEqual(EMPTY_EXERCISE_PREFERENCE);
    expect(normalizeExercisePreference({ avoid: 'true', note: 123 })).toEqual(
      EMPTY_EXERCISE_PREFERENCE,
    );
  });

  it('accepts only an explicit avoid flag and trims/caps notes', () => {
    const note = `  ${'x'.repeat(EXERCISE_PREFERENCE_NOTE_MAX_LENGTH + 20)}  `;
    const normalized = normalizeExercisePreference({ avoid: true, note });

    expect(normalized.avoid).toBe(true);
    expect(normalized.note).toHaveLength(EXERCISE_PREFERENCE_NOTE_MAX_LENGTH);
    expect(normalized.note).toBe('x'.repeat(EXERCISE_PREFERENCE_NOTE_MAX_LENGTH));
  });

  it('compares the persisted fields only', () => {
    expect(
      exercisePreferencesEqual(
        { avoid: true, note: 'machine' },
        { avoid: true, note: 'machine' },
      ),
    ).toBe(true);
    expect(
      exercisePreferencesEqual(
        { avoid: true, note: 'machine' },
        { avoid: false, note: 'machine' },
      ),
    ).toBe(false);
  });
});

describe('exercise preference persistence and UI contract', () => {
  it('keeps preferences separate from favorites and stores per exercise', () => {
    const repository = readSource(
      'src/features/exercises/preferencesRepository.ts',
    );
    const favorites = readSource('src/features/exercises/favoritesRepository.ts');

    expect(repository).toContain("'exercise-preference-v1:'");
    expect(repository).toContain('encodeURIComponent(exerciseId)');
    expect(repository).toContain('AsyncStorage.removeItem(key)');
    expect(repository).toContain('normalizeExercisePreference(JSON.parse(raw)');
    expect(favorites).not.toContain('ExercisePreference');
    expect(favorites).not.toContain('avoid');
  });

  it('surfaces an explicit-save card without claiming automatic replacement', () => {
    const screen = readSource(
      'src/features/exercises/screens/ExerciseDetailScreen.tsx',
    );
    const card = readSource(
      'src/features/exercises/components/ExercisePreferencesCard.tsx',
    );
    const copy = readSource('src/localization/exercisePreferencesCopy.ts');

    expect(screen).toContain(
      '<ExercisePreferencesCard exerciseId={exercise.id} locale={locale} />',
    );
    expect(card).toContain('loadExercisePreference(exerciseId)');
    expect(card).toContain('saveExercisePreference(exerciseId, preference)');
    expect(card).toContain('disabled={!canSave}');
    expect(card).toContain('maxLength={EXERCISE_PREFERENCE_NOTE_MAX_LENGTH}');
    expect(copy).toContain('do not change your program automatically yet');
    expect(copy).toContain('пока не меняют программу автоматически');
  });
});
