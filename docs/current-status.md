# Smart Fitness Current Status

Updated: 2026-08-11

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current repository `main`: `5fdd144a67ee4706015fed5f939cfa299b49b46a` (docs-only PR #615).
- Current runtime checkpoint: `a8b2c4530cbdc944e7a3821cdc7926296fb78f18` (merge PR #613).
- Latest runtime merge: PR #613 — Program Workout Picker and workout-builder direct interactions now use adaptive Liquid Glass control/accent/destructive/disabled material states instead of generic opacity-only feedback; picker/exercise virtualization, stable IDs, keyboard/safe-area behavior and create/edit/attach flows remain preserved.
- PR #613 exact validated head: `fae10aa93a1d26279eabe9d56eaf1efeb7103974`; Mobile CI #2170 run `31476083264` passed repository/changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor before merge.
- PR #614 merged immediately before it at `d0f44018ea457a4acc2d33bc69fb608621b3fbe5`; exact head `ca2a9277cac376b52d6332798ce3cf6ebadadd11`; Mobile CI #2167 run `31474957650` was fully green.
- PR #610 and #611 remain the preceding runtime virtualization batches: New Routine and Program Workout Editor respectively; both exact-head Mobile CI runs passed before merge.
- Merged demonstrated-defect LG-5 runtime batches now total **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 was refreshed onto that exact main without changing its four-file CI-policy scope. Current exact head: `f5c7f2d4cd1d150f5894fcc60725e85f05631d22`. Its three required exact-head workflows are queued, but the `Backend CI` job `93730465556` requests `[self-hosted, linux, x64, hermes-mobile-ci]` while GitHub reports `runner_id: 0` and an empty runner name. The PR therefore remains draft/not merge-ready until runner registration/access infrastructure is resolved and all three gates actually execute and pass.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 validation-first source/CI QA is complete for the currently authorized source scope.**
- **There is no remaining approved autonomous source-refactor phase.**
- Coach product/material expansion remains deferred.

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## LG-5 closure evidence

The first 34 demonstrated-defect runtime batches run through PR #607 and remain authoritative in Git history and earlier checkpoints. The final four source packages are:

35. **PR #610 — New Routine virtualization.** The arbitrary exercise collection uses the intended virtualized owner and stable identity.
36. **PR #611 — Program Workout Editor virtualization.** Arbitrary draft exercise rows use the intended virtualized owner while preserving editor behavior.
37. **PR #614 — Safety Gate responsive/accessibility hardening.** Narrow EN/RU metric cells share width safely; Recovery Check-in and Limitations actions expose button semantics and shrinkable labels without changing Safety & Recovery decision logic.
38. **PR #613 — Program Editor interaction-material convergence.** Picker choices/rows, builder exercise actions and collapsible header use adaptive control/accent/destructive/disabled material states; focused guards prevent opacity-only regression.

PR #612 is **not** a runtime batch. Its proposed Program Detail/Builder virtualization was rejected after confirming those program-day collections are semantically bounded by the seven-day `WeekdayKey` domain; its branch was reset instead of merging a speculative refactor.

## Final LG-5 no-change evidence

The post-#611 audit also rechecked the remaining live Workouts boundaries against the current responsive, material, localization, accessibility, stable-identity, safe-area and virtualization contracts.

- Program Detail/Builder program-day rows are bounded by the seven-day model; no virtualization rewrite is justified.
- Workout History list/detail already owns appropriate `FlatList` boundaries, stable IDs, read-only completed-history semantics and responsive metric layout.
- Workout Template Detail already owns the intended exercise virtualization and stable IDs.
- Existing guards cover Workouts Hub, Program Detail, creation/editor stack, picker responsiveness, Exercise Library, History Detail, Template Detail, active-session header/footer/overflow/finish/RPE/replacement flows and list virtualization.
- `QuickActionsCard` label-as-key remains non-actionable unless live usage is established; do not refactor candidate/legacy code speculatively.
- Home/Profile/Coach/Nutrition/Settings controls previously audited remain no-change evidence unless a new reproduced defect appears.

A future concrete regression can still receive a bounded fix. Completion here means there is no remaining **pre-authorized** source package to manufacture solely to continue changing code.

## CI execution

- PR #562 routes authoritative routine Mobile CI to `[self-hosted, linux, x64, hermes-mobile-ci]` while preserving the complete gate.
- PR #563 skips only duplicate merge-generated post-merge validation after an already exact-head validated PR.
- PR #564 persists that mobile policy in `AGENTS.md`.
- Backend PR #216 persists the backend counterpart policy.
- Backend PR #215 is blocked at runner assignment rather than at a test failure: its current exact-head jobs have not been assigned a runner. Do not weaken the runner policy to clear the queue; resolve runner registration/access first, then require all three exact-head gates to execute and pass.

## Remaining roadmap / authorization gates

There is **no separate autonomous source-refactor phase currently authorized**. Remaining work is deliberately gated or deferred:

1. Physical-device, standalone/native-release, Android/system-navigation, second-device/offline-restart, deployment/provider and production evidence only when explicitly authorized. Source/CI evidence does not substitute for these checks.
2. **LG-H3 Steps:** blocked until a reviewed native health/activity provider, dependency and permission contract exists, followed by separately authorized physical runtime evidence. Do not infer steps from workouts.
3. **LG-H4 feed retention/ranking:** later. Preserve chronological Following semantics until a separate ranking contract is reviewed.
4. **Coach product/material expansion:** deferred until explicit reprioritization. Bounded regressions on existing live Coach surfaces remain valid QA fixes but do not reopen the product phase.
5. **Backend CI infrastructure #215:** blocked on Hermes runner registration/access for the backend repository; after that is resolved, its three exact-head checks must run and pass before merge.

## Durable documentation / architecture rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. The architecture decision remains the existing AsyncStorage-backed local-state strategy unless measured evidence explicitly reopens it. In equivalent explicit terms, **no separate autonomous source-refactor phase is currently authorized**.

## Safety / activation boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
