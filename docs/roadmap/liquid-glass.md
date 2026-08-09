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
- **LG-2C Nutrition primary surfaces complete:** PR #511, exact green head `e1dfaed79f45080d06dd2d590a757e5547f4111b`, Mobile CI #1947, merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- **LG-2D Profile primary surfaces complete:** PR #513, exact green head `aa22621db120b523ddab8a04aacb3077aa9f91ed`, Mobile CI #1949, merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.
- **LG-3 secondary surfaces is active.**
- LG-H2 Stories and LG-H3 Steps remain blocked by required server/native contracts and must not be faked to unblock UI work.
- No OTA/EAS publication, native install/build, or physical-device proof is implied by these source changes.

## LG-1 — shared foundation

**Status: complete.**

Delivered adaptive Liquid Glass tokens, reusable `LiquidGlassSurface`, shared card/buttons, adaptive floating navigation, semantic Home material states, source guards, and blur/performance rules. Content glass remains translucent without one native blur per card/list row. True backdrop blur is reserved for bounded elevated/floating roles.

## LG-H — social-first Home

### LG-H1 — expandable daily metrics + existing Social feed

**Status: complete.**

Delivered one compact expandable Liquid Glass daily-metrics owner, real workout/program schedule context, unavailable Steps rather than fabricated data, and the existing server-authoritative chronological Following Feed directly on Home. Social remains separate from private revisioned `AppState` synchronization.

### LG-H2 — Stories contracts and rail

**Status: planned; blocked on real Social contracts.** Stories belong between personal metrics and feed. Before implementation define and review story DTO/schema versions and expiry semantics; create/delete ownership; author/follow/block/private-profile enforcement; image/video lifecycle and moderation boundaries; viewed state; bounded retention/account deletion; rail pagination/loading; and privacy-safe cache policy. Do not add fake story content.

### LG-H3 — real steps / activity source

**Status: planned; blocked on reviewed native source/permissions.** Do not infer steps from workouts or fabricate values. HealthKit/Health Connect/native dependency, permission disclosure, and physical runtime evidence remain separately approval-gated.

### LG-H4 — feed retention refinement

**Status: planned after the base Home feed is stable.** Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## LG-2 — remaining primary tabs

### LG-2B — Progress + Coach primary surfaces

**Status: complete for source/CI scope.** PR #507 migrated Progress primary controls/chart shell and PR #509 finished Safety/Recovery material ownership. Coach primary already used shared primitives.

### LG-2C — Nutrition primary surfaces

**Status: complete for source/CI scope.** PR #511 migrated primary Nutrition header controls, week states, macro summary, meal groups, diary shell and action controls to adaptive glass material without native blur per dense row. Calculations, targets, date/day semantics, diary grouping, add/edit routing, persistence/sync, localization/accessibility, SectionList virtualization, keyboard/reflow and touch ownership were preserved.

### LG-2D — Profile primary surfaces

**Status: complete for source/CI scope.**

PR #513 completed the bounded Profile primary migration:

- Profile Settings uses shared 44 pt `LiquidGlassIconButton` rather than a screen-local material recipe;
- goals disclosure uses shared `LiquidGlassSurface` `variant="control"` with adaptive `controlPressedFill` and no native blur;
- `SocialProfileEntryCard` retains shared `AppCard`/`SecondaryButton` structure while text follows the active app theme rather than static `Colors.dark` values;
- source guards cover shared material ownership and theme adaptation.

Profile state, goal validation/save behavior, nutrition-target recalculation, routes, localization, accessibility, safe-area/scroll behavior, and interaction ownership were unchanged.

Exact head `aa22621db120b523ddab8a04aacb3077aa9f91ed` passed repository/changed-file line audits, TypeScript, full regression, expanded model smoke, Expo export, and Expo Doctor in Mobile CI #1949; merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.

## LG-3 — secondary surfaces

**Status: active.**

Converge Settings/account, Sync & Backup, Social detail, Progress detail, Nutrition add/edit/detail, Coach detail, and exercise detail/library surfaces. Batch adjacent surfaces sharing the same material defect rather than creating one PR per screen.

First audited package: **Settings controls and disclosures**.

- `src/app/settings/index.tsx` is already largely composed from `AppCard`, `SecondaryButton`, and `SegmentedControl`; replace the remaining local 44 pt back-control material with the shared glass icon control.
- `src/components/ui/SegmentedControl.tsx` is a shared secondary-surface defect: container/selected/pressed states still use direct `surfaceSecondary` / `surfacePrimary` / `backgroundSelected`. Migrate the shared control itself to adaptive glass tokens while preserving tab roles and 44 pt segments.
- `src/features/settings/PersonalDetailsSettingsCard.tsx` formula options still own direct local `surfaceSecondary` / selected material; migrate those radio controls to the same adaptive control/accent token language without touching validation/save behavior.
- Settings privacy/about/sync rows already live inside shared `AppCard`; divider-only semantic separators do not need artificial card/blur wrappers.
- Do not add native blur per setting row or disclosure.

After the first Settings batch, continue through adjacent secondary surfaces by shared material defect, not route count.

## LG-4 — Workouts system

Migrate deliberately in this order:

1. Workouts hub and program/routine cards;
2. exercise library and program builder;
3. active workout chrome and exercise containers;
4. set-table fields/selection/completion states;
5. finish/summary surfaces.

Preserve active-session persistence, save/cancel/finish behavior, set/kg/reps alignment, dense table readability, and strong input controls. Do not place expensive blur views behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for sticky action bars, modal/sheet headers, compact floating selectors, and other bounded context controls. Reuse spring/haptic language where interaction semantics justify it.

## LG-6 — visual QA and stabilization

Source/CI checks: no regression to duplicated local glass token sets; line limits, TypeScript, full regression, model smoke, Expo export, and Expo Doctor green; source guards preserve 44 pt ownership and explicit disabled states.

Physical validation when separately authorized covers short/tall iPhones, Android fallback, light/dark/system, EN/RU, Dynamic Type, keyboard states, populated/empty/loading/error/success/disabled states, and list/animation performance.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/Social integration must reuse existing Social authority rather than duplicate it. Exact code, tests, and current Git history override stale roadmap prose.
