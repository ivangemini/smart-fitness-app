# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge Smart Fitness on the Liquid Glass material language while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, and backend contracts.

Home remains **social-first hybrid**: compact personal fitness context above the continuously updating Social feed.

## Status

- Phase 10 responsive source hardening is complete for the current source scope.
- VUX secondary-surface cleanup is complete through VUX-7F.
- **LG-1 foundation:** PR #501 / Mobile CI #1922.
- **LG-2A Home pilot:** PR #503 / Mobile CI #1925.
- **LG-H1 social-first Home:** PR #505 / Mobile CI #1931.
- **LG-2B Progress + Coach primary:** PR #507 + #509 / Mobile CI #1937 + #1943 / merge `7355c0aa8b4b94a7cac8a7682acba90808739b77`.
- **LG-2C Nutrition primary:** PR #511 / Mobile CI #1947 / merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- **LG-2D Profile primary:** PR #513 / Mobile CI #1949 / merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.
- **LG-3A Settings controls/disclosures:** PR #515 / Mobile CI #1951 / merge `be332729c070bbdf5050536d038b270656a5f0e8`.
- **LG-3B Nutrition secondary:** PR #517 / Mobile CI #1953 / merge `8f7df7507c3a833cdfa82b636820080106b15b9c`.
- **LG-3C Social interaction controls complete:** PR #519, exact green head `d739a5406490e38773e9acc91e69605a21184c98`, Mobile CI #1955, merge `7a9274d910c0e2dfc8bd270d0d1dc332989d6863`.
- **LG-3D Social shell + notification controls is active.**
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

**Complete for source/CI scope.**

PR #519 delivered:

- `SocialReportModal` sheet/reason/radio material on adaptive elevated/control/accent tokens with explicit neutral/selected pressed states;
- shared `LiquidGlassIconButton` for relationship-list back navigation;
- adaptive relationship tabs and avatar fallback material;
- opacity feedback retained only for the lightweight profile link inside the existing `AppCard`.

Preserved: Social report reason/submit/success/error/rate-limit semantics, API authority, relationship paging/stale-request protection, cursor handling, approve/reject/cancel/unfollow actions, profile routing, privacy/visibility rules and cache contracts. No native blur was added per report option/list item.

Exact head `d739a5406490e38773e9acc91e69605a21184c98` passed repository/changed-file line audits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor in Mobile CI #1955; merge `7a9274d910c0e2dfc8bd270d0d1dc332989d6863`.

### LG-3D — Social shell + notification controls

**Status: active.**

Audited bounded scope:

- `SocialNotificationScreen`: replace local back control with shared `LiquidGlassIconButton`; migrate notification-card and avatar-fallback material from direct legacy surfaces to adaptive card/control tokens with explicit pressed feedback while preserving optimistic-read behavior, API marking and profile/post routing;
- `SocialCommunityGuidelinesScreen`: replace only the local 44 pt back material with the shared icon primitive; existing `AppCard` section ownership stays unchanged;
- `SocialProfileLookupScreen`: replace only the local back material with shared `LiquidGlassIconButton`; preserve keyboard/safe-area behavior, username validation/normalization, auth route and public-profile routing;
- update existing Social shell/profile-lookup guards to assert shared back ownership rather than the old direct Chevron implementation;
- do not include Share Workout in this batch; its publishing/media form has broader material and domain risk and remains a later LG-3 package;
- no native blur per notification card or shell control.

After LG-3D, continue remaining Settings/account, Sync & Backup, Social publishing/detail, Progress detail, Coach detail and exercise detail/library surfaces by shared defect.

## LG-4 — Workouts

Migrate in order: hub/program cards → exercise library/builder → active workout chrome → set-table fields/states → finish/summary. Preserve active-session persistence, save/cancel/finish behavior, set/kg/reps alignment and dense table readability. Do not put native blur behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for bounded elevated/floating roles only.

## LG-6 — visual QA and stabilization

Require exact-head source/CI checks first. Physical cross-device/light-dark/Dynamic Type/keyboard/performance validation remains separately authorization-gated.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/Social integration must reuse existing Social authority rather than duplicate it. Exact code, tests, and current Git history override stale roadmap prose.
