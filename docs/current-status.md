# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `b2333891a86bf5010a9e8e3db787fea2d1f3fa28`.
- Latest runtime merge: `b2333891a86bf5010a9e8e3db787fea2d1f3fa28` (PR #526 — LG-3F Account Sessions + Social Profile Editor shared back controls).
- PR #526 exact validated head: `5d136c044519f0afa570e8f8ebc6d77bc4932947`; Mobile CI #1965 passed the full required gate.
- LG-3D final residual: PR #525 / exact head `197a79e2d9b83ef5ec0374b76e0dc0d96a943277` / Mobile CI #1963 / merge `8272b862200c7a2a1585bd61030a5ca2f8d9a0d8`.
- Backend dependency-awareness baseline: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-3G Social workout-post shell navigation**.

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
- PR #526 LG-3F Account Sessions + Social Profile Editor shared navigation / Mobile CI #1965.

## Home boundaries

Home remains social-first hybrid: compact personal daily metrics → Stories only after real contracts → existing server-authoritative Following Feed. LG-H2 Stories remains blocked on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains blocked on a reviewed native health/activity source and permissions. Do not fake either.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-3D complete — Social shell + notification controls

PR #525 closed the final Community Guidelines residual by moving its local bordered back action to shared `LiquidGlassIconButton`. Existing `AppCard` content, warning note, copy, routing, localization, accessibility and safe-area geometry were preserved. The canonical source guard was updated from direct `<ChevronLeft>` ownership to the shared icon-button contract.

## LG-3F complete — Account Sessions + Social Profile Editor

PR #526 removed two more local 44 pt bordered back implementations and moved both shells to `LiquidGlassIconButton`.

Preserved:

- Account Sessions list/refresh/revoke/confirmation behavior and session-management error localization;
- Social Profile Editor load/validation/managed-avatar/visibility/`upsertOwnProfile` save behavior;
- keyboard and safe-area ownership, localization/accessibility, existing shared cards/forms/buttons;
- no additional native blur.

## Validation state

PR #526 exact head `5d136c044519f0afa570e8f8ebc6d77bc4932947` passed Mobile CI #1965:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Current LG-3 audit result

`SyncBackupScreen`, `DataRecoveryCard`, `SyncConflictReviewCard`, and `SupportDiagnosticsCard` already use shared `AppCard`/`AppButton` ownership; their remaining borders are structural dividers. Do not create cosmetic churn there without a concrete material defect.

The next coherent defect is the remaining local bordered back ownership in Social workout-post shells (`SocialFollowingFeedScreen`, `SocialProfileWorkoutPostsScreen`, `SocialWorkoutPostDetailScreen`). Keep post/feed/detail behavior and existing interactive-card pressed semantics unchanged.

After that, continue Social public-profile material, Progress detail, Coach detail and exercise detail/library surfaces by shared defect.

## Planned follow-up

- **LG-3G:** Social workout-post shell navigation.
- Continue the remaining LG-3 secondary material batches.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-5:** bounded elevated chrome/motion.
- **LG-6:** visual QA/stabilization.
- **LG-H2/H3:** only after blockers are resolved; LG-H4 after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
