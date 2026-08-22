# Mobile Architecture Index

Updated: 2026-08-22

This directory contains focused mobile architecture evidence. Use this index instead of creating overlapping broad summaries.

Stable cross-repository orientation lives in `../project-context.md`. Mutable execution state lives in `../current-status.md`. Forward sequencing lives in `../implementation-plan.md`.

## State and persistence

- `app-context-consumer-inventory.md` — focused-state migration and zero-production-consumer invariant for broad AppContext.
- `local-state-performance-decision.md` — measured decision to retain the single AsyncStorage AppState architecture.
- `persistence-operation-matrix.md` — persistence/mutation behavior by operation.
- `persistence-measurement-results.md` — measured persistence evidence.
- `workout-state-boundary.md` — workout state ownership.
- `nutrition-state-boundary.md` — Nutrition state ownership.
- `progress-state-boundary.md` — Progress state ownership.
- `profile-state-boundary.md` — Profile state ownership.
- `safety-recovery-state-boundary.md` — Safety & Recovery state ownership.

## Synchronization and cloud boundaries

- `cloud-module-inventory.md` — cloud/sync module responsibilities.
- `sync-conflict-resolution-mobile-intent.md` — explicit local-vs-account conflict intent.
- `sync-conflict-resolution-mobile-api.md` — conflict-resolution API boundary.
- `sync-conflict-resolution-mobile-state.md` — mobile conflict state/composition.
- `placeholder-timestamp-inventory.md` — placeholder timestamp audit.
- `bounded-adversarial-validation.md` — generated state-machine/adversarial validation boundary.
- `privacy-safe-support-diagnostics.md` — bounded local support diagnostics.

## Coach, Companion, goals and learning

- `proactive-coach-v1-contract.md` — deterministic Proactive Coach foreground contract.
- `proactive-coach-presentation-state.md` — presentation memory/cooldown/dedup state.
- `proactive-coach-companion-card.md` — Companion proactive-card integration.
- `phase17-goal-authority.md` — canonical goal ownership and richer-goal threshold.
- `phase17-goal-proposal-contract.md` — ephemeral proposal/preview/stale-source/apply boundary.
- `phase18-knowledge-learning-system.md` — end-to-end versioned Knowledge/Learning system contract.
- `phase18-learning-state-contract.md` — account-owned informational learning-state semantics.
- `phase18-learning-state-authority.md` — server-authoritative learning-state decision and bounded mobile retry queue.
- `phase18-coach-learn-recommendation-contract.md` — deterministic finding→allowlisted-content selection.
- `phase18-coach-learn-surface-integration.md` — optional Coach host-surface integration.
- `phase18-learning-paths-contract.md` — immutable reviewed learning paths over exact article versions.

## Product/domain composition

- `home-active-program-contract.md` — Home active-program composition.
- `labs-domain.md` — Labs mobile domain boundary.
- `story-reactions-contract.md` — bounded Story Reactions contract.
- `stories-s10-contract.md` — Stories S10 product/privacy/API contract.
- `mobile-managed-media-composition-analysis.md` — managed-media composition boundary.
- `push-registration-lifecycle.md` — mobile push registration lifecycle.
- `password-reset-app-links.md` — password-reset universal/app link architecture.
- `settings-information-architecture.md` — Settings information architecture.

## UI, layout and visual system

- `liquid-glass-ui.md` — adaptive Liquid Glass presentation architecture.
- `liquid-glass-residual-inventory.md` — reviewed convergence/residual inventory.
- `responsive-mobile-ui.md` — responsive layout, Safe Area, keyboard, scrolling and sticky/floating controls.
- `list-performance-baseline.md` — list-rendering performance baseline.

## CI and autonomous execution

- `mobile-ci-runner-policy.md` — authoritative self-hosted Hermes routing and bounded hosted fallback.
- `autonomous-throughput-policy.md` — autonomous/parallel execution boundaries.

## Training intelligence and progress photos

The reviewed Phase 19/20 source authority is intentionally not duplicated into another broad architecture file. Use:

- `../roadmap/training-intelligence.md` for reviewed Exercise/Training Intelligence and Progress Photos/Body Composition scope;
- `../qa/progress-photo-device-validation.md` for the physical-device evidence checklist;
- `../privacy/` for applicable privacy/export/lifecycle contracts;
- exact `src/features/exercises/`, `src/features/progress/` and `src/features/progressPhotos/` source for implementation authority.

## Maintenance rule

Update this index when a focused architecture document is added, renamed, superseded or removed.

Do not add generic `mobile-architecture.md`, `system-overview.md` or duplicate `data-sync.md` files unless a future audit proves the existing project context, implementation plan and focused documents cannot represent the required information without material ambiguity.
