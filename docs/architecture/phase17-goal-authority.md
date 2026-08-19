# Phase 17 Goal Authority

Updated: 2026-08-19

## Decision

Phase 17 starts by reusing the existing canonical fitness-profile goal fields rather than introducing a second persisted goal collection.

Current authoritative fields:

- `ProfileState.goalType`;
- `ProfileState.targetWeight`;
- `ProfileState.weeklyWeightChangeGoal`;
- `ProfileState.trainingDaysPerWeek`.

They are already mutated through the established `updateProfileGoals` action and represented in the existing fitness-profile synchronization snapshot. New goal-aware Progress and Coach behavior must treat those fields as the current source of truth unless a future reviewed requirement cannot be represented by them.

## First typed fact layer

`buildGoalFacts()` derives read-only goal context from:

- canonical profile goal fields;
- canonical weight history;
- canonical completed workout sessions;
- an explicit time anchor.

The first fact set contains:

- current saved goal type;
- target weight;
- latest recorded weight and signed target delta when evidence exists;
- target training days per week;
- unique completed training days in the bounded last-seven-local-day window;
- completed-session count and evidence window metadata.

Repeated workouts on one local day count as one active training day. Missing weight evidence remains missing.

## Presentation contract

Progress may show the typed facts as neutral context. It must not invent a universal goal score, infer body composition, label adherence as moral success/failure, or convert the saved goal into an automatic plan change.

The first Progress surface displays:

- goal type;
- target weight;
- current recorded weight when available;
- active training days in the last seven days relative to the saved weekly target;
- an explicit route to the existing Profile goal editor.

## Mutation boundary

This slice is read-only. It does not alter `updateProfileGoals`, nutrition-target recalculation, training programs, workouts or Coach proposals.

Existing Profile goal editing remains explicit and confirmation-gated. Future Coach or Planning proposals may recommend changes, but canonical mutation must remain an explicit user action under a separately reviewed contract.

## Future expansion

A new persisted goal entity is justified only if a reviewed requirement needs semantics that the current fitness-profile authority cannot safely represent, for example multiple simultaneous independently versioned goals or historical goal lifecycle records. Such expansion must define ownership, migration, sync/revision, conflict and deletion semantics before implementation.
