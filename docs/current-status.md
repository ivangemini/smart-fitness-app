# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `be332729c070bbdf5050536d038b270656a5f0e8`.
- Latest runtime merge: `be332729c070bbdf5050536d038b270656a5f0e8` (PR #515 — LG-3A Settings controls/disclosures).
- PR #515 exact validated head: `cf12f4c62eacce618a6c7832163d438514dd7f1d`; Mobile CI #1951 passed the full required gate.
- Previous LG-2D: PR #513, exact green head `aa22621db120b523ddab8a04aacb3077aa9f91ed`, Mobile CI #1949, merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.
- Backend baseline inspected for dependency awareness: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-3B Nutrition secondary surfaces**.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance, and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 established adaptive Liquid Glass tokens, reusable surfaces, shared buttons, and adaptive floating navigation; Mobile CI #1922 passed.
- PR #503 completed the initial Home Liquid Glass pilot; Mobile CI #1925 passed.
- PR #505 completed LG-H1 social-first Home; Mobile CI #1931 passed.
- PR #507 + PR #509 completed LG-2B Progress + Coach primary surfaces; Mobile CI #1937 and #1943 passed.
- PR #511 completed LG-2C Nutrition primary surfaces; Mobile CI #1947 passed, merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- PR #513 completed LG-2D Profile primary surfaces; Mobile CI #1949 passed, merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.
- PR #515 completed LG-3A Settings controls/disclosures; exact head `cf12f4c62eacce618a6c7832163d438514dd7f1d`, Mobile CI #1951, merge `be332729c070bbdf5050536d038b270656a5f0e8`.

## Current Home product architecture

The approved live Home hierarchy remains: header/profile action → compact expandable personal daily metrics → Stories only after real Social contracts exist → existing server-authoritative Following Feed.

LG-H2 Stories remains gated on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains gated on a reviewed native health/activity source, permissions, dependencies, and later physical runtime evidence. Neither should be faked to unblock UI work.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-2B complete — Progress + Coach primary surfaces

Progress primary material migration is complete across weight/body-measurement/trend and Safety/Recovery surfaces; Coach primary already used shared primitives. Progress analytics, routing, persistence, localization, accessibility and Coach domain behavior remain unchanged.

## LG-2C complete — Nutrition primary surfaces

PR #511 migrated primary Nutrition header controls, week states, macro summary, meal groups, diary shell and action controls to adaptive material without per-row native blur. Calculations, targets, date/day semantics, diary grouping, add/edit routing, persistence/sync, localization/accessibility, SectionList virtualization, keyboard/reflow and touch ownership remain unchanged.

## LG-2D complete — Profile primary surfaces

PR #513 moved Profile Settings, the goals disclosure, and Social Profile entry theme ownership onto shared/adaptive material without changing Profile state, goal validation/save flow, nutrition-target recalculation, routes, localization, accessibility, safe-area/scroll behavior or interaction ownership.

## LG-3A complete — Settings controls/disclosures

PR #515 delivered:

- shared 44 pt `LiquidGlassIconButton` for Settings back navigation;
- adaptive glass control/accent material for shared `SegmentedControl`, including distinct neutral/selected pressed states;
- matching adaptive material for Personal Details formula radios;
- preservation of tab/radio accessibility roles/states, validation/save behavior, safe-area/keyboard behavior, existing `AppCard` ownership and lightweight dividers;
- no native blur per row/control.

## Validation state

PR #515 exact head `cf12f4c62eacce618a6c7832163d438514dd7f1d` passed Mobile CI #1951:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Active LG-3B — Nutrition secondary surfaces

The audited presentation-only scope is:

- Nutrition date picker: day cells, selected/logged/today states, header actions and month navigation → adaptive glass tokens while preserving calendar/date/routing semantics and effective touch ownership;
- Add Food route: resolve the current glass palette and pass it into the existing centralized style factory, with no food/search/template/entry mutation changes;
- Add Food base/sheet/scanner style factories: replace direct `surfacePrimary` / `surfaceSecondary` / `borderSubtle` material ownership with adaptive card/control/accent tokens;
- keep modal sheet/scanner/card/input/action material lightweight and blur-free; do not change `expo-camera` dependency or permission behavior.

Existing Nutrition localization/domain guards already cover product semantics; LG-3B should add only a focused material/no-blur guard rather than duplicate them.

## Planned follow-up

- Complete LG-3B, then continue LG-3 through adjacent secondary surfaces by shared defect.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-5:** bounded elevated chrome/motion.
- **LG-6:** visual QA/stabilization.
- **LG-H2/H3:** only after their external blockers are resolved; LG-H4 after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
