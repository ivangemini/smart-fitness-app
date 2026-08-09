# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge the Smart Fitness mobile UI on the Liquid Glass material language already established by the floating bottom navigation while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization and backend contracts.

This phase replaces the previous assumption that every surface should remain a flat dark card. Dark mode remains a primary visual reference, but the implementation must remain coherent in light and system appearance.

## Status

- Phase 10 responsive source hardening is complete for the current source scope.
- VUX secondary-surface cleanup is complete through VUX-7F.
- **LG-1 shared foundation is complete:** PR #501, merge `ca11c1a66495ec71832a0abfd54fa4bbef0391c8`, exact-head Mobile CI #1922 passed.
- **LG-2A Home direct-surface pilot is complete:** PR #503, exact head `e93bbbdfe27b3c6858c3e17402d138751e98e9e5`, Mobile CI #1925 passed, merge `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`.
- No Liquid Glass runtime package is currently active; next priority is the Progress + Coach primary-surface audit.
- No OTA/EAS publication, native install/build or physical-device proof is part of autonomous source execution.

## LG-1 — shared foundation

**Status: complete.**

Delivered:

- central adaptive Liquid Glass token contract;
- reusable `LiquidGlassSurface`;
- `AppCard` migration;
- `PrimaryButton` / `SecondaryButton` theme-aware glass states;
- floating tab bar migration from local hardcoded material values to the shared adaptive token system;
- initial Home Summary and Home Snapshot semantic material migration;
- source-contract guards and blur/performance architecture rules.

The shared foundation deliberately avoids one backdrop blur per card/list row. Content surfaces use translucent material by default; true blur is reserved for bounded elevated/floating roles.

## LG-2 — primary tabs

**Goal:** remove remaining flat/opaque local presentation from the five public tabs where it conflicts with the shared material system.

### LG-2A — Home direct surfaces

**Status: complete.**

Delivered:

- theme-aware ambient background depth from shared Liquid Glass tokens;
- one bounded true-blur elevated Home hero surface;
- shared 44 pt Liquid Glass profile icon control with scale/haptic feedback rather than opacity feedback;
- optional Lucide icon support in shared Primary/Secondary buttons and Home Quick Actions;
- Start/Continue Workout, Add Food and Log Weight now carry the approved action icons;
- Weekly Snapshot no longer nests metric tiles inside another owning card; tiles are independently owned non-blurred glass surfaces;
- shared `AppSection` copy resolves from `AppThemeProvider` instead of a local dark palette assumption;
- explicit Home top safe-area and shared floating-tab bottom clearance around the ambient backdrop;
- Home calculations, active-workout resume, routes, localization and semantic warning/positive states remain unchanged.

Validation:

- exact head `e93bbbdfe27b3c6858c3e17402d138751e98e9e5` passed Mobile CI #1925 on the first PR run;
- repository/changed-file line audits, TypeScript, full regression suite, expanded model smoke, Expo export and Expo Doctor all passed;
- PR #503 merged as `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`;
- EAS update on merge was skipped; no publication occurred.

### LG-2B — Progress + Coach primary surfaces

**Next priority.**

Audit/migrate one coherent batch covering direct, visible Progress and Coach surfaces that still bypass the shared Liquid Glass material system.

Rules:

- keep charts, dense metrics and structured Coach output readable rather than placing blur behind every row;
- prefer shared primitives over local `rgba(...)` recipes;
- preserve semantic success/warning/error meaning;
- preserve existing Progress analytics and Coach domain behavior;
- do not reopen already-correct responsive geometry;
- use true blur only for bounded elevated/priority chrome where it materially improves hierarchy.

### LG-2C — Nutrition primary surfaces

After Progress + Coach, migrate diary summaries, section ownership and actions while keeping dense food rows fast and legible. Do not create a blur view per food row.

### LG-2D — Profile primary surfaces

After Nutrition, converge Profile goals/settings/actions onto the proven shared material system while preserving the theme/safe-area work already completed.

## LG-3 — secondary surfaces

**Goal:** converge child routes after the primary visual language is stable.

Targets include:

- Settings and account;
- Sync & Backup;
- Social surfaces;
- Progress weight/history detail;
- Nutrition add/edit/detail flows;
- Coach review/proposal/history/recovery/limitations flows;
- Exercise detail/library surfaces outside the active workout logger.

Batch adjacent screens that share the same material defect instead of creating one PR per screen.

## LG-4 — Workouts system

**Goal:** migrate the intentionally dark Lyfta-like workout experience without sacrificing dense logger ergonomics.

Order:

1. Workouts hub and program/routine cards;
2. exercise library and program builder;
3. active workout chrome and exercise containers;
4. set table fields/selection/completion states;
5. finish/summary surfaces.

Constraints:

- preserve active-session persistence and save/cancel/finish behavior;
- keep set/kg/reps alignment and dense table readability;
- keep input controls visually stronger than decorative glass;
- do not place expensive blur views behind every set row.

## LG-5 — elevated chrome and motion

**Goal:** extend the strongest Liquid Glass effect only to surfaces where it adds hierarchy.

Candidates:

- sticky action bars;
- modal/sheet headers;
- compact floating selectors;
- bounded context controls.

Use true blur selectively. Reuse spring/haptic language where interaction semantics justify it; do not animate static content gratuitously.

## LG-6 — visual QA and stabilization

Source/CI checks:

- no regression to local duplicated glass token sets in migrated shared surfaces;
- line-limit, TypeScript, full regression, model smoke, Expo export and Expo Doctor green;
- source guards preserve 44 pt ownership and explicit disabled states.

Physical validation when separately authorized:

- iPhone short/tall devices;
- Android inset/blur fallback;
- light/dark/system;
- EN/RU and large Dynamic Type;
- keyboard-open forms;
- populated/empty/loading/error/success/disabled states;
- scroll and animation performance on list-heavy screens.

## Execution rule

Prefer **larger coherent migration batches** over one-screen micro-PRs. A batch may cover shared primitives plus several adjacent visible surfaces when they share the same material contract, provided exact-head CI validates the complete change and domain behavior remains untouched.
