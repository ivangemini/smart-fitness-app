# Smart Fitness Current Status

Updated: 2026-08-10

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime `main`: `079817f30b625a9424a7be6011aa8b15d0de2676`.
- Latest runtime merge: PR #595 — live Weight Entry now delegates its label/input/error boundary to shared `FormField`, inheriting a programmatic accessibility label, shared focus/error treatment and `InlineError` while preserving decimal keyboard, unit conversion, persistence, keyboard/safe-area reachability and save/cancel navigation.
- PR #595 exact validated head: `b09be182a5b55d8c5a19a7203adfa1a1b222efae`; Mobile CI #2126 passed repository/changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor before merge.
- PR #593 Workouts History floating material exact validated head: `1edade7075999ba5bc210fe8456a3d73531d0a2b`; Mobile CI #2124 green.
- PR #591 residual Coach navigation exact validated head: `1ef8da30bebe13fa9b0407acb82ac44cb50208cd`; Mobile CI #2122 green.
- PR #590 Safety & Recovery Review virtualization exact validated head: `adeda4fc66490cd2e2ad05ca84454f962cc6c31d`; Mobile CI #2118 green.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open and must not merge until its required exact-head Hermes workflows actually execute and pass.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is active.**
- **Coach product/material expansion remains deferred.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## LG-5 completed source/CI batches

Merged demonstrated-defect runtime batches now total 24 and run through PR #595:

- #559 Create Program keyboard/safe-area reachability.
- #560 Program Add Workout short-height/large-text resilience plus New Routine notes interaction minimum.
- #561 shared text resilience.
- #565 shared SectionHeader active-theme consistency.
- #567 shared state active-theme consistency.
- #568 auth/account appearance consistency.
- #569 onboarding appearance consistency.
- #570 Exercise Detail loading-state ownership.
- #571 Share Workout state/theme resilience.
- #572 Coach history nested theme consistency.
- #573 paginated Social collection virtualization.
- #574 workout-post comment virtualization.
- #577 completed-workout exercise-group virtualization.
- #579 Workout Template Detail exercise virtualization.
- #580 Progress body-measurement keyboard reachability.
- #581 Coach Run History virtualization.
- #583 Account Sessions virtualization.
- #584 User Limitations virtualization.
- #585 Sync Conflict Review virtualization.
- #586 Active Session exercise virtualization.
- #590 Safety & Recovery Review result virtualization.
- #591 residual Coach navigation material convergence.
- #593 Workouts History floating material convergence.
- #595 Weight Entry shared-form/accessibility convergence.

PR #576 remains a scope/documentation audit rather than a runtime package. Completed workout history is an immutable read surface in the current product contract; do not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

### PR #595 — Weight Entry shared form contract

Confirmed defect: the live Weight Entry route duplicated a screen-local label, `TextInput` and error presentation despite the shared `FormField` contract already owning programmatic accessibility labeling, focus treatment, error-border behavior and `InlineError`.

Fix: Weight Entry now uses `FormField`. `parseDisplayNumber`, `displayWeightInputToKg`, canonical kg persistence through `addWeightEntry`, UUID/date creation, decimal keyboard, keyboard-aware `ScrollView`, safe-area bottom clearance and save/cancel `router.back()` behavior remain unchanged. A focused source-contract guard covers the shared form owner and preserved persistence/navigation behavior.

Exact validated head: `b09be182a5b55d8c5a19a7203adfa1a1b222efae`; Mobile CI #2126 passed the complete Hermes gate before merge.

## CI execution

- PR #562 routes authoritative routine Mobile CI to `[self-hosted, linux, x64, hermes-mobile-ci]` while preserving the complete gate.
- PR #563 skips only GitHub-generated merge-push duplicates after an already exact-head validated PR.
- PR #564 persists that policy in mobile `AGENTS.md`.
- Backend PR #216 persisted the backend counterpart policy.
- Backend PR #215 has not completed the actual backend workflow migration; do not merge it until required exact-head validation is green.

## LG-5 active next work

LG-5 remains validation-first. Do not restart broad source migration unless QA identifies a concrete defect.

Current bounded evidence:

- **No broad/pre-authorized runtime package remains after PR #595.**
- **Confirmed next bounded defect:** read-only `WorkoutHistoryScreen` filter chips, clear/reset actions and history-card presses still use shared opacity-only pressed feedback; filter/reset controls also own screen-local opaque theme fills rather than the Liquid Glass control/accent material tokens. Correct only material/pressed-state ownership while preserving filters, `FlatList`, stable `session.id` identity, units/localization, safe-area behavior and read-only navigation.
- `QuickActionsCard` still keys secondary actions by displayed `action.label`; this remains a candidate only until live usage is established because repository code search is not indexed.
- Weight Details is no-change evidence: recent history is explicitly bounded to 10 entries, uses stable entry IDs and 44 pt rows, so no virtualization/refactor is justified.
- Home/Profile header controls, Coach tab actions, Nutrition calendar/Today controls and Settings shared controls already satisfy the current source contract; do not churn them without new evidence.
- `ProgramDetailScreen` remains bounded by the seven-day `WeekdayKey` structure.

If inspection shows no defect, record/reuse no-change evidence and move on. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

Physical-device evidence remains separately authorization-gated.

## Durable documentation / CI rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. It must also retain the explicit source-refactor authorization markers unless that contract is deliberately changed: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Boundaries

- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach product/material expansion remains deferred.
- Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
