# Latest Handoff

Updated: 2026-08-12

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current mobile runtime/source merge: `a7d82e6e928d608eff46efa81846db0461480aeb` after PR #630 `feat(home): honor explicit active training program`.
- Current mobile docs baseline before this synchronization: `9c5f867a252b60fdc6cb2d798b6ec7d459f2fcd3` after docs PR #631.
- PR #630 exact validated head: `07c33bb82033b73c3a71d0eba64aca4afaeb44d9`; Mobile CI #2198 run `31567594528` passed the complete mobile gate before merge.
- PR #617 remains a bounded post-LG-5 Workouts persistence regression fix; LG-5 merged demonstrated-defect runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `8c404de0e0007ab23f44d62616b114aff7db5d12` after docs PR #223.
- Latest backend runtime/CI merge: PR #215 `Route routine backend CI to Hermes`, merge `dd3764a751f76a2ed2fa8566c5b839c442329b3a`.
- PR #215 exact validated head: `2718ca74ad2b2131573e4c7c655be31149af5695`; Backend CI #1614 / run `31571974048`, Backend PostgreSQL CI #221 / run `31571974074`, and Account Deletion Receipt CI #303 / run `31571974080` all passed before merge.
- Backend routine CI now uses `[self-hosted, linux, x64, hermes-backend-ci]` on the existing `hermes-backend-ci-01`; mobile keeps its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration.
- Backend issue #217 is closed. The prior blocker was a workflow-label mismatch, not missing runner registration.
- Backend PR #222 active-training-program authority remains merged and its permanent PostgreSQL test was preserved/revalidated by #215.
- **Home active-program selection is source/CI-complete across backend and mobile; issue #618 is closed as completed.**
- **LG-H2 Stories is source/CI-complete through the reviewed S9-D private Story Like contract.**
- **LG-4 Workouts source convergence and LG-5 validation-first source/CI QA are complete for the currently authorized scope.**
- **There is no remaining approved autonomous source-refactor or product-source phase.**
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

The backend runner-routing blocker is closed.

- Backend exact-head #215 validation: Backend CI #1614, PostgreSQL CI #221, Account Deletion Receipt CI #303 — all success on `2718ca74ad2b2131573e4c7c655be31149af5695`.
- Backend runner: repo-scoped `hermes-backend-ci-01`, label `[self-hosted, linux, x64, hermes-backend-ci]`.
- Mobile runner: separate repo-scoped registration using `[self-hosted, linux, x64, hermes-mobile-ci]`.
- Do not substitute these custom labels for one another or move routine validation back to hosted runners for convenience.
- Preserve exact-head validation, path filters, `cancel-in-progress`, merge-push deduplication and complete gates.

## Stories handoff

The image-only v1 source surface and separately reviewed S9-A through S9-D source slices remain complete across their documented backend/mobile boundaries.

- **Image-only v1:** server authority/privacy/expiry/viewed state plus mobile Home strip/viewer, managed-image authoring, bounded preprocessing, signed upload and restart-safe recovery.
- **S9-A direct camera:** source/CI-complete still-photo acquisition through the same `story_image` pipeline; native/device evidence gated.
- **S9-B captions:** source/CI-complete strict caption persistence/moderation/export/mobile integration; deployed migration/provider/runtime evidence gated.
- **S9-C bounded overlay:** source/CI-complete bounded overlay authority/rendering; deployed migration/provider/runtime evidence gated.
- **S9-D private Story Like:** source/CI-complete dedicated private Like authority and privacy-separated mobile interaction surfaces.

**Remaining autonomous source packages inside the approved Stories boundary: 0.**

Physical-device/standalone evidence, deployed storage/CDN/moderation/provider/migration evidence and broad release/privacy/legal/accessibility evidence are authorization-gated. Richer future product expansion requires explicit prioritization and a reviewed contract.

## LG-5 closure

LG-5 remains closed at **38 demonstrated-defect runtime batches**. The final four packages remain:

- #610 New Routine arbitrary-exercise virtualization — batch 35;
- #611 Program Workout Editor arbitrary draft-exercise virtualization — batch 36;
- #614 Safety Gate narrow-width/localized-copy/accessibility hardening — batch 37;
- #613 Program Editor/Picker interaction-material convergence — batch 38.

PR #612 was intentionally not merged because the program-day collections are bounded by the seven-day `WeekdayKey` model. PR #617 is a later bounded persistence regression fix, not a new LG-5 package.

## Next work

There is no broad or numbered follow-on source-refactor/product-source phase to start autonomously.

1. Keep Stories source scope closed at the completed reviewed S9-A through S9-D boundary. Collect physical-device/provider/release evidence only when separately authorized; begin another Stories expansion only after explicit product/privacy/media prioritization and contract review.
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
