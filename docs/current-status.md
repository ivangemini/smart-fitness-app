# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Baseline `main` for the active package: `0fa4c0be06247bbbf60359488f67520b4cf0704f` (PR #504 — LG-2A roadmap sync).
- Active branch: `ui/home-social-first-hybrid`.
- Stale overlapping PR #502 was closed unmerged because it was based on pre-#503 `main` and conflicted with the newly approved Home direction.
- Backend baseline inspected at package start: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend has no open PR and is out of scope for this mobile package.

Exact code/tests/current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance, and secondary-surface theme work are established and must not be regressed.

Liquid Glass foundation:

- PR #501 established adaptive Liquid Glass tokens, reusable surfaces, shared buttons, and adaptive floating navigation; exact-head Mobile CI #1922 passed.
- PR #503 completed the first Home Liquid Glass pilot; exact head `e93bbbdfe27b3c6858c3e17402d138751e98e9e5` passed Mobile CI #1925 and merged as `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`.
- PR #504 synchronized the focused Liquid Glass roadmap.

## Active product direction — LG-H1 social-first Home

The approved Home hierarchy is now:

1. header/profile action;
2. compact expandable personal daily metrics;
3. Stories only after real Social contracts exist;
4. the existing server-authoritative Following Feed.

Current LG-H1 branch work:

- replaces the old large Home Summary / Quick Actions / Weekly Snapshot hierarchy with one expandable Liquid Glass daily metrics owner;
- shows current calorie and macro totals/targets, real program workout/rest-day context, current weight, recovery, streak, and workout/nutrition/weight actions;
- reserves Steps but does not fabricate a value because no reviewed step provider exists;
- extracts the existing Following Feed loading/cache/pagination state into a reusable hook and uses the same hook from both Home and the standalone Social feed route;
- renders existing immutable workout-post cards directly in Home;
- preserves pull-to-refresh, bounded first-page cache, cursor pagination, authentication states, block/private-profile enforcement, moderation boundaries, and server authority;
- keeps Social outside private `AppState` revisioned synchronization;
- does not implement fake Stories or add a second feed store/API.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social privacy/authority roadmap: `docs/roadmap/social-network.md`.

## Current validation gate

Before merge, the exact final LG-H1 head must pass the full Mobile CI gate:

- repository file line audit;
- changed-file line limit;
- TypeScript;
- full regression suite and source-contract tests;
- expanded sync/model smoke;
- Expo export;
- Expo Doctor.

The package also requires an unresolved review-thread check before exact-head merge.

## Planned follow-up after LG-H1

- LG-H2: Stories contracts and rail. Requires explicit server DTO/expiry/privacy/media/moderation/view-state contracts before UI activation.
- LG-H3: real steps/activity source. Do not infer or demo steps; native health permissions/dependencies and physical runtime evidence remain approval-gated.
- LG-H4: workout-native feed retention refinement after the base Home feed is stable.
- Then resume remaining primary-tab Liquid Glass migration (Progress/Coach, Nutrition, Profile) and later Workouts.

## Release / provider boundary

Source/CI validation is not physical-device or release proof. Do not perform or claim:

- OTA/EAS publication;
- native build/install;
- production/provider activation;
- backend deployment/migrations;
- credentials/DNS changes;
- store submission;
- HealthKit/Health Connect permission activation;

without explicit authorization.
