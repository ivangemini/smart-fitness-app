# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `7355c0aa8b4b94a7cac8a7682acba90808739b77`.
- Latest runtime merge: `7355c0aa8b4b94a7cac8a7682acba90808739b77` (PR #509 — final LG-2B Safety/Recovery material package).
- PR #509 exact validated head: `ead5df6e598947da6cbaf4d29489efbcbe72cba9`; Mobile CI #1943 passed the full required gate.
- Previous LG-2B Progress batch: PR #507, merge `4e2df0f2c44137bc1ccc7b9860aaaa29d10dbf21`, exact green head `ab06b04624e64108258aba713214d83db480a9fc`, Mobile CI #1937.
- Backend baseline inspected for dependency awareness: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-2C Nutrition primary surfaces**.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance, and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 established adaptive Liquid Glass tokens, reusable surfaces, shared buttons, and adaptive floating navigation; Mobile CI #1922 passed.
- PR #503 completed the initial Home Liquid Glass pilot; Mobile CI #1925 passed and merge is `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`.
- PR #505 completed LG-H1 social-first Home; Mobile CI #1931 passed and merge is `9c9e67a929d10e9f91475c92ba0b579bbadbb805`.
- PR #507 completed the first bounded LG-2B Progress batch; Mobile CI #1937 passed and merge is `4e2df0f2c44137bc1ccc7b9860aaaa29d10dbf21`.
- PR #509 completed the remaining LG-2B Safety/Recovery material migration; Mobile CI #1943 passed and merge is `7355c0aa8b4b94a7cac8a7682acba90808739b77`.

## Current Home product architecture

The approved live Home hierarchy remains:

1. header/profile action;
2. compact expandable personal daily metrics;
3. Stories only after real Social contracts exist;
4. existing server-authoritative Following Feed.

LG-H2 Stories remains gated on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains gated on a reviewed native health/activity source, permissions, dependencies, and later physical runtime evidence. Neither should be faked to unblock UI work.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-2B complete — Progress + Coach primary surfaces

Coach primary already used shared `AppCard` and `AppButton` primitives and required no artificial runtime churn.

Progress primary migration is complete across two validated packages:

- weight range selector, body-measurement controls/inputs, and shared trend-chart shell use adaptive Liquid Glass primitives/tokens;
- Safety/Recovery period filters, selected-week state, history filter actions, and selected-week detail owner use adaptive Liquid Glass material;
- the selected-week detail owner uses shared `LiquidGlassSurface` with no native blur;
- source-contract guards protect the migrated Progress/Coach primary surfaces from regression to old direct material recipes.

Progress analytics, comparison semantics, chart data, workout-history routing/query parameters, navigation, persistence, localization, accessibility roles/states, and Coach domain behavior remain unchanged.

## Validation state

PR #509 exact head `ead5df6e598947da6cbaf4d29489efbcbe72cba9` passed Mobile CI #1943:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Together with PR #507 / Mobile CI #1937, this closes LG-2B source/CI scope. Source/CI validation is not physical-device or release proof.

## Active LG-2C — Nutrition primary surfaces

Next audit/migration target is Nutrition primary surfaces. Keep diary and food rows fast and legible; do not create a native blur per row. Preserve nutrition calculations, targets, diary grouping, saved/recent food flows, meal templates, navigation, persistence/sync, localization, keyboard/reflow behavior, and current 44 pt touch ownership.

## Planned follow-up

- Complete LG-2C Nutrition primary surfaces in coherent material batches.
- **LG-2D:** Profile primary surfaces.
- **LG-H2:** Stories only after reviewed server contracts exist.
- **LG-H3:** real steps/activity only after separately approved native dependency/permission work.
- **LG-H4:** workout-native feed retention refinement after the base Home feed is stable.
- Workouts Liquid Glass migration follows its dedicated staged order later.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
