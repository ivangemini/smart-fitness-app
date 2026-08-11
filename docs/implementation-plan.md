# Smart Fitness — Implementation Plan

Updated: 2026-08-11

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass history belongs in `docs/roadmap/liquid-glass.md`; the audited Stories source/release/expansion boundary belongs in `docs/roadmap/stories.md`. Exact code, tests and current Git history override stale prose.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current repository/runtime `main`: `3b3f1bdeb23e5bad6983f582bd44cea85de8aeb9` (PR #619 — audited Stories roadmap).
- Latest runtime merge: PR #617 `fix(workouts): persist program builder state`.
- PR #617 exact validated head: `4773f60339d70f4ee40163ecc92a492547c9ccc7`; Mobile CI #2179 run `31491962947` passed the complete Hermes mobile gate before merge.
- PR #617 is a post-closure bounded regression fix and does not increase the LG-5 demonstrated-defect runtime batch count.
- Merged demonstrated-defect LG-5 runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 exact head remains `f5c7f2d4cd1d150f5894fcc60725e85f05631d22`; all three required exact-head Hermes workflows must actually execute and pass before ready/merge. Runner registration/access remains an infrastructure dependency, not permission to weaken validation.
- **LG-H2 Stories is source-complete for the approved image-only v1 contract.** This is not a claim that the full long-term Stories product, physical-device evidence, deployed media/provider evidence or release evidence is complete. See `docs/roadmap/stories.md`.
- **Stories S9-A direct camera capture is the first explicitly prioritized post-v1 expansion and is source-complete as an image-only mobile acquisition path.** It reuses the existing `story_image` pipeline; matching native/device evidence remains authorization-gated.
- **Phase 10 Responsive Mobile UI Hardening is complete for current source/CI scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is complete for the currently authorized source/CI scope.**
- **Coach product/material expansion remains deferred.**

Release readiness remains lower than source completeness because physical-device, native-release, deployed-backend, provider and production evidence are separately authorization-gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded evidence-backed packages over cosmetic churn.
- Runtime/source changes require a demonstrated defect or an explicitly reviewed new product contract; compliant surfaces produce no-change evidence instead of source churn.
- Preserve routes, stable IDs, private persistence/sync contracts, calculations, auth/session semantics, workout/program lifecycle, completed-history immutability, Social authority/privacy and backend API contracts unless a task explicitly changes them.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md`.
- Potentially long collections require a suitable virtualized owner with stable identity; bounded collections do not need speculative virtualization.
- Keyboard-open forms must keep the active input and required primary action reachable while preserving safe-area and floating-navigation clearance.
- Local AsyncStorage remains the active storage strategy; architecture-only design options are not implementation authorization. Reviewed decision evidence: `docs/architecture/local-state-performance-decision.md`. **There is no remaining approved autonomous source-refactor phase.** In equivalent explicit terms, **no separate autonomous source-refactor phase is currently authorized**.
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
- **Phase 7 Social foundation:** base Social plus the approved image-only Stories v1 source contract is complete; S9-A direct camera capture is a separate source-complete post-v1 mobile expansion. Full Stories product expansion and runtime/release evidence are tracked separately in `docs/roadmap/stories.md`.
- **Phase 8 privacy/security hardening:** substantially complete for current source scope; environment/provider evidence remains external.
- **Phase 9 release/privacy/data-access evidence:** separate cross-repository/release program; source contracts are substantially advanced but product/provider/release activation remains external.
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope; future concrete regressions remain valid bounded fixes.
- **Phase 11 Liquid Glass + Home convergence:** LG-H1/LG-H2 and LG-1 through LG-4 source work complete; LG-5 validation-first source/CI QA complete for the currently authorized scope.

---

# Phase 11 — Liquid Glass + Home convergence

Home remains:

**compact personal daily metrics → server-authoritative Stories → server-authoritative chronological Following Feed**.

## LG-H2 — Stories

The approved image-only v1 source contract is complete across backend authority, Home read/view, viewed-state acknowledgement, managed image acquisition/upload/moderation polling, authoring and owner deletion.

The focused audit is `docs/roadmap/stories.md` and is authoritative for Stories terminology:

- approved image-only v1 source packages remaining: **0**;
- S9-A direct camera capture: **source-complete mobile expansion**, still requiring exact-head CI before merge and separately authorized native/device evidence;
- physical-device/standalone evidence: gated;
- deployed storage/provider/moderation/release evidence: gated;
- captions/text overlays, interactions, audience controls, video, archive/highlights, viewer surfaces and advanced media/analytics: product-expansion inventory only until explicitly prioritized and reviewed.

Direct camera capture does not create a new media pipeline: it supplies a still image to the same preprocessing, signed upload, moderation and approved `story_image` publication path used by media-library authoring. No audio/video capture is added.

Do not translate “image-only v1 source-complete” or “S9-A source-complete” into “the full Stories product is complete.” Do not start another expansion candidate merely because it appears in the inventory.

## LG-5 closure

LG-5 finished with **38 demonstrated-defect runtime batches**. Earlier history remains in Git and `docs/roadmap/liquid-glass.md`. The final four packages were:

- **PR #610:** New Routine arbitrary-exercise virtualization.
- **PR #611:** Program Workout Editor arbitrary draft-exercise virtualization.
- **PR #614:** pre-workout Safety Gate narrow-width/localized-copy and accessibility hardening.
- **PR #613:** Program Editor/Picker interaction-material convergence and explicit disabled/destructive state ownership.

PR #612 was intentionally not merged: Program Detail/Builder program-day rows are bounded by the seven-day `WeekdayKey` model, so replacing them merely to satisfy a generic virtualization pattern would have been speculative churn.

PR #617 later fixed a demonstrated Program Builder persistence boundary regression using persisted `trainingPrograms`/`saveTrainingProgram`. It is a bounded post-closure regression fix, not LG-5 package #39.

The final audit retained no-change evidence for Workout History list/detail, Workout Template Detail, bounded Program Detail/Builder collections and already guarded active-session/Exercise Library/creation surfaces. A future reproduced regression may receive a bounded fix, but there is no pre-authorized continuation package simply to keep refactoring source.

## LG-H3 — Steps

**Blocked.** Resume only after all of the following exist:

1. a reviewed real native health/activity data source;
2. reviewed dependency and permission/disclosure contracts;
3. explicit authorization for the required native/physical runtime work;
4. evidence from that runtime.

Do not infer steps from workouts and do not add fake/local step data.

## LG-H4 — Feed retention/ranking

**Later / not currently prioritized.** Preserve chronological Following semantics until a separately reviewed ranking/retention contract exists.

## Deferred Coach material

Coach recovery/input/lookback/history/domain product/material expansion remains deferred unless explicitly reprioritized. Bounded fixes for demonstrated regressions on existing live Coach surfaces are QA corrections only and do not reopen a broad product phase.

---

# Backend / cross-repository execution

- Backend runtime/source work follows backend `AGENTS.md`, ownership/privacy/idempotency/revision contracts and exact-head validation.
- Backend PR #215 is CI infrastructure only. Exact head `f5c7f2d4cd1d150f5894fcc60725e85f05631d22` is based directly on current backend main. Resolve Hermes runner registration/access for the backend repository first; then require Backend CI, PostgreSQL CI and Account Deletion Receipt CI to execute and pass before ready/merge.
- Do not route routine validation back to hosted runners merely to bypass the runner-assignment blocker unless a demonstrated outage/incompatibility is separately reviewed under the CI policy.
- Mobile `docs/backend/*` remains historical Architecture 1.0 design material; current backend behavior is authoritative in `ivangemini/smart-fitness-backend`.

---

# Remaining roadmap

There is no additional numbered `LG-6` or `LG-7` source-refactor phase in the canonical roadmap. Remaining work is:

1. **Backend CI infrastructure #215:** resolve backend Hermes runner registration/access; after that, exact-head validation and merge remain required.
2. **Stories evidence/expansion boundary:** approved image-only v1 has no remaining autonomous source package. S9-A direct camera capture is the selected source expansion; its physical/native evidence remains authorization-gated. Further product expansion starts only after another candidate in `docs/roadmap/stories.md` receives an explicit reviewed contract.
3. **Authorization-gated validation/release evidence:** physical standalone/device, native-release, Android/system-navigation, second-device/offline-restart, backend deployment/provider and production evidence as applicable. Execute only when directly authorized.
4. **LG-H3 Steps:** blocked on reviewed native capability/permission contract and later authorized runtime evidence.
5. **LG-H4 ranking/retention:** later, after a separate product contract; chronological Following remains authoritative now.
6. **Coach expansion:** deferred until explicit reprioritization.
7. **Home active-program contract:** issue #618 remains a distinct product/state decision; do not invent recency/favorite heuristics for Home schedule selection.
8. **Future regressions:** fix only demonstrated defects in bounded packages; they do not constitute a new autonomous migration/refactor phase.

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. CI does not substitute for physical-device evidence.

Backend runtime/source work must preserve backend lint/format/build/tests and relevant PostgreSQL validation. Source work must not deploy or execute production migrations.

Documentation-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs rewrites must preserve or deliberately update those asserted contracts.
