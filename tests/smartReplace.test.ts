import { describe, expect, it } from 'vitest';

import type { ReviewedExerciseSubstitution } from '@/features/exercises/exerciseIntelligence';
import { buildSmartReplaceCandidates } from '@/features/exercises/smartReplace';
import type { Exercise } from '@/features/exercises/types';

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

const exercise = (id: string, equipment: string[] = []): Exercise => ({
  id,
  source: { provider: 'local-fixture' },
  name: id,
  aliases: [],
  equipment,
  bodyPart: 'test',
  primaryMuscles: [],
  secondaryMuscles: [],
  instructions: [],
  coachingTips: [],
  media: {},
});

const substitution = (exerciseId: string): ReviewedExerciseSubstitution => ({
  exerciseId,
  label: { en: exerciseId, ru: exerciseId },
  rationale: { en: `Why ${exerciseId}`, ru: `Почему ${exerciseId}` },
});

describe('Smart Replace deterministic ranking', () => {
  it('preserves reviewed order when no equipment context is provided', () => {
    const result = buildSmartReplaceCandidates({
      currentExerciseId: 'current',
      reviewedSubstitutions: [substitution('a'), substitution('b')],
      resolvedExercises: [exercise('b'), exercise('a')],
    });

    expect(result.map((candidate) => candidate.exercise.id)).toEqual(['a', 'b']);
    expect(result[0]?.reasonCodes).toEqual(['reviewed-substitution']);
  });

  it('fails closed for unresolved, current, duplicate and avoided candidates', () => {
    const result = buildSmartReplaceCandidates({
      currentExerciseId: 'current',
      reviewedSubstitutions: [
        substitution('missing'),
        substitution('current'),
        substitution('avoid-me'),
        substitution('keep'),
        substitution('keep'),
      ],
      resolvedExercises: [
        exercise('current'),
        exercise('avoid-me'),
        exercise('keep'),
      ],
      preferences: {
        'avoid-me': { avoid: true, note: 'personal preference' },
      },
    });

    expect(result.map((candidate) => candidate.exercise.id)).toEqual(['keep']);
  });

  it('prefers exact canonical equipment matches only when context is explicit', () => {
    const reviewedSubstitutions = [substitution('cable'), substitution('dumbbell')];
    const resolvedExercises = [
      exercise('cable', ['cable']),
      exercise('dumbbell', ['dumbbell']),
    ];

    expect(
      buildSmartReplaceCandidates({
        currentExerciseId: 'current',
        reviewedSubstitutions,
        resolvedExercises,
      }).map((candidate) => candidate.exercise.id),
    ).toEqual(['cable', 'dumbbell']);

    const withEquipment = buildSmartReplaceCandidates({
      currentExerciseId: 'current',
      reviewedSubstitutions,
      resolvedExercises,
      equipmentContext: ['dumbbell'],
    });

    expect(withEquipment.map((candidate) => candidate.exercise.id)).toEqual([
      'dumbbell',
      'cable',
    ]);
    expect(withEquipment[0]?.reasonCodes).toEqual([
      'reviewed-substitution',
      'equipment-match',
    ]);
  });

  it('keeps the candidate list bounded and supports an explicit zero limit', () => {
    const reviewedSubstitutions = ['a', 'b', 'c', 'd'].map(substitution);
    const resolvedExercises = ['a', 'b', 'c', 'd'].map((id) => exercise(id));

    expect(
      buildSmartReplaceCandidates({
        currentExerciseId: 'current',
        reviewedSubstitutions,
        resolvedExercises,
      }),
    ).toHaveLength(3);
    expect(
      buildSmartReplaceCandidates({
        currentExerciseId: 'current',
        reviewedSubstitutions,
        resolvedExercises,
        limit: 0,
      }),
    ).toEqual([]);
  });
});

describe('Smart Replace source boundary', () => {
  it('resolves reviewed IDs through the repository and refreshes saved preferences on focus', () => {
    const section = readSource(
      'src/features/exercises/components/SmartReplaceSection.tsx',
    );

    expect(section).toContain("useFocusEffect } from 'expo-router'");
    expect(section).toContain('exerciseRepository.getExerciseById');
    expect(section).toContain('loadExercisePreference(exercise.id)');
    expect(section).toContain('buildSmartReplaceCandidates({');
    expect(section).toContain('onOpenExercise(candidate.exercise.id)');
  });

  it('does not claim or perform automatic program/workout replacement', () => {
    const section = readSource(
      'src/features/exercises/components/SmartReplaceSection.tsx',
    );
    const copy = readSource('src/localization/smartReplaceCopy.ts');

    expect(section).not.toContain('saveWorkout');
    expect(section).not.toContain('updateWorkout');
    expect(section).not.toContain('replaceExercise');
    expect(copy).toContain('does not change your program or active workout');
    expect(copy).toContain('не меняет программу или активную тренировку');
  });
});
