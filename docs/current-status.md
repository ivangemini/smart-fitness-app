# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `2f85aea5a1f7f009e427663ee3278f0f78197978`.
- Latest runtime merge: `2f85aea5a1f7f009e427663ee3278f0f78197978` (PR #529 — LG-3H Social profile/avatar material).
- PR #529 exact validated head: `2b11a671d45ff868980ce82440aff393228bf83d`; Mobile CI #1970 passed the full required gate.
- Previous LG-3G merge: PR #528 / exact head `9ac58b6ed86287bbff5b198e88849f862e5b127d` / Mobile CI #1967 / merge `e26ccebe2efa57a7a67d0e15018f59ac53ca7d1e`.
- Backend dependency-awareness baseline: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-3I Coach secondary shared navigation**.

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
- PR #519 LG-3C Social interaction controls / Mobile CI #1955.
- PR #521 + #525 LG-3D Social shell/notifications + Guidelines / Mobile CI #1957 + #1963.
- PR #523 LG-3E Share Workout / Mobile CI #1960.
- PR #526 LG-3F Account Sessions + Social Profile Editor navigation / Mobile CI #1965.
- PR #528 LG-3G Social workout-post shell navigation / Mobile CI #1967.
- PR #529 LG-3H Social profile/avatar material / Mobile CI #1970.

## Home boundaries

Home remains social-first hybrid: compact personal daily metrics → Stories only after real contracts → existing server-authoritative Following Feed. LG-H2 Stories remains blocked on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains blocked on a reviewed native health/activity source and permissions. Do not fake either.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-3G complete — Social workout-post shell navigation

PR #528 moved Following Feed, Profile Workout Posts and Workout Post Detail back navigation to shared `LiquidGlassIconButton` and removed only the obsolete shared local `backButton` style recipe. Interactive workout-post `pressed` ownership was intentionally retained.

Preserved: Following feed cache/refresh/pagination, profile-post privacy/error/pagination, detail load/delete/report/reaction/comment behavior, safe-area/keyboard geometry, localization/accessibility and Social API authority.

## LG-3H complete — Social profile/avatar material

PR #529 delivered:

- Public Profile shared `LiquidGlassIconButton` back navigation;
- adaptive `controlFill/controlBorder` avatar fallback material;
- adaptive Managed Avatar preview/empty-state, status-box and progress-track material;
- no native blur behind profile/avatar content.

Preserved: public-profile load/privacy/follow/unfollow/request/block/unblock/report behavior, own-profile navigation, managed-avatar capability gating, choose/refresh/remove lifecycle and progress semantics.

The first exact head exceeded the repository 500-line limit by one line in `SocialPublicProfileScreen.tsx`; the final patch corrected formatting only. No runtime contract was changed by the line-limit fix.

## Validation state

PR #529 exact head `2b11a671d45ff868980ce82440aff393228bf83d` passed Mobile CI #1970:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Current LG-3 audit result

`SyncBackupScreen`, `DataRecoveryCard`, `SyncConflictReviewCard`, and `SupportDiagnosticsCard` already use shared `AppCard`/`AppButton` ownership; their remaining borders are structural dividers. Do not create cosmetic churn there without a concrete material defect.

The next shared defect is Coach secondary navigation. The audited screens are `CombinedCoachScreen`, `RecoveryCheckInScreen`, `SafetyRecoveryCoachScreen`, `UserLimitationScreen`, and `CoachRunHistoryScreen`: each still owns a local 44 pt back control. Migrate back ownership first. Preserve existing filter/picker/form/card material and domain behavior for a later bounded material pass.

After Coach navigation, continue remaining Progress detail, Coach material, and exercise detail/library secondary surfaces by shared defect.

## Planned follow-up

- **LG-3I:** Coach secondary shared navigation.
- Continue remaining LG-3 secondary material batches.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-5:** bounded elevated chrome/motion.
- **LG-6:** visual QA/stabilization.
- **LG-H2/H3:** only after blockers are resolved; LG-H4 after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
