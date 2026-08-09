# Smart Fitness Current Status

Updated: 2026-08-09

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `89bae8d1085ffd72131142700c1d625d6fa91f40`.
- Latest runtime merge: PR #533 — server-backed Stories on Home.
- PR #533 exact validated head: `6fde319be2c932620ecec177e3c7e4b7e7e0032a`; Mobile CI #1984 passed the full required gate.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current Stories backend baseline: merge `2339f6ce…` from backend PR #214; exact validated head `9a5af3aba1f4470f261eb9ea00a6e2f2f8979bfe`.
- Active product/source priority: **LG-H2 Stories authoring lifecycle — managed `story_image` upload → approval → create → owner delete**.
- **Coach material remains deferred by explicit product priority.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Liquid Glass / Home status

Completed milestones through LG-3I remain unchanged. PR #533 additionally completes the first real LG-H2 mobile consumption package.

Home is now a social-first hybrid:

1. compact personal daily metrics;
2. server-authoritative Stories;
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

## Active LG-H2 remainder — Story authoring

Next coherent mobile package:

- extend managed-media mobile contracts/parsers to `story_image` rather than adding another upload path;
- create signed `story_image` uploads with the existing object-storage upload client;
- expose upload/quarantine/processing/review/approved/rejected/failed states;
- call Story creation only from an owned **approved** asset and its exact `stateVersion`;
- refresh Home Stories after successful creation;
- support owner deletion through the merged server endpoint;
- keep arbitrary image URLs, caption/text overlay and a second media pipeline out of v1;
- keep all new UI safe-area/responsive/localized and use shared material primitives.

## Steps / later work

- LG-H3 Steps remains blocked on a reviewed native health/activity capability and permissions. Do not infer steps from workouts.
- LG-H4 feed retention/ranking remains later; preserve chronological Following semantics.
- Coach material remains intentionally deferred.
- Remaining Progress/exercise secondary material can be reassessed after Stories is stable.

## Validation state

PR #533 exact head `6fde319be2c932620ecec177e3c7e4b7e7e0032a` passed Mobile CI #1984:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, backend deployment or migration execution, production/provider activation, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
