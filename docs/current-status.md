# Smart Fitness Current Status

Updated: 2026-08-09

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `ad17cc9d8be896cf9610027a63018c07119b5b01`.
- Latest runtime merge: PR #535 — managed Story authoring lifecycle.
- PR #535 exact validated head: `8045e96c07cb2f1fac6113b56d0061cb1547f4ee`; Mobile CI #1990 passed the full required gate.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current Stories backend baseline: merge `2339f6ce…` from backend PR #214; exact validated head `9a5af3aba1f4470f261eb9ea00a6e2f2f8979bfe`.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- Active product/source priority: **reassess remaining Progress/exercise secondary material before LG-4 Workouts material convergence**.
- **Coach material remains deferred by explicit product priority.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Liquid Glass / Home status

Completed milestones through LG-3I remain unchanged. PRs #533 and #535 complete the current LG-H2 server-backed Stories consumption and owner-authoring lifecycle.

Home is now a social-first hybrid:

1. compact personal daily metrics;
2. server-authoritative Stories with an always-available owner authoring entry;
3. existing server-authoritative Following Feed.

### Stories backend — complete for v1 source scope

Backend PR #214 established:

- strict versioned image-only Story contracts;
- 24-hour server-authoritative expiry;
- authenticated/idempotent creation;
- owner deletion and account-deletion cascade;
- Following/self visibility, private-profile, block and moderation restriction enforcement;
- reuse of the existing managed-media moderation/delivery/cleanup pipeline via `story_image`;
- idempotent viewed state;
- bounded pagination/order;
- retention cleanup to `retention_expired`;
- privacy/data inventory and complete Social export coverage;
- PostgreSQL lifecycle/privacy/export evidence in CI.

No backend deployment or production migration was performed.

### Stories mobile read/view — complete

Mobile PR #533 added:

- strict Story DTO/parser/error contracts and authenticated API client;
- bounded account-scoped short-lived Story cache with immediate server revalidation;
- separate `useSocialStories` state so Following feed ownership remains unchanged;
- horizontal Home Story strip between daily metrics and Following;
- backend order and server `viewed` state;
- safe-area, content-driven Story viewer;
- idempotent viewed-state acknowledgement;
- localized loading/error/retry copy;
- regression guards for strict parsing, cache expiry/account isolation, Home ordering and Liquid Glass/safe-area ownership.

The CI investigation exposed one stale source guard in `tests/homeSocialFirst.source.test.ts` that still prohibited the word `Story` from the pre-contract era. It was updated to require real `useSocialStories`/server state while continuing to reject fabricated steps and mock/demo Stories. Temporary diagnostic CI changes were fully removed before merge.

### Stories mobile authoring/delete — complete

Mobile PR #535 added:

- `story_image` support to the existing strict managed-media contracts, parser and API;
- reuse of the existing image-selection/preparation, signed upload, finalize and polling pipeline instead of a second uploader;
- account-scoped restart-safe draft state for unfinished unbound Story media;
- pending ImagePicker-result recovery after Android activity destruction;
- bounded upload/processing/review/approved/rejected/failed/deleted owner states;
- exact approval gate: Story create is possible only for an owned approved `story_image` and uses its current `stateVersion`;
- deterministic asset-scoped create idempotency;
- authoritative Home Story revalidation after create/delete rather than fabricated local server objects;
- owner delete action in the Story viewer after resolving the current server Social profile;
- `Your story` / Add entry on Home even when there are zero current Stories;
- localized authoring/status/error/delete copy and safe-area/content-driven layout;
- strict parser/state/source regression tests.

Story v1 remains intentionally image-only: no arbitrary URL, caption, text overlay, video or client-authored expiry.

## Validation state

PR #535 exact head `8045e96c07cb2f1fac6113b56d0061cb1547f4ee` passed Mobile CI #1990:

- repository and changed-file line audits;
- TypeScript;
- full regression suite: **1560/1560 tests passed**;
- expanded model smoke;
- Expo export;
- Expo Doctor.

No review submissions or inline review threads blocked merge. PR #535 merged as `ad17cc9d8be896cf9610027a63018c07119b5b01`.

Validation also revealed a docs-only regression from PR #534: two local-state decision markers required by `tests/local-state-storage-decision.test.ts` had been removed while Markdown-only workflow filters skipped Mobile CI. PR #535 restored the canonical link and guard phrase without weakening the test.

Source/CI validation is not physical-device or release proof.

## Next roadmap work

- Reassess remaining Progress/exercise secondary material against the current Liquid Glass and responsive-mobile architecture and select the next bounded runtime package from actual code/evidence.
- Then continue with LG-4 Workouts material convergence.
- LG-5 bounded elevated chrome/motion and LG-6 visual QA/stabilization follow later.
- LG-H3 Steps remains blocked on a reviewed native health/activity capability and permissions. Do not infer steps from workouts.
- LG-H4 feed retention/ranking remains later; preserve chronological Following semantics.
- Coach material remains intentionally deferred.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, backend deployment or migration execution, production/provider activation, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
