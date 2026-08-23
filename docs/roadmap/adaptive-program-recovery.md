# Adaptive Program + Recovery Engine

Updated: 2026-08-23

This is an approved unnumbered expansion after the Exercise & Training Intelligence package. It does **not** create P21-F or Phase 22. Existing TrainingProgram, workout-template identity, completed-history immutability, `training-intelligence-v1`, Safety/Recovery, Coach and synchronization boundaries remain authoritative.

## Product objective

Turn deterministic training-performance evidence into explicit program-progression proposals while allowing fresh user-entered recovery evidence to modify those proposals conservatively.

The engine is not a universal readiness score, medical assessment or autonomous coach. Missing evidence stays unknown and no workout/program mutation is allowed without a separate reviewed Apply contract and explicit user confirmation.

## Execution sequence

1. **A1 — Read-only progression proposal foundation.**
2. **A2 — Recovery modifier expansion and evidence drill-down.**
3. **A3 — Explicit proposal preview / Apply contract for persisted templates and programs.**
4. **A4 — Coach explanation over deterministic proposals.**

## A1 — Read-only progression proposal foundation

Authority:

- active/default `TrainingProgram` remains the program authority;
- a program day contributes only through exact `workoutTemplateId`;
- workout templates resolve only by exact `Workout.id`;
- planned exercise identity resolves only by exact exercise ID;
- performance direction reuses deterministic `training-intelligence-v1` findings rather than inventing a second progression calculation;
- only exercise-scoped findings with exact IDs are eligible for exercise proposals;
- unknown templates and identities fail closed.

Initial proposal semantics:

- `new_pr` / `rep_progression` may produce a read-only `progress` proposal;
- `plateau` may produce `maintain`;
- `regression` / `exercise_gap` produce `review` rather than an automatic reduction;
- muscle/global findings remain supporting review evidence and are not converted into arbitrary exercise mutations.

## Recovery modifier contract

The first modifier consumes only a fresh stored `RecoveryCheckIn` within 48 hours of the review anchor.

- no fresh check-in -> `unknown`;
- explicit user-entered sleep, fatigue, soreness, stress, pain-interference and self-reported readiness values may produce `caution` / `strong_caution` labels;
- no weighted readiness score or percentage is calculated;
- recovery evidence may conservatively downgrade a `progress` proposal to `maintain` or turn `maintain` into `review` under stronger caution evidence;
- recovery evidence never silently changes stored workouts/programs;
- the UI must state that the modifier is programming context from user-entered data, not a medical assessment.

## A1 UI boundary

Expose a compact read-only Adaptive Program card under Training Progress:

- current recovery modifier state and contributing self-reported signals;
- exact planned exercise count and unresolved-template count;
- bounded exercise proposals with their underlying deterministic finding;
- explicit wording that nothing is applied automatically.

No Apply button is authorized in A1.

## Persistence / sync boundary

A1 adds no persisted analytics state, backend endpoint, sync schema, provider call or program mutation. The proposal is derived from current local/synced state on demand.

## Future Apply gate

Before A3 can mutate a persisted workout/program template, the reviewed contract must define:

- exact source template and exercise identity;
- exact target prescription fields that may change;
- deterministic bounded progression amount;
- recovery/safety veto and stale-evidence behavior;
- preview and explicit confirmation;
- reversal/undo semantics where practical;
- sync/outbox consequences and conflict behavior;
- completed-session immutability.

Coach may explain an already-derived proposal later, but must not become its calculation or mutation authority.
