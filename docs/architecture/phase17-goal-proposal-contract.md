# Phase 17 Goal Proposal Contract

Updated: 2026-08-19

## Purpose

P17-D adds a non-canonical proposal/preview boundary to the existing Profile goal editor without introducing a second persisted goal authority.

Canonical goal ownership remains the fitness profile fields:

- `goalType`;
- `targetWeight`;
- `weeklyWeightChangeGoal`;
- `trainingDaysPerWeek`.

## Proposal shape

A proposal contains:

- schema version;
- an exact snapshot of the canonical goal fields used as its source;
- the proposed replacement snapshot;
- only the explicit current-to-proposed field changes.

Proposal objects are ephemeral UI/domain values. They are not persisted, synchronized, sent to Coach, or treated as canonical state.

## State transition

The reviewed first flow is:

`editable form → proposal preview → guarded apply → applied | stale`

Before mutation, the app compares the proposal source snapshot against the current canonical profile inside the state transition. If any canonical goal field changed after the preview was created, the operation returns `stale` and preserves the current state unchanged.

This is the stale-source authority for P17-D v1. No best-effort merge is attempted.

## Cross-domain boundary

Applying a goal proposal mutates only the canonical goal fields. It does not automatically change:

- nutrition targets;
- training programs or active-program selection;
- workouts or workout prescriptions;
- Labs, recovery or safety state.

Those domains require their own reviewed confirmation/application flow. The Profile UI explicitly tells the user that they remain unchanged after a goal proposal is applied.

## Presentation rules

The preview lists current and proposed values before application. Copy remains neutral and descriptive. It must not introduce adherence scores, guilt, punishment, streak-loss mechanics or moralized success/failure labels.

## Deferred scope

P17-D v1 does not include model-generated goal proposals, proposal persistence/history, multiple simultaneous goals, deadlines, or a new goal entity. Those require separate reviewed contracts before implementation.
