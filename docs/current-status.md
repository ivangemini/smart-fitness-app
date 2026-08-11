# Smart Fitness Current Status

Updated: 2026-08-11

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current repository/runtime `main`: `b354fb58f8b1759cca0e2dfd4cb68d48ad5b26b4`.
- Latest runtime merge: PR #617 — Program Builder now resolves persisted `trainingPrograms` and saves through `saveTrainingProgram` rather than the module-local compatibility store.
- PR #617 exact validated head: `4773f60339d70f4ee40163ecc92a492547c9ccc7`; Mobile CI #2179 run `31491962947` passed repository/changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor before merge.
- PR #617 is a bounded post-LG-5 regression fix and is not LG-5 runtime batch #39.
- Merged demonstrated-defect LG-5 runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains CI infrastructure only at exact head `f5c7f2d4cd1d150f5894fcc60725e85f05631d22`; its three required exact-head workflows must execute and pass before merge. Runner registration/access remains the known infrastructure dependency.
- **LG-H2 Stories is source-complete for the approved image-only v1 contract, not for every future Stories product capability.** See `docs/roadmap/stories.md`.
- **LG-4 Workouts source convergence is complete.**
- **LG-5 validation-first source/CI QA is complete for the currently authorized source scope.**
- **There is no remaining approved autonomous source-refactor phase.**
- Coach product/material expansion remains deferred.
- Home active-program semantics remain a separate product/state decision tracked by issue #618; no recency/favorite heuristic is authorized by the existing contract.

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Stories audit result

The focused audit in `docs/roadmap/stories.md` resolves the prior ambiguous “Stories complete” wording.

### Source-complete inside approved image-only v1

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

**Remaining autonomous source packages inside that approved image-only v1 contract: 0.**

### Not established by source completion

- physical-device/standalone picker, upload interruption/restart, expiry, privacy and second-device evidence;
- deployed storage/CDN/moderation/provider/migration evidence;
- broad release/privacy/legal/accessibility/runtime evidence.

These remain authorization-gated.

### Not part of the approved v1 contract

Richer authoring, Story-specific interactions, per-Story audience controls, video, archive/highlights, owner viewer surfaces, advanced media and Story analytics/ranking are explicit product-expansion inventory only. They require separate prioritization and reviewed contracts before source implementation.

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
- Backend PR #215 remains blocked on backend runner registration/access rather than permission to weaken the runner policy. After assignment is resolved, all three exact-head checks must execute and pass.

## Remaining roadmap / authorization gates

There is **no separate autonomous source-refactor phase currently authorized**. Remaining work is deliberately gated, deferred or contract-dependent:

1. **Backend CI infrastructure #215:** resolve backend Hermes runner registration/access; then require all exact-head gates to execute and pass before merge.
2. **Stories:** approved image-only v1 has 0 remaining autonomous source packages. Runtime/provider/release evidence is gated; product expansion requires explicit prioritization. See `docs/roadmap/stories.md`.
3. Physical-device, standalone/native-release, Android/system-navigation, second-device/offline-restart, deployment/provider and production evidence only when explicitly authorized. Source/CI evidence does not substitute for these checks.
4. **LG-H3 Steps:** blocked until a reviewed native health/activity provider, dependency and permission contract exists, followed by separately authorized physical runtime evidence. Do not infer steps from workouts.
5. **LG-H4 feed retention/ranking:** later. Preserve chronological Following semantics until a separate ranking contract is reviewed.
6. **Coach product/material expansion:** deferred until explicit reprioritization. Bounded regressions on existing live Coach surfaces remain valid QA fixes but do not reopen the product phase.
7. **Home active-program contract #618:** unresolved product/state semantics; do not guess the active program from recency/favorite/order.

## Durable documentation / architecture rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. The architecture decision remains the existing AsyncStorage-backed local-state strategy unless measured evidence explicitly reopens it. In equivalent explicit terms, **no separate autonomous source-refactor phase is currently authorized**.

## Safety / activation boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
