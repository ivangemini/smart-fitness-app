# Latest Handoff

Updated: 2026-08-10

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `57565185031b4b0fd1b2c17798947d3500c57976`.
- Latest runtime merge: PR #577 `Virtualize LG-5 workout history detail`.
- PR #577 exact validated head: `93e6affdd5293720dafa59b2f3645be8b0462a2a`; Mobile CI #2079 passed before merge.
- PR #576 established and documented the current completed-history read-only scope.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Open backend PR #215 `Route routine backend CI to Hermes` remains draft at exact head `0826ff18dac7d4afe78943d9881c5a530507f1af` and must not merge without real exact-head required Hermes validation.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- Active priority: **LG-5 QA and bounded polish, validation-first.**
- **Coach product/material expansion remains deferred.**

## LG-5 runtime progress

Merged demonstrated-defect batches now run through PR #577:

- **#559:** Create Program keyboard/safe-area reachability.
- **#560:** Program Add Workout short-height/large-text scrolling plus New Routine notes 44 px interaction minimum.
- **#561:** resilient long/localized text behavior for shared `ListRow`, destructive/tertiary buttons and `SegmentedControl`.
- **#565:** shared `SectionHeader` active-theme consistency.
- **#567:** shared `EmptyState`, `InlineError` and `LoadingState` active-theme consistency.
- **#568:** auth/account appearance consistency across screens, shared fields/headers/actions and account modals.
- **#569:** onboarding readiness/client-flow appearance consistency.
- **#570:** Exercise Detail loading-state full-screen theme/safe-area ownership.
- **#571:** Share Workout loading safe-area resilience plus theme-aware disclosure switches.
- **#572:** Coach history filter/detail/input-summary theme consistency; bounded QA only, not a Coach product reprioritization.
- **#573:** Notifications, Following Feed, public-profile workout posts and relationship lists moved from eager paginated `ScrollView + .map()` rendering to top-level `FlatList` boundaries.
- **#574:** workout-post detail became the sole `FlatList` boundary for cursor-paginated comments, avoiding both eager mapping and prohibited same-axis nested virtualization.
- **#577:** completed-workout detail moved exercise groups from eager `ScrollView + .map()` rendering to one top-level `FlatList` boundary while retaining summary, per-set/RPE data and immutable historical Safety & Recovery context.

PR #576 was a scope/documentation audit rather than a runtime package. It confirmed that completed workout history is an immutable read surface in the current product contract; LG-5 must not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

For #577, Mobile CI #2079 passed repository/changed-file line limits, TypeScript, full regression including the new workout-history source guard, expanded model smoke, Expo export and Expo Doctor on exact head `93e6affdd5293720dafa59b2f3645be8b0462a2a` before merge.

## CI execution

- #562 moved routine authoritative Mobile CI to Hermes.
- #563 removed only duplicate merge-generated post-merge Mobile CI runs.
- #564 persisted the runner policy in mobile `AGENTS.md`.
- Backend #216 persisted the backend policy.
- Backend #215 still requires real exact-head Hermes execution before merge; do not weaken the policy or move routine validation back to hosted runners merely to clear the queue.

## Contracts to preserve during LG-5

Do not casually rewrite:

- tuned `Set / Previous / weight / reps / RPE` table semantics;
- active-session persistence and finish/discard lifecycle;
- RPE value domain/select/skip behavior;
- workout/program create/edit/save/reorder/attach/favorite/delete semantics;
- completed-history retention, list/detail navigation and read-only historical review;
- safety/recovery decision and acknowledgement behavior;
- private persistence/sync schemas;
- Social server authority/privacy and chronological Following semantics;
- Social cursor/pagination, reaction/comment/report and relationship action semantics;
- backend API/revision/idempotency/ownership contracts.

Potentially long collections should use one suitable virtualized list boundary with stable identity rather than eager accumulation or same-axis nested virtualized lists.

## Next work

Continue LG-5 by inspecting bounded secondary/shared surfaces against:

- light / dark / system appearance;
- narrow/short phone geometry and safe areas;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long collections, pagination and stable-identity virtualization;
- Active Session set-entry/RPE/replace/finish/discard;
- workout create/edit/save/program attachment;
- completed-history retention, list/detail navigation and read-only record review;
- elevated material and blur/fallback behavior.

If inspection shows no defect, do not create churn. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

## Backend #215

Do not merge #215 merely because the workflow files look correct. Required validation must actually run on the exact intended head. Do not move routine validation back to GitHub-hosted runners just to bypass an unavailable Hermes assignment unless the CI policy's demonstrated-outage/incompatibility exception is genuinely met and separately reviewed.

## Other priorities

- Stories image-only v1 remains source-complete and server-authoritative; no mock/demo Stories.
- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach product/material expansion remains intentionally deferred; bounded live-surface QA fixes do not reopen it.

## Documentation / CI guard

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve both explicit source-refactor authorization markers unless deliberately changing the contract: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Authorization boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credentials/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
