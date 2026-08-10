# Latest Handoff

Updated: 2026-08-10

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `0c1454d182483c5e297315529e897d4f4246220d`.
- Latest runtime merge: PR #581 `Virtualize LG-5 Coach run history`.
- PR #581 exact validated head: `ded513d37f527641c3bf972f234018c1cd6e02f1`; Mobile CI #2084 passed before merge.
- PR #580 Progress keyboard-safety exact head: `025aa3727ca651afcf3971e0726402100f3e93c9`; Mobile CI #2083 passed before merge.
- PR #579 Workout Template Detail virtualization exact head: `5e243e1d97701938621027382e56d5ff35392d53`; Mobile CI #2081 passed before merge.
- PR #576 established and documented the current completed-history read-only scope.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Open backend PR #215 `Route routine backend CI to Hermes` remains draft/open and must not merge without real exact-head required Hermes validation.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- Active priority: **LG-5 QA and bounded polish, validation-first.**
- **Coach product/material expansion remains deferred.**

## LG-5 runtime progress

Merged demonstrated-defect batches now run through PR #581:

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
- **#579:** Workout Template Detail moved arbitrary workout exercises to one top-level `FlatList` while retaining target sets, template actions, workout start, safe-area and fixed-footer behavior.
- **#580:** Progress added automatic keyboard insets plus interactive/on-drag dismissal so embedded body-measurement fields and Save remain reachable without changing floating-tab clearance or persistence.
- **#581:** Coach Run History moved its up-to-50 run collection from vertical `ScrollView + items.map()` to one top-level `FlatList`, preserving API limit, filters, auth/loading/error/empty/retry states and run-detail navigation. This remains bounded QA, not Coach product expansion.

PR #576 was a scope/documentation audit rather than a runtime package. It confirmed that completed workout history is an immutable read surface in the current product contract; LG-5 must not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

Latest validation evidence:

- #579: Mobile CI #2081 green on exact head `5e243e1d97701938621027382e56d5ff35392d53`.
- #580: Mobile CI #2083 green on exact head `025aa3727ca651afcf3971e0726402100f3e93c9`.
- #581: Mobile CI #2084 green on exact head `ded513d37f527641c3bf972f234018c1cd6e02f1`.

Each passed repository/changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor before merge.

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
- body-measurement validation/persistence and floating-tab clearance;
- safety/recovery decision and acknowledgement behavior;
- private persistence/sync schemas;
- Social server authority/privacy and chronological Following semantics;
- Social cursor/pagination, reaction/comment/report and relationship action semantics;
- Coach history API/filter/auth/retry/navigation contracts;
- backend API/revision/idempotency/ownership contracts.

Potentially long collections should use one suitable virtualized list boundary with stable identity rather than eager accumulation or same-axis nested virtualized lists. Keyboard-open forms must retain active-input and primary-action reachability.

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

Current follow-up candidates/evidence:

- User Limitations is a real long-collection candidate because `userLimitations` has no explicit cap, but existing records are visually one grouped `AppCard`. Do not "fix" it by turning every record into a separate unrelated card; preserve material grouping when establishing a virtualized boundary.
- Sync Conflict Review may need similar long-collection treatment, but first establish the correct screen/card boundary and storage semantics.
- Nutrition Add Food, Recovery Check-in, User Limitations, Social Profile Editor and Weight Entry already satisfy the current keyboard-aware scroll source contract; do not churn them without new evidence.
- `ProgramDetailScreen` is semantically limited by the seven-day `WeekdayKey` structure and is not a virtualization target merely because it uses `.map()`.

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
