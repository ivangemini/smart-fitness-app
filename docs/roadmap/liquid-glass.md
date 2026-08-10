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
- **LG-5 QA and bounded polish: active with twelve demonstrated-defect runtime batches merged through PR #574.**
- Current runtime mobile `main`: `dcc62356d946f4e2c309aa24666322e9a671f067`.
- Coach product/material expansion remains explicitly deferred; PR #572 was only bounded live-surface theme hardening.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- No OTA/EAS publication, native install/build, backend deployment, migration execution or physical-device proof is implied by source/CI completion.

## Completed source history

Detailed LG-H2 Stories, Progress/exercise and LG-4 Workouts package history remains in current Git history plus `docs/current-status.md` and prior focused QA/evidence files. Those phases are not reopened merely because LG-5 continues.

Important preserved contracts from LG-4:

- tuned Set / Previous / weight / reps / RPE table semantics and active-session persistence;
- RPE value domain and select/skip lifecycle;
- workout/program draft, save, reorder, attach, favorite and delete semantics;
- completed-history retention and trust-oriented read-only review semantics;
- safety/recovery decision and acknowledgement behavior;
- routes, private synchronization and backend contracts.

Completed workout history is intentionally a read surface in the current product contract. Commit `b91bd6f1dc3166f6bdc95838cae254c9af63d2ed` introduced history/detail as immutable historical presentation without modifying training data, and the current list/detail routes still expose no completed-session mutation UI. Generic state update/delete actions do not authorize LG-5 to invent that workflow. See `docs/qa/lg5-completed-history-scope.md`.

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

### Batch 5 — PR #567: shared state theme consistency

Confirmed defect:

- shared `EmptyState`, `InlineError` and `LoadingState` could retain `Colors.dark` inside otherwise light/system theme-aware Home and Progress surfaces.

Fix:

- all three shared primitives now resolve semantic presentation from `AppThemeProvider` without changing their APIs or state behavior.

### Batch 6 — PR #568: auth appearance consistency

Confirmed defect:

- auth/account screens, shared auth form primitives and account modals could mix active-theme cards/buttons with hardcoded dark backgrounds, fields, headers and destructive/tertiary controls.

Fix:

- the affected auth/account presentation boundaries now use active semantic colors while preserving auth/session, password-reset and account-deletion behavior.

### Batch 7 — PR #569: onboarding appearance consistency

Confirmed defect:

- the onboarding readiness placeholder and full onboarding client screen hardcoded the dark palette, producing a dark flash/flow under Light/System appearance.

Fix:

- onboarding now follows `AppThemeProvider` for background, fields, choices, helper/validation text and selection state while preserving onboarding payloads, units and persistence.

### Batch 8 — PR #570: Exercise Detail loading-state ownership

Confirmed defect:

- Exercise Detail loading returned a bare shared loading state without the active-theme full-screen/safe-area boundary already used by error and populated states.

Fix:

- loading now reuses the existing centered state boundary with active background and runtime top/bottom safe-area clearance.

### Batch 9 — PR #571: Share Workout state/theme resilience

Confirmed defects:

- restore/auth-readiness loading lacked the safe-area ownership of the populated Share Workout form;
- live disclosure switches used fixed thumb/track colors rather than the selected app palette.

Fix:

- loading is centered with runtime safe-area clearance;
- switch presentation uses active semantic colors;
- share/publish/media/moderation/idempotency semantics are unchanged.

### Batch 10 — PR #572: Coach history theme consistency

Confirmed defect:

- Coach Run History screens already used active-theme outer surfaces while nested filter chips, detail rows and `CoachInputSummaryCard` still used `Colors.dark`.

Fix:

- those nested presentation boundaries now use active semantic colors while preserving filtering, immutable-run and Coach API/data semantics.

This was bounded LG-5 presentation hardening only; deferred Coach product/material work was not resumed.

Exact validated head: `76276d6ecc6a435339064adcdfd84e51a9c65be3`; Mobile CI #2065 passed before merge.

### Batch 11 — PR #573: paginated Social collection virtualization

Confirmed defect:

- Notifications, Following Feed, public-profile workout posts and relationship lists could accumulate cursor pages but eagerly rendered the growing collection through `ScrollView` + `.map()`.

Fix:

- each affected screen now owns one top-level `FlatList` with stable item identity;
- existing cursor `Load more`, retry/error/empty/auth/cached states, pull-to-refresh where present, notification optimistic-read behavior and relationship actions are preserved;
- regression guards prevent return to eager unbounded rendering.

Exact validated head: `e5769c5e579dc1da9963f7a6e2433214c996dc4a`; Mobile CI #2073 passed before merge.

### Batch 12 — PR #574: workout-post comment virtualization

Confirmed defect:

- workout-post comments are cursor-paginated but were accumulated with `comments.map()` inside the post-detail `ScrollView`;
- adding a nested same-axis virtualized list would itself violate the responsive-mobile contract.

Fix:

- workout-post detail now owns the sole top-level `FlatList` and renders comments as stable-ID rows;
- post/reaction/comment state content remains in list header/footer boundaries;
- comment list/create/delete/report, retry/load-more, profile-required, post report/delete, safe-area and keyboard behavior are preserved;
- source guards require the single-list boundary and forbid both eager comment mapping and nested comment `FlatList` rendering.

The first exact-head regression run exposed two stale source guards that still expected the removed monolithic comments component. Those guards were updated to verify the new boundary plus preserved Social API ownership; the final exact head passed the complete gate.

Exact validated head: `3d959128c63b46948cef946895352d96658732fa`; Mobile CI #2077 passed before merge.

## LG-5 validation matrix

Continue reviewing:

- light / dark / system appearance;
- narrow phone width and short phone height;
- modern iPhone safe areas and Android system-navigation insets;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long collections and pagination/virtualization boundaries;
- elevated-material and blur/fallback behavior;
- Active Session set-entry ergonomics, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history retention, list/detail navigation and read-only record review.

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

Backend PR #215 is separate infrastructure work. It remains open/draft at exact head `0826ff18dac7d4afe78943d9881c5a530507f1af`; its Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI runs remain queued. Do not merge it until required exact-head Hermes validation actually executes and passes.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention/ranking

Later. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain product/material expansion remains deferred unless explicitly reprioritized. Bounded LG-5 fixes to demonstrated defects on live Coach surfaces do not reopen that product phase.

## Later execution

1. Continue LG-5 source/CI QA and fix only concrete defects it surfaces.
2. Collect physical-device evidence only when separately authorized.
3. Continue deferred Coach/material work only when reprioritized.
4. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent evidence-backed packages over cosmetic churn. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.