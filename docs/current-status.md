# Smart Fitness Current Status

Updated: 2026-08-12

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current repository/runtime `main`: `a7d82e6e928d608eff46efa81846db0461480aeb` after PR #630 `feat(home): honor explicit active training program`.
- PR #630 exact validated head: `07c33bb82033b73c3a71d0eba64aca4afaeb44d9`; Mobile CI #2198 run `31567594528` passed repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor before merge.
- PR #617 remains a bounded post-LG-5 Program Builder persistence regression fix and is not LG-5 runtime batch #39.
- Merged demonstrated-defect LG-5 runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `e199c6e537264b16976e489a03d754ee72c6f4a0` after PR #222 active training-program fitness-profile authority.
- PR #222 exact validated head: `fd50fd853660abe428074895be7fb5a72cadbc97`; Backend CI #1607 run `31544793201`, Backend PostgreSQL CI #214 run `31544793131`, and Account Deletion Receipt CI #296 run `31544793103` all passed before merge.
- Backend PR #215 remains CI infrastructure only. It has been refreshed directly onto current backend `main`; exact head is `f4bde3851435fe0eb270b614db95c75b7653cd95`, ahead by four commits and behind by zero, with exactly four CI-policy files changed. The refreshed PostgreSQL workflow preserves `tests/fitness-profile-active-training-program-postgres.test.ts`. All three required workflows are queued for `[self-hosted, linux, x64, hermes-mobile-ci]` with no assigned runner (`runner_id` / `runner_name` null), so runner registration/access remains the known infrastructure dependency. The PR remains draft/not merge-ready.
- **Home active-program selection is source/CI-complete across backend and mobile.** The reviewed contract uses one owner-private fitness-profile selector, `null` for the product default, explicit `Set as active` / `Use default program` actions, canonical UUID sync identity, stale/deleted-reference repair, and deterministic Home schedule resolution. Issue #618 is closed as completed.
- **LG-H2 Stories is source/CI-complete through the reviewed S9-D private Story Like contract, not for every future Stories product capability or release/runtime layer.** See `docs/roadmap/stories.md`.
- **Stories S9-A direct camera, S9-B captions, S9-C bounded overlay and S9-D private Like are source/CI-complete.** No further Stories expansion is currently contract-approved for autonomous source work.
- **LG-4 Workouts source convergence is complete.**
- **LG-5 validation-first source/CI QA is complete for the currently authorized source scope.**
- **There is no remaining approved autonomous source-refactor or product-source package.**
- Coach product/material expansion remains deferred.

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Home active-program result

The contract in `docs/architecture/home-active-program-contract.md` is implemented across both repositories.

Backend authority now provides:

- nullable owner-private `fitness_profiles.active_training_program_id` UUID state;
- no training-program foreign key, preserving offline/out-of-order sync semantics;
- fitness-profile repository and sync parsing/materialization support;
- legacy payload omission compatibility as default-program mode;
- PostgreSQL evidence for nullable/no-FK behavior;
- privacy-export evidence that the raw linkage UUID is not exposed in owner data export.

Mobile now provides:

- `ProfileState.activeTrainingProgramId: string | null`, with `null` as product-default mode;
- canonical selector identity via the existing training-program sync UUID mapping, including legacy local `program-*` IDs;
- fitness-profile metadata persistence and push/pull sync support;
- explicit Program Detail `Set as active` / `Use default program` actions without displaying raw UUIDs;
- immediate selector clearing when the active custom program is deleted;
- post-pull stale-reference repair so Home falls back immediately and a later normal profile sync can propagate `null` to backend;
- deterministic Home resolution from the selector rather than favorite, recency, array order or `getWorkoutPrograms(workouts)[0]`.

The source/CI completion statement does not claim backend deployment/migration execution, second-device runtime evidence or production activation; those remain separately authorization-gated.

## Stories source/CI result

The focused audit in `docs/roadmap/stories.md` is authoritative for Stories scope and release terminology.

### Image-only v1 authority

Backend authority includes:

- authenticated/idempotent create;
- 24-hour server expiry and active-only reads;
- cursor pagination and individual reads;
- self/Following/private/block/restriction enforcement;
- viewed-state acknowledgement;
- owner-only delete and account-deletion cleanup;
- managed `story_image` ownership and existing moderation/delivery authority.

Mobile includes:

- strict Story contracts/API integration and bounded account-scoped cache;
- Home Story strip and viewer with progress/advance/view acknowledgement;
- media-library selection through `expo-image-picker`;
- bounded image resize/re-encode before upload;
- shared signed upload/finalize/polling composition;
- account-scoped restart-safe media draft recovery;
- publish only after approved managed media;
- authoritative refresh after create/delete and owner delete in the viewer.

**Remaining autonomous source packages inside that image-only v1 contract: 0.**

### Reviewed post-v1 Stories slices

- **S9-A direct camera:** source/CI-complete still-photo acquisition through the same `story_image` pipeline; native/device evidence remains gated.
- **S9-B captions:** source/CI-complete backend persistence, separate strict caption subresource, moderation/export authority and mobile authoring/viewer integration; deployed migration/provider/runtime evidence remains gated.
- **S9-C one bounded overlay:** source/CI-complete separate strict overlay authority, moderation/export integration, bounded authoring/viewer UI and composition-sensitive publish idempotency; deployed migration/provider/runtime evidence remains gated.
- **S9-D private Story Like:** source/CI-complete dedicated persistence/API/lifecycle/privacy authority and mobile privacy-separated viewer/owner interaction surfaces. Backend PR #221 exact head `c508be7b39063dbefe88868701fe3516c94e4d17` passed Backend CI #1596, PostgreSQL CI #203 and Account Deletion Receipt CI #285 before merge `2c2d46c255f8a0a47256d0f24bdb20608e859696`. Mobile PR #626 exact head `f1c91e70f1adf99a32d331356a1d61f27cd926d0` passed Mobile CI #2193 before merge `708d5b48eff2807f33ef89fa57ad9fde6200d3de`.

