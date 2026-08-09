# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- Latest runtime merge: `eaad35aac4733ba7488ae0aa151c285dca3acc38` (PR #511 — LG-2C Nutrition primary surfaces).
- PR #511 exact validated head: `e1dfaed79f45080d06dd2d590a757e5547f4111b`; Mobile CI #1947 passed the full required gate.
- Previous LG-2B package: PR #507 / Mobile CI #1937 plus PR #509 / Mobile CI #1943; final LG-2B merge `7355c0aa8b4b94a7cac8a7682acba90808739b77`.
- Backend baseline inspected for dependency awareness: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-2D Profile primary surfaces**.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance, and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 established adaptive Liquid Glass tokens, reusable surfaces, shared buttons, and adaptive floating navigation; Mobile CI #1922 passed.
- PR #503 completed the initial Home Liquid Glass pilot; Mobile CI #1925 passed.
- PR #505 completed LG-H1 social-first Home; Mobile CI #1931 passed.
- PR #507 + PR #509 completed LG-2B Progress + Coach primary surfaces; Mobile CI #1937 and #1943 passed.
- PR #511 completed LG-2C Nutrition primary surfaces; exact head `e1dfaed79f45080d06dd2d590a757e5547f4111b`, Mobile CI #1947, merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.

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

Coach primary already used shared `AppCard` and `AppButton` primitives and required no artificial runtime churn. Progress primary migration is complete across the weight-range selector, body-measurement controls/inputs, trend-chart shell, Safety/Recovery period controls, selected-week state/history actions, and selected-week detail owner. Native blur is not multiplied across chart/list items.

Progress analytics, comparison semantics, chart data, workout-history routing/query parameters, navigation, persistence, localization, accessibility roles/states, and Coach domain behavior remain unchanged.

## LG-2C complete — Nutrition primary surfaces

PR #511 migrated the primary Nutrition tab to adaptive Liquid Glass ownership:

- header calendar, streak and Today controls use adaptive control/disabled pressed states;
- week-day circles and selected/logged/today states use adaptive glass/accent tokens;
- macro summary, meal groups, meal summary strips, diary row shell, and meal action controls no longer rely on the old direct `surfacePrimary` / `surfaceSecondary` / `accentSoft` recipes;
- dense diary/food rows remain ordinary content views with no native blur per row;
- focused source guards protect the adaptive material and no-per-row-blur contracts.

Preserved: calorie/macro calculations, target derivation, date/week navigation, diary grouping, meal expansion/add-edit routing, persistence/sync schemas and IDs, localization/accessibility, SectionList virtualization, keyboard/reflow behavior, and current touch ownership. Secondary add-food/search/editor surfaces remain for LG-3.

## Validation state

PR #511 exact head `e1dfaed79f45080d06dd2d590a757e5547f4111b` passed Mobile CI #1947:

- repository and changed-file line audits;
- TypeScript;
- full regression suite — 1508 tests;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Active LG-2D — Profile primary surfaces

The audited primary Profile scope is intentionally bounded:

- replace the direct settings-icon surface recipe with the shared Liquid Glass icon control;
- migrate the goals disclosure owner to shared/adaptive control material with an explicit pressed state;
- remove static `Colors.dark` text ownership from `SocialProfileEntryCard` while preserving its existing `AppCard`/`SecondaryButton` structure;
- preserve Profile state, goal validation/save behavior, nutrition-target recalculation, routes, localization, accessibility, safe-area behavior, and 44 pt interaction ownership;
- do not add native blur to card/disclosure content.

## Planned follow-up

- Complete LG-2D Profile primary surfaces.
- **LG-3:** secondary Settings/Sync/Social/Progress/Nutrition/Coach/exercise surfaces in coherent batches.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-H2:** Stories only after reviewed server contracts exist.
- **LG-H3:** real steps/activity only after separately approved native dependency/permission work.
- **LG-H4:** workout-native feed retention refinement after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
