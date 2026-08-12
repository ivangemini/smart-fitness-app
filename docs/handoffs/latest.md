# Latest Handoff

Updated: 2026-08-12

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest mobile runtime/source merge: PR #641 `feat(stories): add S9-F interaction notifications`, merge `a5da4b85ac42f9560faa5fd0516fef2244e9c7a7`.
- PR #641 exact validated head `28f9c1c0f3019efc73f3a78d7aa801469a3fe96e` passed complete Mobile CI #2207 / run `31598972282` before merge.
- Earlier S9-E mobile PR #636 remains merged as `98dcd668c91533b5dafb0f443f70b24c02824a8a` after exact-head Mobile CI #2203 / run `31591283734`.
- PR #617 remains a bounded post-LG-5 Workouts persistence regression fix; LG-5 merged demonstrated-defect runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Backend S9-F authority is merged from PR #228 as `e23fd62c31c3067c96898138efa2bbf60f2b1d0a`.
- PR #228 exact validated head `cec2e772672ac073fc606a3358e79c85d0117109` passed Backend CI #1635 / run `31607002861`, Backend PostgreSQL CI #242 / run `31607002889`, and Account Deletion Receipt CI #324 / run `31607002829` before merge.
- Backend S9-E authority remains merged from PR #226 as `677231145d4fc87b8f2e9f2cc6e3d2ab96b76dab`.
- Backend routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` on `hermes-backend-ci-01`; mobile keeps its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration.
- Backend issue #217 is closed. Backend PR #222 active-training-program authority remains merged.
- **Home active-program selection is source/CI-complete across backend and mobile; issue #618 is closed as completed.**
- **LG-H2 Stories / S9 is source/CI-complete through S9-F. S9-A through S9-F are merged and exact-head validated.**
- **LG-4 Workouts source convergence and LG-5 validation-first source/CI QA are complete for the currently authorized scope.**
- **There is no remaining approved autonomous source-refactor or Stories product-source phase after S9-F.**
- Coach product/material expansion remains deferred.

Exact Git history, source and tests override stale handoff prose.

## Home active-program handoff

The reviewed contract in `docs/architecture/home-active-program-contract.md` is source/CI-complete.

Backend:

- `fitness_profiles.active_training_program_id` is a nullable owner-private UUID;
- `null` means product-default mode;
- no training-program FK is used, preserving offline/out-of-order sync and stale-reference repair;
- repository/sync paths persist and materialize the selector;
- omitted legacy payload fields normalize to `null`;
- PostgreSQL tests verify nullable/no-FK behavior;
- owner data export excludes the raw selector UUID.

Mobile:

- `ProfileState.activeTrainingProgramId` is `string | null`;
- custom selections use the existing canonical training-program sync UUID mapping, including local legacy `program-*` IDs;
- profile metadata persistence and push/pull sync carry the selector;
- Program Detail exposes explicit `Set as active` / `Use default program` actions without showing raw UUIDs;
- deleting the selected custom program clears the selector in the same mutation;
- sync pull repairs stale selectors after training-program/profile application;
- Home resolves schedule authority deterministically from the selector and no longer uses favorite, recency, array order or `getWorkoutPrograms(workouts)[0]`.

Not established by this completion: backend deployment/migration execution, second-device runtime evidence, native/device release evidence or production activation.

## CI handoff

- Backend PR #228 exact-head validation: Backend CI #1635 / run `31607002861`, PostgreSQL CI #242 / run `31607002889`, Account Deletion Receipt CI #324 / run `31607002829` — all success on `cec2e772672ac073fc606a3358e79c85d0117109` before merge `e23fd62c31c3067c96898138efa2bbf60f2b1d0a`.
- Mobile PR #641 exact-head validation: Mobile CI #2207 / run `31598972282` — complete success on `28f9c1c0f3019efc73f3a78d7aa801469a3fe96e` before merge `a5da4b85ac42f9560faa5fd0516fef2244e9c7a7`.
- Backend runner: repo-scoped `hermes-backend-ci-01`, label `[self-hosted, linux, x64, hermes-backend-ci]`.
- Mobile runner: separate repo-scoped registration using `[self-hosted, linux, x64, hermes-mobile-ci]`.
- Do not substitute these custom labels for one another or move routine validation back to hosted runners for convenience.
- Preserve exact-head validation, path filters, `cancel-in-progress`, merge-push deduplication and complete gates.

## Stories handoff

The image-only v1 source surface and separately reviewed S9-A through S9-F source slices are complete across their documented backend/mobile boundaries.

- **Image-only v1:** server authority/privacy/expiry/viewed state plus mobile Home strip/viewer, managed-image authoring, bounded preprocessing, signed upload and restart-safe recovery.
- **S9-A direct camera:** source/CI-complete still-photo acquisition through the same `story_image` pipeline; native/device evidence gated.
- **S9-B captions:** source/CI-complete strict caption persistence/moderation/export/mobile integration; deployed migration/provider/runtime evidence gated.
- **S9-C bounded overlay:** source/CI-complete bounded overlay authority/rendering; deployed migration/provider/runtime evidence gated.
- **S9-D private Story Like:** source/CI-complete dedicated private Like authority and privacy-separated mobile interaction surfaces.
- **S9-E bounded Story Reactions:** source/CI-complete across backend and mobile. The fixed reaction set remains `love | fire | strong | clap`, one reaction per non-owner viewer, owner-only aggregate counts, no reactor identity surface, no ranking/analytics coupling and no private `AppState` sync.
- **S9-F bounded interaction notifications:** source/CI-complete across backend and mobile. Existing in-app Social notifications support `story_like` and `story_reaction`; backend creates/removes them transactionally with Like/Reaction state, suppresses self events, dedupes and clears Story-targeted events on Story delete/expiry. Mobile understands strict Story targets, routes to `/social/story/[storyId]`, keeps existing pagination/read-state/auth-refresh behavior and accepts legacy notification DTOs with a missing `storyId` by normalizing it to `null`. No push/APNs/FCM provider was added.

**Remaining autonomous source packages inside the approved Stories/S9 boundary after S9-F: 0.**

### S9-F rollout rule

The backend notification DTO now has a `storyId` field. The merged mobile parser is backward-compatible with the older payload where the field is absent, so any later authorized rollout should put the compatible mobile client in place before activating the backend response extension. No rollout, production migration or deployment happened during source completion.

Physical-device/standalone evidence, deployed storage/CDN/moderation/provider/migration evidence and broad release/privacy/legal/accessibility evidence are authorization-gated. Richer future product expansion requires explicit prioritization and a reviewed contract.

## LG-5 closure

LG-5 remains closed at **38 demonstrated-defect runtime batches**. The final four packages remain:

- #610 New Routine arbitrary-exercise virtualization — batch 35;
- #611 Program Workout Editor arbitrary draft-exercise virtualization — batch 36;
- #614 Safety Gate narrow-width/localized-copy/accessibility hardening — batch 37;
- #613 Program Editor/Picker interaction-material convergence — batch 38.

PR #612 was intentionally not merged because the program-day collections are bounded by the seven-day `WeekdayKey` model. PR #617 is a later bounded persistence regression fix, not a new LG-5 package.

## Next work

There is no broad or numbered follow-on source-refactor/Stories product-source phase to start autonomously after S9-F.

1. Keep the reviewed Stories source scope closed through S9-F. Collect physical-device/provider/release evidence only when separately authorized; begin another Stories expansion only after explicit product/privacy/media prioritization and contract review.
2. Collect physical-device/native/release/deployment/provider/second-device evidence only when separately authorized.
3. Keep LG-H3 Steps blocked until a reviewed real native health/activity source, dependency and permission/disclosure contract exists and physical runtime work is authorized.
4. Preserve chronological Following semantics; LG-H4 ranking/retention remains later.
5. Keep Coach product/material expansion deferred until explicit reprioritization.
6. Future source work is limited to newly demonstrated bounded regressions or explicitly prioritized/reviewed product work.

## Contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history read-only semantics, private persistence/sync schemas, exercise repository/provider behavior, Social/Stories server authority/privacy, Coach API/auth contracts, active-program owner authority, or backend ownership/revision/idempotency contracts as incidental follow-up.

Potentially long collections retain one suitable virtualized boundary with stable identity. Keyboard forms retain active-input/primary-action reachability. Direct interaction feedback changes material state rather than relying on generic opacity. Safe-area ownership remains singular per edge.

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve the explicit authorization marker: **no separate autonomous source-refactor phase is currently authorized**.

Do not perform authorization-gated OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS, native-health or store actions unless explicitly requested.
