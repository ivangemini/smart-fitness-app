# Latest Handoff

Updated: 2026-08-12

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current mobile `main` before S9-E implementation: `9f3051f15480f30ebba914c8594fc2297fa45d92`, from PR #634 approving the bounded Story Reactions contract.
- Mobile PR #636 implements S9-E against merged backend authority. Source head `fff30c0c6475edd1f9cfb57f05d20770c9193de5` passed Mobile CI #2200 / run `31589897124`: repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. The final documentation head must still pass exact-head Mobile CI before merge.
- PR #617 remains a bounded post-LG-5 Workouts persistence regression fix; LG-5 merged demonstrated-defect runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Backend S9-E authority is merged from PR #226 as `677231145d4fc87b8f2e9f2cc6e3d2ab96b76dab`.
- PR #226 exact validated head `89113fae25ee9c6653ad247f412450c69e05f10c` passed Backend CI #1623 / run `31584950358`, Backend PostgreSQL CI #230 / run `31584950352`, and Account Deletion Receipt CI #312 / run `31584950445` before merge.
- Backend routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` on the existing `hermes-backend-ci-01`; mobile keeps its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration.
- Backend issue #217 is closed. The prior blocker was a workflow-label mismatch, not missing runner registration.
- Backend PR #222 active-training-program authority remains merged.
- **Home active-program selection is source/CI-complete across backend and mobile; issue #618 is closed as completed.**
- **LG-H2 Stories now includes the reviewed S9-E bounded Story Reactions package.** Backend authority is merged; mobile source has passed a full source-head CI and requires final exact-head revalidation after documentation synchronization.
- **LG-4 Workouts source convergence and LG-5 validation-first source/CI QA are complete for the currently authorized scope.**
- **There is no remaining approved autonomous source-refactor or product-source phase after S9-E.**
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

- Backend PR #226 exact-head validation: Backend CI #1623, PostgreSQL CI #230, Account Deletion Receipt CI #312 — all success on `89113fae25ee9c6653ad247f412450c69e05f10c` before merge `677231145d4fc87b8f2e9f2cc6e3d2ab96b76dab`.
- Mobile PR #636 source head `fff30c0c6475edd1f9cfb57f05d20770c9193de5` passed complete Mobile CI #2200 / run `31589897124`.
- The final PR #636 documentation head must pass the same complete exact-head Mobile CI before merge.
- Backend runner: repo-scoped `hermes-backend-ci-01`, label `[self-hosted, linux, x64, hermes-backend-ci]`.
- Mobile runner: separate repo-scoped registration using `[self-hosted, linux, x64, hermes-mobile-ci]`.
- Do not substitute these custom labels for one another or move routine validation back to hosted runners for convenience.
- Preserve exact-head validation, path filters, `cancel-in-progress`, merge-push deduplication and complete gates.

## Stories handoff

The image-only v1 source surface and separately reviewed S9-A through S9-E source slices are complete or in final validation across their documented backend/mobile boundaries.

- **Image-only v1:** server authority/privacy/expiry/viewed state plus mobile Home strip/viewer, managed-image authoring, bounded preprocessing, signed upload and restart-safe recovery.
- **S9-A direct camera:** source/CI-complete still-photo acquisition through the same `story_image` pipeline; native/device evidence gated.
- **S9-B captions:** source/CI-complete strict caption persistence/moderation/export/mobile integration; deployed migration/provider/runtime evidence gated.
- **S9-C bounded overlay:** source/CI-complete bounded overlay authority/rendering; deployed migration/provider/runtime evidence gated.
- **S9-D private Story Like:** source/CI-complete dedicated private Like authority and privacy-separated mobile interaction surfaces.
- **S9-E bounded Story Reactions:** backend source/CI-complete and merged. Mobile provides strict separate reaction contracts/parsers/API, bounded `love | fire | strong | clap` viewer choices, repeated-tap clear, owner-only aggregate counts, accessible non-color-only selected state, EN/RU copy and regression/privacy coverage. The base Story DTO, S9-D Like, notifications, ranking, analytics and private `AppState` sync remain unchanged. PR #636 still requires final exact-head Mobile CI after docs sync before merge.

**Remaining autonomous source packages inside the approved Stories boundary after S9-E: 0.**

Physical-device/standalone evidence, deployed storage/CDN/moderation/provider/migration evidence and broad release/privacy/legal/accessibility evidence are authorization-gated. Richer future product expansion requires explicit prioritization and a reviewed contract.

## LG-5 closure

LG-5 remains closed at **38 demonstrated-defect runtime batches**. The final four packages remain:

- #610 New Routine arbitrary-exercise virtualization — batch 35;
- #611 Program Workout Editor arbitrary draft-exercise virtualization — batch 36;
- #614 Safety Gate narrow-width/localized-copy/accessibility hardening — batch 37;
- #613 Program Editor/Picker interaction-material convergence — batch 38.

PR #612 was intentionally not merged because the program-day collections are bounded by the seven-day `WeekdayKey` model. PR #617 is a later bounded persistence regression fix, not a new LG-5 package.

## Next work

There is no broad or numbered follow-on source-refactor/product-source phase to start autonomously after S9-E.

1. Finish PR #636 only after its final exact-head Mobile CI passes, then treat S9-E source scope as closed.
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
