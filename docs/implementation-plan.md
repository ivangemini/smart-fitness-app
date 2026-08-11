# Smart Fitness — Implementation Plan

Updated: 2026-08-11

This file is the **canonical forward roadmap**. Verified current evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass execution belongs in `docs/roadmap/liquid-glass.md`. Exact code, tests and current Git history override stale prose.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime mobile `main`: `68a9b76cfce41dfbdf01b36d8d15521121ffbc84`.
- Latest runtime merge: PR #603 — Exercise Library retry, exercise rows/details and selected/unselected filter-chip presses now use material-specific Liquid Glass fill feedback while preserving repository/provider search behavior, `FlatList` virtualization, stable exercise IDs, recent-history bound, session-draft mutation and measured safe-area footer.
- PR #603 exact validated head: `d78b759b6726f1416198456415f99dd399eed144`; Mobile CI #2144 run `31461541030` passed the complete Hermes gate before merge.
- Merged demonstrated-defect LG-5 runtime batches now total **31**.
- Recent exact-head evidence:
  - PR #597 `9604d8bacb981a7855c07ef30932ecbb4abdf7b1` → Mobile CI #2130 run `31431403644` → merge `6b5920a211f88da5226609b560840d64a6e8dc9e`.
  - PR #598 `c29ea3cac234ed9057b20674ecc94dbf2c0051df` → Mobile CI #2133 run `31436793602` → merge `539dd1cfd5623f40e3bca581ec2d8fa5e9392215`.
  - PR #599 `56fe0939f9232eb47d4952a24759c707d29abe45` → Mobile CI #2135 run `31437521567` → merge `6e597b147d5a19efbed58b35188ada80b4358c00`.
  - PR #600 `db3f330fe47b016927d705889bea5c6369ab19e3` → Mobile CI #2138 run `31438302598` → merge `413cd54dc15a96bc60d7644062ece28741c92a66`.
  - PR #601 `8860ab9a63ae66d3ee48ab99af8c01bddbf444cd` → Mobile CI #2140 run `31460485579` → merge `3404cc4c33c3a003c9ffd24074475b213aa5ebff`.
  - PR #602 `f7eb3d7ca45d560e21d6c9e9a0b38136bb75d63a` → Mobile CI #2142 run `31460986587` → merge `962ae155afd2521b5c457048f8e303bdaea3f00a`.
  - PR #603 exact evidence is listed above.
- Mobile CI remains routed through the Hermes self-hosted runner by PR #562; PR #563 removes only duplicate merge-generated post-merge runs; PR #564 persists that policy.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open at `0826ff18dac7d4afe78943d9881c5a530507f1af`. Its required exact-head `Backend CI`, `PostgreSQL CI`, and `Account Deletion Receipt` workflows remain queued, so it is **not merge-ready**.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **Progress/exercise secondary-material reassessment is complete for current active source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is the active Phase 11 priority.**
- **Coach product/material expansion remains deferred; bounded live-surface QA fixes do not reopen that phase.**

