# Latest Handoff

Updated: 2026-08-12

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current repository/runtime `main`: `a7d82e6e928d608eff46efa81846db0461480aeb` after PR #630 `feat(home): honor explicit active training program`.
- PR #630 exact validated head: `07c33bb82033b73c3a71d0eba64aca4afaeb44d9`; Mobile CI #2198 run `31567594528` passed the complete mobile gate before merge.
- PR #617 remains a bounded post-LG-5 Workouts persistence regression fix; LG-5 merged demonstrated-defect runtime batches remain **38**.
- Backend `main`: `e199c6e537264b16976e489a03d754ee72c6f4a0` after PR #222 active training-program fitness-profile authority.
- PR #222 exact validated head: `fd50fd853660abe428074895be7fb5a72cadbc97`; Backend CI #1607, PostgreSQL CI #214 and Account Deletion Receipt CI #296 all passed before merge.
- Backend PR #215 remains CI infrastructure. It has been rebuilt directly on current backend `main`; exact head `f4bde3851435fe0eb270b614db95c75b7653cd95` is ahead by four commits and behind by zero with exactly four CI-policy files changed. The refreshed PostgreSQL workflow preserves the #222 active-program contract test. Backend CI #1609, PostgreSQL CI #216 and Account Deletion Receipt CI #298 are queued for `[self-hosted, linux, x64, hermes-mobile-ci]`, but GitHub reports no assigned runner (`runner_id` / `runner_name` null). Runner registration/access therefore remains the known blocker and PR #215 remains draft/not merge-ready.
- **Home active-program selection is source/CI-complete across backend and mobile; issue #618 is closed as completed.**
- LG-H2 Stories is **source/CI-complete through the reviewed S9-D private Story Like contract**, not for deferred future product expansion or gated physical/deployed/release evidence. `docs/roadmap/stories.md` is authoritative for this boundary.
- LG-4 Workouts source convergence remains complete.
- **LG-5 validation-first source/CI QA is complete for the currently authorized source scope.**
- **There is no remaining approved autonomous source-refactor or product-source phase.**
- Coach product/material expansion remains deferred.

## Home active-program handoff

The reviewed contract in `docs/architecture/home-active-program-contract.md` is now implemented end-to-end at source/CI level.

Backend:

- `fitness_profiles.active_training_program_id` is a nullable UUID and owner-private fitness-profile authority;
- no FK is used, so out-of-order/offline sync does not require a training-program row to exist first;
- repository and fitness-profile sync paths persist/materialize the selector;
- omitted legacy payload fields normalize to `null`;
- PostgreSQL tests verify nullable/no-FK behavior;
- owner data export continues to exclude the raw selector UUID.

Mobile:

- `ProfileState.activeTrainingProgramId` is `string | null`; `null` means the built-in default program;
- custom selections use the existing canonical training-program sync UUID mapping, including local legacy `program-*` IDs;
- profile metadata persistence and push/pull sync carry the selector;
- Program Detail exposes explicit `Set as active` for custom programs and `Use default program` for the product default without displaying the UUID;
- deleting the selected custom program clears the selector in the same state mutation;
- sync pull repairs stale selectors after training-program/profile application, immediately restoring default mode while leaving metadata divergence for a later normal profile-sync repair;
- Home now resolves schedule authority deterministically from the selector and no longer uses `getWorkoutPrograms(workouts)[0]`, favorite, recency or array order.

Not established by this completion: backend deployment/migration execution, second-device runtime evidence, native/device release evidence or production activation. Those remain authorization-gated.

## Stories handoff

The image-only v1 source surface and the separately reviewed S9-A through S9-D source slices are complete across their documented backend/mobile boundaries.

### Image-only v1

Backend authority provides:

- authenticated/idempotent create;
- 24-hour expiry and active-only reads;
- cursor list/get/viewed-state endpoints;
- self/Following/private/block/restriction enforcement;
- owner deletion/account cleanup/rate limits;
- managed-media `story_image` authority.

Mobile provides:

- strict Story contracts/API/parsers;
- bounded account-scoped server-revalidated cache;
- Home Story strip and viewer with progress/advance/view acknowledgement;
- media-library image selection;
- bounded resize/JPEG preprocessing;
- signed upload/finalize/polling through the shared managed-media composition;
- account-scoped restart-safe media draft recovery;
- approved-media-only publication;
- authoritative create/delete refresh and owner delete.

**Remaining autonomous source packages inside the already approved image-only v1 contract: 0.**

### Completed reviewed expansions

