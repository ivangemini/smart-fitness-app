# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime merge: `9c9e67a929d10e9f91475c92ba0b579bbadbb805` (PR #505 — LG-H1 social-first Home).
- PR #505 exact validated head: `9f28c198ed75070bcf10484ef09a28a78cbc5571`; Mobile CI #1931 passed the full required gate.
- Stale overlapping PR #502 was closed unmerged and must not be revived.
- Backend baseline last inspected for this package: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remained out of scope.
- No Liquid Glass runtime package is currently active.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance, and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 established adaptive Liquid Glass tokens, reusable surfaces, shared buttons, and adaptive floating navigation; Mobile CI #1922 passed.
- PR #503 completed the initial Home Liquid Glass pilot; Mobile CI #1925 passed and merge is `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`.
- PR #505 completed LG-H1 social-first Home; Mobile CI #1931 passed and merge is `9c9e67a929d10e9f91475c92ba0b579bbadbb805`.

## Current Home product architecture

The approved live Home hierarchy is:

1. header/profile action;
2. compact expandable personal daily metrics;
3. Stories only after real Social contracts exist;
4. existing server-authoritative Following Feed.

LG-H1 now delivers:

- one expandable Liquid Glass daily metrics owner instead of the old large Summary / Quick Actions / Weekly Snapshot stack;
- calorie and P/F/C totals/targets;
- real active/program-scheduled/rest/next-workout context from existing workout state;
- expanded weight, recovery, streak, workout, Add Food, and Log Weight actions;
- Steps slot with unavailable state rather than fabricated data;
- existing chronological Following Feed directly on Home;
- one reusable feed hook shared by Home and the standalone Social feed route;
- existing pull refresh, bounded first-page account cache, cursor pagination, auth/error/empty states, block/private-profile enforcement, moderation boundaries, and server authority;
- Social remains separate from private revisioned `AppState` synchronization;
- no fake Stories and no second Social feed store/API.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## Validation record

PR #505 first reached TypeScript/line-audit success but exposed four stale source-contract tests asserting the superseded Home/screen-local feed structure. Those guards were updated without reverting runtime behavior.

Exact head `9f28c198ed75070bcf10484ef09a28a78cbc5571` then passed:

- repository file line audit;
- changed-file line limit;
- TypeScript;
- full regression suite;
- expanded sync/model smoke;
- Expo export;
- Expo Doctor.

There were no unresolved review threads before merge. The merge-triggered EAS Update workflow was skipped; no OTA publication occurred.

## Planned follow-up

- **LG-H2:** Stories contracts and rail. Requires reviewed server DTO/expiry/privacy/media/moderation/view-state contracts before UI activation.
- **LG-H3:** real steps/activity source. Do not infer/demo steps; native health permissions/dependencies and physical runtime evidence remain approval-gated.
- **LG-H4:** workout-native feed retention refinement after the base Home feed is stable.
- Then resume remaining primary-tab Liquid Glass migration: Progress/Coach, Nutrition, Profile, and later Workouts.

## Release / provider boundary

Source/CI validation is not physical-device or release proof. Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
