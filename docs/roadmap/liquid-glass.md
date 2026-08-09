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
- **LG-3C Social interaction controls:** PR #519 / Mobile CI #1955 / merge `7a9274d910c0e2dfc8bd270d0d1dc332989d6863`.
- **LG-3D Social shell + notification controls complete:** PR #521 + #525 / Mobile CI #1957 + #1963 / final merge `8272b862200c7a2a1585bd61030a5ca2f8d9a0d8`.
- **LG-3E Social Share Workout material complete:** PR #523 / Mobile CI #1960 / merge `32447156ece5b777b574a52288809f2025328147`.
- **LG-3F Account Sessions + Social Profile Editor shared navigation complete:** PR #526 / exact green head `5d136c044519f0afa570e8f8ebc6d77bc4932947` / Mobile CI #1965 / merge `b2333891a86bf5010a9e8e3db787fea2d1f3fa28`.
- **Active:** LG-3G Social workout-post shell navigation.
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

### LG-3A — Settings controls/disclosures

**Complete.** Settings back navigation, shared `SegmentedControl`, and Personal Details formula radios use adaptive control/accent material with explicit pressed states.

### LG-3B — Nutrition secondary surfaces

**Complete.** Nutrition date picker and centralized Add Food base/sheet/scanner material use adaptive card/control/accent tokens while Add Food orchestration/search/templates/persistence/scanner logic remains unchanged.

### LG-3C — Social interaction controls

**Complete.** Report options, relationship-list back navigation, tabs and avatar fallback use adaptive material. Moderation/relationship data flow and Social API authority remain unchanged.

### LG-3D — Social shell + notification controls

**Complete.**

PR #521 delivered shared back ownership for Social Notifications and Profile Lookup plus adaptive notification-card material. PR #525 closed the remaining Community Guidelines local back-control residual. Feed/notification/profile lookup/guidelines domain behavior, copy, localization/accessibility and safe-area ownership remained unchanged; no per-row native blur was introduced.

Final residual exact head `197a79e2d9b83ef5ec0374b76e0dc0d96a943277` passed the full Mobile CI #1963 gate before merge `8272b862200c7a2a1585bd61030a5ca2f8d9a0d8`.

### LG-3E — Social Share Workout material

**Complete.**

PR #523 moved Share Workout back navigation to `LiquidGlassIconButton` and migrated caption/media/preview/progress material to adaptive control tokens. The final patch deliberately preserved the existing typography, spacing, preview-grid geometry, success styling and native Switch behavior. Publish sequencing, `syncNow()`, idempotency, managed-media lifecycle, moderation/rate-limit handling, localization/accessibility and safe-area/keyboard behavior were unchanged.

Exact head `6efd2e3e13222b037da8180d3fddddc13561a12e` passed the full Mobile CI #1960 gate before merge `32447156ece5b777b574a52288809f2025328147`.

### LG-3F — Account Sessions + Social Profile Editor shared navigation

**Complete.**

PR #526 replaced the local bordered 44 pt back `Pressable` in Account Sessions and Social Profile Editor with shared `LiquidGlassIconButton`, removing only obsolete local back/opacity style ownership and unused imports.

Preserved: account session list/refresh/revoke/confirmation behavior, Social profile load/validation/managed-avatar/visibility/save flow, `socialApi.upsertOwnProfile`, safe-area/keyboard geometry, localization/accessibility and shared form/card/button ownership. No native blur was added.

Exact head `5d136c044519f0afa570e8f8ebc6d77bc4932947` passed the full Mobile CI #1965 gate before merge `b2333891a86bf5010a9e8e3db787fea2d1f3fa28`.

### LG-3G — Social workout-post shell navigation

**Active.**

Target the single shared defect in:

- `SocialFollowingFeedScreen.tsx`;
- `SocialProfileWorkoutPostsScreen.tsx`;
- `SocialWorkoutPostDetailScreen.tsx`;
- `SocialWorkoutPostSurface.styles.ts` only to remove the obsolete local `backButton` recipe.

Replace those local back actions with `LiquidGlassIconButton`. Preserve safe-area geometry, feed cache/pagination, profile post pagination/privacy handling, detail load/delete/report/comment/reaction behavior, and retain the existing `styles.pressed` ownership used by interactive workout-post content. Do not mix comment/metric material redesign into this navigation-only batch.

### Remaining LG-3 audit

`SyncBackupScreen`, `DataRecoveryCard`, `SyncConflictReviewCard`, and `SupportDiagnosticsCard` already use shared `AppCard`/`AppButton` ownership; their remaining borders are structural dividers and do not justify churn.

After LG-3G, continue Social public-profile material, Progress detail, Coach detail and exercise detail/library surfaces by shared defect.

## LG-4 — Workouts

Migrate in order: hub/program cards → exercise library/builder → active workout chrome → set-table fields/states → finish/summary. Preserve active-session persistence, save/cancel/finish behavior, set/kg/reps alignment and dense table readability. Do not put native blur behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for bounded elevated/floating roles only.

## LG-6 — visual QA and stabilization

Require exact-head source/CI checks first. Physical cross-device/light-dark/Dynamic Type/keyboard/performance validation remains separately authorization-gated.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/Social integration must reuse existing Social authority rather than duplicate it. Exact code, tests, and current Git history override stale roadmap prose.
