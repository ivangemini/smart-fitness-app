import { describe, expect, it } from 'vitest';

import fixtureRows from '@/data/exercises/exercises.json';

import {
  getReviewedExerciseIntelligence,
  getReviewedExerciseIntelligenceIds,
  selectExerciseIntelligenceText,
} from './exerciseIntelligence';
import { localExerciseProvider } from './localProvider';
import { normalizeOssExerciseWithLocalRows } from './ossExerciseDbProvider';
import type { Exercise } from './types';

describe('reviewed exercise intelligence', () => {
  it('covers every canonical local exercise and no runtime-only guessed ids', async () => {
    const expectedIds = fixtureRows.map((row) => row.internalId).sort();
    expect(getReviewedExerciseIntelligenceIds().sort()).toEqual(expectedIds);

    const localExercises = (await localExerciseProvider.listExercises()).exercises;
    expect(localExercises.map((exercise) => exercise.id).sort()).toEqual(expectedIds);

    for (const exercise of localExercises) {
      expect(getReviewedExerciseIntelligence(exercise.id)).not.toBeNull();
    }
    expect(getReviewedExerciseIntelligence('exdb-unknown')).toBeNull();
  });

  it('keeps substitutions inside the reviewed canonical catalog', () => {
    const knownIds = new Set(getReviewedExerciseIntelligenceIds());

    for (const exerciseId of knownIds) {
      const intelligence = getReviewedExerciseIntelligence(exerciseId);
      expect(intelligence).not.toBeNull();
      for (const substitution of intelligence?.substitutions ?? []) {
        expect(substitution.exerciseId).not.toBe(exerciseId);
        expect(knownIds.has(substitution.exerciseId)).toBe(true);
      }
    }
  });

  it('stores complete English and Russian reviewed guidance', () => {
    for (const exerciseId of getReviewedExerciseIntelligenceIds()) {
      const intelligence = getReviewedExerciseIntelligence(exerciseId);
      expect(intelligence?.version).toBe('exercise-intelligence-v1');
      expect(intelligence?.techniqueCues.length).toBeGreaterThan(0);
      expect(intelligence?.commonErrors.length).toBeGreaterThan(0);
      expect(intelligence?.rangeOfMotion.length).toBeGreaterThan(0);

      const localizedValues = [
        ...(intelligence?.techniqueCues ?? []),
        ...(intelligence?.commonErrors ?? []),
        ...(intelligence?.rangeOfMotion ?? []),
        ...(intelligence?.substitutions.flatMap((entry) => [entry.label, entry.rationale]) ?? []),
      ];
      for (const value of localizedValues) {
        expect(selectExerciseIntelligenceText(value, 'en-US').trim()).not.toBe('');
        expect(selectExerciseIntelligenceText(value, 'ru-RU').trim()).not.toBe('');
      }
    }
  });

  it('inherits reviewed intelligence only when OSS normalization reuses a reviewed local id', async () => {
    const localExercises = (await localExerciseProvider.listExercises()).exercises;
    const emptySignatureMap = new Map<string, Exercise>();

    const matched = normalizeOssExerciseWithLocalRows(
      {
        exerciseId: 'remote-bench',
        name: 'Bench Press',
        equipments: ['barbell'],
        targetMuscles: ['pectorals'],
      },
      emptySignatureMap,
      localExercises,
    );
    expect(matched.id).toBe('bench-press');
    expect(getReviewedExerciseIntelligence(matched.id)).not.toBeNull();

    const unmatched = normalizeOssExerciseWithLocalRows(
      {
        exerciseId: 'remote-unknown',
        name: 'Mystery Press',
        equipments: ['machine'],
        targetMuscles: ['chest'],
      },
      emptySignatureMap,
      localExercises,
    );
    expect(unmatched.id).toBe('exdb-remote-unknown');
    expect(getReviewedExerciseIntelligence(unmatched.id)).toBeNull();
  });

  it('returns defensive copies so UI callers cannot mutate reviewed authority', () => {
    const first = getReviewedExerciseIntelligence('bench-press');
    const second = getReviewedExerciseIntelligence('bench-press');
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();

    if (!first || !second) return;
    first.techniqueCues[0].en = 'mutated';
    first.substitutions[0].label.en = 'mutated';

    expect(second.techniqueCues[0].en).not.toBe('mutated');
    expect(second.substitutions[0].label.en).not.toBe('mutated');
  });
});
