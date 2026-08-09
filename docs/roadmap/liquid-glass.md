# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge Smart Fitness on the Liquid Glass material language while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, and backend contracts.

Home is explicitly **social-first hybrid**: personal fitness context stays immediately visible while the continuously updating Social feed is the main scroll surface and retention loop.

## Status

- Phase 10 responsive source hardening is complete for the current source scope.
- VUX secondary-surface cleanup is complete through VUX-7F.
- **LG-1 shared foundation complete:** PR #501, merge `ca11c1a66495ec71832a0abfd54fa4bbef0391c8`, Mobile CI #1922.
- **LG-2A original Home Liquid Glass pilot complete:** PR #503, merge `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`, Mobile CI #1925.
- **LG-H1 social-first Home complete:** PR #505, exact green head `9f28c198ed75070bcf10484ef09a28a78cbc5571`, Mobile CI #1931, merge `9c9e67a929d10e9f91475c92ba0b579bbadbb805`.
- **LG-2B Progress + Coach primary surfaces complete:** PR #507 / Mobile CI #1937 plus PR #509 / Mobile CI #1943, merge `7355c0aa8b4b94a7cac8a7682acba90808739b77`.
- **LG-2C Nutrition primary surfaces complete:** PR #511 / Mobile CI #1947, merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- **LG-2D Profile primary surfaces complete:** PR #513 / Mobile CI #1949, merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.
- **LG-3A Settings controls/disclosures complete:** PR #515 / Mobile CI #1951, merge `be332729c070bbdf5050536d038b270656a5f0e8`.
- **LG-3B Nutrition secondary surfaces complete:** PR #517, exact green head `f3d4a2a6977e96ba3672a1d6b663145509aa0bc5`, Mobile CI #1953, merge `8f7df7507c3a833cdfa82b636820080106b15b9c`.
- **LG-3C Social interaction controls is active.**
- LG-H2 Stories and LG-H3 Steps remain blocked by required server/native contracts and must not be faked to unblock UI work.
- No OTA/EAS publication, native install/build, or physical-device proof is implied by these source changes.

## LG-1 — shared foundation

**Status: complete.** Adaptive Liquid Glass tokens, reusable surfaces, shared card/buttons, adaptive floating navigation, semantic material states, source guards, and blur/performance rules are established. Dense content stays translucent without one native blur per row; true backdrop blur is reserved for bounded elevated/floating roles.

## LG-H — social-first Home

### LG-H1 — expandable daily metrics + existing Social feed

**Status: complete.** Home keeps compact personal metrics above the existing server-authoritative chronological Following Feed. Social remains separate from private revisioned `AppState` synchronization.

### LG-H2 — Stories contracts and rail

**Status: planned; blocked on real Social contracts.** Define story DTO/schema, expiry, ownership, follow/block/private-profile enforcement, media lifecycle/moderation, viewed state, retention/deletion, pagination/loading and privacy-safe cache contracts before UI implementation. Do not add fake story content.

### LG-H3 — real steps / activity source

**Status: planned; blocked on reviewed native source/permissions.** Do not infer steps from workouts or fabricate values. HealthKit/Health Connect/native dependency, permission disclosure and physical runtime evidence remain separately approval-gated.

### LG-H4 — feed retention refinement

**Status: planned after the base Home feed is stable.** Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## LG-2 — primary tabs

LG-2B Progress + Coach, LG-2C Nutrition primary, and LG-2D Profile primary are complete for source/CI scope. Product/domain semantics, persistence/sync contracts, localization, accessibility and responsive ownership were preserved.

## LG-3 — secondary surfaces

**Status: active.** Converge secondary surfaces in coherent batches by shared material defect rather than one PR per route.

### LG-3A — Settings controls and disclosures

**Status: complete for source/CI scope.** PR #515 moved Settings back navigation, shared `SegmentedControl`, and Personal Details formula radios to shared/adaptive control/accent material with explicit neutral/selected pressed states and no per-row native blur.

### LG-3B — Nutrition secondary surfaces

**Status: complete for source/CI scope.**

PR #517 migrated:

- Nutrition date-picker day/header/month controls to adaptive `control*` / `accent*` material with explicit neutral/selected pressed states;
- centralized Add Food material resolution in `createAddFoodStyles(colors)` using the active theme palette, without editing the large Add Food orchestration route;
- Add Food base/sheet/scanner style factories from direct legacy surface recipes to adaptive card/control/accent tokens;
- sheet/scanner/status/input/action material without native blur on dense or camera-backed surfaces.

Preserved: 42-cell calendar generation, localized dates, logged-day markers, return routing, Add Food search/library/provider results, favorites, meal templates, food-entry mutation/persistence, barcode/manual-food/scanner behavior, keyboard/reflow, touch ownership, and the existing `expo-camera` permission/dependency contract.

Exact head `f3d4a2a6977e96ba3672a1d6b663145509aa0bc5` passed repository/changed-file line audits, TypeScript, full regression, expanded model smoke, Expo export, and Expo Doctor in Mobile CI #1953; merge `8f7df7507c3a833cdfa82b636820080106b15b9c`.

### LG-3C — Social interaction controls

**Status: active.**

Audited bounded scope:

- `SocialReportModal`: move report reason rows/radios and sheet owner from `surfaceSecondary` / `surfacePrimary` / `accentSoft` + opacity press feedback to adaptive card/control/accent material with explicit neutral/selected pressed states;
- preserve report target selection, moderation reason codes, rate-limit/error handling, submit/success state, disabled semantics and server-authoritative Social API behavior;
- `SocialRelationshipListsScreen`: replace its local 44 pt back control with shared `LiquidGlassIconButton` and migrate relationship tabs to adaptive neutral/selected/pressed material while preserving `tab` selected accessibility, paging, stale-request protection, and relationship actions;
- `SocialRelationshipListsScreen.styles.ts`: migrate tab and avatar fallback material while retaining lightweight profile-link feedback and existing `AppCard` ownership;
- do not change Social API contracts, privacy/visibility rules, moderation authority, pagination, follow/request actions, cache semantics, or add native blur per list item/modal option.

After LG-3C, continue remaining Settings/account, Sync & Backup, Social detail, Progress detail, Coach detail, and exercise detail/library surfaces by shared defect.

## LG-4 — Workouts system

Migrate in order: hub/program cards → exercise library/builder → active workout chrome → set-table fields/states → finish/summary. Preserve active-session persistence, save/cancel/finish behavior, set/kg/reps alignment and dense table readability. Do not put native blur behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for bounded elevated/floating roles such as sticky action bars, modal/sheet headers and compact floating selectors.

## LG-6 — visual QA and stabilization

Require exact-head source/CI checks first. Physical cross-device/light-dark/Dynamic Type/keyboard/performance validation remains separately authorization-gated.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/Social integration must reuse existing Social authority rather than duplicate it. Exact code, tests, and current Git history override stale roadmap prose.
