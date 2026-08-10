# Smart Fitness Current Status

Updated: 2026-08-10

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime `main`: `976ea57e2da8753ca990bc2fad151b384a8ccee3`.
- Latest runtime merge: PR #593 — the Workouts History floating action now uses shared elevated `LiquidGlassSurface` material with bounded blur and fill-based pressed feedback while preserving navigation, accessibility, safe-area clearance and 44 pt interaction geometry.
- PR #593 exact validated head: `1edade7075999ba5bc210fe8456a3d73531d0a2b`; Mobile CI #2124 passed repository/changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor before merge.
- PR #591 residual screen-local Coach back controls converged on shared `LiquidGlassIconButton`; exact validated head `1ef8da30bebe13fa9b0407acb82ac44cb50208cd`, Mobile CI #2122 green.
- PR #590 virtualized Safety & Recovery Review result rows at one top-level `FlatList`; exact validated head `adeda4fc66490cd2e2ad05ca84454f962cc6c31d`, Mobile CI #2118 green.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open. Its required exact-head Hermes workflows must actually execute and pass before merge.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **Progress/exercise secondary-material reassessment is complete for the current active source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is active.**
- **Coach product/material expansion remains deferred.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## LG-5 completed source/CI batches

Merged demonstrated-defect runtime batches now total 23 and run through PR #593:

- #559 Create Program keyboard/safe-area reachability.
- #560 Program Add Workout short-height/large-text scrolling plus New Routine notes 44 px interaction minimum.
- #561 shared `ListRow`, destructive/tertiary button and `SegmentedControl` text resilience.
- #565 shared `SectionHeader` active-theme consistency.
- #567 shared `EmptyState`, `InlineError` and `LoadingState` active-theme consistency.
- #568 auth/account appearance consistency.
- #569 onboarding appearance consistency.
- #570 Exercise Detail loading-state safe-area/theme ownership.
- #571 Share Workout loading safe-area resilience and theme-aware switches.
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

PR #576 remains a scope/documentation audit rather than a runtime package. Completed workout history is an immutable read surface in the current product contract; do not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

### PR #590 — Safety & Recovery Review virtualization

Confirmed defect: deterministic review restrictions derive from the unbounded user-limitations collection and findings can be emitted per record, while the screen eagerly rendered restriction/finding arrays inside a `ScrollView`.

Fix: the screen now owns one top-level `FlatList`; restriction rows use stable limitation identity and issue rows preserve backend path identity. Summary, rows and footer remain one visually contiguous Liquid Glass result group. Capability/auth states, lookback controls, deterministic Coach run lifecycle, review snapshot persistence and safe-area clearance are preserved.

Exact validated head: `adeda4fc66490cd2e2ad05ca84454f962cc6c31d`; Mobile CI #2118 green before merge.

### PR #591 — residual Coach navigation convergence

Confirmed defect: six existing Coach surfaces retained duplicated local back-control material recipes, including 42 px variants, despite the shared 44×44 `LiquidGlassIconButton` contract.

Fix: Safety Recovery Preflight, Coach Run History Detail, Nutrition Coach, Strength Coach, Nutrition Target Proposal and Combined Coach Proposal now delegate back navigation to the shared control. Obsolete `backButton/backLabel` styles were removed. Preflight sync/review navigation, immutable run-detail retrieval, Nutrition/Strength run and confirmation flows, target confirmation and Combined confirmations remain intact.

The first exact-head run exposed stale source guards, not runtime failures. Guards were rebound to the shared control owner and semantic retrieval contract. Final exact-head Mobile CI #2122 passed the complete gate on `1ef8da30bebe13fa9b0407acb82ac44cb50208cd`.

### PR #593 — Workouts History floating material

Confirmed defect: the live floating History action on the Workouts tab was a screen-local opaque `Pressable` with opacity-only pressed feedback even though the Liquid Glass architecture assigns floating contextual controls to elevated glass and requires material-fill feedback for direct interaction.

Fix: the route now delegates visible material to shared `LiquidGlassSurface` with `variant="elevated"` and bounded blur. Pressed feedback uses tokenized `controlPressedFill`. `/workout-history`, localization/accessibility labels, floating-tab safe-area clearance and the 44 pt interaction floor remain preserved. A focused source-contract regression guard covers these boundaries.

Exact validated head: `1edade7075999ba5bc210fe8456a3d73531d0a2b`; Mobile CI #2124 passed the complete Hermes gate before merge.

## CI execution

- PR #562 routes authoritative routine Mobile CI to `[self-hosted, linux, x64, hermes-mobile-ci]` while preserving the complete gate.
- PR #563 skips only GitHub-generated merge-push duplicates after an already exact-head validated PR.
- PR #564 persists that policy in mobile `AGENTS.md`.
- Backend PR #216 persisted the backend counterpart policy.
- Backend PR #215 has **not** completed the actual backend workflow migration. Do not merge it until required exact-head validation is green.

## LG-5 active next work

LG-5 remains validation-first. Do **not** restart broad source migration unless QA identifies a concrete defect.

Continue checking light/dark/system appearance, narrow/short phones, safe areas, increased text size, long EN/RU copy, keyboard-open forms, populated/empty/loading/error/disabled states, long collections and stable identity, Active Session lifecycle, workout create/edit/save/program attachment, completed-history read-only review, and elevated material/blur fallback behavior.

Current bounded evidence:

- **There is no pre-authorized runtime package after PR #593.** Inspect first; source changes require a newly demonstrated defect.
- `QuickActionsCard` currently keys secondary actions by displayed `action.label`, which is not a suitable identity contract if the component has live usage. Live usage has not yet been established by the current audit because repository code search is not indexed, so this remains a candidate only; do not change the API for a theoretical/unused defect.
- The Workouts History floating-control mismatch is resolved by #593.
- Post-#593 no-change audit: Home/Profile already use shared `LiquidGlassIconButton`; Coach tab actions use shared `AppButton`; Nutrition calendar/Today controls already use tokenized control and pressed fills, while the 36 pt meal-add visual control has `hitSlop={12}` inside the 52 pt meal header; Settings already uses shared navigation/action controls and safe-area-aware scrolling. Do not churn these surfaces without new evidence.
- Weight Details recent weigh-in rows remain explicitly bounded to 10 entries.
- `ProgramDetailScreen` remains semantically bounded by the seven-day `WeekdayKey` structure.
- Nutrition Add Food, Recovery Check-in, User Limitations, Social Profile Editor and Weight Entry already own keyboard-aware scroll behavior.
- User Limitations, Sync Conflict Review, Active Session and Safety & Recovery Review collection candidates are resolved by #584, #585, #586 and #590.

If inspection shows no defect, record/reuse no-change evidence and move on. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

Physical-device evidence remains separately authorization-gated.

## Durable documentation / CI rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. It must also retain the explicit source-refactor authorization markers unless that contract is deliberately changed: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Boundaries

- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach product/material expansion remains deferred.
- Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
