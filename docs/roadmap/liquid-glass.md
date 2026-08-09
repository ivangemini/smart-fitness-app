# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge Smart Fitness on Liquid Glass while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, Social authority/privacy and backend contracts.

Home remains a social-first hybrid: compact personal metrics → server-authoritative Stories → chronological Following Feed.

## Status

- Phase 10 responsive source hardening: complete for current source scope.
- LG-1 foundation through LG-3I approved packages: complete.
- LG-H1 social-first Home: complete.
- **LG-H2 Stories:** complete for the current image-only v1 source scope.
  - backend foundation: PR #214 / merge `2339f6ce…`;
  - mobile read/view: PR #533 / merge `89bae8d1085ffd72131142700c1d625d6fa91f40`;
  - mobile authoring/delete: PR #535 / exact head `8045e96c07cb2f1fac6113b56d0061cb1547f4ee` / Mobile CI #1990 / merge `ad17cc9d8be896cf9610027a63018c07119b5b01`.
- **Progress/exercise secondary-material reassessment:** complete for current active source scope.
  - evidence-backed package: PR #537 / exact head `5ee5a3dfb1cf3591168821c3b4275b26e597aca4` / Mobile CI #1992 / merge `279a09e4b73e067a2cb0c1d836b8da809ce0b6b1`.
- **LG-4 Workouts material convergence:** active.
  - hub chrome: PR #539 / exact head `0190fdf6aae13ef7f2ab2682a7e9ee7277e4ef0e` / Mobile CI #1997 / merge `3f336794fec980ddbcf5d2c26572f054ecb59a6a`;
  - responsive SessionHeader: PR #540 / exact head `63163f0049024a5f359035c3f1e0114f31f36fbb` / Mobile CI #1999 / merge `9d934e755d09af6270807b7b797baff4fe2b3024`;
  - shared session footer actions: PR #541 / exact head `ffeb006fb812ce67061974ed3b8b6676066bf2b8` / Mobile CI #2001 / merge `2b4ec40bcc78dbabb06fb1af591d17c9b07c3fb5`;
  - virtualized replacement picker: PR #542 / exact head `bc8c0d50070615ab3694878b57c8a0484734f52e` / Mobile CI #2003 / merge `c14a173a35636853d3d1bfacb5daf64f85f301c4`.
- Coach material remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- No OTA/EAS publication, native install/build, backend deployment, migration execution, or physical-device proof is implied by source/CI completion.

## LG-H2 — Stories complete

The merged backend owns the image-only v1 lifecycle/privacy contract: approved owned `story_image`, authenticated/idempotent create, server-derived 24-hour expiry, active-only reads, owner delete, account-deletion cascade, Following/self visibility, private/block/moderation enforcement, managed-media moderation/delivery/cleanup, viewed state, bounded ordering/pagination, retention cleanup and Social export/privacy coverage.

The merged mobile surface consumes that authority with strict parsing/API errors, bounded account-scoped cache/revalidation, separate Story state, Home strip, safe-area viewer, viewed acknowledgement, managed `story_image` upload/finalize/polling reuse, restart-safe draft recovery, exact approved `stateVersion` creation, deterministic idempotency, authoritative refresh after create/delete and owner deletion.

No placeholder/demo Story data is authorized. V1 remains image-only: no caption/text overlay/video/arbitrary URL/client-authored expiry.

## Progress/exercise secondary material — reassessment complete

PR #537 closed the concrete post-Stories debt:

- Exercise Detail uses active semantic theme colors rather than hardcoded dark tokens;
- `MuscleMap` is theme-adaptive;
- shared `StatChip` is theme-adaptive across secondary cards;
- Exercise Detail back chrome uses shared `LiquidGlassIconButton`;
- the inert unimplemented More affordance was removed;
- existing media, favorites, sharing, history/progress calculations, navigation and safe-area behavior were preserved;
- source guards protect the boundary.

The follow-up audit checked other active secondary surfaces for legacy material, duplicate controls, non-semantic colors and brittle geometry. No additional meaningful bounded active-surface debt was found. Remaining findings belong to inactive legacy primitives or explicitly deferred Coach/planning surfaces and are not authorization for cosmetic churn.

## LG-4 — Workouts material convergence active

### LG-4A — Workouts hub interactive chrome — complete

PR #539 migrated Search, sticky Start/Resume and Create Program shell/actions to shared material primitives while preserving tabs, routines/program rows, safe floating-tab clearance, active-session routing and persistence.

### LG-4B — Active-session responsive header — complete

PR #540 removed magic `paddingBottom: 52` / timer `marginTop: 48`, moved back/overflow to shared glass icon controls and made stats/timer spacing content-driven. Finish gating and the tuned set table remain unchanged.

### LG-4C — Active-session footer actions — complete

PR #541 migrated visible Add Exercises/Test GIF actions to shared buttons and removed fixed `marginTop: 38` plus footer-only duplicate styles. The empty-workout card remained separate.

### LG-4D — Replacement exercise picker — complete

PR #542 replaced `ScrollView + slice(0,100).map` with bounded `FlatList`, removed the artificial 100-item cap, added bottom safe-area ownership and moved the picker shell/close action to shared elevated Liquid Glass primitives.

### Next LG-4 audit targets

Continue only with evidence-backed bounded debt. Current candidates:

- active-session Workout/Exercise overflow sheets and RPE sheet material/responsive behavior;
- workout-creation modal surfaces that still own local/hardcoded material, including the Program workout picker.

Preserve the tuned `Set / Previous / KG / Reps / RPE` table geometry unless a separately demonstrated defect requires change. Standardized control touch-target dimensions are not by themselves layout debt; focus on viewport-dependent positioning, local material duplication, missing safe-area ownership and non-virtualized growing lists.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention

Later. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain material remains deferred unless explicitly reprioritized.

## Later execution

1. Continue LG-4 Workouts material convergence with bounded evidence-backed packages.
2. LG-5 bounded elevated chrome/motion.
3. LG-6 visual QA/stabilization; physical evidence only when separately authorized.
4. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent packages over micro-PRs. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
