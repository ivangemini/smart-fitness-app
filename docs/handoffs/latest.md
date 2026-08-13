# Latest Handoff

Updated: 2026-08-12

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest merged mobile Stories baseline remains S9-F PR #641, merge `a5da4b85ac42f9560faa5fd0516fef2244e9c7a7`.
- Active S10 mobile PR #643 implements the explicitly prioritized S10-A through S10-E source package. Runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed complete Mobile CI #2217 / run `31631890545` before later documentation-only synchronization.
- PR #617 remains a bounded post-LG-5 Workouts persistence regression fix; LG-5 merged demonstrated-defect runtime batches remain **38**.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Latest merged backend Stories baseline remains S9-F PR #228, merge `e23fd62c31c3067c96898138efa2bbf60f2b1d0a`.
- Active backend S10 PR #229 implements server-authoritative S10-A through S10-E. Current source head at this handoff is `fb68a88844fe895588a477cefa971e5fae8328ac`; do not call it merge-ready until exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI all pass.
- Backend routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` on `hermes-backend-ci-01`; mobile keeps its separate `[self-hosted, linux, x64, hermes-mobile-ci]` registration.
- Backend issue #217 is closed. Backend PR #222 active-training-program authority remains merged.
- **Home active-program selection is source/CI-complete across backend and mobile; issue #618 is closed as completed.**
- **Stories S9-A through S9-F remain merged/source-CI complete. S10-A through S10-E are the current explicitly authorized Stories product-source package.**
- **LG-4 Workouts source convergence and LG-5 validation-first source/CI QA are complete for their scopes.**
- **There is no separate autonomous source-refactor phase.**
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

- Mobile S10 runtime/source validation: Mobile CI #2217 / run `31631890545` — success on `692dea96e692fdecdb9db87341c5758cdf2fed01`, including line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.
- Backend S10 current source head: `fb68a88844fe895588a477cefa971e5fae8328ac`; exact-head Backend CI/PostgreSQL/Account Deletion Receipt evidence must all be green before merge-ready status.
- Backend runner: repo-scoped `hermes-backend-ci-01`, label `[self-hosted, linux, x64, hermes-backend-ci]`.
- Mobile runner: separate repo-scoped registration using `[self-hosted, linux, x64, hermes-mobile-ci]`.
- Do not substitute these custom labels for one another or move routine validation back to hosted runners for convenience.
- Preserve exact-head validation, path filters, `cancel-in-progress`, merge-push deduplication and complete gates.
- Documentation-only synchronization may be verified by ancestry/diff when Markdown path filters intentionally skip runtime CI; do not pretend a docs-only head is a newly executed runtime gate.

## Stories handoff

The merged image-only v1 and reviewed S9-A through S9-F baseline remains complete. The active expansion is the explicitly prioritized S10-A through S10-E contract in `docs/architecture/stories-s10-contract.md`.

### Merged baseline

- **Image-only v1:** server authority/privacy/expiry/viewed state plus mobile Home strip/viewer, managed-image authoring, bounded preprocessing, signed upload and restart-safe recovery.
- **S9-A direct camera:** source/CI-complete still-photo acquisition through the same `story_image` pipeline; native/device evidence gated.
- **S9-B captions:** source/CI-complete strict caption persistence/moderation/export/mobile integration; deployed migration/provider/runtime evidence gated.
- **S9-C bounded overlay:** source/CI-complete bounded overlay authority/rendering; deployed migration/provider/runtime evidence gated.
- **S9-D private Story Like:** source/CI-complete dedicated private Like authority and privacy-separated mobile interaction surfaces.
- **S9-E bounded Story Reactions:** source/CI-complete across backend and mobile; fixed `love | fire | strong | clap`, one non-owner reaction, owner aggregates only, no reactor identity/ranking/AppState coupling.
- **S9-F bounded in-app interaction notifications:** source/CI-complete across backend and mobile; no external push provider.

### Active S10 package

- **S10-A viewer list:** owner-only identities from authoritative Story views. Do not expose liker/reactor identities as part of this surface.
- **S10-B Close Friends/audience:** exact audience `following | close_friends`; member must follow owner; membership is database-constrained to the follow edge, removed directionally on unfollow and both ways on block; re-follow does not resurrect membership; replay returns persisted membership metadata.
- **S10-C replies:** private moderated 1–1,000 character non-owner replies to readable active Stories. Backend is idempotent and mobile preserves one retry identity for the same normalized `storyId + body` until confirmed success. No DMs/threading.
- **S10-D push preference:** request state only. `deliveryProviderAvailable=false` and `effectiveEnabled=false`; no APNs/FCM/native/provider activation.
- **S10-E Archive/Highlights:** expired owned Stories may retain approved managed media in owner Archive; ephemeral active interactions are cleared; Highlights remain owner-managed and do not make expired Stories active again.

### S10 rollout rule

The S10 backend accepts the old create payload because omitted audience defaults to `following`; the S10 mobile client can send the new strict audience field that the pre-S10 backend rejects. Any later authorized runtime rollout must therefore be **backend S10 first → mobile S10 second**.

This is source compatibility guidance only. No backend deployment, production migration, OTA/EAS publication, native build/install, provider activation or production rollout has been authorized or executed by this handoff.

## LG-5 closure

LG-5 remains closed at **38 demonstrated-defect runtime batches**. The final four packages remain:

- #610 New Routine arbitrary-exercise virtualization — batch 35;
- #611 Program Workout Editor arbitrary draft-exercise virtualization — batch 36;
- #614 Safety Gate narrow-width/localized-copy/accessibility hardening — batch 37;
- #613 Program Editor/Picker interaction-material convergence — batch 38.

PR #612 was intentionally not merged because the program-day collections are bounded by the seven-day `WeekdayKey` model. PR #617 is a later bounded persistence regression fix, not a new LG-5 package.

## Next work

1. Finish backend S10 exact-head CI and fix only demonstrated failures; do not broaden the contract.
2. Keep mobile PR #643 aligned with the reviewed S10 backend contract; source CI is green on `692dea96e692fdecdb9db87341c5758cdf2fed01`.
3. Synchronize remaining canonical docs/privacy inventory as needed and verify docs-only ancestry/diffs.
4. Move PR #229 and PR #643 to merge-ready only after their source/CI and documentation boundaries are coherent.
5. Do not deploy migrations, backend runtime, APNs/FCM/provider configuration, OTA/EAS/native builds or production changes without direct authorization.
6. Keep LG-H3 Steps blocked until a reviewed real native health/activity source, dependency and permission/disclosure contract exists and physical runtime work is authorized.
7. Preserve chronological Following semantics; LG-H4 ranking/retention remains later.
8. Keep Coach product/material expansion deferred until explicit reprioritization.
9. Future Stories product work outside S10 requires another explicit product/privacy contract; candidate inventory is not implicit authorization.

## Contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history read-only semantics, private persistence/sync schemas, exercise repository/provider behavior, Social/Stories server authority/privacy, Coach API/auth contracts, active-program owner authority, or backend ownership/revision/idempotency contracts as incidental follow-up.

Potentially long collections retain one suitable virtualized boundary with stable identity. Keyboard forms retain active-input/primary-action reachability. Direct interaction feedback changes material state rather than relying on generic opacity. Safe-area ownership remains singular per edge.

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve the explicit authorization marker: **no separate autonomous source-refactor phase is currently authorized**.

Do not perform authorization-gated OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credential/DNS, native-health or store actions unless explicitly requested.