# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `fb5943c1497cf893858d59ca6b41dcab60790da8`.
- Latest runtime merge: `fb5943c1497cf893858d59ca6b41dcab60790da8` (PR #513 — LG-2D Profile primary surfaces).
- PR #513 exact validated head: `aa22621db120b523ddab8a04aacb3077aa9f91ed`; Mobile CI #1949 passed the full required gate.
- Previous LG-2C: PR #511, exact green head `e1dfaed79f45080d06dd2d590a757e5547f4111b`, Mobile CI #1947, merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- Backend baseline inspected for dependency awareness: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-3 secondary surfaces**.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance, and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 established adaptive Liquid Glass tokens, reusable surfaces, shared buttons, and adaptive floating navigation; Mobile CI #1922 passed.
- PR #503 completed the initial Home Liquid Glass pilot; Mobile CI #1925 passed.
- PR #505 completed LG-H1 social-first Home; Mobile CI #1931 passed.
- PR #507 + PR #509 completed LG-2B Progress + Coach primary surfaces; Mobile CI #1937 and #1943 passed.
- PR #511 completed LG-2C Nutrition primary surfaces; Mobile CI #1947 passed, merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- PR #513 completed LG-2D Profile primary surfaces; exact head `aa22621db120b523ddab8a04aacb3077aa9f91ed`, Mobile CI #1949, merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.

## Current Home product architecture

The approved live Home hierarchy remains: header/profile action → compact expandable personal daily metrics → Stories only after real Social contracts exist → existing server-authoritative Following Feed.

LG-H2 Stories remains gated on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains gated on a reviewed native health/activity source, permissions, dependencies, and later physical runtime evidence. Neither should be faked to unblock UI work.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-2B complete — Progress + Coach primary surfaces

Progress primary material migration is complete across weight/body-measurement/trend and Safety/Recovery surfaces; Coach primary already used shared primitives. Progress analytics, routing, persistence, localization, accessibility and Coach domain behavior remain unchanged.

## LG-2C complete — Nutrition primary surfaces

PR #511 migrated primary Nutrition header controls, week states, macro summary, meal groups, diary shell and action controls to adaptive material without per-row native blur. Calculations, targets, date/day semantics, diary grouping, add/edit routing, persistence/sync, localization/accessibility, SectionList virtualization, keyboard/reflow and touch ownership remain unchanged. Secondary Nutrition flows remain for LG-3.

## LG-2D complete — Profile primary surfaces

PR #513 delivered:

- shared 44 pt `LiquidGlassIconButton` for Profile Settings;
- shared `LiquidGlassSurface` control material for goals disclosure with adaptive pressed state and no native blur;
- active-theme text ownership in `SocialProfileEntryCard` while preserving its `AppCard`/`SecondaryButton` structure;
- focused regression guards for shared material/theme ownership.

Preserved: Profile state, goal validation/save flow, nutrition-target recalculation, Settings/Social routes, localization, accessibility, safe-area/scroll behavior and interaction ownership.

## Validation state

PR #513 exact head `aa22621db120b523ddab8a04aacb3077aa9f91ed` passed Mobile CI #1949:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Active LG-3 — secondary surfaces

First audited coherent batch is **Settings controls and disclosures**:

- Settings shell back control still owns a local 44 pt bordered recipe and should reuse the shared glass icon control;
- shared `SegmentedControl` still uses direct `surfaceSecondary` / `surfacePrimary` / `backgroundSelected` states and is a high-leverage shared secondary-surface defect;
- Personal Details formula options still use direct local neutral/selected recipes and should align to adaptive control/accent tokens without touching validation/save behavior;
- Privacy/About/Sync content already sits inside shared `AppCard`; divider-only semantic separators should remain lightweight rather than gaining artificial blur/card wrappers.

After this batch, continue through Settings/account, Sync & Backup, Social detail, Progress detail, Nutrition add/edit/detail, Coach detail and exercise detail/library surfaces by shared defect.

## Planned follow-up

- Complete LG-3 in coherent secondary-surface batches.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-5:** bounded elevated chrome/motion.
- **LG-6:** visual QA/stabilization.
- **LG-H2/H3:** only after their external blockers are resolved; LG-H4 after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
