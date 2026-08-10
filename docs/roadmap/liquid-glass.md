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
- **LG-5 QA and bounded polish: active with 23 demonstrated-defect runtime batches merged through PR #593.**
- Latest runtime mobile `main`: `976ea57e2da8753ca990bc2fad151b384a8ccee3`.
- PR #590 exact head `adeda4fc66490cd2e2ad05ca84454f962cc6c31d` passed Mobile CI #2118 before merge.
- PR #591 exact head `1ef8da30bebe13fa9b0407acb82ac44cb50208cd` passed Mobile CI #2122 before merge.
- PR #593 exact head `1edade7075999ba5bc210fe8456a3d73531d0a2b` passed Mobile CI #2124 before merge.
- Coach product/material expansion remains explicitly deferred; bounded live-surface QA corrections do not reopen that phase.
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

### Runtime batches #559–#586

The first 20 demonstrated-defect runtime batches cover keyboard/safe-area reachability, theme consistency, long/localized text resilience and stable-identity virtualization across Workouts, Social, Progress, account/session, sync and existing Coach surfaces. Exact package evidence remains in `docs/current-status.md`, `docs/handoffs/latest.md` and merged PR history.

Key resolved collection boundaries include paginated Social (#573/#574), completed workout detail (#577), Workout Template Detail (#579), Coach Run History (#581), Account Sessions (#583), User Limitations (#584), Sync Conflict Review (#585) and Active Session (#586).

### Batch 21 — PR #590: Safety & Recovery Review virtualization

Confirmed defect:

- deterministic Safety & Recovery Review restrictions derive from the unbounded user-limitations collection and findings can be emitted per record;
- the screen eagerly rendered restriction/finding arrays inside a vertical `ScrollView`.

Fix:

- the screen owns one top-level `FlatList` for result rows;
- restriction rows use stable limitation identity;
- issue rows preserve backend path identity rather than display text/index as their primary contract;
- summary, virtualized rows and footer remain one visually contiguous Liquid Glass result group;
- capability/auth states, lookback controls, deterministic Coach run lifecycle, review snapshot persistence and safe-area clearance remain preserved.

Exact validated head: `adeda4fc66490cd2e2ad05ca84454f962cc6c31d`; Mobile CI #2118 passed before merge.

### Batch 22 — PR #591: residual Coach navigation convergence

Confirmed defect:

- six existing Coach surfaces retained duplicated screen-local back-control recipes instead of the shared Liquid Glass navigation control;
- some local recipes used 42×42 direct-interaction geometry while the shared control owns the established 44×44 contract.

Fix:

- Safety Recovery Preflight, Coach Run History Detail, Nutrition Coach, Strength Coach, Nutrition Target Proposal and Combined Coach Proposal now use `LiquidGlassIconButton` with `ChevronLeft`;
- obsolete local `backButton/backLabel` recipes were removed;
- preflight sync/review navigation, immutable history-detail retrieval, Nutrition/Strength run/confirmation behavior, Nutrition Target confirmation and Combined proposal confirmations remain preserved.

The first exact-head CI run exposed stale source guards only. Guards were rebound to the shared control owner and semantic retrieval contract. Final exact-head validation passed the complete gate.

Exact validated head: `1ef8da30bebe13fa9b0407acb82ac44cb50208cd`; Mobile CI #2122 passed before merge.

### Batch 23 — PR #593: Workouts History floating material

Confirmed defect:

- the live Workouts tab History action is a floating contextual control, but it owned a local opaque surface rather than the shared elevated glass material;
- its pressed state used opacity only, which violates the direct-interaction material-feedback contract.

Fix:

- the route keeps `Pressable` as the interaction owner and delegates visible material to `LiquidGlassSurface` with `variant="elevated"`, pill radius and bounded blur;
- pressed feedback uses tokenized `controlPressedFill` instead of opacity-only feedback;
- `/workout-history`, localization/accessibility labels, floating-tab safe-area clearance and the 44 pt interaction floor remain preserved;
- a focused source-contract guard protects the material and preserved navigation/layout boundaries.

Exact validated head: `1edade7075999ba5bc210fe8456a3d73531d0a2b`; Mobile CI #2124 passed before merge.

## LG-5 validation matrix

Continue reviewing:

- light / dark / system appearance;
- narrow phone width and short phone height;
- modern iPhone safe areas and Android system-navigation insets;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long collections and pagination/virtualization boundaries;
- stable semantic identity for React keys and list items;
- elevated-material and blur/fallback behavior;
- Active Session set-entry ergonomics, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history retention, list/detail navigation and read-only record review.

## Current bounded evidence / next inspection

- **There is no pre-authorized runtime package after PR #593.** Inspect first; change source only for a demonstrated defect.
- `QuickActionsCard` currently uses displayed/localized `action.label` as the key for secondary actions. This is not an acceptable live identity contract, but repository code search is not indexed and the current audit has not established a usage site. Verify live usage before changing its API; unused/theoretical code is not enough to justify churn.
- The live Workouts History floating-material mismatch is resolved by #593.
- Post-#593 no-change audit: Home/Profile already use shared `LiquidGlassIconButton`; Coach tab actions use shared `AppButton`; Nutrition calendar/Today controls use tokenized control/pressed fills and the 36 pt meal-add visual control has `hitSlop={12}` inside a 52 pt header; Settings uses shared navigation/action controls and safe-area-aware scrolling. Do not churn these surfaces without new evidence.
- Weight Details recent weigh-in rows remain explicitly bounded to 10 entries.
- `ProgramDetailScreen` remains semantically bounded by the seven-day `WeekdayKey` program structure.
- Nutrition Add Food, Recovery Check-in, User Limitations, Social Profile Editor and Weight Entry already own keyboard-aware scroll behavior.
- User Limitations, Sync Conflict Review, Active Session and Safety & Recovery Review long-collection boundaries are resolved by #584, #585, #586 and #590.

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

Backend PR #215 is separate infrastructure work. It remains open/draft at exact head `0826ff18dac7d4afe78943d9881c5a530507f1af`; do not merge it until required exact-head Hermes validation actually executes and passes.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention/ranking

Later. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain product/material expansion remains deferred unless explicitly reprioritized. Bounded LG-5 fixes to demonstrated defects on live Coach surfaces do not reopen that product phase.

## Later execution

1. Continue LG-5 validation-first source/CI QA from runtime main after PR #593.
2. Establish live usage before acting on the `QuickActionsCard` identity candidate; continue residual material/accessibility inspection outside already-audited Home/Profile/Coach/Nutrition/Settings controls.
3. Fix only concrete demonstrated defects, otherwise record no-change evidence and move on.
4. Collect physical-device evidence only when separately authorized.
5. Continue deferred Coach/material work only when reprioritized.
6. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent evidence-backed packages over cosmetic churn. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