Release readiness remains lower than source completeness because physical-device, native-release, deployed-backend, provider and production evidence are separately authorization-gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded coherent packages over cosmetic churn.
- Runtime/source changes require a demonstrated defect; compliant surfaces produce no-change evidence instead of source churn.
- Preserve routes, stable IDs, private persistence/sync contracts, calculations, auth/session semantics, workout/program lifecycle, Social authority/privacy and backend API contracts unless a task explicitly changes them.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md`.
- Use shared navigation/safe-area geometry and material primitives; avoid screen-local magic clearances, generic opacity-only direct-interaction feedback and repeated native blur.
- Potentially long collections must use a suitable virtualized list boundary with stable identity; do not replace an eager list with a same-axis nested virtualized list.
- Keyboard-open forms must keep the active input and required primary action reachable while preserving safe-area and floating-navigation clearance.
- Local AsyncStorage remains the active storage strategy; architecture-only design options are not implementation authorization. Reviewed decision evidence: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase. In equivalent explicit terms, **no separate autonomous source-refactor phase is currently authorized**.
- Stories remain in the server-authoritative Social boundary and must not be added to private revisioned `AppState` sync.
- Analytics/telemetry collection remains disabled until its separate consent/evidence gate is explicitly satisfied.
- Source-complete provider, export, worker, delivery or release contracts are not activation authorization.
- Do not claim physical-device, native-release, deployment, provider or production evidence unless it actually ran and was explicitly authorized.
- Do not perform backend deployment/migration execution, provider activation, production data access, OTA/EAS publication, native build/install, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.

---

# Phase status

- **Phase 1 cleanup/migration foundation:** complete.
- **Phase 2 auth/session/account foundation:** complete for established source contract.
- **Phase 3 mobile auth + durable sync:** complete for current source scope.
- **Phase 4 product domain convergence:** complete for current source scope.
- **Phase 5 deterministic Coach:** complete for current planned source scope.
- **Phase 6 provider-neutral agent foundation:** source-complete with safe disabled defaults.
- **Phase 7 Social foundation:** base Social plus Stories list/view/authoring/delete complete for current image-only v1 source scope.
- **Phase 8 privacy/security hardening:** substantially complete for current source scope; environment/provider evidence remains external.
- **Phase 9 release/privacy/data-access evidence:** separate cross-repository/release program; source contracts are substantially advanced but product/provider/release activation remains external.
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope; later concrete regressions remain valid bounded fixes.
- **Phase 11 Liquid Glass + Home convergence:** source migration through LG-4 complete for approved scope; **LG-5 QA and bounded polish is active**.

---

# Phase 11 — Liquid Glass + Home convergence

Home remains:

**compact personal daily metrics → server-authoritative Stories → server-authoritative chronological Following Feed**.

Completed LG-H2, Progress/exercise reassessment and LG-4 details are retained in `docs/roadmap/liquid-glass.md` and current Git history. Do not restart those phases without a newly demonstrated defect or explicit product reprioritization.

## LG-5 — QA and bounded polish active

LG-5 is validation-first. Do not create broad migration packages merely to continue changing source.

### Completed LG-5 source packages

- **PR #559:** Create Program modal keyboard avoidance, scroll reachability and safe-area-aware form clearance.
- **PR #560:** Program Add Workout short-height/large-text resilience plus New Routine notes 44 px interaction minimum.
- **PR #561:** resilient long/localized text behavior for shared `ListRow`, buttons and `SegmentedControl`.
- **PR #565:** shared `SectionHeader` active-theme consistency.
- **PR #567:** shared `EmptyState`, `InlineError` and `LoadingState` active-theme consistency.
- **PR #568:** active-theme auth/account screens and shared form/header/action primitives.
- **PR #569:** active-theme onboarding readiness and client flow.
- **PR #570:** Exercise Detail loading-state theme and safe-area ownership.
- **PR #571:** Share Workout restore/loading safe-area resilience plus theme-aware disclosure switches.
- **PR #572:** bounded Coach history/filter/detail/input-summary theme consistency without reopening Coach product expansion.
- **PR #573:** top-level `FlatList` boundaries for cursor-paginated Notifications, Following Feed, public-profile workout posts and relationship lists.
- **PR #574:** post-detail owns the sole `FlatList` for cursor-paginated workout comments.
- **PR #577:** completed-workout detail owns one top-level `FlatList` for exercise groups while preserving immutable historical Safety & Recovery context.
- **PR #579:** Workout Template Detail owns one top-level `FlatList` for arbitrary workout exercises.
- **PR #580:** Progress owns automatic keyboard insets and interactive/on-drag dismissal for the embedded body-measurement form.
- **PR #581:** Coach Run History owns one top-level `FlatList` for its bounded API collection.
- **PR #583:** Account Sessions owns one top-level `FlatList` with stable session IDs.
- **PR #584:** User Limitations owns one top-level `FlatList` for the unbounded limitation collection.
- **PR #585:** Sync Backup owns the sole `FlatList` for unbounded Sync Conflict Review rows.
- **PR #586:** Active Session owns one top-level `FlatList` for arbitrary exercise count with stable exercise IDs.
- **PR #590:** Safety & Recovery Review owns one screen-level `FlatList` for unbounded restriction/finding rows.
- **PR #591:** residual Coach navigation headers use shared 44×44 `LiquidGlassIconButton` controls.
- **PR #593:** Workouts History floating action uses shared elevated Liquid Glass material and fill-based pressed feedback.
- **PR #595:** Weight Entry delegates label/input/error presentation to shared `FormField`.
- **PR #597:** read-only Workout History filter chips, clear/reset actions and history-row presses use tokenized Liquid Glass material feedback.
- **PR #598:** completed-history Safety restrictions/findings and pre-workout Safety Gate rows are flattened into one screen-level virtualized boundary per screen instead of eager unbounded rendering.
- **PR #599:** Safety Gate acknowledgement/update actions and Workout Session Finish resume/clear/media/discard actions use material-specific pressed fills instead of generic opacity.
- **PR #600:** Workout Template Detail not-found fallback delegates to shared `SecondaryButton`.
- **PR #601:** Program Detail and Program Builder direct actions use control/accent material-specific pressed feedback instead of one shared opacity recipe.
- **PR #602:** New Routine editor, picker and exercise-action modals use control/accent/destructive material-specific feedback while preserving routine creation and picker virtualization.
- **PR #603:** Exercise Library retry, rows/details and active/inactive filter chips use Liquid Glass material-specific feedback while preserving exercise repository and session-draft contracts.

PR #576 remains a documentation/scope correction rather than a runtime package: completed workout history is intentionally read-only in the current product contract. See `docs/qa/lg5-completed-history-scope.md`.

These packages are source/CI evidence only. They do not constitute physical-device proof.

### Required continuing validation matrix

- light / dark / system appearance;
- narrow phone width and short phone height;
- modern iPhone safe areas and Android system-navigation insets;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long collections, pagination and stable-identity virtualization boundaries;
- elevated material and blur/fallback behavior;
- direct-interaction pressed-state material feedback;
- Active Session set entry, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history retention, list/detail navigation and read-only record review.

### Current bounded follow-up candidates and no-change evidence

- **No broad/pre-authorized runtime package remains after PR #603.** Continue validation-first inspection and change source only for a demonstrated defect.
- **Confirmed next bounded defect: Active Session interaction materials.** `SessionExerciseSection`, `SessionSetRow`, `RpeBottomSheet`, `WorkoutSessionModals` and the modal styles in `workoutSessionScreenStyles.ts` still contain generic opacity-only pressed feedback for exercise headers/actions, Add Set, set completion/RPE, RPE choices, overflow actions and replacement rows. Correct only direct-interaction material ownership while preserving set calculations, completion/RPE semantics, replacement/discard flows, session persistence/lifecycle and list virtualization.
- **No-change evidence inside that boundary:** `SessionHeader` already uses shared Liquid Glass icon controls plus a dedicated fill-based Finish pressed state; `WorkoutSessionFooterActions` delegates to shared `PrimaryButton`/`SecondaryButton`; `SessionSetTable` owns no direct Pressable material. Do not churn those files for this defect.
- **Shared primitive identity audit:** `QuickActionsCard` still uses displayed/localized `action.label` as a React key. Treat this only as a candidate until live usage is established; do not change its API solely for an unused/theoretical defect.
- **No-change evidence:** Weight Details recent weigh-in history is explicitly bounded to 10 entries, uses stable entry IDs and 44 pt rows; no virtualization/refactor is justified.
- **No-change evidence:** Home/Profile header controls, Coach tab actions, Nutrition calendar/Today controls and Settings shared controls already satisfy the current source contract; do not churn them without new evidence.
- **Program Detail collection bound:** program days remain semantically bounded by the seven-day `WeekdayKey` structure; PR #601 corrected interaction materials only and does not create a virtualization requirement.
- Nutrition Add Food, Recovery Check-in, User Limitations, Social Profile Editor, Weight Entry and already-audited forms satisfy the current keyboard-aware/shared-form source contract unless new evidence appears.

### LG-5 execution rule

1. Inspect a bounded surface/shared primitive against responsive, material, accessibility, localization and safe-area contracts.
2. If no concrete defect exists, record/reuse no-change evidence and move on.
3. If a concrete defect exists, create the smallest coherent package that fixes it without changing unrelated business logic.
4. Runtime PRs require exact-head Mobile CI before merge.
5. CI/source evidence never substitutes for authorization-gated physical-device/native evidence.

## LG-H3 Steps

**Blocked.** Require a reviewed native health/activity source, dependency and permission disclosure plus separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 Feed retention/ranking

Later. Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain product/material expansion remains deferred unless explicitly reprioritized. Bounded LG-5 fixes to demonstrated defects on existing live Coach surfaces are QA corrections only and do not reopen that phase.

---

# Backend / cross-repository execution

- Backend runtime/source work follows backend `AGENTS.md`, ownership/privacy/idempotency/revision contracts and exact-head validation.
- Backend PR #215 is infrastructure work only and must remain blocked until all required Hermes jobs actually execute and pass on the exact head intended for merge.
- Do not route routine validation back to hosted runners merely to bypass an unavailable Hermes assignment unless a demonstrated outage/incompatibility is separately reviewed under the CI policy.
- Older provider/staging/privacy documents may contain historical `next slice` wording. Later focused evidence plus current code override those intermediate statements.
- Mobile `docs/backend/*` is historical Architecture 1.0 design material; current backend behavior is authoritative in `ivangemini/smart-fitness-backend`.

---

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. Responsive/Liquid Glass packages must also follow their canonical architecture documents. CI does not substitute for physical-device evidence.

Backend runtime/source work must follow backend `AGENTS.md`: routes → services → repositories → DB, strict validation, authenticated ownership, fail-closed privacy, forward-safe migration source, repository line limits, lint/format/build/tests and relevant PostgreSQL CI. Source work must not deploy or execute production migrations.

Docs-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs-only rewrites must preserve or explicitly update those asserted contracts rather than relying on workflow path filters.

# Next work

1. Complete the bounded Active Session direct-interaction material package for the already identified opacity-only owners; preserve session/set/RPE/replacement/discard lifecycle and merge only an exact fully green head.
2. Continue LG-5 validation-first QA after that package and record no-change evidence for compliant boundaries instead of refactoring them.
3. Establish live usage before acting on the `QuickActionsCard` identity candidate.
4. Keep backend #215 unmerged until its exact-head Hermes workflows actually run and pass.
5. Collect physical-device evidence only when separately authorized.
6. Resume deferred Coach/material expansion only after explicit reprioritization.
