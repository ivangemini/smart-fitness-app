# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-11

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
- LG-H2 Stories: complete for current image-only v1 source scope.
- Progress/exercise secondary-material reassessment: complete for current active source scope.
- **LG-4 Workouts material convergence: source-complete.**
- **LG-5 QA and bounded polish: active with 34 demonstrated-defect runtime batches merged through PR #607.**
- Latest runtime mobile merge before the docs checkpoint: PR #607, merge `2e9d46baf5c311a16f8399b1f885bad34317ee6f`.
- Latest exact validated runtime head: PR #607 `642102c89a6cc21bfd924e0ecfa6c5276613b124`; Mobile CI #2155 run `31465438807` fully green before merge.
- PR #608 synchronized `docs/current-status.md` and `docs/handoffs/latest.md` with that runtime checkpoint.
- Coach product/material expansion remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- Source/CI completion does not imply physical-device, native-release, backend deployment, provider or production activation evidence.

## LG-5 — QA and bounded polish active

LG-5 is validation-first. Runtime work requires a concrete defect; no broad source migration package is authorized merely for visual churn.

Earlier LG-5 package history remains in `docs/current-status.md`, merged PR history and Git. Recent batches are recorded here because they define the current interaction-material boundary.

### Batch 25 — PR #597: Workout History material feedback

Read-only Workout History filter chips, clear/reset actions and history-card presses use Liquid Glass control/accent fill feedback instead of generic opacity. Filtering, stable `session.id`, units/localization, safe area and detail navigation are preserved.

Exact head `9604d8bacb981a7855c07ef30932ecbb4abdf7b1`; Mobile CI #2130.

### Batch 26 — PR #598: Safety row virtualization boundaries

Completed-history Safety restrictions/findings and pre-workout Safety Gate rows belong to one screen-level virtualized boundary per screen rather than eager unbounded rendering. Historical immutability and pre-workout acknowledgement semantics remain preserved.

Exact head `c29ea3cac234ed9057b20674ecc94dbf2c0051df`; Mobile CI #2133.

### Batch 27 — PR #599: workout direct-action material feedback

Safety Gate acknowledgement/update and Workout Session Finish resume/clear/media/discard actions use material-specific control/accent/destructive pressed fills rather than a shared opacity recipe.

Exact head `56fe0939f9232eb47d4952a24759c707d29abe45`; Mobile CI #2135.

### Batch 28 — PR #600: template not-found shared action

Workout Template Detail not-found fallback delegates to shared `SecondaryButton`, preserving template actions/start lifecycle and exercise virtualization.

Exact head `db3f330fe47b016927d705889bea5c6369ab19e3`; Mobile CI #2138.

### Batch 29 — PR #601: Program interaction materials

Program Detail and Program Builder direct actions use control/accent material-specific feedback instead of one `opacity: 0.72` style. Program save/favorite/delete/remove, Builder discard protection, serialization, workout attach/create/edit/remove and keyboard behavior remain unchanged.

Exact head `8860ab9a63ae66d3ee48ab99af8c01bddbf444cd`; Mobile CI #2140.

### Batch 30 — PR #602: New Routine interaction materials

New Routine header actions, exercise header/menu, Add Set/Add Exercises, picker rows/Done and exercise action menu use control/accent/destructive material feedback. Routine serialization, program attachment, picker virtualization, keyboard insets and safe area remain preserved.

Exact head `f7eb3d7ca45d560e21d6c9e9a0b38136bb75d63a`; Mobile CI #2142.

### Batch 31 — PR #603: Exercise Library interaction materials

Exercise Library retry, exercise rows/details and selected/unselected filter chips own distinct Liquid Glass material states. Repository/provider load/search/filter behavior, result `FlatList`, stable exercise IDs, recent cap, session-draft add flow and measured footer remain unchanged.

Exact head `d78b759b6726f1416198456415f99dd399eed144`; Mobile CI #2144 run `31461541030`.

### Batch 32 — PR #605: Active Session interaction materials

Exercise expand/collapse, exercise menu, rest timer, Add Set, set-completion/RPE, RPE selection, overflow/replacement and cancel interactions use material-specific Liquid Glass feedback. Active-session draft persistence, set calculations, completion/RPE timing and semantics, replacement/discard behavior, routes and virtualization boundaries remain unchanged.

Exact head `aabfe05b4572f1dbb5c9c83f557a454a6e0a4a3c`; Mobile CI #2150 run `31462888466`; merge `f46f9ed0e9de02aa4431edd428415762752ffdcf`.

### Batch 33 — PR #606: workout-session preparation localization

The live `/workout-session` preparation state uses the existing localized Safety Gate copy boundary instead of hard-coded English. Draft hydration, acknowledgement lookup/capture, Safety metadata persistence and gate/session routing remain unchanged.

Exact head `10a67c251d681ca69355ef0354ce3017b864459c`; Mobile CI #2152 run `31463444416`; merge `b41f7a0762281bd28a1c1b12e6e4b5cc4f3a4a51`.

### Batch 34 — PR #607: Workouts Exercise Library theme/material

