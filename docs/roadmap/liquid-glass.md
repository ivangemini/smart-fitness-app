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
- **Progress/exercise secondary-material reassessment:** active.
  - first bounded package complete via PR #537 / exact head `5ee5a3dfb1cf3591168821c3b4275b26e597aca4` / Mobile CI #1992 / merge `279a09e4b73e067a2cb0c1d836b8da809ce0b6b1`.
- Coach material remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- No OTA/EAS publication, native install/build, backend deployment, migration execution, or physical-device proof is implied by source/CI completion.

## LG-H2 — Stories complete

The merged backend owns the image-only v1 lifecycle/privacy contract: approved owned `story_image`, authenticated/idempotent create, server-derived 24-hour expiry, active-only reads, owner delete, account-deletion cascade, Following/self visibility, private/block/moderation enforcement, managed-media moderation/delivery/cleanup, viewed state, bounded ordering/pagination, retention cleanup and Social export/privacy coverage.

The merged mobile surface consumes that authority with strict parsing/API errors, bounded account-scoped cache/revalidation, separate Story state, Home strip, safe-area viewer, viewed acknowledgement, managed `story_image` upload/finalize/polling reuse, restart-safe draft recovery, exact approved `stateVersion` creation, deterministic idempotency, authoritative refresh after create/delete and owner deletion.

No placeholder/demo Story data is authorized. V1 remains image-only: no caption/text overlay/video/arbitrary URL/client-authored expiry.

## Progress/exercise secondary material — active reassessment

PR #537 closed the first concrete post-Stories debt:

- Exercise Detail now uses active semantic theme colors rather than hardcoded dark tokens;
- `MuscleMap` is theme-adaptive;
- shared `StatChip` is theme-adaptive across secondary cards;
- Exercise Detail back chrome uses shared `LiquidGlassIconButton`;
- the inert unimplemented More affordance was removed;
- existing media, favorites, sharing, history/progress calculations, navigation and safe-area behavior were preserved;
- source guards protect this boundary.

Continue auditing for other evidence-backed material/responsive debt: local legacy surfaces, duplicate control implementations, non-semantic colors, repeated blur/material boundaries or brittle fixed geometry. Do not churn already-correct shared primitives. If no material bounded debt remains, close the reassessment and advance to LG-4 Workouts.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention

Later. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain material remains deferred unless explicitly reprioritized.

## Later execution

1. Finish the evidence-based Progress/exercise secondary-material audit.
2. LG-4 Workouts material convergence.
3. LG-5 bounded elevated chrome/motion.
4. LG-6 visual QA/stabilization; physical evidence only when separately authorized.
5. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent packages over micro-PRs. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
