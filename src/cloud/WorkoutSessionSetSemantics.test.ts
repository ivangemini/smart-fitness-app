import { describe, expect, it } from 'vitest';

import type { AppState, WorkoutSession } from '@/types';

import {
  applyRemoteWorkoutSessionChanges,
  createWorkoutSessionQueueOperation,
} from './WorkoutSessionSync';

const SESSION_ID = '11111111-1111-4111-8111-111111111111';
const SET_ID = '22222222-2222-4222-8222-222222222222';
const DEVICE_ID = '33333333-3333-4333-8333-333333333333';

const makeSession = (setOverrides: Partial<WorkoutSession['sets'][number]> = {}): WorkoutSession => ({
  id: SESSION_ID,
  workoutId: 'push',
  workoutTitle: 'Push',
  startedAt: '2026-08-22T08:00:00.000Z',
  finishedAt: '2026-08-22T09:00:00.000Z',
  sets: [
    {
      id: SET_ID,
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      weight: 80,
      reps: 8,
      completed: true,
      ...setOverrides,
    },
  ],
});

describe('workout session set semantics sync contract', () => {
  it('keeps legacy sessions on schema v1 when no set semantics are present', () => {
    const operation = createWorkoutSessionQueueOperation({
      action: 'create',
      session: makeSession(),
      deviceId: DEVICE_ID,
      baseRevision: 0,
      now: '2026-08-22T09:01:00.000Z',
    });

    expect(operation.payload?.schemaVersion).toBe(1);
  });

  it('uses schema v2 when set type or superset semantics are present', () => {
    const operation = createWorkoutSessionQueueOperation({
      action: 'create',
      session: makeSession({ setType: 'warmup', supersetId: 'pair-a' }),
      deviceId: DEVICE_ID,
      baseRevision: 0,
      now: '2026-08-22T09:01:00.000Z',
    });

    expect(operation.payload?.schemaVersion).toBe(2);
    expect(operation.payload?.sets).toEqual([
      expect.objectContaining({ setType: 'warmup', supersetId: 'pair-a' }),
    ]);
  });

  it('reads v2 set semantics without breaking legacy state shape', () => {
    const state = { workoutSessions: [] } as unknown as AppState;
    const result = applyRemoteWorkoutSessionChanges(state, [
      {
        entityType: 'workoutSessions',
        entityId: SESSION_ID,
        revision: 1,
        payload: {
          schemaVersion: 2,
          id: SESSION_ID,
          workoutId: 'push',
          workoutTitle: 'Push',
          startedAt: '2026-08-22T08:00:00.000Z',
          finishedAt: '2026-08-22T09:00:00.000Z',
          sets: [
            {
              id: SET_ID,
              exerciseId: 'bench',
              exerciseName: 'Bench Press',
              weight: 40,
              reps: 10,
              completed: true,
              setType: 'warmup',
              supersetId: 'pair-a',
            },
          ],
          deviceId: DEVICE_ID,
        },
      },
    ]);

    expect(result.appliedRecordIds).toEqual([SESSION_ID]);
    expect(result.nextState.workoutSessions[0]?.sets[0]).toEqual(
      expect.objectContaining({ setType: 'warmup', supersetId: 'pair-a' }),
    );
  });

  it('fails closed on unknown set semantics', () => {
    const state = { workoutSessions: [] } as unknown as AppState;
    const result = applyRemoteWorkoutSessionChanges(state, [
      {
        entityType: 'workoutSessions',
        entityId: SESSION_ID,
        revision: 1,
        payload: {
          schemaVersion: 2,
          id: SESSION_ID,
          workoutId: 'push',
          workoutTitle: 'Push',
          startedAt: '2026-08-22T08:00:00.000Z',
          finishedAt: '2026-08-22T09:00:00.000Z',
          sets: [
            {
              id: SET_ID,
              exerciseId: 'bench',
              exerciseName: 'Bench Press',
              weight: 40,
              reps: 10,
              completed: true,
              setType: 'mystery',
            },
          ],
        },
      },
    ]);

    expect(result.appliedRecordIds).toEqual([]);
    expect(result.nextState.workoutSessions).toEqual([]);
  });
});
