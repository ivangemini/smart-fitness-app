# Smart Fitness Current Status

Updated: 2026-08-11

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime `main`: `68a9b76cfce41dfbdf01b36d8d15521121ffbc84`.
- Latest runtime merge: PR #603 — Exercise Library retry, exercise-row/details and active/inactive filter-chip interactions now use material-specific Liquid Glass fill feedback while preserving repository/provider behavior, one top-level `FlatList`, stable exercise IDs, recent-history bound, session-draft mutation and measured safe-area footer.
- PR #603 exact validated head: `d78b759b6726f1416198456415f99dd399eed144`; Mobile CI #2144 run `31461541030` passed repository/changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor before merge.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open at `0826ff18dac7d4afe78943d9881c5a530507f1af`; its required `Backend CI`, `PostgreSQL CI` and `Account Deletion Receipt` workflows remain queued. Do not merge it.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is active.**
- **Coach product/material expansion remains deferred.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## LG-5 completed source/CI batches

Merged demonstrated-defect runtime batches now total **31** and run through PR #603:

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

PR #576 remains a scope/documentation audit rather than a runtime package. Completed workout history is an immutable read surface in the current product contract; do not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

## Recent runtime evidence

### PR #597 — Workout History material feedback

Read-only Workout History filter chips, clear/reset actions and history-card presses moved from generic opacity/screen-local opaque material to Liquid Glass control/accent fills. Filtering, stable `session.id`, units/localization, safe area and `/workout-history/[sessionId]` navigation remain unchanged.

Exact head `9604d8bacb981a7855c07ef30932ecbb4abdf7b1`; Mobile CI #2130 run `31431403644`; merge `6b5920a211f88da5226609b560840d64a6e8dc9e`.

### PR #598 — Safety row virtualization boundaries

Completed Workout History Detail historical Safety restrictions/findings and pre-workout Safety Gate rows now belong to one screen-level virtualized boundary per screen instead of eager unbounded rendering. Immutable history semantics, Safety acknowledgement/continue behavior and stable semantic identities remain preserved.

Exact head `c29ea3cac234ed9057b20674ecc94dbf2c0051df`; Mobile CI #2133 run `31436793602`; merge `539dd1cfd5623f40e3bca581ec2d8fa5e9392215`.

### PR #599 — workout direct-action material feedback

Safety Gate acknowledgement/update actions and Workout Session Finish resume/clear/media/discard actions now use control/accent/destructive fill feedback rather than one generic opacity recipe. Finish save/share/discard lifecycle and Safety decision semantics remain unchanged.

Exact head `56fe0939f9232eb47d4952a24759c707d29abe45`; Mobile CI #2135 run `31437521567`; merge `6e597b147d5a19efbed58b35188ada80b4358c00`.

### PR #600 — template not-found shared action

Workout Template Detail not-found fallback now delegates to shared `SecondaryButton`; template list/favorite/delete/start behavior remains unchanged.

Exact head `db3f330fe47b016927d705889bea5c6369ab19e3`; Mobile CI #2138 run `31438302598`; merge `413cd54dc15a96bc60d7644062ece28741c92a66`.

### PR #601 — Program interaction materials

Program Detail and Program Builder direct actions now use material-specific control/accent pressed fills. Program save/remove/favorite flows, Builder `beforeRemove` discard protection, serialization, workout attach/create/edit/remove and keyboard-aware scrolling remain unchanged.

Exact head `8860ab9a63ae66d3ee48ab99af8c01bddbf444cd`; Mobile CI #2140 run `31460485579`; merge `3404cc4c33c3a003c9ffd24074475b213aa5ebff`.

### PR #602 — New Routine interaction materials

New Routine header actions, exercise header/menu, Add Set/Add Exercises, picker rows/Done and exercise action menu now use control/accent/destructive material feedback. Routine plan serialization, workout creation, program attachment, stable exercise IDs, picker `FlatList`, keyboard insets and safe area remain unchanged.

Exact head `f7eb3d7ca45d560e21d6c9e9a0b38136bb75d63a`; Mobile CI #2142 run `31460986587`; merge `962ae155afd2521b5c457048f8e303bdaea3f00a`.

### PR #603 — Exercise Library interaction materials

Exercise Library retry, exercise rows/details and selected/unselected filter chips now own distinct Liquid Glass material feedback. Provider/repository load/search/filter behavior, result virtualization, recent-exercise cap, detail navigation, session-draft add flow and measured footer remain unchanged.

Exact head `d78b759b6726f1416198456415f99dd399eed144`; Mobile CI #2144 run `31461541030`; merge `68a9b76cfce41dfbdf01b36d8d15521121ffbc84`.

## CI execution

- PR #562 routes authoritative routine Mobile CI to `[self-hosted, linux, x64, hermes-mobile-ci]` while preserving the complete gate.
- PR #563 skips only GitHub-generated merge-push duplicates after an already exact-head validated PR.
- PR #564 persists that policy in mobile `AGENTS.md`.
- Backend PR #216 persisted the backend counterpart policy.
- Backend PR #215 has not completed the actual workflow migration because all three exact-head required workflows remain queued; do not weaken runner policy to clear the queue.

## LG-5 active next work

LG-5 remains validation-first. Do not restart broad source migration unless QA identifies a concrete defect.

### Confirmed next bounded runtime package — Active Session interaction materials

Source audit confirms generic opacity-only direct-interaction feedback remains in:

- `src/features/workouts/components/session/SessionExerciseSection.tsx` — exercise expand/collapse, exercise menu, rest-timer action and Add Set;
- `src/features/workouts/components/session/SessionSetRow.tsx` — RPE badge and set-completion control;
- `src/features/workouts/components/session/RpeBottomSheet.tsx` — selected/unselected RPE values;
- `src/features/workouts/components/session/WorkoutSessionModals.tsx` plus `src/features/workouts/styles/workoutSessionScreenStyles.ts` — exercise/workout overflow actions and replacement rows.

The next package must correct only material/pressed-state ownership and preserve active-session persistence, set calculations, completion/RPE semantics, replacement/discard behavior, RPE timing, routes and virtualized exercise/replacement lists.

No-change evidence inside this boundary:

- `SessionHeader.tsx` already uses shared Liquid Glass icon controls and dedicated fill-based Finish feedback;
- `WorkoutSessionFooterActions.tsx` delegates to shared `PrimaryButton`/`SecondaryButton`;
- `SessionSetTable.tsx` owns no direct Pressable material.

Other bounded evidence:

- `QuickActionsCard` label-as-key remains a candidate only until live usage is established.
- Weight Details recent history is explicitly capped at 10 entries with stable IDs and 44 pt rows.
- Home/Profile header controls, Coach tab actions, Nutrition calendar/Today controls and Settings shared controls remain no-change evidence unless new defects emerge.
- Program Detail collection remains bounded by the seven-day `WeekdayKey` domain; PR #601 did not create a collection issue.

If inspection shows no defect, record/reuse no-change evidence and move on. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

Physical-device evidence remains separately authorization-gated.

## Durable documentation / CI rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. It must also retain the explicit source-refactor authorization markers unless that contract is deliberately changed: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Boundaries

- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach product/material expansion remains deferred.
- Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
