import { describe, expect, it } from 'vitest';

import type { ProgressShareCardViewModel } from './progressShareCardModel';
import { buildProgressShareCardPresentation } from './progressShareCardPresentation';

const privacy = {
  includesNotes: false,
  includesPhoto: false,
  publishesAutomatically: false,
} as const;

const options = (weightUnit: 'kg' | 'lb' = 'kg') => ({
  locale: 'en' as const,
  weightUnit,
  formatDate: () => '23 Aug 2026',
  formatNumber: (value: number, config?: Intl.NumberFormatOptions) => {
    const digits = config?.maximumFractionDigits ?? 1;
    const factor = 10 ** digits;
    return String(Math.round(value * factor) / factor);
  },
});

describe('Progress share-card presentation', () => {
  it('formats workout facts without changing the deterministic counts', () => {
    const card: ProgressShareCardViewModel = {
      schemaVersion: 1,
      kind: 'workout_summary',
      source: {
        entity: 'workout_session',
        id: 'session-1',
        occurredAt: '2026-08-23T10:00:00.000Z',
      },
      subjectLabel: 'Upper body',
      privacy,
      data: {
        durationMinutes: 52,
        exerciseCount: 6,
        workingSetCount: 18,
        workingVolumeKgReps: 4200,
      },
    };

    const result = buildProgressShareCardPresentation(card, options());

    expect(result.title).toBe('Workout complete');
    expect(result.subjectLabel).toBe('Upper body');
    expect(result.heroValue).toBe('52 min');
    expect(result.rows).toEqual([
      { label: 'Exercises', value: '6' },
      { label: 'Working sets', value: '18' },
      { label: 'Volume', value: '4200 kg·reps' },
    ]);
  });

  it('converts canonical workout load/volume presentation to the selected lb unit', () => {
    const card: ProgressShareCardViewModel = {
      schemaVersion: 1,
      kind: 'training_pr',
      source: {
        entity: 'training_finding',
        id: 'finding-1',
        occurredAt: '2026-08-23T10:00:00.000Z',
      },
      subjectLabel: 'Bench press',
      privacy,
      data: {
        metric: 'load',
        previousValue: 100,
        newValue: 105,
        unit: 'kg',
      },
    };

    const result = buildProgressShareCardPresentation(card, options('lb'));

    expect(result.heroLabel).toBe('Load');
    expect(result.heroValue).toBe('231.5 lb');
    expect(result.rows[0]).toEqual({ label: 'Previous', value: '220.5 lb' });
  });

  it('shows reps PR load as context without inventing a delta', () => {
    const card: ProgressShareCardViewModel = {
      schemaVersion: 1,
      kind: 'training_pr',
      source: {
        entity: 'training_finding',
        id: 'finding-2',
        occurredAt: '2026-08-23T10:00:00.000Z',
      },
      subjectLabel: 'Pull-up',
      privacy,
      data: {
        metric: 'reps',
        loadKg: 20,
        previousValue: 7,
        newValue: 9,
        unit: 'reps',
      },
    };

    const result = buildProgressShareCardPresentation(card, options());

    expect(result.heroValue).toBe('9 reps');
    expect(result.rows).toEqual([
      { label: 'Previous', value: '7 reps' },
      { label: 'Load', value: '20 kg' },
    ]);
  });

  it('keeps body-measurement source units even when weight preference differs', () => {
    const card: ProgressShareCardViewModel = {
      schemaVersion: 1,
      kind: 'body_measurement',
      source: {
        entity: 'body_measurement',
        id: 'measurement-1',
        occurredAt: '2026-08-23T10:00:00.000Z',
      },
      subjectLabel: null,
      privacy,
      data: {
        metric: 'waist',
        value: 31.5,
        unit: 'in',
        previousValue: 32,
        delta: -0.5,
      },
    };

    const result = buildProgressShareCardPresentation(card, options('kg'));

    expect(result.subjectLabel).toBe('Waist');
    expect(result.heroValue).toBe('31.5 in');
    expect(result.rows).toEqual([
      { label: 'Previous', value: '32 in' },
      { label: 'Change', value: '-0.5 in' },
    ]);
  });

  it('uses the already-derived weight delta and source date', () => {
    const card: ProgressShareCardViewModel = {
      schemaVersion: 1,
      kind: 'weight_milestone',
      source: {
        entity: 'weight_entry',
        id: 'weight-1',
        occurredAt: '2026-08-23T10:00:00.000Z',
        sourceDate: '2026-08-22',
      },
      subjectLabel: null,
      privacy,
      data: {
        weightKg: 72.5,
        previousWeightKg: 72,
        deltaKg: 0.5,
      },
    };
    let formattedDateInput: Date | string | number | null = null;
    const result = buildProgressShareCardPresentation(card, {
      ...options(),
      formatDate: (value) => {
        formattedDateInput = value;
        return '22 Aug 2026';
      },
    });

    expect(formattedDateInput).toBe('2026-08-22');
    expect(result.heroValue).toBe('72.5 kg');
    expect(result.rows).toEqual([
      { label: 'Previous', value: '72 kg' },
      { label: 'Change', value: '+0.5 kg' },
    ]);
  });

  it('renders weekly review aggregates and preserves unavailable plan/adaptive states', () => {
    const card: ProgressShareCardViewModel = {
      schemaVersion: 1,
      kind: 'weekly_review',
      source: {
        entity: 'weekly_review',
        id: 'weekly-review:2026-08-23T10:00:00.000Z',
        occurredAt: '2026-08-23T10:00:00.000Z',
      },
      subjectLabel: null,
      privacy,
      data: {
        windowDays: 7,
        plan: null,
        coverage: {
          workingSetCount: 41,
          activeMuscleCount: 8,
          movementPatternCount: 5,
        },
        recovery: {
          state: 'unknown',
          signalCodes: [],
        },
        adaptive: {
          available: false,
          plannedExerciseCount: 0,
          unresolvedTemplateCount: 0,
          adjustedByRecoveryCount: 0,
          actionCounts: { progress: 0, maintain: 0, review: 0 },
        },
        keySignals: [],
      },
    };

    const result = buildProgressShareCardPresentation(card, options());

    expect(result.heroValue).toBe('41');
    expect(result.rows).toEqual([
      { label: 'Active muscles', value: '8' },
      { label: 'Movement patterns', value: '5' },
      { label: 'Recovery context', value: 'No fresh data' },
      { label: 'Adaptive actions', value: 'Not available' },
    ]);
  });

  it('localizes presentation copy without changing source values', () => {
    const card: ProgressShareCardViewModel = {
      schemaVersion: 1,
      kind: 'weight_milestone',
      source: {
        entity: 'weight_entry',
        id: 'weight-ru',
        occurredAt: '2026-08-23T10:00:00.000Z',
        sourceDate: '2026-08-23',
      },
      subjectLabel: null,
      privacy,
      data: {
        weightKg: 70,
        previousWeightKg: null,
        deltaKg: null,
      },
    };

    const result = buildProgressShareCardPresentation(card, {
      ...options(),
      locale: 'ru',
      formatDate: () => '23 авг. 2026 г.',
    });

    expect(result.title).toBe('Прогресс веса');
    expect(result.heroLabel).toBe('Сейчас');
    expect(result.heroValue).toBe('70 kg');
    expect(result.dateLabel).toBe('23 авг. 2026 г.');
  });
});