### Not established by source completion

- physical-device/standalone camera/picker, upload interruption/restart, expiry, privacy and second-device evidence;
- deployed storage/CDN/moderation/provider/migration evidence, including merged Story migrations and the newer fitness-profile active-program migration;
- broad release/privacy/legal/accessibility/runtime evidence.

These remain authorization-gated.

### Deferred product expansion

Richer composition, replies/DMs/emoji reaction sets/liker lists/notifications, per-Story audience controls, video, archive/highlights, owner viewer surfaces, advanced media and Story analytics/ranking remain explicit product-expansion inventory only. They require separate prioritization and reviewed contracts before source implementation.

## LG-5 closure evidence

The first 34 demonstrated-defect runtime batches run through PR #607 and remain authoritative in Git history and earlier checkpoints. The final four source packages are:

35. **PR #610 — New Routine virtualization.** The arbitrary exercise collection uses the intended virtualized owner and stable identity.
36. **PR #611 — Program Workout Editor virtualization.** Arbitrary draft exercise rows use the intended virtualized owner while preserving editor behavior.
37. **PR #614 — Safety Gate responsive/accessibility hardening.** Narrow EN/RU metric cells share width safely; Recovery Check-in and Limitations actions expose button semantics and shrinkable labels without changing Safety & Recovery decision logic.
38. **PR #613 — Program Editor interaction-material convergence.** Picker choices/rows, builder exercise actions and collapsible header use adaptive control/accent/destructive/disabled material states; focused guards prevent opacity-only regression.

PR #612 is **not** a runtime batch. Its proposed Program Detail/Builder virtualization was rejected after confirming those program-day collections are semantically bounded by the seven-day `WeekdayKey` domain.

PR #617 is also not an LG-5 batch. It is a later demonstrated persistence regression fix.

## Final LG-5 no-change evidence

The post-#611 audit rechecked remaining live Workouts boundaries against responsive, material, localization, accessibility, stable-identity, safe-area and virtualization contracts.

- Program Detail/Builder program-day rows are bounded by the seven-day model; no virtualization rewrite is justified.
- Workout History list/detail already owns appropriate `FlatList` boundaries, stable IDs, read-only completed-history semantics and responsive metric layout.
- Workout Template Detail already owns the intended exercise virtualization and stable IDs.
- Existing guards cover Workouts Hub, Program Detail, creation/editor stack, picker responsiveness, Exercise Library, History Detail, Template Detail, active-session header/footer/overflow/finish/RPE/replacement flows and list virtualization.
- `QuickActionsCard` label-as-key remains non-actionable unless live usage is established; do not refactor candidate/legacy code speculatively.
- Home/Profile/Coach/Nutrition/Settings controls previously audited remain no-change evidence unless a new reproduced defect appears.

A future concrete regression can still receive a bounded fix. Completion means there is no remaining **pre-authorized** source package to manufacture solely to continue changing code.

## CI execution

- PR #562 routes authoritative routine Mobile CI to `[self-hosted, linux, x64, hermes-mobile-ci]` while preserving the complete gate.
- PR #563 skips only duplicate merge-generated post-merge validation after an already exact-head validated PR.
- PR #564 persists that mobile policy in `AGENTS.md`.
- Backend PR #216 persists the backend counterpart policy.
- Backend PR #215 is refreshed on current backend `main` `e199c6e537264b16976e489a03d754ee72c6f4a0` with exact head `f4bde3851435fe0eb270b614db95c75b7653cd95`. Backend CI #1609, PostgreSQL CI #216 and Account Deletion Receipt CI #298 are queued without an assigned Hermes runner. This is an infrastructure-access blocker, not permission to weaken the runner policy or merge without exact-head execution.

## Remaining roadmap / authorization gates

There is **no separate autonomous source-refactor or product-source phase currently authorized**. Remaining work is deliberately gated or deferred:

1. **Backend CI infrastructure #215:** resolve backend Hermes runner registration/access; then require Backend CI #1609, Backend PostgreSQL CI #216 and Account Deletion Receipt CI #298 (or newer exact-head replacements) to actually execute and pass before merge.
2. **Stories:** image-only v1 plus reviewed S9-A through S9-D are source/CI-complete. Physical/native/provider/deployment/release evidence is gated; further product expansion requires explicit prioritization. See `docs/roadmap/stories.md`.
3. Physical-device, standalone/native-release, Android/system-navigation, second-device/offline-restart, deployment/provider and production evidence only when explicitly authorized. Source/CI evidence does not substitute for these checks.
4. **LG-H3 Steps:** blocked until a reviewed native health/activity provider, dependency and permission contract exists, followed by separately authorized physical runtime evidence. Do not infer steps from workouts.
5. **LG-H4 feed retention/ranking:** later. Preserve chronological Following semantics until a separate ranking contract is reviewed.
6. **Coach product/material expansion:** deferred until explicit reprioritization. Bounded regressions on existing live Coach surfaces remain valid QA fixes but do not reopen the product phase.
7. **Future regressions:** fix only demonstrated bounded defects; they do not constitute a new autonomous migration/refactor phase.

## Durable documentation / architecture rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. The architecture decision remains the existing AsyncStorage-backed local-state strategy unless measured evidence explicitly reopens it. In equivalent explicit terms, **no separate autonomous source-refactor phase is currently authorized**.

## Safety / activation boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.