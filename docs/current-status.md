# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `7a9274d910c0e2dfc8bd270d0d1dc332989d6863`.
- Latest runtime merge: `7a9274d910c0e2dfc8bd270d0d1dc332989d6863` (PR #519 — LG-3C Social interaction controls).
- PR #519 exact validated head: `d739a5406490e38773e9acc91e69605a21184c98`; Mobile CI #1955 passed the full required gate.
- Previous LG-3B: PR #517 / Mobile CI #1953 / merge `8f7df7507c3a833cdfa82b636820080106b15b9c`.
- Backend dependency-awareness baseline: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-3D Social shell + notification controls**.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 shared foundation / Mobile CI #1922.
- PR #503 initial Home pilot / Mobile CI #1925.
- PR #505 LG-H1 social-first Home / Mobile CI #1931.
- PR #507 + #509 LG-2B Progress + Coach primary / Mobile CI #1937 + #1943.
- PR #511 LG-2C Nutrition primary / Mobile CI #1947.
- PR #513 LG-2D Profile primary / Mobile CI #1949.
- PR #515 LG-3A Settings controls/disclosures / Mobile CI #1951.
- PR #517 LG-3B Nutrition secondary / Mobile CI #1953.
- PR #519 LG-3C Social interaction controls / exact head `d739a5406490e38773e9acc91e69605a21184c98` / Mobile CI #1955 / merge `7a9274d910c0e2dfc8bd270d0d1dc332989d6863`.

## Home boundaries

Home remains social-first hybrid: compact personal daily metrics → Stories only after real contracts → existing server-authoritative Following Feed. LG-H2 Stories remains blocked on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains blocked on a reviewed native health/activity source and permissions. Do not fake either.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-3C complete — Social interaction controls

PR #519 delivered:

- adaptive elevated/control/accent material for `SocialReportModal`, including explicit neutral/selected pressed states;
- shared 44 pt `LiquidGlassIconButton` for relationship-list back navigation;
- adaptive relationship tabs and avatar fallback material;
- lightweight opacity feedback retained only for the profile link inside existing `AppCard` ownership.

Preserved: report reason codes, submit/success/error/rate-limit/disabled behavior, Social API authority, relationship paging/stale-request protection, cursor/error handling, approve/reject/cancel/unfollow actions, profile routing, privacy/visibility rules and cache semantics. No native blur was added per report option/list item.

## Validation state

PR #519 exact head `d739a5406490e38773e9acc91e69605a21184c98` passed Mobile CI #1955:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Active LG-3D — Social shell + notification controls

Read-only audit isolated a presentation-only batch:

- `SocialNotificationScreen`: shared glass back action plus adaptive notification-card/avatar material and explicit pressed feedback; preserve optimistic read, mark-read API call and profile/post navigation;
- `SocialCommunityGuidelinesScreen`: replace only its local 44 pt back recipe with shared `LiquidGlassIconButton`; existing `AppCard` sections remain unchanged;
- `SocialProfileLookupScreen`: replace only its local back recipe with the shared icon primitive; preserve keyboard/safe-area behavior, username validation/normalization, auth route and public-profile routing;
- update stale Social shell/profile-lookup source guards alongside runtime changes;
- exclude Share Workout from LG-3D because publishing/media form material is broader and belongs in a later coherent package;
- no native blur per notification card or shell control.

## Planned follow-up

- Complete LG-3D, then continue remaining LG-3 secondary batches by shared defect.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-5:** bounded elevated chrome/motion.
- **LG-6:** visual QA/stabilization.
- **LG-H2/H3:** only after blockers are resolved; LG-H4 after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
