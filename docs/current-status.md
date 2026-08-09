# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `8f7df7507c3a833cdfa82b636820080106b15b9c`.
- Latest runtime merge: `8f7df7507c3a833cdfa82b636820080106b15b9c` (PR #517 — LG-3B Nutrition secondary surfaces).
- PR #517 exact validated head: `f3d4a2a6977e96ba3672a1d6b663145509aa0bc5`; Mobile CI #1953 passed the full required gate.
- Previous LG-3A: PR #515 / Mobile CI #1951 / merge `be332729c070bbdf5050536d038b270656a5f0e8`.
- Backend dependency-awareness baseline: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-3C Social interaction controls**.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 shared foundation / Mobile CI #1922.
- PR #503 initial Home pilot / Mobile CI #1925.
- PR #505 LG-H1 social-first Home / Mobile CI #1931.
- PR #507 + #509 LG-2B Progress + Coach primary / Mobile CI #1937 + #1943.
- PR #511 LG-2C Nutrition primary / Mobile CI #1947 / merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- PR #513 LG-2D Profile primary / Mobile CI #1949 / merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.
- PR #515 LG-3A Settings controls/disclosures / Mobile CI #1951 / merge `be332729c070bbdf5050536d038b270656a5f0e8`.
- PR #517 LG-3B Nutrition secondary / exact head `f3d4a2a6977e96ba3672a1d6b663145509aa0bc5` / Mobile CI #1953 / merge `8f7df7507c3a833cdfa82b636820080106b15b9c`.

## Home boundaries

Home remains social-first hybrid: compact personal daily metrics → Stories only after real contracts → existing server-authoritative Following Feed. LG-H2 Stories remains blocked on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains blocked on a reviewed native health/activity source and permissions. Do not fake either.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-3A complete — Settings controls/disclosures

Settings back navigation, shared `SegmentedControl`, and Personal Details formula radios now use shared/adaptive Liquid Glass control/accent material with explicit neutral/selected pressed states. Accessibility, validation/save behavior, safe-area/keyboard behavior and existing `AppCard` ownership were preserved.

## LG-3B complete — Nutrition secondary surfaces

PR #517 delivered:

- adaptive control/accent material for Nutrition calendar day/header/month controls with explicit neutral/selected pressed states;
- centralized Add Food glass resolution in `createAddFoodStyles(colors)`, avoiding edits to the large Add Food orchestration route;
- adaptive card/control/accent tokens across Add Food base/sheet/scanner style factories;
- no native blur on dense Add Food, modal sheet or camera-backed surfaces.

Preserved: calendar/date/routing semantics, Add Food search/library/provider results, favorites, meal templates, entry mutation/persistence, barcode/manual-food/scanner behavior, localization, keyboard/reflow, touch ownership and existing `expo-camera` permission/dependency behavior.

## Validation state

PR #517 exact head `f3d4a2a6977e96ba3672a1d6b663145509aa0bc5` passed Mobile CI #1953:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Active LG-3C — Social interaction controls

Read-only audit isolated a presentation-only package:

- `SocialReportModal`: migrate report reason rows/radios and sheet material to adaptive card/control/accent tokens with explicit neutral/selected pressed states; preserve moderation reasons, submit/success/error/rate-limit behavior and disabled semantics;
- `SocialRelationshipListsScreen`: replace local back control with shared `LiquidGlassIconButton`; migrate relationship tabs to adaptive neutral/selected/pressed material while preserving selected accessibility, pagination, request sequencing and relationship actions;
- `SocialRelationshipListsScreen.styles.ts`: migrate tab/avatar fallback material; retain existing `AppCard` ownership and lightweight profile-link feedback;
- do not change Social API contracts, privacy/visibility authority, moderation ownership, paging, follow/request actions or cache semantics; do not add native blur per list item/option.

## Planned follow-up

- Complete LG-3C, then continue remaining LG-3 secondary batches by shared defect.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-5:** bounded elevated chrome/motion.
- **LG-6:** visual QA/stabilization.
- **LG-H2/H3:** only after blockers are resolved; LG-H4 after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
