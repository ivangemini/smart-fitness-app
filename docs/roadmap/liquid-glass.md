# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge the Smart Fitness mobile UI on the Liquid Glass material language already established by the floating bottom navigation while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization and backend contracts.

This phase replaces the previous assumption that every surface should remain a flat dark card. Dark mode remains a primary visual reference, but the implementation must remain coherent in light and system appearance.

## Status

- Phase 10 responsive source hardening is complete for the current source scope.
- VUX secondary-surface cleanup is complete through VUX-7F.
- LG-1 shared foundation PR #501 merged as `ca11c1a66495ec71832a0abfd54fa4bbef0391c8`; exact head `a2bcdb49fd89caa329dbdab30e439b12b5677496` passed Mobile CI #1922.
- **LG-2 primary-tab migration is active on `ui/liquid-glass-primary-tabs`.**
- No OTA/EAS publication, native install/build or physical-device proof is part of autonomous source execution.

## LG-1 — shared foundation — complete

**Goal:** make the existing bottom navigation the canonical material source instead of an isolated effect.

Completed:

- central adaptive Liquid Glass token contract;
- reusable glass surface primitive;
- AppCard migration;
- PrimaryButton / SecondaryButton migration;
- floating tab bar migration from local hardcoded glass colors to shared adaptive tokens;
- Home Summary and Home Snapshot semantic material migration;
- source-contract guards for shared glass behavior;
- blur/performance architecture contract.

The shared card intentionally uses material translucency without enabling one native blur per card. True backdrop blur remains reserved for bounded elevated/floating chrome such as the tab bar.

## LG-2 — primary tabs — active

**Goal:** remove remaining flat/opaque local presentation from the five public tabs where it conflicts with the shared material system.

### LG-2A — direct primary-tab controls and Nutrition diary materials

Current batch:

- replace duplicate Home/Profile circular header controls with one shared glass icon button;
- migrate Nutrition calendar, today, streak, week-day, macro-summary, meal-group, meal-action and food-list materials to the shared glass palette;
- preserve Nutrition selected/disabled semantics, meal expansion, edit/add routes and 44 pt effective interaction ownership;
- keep Coach unchanged where its visible surfaces already inherit LG-1 through AppCard/AppButton.

### Remaining LG-2 audit

- Progress range selectors and any direct chart/measurement materials not inherited from AppCard;
- Profile child surfaces that still define opaque local materials outside shared cards;
- Home direct surfaces only if concrete leftovers remain after LG-2A;
- Nutrition child/detail affordances belong to LG-3 unless they are part of the visible diary surface.

Rules:

- prefer shared primitives over local `rgba(...)` recipes;
- preserve semantic success/warning/error meaning;
- do not create backdrop blur per row in long lists;
- do not reopen already-correct responsive geometry;
- batch adjacent surfaces with the same material contract instead of one-screen PRs.

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
