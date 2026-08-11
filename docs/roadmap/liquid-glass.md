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
- **LG-5 QA and bounded polish: active with 31 demonstrated-defect runtime batches merged through PR #603.**
- Latest runtime mobile `main`: `68a9b76cfce41dfbdf01b36d8d15521121ffbc84`.
- Latest exact validated head: PR #603 `d78b759b6726f1416198456415f99dd399eed144`; Mobile CI #2144 run `31461541030` fully green before merge.
- Coach product/material expansion remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- Source/CI completion does not imply physical-device, native-release, backend deployment, provider or production activation evidence.

## LG-5 — QA and bounded polish active

LG-5 is validation-first. Runtime work requires a concrete defect; no broad source migration package is authorized merely for visual churn.

Earlier LG-5 package history remains in `docs/current-status.md`, merged PR history and Git. Recent batches are recorded here because they define the current interaction-material boundary.

### Batch 25 — PR #597: Workout History material feedback

Read-only Workout History filter chips, clear/reset actions and history-card presses now use Liquid Glass control/accent fill feedback instead of generic opacity. Filtering, stable `session.id`, units/localization, safe area and detail navigation are preserved.

Exact head `9604d8bacb981a7855c07ef30932ecbb4abdf7b1`; Mobile CI #2130.

### Batch 26 — PR #598: Safety row virtualization boundaries

Completed-history Safety restrictions/findings and pre-workout Safety Gate rows now belong to one screen-level virtualized boundary per screen rather than eager unbounded rendering. Historical immutability and pre-workout acknowledgement semantics remain preserved.

Exact head `c29ea3cac234ed9057b20674ecc94dbf2c0051df`; Mobile CI #2133.

### Batch 27 — PR #599: workout direct-action material feedback

Safety Gate acknowledgement/update and Workout Session Finish resume/clear/media/discard actions now use material-specific control/accent/destructive pressed fills rather than a shared opacity recipe.

Exact head `56fe0939f9232eb47d4952a24759c707d29abe45`; Mobile CI #2135.

### Batch 28 — PR #600: template not-found shared action

Workout Template Detail not-found fallback now delegates to shared `SecondaryButton`, preserving template actions/start lifecycle and exercise virtualization.

Exact head `db3f330fe47b016927d705889bea5c6369ab19e3`; Mobile CI #2138.

### Batch 29 — PR #601: Program interaction materials

Program Detail and Program Builder direct actions use control/accent material-specific feedback instead of one `opacity: 0.72` style. Program save/favorite/delete/remove, Builder discard protection, serialization, workout attach/create/edit/remove and keyboard behavior remain unchanged.

Exact head `8860ab9a63ae66d3ee48ab99af8c01bddbf444cd`; Mobile CI #2140.

### Batch 30 — PR #602: New Routine interaction materials

New Routine header actions, exercise header/menu, Add Set/Add Exercises, picker rows/Done and exercise action menu use control/accent/destructive material feedback. Routine serialization, program attachment, picker virtualization, keyboard insets and safe area remain preserved.

Exact head `f7eb3d7ca45d560e21d6c9e9a0b38136bb75d63a`; Mobile CI #2142.

### Batch 31 — PR #603: Exercise Library interaction materials

Exercise Library retry, exercise rows/details and selected/unselected filter chips now own distinct Liquid Glass material states. Repository/provider load/search/filter behavior, result `FlatList`, stable exercise IDs, recent cap, session-draft add flow and measured footer remain unchanged.

Exact head `d78b759b6726f1416198456415f99dd399eed144`; Mobile CI #2144 run `31461541030`.

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

PR #576 is a scope/documentation correction, not a runtime batch.

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

- **No broad/pre-authorized runtime package remains after PR #603.** Change source only for a demonstrated defect.
- **Next confirmed package: Active Session interaction materials.** Generic opacity-only pressed feedback remains in:
  - `SessionExerciseSection.tsx` for exercise expand/collapse, exercise menu, rest timer and Add Set;
  - `SessionSetRow.tsx` for RPE edit and completion controls;
  - `RpeBottomSheet.tsx` for selected/unselected RPE values;
  - `WorkoutSessionModals.tsx` plus `workoutSessionScreenStyles.ts` for overflow actions/cancel and replacement rows.
- Preserve active-session draft persistence, set calculations, completion/RPE semantics, RPE timing, replacement/discard behavior, finish/add-exercise/workouts routes and existing virtualized list boundaries.
- **No-change evidence in that boundary:** `SessionHeader` already owns dedicated fill-based Finish feedback and shared icon controls; `WorkoutSessionFooterActions` uses shared buttons; `SessionSetTable` owns no direct Pressable material.
- `QuickActionsCard` localized `action.label` key remains a candidate only until live usage is established.
- Weight Details remains intentionally capped to 10 rows with stable IDs.
- Home/Profile/Coach/Nutrition/Settings previously audited shared controls remain no-change evidence until new defects emerge.
- Program Detail remains bounded by the seven-day `WeekdayKey` structure.

## LG-5 execution rule

1. Inspect a bounded surface/shared primitive against responsive, theme, material, localization, accessibility and safe-area contracts.
2. Reuse existing evidence when the boundary already complies.
3. If no concrete defect exists, do not create source churn.
4. If a defect exists, fix the smallest coherent boundary while preserving product behavior.
5. Runtime PRs merge only after exact-head Mobile CI is green and review blockers are clear.
6. Source/CI validation never substitutes for physical-device release evidence.

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

1. Complete the bounded Active Session interaction-material package and validate its exact head.
2. Continue LG-5 validation-first QA and record no-change evidence instead of refactoring compliant surfaces.
3. Establish live usage before acting on `QuickActionsCard` identity.
4. Keep backend #215 blocked until exact-head Hermes validation actually executes and passes.
5. Collect physical-device evidence only when separately authorized.
6. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent evidence-backed packages over cosmetic churn. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
