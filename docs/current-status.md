# Smart Fitness Current Status

Updated: 2026-08-10

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `57565185031b4b0fd1b2c17798947d3500c57976`.
- Latest runtime merge: PR #577 — completed-workout detail now virtualizes exercise groups through one top-level `FlatList` boundary.
- PR #577 exact validated head: `93e6affdd5293720dafa59b2f3645be8b0462a2a`; Mobile CI #2079 passed before merge.
- PR #576 established completed workout history as an immutable read surface for current LG-5 scope and added focused scope evidence.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 is the only open backend project PR at this checkpoint. It remains draft at head `0826ff18dac7d4afe78943d9881c5a530507f1af`; do not merge it without exact-head required Hermes validation.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **Progress/exercise secondary-material reassessment is complete for the current active source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is active.**
- **Coach product/material expansion remains deferred.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## LG-5 completed source/CI batches

### PR #559 — Create Program keyboard safety

Confirmed defect: the auto-focused program-name input could open the keyboard inside a centered non-scrollable modal without keyboard avoidance or modal safe-area ownership, making actions unreachable on short-height/increased-text layouts.

Fix: keyboard avoidance, scrollable content, handled keyboard taps and runtime safe-area clearance while preserving create/cancel/validation behavior.

### PR #560 — Workouts short-height and large-text resilience

Confirmed defects:

- Program Add Workout choice mode could clip its lower action because a max-height/overflow-hidden panel contained non-scrollable localized choice content;
- New Routine expanded exercise notes had a 42 px direct-interaction minimum instead of the established 44 px minimum.

The main Workout Builder, Workout Editor overlay and Finish keyboard/safe-area behavior were reassessed and left unchanged because they already satisfied the source contracts.

### PR #561 — shared UI text resilience

Fixed long/localized text and increased-text-size resilience in shared `ListRow`, destructive/tertiary buttons and `SegmentedControl` labels without changing public behavior.

Exact validated head: `e16f8d961b4a128c4d7b1de5b4fc36d66342fd8e`; Mobile CI #2043 green before merge.

### PR #565 — shared SectionHeader theme consistency

Shared `SectionHeader` now resolves semantic title/subtitle colors from `useAppTheme()` instead of `Colors.dark` while preserving layout, typography, action ownership and API.

Exact validated head: `1a60e87b64db0d87ec99c6ad5c6f47002cf87dde`; Mobile CI #2049 green before merge.

### PR #567 — shared state theme consistency

`EmptyState`, `InlineError` and `LoadingState` now use active semantic colors, eliminating mixed dark-palette state UI inside light/system theme-aware screens.

### PR #568 — auth appearance consistency

Auth/account screens, shared auth form/header/action primitives and account modals now follow the selected app appearance while preserving auth/session, password-reset and account-deletion semantics.

### PR #569 — onboarding appearance consistency

The onboarding readiness placeholder and full client flow now follow `AppThemeProvider`, preserving validation, units, completion payload/persistence, navigation, keyboard and safe-area behavior.

### PR #570 — Exercise Detail loading-state resilience

The initial Exercise Detail loading branch now owns the same active-theme full-screen and runtime safe-area boundary as its error/populated states.

### PR #571 — Share Workout state/theme resilience

Restore/auth-readiness loading now has runtime safe-area ownership and live share-field switches use active semantic colors. Share selection, media/moderation/publication, sync and idempotency semantics are unchanged.

### PR #572 — Coach history theme consistency

Coach Run History filter chips, detail rows and `CoachInputSummaryCard` now use active semantic colors. This was bounded LG-5 presentation hardening only and did not resume deferred Coach product/material work.

Exact validated head: `76276d6ecc6a435339064adcdfd84e51a9c65be3`; Mobile CI #2065 green before merge.

### PR #573 — paginated Social collection virtualization

Notifications, Following Feed, public-profile workout posts and relationship lists now use one top-level `FlatList` per cursor-paginated screen with stable identities. Existing pagination, retry/error/empty/auth/cache/pull-to-refresh/notification-read/relationship-action behavior is preserved.

