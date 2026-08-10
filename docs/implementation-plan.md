# Smart Fitness — Implementation Plan

Updated: 2026-08-10

This file is the **canonical forward roadmap**. Detailed current evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass execution belongs in `docs/roadmap/liquid-glass.md`. Historical provider/Social/privacy implementation detail remains in the focused roadmap, architecture, operations and privacy documents plus merged pull requests.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime mobile `main`: `57565185031b4b0fd1b2c17798947d3500c57976`.
- Latest runtime merge: PR #577 — completed-workout detail now uses one top-level `FlatList` boundary for exercise groups.
- PR #577 exact validated head: `93e6affdd5293720dafa59b2f3645be8b0462a2a`; Mobile CI #2079 passed before merge.
- PR #576 established completed workout history as a read-only current-product surface and recorded the focused scope evidence in `docs/qa/lg5-completed-history-scope.md`.
- Earlier LG-5 packages remain: #559, #560, #561, #565, #567-#574; exact evidence is retained in `docs/current-status.md` and Git history.
- Mobile CI execution remains routed through Hermes by PR #562; PR #563 skips only duplicate merge-generated post-merge runs; PR #564 persists that policy for future agents.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open at exact head `0826ff18dac7d4afe78943d9881c5a530507f1af`; it is not merge-ready without real exact-head required Hermes validation.
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

1. Continue LG-5 source/CI QA across remaining secondary/shared surfaces.
2. Fix only concrete defects with bounded PRs and exact-head validation.
3. Keep backend #215 unmerged until exact-head Hermes validation is real and green.
4. Collect physical-device evidence only when separately authorized.
5. Resume deferred Coach/material work only after explicit reprioritization.
