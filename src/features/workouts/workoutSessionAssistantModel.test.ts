import { describe, expect, it } from 'vitest';

import type { WorkoutSessionDraft } from './types';
import {
  addWorkoutWarmupSets,
  applyWorkoutAdjustmentToRemainingSets,
  findWorkoutSupersetPartnerSet,
  getNextWorkoutSetType,
  toggleWorkoutSessionSuperset,
  updateWorkoutSessionSetType,
} from './workoutSessionAssistantModel';

const draft = (): WorkoutSessionDraft => ({
  id: 'draft',
  workoutId: 'push',
  workoutTitle: 'Push',
  startedAt: '2026-08-22T08:00:00.000Z',
  sets: [
    {
      id: 'bench-1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 8,
      completed: true,
    },
    {
      id: 'bench-2',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 8,
      completed: false,
    },
    {
      id: 'row-1',
      exerciseId: 'row',
      exerciseName: 'Row',
      weight: 80,
      reps: 10,
      completed: false,
    },
  ],
});

describe('workout session assistant model', () => {
  it('adds warm-ups before working sets and marks their semantics explicitly', () => {
    const next = addWorkoutWarmupSets(
      draft(),
      { id: 'bench', name: 'Bench Press' },
      [{ weight: 50, reps: 8 }, { weight: 70, reps: 5 }],
    );

    expect(next.sets.slice(0, 2)).toEqual([
      expect.objectContaining({ exerciseId: 'bench', setType: 'warmup', weight: 50, reps: 8 }),
      expect.objectContaining({ exerciseId: 'bench', setType: 'warmup', weight: 70, reps: 5 }),
    ]);
  });

  it('cycles through explicit set semantics while keeping working backward-compatible', () => {
    expect(getNextWorkoutSetType()).toBe('warmup');
    expect(getNextWorkoutSetType('warmup')).toBe('backoff');
    const next = updateWorkoutSessionSetType(draft(), 'bench-1', 'amrap');
    expect(next.sets[0]?.setType).toBe('amrap');
    expect(updateWorkoutSessionSetType(next, 'bench-1', 'working').sets[0]?.setType).toBeUndefined();
  });

  it('finds, links, and explicitly unlinks the matching superset pair', () => {
    const initial = draft();
    const partner = findWorkoutSupersetPartnerSet(initial, 'bench-1', ['bench', 'row']);
    expect(partner?.id).toBe('row-1');

    const linked = toggleWorkoutSessionSuperset(initial, 'bench-1', 'row-1');
    expect(linked.sets[0]?.supersetId).toBeTruthy();
    expect(linked.sets[0]?.supersetId).toBe(linked.sets[2]?.supersetId);
    expect(findWorkoutSupersetPartnerSet(linked, 'bench-1', ['bench', 'row'])?.id).toBe('row-1');

    const unlinked = toggleWorkoutSessionSuperset(linked, 'bench-1', 'row-1');
    expect(unlinked.sets[0]?.supersetId).toBeUndefined();
    expect(unlinked.sets[2]?.supersetId).toBeUndefined();
  });

  it('applies adjustment only to later incomplete working sets of the same exercise', () => {
    const next = applyWorkoutAdjustmentToRemainingSets(draft(), 'bench-1', 95);
    expect(next.sets[0]?.weight).toBe(100);
    expect(next.sets[1]?.weight).toBe(95);
    expect(next.sets[2]?.weight).toBe(80);
  });

  it('materializes missing planned working rows only after explicit Apply', () => {
    const initial = draft();
    initial.sets = initial.sets.filter((set) => set.id !== 'bench-2');
    const next = applyWorkoutAdjustmentToRemainingSets(initial, 'bench-1', 95, {
      targetSetCount: 3,
      targetReps: 8,
    });
    const benchSets = next.sets.filter(
      (set) => set.exerciseId === 'bench' && set.setType !== 'warmup',
    );

    expect(benchSets).toHaveLength(3);
    expect(benchSets[0]?.weight).toBe(100);
    expect(benchSets.slice(1)).toEqual([
      expect.objectContaining({ completed: false, reps: 8, weight: 95 }),
      expect.objectContaining({ completed: false, reps: 8, weight: 95 }),
    ]);
  });

  it('preserves descending prescription shape when applying a load multiplier', () => {
    const initial = draft();
    const next = applyWorkoutAdjustmentToRemainingSets(initial, 'bench-1', 95, {
      loadMultiplier: 0.95,
      targetSetCount: 3,
      targetWeightsByIndex: [100, 90, 80],
      targetRepsByIndex: [8, 10, 12],
    });
    const benchSets = next.sets.filter(
      (set) => set.exerciseId === 'bench' && set.setType !== 'warmup',
    );

    expect(benchSets).toHaveLength(3);
    expect(benchSets[0]?.weight).toBe(100);
    expect(benchSets[1]?.weight).toBe(85.5);
    expect(benchSets[2]).toEqual(
      expect.objectContaining({ completed: false, reps: 12, weight: 76 }),
    );
  });
});
