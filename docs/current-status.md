# Smart Fitness Current Status

Updated: 2026-08-11

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime `main`: `2e9d46baf5c311a16f8399b1f885bad34317ee6f`.
- Latest runtime merge: PR #607 — Workouts Exercise Library now follows the active light/dark/system theme and uses Liquid Glass material-specific interaction feedback while preserving `SectionList`, stable exercise IDs, favorites/search/filter/recent/similar/custom-exercise behavior, localization and safe-area ownership.
- PR #607 exact validated head: `642102c89a6cc21bfd924e0ecfa6c5276613b124`; Mobile CI #2155 run `31465438807` passed repository/changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor before merge.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open at `0826ff18dac7d4afe78943d9881c5a530507f1af`; `Backend CI`, `PostgreSQL CI` and `Account Deletion Receipt CI` are still queued. Do not merge it until all required exact-head jobs execute and pass.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is active, validation-first.**
- **Coach product/material expansion remains deferred.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## LG-5 completed source/CI batches

Merged demonstrated-defect runtime batches now total **34** and run through PR #607:

1. #559 Create Program keyboard/safe-area reachability.
2. #560 Program Add Workout short-height/large-text resilience plus New Routine notes interaction minimum.
3. #561 shared text resilience.
4. #565 shared SectionHeader active-theme consistency.
5. #567 shared state active-theme consistency.
6. #568 auth/account appearance consistency.
7. #569 onboarding appearance consistency.
8. #570 Exercise Detail loading-state ownership.
9. #571 Share Workout state/theme resilience.
10. #572 bounded Coach history/detail/input-summary theme consistency.
11. #573 paginated Social collection virtualization.
12. #574 workout-post comment virtualization.
13. #577 completed-workout exercise-group virtualization.
14. #579 Workout Template Detail exercise virtualization.
15. #580 Progress body-measurement keyboard reachability.
16. #581 Coach Run History virtualization.
17. #583 Account Sessions virtualization.
18. #584 User Limitations virtualization.
19. #585 Sync Conflict Review virtualization.
20. #586 Active Session exercise virtualization.
21. #590 Safety & Recovery Review result virtualization.
22. #591 residual Coach navigation material convergence.
23. #593 Workouts History floating material convergence.
24. #595 Weight Entry shared-form/accessibility convergence.
25. #597 Workout History filter/action/row material convergence.
26. #598 completed-history and pre-workout Safety row single-virtualization boundaries.
27. #599 Safety Gate + Workout Session Finish direct-action material feedback.
28. #600 Workout Template Detail not-found shared action.
29. #601 Program Detail + Program Builder interaction materials.
30. #602 New Routine editor/picker/action-menu interaction materials.
31. #603 Exercise Library retry/row/details/filter interaction materials.
32. #605 Active Session interaction-material convergence.
33. #606 workout-session preparation-state localization.
34. #607 Workouts Exercise Library active-theme/material convergence.

PR #576 remains a scope/documentation audit rather than a runtime package. PR #604 is the docs-only LG-5 checkpoint through PR #603. Completed workout history remains an immutable read surface; do not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

## Recent runtime evidence

### PR #605 — Active Session interaction materials

The previously confirmed Active Session package is complete. Exercise expand/menu/rest/Add Set interactions, set-completion/RPE interactions, RPE selection and overflow/replacement interactions now use material-specific Liquid Glass feedback. Active-session draft persistence, set calculations, completion/RPE timing and semantics, replacement/discard behavior, routes and virtualization boundaries remain unchanged.

Exact head `aabfe05b4572f1dbb5c9c83f557a454a6e0a4a3c`; Mobile CI #2150 run `31462888466`; merge `f46f9ed0e9de02aa4431edd428415762752ffdcf`.

### PR #606 — workout-session preparation localization

The live `/workout-session` preparation state now uses the existing localized Safety Gate copy boundary instead of hard-coded English. Draft hydration, acknowledgement lookup/capture, Safety metadata persistence and gate/session routing remain unchanged.

Exact head `10a67c251d681ca69355ef0354ce3017b864459c`; Mobile CI #2152 run `31463444416`; merge `b41f7a0762281bd28a1c1b12e6e4b5cc4f3a4a51`.

### PR #607 — Workouts Exercise Library theme/material

The live `/workouts/exercise-library` route, virtualized browser, filters, favorites, detail sheet and custom-exercise controls now derive active colors from `AppThemeProvider` and Liquid Glass material tokens instead of hard-coded dark colors/generic opacity. During exact-head validation, a stale legacy `WorkoutExerciseLibraryCard` import of the removed named `styles` export was found and corrected to use `createWorkoutExerciseLibraryCardStyles`; TypeScript and the complete Hermes gate then passed.

Exact head `642102c89a6cc21bfd924e0ecfa6c5276613b124`; Mobile CI #2155 run `31465438807`; merge `2e9d46baf5c311a16f8399b1f885bad34317ee6f`.

## CI execution

- PR #562 routes authoritative routine Mobile CI to `[self-hosted, linux, x64, hermes-mobile-ci]` while preserving the complete gate.
- PR #563 skips only GitHub-generated merge-push duplicates after an already exact-head validated PR.
- PR #564 persists that policy in mobile `AGENTS.md`.
- Backend PR #216 persists the backend counterpart policy.
- Backend PR #215 remains blocked by queued required exact-head workflows; do not weaken runner policy or merge around the gate.

## LG-5 active next work

LG-5 remains **validation-first**. The previously confirmed Active Session package is complete in #605, and the two subsequently demonstrated Workouts defects are complete in #606 and #607.

There is **no pre-authorized broad runtime restyle/refactor package after #607**. Continue by validating remaining live surfaces against the existing contracts, then open only the smallest coherent package for a reproduced or source-demonstrated defect.

Current bounded evidence / inspection rules:

- Recheck Workouts-adjacent live routes for residual hard-coded appearance, generic opacity-only direct interaction, compact-height reachability, text scaling and safe-area ownership only where source or QA evidence demonstrates a mismatch.
- Preserve one suitable virtualized owner for potentially long collections and stable semantic IDs.
- Preserve workout/program lifecycle, active-session persistence, completed-history read-only semantics, exercise-provider/repository behavior and existing route contracts.
- `QuickActionsCard` label-as-key remains a candidate only if live usage is established; do not refactor it speculatively.
- Weight Details recent history remains intentionally capped at 10 entries with stable IDs and 44 pt rows.
- Home/Profile header controls, Coach tab actions, Nutrition calendar/Today controls and Settings shared controls remain no-change evidence unless a new defect is demonstrated.
- Program Detail remains bounded by the seven-day `WeekdayKey` domain.

If inspection shows no defect, record/reuse no-change evidence and move on. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

Physical-device evidence remains separately authorization-gated.

## Durable documentation / CI rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. It must also retain the explicit source-refactor authorization markers unless that contract is deliberately changed: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Boundaries

- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach product/material expansion remains deferred.
- Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
