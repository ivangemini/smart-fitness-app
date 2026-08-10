# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-10

Architecture contracts:

- `docs/architecture/liquid-glass-ui.md`
- `docs/architecture/responsive-mobile-ui.md`

## Objective

Converge Smart Fitness on Liquid Glass while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, Social authority/privacy and backend contracts.

Home remains a social-first hybrid: compact personal metrics → server-authoritative Stories → chronological Following Feed.

## Status

- Phase 10 responsive source hardening: complete for current source scope.
- LG-1 foundation through LG-3I approved packages: complete.
- LG-H1 social-first Home: complete.
- LG-H2 Stories: complete for the current image-only v1 source scope.
- Progress/exercise secondary-material reassessment: complete for current active source scope.
- **LG-4 Workouts material convergence: source-complete.**
- **LG-5 QA and bounded polish: active with 24 demonstrated-defect runtime batches merged through PR #595.**
- Latest runtime mobile `main`: `079817f30b625a9424a7be6011aa8b15d0de2676`.
- PR #590 exact head `adeda4fc66490cd2e2ad05ca84454f962cc6c31d` passed Mobile CI #2118.
- PR #591 exact head `1ef8da30bebe13fa9b0407acb82ac44cb50208cd` passed Mobile CI #2122.
- PR #593 exact head `1edade7075999ba5bc210fe8456a3d73531d0a2b` passed Mobile CI #2124.
- PR #595 exact head `b09be182a5b55d8c5a19a7203adfa1a1b222efae` passed Mobile CI #2126.
- Coach product/material expansion remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- Source/CI completion does not imply physical-device, native-release, backend deployment, provider or production activation evidence.

## LG-5 — QA and bounded polish active

LG-5 is validation-first. Runtime work requires a concrete defect; no broad source migration package is authorized merely for visual churn.

Earlier LG-5 package history is retained in `docs/current-status.md`, `docs/handoffs/latest.md` and merged PR history. Key recent batches:

### Batch 21 — PR #590: Safety & Recovery Review virtualization

One top-level `FlatList` now owns unbounded restriction/finding rows with stable semantic identity while preserving deterministic Coach/review semantics and one contiguous result material group.

### Batch 22 — PR #591: residual Coach navigation convergence

Six existing Coach surfaces now delegate back navigation to the shared 44×44 `LiquidGlassIconButton`; obsolete local navigation material recipes were removed without changing run/history/preflight/proposal behavior.

### Batch 23 — PR #593: Workouts History floating material

The live Workouts-tab History floating action now delegates visible material to shared elevated `LiquidGlassSurface` with bounded blur and tokenized fill-based pressed feedback. `/workout-history`, accessibility/localization, safe-area floating-tab clearance and 44 pt geometry remain preserved.

### Batch 24 — PR #595: Weight Entry shared form contract

Confirmed defect:

- Weight Entry duplicated a local label/TextInput/error recipe despite the shared `FormField` contract.

Fix:

- Weight Entry now delegates to `FormField` and inherits its programmatic accessibility label, focus state, error border and `InlineError` behavior;
- decimal keyboard, unit-aware parsing/conversion, canonical kg persistence through `addWeightEntry`, UUID/date creation, keyboard-aware scrolling, safe-area clearance and save/cancel routing remain preserved;
- a focused source-contract guard covers the shared form owner and preserved persistence/navigation behavior.

Exact validated head: `b09be182a5b55d8c5a19a7203adfa1a1b222efae`; Mobile CI #2126 passed before merge.

## LG-5 validation matrix

Continue reviewing:

- light / dark / system appearance;
- narrow phone width and short phone height;
- modern iPhone safe areas and Android system-navigation insets;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long collections and pagination/virtualization boundaries;
- stable semantic identity for React keys/list items;
- elevated-material and blur/fallback behavior;
- direct-interaction pressed-state material feedback;
- Active Session lifecycle and RPE;
- workout create/edit/save/program attachment;
- completed-history retention, list/detail navigation and read-only review.

## Current bounded evidence / next inspection

- **No broad/pre-authorized runtime package remains after PR #595.** Change source only for a demonstrated defect.
- **Next confirmed bounded package: read-only `WorkoutHistoryScreen` material feedback.** Filter chips, clear/reset actions and history-card presses still use opacity-only pressed styling. Filter/reset controls also own local opaque theme fills rather than Liquid Glass control/accent tokens. Correct only these presentation/material boundaries.
- Preserve `filterWorkoutHistory`, route filter parsing, period/program/safety/date-range semantics, stable `session.id` keys, top-level `FlatList`, units/localization, safe-area padding and read-only detail navigation.
- Existing localization/units tests already protect semantic boundaries; add focused material guards only.
- `QuickActionsCard` uses displayed/localized `action.label` as a key, but live usage is not established because repository code search is not indexed. Do not change unused/theoretical code merely for cleanliness.
- Weight Details is no-change evidence: recent history is intentionally capped at 10 entries, uses stable IDs and 44 pt rows.
- Home/Profile/Coach/Nutrition/Settings controls from the post-#593 audit remain no-change evidence unless a new concrete defect emerges.
- `ProgramDetailScreen` remains bounded by the seven-day `WeekdayKey` structure.

## LG-5 execution rule

1. Inspect a bounded surface/shared primitive against responsive, theme, material, localization, accessibility and safe-area contracts.
2. Reuse existing evidence when the boundary already complies.
3. If no concrete defect exists, do not create source churn.
4. If a defect exists, fix the smallest coherent boundary while preserving product behavior.
5. Runtime PRs merge only after exact-head Mobile CI is green and review blockers are clear.
6. Source/CI validation never substitutes for physical-device release evidence.

## CI execution note

PR #562 moved routine authoritative Mobile CI to Hermes; #563 skips only duplicate merge-generated post-merge runs; #564 persists the policy in `AGENTS.md`.

Backend PR #215 remains separate infrastructure work and must not merge until its required exact-head Hermes validation actually executes and passes.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention/ranking

Later. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain product/material expansion remains deferred unless explicitly reprioritized. Bounded LG-5 fixes to demonstrated defects on live Coach surfaces do not reopen that product phase.

## Later execution

1. Implement the bounded `WorkoutHistoryScreen` material/pressed-state package and validate the exact head.
2. Continue LG-5 validation-first QA; establish live usage before acting on `QuickActionsCard` identity.
3. Record no-change evidence instead of refactoring already compliant surfaces.
4. Collect physical-device evidence only when separately authorized.
5. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent evidence-backed packages over cosmetic churn. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
