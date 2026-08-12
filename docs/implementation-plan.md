# Smart Fitness — Implementation Plan

Updated: 2026-08-12

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass history belongs in `docs/roadmap/liquid-glass.md`; the audited Stories source/release/expansion boundary belongs in `docs/roadmap/stories.md`; the explicitly reviewed S10 product/privacy boundary belongs in `docs/architecture/stories-s10-contract.md`. Exact code, tests and current Git history override stale prose.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest merged mobile runtime/source baseline remains S9-F PR #641, merge `a5da4b85ac42f9560faa5fd0516fef2244e9c7a7`.
- Active S10 mobile PR #643 implements the explicitly prioritized S10-A through S10-E source package. Runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed complete Mobile CI #2217 / run `31631890545`: repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Later S10 documentation-only commits do not change that validated runtime/source tree.
- PR #617 remains a post-closure bounded Workouts regression fix and does not increase the LG-5 demonstrated-defect runtime batch count. LG-5 remains closed at **38** batches.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Latest merged backend Stories baseline remains S9-F PR #228, merge `e23fd62c31c3067c96898138efa2bbf60f2b1d0a`.
- Active backend S10 PR #229 implements S10-A through S10-E server authority. Current source head at this documentation checkpoint is `fb68a88844fe895588a477cefa971e5fae8328ac`; exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI are required before merge-ready status.
- Backend routine CI correctly targets `hermes-backend-ci-01` through `[self-hosted, linux, x64, hermes-backend-ci]`; mobile routine CI remains on its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration. Backend issue #217 is closed.
- Backend PR #222 active-training-program fitness-profile authority remains merged.
- **Home active-program selection is source/CI-complete across backend and mobile.** `docs/architecture/home-active-program-contract.md` remains authoritative. Issue #618 is closed.
- **Stories S9-A through S9-F remain merged and source/CI-complete. S10-A through S10-E are now the explicitly authorized active Stories product-source package.**
- **Phase 10 Responsive Mobile UI Hardening is complete for current source/CI scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is complete for the currently authorized source/CI scope.**
- **There is no remaining approved autonomous source-refactor phase; S10 is reviewed product work, not broad refactor authorization.**
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
- Local AsyncStorage remains the active storage strategy; architecture-only design options are not implementation authorization. Reviewed decision evidence: `docs/architecture/local-state-performance-decision.md`. **No separate autonomous source-refactor phase is currently authorized.**
- Stories remain in the server-authoritative Social boundary and must not be added to private revisioned `AppState` sync.
- S10 follows `docs/architecture/stories-s10-contract.md`: server authority owns audience, Close Friends membership, viewer/reply activity, archive/highlight lifecycle and effective delivery state.
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
- **Phase 7 Social foundation:** base Social, image-only Stories v1 and Stories S9-A through S9-F are complete; reviewed Stories S10-A through S10-E are the active bounded source package. Runtime/provider/release evidence remains separate.
- **Phase 8 privacy/security hardening:** substantially complete for current source scope; S10 must preserve export/inventory/account-deletion authority and environment/provider evidence remains external.
- **Phase 9 release/privacy/data-access evidence:** separate cross-repository/release program; source contracts are substantially advanced but product/provider/release activation remains external.
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope; future concrete regressions remain valid bounded fixes.
- **Phase 11 Liquid Glass + Home convergence:** LG-H1/LG-H2 and LG-1 through LG-4 source work complete; LG-5 validation-first source/CI QA complete; Home active-program selection #618 is source/CI-complete. Stories S10 is a separately reviewed product expansion within the Social/Stories program, not a new Liquid Glass refactor phase.

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

## LG-H2 — Stories baseline and S10 expansion

The merged image-only v1 and S9-A through S9-F baseline remains complete. The user subsequently explicitly prioritized the bounded S10-A through S10-E product package defined in `docs/architecture/stories-s10-contract.md` and tracked in `docs/roadmap/stories.md`.

Merged baseline:

- image-only v1 approved source packages remaining: **0**;
- S9-A direct camera: **source/CI-complete**, native/device evidence gated;
- S9-B captions: **source/CI-complete**, deployed migration/provider/runtime evidence gated;
- S9-C bounded overlay: **source/CI-complete**, deployed migration/provider/runtime evidence gated;
- S9-D private binary Story Like: **source/CI-complete**, migration/runtime evidence gated;
- S9-E bounded Story Reactions: **source/CI-complete across backend and mobile**;
- S9-F bounded in-app interaction notifications: **source/CI-complete across backend and mobile**; no external push provider is part of S9-F.

