# Mobile Architecture Index

Updated: 2026-08-19

This directory contains focused architecture evidence. Use this index instead of creating overlapping broad summaries.

For stable cross-repository orientation, read `../project-context.md`. For current execution state, read `../current-status.md`. For roadmap sequencing, read `../implementation-plan.md`.

## State and persistence

- `app-context-consumer-inventory.md` — focused state-boundary migration and the zero-production-consumer invariant.
- `local-state-performance-decision.md` — measured decision to retain the single AsyncStorage `AppState` architecture.
- `persistence-operation-matrix.md` — persistence and mutation behavior by operation.
- `persistence-measurement-results.md` — measured persistence evidence.
- `nutrition-state-boundary.md` — Nutrition state ownership.
- `progress-state-boundary.md` — Progress state ownership.
- `profile-state-boundary.md` — Profile state ownership.

## Synchronization and cloud boundaries

- `cloud-module-inventory.md` — cloud/synchronization module responsibilities.
- `sync-conflict-resolution-mobile-intent.md` — explicit local-versus-account conflict intent and reconciliation.
- `placeholder-timestamp-inventory.md` — placeholder timestamp audit.
- `bounded-adversarial-validation.md` — generated state-machine and adversarial validation boundary.
- `privacy-safe-support-diagnostics.md` — bounded local support diagnostics.

## Coach, planning, and learning

- `phase17-goal-authority.md` — canonical goal ownership and richer-goal threshold.
- `phase17-goal-proposal-contract.md` — ephemeral goal proposal, preview, stale-source and explicit application boundary.
- `phase18-knowledge-learning-system.md` — versioned evidence-linked educational content, quiz, learning-state and Coach→Learn architecture with explicit no-gamification rules.
- `phase18-learning-state-contract.md` — account-owned informational learning-state semantics, exact-version evidence, privacy/deletion/export and implementation gates.
- `phase18-learning-state-authority.md` — P18-E authority decision: dedicated server-authoritative account state plus a bounded mobile retry queue, outside private revisioned fitness `AppState` sync.
- `phase18-coach-learn-recommendation-contract.md` — P18-F deterministic finding→allowlisted canonical-content selection, exact-version learning-state suppression, bounded relevance explanation and fail-closed no-model-selection authority.
- `phase18-coach-learn-surface-integration.md` — P18-G host-surface integration: optional Knowledge attachments over already-trusted Coach findings, no new scheduler, and no trust shortcut from local Proactive insight kinds to backend finding authority.
- `phase18-learning-paths-contract.md` — P18-H reviewed curriculum/navigation authority over immutable path versions and exact article versions, reusing P18-E state without locks, XP or duplicate progress truth.

## Media, Social, links, platform composition, CI, and UI layout

- `mobile-managed-media-composition-analysis.md` — managed-media composition boundary.
- `story-reactions-contract.md` — S9-E bounded Story Reactions product/privacy/API contract and backend-first implementation order.
- `password-reset-app-links.md` — password-reset universal/app link architecture.
- `mobile-ci-runner-policy.md` — authoritative self-hosted Hermes routing for routine Mobile CI and bounded hosted-runner fallback policy.
- `list-performance-baseline.md` — list-rendering performance baseline.
- `responsive-mobile-ui.md` — responsive layout, Safe Area, floating navigation, sticky action, scrolling, keyboard, and validation contract.

## Maintenance rule

Update this index when a focused architecture document is added, renamed, superseded, or removed.

Do not add generic `mobile-architecture.md`, `system-overview.md`, or `data-sync.md` files unless a future audit proves that the existing project context, implementation plan, and focused documents cannot represent the required information without material ambiguity.
