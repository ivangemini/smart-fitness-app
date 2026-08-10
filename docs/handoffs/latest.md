# Latest Handoff

Updated: 2026-08-10

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `8e8effabe1d7b1cc3b7ccee870b9886d3e2fb64b`.
- Canonical roadmap checkpoint after runtime work: PR #587.
- Latest runtime merge: PR #586 `Virtualize LG-5 Active Session exercises`.
- PR #586 exact validated head: `1ccbe7eb42df0ed0810508d4471865f6cd2714e2`; Mobile CI #2095 passed before merge.
- PR #585 Sync Conflict Review exact validated head: `a5e61c2312d42c9dcd6e110030c516e270db8354`; Mobile CI #2094 passed before merge.
- PR #584 User Limitations exact validated head: `392bcb0c237cda6cb55265c12585d265f389a294`; Mobile CI #2089 passed before merge.
- PR #583 Account Sessions exact validated head: `d8d829d1f65e928314a042a16777b78c8b2b6673`; Mobile CI #2087 passed before merge.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Open backend PR #215 `Route routine backend CI to Hermes` remains draft/open and must not merge without real exact-head required Hermes validation.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- Active priority: **LG-5 QA and bounded polish, validation-first.**
- **Coach product/material expansion remains deferred.**

## LG-5 runtime progress

Merged demonstrated-defect batches now run through PR #586:

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
- **#574:** workout-post detail became the sole `FlatList` boundary for cursor-paginated comments.
- **#577:** completed-workout detail moved exercise groups to one top-level `FlatList`, preserving summary, per-set/RPE data and immutable historical Safety & Recovery context.
- **#579:** Workout Template Detail moved arbitrary workout exercises to one top-level `FlatList` while retaining target sets, template actions, workout start, safe-area and fixed-footer behavior.
- **#580:** Progress added automatic keyboard insets plus interactive/on-drag dismissal for the embedded body-measurement form.
- **#581:** Coach Run History moved its up-to-50 run collection to one top-level `FlatList`, preserving API limit, filters, auth/loading/error/empty/retry states and run-detail navigation.
- **#583:** Account Sessions moved the active-session collection to one top-level `FlatList` keyed by stable session IDs while preserving refresh and revocation actions.
- **#584:** User Limitations moved its unbounded record collection to one top-level `FlatList` while preserving the visually grouped Current Records material section, status/delete/sync actions and keyboard-aware add form.
- **#585:** Sync Backup became the sole `FlatList` owner for the unbounded Sync Conflict Review collection. Conflict header/rows/footer remain one contiguous material section and durable choice/confirmation/resume/retry behavior is preserved.
- **#586:** Active Session moved arbitrary `visibleExercises` from `ScrollView + .map()` to one top-level `FlatList` keyed by exercise ID while preserving SessionHeader, empty-workout actions, set entry/RPE/replacement, finish/discard behavior, keyboard insets and footer actions.

PR #576 remains a scope/documentation audit rather than a runtime package. Completed workout history is an immutable read surface in the current product contract; do not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

Latest validation evidence:

- #583: Mobile CI #2087 green on exact head `d8d829d1f65e928314a042a16777b78c8b2b6673`.
- #584: Mobile CI #2089 green on exact head `392bcb0c237cda6cb55265c12585d265f389a294`.
- #585: Mobile CI #2094 green on exact head `a5e61c2312d42c9dcd6e110030c516e270db8354`.
- #586: Mobile CI #2095 green on exact head `1ccbe7eb42df0ed0810508d4471865f6cd2714e2`.

Each runtime package passed repository/changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor before merge.

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

Continue LG-5 validation-first inspection against:

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

Current bounded evidence:

- **There is no pre-authorized runtime package after PR #586.** Inspect first; change source only for a newly demonstrated defect.
- Weight Details recent weigh-in rows are explicitly bounded to 10 entries; its `ScrollView` is not a long-collection defect by itself.
- `ProgramDetailScreen` remains semantically limited by the seven-day `WeekdayKey` structure and is not a virtualization target merely because it uses `.map()`.
- Nutrition Add Food, Recovery Check-in, User Limitations, Social Profile Editor and Weight Entry already satisfy the current keyboard-aware scroll source contract; do not churn them without new evidence.
- User Limitations and Sync Conflict Review long-collection candidates are resolved by #584 and #585.
- Active Session arbitrary exercise-count virtualization is resolved by #586; further session changes require separate demonstrated layout/interaction evidence.

If inspection shows no defect, record/reuse no-change evidence and move on. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

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