- **S9-A direct camera:** one still-photo capture path reusing the same `story_image` upload/moderation/publication pipeline; source/CI-complete, native/device evidence gated.
- **S9-B captions:** separate strict caption persistence/read surface, text moderation/export authority and bounded mobile authoring/viewer UI; source/CI-complete, migration/provider/runtime evidence gated.
- **S9-C bounded overlay:** one optional 1–280 character top/center/bottom overlay, separate strict subresource, moderation/export authority, composition-sensitive publish idempotency and bounded mobile rendering; source/CI-complete, migration/provider/runtime evidence gated.
- **S9-D private Story Like:** dedicated `social_story_likes` authority with idempotent Like/Unlike, owner-only aggregate, lifecycle/block/account cleanup, privacy-safe requester export and no liker list/notifications; mobile uses separate strict viewer-state/owner-summary contracts and privacy-separated UI. Backend PR #221 exact head `c508be7b39063dbefe88868701fe3516c94e4d17` passed Backend CI #1596, PostgreSQL CI #203 and Account Deletion Receipt CI #285 before merge `2c2d46c255f8a0a47256d0f24bdb20608e859696`. Mobile PR #626 exact head `f1c91e70f1adf99a32d331356a1d61f27cd926d0` passed Mobile CI #2193 before merge `708d5b48eff2807f33ef89fa57ad9fde6200d3de`.

Not complete by those source/CI statements:

1. physical-device/standalone runtime evidence;
2. deployed storage/CDN/moderation/provider/migration evidence;
3. broad release/privacy/legal/accessibility evidence;
4. future product expansion such as richer composition, Story replies/DMs/emoji sets/liker lists/notifications, audience controls, video, archive/highlights, viewer surfaces or advanced media/analytics.

Items 1–3 are authorization-gated. Item 4 is deferred candidate inventory until explicitly prioritized and reviewed.

## Final LG-5 runtime sequence

- #607 Workouts Exercise Library active-theme/material convergence — batch 34.
- #610 New Routine arbitrary-exercise virtualization — batch 35; exact head `2fc3a0aba57648d7940cd928b441eefd0b6c531a`, Mobile CI #2161 run `31473376632`, merge `ec380756151464872304690c0a571a90650a8ef9`.
- #611 Program Workout Editor arbitrary draft-exercise virtualization — batch 36; exact head `9dbc7b89fa4a69f719427af76d1749c2d46d2def`, Mobile CI #2162 run `31473525715`, merge `2ca233420b209401279b6ced832e3c7364967cf0`.
- #614 Safety Gate narrow-width/localized-copy/accessibility hardening — batch 37; exact head `ca2a9277cac376b52d6332798ce3cf6ebadadd11`, Mobile CI #2167 run `31474957650`, merge `d0f44018ea457a4acc2d33bc69fb608621b3fbe5`.
- #613 Program Editor/Picker interaction-material convergence — batch 38; exact head `fae10aa93a1d26279eabe9d56eaf1efeb7103974`, Mobile CI #2170 run `31476083264`, merge `a8b2c4530cbdc944e7a3821cdc7926296fb78f18`.

PR #612 was intentionally rejected/reset after confirming Program Detail/Builder program-day collections are bounded by the seven-day `WeekdayKey` model. PR #617 is later regression repair and not a new LG-5 package.

## Next work

There is no broad or numbered follow-on source-refactor/product-source phase to start autonomously.

1. Resolve backend #215 Hermes runner registration/access outside the source PR. The source branch is refreshed on backend `main` `e199c6e537264b16976e489a03d754ee72c6f4a0` and preserves the active-program PostgreSQL gate. Once a runner is assigned, require all three exact-head workflows to execute and pass before ready/merge. Do not route routine validation back to hosted runners just to bypass the blocker.
2. Keep Stories source scope closed at the completed reviewed S9-A through S9-D boundary. Collect physical-device/provider/release evidence only when separately authorized; start another Stories expansion candidate only after explicit product/privacy/media prioritization.
3. Collect other physical-device/native/release/deployment/provider evidence only when separately authorized.
4. Keep LG-H3 Steps blocked until a reviewed native health/activity source, dependency and permissions contract exists and physical runtime work is authorized.
5. Preserve chronological Following semantics; LG-H4 ranking/retention remains later.
6. Keep Coach product/material expansion deferred until explicit reprioritization.
7. Future source work is limited to newly demonstrated bounded regressions or explicitly prioritized/reviewed product work.

## Contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history read-only semantics, private persistence/sync schemas, exercise repository/provider behavior, Social/Stories server authority/privacy, Coach API/auth contracts, active-program owner authority, or backend ownership/revision/idempotency contracts as incidental follow-up.

Potentially long collections retain one suitable virtualized boundary with stable identity. Keyboard forms retain active-input/primary-action reachability. Direct interaction feedback changes material state rather than relying on generic opacity. Safe-area ownership remains singular per edge.

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve the explicit authorization marker: **no separate autonomous source-refactor phase is currently authorized**.

Do not perform authorization-gated OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS, native-health or store actions unless explicitly requested.