Exact validated head: `e5769c5e579dc1da9963f7a6e2433214c996dc4a`; Mobile CI #2073 green before merge.

### PR #574 — workout-post comment virtualization

Workout-post detail now owns the sole top-level `FlatList` for cursor-paginated comments rather than eagerly mapping accumulated pages inside a `ScrollView`. Comment list/create/delete/report, retry/load-more, post reactions/report/delete, profile-required, safe-area and keyboard behavior remain preserved.

The first exact-head regression run exposed two source guards that still expected the removed monolithic comments component. They were updated to verify the new single-list architecture and retained comment API ownership; the final exact head passed all gates.

Exact validated head: `3d959128c63b46948cef946895352d96658732fa`; Mobile CI #2077 green before merge.

### PR #577 — completed-workout exercise-group virtualization

Completed-workout detail no longer eagerly mounts every exercise group through `ScrollView + exerciseGroups.map()`. The screen now owns one top-level `FlatList` boundary with stable exercise identity while preserving summary, empty/not-found, per-set data, RPE, volume and immutable historical Safety & Recovery context.

A focused source regression guard prevents reintroducing the eager top-level collection and also protects the read-only completed-history boundary.

Exact validated head: `93e6affdd5293720dafa59b2f3645be8b0462a2a`; Mobile CI #2079 green before merge.

## CI execution changes

These are validation-infrastructure changes, not product behavior:

- PR #562 routes authoritative routine Mobile CI to `[self-hosted, linux, x64, hermes-mobile-ci]` while preserving the complete gate.
- PR #563 skips only GitHub-generated merge-push duplicates after an already exact-head validated PR. The authoritative PR gate remains complete.
- PR #564 persists the runner/cost policy in `AGENTS.md` so later agents do not require the policy to be restated.
- Backend PR #216 persisted the backend counterpart policy.
- Backend PR #215 has **not** completed the actual backend workflow migration. Do not merge it until required exact-head validation is green.

## Documentation audit — 2026-08-10

The project documentation was re-read across both repositories, including root instructions and the complete mobile/backend `docs/` trees.

Important interpretation rules from that audit:

- current Phase 11/LG-5 plans override old roadmap prose that still names Provider/Release P5 as the active autonomous program;
- later focused evidence files and current code override older privacy/export notes that still describe already-implemented source slices as future work;
- historical documents remain historical; do not infer active work merely from an old `next slice` paragraph;
- provider, worker, storage, moderation, password-reset and staging source readiness never authorizes real credentials, provider calls, environment activation or deployment;
- mobile `docs/backend/*` is historical Architecture 1.0 design material; current backend implementation/documentation is authoritative in `ivangemini/smart-fitness-backend`;
- analytics/telemetry remains fail-closed with no production event registry authorization;
- local-state performance evidence still supports the existing AsyncStorage `AppState` snapshot; no storage rewrite is authorized without new measured evidence;
- completed workout history is an immutable read surface in the current product contract; generic session mutation actions do not authorize LG-5 to add history edit/delete UI. See `docs/qa/lg5-completed-history-scope.md`.

## LG-5 active next work

LG-5 remains validation-first. Do **not** restart broad source migration unless QA identifies a concrete defect.

Continue checking:

- light / dark / system appearance;
- narrow/short phones and safe-area ownership;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long collections, pagination and stable-identity virtualization boundaries;
- Active Session set entry, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history retention, list/detail navigation and read-only record review;
- elevated material and blur/fallback behavior.

Physical-device evidence remains separately authorization-gated.

## Durable documentation / CI rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. It must also retain the explicit source-refactor authorization markers unless that contract is deliberately changed: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Boundaries

- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach product/material expansion remains intentionally deferred; bounded QA fixes on existing live surfaces do not reprioritize it.
- No OTA/EAS publication, native build/install, backend deployment, migration execution, provider/production activation, credential/DNS changes or store submission without direct authorization.
