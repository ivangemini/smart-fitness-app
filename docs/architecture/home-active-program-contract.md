# Home active training program contract

Updated: 2026-08-11

## Decision

Home must resolve the current training schedule from one explicit user-level active-program reference. It must not infer the active program from list order, creation/update recency, favorite state, program name, workout history, or the backend `training_programs.is_active` field as it exists today.

The canonical selection is:

```text
activeTrainingProgramId: UUID | null
```

- `null` means the built-in synthetic `DEFAULT_WORKOUT_PROGRAM_ID` program.
- a UUID means that exact user-owned custom training program.
- the synthetic `default-program` sentinel is never persisted or sent to the backend as the active reference.
- there is exactly one user-level selection value, not one boolean flag per program.

## Why a single reference

The mobile domain currently has no active-program field. `favorite` is only program metadata and is allowed on multiple programs. The backend `training_programs` table has an `is_active` column, but mobile does not model or sync it and the backend default is `true`; it therefore cannot currently provide a unique active-program contract.

A per-program `active: boolean` would make uniqueness a distributed invariant across independently revisioned/synced entities. Two devices could legitimately produce multiple active rows. The selection must instead live in a single owner-scoped revision boundary.

## Persistence and sync boundary

The active reference belongs to the existing single-row fitness-profile sync boundary as a user training preference, not to arbitrary `TrainingProgram.metadata` and not to the synthetic default program.

Target source shape:

```text
ProfileState.activeTrainingProgramId: string | null
FitnessProfileSyncSnapshot.activeTrainingProgramId: string | null
fitness_profiles.active_training_program_id: uuid nullable
```

The backend column is an owner-private selector reference. It should be UUID-shaped but should not use a database foreign key to `training_programs`: generic offline sync can deliver the selector and program entities in different orders. Effective program resolution must validate the reference against the current user's non-deleted custom programs instead of relying on FK timing.

The raw UUID is internal linkage metadata. Data-access export must not expose the raw internal program ID merely because the selection is stored in the profile row.

## Mutation semantics

Only an explicit user action changes the selected custom program:

- **Set as active** on a custom program sets `activeTrainingProgramId` to that program UUID.
- **Use default program** clears the reference to `null`.
- creating a program does not auto-activate it;
- duplicating a program does not auto-activate it;
- editing/saving a program does not change selection;
- favoriting/unfavoriting a program does not change selection;
- workout completion/recency does not change selection.

This avoids hidden Home schedule changes.

## Delete and stale-reference semantics

If the currently selected custom program is deleted locally, the same local state transition must clear `activeTrainingProgramId` to `null`.

If sync later produces a selector whose program is missing, deleted, invalid, or not owned by the current account:

1. effective Home resolution immediately falls back to the built-in default program;
2. no favorite/recency/order fallback is attempted;
3. the stale selector is repaired to `null` through the normal local/profile persistence path when the reconciled state is applied.

A missing referenced program therefore cannot make Home empty or select a different custom program implicitly.

## Home resolution

The resolver is deterministic:

```text
if activeTrainingProgramId is a valid UUID
  and an exact custom program with that id exists:
    use that program
else:
    use createDefaultTrainingProgram(workouts)
```

Home keeps the existing local weekday/day lookup behavior for the resolved program. This contract changes only which program supplies the weekly schedule.

## UI contract

The minimum coherent product surface is:

- Program Detail exposes an explicit **Set as active** action for an inactive custom program;
- the selected custom program exposes a non-interactive **Active** state/label instead of a duplicate activation action;
- the built-in/default program can be selected explicitly through **Use default program** from the Programs surface;
- Home itself is a consumer of the selection and is not the primary place to mutate it.

No favorite icon or recency signal may imply active state.

## Account and lifecycle boundaries

- selection is account-scoped with the existing authenticated fitness-profile sync ownership;
- sign-out/account switching must not carry a previous account's selector into another account;
- account deletion removes the fitness-profile row through the existing ownership cascade;
- the built-in default remains local/synthetic and requires no backend row;
- sync conflicts use the existing single fitness-profile revision/conflict semantics rather than cross-program boolean reconciliation.

## Backend legacy `training_programs.is_active`

This contract does not repurpose or trust the existing backend `training_programs.is_active`, `started_at`, or `ended_at` columns. Their historical/lifecycle meaning is separate from the Home selector until a future migration explicitly reviews/removes/redefines them.

The new Home resolver must never read those columns as a fallback source of truth.

## Implementation order

1. backend: add nullable fitness-profile selector field and sync/schema/parser/repository/PostgreSQL evidence;
2. merge backend authority first;
3. mobile: extend profile state/defaults/persistence/sync parsing and stale-reference repair;
4. mobile: add explicit activation/default actions and deterministic resolver;
5. replace Home's unconditional synthetic-program choice with the resolver;
6. add regression tests for no-heuristic selection, delete fallback, missing-reference fallback, account isolation and sync round-trip;
7. require exact-head backend/mobile CI before merge.

No deployment, migration execution, native build/install or release action is implied by this contract.
