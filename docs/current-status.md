# Smart Fitness Current Status

Updated: 2026-08-12

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest mobile runtime/source merge: PR #641 `feat(stories): add S9-F interaction notifications`, merge `a5da4b85ac42f9560faa5fd0516fef2244e9c7a7`.
- PR #641 exact validated head `28f9c1c0f3019efc73f3a78d7aa801469a3fe96e` passed Mobile CI #2207 / run `31598972282`: repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor before merge.
- Earlier S9-E mobile PR #636 remains merged as `98dcd668c91533b5dafb0f443f70b24c02824a8a`; its exact validated head `af61806ee4cb7a64fbfc70c0c935dd39971d4993` passed Mobile CI #2203 / run `31591283734`.
- PR #617 remains a bounded post-LG-5 Program Builder persistence regression fix and is not LG-5 runtime batch #39. Merged demonstrated-defect LG-5 runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Backend S9-F authority is merged from PR #228 as `e23fd62c31c3067c96898138efa2bbf60f2b1d0a`.
- PR #228 exact validated head `cec2e772672ac073fc606a3358e79c85d0117109` passed Backend CI #1635 / run `31607002861`, Backend PostgreSQL CI #242 / run `31607002889`, and Account Deletion Receipt CI #324 / run `31607002829` before merge.
- Earlier backend S9-E authority remains merged from PR #226 as `677231145d4fc87b8f2e9f2cc6e3d2ab96b76dab`.
- Backend routine CI uses the repo-scoped `hermes-backend-ci-01` through `[self-hosted, linux, x64, hermes-backend-ci]`. Mobile routine CI keeps its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration.
- Backend issue #217 is closed: the former blocker was an incorrect mobile-only label on backend workflows, not missing runner registration.
- Backend PR #222 active-training-program fitness-profile authority remains merged as `e199c6e537264b16976e489a03d754ee72c6f4a0`.
- **Home active-program selection is source/CI-complete across backend and mobile.** Issue #618 is closed as completed.
- **LG-H2 Stories / S9 is source/CI-complete through S9-F bounded Story interaction notifications.** S9-A through S9-F are merged and exact-head validated. This does not imply gated physical/deployed/provider/release evidence.
- **LG-4 Workouts source convergence is complete.**
- **LG-5 validation-first source/CI QA is complete for the currently authorized source scope.**
- **There is no remaining approved autonomous source-refactor or Stories product-source package after S9-F.**
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

`docs/roadmap/stories.md` and the reviewed focused contracts remain authoritative for Stories terminology and expansion scope.

### Completed source scope

- Image-only v1: authenticated/idempotent server Story authority, 24-hour expiry, active-only reads, cursor/viewed-state handling, Following/privacy/block/restriction enforcement, managed `story_image` authority, mobile Home strip/viewer, media-library selection, bounded preprocessing, signed upload/finalize/polling, restart-safe draft recovery and owner delete.
- **S9-A direct camera:** source/CI-complete still-photo acquisition through the existing `story_image` pipeline; native/device evidence remains gated.
- **S9-B captions:** source/CI-complete strict caption persistence/moderation/export/mobile authoring/viewer integration; deployed migration/provider/runtime evidence remains gated.
- **S9-C bounded overlay:** source/CI-complete separate bounded overlay authority and rendering; deployed migration/provider/runtime evidence remains gated.
- **S9-D private Story Like:** source/CI-complete dedicated persistence/API/lifecycle/privacy authority and mobile privacy-separated interaction surfaces.
- **S9-E bounded Story Reactions:** source/CI-complete across backend and mobile. Backend owns dedicated bounded reaction authority and owner-only aggregates. Mobile provides strict `love | fire | strong | clap` contracts/parsers/API, privacy-separated viewer state versus owner aggregate, accessible four-choice UI with non-color-only selected state, repeated-tap clear, EN/RU copy and regression coverage. S9-D Like remains independent.
- **S9-F bounded interaction notifications:** source/CI-complete across backend and mobile. Existing in-app Social notifications now support `story_like` and `story_reaction` with strict Story targeting, transactional create/remove semantics, self-notification suppression, dedupe, read-state and Story lifecycle cleanup. Mobile routes taps to the existing Story viewer and preserves legacy pre-S9-F payload compatibility by normalizing a missing `storyId` to `null`. No APNs/FCM/push provider was introduced.

The base Story DTO, chronological Following ordering, Story ranking/analytics and private revisioned `AppState` sync remain unchanged.

**Remaining autonomous source packages inside the already approved Stories/S9 boundary after S9-F: 0.**

### Rollout compatibility boundary

S9-F extends the Social notification response with `storyId`. The merged mobile parser accepts both the legacy payload without `storyId` and the new payload with strict Story targets. Therefore a later authorized rollout must put a compatible mobile client in place before activating the backend response extension. This checkpoint records source compatibility only; it does not claim that any runtime rollout occurred.

### Not established by source completion

- physical-device/standalone camera/picker, upload interruption/restart, expiry, privacy and second-device evidence;
- deployed storage/CDN/moderation/provider/migration evidence, including production execution of Stories migrations through `0048_story_interaction_notifications`;
- broad release/privacy/legal/accessibility/runtime evidence;
- richer composition, replies/DMs, liker/reactor identity lists, per-Story audience controls, video, archive/highlights, advanced media and Story analytics/ranking;
- push notifications/APNs/FCM, which are not part of S9-F.

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
- Do not substitute the mobile/backend custom labels for each other merely because both runner registrations share the Hermes host.
- Do not move routine validation back to hosted runners merely for convenience.
- PR #641 was merged only after complete exact-head Mobile CI #2207 succeeded on `28f9c1c0f3019efc73f3a78d7aa801469a3fe96e`.
- Backend PR #228 was merged only after exact-head Backend CI #1635, Backend PostgreSQL CI #242 and Account Deletion Receipt CI #324 all succeeded on `cec2e772672ac073fc606a3358e79c85d0117109`.

## Remaining roadmap / authorization gates

There is **no separate autonomous source-refactor or Stories product-source phase currently authorized** after S9-F. Remaining work is deliberately gated or deferred:

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
