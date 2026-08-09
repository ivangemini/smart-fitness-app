# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `7ca5aba37dd0e994739f52a88afd8601bed5794a`.
- Latest runtime merge: PR #531 — LG-3I Coach secondary shared navigation.
- PR #531 exact validated head: `3d5255b6545bbb8d3fe8aa5972c9c984ce060394`; Mobile CI #1974 passed the full required gate.
- Backend dependency-awareness baseline: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`.
- Active product/source priority: **Home / LG-H2 Stories contracts and implementation**.
- **Coach material is deferred by explicit product priority.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

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
- PR #531 LG-3I Coach secondary shared navigation / Mobile CI #1974.

## Home boundaries

Home is a social-first hybrid: compact personal daily metrics → Stories → existing server-authoritative Following Feed.

### Stories

LG-H2 is now the active implementation priority. The old “blocked” state means UI must not be fabricated ahead of contracts; it no longer means the work is postponed. Backend contracts come first.

Required source contract:

- versioned Story DTOs and stable errors;
- authenticated ownership and idempotent creation;
- server-authoritative expiry and active-story filtering;
- owner deletion and account-deletion cascade;
- Following/private-profile/block/moderation-restriction enforcement;
- reuse of existing managed-media upload/moderation/delivery authority;
- idempotent viewed/unviewed state;
- bounded ordering/pagination/loading semantics;
- retention/cleanup semantics;
- strict mobile parsing and bounded privacy-safe cache after backend merge.

The first coherent scope should be image-only and reference an approved owned managed-media asset. Do not add a second media pipeline.

### Steps

LG-H3 remains blocked on a reviewed native health/activity source and permissions. Do not infer steps from workouts.

### Feed retention

LG-H4 remains later. Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## LG-3I complete — Coach secondary shared navigation

PR #531 migrated local back-control ownership in:

- `CombinedCoachScreen`;
- `RecoveryCheckInScreen`;
- `SafetyRecoveryCoachScreen`;
- `UserLimitationScreen`;
- `CoachRunHistoryScreen`.

All five use shared `LiquidGlassIconButton`. Existing score/lookback/choice/filter/row pressed states and all Coach/recovery/history domain behavior were preserved.

The first exact head exposed four stale touch-target assertions that still expected local `backButton` styles. Only those source-contract assertions were updated to verify the shared 44×44 primitive; runtime scope did not expand.

## Validation state

PR #531 exact head `3d5255b6545bbb8d3fe8aa5972c9c984ce060394` passed Mobile CI #1974:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Current UI/material scope

`SyncBackupScreen`, `DataRecoveryCard`, `SyncConflictReviewCard`, and `SupportDiagnosticsCard` already use shared `AppCard`/`AppButton` ownership; their remaining borders are structural dividers.

Coach material debt still exists in recovery scores/inputs, limitation choices, Safety lookback controls, history filters, Combined domain/result cards and related surfaces, but **it is intentionally deferred**. Do not resume it as the automatic next package.

## Planned follow-up

1. Backend Stories contract/persistence/API source package.
2. Mobile strict Stories contracts/API integration.
3. Home Stories strip/viewer/creation flow on the merged server contract.
4. Reassess remaining Progress/exercise secondary material after Home Stories is stable.
5. LG-H3 Steps only after native provider/permissions authorization.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, backend deployment or migration execution, production/provider activation, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
