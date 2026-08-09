# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `4e2df0f2c44137bc1ccc7b9860aaaa29d10dbf21`.
- Latest runtime merge: `4e2df0f2c44137bc1ccc7b9860aaaa29d10dbf21` (PR #507 — first LG-2B Progress batch).
- PR #507 exact validated head: `ab06b04624e64108258aba713214d83db480a9fc`; Mobile CI #1937 passed the full required gate.
- Previous LG-H1 runtime merge: `9c9e67a929d10e9f91475c92ba0b579bbadbb805` (PR #505); exact green head `9f28c198ed75070bcf10484ef09a28a78cbc5571`, Mobile CI #1931.
- Backend baseline inspected for dependency awareness: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance, and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 established adaptive Liquid Glass tokens, reusable surfaces, shared buttons, and adaptive floating navigation; Mobile CI #1922 passed.
- PR #503 completed the initial Home Liquid Glass pilot; Mobile CI #1925 passed and merge is `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`.
- PR #505 completed LG-H1 social-first Home; Mobile CI #1931 passed and merge is `9c9e67a929d10e9f91475c92ba0b579bbadbb805`.
- PR #507 completed the first bounded LG-2B Progress batch; Mobile CI #1937 passed and merge is `4e2df0f2c44137bc1ccc7b9860aaaa29d10dbf21`.

## Current Home product architecture

The approved live Home hierarchy remains:

1. header/profile action;
2. compact expandable personal daily metrics;
3. Stories only after real Social contracts exist;
4. existing server-authoritative Following Feed.

LG-H2 Stories remains gated on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains gated on a reviewed native health/activity source, permissions, dependencies, and later physical runtime evidence. Neither should be faked to unblock UI work.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## Active LG-2B package

Coach primary already uses shared `AppCard` and `AppButton` primitives, so no artificial Coach runtime diff is required.

The first bounded Progress batch is now complete and merged. It delivered:

- the 7D/30D/90D weight-range selector on `LiquidGlassSurface` plus adaptive glass selection/pressed tokens;
- body-measurement metric/unit choices and text inputs on adaptive glass control tokens;
- the shared Progress trend-chart shell on `LiquidGlassSurface` without per-chart native blur;
- a source-contract regression guard covering these migrated surfaces and the already-compliant Coach primary screen.

Progress analytics, navigation, persistence, localization, accessibility roles/states, chart data, and Coach domain behavior remained unchanged.

LG-2B itself is still active. Remaining direct Progress material debt is concentrated in nested Safety/Recovery filters and detail/summary surfaces that still use local material recipes.

## Validation state

PR #507 exact head `ab06b04624e64108258aba713214d83db480a9fc` passed Mobile CI #1937:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Planned follow-up

- Continue LG-2B with one coherent Safety/Recovery material migration package.
- **LG-2C:** Nutrition primary surfaces after LG-2B is complete.
- **LG-2D:** Profile primary surfaces.
- **LG-H2:** Stories only after reviewed server contracts exist.
- **LG-H3:** real steps/activity only after separately approved native dependency/permission work.
- **LG-H4:** workout-native feed retention refinement after the base Home feed is stable.
- Workouts Liquid Glass migration follows its dedicated staged order later.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
