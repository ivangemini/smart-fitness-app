# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main` baseline for this package: `8fe97589d652a48ad45b295c2e460a145439b5c5`.
- Current runtime merge: `9c9e67a929d10e9f91475c92ba0b579bbadbb805` (PR #505 — LG-H1 social-first Home).
- PR #505 exact validated head: `9f28c198ed75070bcf10484ef09a28a78cbc5571`; Mobile CI #1931 passed the full required gate.
- Stale overlapping PR #502 was closed unmerged and must not be revived.
- Backend baseline inspected for this package: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active source package: **LG-2B Progress + Coach primary surfaces**, branch `ui/lg2b-progress-coach-primary`.

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

LG-H1 delivers one expandable daily-metrics owner, calorie/macros, real workout/program context, weight/recovery/streak actions, unavailable Steps instead of fabricated data, and the existing chronological Following Feed directly on Home. Social remains server-authoritative and separate from private revisioned `AppState` synchronization.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## Active LG-2B package

The next autonomously executable Liquid Glass package is Progress + Coach because:

- LG-H2 Stories remains gated on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts;
- LG-H3 Steps remains gated on a reviewed native health/activity source, permissions, dependencies, and later physical runtime evidence;
- Coach primary already uses shared `AppCard` and `AppButton` primitives, so no artificial runtime diff is needed there.

Current bounded Progress batch migrates:

- the 7D/30D/90D weight-range selector to `LiquidGlassSurface` plus adaptive glass selection/pressed tokens;
- body-measurement metric/unit choices and text inputs to adaptive glass control tokens;
- the shared Progress trend-chart shell to `LiquidGlassSurface` without per-chart native blur;
- a source-contract regression guard covering these migrated surfaces and the already-compliant Coach primary screen.

Progress analytics, navigation, persistence, localization, accessibility roles/states, chart data, and Coach domain behavior remain unchanged. Safety/Recovery nested filters/detail surfaces are intentionally still remaining LG-2B work; this first batch does **not** mark LG-2B complete.

## Validation state

For this package local repository execution is unavailable because the working container cannot resolve GitHub for a clone. The authoritative validation gate is therefore exact-head Mobile CI on the PR; do not claim TypeScript/tests/export/doctor green until that run completes.

Previous LG-H1 validation remains recorded at exact head `9f28c198ed75070bcf10484ef09a28a78cbc5571` / Mobile CI #1931.

## Planned follow-up

- Finish the remaining coherent LG-2B Progress/Coach primary-surface audit, especially local Safety/Recovery nested material recipes, after this bounded batch is validated/merged.
- **LG-H2:** Stories contracts and rail only after reviewed server contracts exist.
- **LG-H3:** real steps/activity source only after separately approved native dependency/permission work.
- **LG-H4:** workout-native feed retention refinement after the base Home feed is stable.
- **LG-2C:** Nutrition primary surfaces.
- **LG-2D:** Profile primary surfaces.
- Workouts Liquid Glass migration follows its dedicated staged order later.

## Release / provider boundary

Source/CI validation is not physical-device or release proof. Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
