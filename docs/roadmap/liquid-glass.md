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
- **LG-5 QA and bounded polish: active with four demonstrated-defect runtime batches merged through PR #565.**
- Current runtime mobile `main`: `975440b6098fb4aebf6d874acca87be581334ed4`.
- Coach material remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- No OTA/EAS publication, native install/build, backend deployment, migration execution or physical-device proof is implied by source/CI completion.

## Completed source history

Detailed LG-H2 Stories, Progress/exercise and LG-4 Workouts package history remains in current Git history plus `docs/current-status.md` and prior focused QA/evidence files. Those phases are not reopened merely because LG-5 continues.

Important preserved contracts from LG-4:

- tuned Set / Previous / weight / reps / RPE table semantics and active-session persistence;
- RPE value domain and select/skip lifecycle;
- workout/program draft, save, reorder, attach, favorite and delete semantics;
- completed-history retention and editable-history save/delete semantics;
- safety/recovery decision and acknowledgement behavior;
- routes, private synchronization and backend contracts.

## LG-5 — QA and bounded polish active

LG-5 is validation-first. Runtime work requires a concrete defect; no broad source migration package is authorized merely for visual churn.

### Batch 1 — PR #559: Create Program keyboard safety

Confirmed defect:

- the auto-focused name field opened the keyboard inside a centered, non-scrollable modal without keyboard avoidance or modal safe-area ownership;
- on short-height/increased-text configurations the action row could become unreachable.

Fix:

- keyboard avoidance around the form;
- vertically scrollable content with handled keyboard taps;
- safe-area-derived top/bottom clearance;
- validation/create/cancel semantics preserved.

### Batch 2 — PR #560: Workouts short-height / large-text resilience

Confirmed defects:

- Program Add Workout choice mode could clip its lower action inside a max-height/overflow-hidden, non-scrollable localized choice panel;
- New Routine expanded exercise notes used a 42 px direct interaction minimum.

Fix:

- choice mode is scroll-safe and localized copy can shrink/wrap;
- notes input meets the established 44 px minimum.

No-change reassessment:

- main Workout Builder already has keyboard avoidance, automatic keyboard insets, handled taps and dynamic safe-area bottom padding;
- Workout Editor overlay already has keyboard-aware scrolling and top/bottom safe-area ownership;
- Finish already has keyboard avoidance, measured footer clearance and safe-area padding.

Those correct boundaries were deliberately left unchanged.

### Batch 3 — PR #561: shared UI text resilience

Confirmed shared-boundary debt:

- long/localized values and large text could stress `ListRow` flex ownership;
- destructive/tertiary button labels and equal-width segmented labels needed the same wrapping/shrink behavior as already resilient controls.

Fix:

- bounded flex/min-width and label wrapping/shrink hardening without public API or behavior changes.

Exact validated head: `e16f8d961b4a128c4d7b1de5b4fc36d66342fd8e`; Mobile CI #2043 passed before merge.

### Batch 4 — PR #565: shared SectionHeader theme consistency

Confirmed defect:

- theme-aware screens could use the active app palette for their background/body while shared `SectionHeader` still resolved title/subtitle colors from `Colors.dark`.

Fix:

- `SectionHeader` now resolves `textPrimary`/`textSecondary` through `useAppTheme()` and memoized active-palette styles;
- layout, typography, action ownership and public API are preserved.

Exact validated head: `1a60e87b64db0d87ec99c6ad5c6f47002cf87dde`; Mobile CI #2049 passed before merge.

## LG-5 validation matrix

Continue reviewing:

- light / dark / system appearance;
- narrow phone width and short phone height;
- modern iPhone safe areas and Android system-navigation insets;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long exercise/history/program collections;
- elevated-material and blur/fallback behavior;
- Active Session set-entry ergonomics, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history read/edit/delete flows.

## LG-5 execution rule

For each bounded surface/shared primitive:

1. Inspect source against the responsive, theme, material, localization, accessibility and safe-area contracts.
2. Reuse existing evidence when the boundary already satisfies the contract.
3. If no concrete defect exists, do not create source churn.
4. If a defect exists, fix the smallest coherent boundary while preserving product behavior.
5. Runtime PRs merge only after exact-head Mobile CI is green and review blockers are clear.
6. Source/CI validation never substitutes for physical-device release evidence.

## CI execution note

PR #562 moved routine authoritative Mobile CI to Hermes. PR #563 removes only duplicate GitHub-generated post-merge reruns after an already exact-head validated PR; the full PR gate remains authoritative. PR #564 persists that policy in `AGENTS.md`.

Backend PR #215 is separate infrastructure work. It remains open/draft until its exact-head Hermes workflows actually execute and pass; its existence does not change LG-5 product scope.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention/ranking

Later. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain material remains deferred unless explicitly reprioritized.

## Later execution

1. Continue LG-5 source/CI QA and fix only concrete defects it surfaces.
2. Collect physical-device evidence only when separately authorized.
3. Continue deferred Coach/material work only when reprioritized.
4. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent evidence-backed packages over cosmetic churn. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