The live `/workouts/exercise-library` route, virtualized browser, filters, favorites, detail sheet and custom-exercise controls derive active colors from `AppThemeProvider` and Liquid Glass material tokens instead of hard-coded dark colors/generic opacity. Exact-head CI also exposed and validated the bounded legacy-card style-factory compatibility fix. `SectionList`, stable exercise IDs, favorites/search/filter/recent/similar/custom-exercise behavior, localization and safe-area ownership remain unchanged.

Exact head `642102c89a6cc21bfd924e0ecfa6c5276613b124`; Mobile CI #2155 run `31465438807`; merge `2e9d46baf5c311a16f8399b1f885bad34317ee6f`.

## Earlier LG-5 package index

The first 24 demonstrated-defect runtime batches are:

- #559 Create Program keyboard/safe-area reachability.
- #560 Program Add Workout + New Routine responsive/touch-target hardening.
- #561 shared long/localized text resilience.
- #565 shared SectionHeader theme consistency.
- #567 shared state theme consistency.
- #568 auth/account appearance consistency.
- #569 onboarding appearance consistency.
- #570 Exercise Detail loading-state ownership.
- #571 Share Workout state/theme resilience.
- #572 bounded Coach theme consistency.
- #573 paginated Social collection virtualization.
- #574 workout-post comment virtualization.
- #577 completed-workout exercise-group virtualization.
- #579 Workout Template Detail exercise virtualization.
- #580 Progress body-measurement keyboard reachability.
- #581 Coach Run History virtualization.
- #583 Account Sessions virtualization.
- #584 User Limitations virtualization.
- #585 Sync Conflict Review virtualization.
- #586 Active Session exercise virtualization.
- #590 Safety & Recovery Review result virtualization.
- #591 residual Coach navigation convergence.
- #593 Workouts History floating material convergence.
- #595 Weight Entry shared form/accessibility convergence.

PR #576 is a scope/documentation correction, not a runtime batch. PR #604 is the docs-only checkpoint through PR #603. PR #608 synchronizes the canonical status/handoff through PR #607.

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
- Active Session lifecycle, set entry and RPE;
- workout create/edit/save/program attachment;
- completed-history retention, list/detail navigation and read-only review.

## Current bounded evidence / next package

- **No broad/pre-authorized runtime package remains after PR #607.** Change source only for a reproduced or source-demonstrated defect.
- The previously confirmed Active Session package is complete in #605.
- The live `/workout-history` list/detail boundary is the canonical completed-history surface and remains read-only. It owns screen-level `FlatList` virtualization, stable session/row IDs, active theme and safe-area padding. The older `/workouts/history` implementation is not the tab-routed owner; do not mutate its edit/delete behavior merely from static presence without proving live reachability.
- Recheck remaining live Workouts-adjacent routes for residual hard-coded appearance, generic opacity-only feedback on translucent/material controls, compact-height/text-scaling reachability and safe-area ownership.
- Preserve one suitable virtualized owner for potentially long collections and stable semantic IDs.
- Preserve workout/program lifecycle, active-session persistence, completed-history read-only semantics, exercise-provider/repository behavior and existing route contracts.
- `QuickActionsCard` localized `action.label` key remains a candidate only until live usage is established.
- Weight Details remains intentionally capped to 10 rows with stable IDs.
- Home/Profile/Coach/Nutrition/Settings previously audited shared controls remain no-change evidence until a new defect emerges.
- Program Detail remains bounded by the seven-day `WeekdayKey` structure.

If inspection shows no defect, record/reuse no-change evidence and move on. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

## LG-5 execution rule

1. Inspect a bounded live surface/shared primitive against responsive, theme, material, localization, accessibility and safe-area contracts.
2. Establish route/live usage before modifying legacy or candidate code.
3. Reuse existing evidence when the boundary already complies.
4. If no concrete defect exists, do not create source churn.
5. If a defect exists, fix the smallest coherent boundary while preserving product behavior.
6. Runtime PRs merge only after exact-head Mobile CI is green and review blockers are clear.
7. Source/CI validation never substitutes for physical-device release evidence.

## CI execution note

PR #562 moved routine authoritative Mobile CI to Hermes; #563 skips only duplicate merge-generated post-merge runs; #564 persists the policy in `AGENTS.md`.

Backend PR #215 remains separate infrastructure work. It is still draft/open at `0826ff18dac7d4afe78943d9881c5a530507f1af`; all three required exact-head Hermes workflows remain queued, so it must not merge.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention/ranking

Later. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain product/material expansion remains deferred unless explicitly reprioritized. Bounded LG-5 fixes to demonstrated defects on live Coach surfaces do not reopen that product phase.

## Later execution

1. Continue LG-5 validation-first QA from the post-#607 live-route state and record no-change evidence instead of refactoring compliant surfaces.
2. Establish live usage before acting on legacy/candidate code, including `QuickActionsCard` identity.
3. Keep backend #215 blocked until exact-head Hermes validation actually executes and passes.
4. Collect physical-device evidence only when separately authorized.
5. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent evidence-backed packages over cosmetic churn. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
