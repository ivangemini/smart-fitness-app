# Smart Fitness — Implementation Plan

Updated: 2026-08-10

This file is the **canonical forward roadmap**. Detailed current evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass execution belongs in `docs/roadmap/liquid-glass.md`. Historical provider/Social/privacy implementation detail remains in the focused roadmap, architecture, operations and privacy documents plus merged pull requests.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime mobile `main`: `079817f30b625a9424a7be6011aa8b15d0de2676`.
- Latest runtime merge: PR #595 — live Weight Entry now delegates label/input/error presentation to shared `FormField`, inheriting the programmatic accessibility label plus shared focus/error behavior while preserving decimal keyboard, unit conversion, persistence, safe-area/keyboard reachability and save/cancel navigation.
- PR #595 exact validated head: `b09be182a5b55d8c5a19a7203adfa1a1b222efae`; Mobile CI #2126 passed the complete Hermes gate before merge.
- PR #593 converged the live Workouts History floating control on shared elevated `LiquidGlassSurface` material with bounded blur and fill-based pressed feedback. Exact validated head: `1edade7075999ba5bc210fe8456a3d73531d0a2b`; Mobile CI #2124 green before merge.
- PR #591 converged the remaining screen-local Coach back-control recipes on shared `LiquidGlassIconButton`. Exact validated head: `1ef8da30bebe13fa9b0407acb82ac44cb50208cd`; Mobile CI #2122 green before merge.
- PR #590 virtualized the unbounded Safety & Recovery Review result rows at one screen-level `FlatList` boundary. Exact validated head: `adeda4fc66490cd2e2ad05ca84454f962cc6c31d`; Mobile CI #2118 green before merge.
- Earlier LG-5 packages remain #559, #560, #561, #565, #567-#574, #577, #579-#581, #583-#586; exact evidence is retained in `docs/current-status.md` and Git history.
- PR #576 established completed workout history as a read-only current-product surface and recorded focused scope evidence in `docs/qa/lg5-completed-history-scope.md`.
- Mobile CI execution remains routed through Hermes by PR #562; PR #563 skips only duplicate merge-generated post-merge runs; PR #564 persists that policy for future agents.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open and is not merge-ready without real exact-head required Hermes validation actually running and passing.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **Progress/exercise secondary-material reassessment is complete for the current active source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is the active Phase 11 priority.**
- **Coach product/material expansion remains deferred; bounded live-surface QA fixes do not reopen that phase.**