Active S10 contract:

- **S10-A viewer list:** owner-only identities derived from authoritative Story views; Like/Reaction identity privacy remains unchanged.
- **S10-B Close Friends/audience:** exact audience `following | close_friends`; membership requires the authoritative follower edge, is removed on unfollow/block according to directionality, and is constrained to the follow edge at the database layer.
- **S10-C replies:** bounded moderated private replies to readable active Stories; backend idempotency plus mobile retry-identity preservation; no DM/threaded-chat expansion.
- **S10-D push preference:** provider-neutral preference persistence only; `deliveryProviderAvailable=false` and `effectiveEnabled=false`; no APNs/FCM/provider/native activation.
- **S10-E Archive/Highlights:** owner-only retained expired Story lifecycle and managed Highlight membership/order without reactivating expired Stories in the normal feed.

S10 mobile runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed Mobile CI #2217 / run `31631890545`. Backend S10 must pass all exact-head backend gates before source/CI completion is claimed.

### S10 rollout ordering

The S10 backend remains compatible with the pre-S10 mobile Story create payload because omitted audience defaults to `following`. The S10 mobile client can send a new strict audience field that the pre-S10 backend does not accept. Therefore any later authorized runtime rollout must use **backend S10 first, mobile S10 second**.

No backend deployment, production migration, OTA/EAS publication, native build/install, external push activation or production rollout is authorized or claimed by this source plan.

### Still gated/deferred

- physical-device/standalone evidence;
- deployed storage/provider/moderation/migration/release evidence;
- real APNs/FCM/provider/native push delivery;
- video Stories and video infrastructure;
- richer composition/multi-asset editing;
- DMs/threaded chat or liker/reactor identity lists;
- music/advanced media;
- Story analytics/recommendation/ranking.

Do not translate source/CI completeness into full product/release completion and do not start another candidate merely because it appears in the inventory.

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
- Backend routine CI is operational on `[self-hosted, linux, x64, hermes-backend-ci]`.
- Mobile S10 runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed complete Mobile CI #2217 / run `31631890545`.
- Backend S10 PR #229 must pass Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI on the final runtime/source head before merge-ready status.
- Backend issue #217 remains closed; no new runner registration is required.
- Mobile routine CI remains on the separate repo-scoped `[self-hosted, linux, x64, hermes-mobile-ci]` registration. Sharing the Hermes host does not make the two runner registrations interchangeable.
- Do not route routine validation back to hosted runners merely for convenience; a fallback requires a demonstrated outage/incompatibility under the relevant CI policy.
- Mobile `docs/backend/*` remains historical Architecture 1.0 design material; current backend behavior is authoritative in `ivangemini/smart-fitness-backend`.

---

# Remaining roadmap

The active bounded source package is Stories S10-A through S10-E. There is no additional numbered `LG-6`/`LG-7` source-refactor phase and no separate autonomous refactor package. Remaining work is:

1. **Finish S10 source/CI:** close demonstrated backend/mobile contract or CI defects, synchronize canonical docs, require exact-head gates, and reach merge-ready state for PR #229 and PR #643.
2. **Stories environment/runtime/release evidence:** backend deployment, migration execution, provider configuration, physical-device/native and release evidence only when directly authorized.
3. **Real push delivery:** separately contract provider choice, token lifecycle, native permissions, privacy disclosure, credentials, delivery worker/retries and device evidence before APNs/FCM activation.
4. **LG-H3 Steps:** blocked on a reviewed real native capability/provider/dependency/permission contract and later authorized runtime evidence.
5. **LG-H4 ranking/retention:** later, after a separate product contract; chronological Following remains authoritative now.
6. **Coach expansion:** deferred until explicit reprioritization.
7. **Future regressions/product expansion:** fix demonstrated defects in bounded packages or explicitly prioritize/review a new product contract; candidate inventory is not implicit authorization.

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. CI does not substitute for physical-device evidence.

Backend runtime/source work must preserve backend lint/format/build/tests and relevant PostgreSQL validation. Routine backend validation uses `[self-hosted, linux, x64, hermes-backend-ci]`. Source work must not deploy or execute production migrations.

Documentation-only synchronization uses diff/ancestry verification when workflows intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs rewrites must preserve or deliberately update those asserted contracts.