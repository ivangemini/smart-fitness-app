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
- **LG-2A Home direct-surface pilot is active on `ui/liquid-glass-home-pilot`.**
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

**Active.**

Scope:

- add theme-aware ambient background depth from shared Liquid Glass tokens so bounded blur has material context;
- use one true-blur elevated surface for the Home hero summary, not per-row blur;
- replace the remaining flat profile affordance with a shared 44 pt glass icon control;
- allow existing shared glass action buttons to carry Lucide icons and use them on Home Start/Continue Workout, Add Food and Log Weight;
- flatten Weekly Snapshot from outer glass-card-plus-inner-tiles into a section heading with independently owned, non-blurred glass metric tiles;
- make shared `AppSection` copy resolve from `AppThemeProvider` rather than a local dark palette assumption;
- keep runtime top/bottom safe-area and floating-tab clearance explicit around the ambient backdrop;
- preserve all Home calculations, active-workout resume, routes, localization and semantic warning/positive states.

Exit criteria:

- no Home direct action/profile surface remains a flat opaque local control when an existing shared glass role applies;
- only the bounded hero uses backdrop blur;
- snapshot tiles remain non-blurred content glass;
- Home remains responsive in short/narrow layouts and owns >=44 pt interaction targets;
- full exact-head Mobile CI is green.

### LG-2B onward — remaining primary tabs

After LG-2A, audit/migrate coherent batches across:

- Nutrition diary/targets/search/recent/saved/add affordances;
- Progress trend/measurement/summary direct surfaces;
- Coach direct action/group surfaces;
- Profile goal/settings/action surfaces.

Rules:

- prefer shared primitives over local `rgba(...)` recipes;
- preserve semantic success/warning/error meaning;
- do not create backdrop blur per row in long lists;
- do not reopen already-correct responsive geometry;
- batch adjacent surfaces that share the same material defect rather than returning to one-screen micro-PR churn.

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