Release readiness remains lower than source completeness because physical-device, native-release, deployed-backend, provider and production evidence are separately gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded coherent packages over cosmetic churn.
- Preserve routes, IDs, private persistence/sync contracts, calculations, auth/session semantics, workout/program lifecycle, Social authority/privacy and backend API contracts unless a task explicitly changes them.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md`.
- Use shared navigation/safe-area geometry and material primitives; avoid screen-local magic clearances and repeated native blur.
- Potentially long collections must use a suitable virtualized list boundary with stable IDs; do not replace an eager list with a same-axis nested virtualized list.
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
- **Phase 7 Social foundation:** base Social plus Stories list/view/authoring/delete complete for the current image-only v1 source scope.
- **Phase 8 privacy/security hardening:** substantially complete for current source scope; environment/provider evidence remains external.
- **Phase 9 release/privacy/data-access evidence:** separate cross-repository/release program; source contracts are substantially advanced but product/provider/release activation remains external.
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope; later concrete regressions remain valid bounded fixes.
- **Phase 11 Liquid Glass + Home convergence:** source migration through LG-4 complete for the approved scope; **LG-5 QA and bounded polish is active**.

---

# Phase 11 — Liquid Glass + Home convergence

Home remains:

**compact personal daily metrics → server-authoritative Stories → server-authoritative chronological Following Feed**.

Completed LG-H2, Progress/exercise reassessment and LG-4 details are retained in `docs/roadmap/liquid-glass.md` and current Git history. Do not restart those phases without a new demonstrated defect or explicit product reprioritization.

## LG-5 — QA and bounded polish active

LG-5 is validation-first. Do not create broad migration packages merely to continue changing source. Runtime/source changes require a demonstrated defect.

### Completed LG-5 source packages

- **PR #559:** Create Program modal keyboard avoidance, scroll reachability and safe-area-aware form clearance.
- **PR #560:** Program Add Workout short-height/large-text resilience plus New Routine notes 44 px interaction minimum.
- **PR #561:** resilient long/localized text behavior for shared `ListRow`, destructive/tertiary buttons and `SegmentedControl`.
- **PR #565:** shared `SectionHeader` active-theme consistency.
- **PR #567:** shared `EmptyState`, `InlineError` and `LoadingState` active-theme consistency.
- **PR #568:** active-theme auth/account screens, shared form/header/action primitives and account modals.
- **PR #569:** active-theme onboarding readiness and client flow.
- **PR #570:** Exercise Detail loading-state theme and safe-area ownership.
- **PR #571:** Share Workout restore/loading safe-area resilience plus theme-aware disclosure switches.
- **PR #572:** bounded Coach history filter/detail/input-summary theme consistency without resuming deferred Coach product work.
- **PR #573:** top-level `FlatList` boundaries for cursor-paginated Notifications, Following Feed, public-profile workout posts and relationship lists.
- **PR #574:** post-detail owns the sole `FlatList` for cursor-paginated workout comments; comment list/create/delete/report and post/reaction behavior remain separated and preserved.
- **PR #577:** completed-workout detail owns one top-level `FlatList` for exercise groups instead of eager `ScrollView + .map()` rendering; summary, per-set/RPE data and immutable historical Safety & Recovery context remain preserved.
- **PR #579:** Workout Template Detail owns one top-level `FlatList` for arbitrary workout exercises; target-set copy, template actions, start lifecycle, safe-area and fixed-footer behavior remain preserved.
- **PR #580:** Progress owns automatic keyboard insets and interactive/on-drag dismissal for the embedded body-measurement form while retaining floating-tab clearance and measurement persistence.
- **PR #581:** Coach Run History owns one top-level `FlatList` for its bounded 50-run API collection; filters/auth/loading/error/empty/retry/navigation behavior remains preserved. This is QA correction only, not a Coach product reprioritization.
- **PR #583:** Account Sessions owns one top-level `FlatList` for the active-session collection with stable session IDs while preserving refresh and revocation behavior.
- **PR #584:** User Limitations owns one top-level `FlatList` for the unbounded limitation collection while preserving the Current Records material grouping, status/delete/sync actions and keyboard-aware add form.
- **PR #585:** Sync Backup owns the sole `FlatList` for the unbounded Sync Conflict Review collection; conflict header/rows/footer remain one contiguous material group and durable choice/confirmation/resume/retry semantics remain preserved.
- **PR #586:** Active Session owns one top-level `FlatList` for arbitrary exercise count with stable exercise IDs while preserving SessionHeader, empty-workout actions, set entry/RPE/replacement, finish/discard behavior, keyboard insets and footer actions.
- **PR #590:** Safety & Recovery Review owns one screen-level `FlatList` for its unbounded restriction/finding result rows, with stable semantic identities and one contiguous result material group.
- **PR #591:** six residual Coach navigation headers use the shared 44×44 `LiquidGlassIconButton`; local `backButton/backLabel` recipes are removed while run/history/preflight/proposal semantics remain preserved.
- **PR #593:** Workouts History floating action uses shared elevated `LiquidGlassSurface` + blur and tokenized fill-based pressed feedback instead of a local opaque surface + opacity-only pressed state; navigation, accessibility, safe-area clearance and 44 pt interaction geometry are preserved.
- **PR #595:** Weight Entry uses shared `FormField` instead of a local label/TextInput/error recipe, inheriting the shared accessibility label, focus/error treatment and `InlineError` while preserving parsing, unit conversion, persistence, keyboard behavior and navigation.

PR #576 was a documentation/scope correction, not a runtime package: completed workout history is intentionally read-only in the current product contract. See `docs/qa/lg5-completed-history-scope.md`.

These packages are source/CI evidence only. They do not constitute physical-device proof.

### Required continuing validation matrix

- light / dark / system appearance;
- narrow phone width and short phone height;
- modern iPhone safe areas and Android system navigation insets;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long collections, pagination and stable-identity virtualization boundaries;
- elevated material and blur/fallback behavior;
- Active Session set entry, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history retention, list/detail navigation and read-only record review.

### Current bounded follow-up candidates and no-change evidence

- **No broad/pre-authorized runtime package remains after PR #595.** Continue inspection against the validation matrix and change source only when a concrete defect is demonstrated.
- **Confirmed next bounded defect:** current read-only `WorkoutHistoryScreen` filter chips, clear/reset actions and history-row press feedback still share opacity-only `pressed` styles; filter/reset controls also own screen-local opaque theme fills rather than Liquid Glass control/accent tokens. Converge only material/pressed-state ownership in its own package while preserving filtering, stable session identity, read-only navigation, units/localization and safe-area/list behavior.
- **Shared primitive identity audit:** `QuickActionsCard` currently uses displayed `action.label` as a React key. Treat this only as a candidate until live usage is established; do not change its API solely for an unused/theoretical defect. If live usage exists, stable semantic action identity must replace localized display text.
- **No-change evidence:** Weight Details recent weigh-in history is explicitly bounded to 10 entries, uses stable entry IDs and 44 pt rows; no virtualization/refactor is justified by its current contract.
- **No-change evidence from the post-#593 audit:** Home and Profile already use shared `LiquidGlassIconButton` for header actions; Coach tab actions use shared `AppButton`; Nutrition calendar/Today controls already use tokenized control/pressed fills, and the 36 pt meal-add visual control has `hitSlop={12}` within the 52 pt meal header; Settings uses shared `LiquidGlassIconButton`, `SecondaryButton` and `SegmentedControl` with safe-area-aware scrolling. Do not churn these surfaces without new evidence.
- **Program Detail:** remains semantically bounded by the seven-day `WeekdayKey` structure; `.map()` alone is not evidence for virtualization work.
- Nutrition Add Food, Recovery Check-in, User Limitations, Social Profile Editor, Weight Entry and other already-audited forms satisfy the current keyboard-aware/shared-form source contract; do not churn them without new evidence.
- User Limitations, Sync Conflict Review, Active Session and Safety & Recovery Review long-collection boundaries are resolved by #584, #585, #586 and #590 respectively.

### LG-5 execution rule

1. Inspect a bounded surface or shared primitive against the responsive/material/accessibility contracts.
2. If no concrete defect exists, record/reuse the no-change evidence and move on; do not churn source.
3. If a concrete defect exists, create the smallest coherent package that fixes it without changing unrelated business logic.
4. Runtime PRs require exact-head Mobile CI before merge.
5. CI/source evidence never substitutes for authorization-gated physical-device/native evidence.

## LG-H3 Steps

**Blocked.** Require a reviewed native health/activity source, dependency and permission disclosure, plus later separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 Feed retention/ranking

Later. Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain product/material expansion remains deferred unless explicitly reprioritized. Bounded LG-5 fixes to demonstrated defects on existing live Coach surfaces are allowed only as QA corrections and do not reopen that phase.

---

# Backend / cross-repository execution

- Backend runtime/source work follows backend `AGENTS.md`, ownership/privacy/idempotency/revision contracts and exact-head validation.
- Backend PR #215 is infrastructure work only and must remain blocked until its required Hermes jobs actually execute and pass on the exact head intended for merge.
- Do not route routine validation back to hosted runners merely to bypass an unavailable Hermes assignment unless a demonstrated outage/incompatibility is separately reviewed under the CI policy.
- Older provider/staging/privacy/export documents may contain historical `next slice` wording. Later focused evidence plus current code override those intermediate statements; do not repeat already completed source work merely because an older planning note remains in history.
- Mobile `docs/backend/*` is historical Architecture 1.0 design material; current backend behavior is authoritative in `ivangemini/smart-fitness-backend`.

---

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. Responsive/Liquid Glass packages must also follow their canonical architecture documents. CI does not substitute for physical-device evidence.

Backend runtime/source work must follow backend `AGENTS.md`: routes → services → repositories → DB, strict validation, authenticated ownership, fail-closed privacy, forward-safe migration source, repository line limits, lint/format/build/tests and relevant PostgreSQL CI. Source work must not deploy or execute production migrations.

Docs-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs-only rewrites must preserve or explicitly update those asserted contracts rather than relying on workflow path filters.

# Next work

1. Implement the bounded `WorkoutHistoryScreen` material/pressed-state correction while preserving filtering, localization/units, stable session IDs, read-only history semantics and navigation; validate on an exact Hermes Mobile CI head before merge.
2. Continue LG-5 validation-first QA after that package; establish live usage before acting on the `QuickActionsCard` identity candidate and continue residual elevated/material/accessibility inspection.
3. Fix only newly demonstrated concrete defects with bounded PRs and exact-head validation; record no-change evidence for bounded/compliant surfaces instead of refactoring them.
4. Keep backend #215 unmerged until exact-head Hermes validation is real and green.
5. Collect physical-device evidence only when separately authorized.
6. Resume deferred Coach/material work only after explicit reprioritization.
