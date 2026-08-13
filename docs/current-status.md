# Smart Fitness Current Status

Updated: 2026-08-12

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest merged mobile runtime/source baseline remains PR #641 `feat(stories): add S9-F interaction notifications`, merge `a5da4b85ac42f9560faa5fd0516fef2244e9c7a7`.
- Active S10 mobile PR #643 implements the explicitly prioritized S10-A through S10-E mobile source boundary. Runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed complete Mobile CI #2217 / run `31631890545`: repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Later S10 documentation-only commits do not change that validated runtime/source tree.
- PR #617 remains a bounded post-LG-5 Program Builder persistence regression fix and is not LG-5 runtime batch #39. Merged demonstrated-defect LG-5 runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Latest merged backend Stories baseline remains S9-F PR #228 as `e23fd62c31c3067c96898138efa2bbf60f2b1d0a`.
- Active backend S10 PR #229 implements the explicitly prioritized S10-A through S10-E server-authoritative source boundary. Current source head at this documentation checkpoint is `fb68a88844fe895588a477cefa971e5fae8328ac`; exact-head Backend CI/PostgreSQL validation is still required before merge-ready status is claimed.
- Backend routine CI uses the repo-scoped `hermes-backend-ci-01` through `[self-hosted, linux, x64, hermes-backend-ci]`. Mobile routine CI keeps its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration.
- Backend issue #217 is closed: the former blocker was an incorrect mobile-only label on backend workflows, not missing runner registration.
- Backend PR #222 active-training-program fitness-profile authority remains merged as `e199c6e537264b16976e489a03d754ee72c6f4a0`.
- **Home active-program selection is source/CI-complete across backend and mobile.** Issue #618 is closed as completed.
- **LG-H2 Stories / S9 is source/CI-complete through S9-F. Stories S10-A through S10-E are now an explicitly authorized active source package, not a deferred candidate inventory.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 validation-first source/CI QA is complete for the currently authorized source scope.**
- **There is no separate autonomous source-refactor phase. S10 is explicit product work under the reviewed Stories contract, not a reopening of broad refactor scope.**
- Coach product/material expansion remains deferred.

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Home active-program result

The reviewed contract in `docs/architecture/home-active-program-contract.md` is implemented across both repositories.

Backend authority provides:

- nullable owner-private `fitness_profiles.active_training_program_id` UUID state;
- `null` as product-default mode;
- no training-program foreign key, preserving offline/out-of-order sync and stale-reference repair;
- fitness-profile repository and sync parsing/materialization support;
- legacy payload omission compatibility;
- permanent PostgreSQL evidence through `tests/fitness-profile-active-training-program-postgres.test.ts`;
- privacy/export evidence that the raw linkage UUID is not exposed in owner data export.

Mobile provides:

- `ProfileState.activeTrainingProgramId: string | null`, with `null` as product-default mode;
- canonical selector identity via the existing training-program sync UUID mapping, including legacy local `program-*` IDs;
- fitness-profile metadata persistence and push/pull sync support;
- explicit Program Detail `Set as active` / `Use default program` actions without displaying raw UUIDs;
- immediate selector clearing when the active custom program is deleted;
- post-pull stale-reference repair so Home falls back immediately and a later normal profile sync can propagate `null`;
- deterministic Home resolution from the selector rather than favorite, recency, array order or `getWorkoutPrograms(workouts)[0]`.

Source/CI completion does not claim backend deployment/migration execution, second-device runtime evidence, native/device release evidence or production activation.

## Stories source/CI boundary

`docs/roadmap/stories.md` and `docs/architecture/stories-s10-contract.md` are authoritative for Stories terminology, current S10 scope and expansion boundaries.

### Completed merged baseline

- Image-only v1: authenticated/idempotent server Story authority, 24-hour expiry, active-only reads, cursor/viewed-state handling, Following/privacy/block/restriction enforcement, managed `story_image` authority, mobile Home strip/viewer, media-library selection, bounded preprocessing, signed upload/finalize/polling, restart-safe draft recovery and owner delete.
- **S9-A direct camera:** source/CI-complete still-photo acquisition through the existing `story_image` pipeline; native/device evidence remains gated.
- **S9-B captions:** source/CI-complete strict caption persistence/moderation/export/mobile authoring/viewer integration; deployed migration/provider/runtime evidence remains gated.
- **S9-C bounded overlay:** source/CI-complete separate bounded overlay authority and rendering; deployed migration/provider/runtime evidence remains gated.
- **S9-D private Story Like:** source/CI-complete dedicated persistence/API/lifecycle/privacy authority and mobile privacy-separated interaction surfaces.
- **S9-E bounded Story Reactions:** source/CI-complete across backend and mobile, with the fixed `love | fire | strong | clap` set, owner aggregates only and no ranking/analytics coupling.
- **S9-F bounded interaction notifications:** source/CI-complete across backend and mobile using the existing in-app Social Notification Center. No APNs/FCM/push provider was introduced.

### Active S10 source package

The user explicitly prioritized S10 after S9 closure. The reviewed contract is `docs/architecture/stories-s10-contract.md`.

