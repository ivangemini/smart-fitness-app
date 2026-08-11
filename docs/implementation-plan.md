# Smart Fitness — Implementation Plan

Updated: 2026-08-11

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass history belongs in `docs/roadmap/liquid-glass.md`. Exact code, tests and current Git history override stale prose.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime mobile `main`: `a8b2c4530cbdc944e7a3821cdc7926296fb78f18`.
- Latest runtime merge: PR #613, exact validated head `fae10aa93a1d26279eabe9d56eaf1efeb7103974`; Mobile CI #2170 run `31476083264` passed the complete Hermes mobile gate before merge.
- PR #614 immediately preceded it: exact head `ca2a9277cac376b52d6332798ce3cf6ebadadd11`; Mobile CI #2167 run `31474957650`; merge `d0f44018ea457a4acc2d33bc69fb608621b3fbe5`.
- Merged demonstrated-defect LG-5 runtime batches total **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 exact head was refreshed onto that main as `f5c7f2d4cd1d150f5894fcc60725e85f05631d22`; its three required Hermes workflows must execute and pass before ready/merge.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **Phase 10 Responsive Mobile UI Hardening is complete for current source/CI scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is complete for the currently authorized source/CI scope.**
- **Coach product/material expansion remains deferred.**

Release readiness remains lower than source completeness because physical-device, native-release, deployed-backend, provider and production evidence are separately authorization-gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded evidence-backed packages over cosmetic churn.
- Runtime/source changes require a demonstrated defect; compliant surfaces produce no-change evidence instead of source churn.
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
- **Phase 7 Social foundation:** base Social plus Stories list/view/authoring/delete complete for current image-only v1 source scope.
- **Phase 8 privacy/security hardening:** substantially complete for current source scope; environment/provider evidence remains external.
- **Phase 9 release/privacy/data-access evidence:** separate cross-repository/release program; source contracts are substantially advanced but product/provider/release activation remains external.
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope; future concrete regressions remain valid bounded fixes.
- **Phase 11 Liquid Glass + Home convergence:** LG-H1/LG-H2 and LG-1 through LG-4 source work complete; LG-5 validation-first source/CI QA complete for the currently authorized scope.

---

# Phase 11 — Liquid Glass + Home convergence

Home remains:

**compact personal daily metrics → server-authoritative Stories → server-authoritative chronological Following Feed**.

## LG-5 closure

LG-5 finished with **38 demonstrated-defect runtime batches**. Earlier history remains in Git and `docs/roadmap/liquid-glass.md`. The final four packages were:

- **PR #610:** New Routine arbitrary-exercise virtualization.
- **PR #611:** Program Workout Editor arbitrary draft-exercise virtualization.
- **PR #614:** pre-workout Safety Gate narrow-width/localized-copy and accessibility hardening.
- **PR #613:** Program Editor/Picker interaction-material convergence and explicit disabled/destructive state ownership.

PR #612 was intentionally not merged: Program Detail/Builder program-day rows are bounded by the seven-day `WeekdayKey` model, so replacing them merely to satisfy a generic virtualization pattern would have been speculative churn.

The final audit also retained no-change evidence for Workout History list/detail, Workout Template Detail, bounded Program Detail/Builder collections and already guarded active-session/Exercise Library/creation surfaces. A future reproduced regression may receive a bounded fix, but there is no pre-authorized continuation package simply to keep refactoring source.

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
- Backend PR #215 is CI infrastructure only. Exact head `f5c7f2d4cd1d150f5894fcc60725e85f05631d22` is based directly on current backend main; mark ready/merge only after Backend CI, PostgreSQL CI and Account Deletion Receipt CI are all green.
- Do not route routine validation back to hosted runners merely to bypass Hermes queueing unless a demonstrated outage/incompatibility is separately reviewed under the CI policy.
- Mobile `docs/backend/*` remains historical Architecture 1.0 design material; current backend behavior is authoritative in `ivangemini/smart-fitness-backend`.

---

# Remaining roadmap

There is no additional numbered `LG-6` or `LG-7` source-refactor phase in the canonical roadmap. Remaining work is:

1. **Authorization-gated validation/release evidence:** physical standalone/device, native-release, Android/system-navigation, second-device/offline-restart, backend deployment/provider and production evidence as applicable. Execute only when directly authorized.
2. **LG-H3 Steps:** blocked on reviewed native capability/permission contract and later authorized runtime evidence.
3. **LG-H4 ranking/retention:** later, after a separate product contract; chronological Following remains authoritative now.
4. **Coach expansion:** deferred until explicit reprioritization.
5. **Backend CI infrastructure #215:** complete only after its exact-head Hermes validation and merge.
6. **Future regressions:** fix only demonstrated defects in bounded packages; they do not constitute a new autonomous migration/refactor phase.

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. CI does not substitute for physical-device evidence.

Backend runtime/source work must preserve backend lint/format/build/tests and relevant PostgreSQL validation. Source work must not deploy or execute production migrations.

Documentation-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs rewrites must preserve or deliberately update those asserted contracts.
