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
- **LG-3D Social shell + notification controls — batch 1 complete:** PR #521, exact green head `290f19513e1871f705cd87a3a78838e6ed27b609`, Mobile CI #1957, merge `97d497ccda6bcc756d808190e4d84ce1de3f849f`.
- **LG-3E Social Share Workout material complete:** PR #523, exact green head `6efd2e3e13222b037da8180d3fddddc13561a12e`, Mobile CI #1960, merge `32447156ece5b777b574a52288809f2025328147`.
- **Active:** close the sole LG-3D residual, `SocialCommunityGuidelinesScreen` local back control.
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

**Status: active.** Batch adjacent surfaces by shared material defect rather than one PR per route, except for the explicitly isolated Guidelines residual whose content already uses the shared card system.

### LG-3A — Settings controls/disclosures

**Complete.** Settings back navigation, shared `SegmentedControl`, and Personal Details formula radios use adaptive control/accent material with explicit pressed states.

### LG-3B — Nutrition secondary surfaces

**Complete.** Nutrition date picker and centralized Add Food base/sheet/scanner material use adaptive card/control/accent tokens while Add Food orchestration/search/templates/persistence/scanner logic remains unchanged.

### LG-3C — Social interaction controls

**Complete.** Report options, relationship-list back navigation, tabs and avatar fallback use adaptive material. Moderation/relationship data flow and Social API authority remain unchanged.

### LG-3D — Social shell + notification controls

**Status: batch 1 complete; one residual remains.**

PR #521 delivered:

- shared `LiquidGlassIconButton` for Social Notifications back navigation;
- adaptive notification-card `cardFill/cardBorder` material with explicit `controlPressedFill` feedback instead of legacy selected-background + opacity ownership;
- shared `LiquidGlassIconButton` for Social Profile Lookup;
- focused guards preserving optimistic notification read/mark-read routing and Profile Lookup validation/navigation semantics.

Preserved: notification pagination, request sequencing, missing-notification rollback/removal, profile/post routing, Profile Lookup keyboard/safe-area behavior, username validation/normalization and sign-in/profile routes. No native blur was added per notification card or shell control.

Exact head `290f19513e1871f705cd87a3a78838e6ed27b609` passed repository/changed-file line audits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor in Mobile CI #1957; merge `97d497ccda6bcc756d808190e4d84ce1de3f849f`.

Residual: `SocialCommunityGuidelinesScreen` still owns its local 44 pt bordered back Pressable. Its existing `AppCard` content is already acceptable. Replace only that local back ownership with the shared glass icon button and extend the existing Social shell guard; do not churn the content cards or warning note.

### LG-3E — Social Share Workout material

**Complete.**

PR #523 delivered:

- shared `LiquidGlassIconButton` back navigation;
- active Liquid Glass palette resolution in the screen;
- adaptive `controlFill/controlBorder` material for caption input, managed-media preview, preview metric items and upload-progress track;
- focused guards preserving publish/idempotency/media-release contracts and the blur-free input/preview boundary.

The initial migration exposed a TypeScript contract mismatch after removing media-header/warning styles and also included unrelated visual adjustments. The final exact head restored the required `ShareWorkoutMediaCard` style contract and preserved the pre-existing typography, spacing, grid geometry, success styling and native Switch sizing. This keeps LG-3E a material migration rather than an incidental redesign.

Preserved: publishing state machine, `syncNow()` sequencing, idempotency, media release/cleanup, moderation/rate-limit handling, preview/share-control semantics, native Switch behavior, localization/accessibility and safe-area/keyboard behavior. No native blur was added behind publishing inputs or preview rows.

Exact head `6efd2e3e13222b037da8180d3fddddc13561a12e` passed repository/changed-file line audits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor in Mobile CI #1960; merge `32447156ece5b777b574a52288809f2025328147`.

After the Guidelines residual, continue remaining Settings/account, Sync & Backup, Social profile/detail, Progress detail, Coach detail and exercise detail/library surfaces by shared defect.

## LG-4 — Workouts

Migrate in order: hub/program cards → exercise library/builder → active workout chrome → set-table fields/states → finish/summary. Preserve active-session persistence, save/cancel/finish behavior, set/kg/reps alignment and dense table readability. Do not put native blur behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for bounded elevated/floating roles only.

## LG-6 — visual QA and stabilization

Require exact-head source/CI checks first. Physical cross-device/light-dark/Dynamic Type/keyboard/performance validation remains separately authorization-gated.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/Social integration must reuse existing Social authority rather than duplicate it. Exact code, tests, and current Git history override stale roadmap prose.
