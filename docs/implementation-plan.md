# Smart Fitness — Implementation Plan

Updated: 2026-08-12

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass history belongs in `docs/roadmap/liquid-glass.md`; the audited Stories source/release/expansion boundary belongs in `docs/roadmap/stories.md`. Exact code, tests and current Git history override stale prose.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current mobile runtime/source merge: `a7d82e6e928d608eff46efa81846db0461480aeb` after PR #630 `feat(home): honor explicit active training program`.
- Current mobile docs baseline before this synchronization: `9c5f867a252b60fdc6cb2d798b6ec7d459f2fcd3` after docs PR #631.
- PR #630 exact validated head: `07c33bb82033b73c3a71d0eba64aca4afaeb44d9`; Mobile CI #2198 run `31567594528` passed repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor before merge.
- PR #617 remains a post-closure bounded Workouts regression fix and does not increase the LG-5 demonstrated-defect runtime batch count. LG-5 remains closed at **38** batches.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `8c404de0e0007ab23f44d62616b114aff7db5d12` after docs PR #223 synchronized the Hermes CI completion checkpoint.
- Latest backend runtime/CI merge: PR #215 `Route routine backend CI to Hermes`, merge `dd3764a751f76a2ed2fa8566c5b839c442329b3a`.
- PR #215 exact validated head: `2718ca74ad2b2131573e4c7c655be31149af5695`; Backend CI #1614 / run `31571974048`, Backend PostgreSQL CI #221 / run `31571974074`, and Account Deletion Receipt CI #303 / run `31571974080` all passed before merge.
- Backend routine CI now correctly targets the existing repo-scoped `hermes-backend-ci-01` through `[self-hosted, linux, x64, hermes-backend-ci]`; mobile routine CI remains on its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration. Backend issue #217 is closed.
- Backend PR #222 active-training-program fitness-profile authority remains merged; the permanent `fitness-profile-active-training-program-postgres` gate was preserved and revalidated by #215.
- **Home active-program selection is source/CI-complete across backend and mobile.** `docs/architecture/home-active-program-contract.md` remains authoritative: one owner-private selector, `null` meaning the built-in default, explicit activation only, canonical sync UUID identity, stale/deleted-reference repair and deterministic Home schedule resolution. Issue #618 is closed.
- **LG-H2 Stories is source/CI-complete through the reviewed S9-D private Story Like contract.** Physical/deployed/provider/release evidence and deferred future Stories expansion are not implied by that statement.
- **Stories S9-A direct camera, S9-B captions, S9-C bounded overlay and S9-D private Story Like are source/CI-complete.** No further Stories product expansion is currently contract-approved for autonomous implementation.
- **Phase 10 Responsive Mobile UI Hardening is complete for current source/CI scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is complete for the currently authorized source/CI scope.**
- **There is no remaining approved autonomous source-refactor or product-source package.**
- **Coach product/material expansion remains deferred.**

Release readiness remains lower than source completeness because physical-device, native-release, deployed-backend, provider and production evidence are separately authorization-gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded evidence-backed packages over cosmetic churn.
- Runtime/source changes require a demonstrated defect or an explicitly reviewed new product contract; compliant surfaces produce no-change evidence instead of source churn.
- Preserve routes, stable IDs, private persistence/sync contracts, calculations, auth/session semantics, workout/program lifecycle, completed-history immutability, Social authority/privacy, active-program owner authority and backend API contracts unless a task explicitly changes them.
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
- **Phase 7 Social foundation:** base Social plus image-only Stories v1 and reviewed Stories S9-A through S9-D source contracts are complete; future Stories expansion and runtime/release evidence are tracked separately in `docs/roadmap/stories.md` and are not autonomously authorized.
- **Phase 8 privacy/security hardening:** substantially complete for current source scope; environment/provider evidence remains external.
- **Phase 9 release/privacy/data-access evidence:** separate cross-repository/release program; source contracts are substantially advanced but product/provider/release activation remains external.
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope; future concrete regressions remain valid bounded fixes.
- **Phase 11 Liquid Glass + Home convergence:** LG-H1/LG-H2 and LG-1 through LG-4 source work complete; LG-5 validation-first source/CI QA complete; Home active-program selection #618 is source/CI-complete across backend/mobile. No further Phase 11 source package is currently authorized.

---

# Phase 11 — Liquid Glass + Home convergence

Home remains:

**compact personal daily metrics → server-authoritative Stories → server-authoritative chronological Following Feed**.

## Home active-program selection

The reviewed contract in `docs/architecture/home-active-program-contract.md` is source/CI-complete.

Backend PR #222 established:

- nullable UUID `active_training_program_id` in the single-row fitness profile;
- `null` as product-default mode;
- no training-program FK, preserving offline/out-of-order sync and stale-reference repair;
- repository + sync support and legacy omission compatibility;
- permanent PostgreSQL/no-FK and privacy-export regression coverage.

