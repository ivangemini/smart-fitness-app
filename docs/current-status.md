# Smart Fitness Current Status

Updated: 2026-08-12

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current mobile runtime/source merge: `a7d82e6e928d608eff46efa81846db0461480aeb` after PR #630 `feat(home): honor explicit active training program`.
- Current mobile repository docs baseline before this synchronization: `9c5f867a252b60fdc6cb2d798b6ec7d459f2fcd3` after docs PR #631.
- PR #630 exact validated head: `07c33bb82033b73c3a71d0eba64aca4afaeb44d9`; Mobile CI #2198 run `31567594528` passed repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor before merge.
- PR #617 remains a bounded post-LG-5 Program Builder persistence regression fix and is not LG-5 runtime batch #39. Merged demonstrated-defect LG-5 runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `8c404de0e0007ab23f44d62616b114aff7db5d12` after docs PR #223 synchronized the Hermes CI completion checkpoint.
- Latest backend runtime/CI merge: PR #215 `Route routine backend CI to Hermes`, merge `dd3764a751f76a2ed2fa8566c5b839c442329b3a`.
- PR #215 exact validated head: `2718ca74ad2b2131573e4c7c655be31149af5695`; Backend CI #1614 run `31571974048`, Backend PostgreSQL CI #221 run `31571974074`, and Account Deletion Receipt CI #303 run `31571974080` all passed before merge.
- Backend routine CI now correctly uses the existing repo-scoped `hermes-backend-ci-01` through `[self-hosted, linux, x64, hermes-backend-ci]`. Mobile routine CI keeps its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration.
- Backend issue #217 is closed: the former blocker was an incorrect mobile-only label on backend workflows, not missing runner registration.
- Backend PR #222 active-training-program fitness-profile authority remains merged as `e199c6e537264b16976e489a03d754ee72c6f4a0`; its permanent PostgreSQL contract test was preserved and revalidated by PR #215.
- **Home active-program selection is source/CI-complete across backend and mobile.** Issue #618 is closed as completed.
- **LG-H2 Stories is source/CI-complete through the reviewed S9-D private Story Like contract.** This does not include gated physical/deployed/provider/release evidence or deferred future product expansion.
- **LG-4 Workouts source convergence is complete.**
- **LG-5 validation-first source/CI QA is complete for the currently authorized source scope.**
- **There is no remaining approved autonomous source-refactor or product-source package.**
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

`docs/roadmap/stories.md` remains authoritative for Stories terminology and expansion scope.

### Completed source scope

- Image-only v1: authenticated/idempotent server Story authority, 24-hour expiry, active-only reads, cursor/viewed-state handling, Following/privacy/block/restriction enforcement, managed `story_image` authority, mobile Home strip/viewer, media-library selection, bounded preprocessing, signed upload/finalize/polling, restart-safe draft recovery and owner delete.
- **S9-A direct camera:** source/CI-complete still-photo acquisition through the existing `story_image` pipeline; native/device evidence remains gated.
- **S9-B captions:** source/CI-complete strict caption persistence/moderation/export/mobile authoring/viewer integration; deployed migration/provider/runtime evidence remains gated.
- **S9-C bounded overlay:** source/CI-complete separate bounded overlay authority and rendering; deployed migration/provider/runtime evidence remains gated.
- **S9-D private Story Like:** source/CI-complete dedicated persistence/API/lifecycle/privacy authority and mobile privacy-separated interaction surfaces.

**Remaining autonomous source packages inside the already approved Stories boundary: 0.**

### Not established by source completion

- physical-device/standalone camera/picker, upload interruption/restart, expiry, privacy and second-device evidence;
- deployed storage/CDN/moderation/provider/migration evidence;
- broad release/privacy/legal/accessibility/runtime evidence;
- richer composition, replies/DMs/emoji sets/liker lists/notifications, audience controls, video, archive/highlights, advanced media and Story analytics/ranking.

The first three groups are authorization-gated. Future product expansion requires explicit prioritization and a reviewed contract.

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
- Backend PR #215 is merged and exact-head validated; there is no remaining runner-registration blocker.
- Do not substitute the mobile/backend custom labels for each other merely because both runner registrations share the Hermes host.
- Do not move routine validation back to hosted runners merely for convenience.

## Remaining roadmap / authorization gates

There is **no separate autonomous source-refactor or product-source phase currently authorized**. Remaining work is deliberately gated or deferred:

1. **Stories evidence/expansion boundary:** physical/native/provider/deployment/release evidence remains authorization-gated; further product expansion requires explicit prioritization and a reviewed contract.
2. **Physical/release/operational evidence:** standalone/device, Android/system-navigation, second-device/offline-restart, backend deployment/provider and production evidence only when explicitly authorized.
3. **LG-H3 Steps:** blocked until a reviewed real native health/activity provider, dependency and permission/disclosure contract exists, followed by separately authorized physical runtime evidence. Do not infer steps from workouts.
4. **LG-H4 feed retention/ranking:** later. Preserve chronological Following semantics until a separate ranking contract is reviewed.
5. **Coach product/material expansion:** deferred until explicit reprioritization. Bounded regressions on existing live Coach surfaces remain valid QA fixes but do not reopen the product phase.
6. **Future regressions:** fix only demonstrated bounded defects; they do not constitute a new autonomous migration/refactor phase.

## Durable documentation / architecture rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. The active architecture decision remains the existing AsyncStorage-backed local-state strategy unless measured evidence explicitly reopens it. **No separate autonomous source-refactor phase is currently authorized.**

## Safety / activation boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
