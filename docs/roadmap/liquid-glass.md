# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge Smart Fitness on the Liquid Glass material language while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, Social authority, and backend contracts.

Home remains **social-first hybrid**: compact personal fitness context above Stories and the server-authoritative Social feed.

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
- **LG-3G Social workout-post shell navigation:** PR #528 / Mobile CI #1967.
- **LG-3H Social profile/avatar material:** PR #529 / Mobile CI #1970.
- **LG-3I Coach secondary shared navigation:** PR #531 / exact head `3d5255b6545bbb8d3fe8aa5972c9c984ce060394` / Mobile CI #1974 / merge `7ca5aba37dd0e994739f52a88afd8601bed5794a`.
- **Active product priority:** LG-H2 Stories contracts and implementation.
- **Coach material is explicitly deferred.** Do not resume it unless reprioritized.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- No OTA/EAS publication, native install/build, backend deployment, migration execution, or physical-device proof is implied by source/CI completion.

## LG-H — Home follow-ups

### LG-H2 — Stories

**Active.** The previous blocker is now the implementation target rather than permission to fabricate UI. Build real server-authoritative contracts first, then mobile UI.

Required contract surface:

- versioned Story DTO/schema and stable errors;
- authenticated ownership and idempotent create semantics;
- explicit expiry and active-story filtering;
- owner deletion and account-deletion cascade;
- Following/private-profile/block/restriction enforcement on the server;
- managed-media ownership, approval and delivery reuse; do not create a parallel upload/moderation pipeline;
- viewed/unviewed state with idempotent marking;
- bounded ordering/pagination/loading contracts;
- retention/cleanup semantics;
- strict mobile parsing and privacy-safe bounded cache only after backend contracts merge.

Initial source scope should prefer the smallest coherent Story: one approved managed image asset, no fabricated text/media behavior. More expressive Story authoring can be added after the lifecycle is stable.

### LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

### LG-H4 — feed retention

**Planned after Home Stories/base feed stability.** Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## LG-2 — primary tabs

LG-2B Progress + Coach, LG-2C Nutrition primary, and LG-2D Profile primary are complete for source/CI scope. Product/domain semantics, persistence/sync contracts, localization, accessibility and responsive ownership were preserved.

## LG-3 — secondary surfaces

LG-3A through LG-3I are complete for the approved source scope.

### LG-3I — Coach secondary shared navigation

**Complete.**

PR #531 moved `CombinedCoachScreen`, `RecoveryCheckInScreen`, `SafetyRecoveryCoachScreen`, `UserLimitationScreen`, and `CoachRunHistoryScreen` from local back-control recipes to shared `LiquidGlassIconButton`. Generic pressed states still owned by score/lookback/choice/filter/row controls were preserved.

Exact head `3d5255b6545bbb8d3fe8aa5972c9c984ce060394` passed repository/changed-file line audits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor in Mobile CI #1974 before merge `7ca5aba37dd0e994739f52a88afd8601bed5794a`.

Recovery inputs, score pickers, Safety lookback controls, Combined domain/result cards, history filters and other Coach material were intentionally not changed and are now deferred by product priority.

### Remaining LG-3 audit

`SyncBackupScreen`, `DataRecoveryCard`, `SyncConflictReviewCard`, and `SupportDiagnosticsCard` already use shared `AppCard`/`AppButton` ownership; remaining borders are structural dividers and do not justify churn.

Remaining Progress/exercise secondary work can resume after the current Home/Stories priority. Coach material remains deferred.

## LG-4 — Workouts

Migrate in order: hub/program cards → exercise library/builder → active workout chrome → set-table fields/states → finish/summary. Preserve active-session persistence, save/cancel/finish behavior, set/kg/reps alignment and dense table readability. Do not put native blur behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for bounded elevated/floating roles only.

## LG-6 — visual QA and stabilization

Require exact-head source/CI checks first. Physical cross-device/light-dark/Dynamic Type/keyboard/performance validation remains separately authorization-gated.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/Social integration must reuse existing Social authority and managed-media infrastructure rather than duplicate it. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