Mobile PR #630 established:

- `ProfileState.activeTrainingProgramId: string | null`;
- canonical UUID mapping through existing training-program sync identity, including legacy local `program-*` IDs;
- persistence metadata and profile push/pull sync;
- explicit `Set as active` / `Use default program` actions;
- same-mutation clear on active custom-program delete;
- post-pull stale-reference repair;
- deterministic Home schedule resolution from the selector rather than favorite, recency, list order or `getWorkoutPrograms(workouts)[0]`.

This does not authorize or imply backend deployment/migration execution, production activation or second-device/runtime evidence.

## LG-H2 — Stories

The approved image-only v1 source contract and separately reviewed S9-A through S9-D slices are complete across their documented backend/mobile authority boundaries.

`docs/roadmap/stories.md` is authoritative for terminology and expansion scope:

- image-only v1 approved source packages remaining: **0**;
- S9-A direct camera: **source/CI-complete**, native/device evidence gated;
- S9-B captions: **source/CI-complete**, deployed migration/provider/runtime evidence gated;
- S9-C bounded overlay: **source/CI-complete**, deployed migration/provider/runtime evidence gated;
- S9-D private binary Story Like: **source/CI-complete**, migration/runtime evidence gated;
- physical-device/standalone evidence: gated;
- deployed storage/provider/moderation/release evidence: gated;
- richer composition, replies/DMs/emoji sets/liker lists/notifications, audience controls, video, archive/highlights, advanced media and Story analytics/ranking: deferred candidate inventory until explicitly prioritized and reviewed.

Do not translate source/CI completeness into full product/release completion and do not start another expansion candidate merely because it appears in the inventory.

## LG-5 closure

LG-5 finished with **38 demonstrated-defect runtime batches**. The final four packages were:

- **PR #610:** New Routine arbitrary-exercise virtualization.
- **PR #611:** Program Workout Editor arbitrary draft-exercise virtualization.
- **PR #614:** pre-workout Safety Gate narrow-width/localized-copy and accessibility hardening.
- **PR #613:** Program Editor/Picker interaction-material convergence.

PR #612 was intentionally not merged because Program Detail/Builder day collections are bounded by the seven-day `WeekdayKey` model. PR #617 later fixed a demonstrated Program Builder persistence regression and is not LG-5 package #39.

A future reproduced regression may receive a bounded fix, but there is no pre-authorized continuation package simply to keep refactoring source.

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
- Backend routine CI is now merged and operational on the backend-specific Hermes runner class `[self-hosted, linux, x64, hermes-backend-ci]` via PR #215.
- PR #215 exact validated head `2718ca74ad2b2131573e4c7c655be31149af5695` passed Backend CI #1614, PostgreSQL CI #221 and Account Deletion Receipt CI #303 before merge `dd3764a751f76a2ed2fa8566c5b839c442329b3a`.
- Backend issue #217 is closed; no new runner registration was required. The prior blocker was the incorrect use of the mobile-only `hermes-mobile-ci` label.
- Mobile routine CI remains on its separate repo-scoped `[self-hosted, linux, x64, hermes-mobile-ci]` registration. Sharing the Hermes host does not make the two runner registrations interchangeable.
- Do not route routine validation back to hosted runners merely for convenience; a fallback requires a demonstrated outage/incompatibility under the relevant CI policy.
- Mobile `docs/backend/*` remains historical Architecture 1.0 design material; current backend behavior is authoritative in `ivangemini/smart-fitness-backend`.

---

# Remaining roadmap

There is no additional numbered `LG-6` or `LG-7` source-refactor phase in the canonical roadmap and no remaining approved product-source package. Remaining work is:

1. **Stories evidence/expansion boundary:** image-only v1 and reviewed S9-A through S9-D source/CI work are complete. Physical/native/provider/deployment/release evidence remains authorization-gated. Further product expansion starts only after another candidate receives explicit prioritization and a reviewed contract.
2. **Authorization-gated validation/release evidence:** physical standalone/device, native-release, Android/system-navigation, second-device/offline-restart, backend deployment/provider and production evidence as applicable. Execute only when directly authorized.
3. **LG-H3 Steps:** blocked on a reviewed real native capability/provider/dependency/permission contract and later authorized runtime evidence.
4. **LG-H4 ranking/retention:** later, after a separate product contract; chronological Following remains authoritative now.
5. **Coach expansion:** deferred until explicit reprioritization.
6. **Future regressions:** fix only demonstrated defects in bounded packages; they do not constitute a new autonomous migration/refactor phase.

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. CI does not substitute for physical-device evidence.

Backend runtime/source work must preserve backend lint/format/build/tests and relevant PostgreSQL validation. Routine backend validation uses `[self-hosted, linux, x64, hermes-backend-ci]`. Source work must not deploy or execute production migrations.

Documentation-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs rewrites must preserve or deliberately update those asserted contracts.