- **S10-A owner-only viewer list:** backend-recorded Story views may be surfaced only to the Story owner, with existing block/moderation authority. This does not expose Like/Reaction identity lists.
- **S10-B Close Friends / audience:** exact audience is `following | close_friends`. Close Friends membership is server-owned, requires an authoritative follower edge, is removed directionally on unfollow and symmetrically on block, and is structurally constrained to the follow edge in PostgreSQL. Re-follow does not resurrect membership.
- **S10-C bounded replies:** non-owner readable active Stories accept moderated 1–1,000 character private replies. Backend creation is idempotent; mobile now preserves one idempotency key across retries of the same normalized Story/body so response loss cannot create a duplicate retry.
- **S10-D push-preference seam:** preference persistence exists only as provider-neutral source state. `deliveryProviderAvailable=false` and `effectiveEnabled=false` remain authoritative until a separately approved provider/native package. No APNs/FCM delivery is activated.
- **S10-E Archive/Highlights:** expired owned Stories may be retained in owner Archive with approved managed media; active interactions are cleared according to lifecycle policy; Archive/Highlights remain owner-managed and do not reactivate expired Stories in the normal feed.

The S10 mobile runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed Mobile CI #2217 / run `31631890545`. Backend exact-head CI for the hardened S10 branch must be green before backend source/CI completion is claimed.

The base Social authority, chronological Following ordering, Story ranking/analytics and private revisioned `AppState` sync remain unchanged.

### Rollout compatibility boundary

S9-F's earlier notification response extension remains mobile-first compatible as documented historically.

S10 has the opposite create-path rollout dependency: the S10 backend accepts legacy Story creation with omitted audience and defaults it to `following`, while the S10 mobile client can send the new strict audience field that the pre-S10 backend does not accept. Therefore any later authorized S10 runtime rollout must deploy/migrate/validate the compatible backend first, then release/activate the S10 mobile client.

This is compatibility guidance only. No backend deployment, production migration, OTA/EAS publication, native build/install, provider activation or production rollout is claimed.

### Not established by source completion

- physical-device/standalone camera/picker, upload interruption/restart, expiry, privacy and second-device evidence;
- deployed storage/CDN/moderation/provider/migration evidence, including production execution of Stories migrations through S10 migration `0049_social_stories_s10`;
- broad release/privacy/legal/accessibility/runtime evidence;
- DMs/threaded chat, liker/reactor identity lists, video, richer composition, music/advanced media and Story analytics/ranking;
- actual push delivery/APNs/FCM/provider credentials or native push permissions.

These remain gated or deferred. Do not convert a provider-neutral source seam into activation permission.

## LG-5 closure evidence

LG-5 remains closed at **38 demonstrated-defect runtime batches**. The final four packages were:

35. PR #610 — New Routine arbitrary-exercise virtualization.
36. PR #611 — Program Workout Editor arbitrary draft-exercise virtualization.
37. PR #614 — Safety Gate narrow-width/localized-copy/accessibility hardening.
38. PR #613 — Program Editor/Picker interaction-material convergence.

PR #612 was intentionally not merged because Program Detail/Builder program-day collections are bounded by the seven-day `WeekdayKey` model. PR #617 is a later bounded persistence regression fix, not LG-5 package #39.

A future concrete regression can still receive a bounded fix. Completion does not authorize manufacturing additional refactor work merely to continue changing source.

## CI execution

- Mobile authoritative routine CI uses `[self-hosted, linux, x64, hermes-mobile-ci]` and retains repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.
- Backend authoritative routine CI uses the separate repo-scoped `[self-hosted, linux, x64, hermes-backend-ci]` class.
- Do not substitute the mobile/backend custom labels for each other merely because both runner registrations share the Hermes host.
- Do not move routine validation back to hosted runners merely for convenience.
- S10 mobile runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed complete Mobile CI #2217 / run `31631890545`.
- Backend S10 must retain exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI evidence before merge-ready status.

## Remaining roadmap / authorization gates

Current approved source work is the bounded Stories S10-A through S10-E package. Outside it, there is **no separate autonomous source-refactor phase**. Remaining work is:

1. **Finish S10 source/CI:** close any demonstrated contract/CI defects in backend PR #229 and mobile PR #643, synchronize canonical documentation, and require exact-head validation before merge-ready status.
2. **Stories environment/runtime/release evidence:** physical/native/provider/deployment/release evidence remains authorization-gated. Actual push delivery remains a separate future provider/native contract.
3. **Physical/release/operational evidence:** standalone/device, Android/system-navigation, second-device/offline-restart, backend deployment/provider and production evidence only when explicitly authorized.
4. **LG-H3 Steps:** blocked until a reviewed real native health/activity provider, dependency and permission/disclosure contract exists, followed by separately authorized physical runtime evidence. Do not infer steps from workouts.
5. **LG-H4 feed retention/ranking:** later. Preserve chronological Following semantics until a separate ranking contract is reviewed.
6. **Coach product/material expansion:** deferred until explicit reprioritization. Bounded regressions on existing live Coach surfaces remain valid QA fixes but do not reopen the product phase.
7. **Future regressions/expansion:** fix demonstrated bounded defects or explicitly prioritize/review a new product package; do not infer authorization from candidate inventory.

## Durable documentation / architecture rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. The active architecture decision remains the existing AsyncStorage-backed local-state strategy unless measured evidence explicitly reopens it. **No separate autonomous source-refactor phase is currently authorized.**

## Safety / activation boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.