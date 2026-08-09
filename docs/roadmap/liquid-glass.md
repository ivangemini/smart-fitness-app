# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge Smart Fitness on the Liquid Glass material language while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, Social authority, and backend contracts.

Home remains **social-first hybrid**: compact personal fitness context above the server-authoritative Social feed.

## Status

- Phase 10 responsive source hardening is complete for the current source scope.
- **LG-1 foundation:** PR #501 / Mobile CI #1922.
- **LG-2A Home pilot:** PR #503 / Mobile CI #1925.
- **LG-H1 social-first Home:** PR #505 / Mobile CI #1931.
- **LG-2B Progress + Coach primary:** PR #507 + #509 / Mobile CI #1937 + #1943.
- **LG-2C Nutrition primary:** PR #511 / Mobile CI #1947.
- **LG-2D Profile primary:** PR #513 / Mobile CI #1949.
- **LG-3A Settings controls/disclosures:** PR #515 / Mobile CI #1951.
- **LG-3B Nutrition secondary:** PR #517 / Mobile CI #1953.
- **LG-3C Social interaction controls:** PR #519 / Mobile CI #1955.
- **LG-3D Social shell + notification controls:** PR #521 + #525 / Mobile CI #1957 + #1963.
- **LG-3E Social Share Workout material:** PR #523 / Mobile CI #1960.
- **LG-3F Account Sessions + Social Profile Editor navigation:** PR #526 / Mobile CI #1965.
- **LG-3G Social workout-post shell navigation:** PR #528 / exact green head `9ac58b6ed86287bbff5b198e88849f862e5b127d` / Mobile CI #1967 / merge `e26ccebe2efa57a7a67d0e15018f59ac53ca7d1e`.
- **LG-3H Social profile/avatar material:** PR #529 / exact green head `2b11a671d45ff868980ce82440aff393228bf83d` / Mobile CI #1970 / merge `2f85aea5a1f7f009e427663ee3278f0f78197978`.
- **Active:** LG-3I Coach secondary shared navigation.
- LG-H2 Stories and LG-H3 Steps remain blocked by real server/native contracts and must not be faked.
- No OTA/EAS publication, native install/build, or physical-device proof is implied by source/CI completion.

## LG-H — blocked Home follow-ups

### LG-H2 — Stories

**Blocked.** Require reviewed story DTO/schema, expiry, ownership, follow/block/private-profile enforcement, media lifecycle/moderation, viewed state, retention/deletion, pagination/loading and privacy-safe cache contracts before UI work.

### LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

### LG-H4 — feed retention

**Planned after base Home stability.** Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## LG-2 — primary tabs

LG-2B Progress + Coach, LG-2C Nutrition primary, and LG-2D Profile primary are complete for source/CI scope. Product/domain semantics, persistence/sync contracts, localization, accessibility and responsive ownership were preserved.

## LG-3 — secondary surfaces

**Status: active.** Batch adjacent surfaces by shared material defect rather than one PR per route.

### LG-3A through LG-3F

**Complete.** Settings controls, Nutrition secondary, Social interaction controls, Social shell/notifications, Share Workout material, and Account Sessions + Social Profile Editor navigation are merged and validated. See `docs/current-status.md` for exact history.

### LG-3G — Social workout-post shell navigation

**Complete.**

PR #528 moved Following Feed, Profile Workout Posts and Workout Post Detail back navigation to shared `LiquidGlassIconButton`; only obsolete local `backButton` ownership was removed. Interactive workout-post `pressed` feedback stayed in place.

Preserved: Following feed cache/refresh/pagination, profile-post privacy/error/pagination, detail load/delete/report/reaction/comment behavior, safe-area/keyboard geometry, localization/accessibility and Social API authority.

Exact head `9ac58b6ed86287bbff5b198e88849f862e5b127d` passed the full Mobile CI #1967 gate before merge `e26ccebe2efa57a7a67d0e15018f59ac53ca7d1e`.

### LG-3H — Social profile/avatar material

**Complete.**

PR #529 delivered shared Public Profile back navigation, adaptive Public Profile avatar fallback, and adaptive Managed Avatar preview/empty-state/status/progress material using Liquid Glass control tokens.

Preserved: profile privacy/relationship/report actions, own-profile/posts navigation, managed-avatar capability gating, choose/refresh/remove lifecycle, approved/candidate asset handling, progress semantics, localization/accessibility and safe-area behavior. No native blur was introduced.

The initial head exceeded the repository line limit by one line in `SocialPublicProfileScreen.tsx`; the final fix compacted formatting only. Exact head `2b11a671d45ff868980ce82440aff393228bf83d` passed the full Mobile CI #1970 gate before merge `2f85aea5a1f7f009e427663ee3278f0f78197978`.

### LG-3I — Coach secondary shared navigation

**Active.**

Audited local 44 pt back-control ownership exists in:

- `CombinedCoachScreen`;
- `RecoveryCheckInScreen`;
- `SafetyRecoveryCoachScreen`;
- `UserLimitationScreen`;
- `CoachRunHistoryScreen`.

Replace only those local back actions with shared `LiquidGlassIconButton` and remove obsolete back-style recipes. Preserve safe-area geometry and every Coach/recovery/history domain contract. Keep generic `pressed` styles where still owned by lookback buttons, choices, filters, rows or other interactive controls.

Do **not** mix this navigation pass with Coach material migration. Recovery inputs, score pickers, Safety lookback controls, Combined domain/result cards, history filters and other material debt belong to later bounded packages.

### Remaining LG-3 audit

`SyncBackupScreen`, `DataRecoveryCard`, `SyncConflictReviewCard`, and `SupportDiagnosticsCard` already use shared `AppCard`/`AppButton` ownership; remaining borders are structural dividers and do not justify churn.

After LG-3I, continue Progress detail, Coach material and exercise detail/library surfaces by shared defect.

## LG-4 — Workouts

Migrate in order: hub/program cards → exercise library/builder → active workout chrome → set-table fields/states → finish/summary. Preserve active-session persistence, save/cancel/finish behavior, set/kg/reps alignment and dense table readability. Do not put native blur behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for bounded elevated/floating roles only.

## LG-6 — visual QA and stabilization

Require exact-head source/CI checks first. Physical cross-device/light-dark/Dynamic Type/keyboard/performance validation remains separately authorization-gated.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/Social integration must reuse existing Social authority rather than duplicate it. Exact code, tests, and current Git history override stale roadmap prose.
