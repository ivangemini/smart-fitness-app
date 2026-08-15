# Mobile Architecture Index

Updated: 2026-08-15

This directory contains focused mobile architecture evidence. Use this index instead of creating overlapping broad summaries.

Documentation roles:

- `../project-context.md` — stable mobile/product orientation;
- `../current-status.md` — short current checkpoint;
- `../handoffs/latest.md` — continuation/restart state;
- `../implementation-plan.md` — canonical cross-repository forward roadmap;
- backend `docs/project-context.md` — canonical detailed backend baseline.

## State and persistence

- `app-context-consumer-inventory.md` — focused state-boundary migration and zero-production-consumer invariant.
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
- `bounded-adversarial-validation.md` — generated state-machine/adversarial validation boundary.
- `privacy-safe-support-diagnostics.md` — bounded local support diagnostics.

## Media, Social, platform composition, CI and UI layout

- `mobile-managed-media-composition-analysis.md` — managed-media composition boundary.
- `story-reactions-contract.md` — bounded Story Reactions product/privacy/API contract.
- `password-reset-app-links.md` — password-reset universal/app link architecture.
- `mobile-ci-runner-policy.md` — authoritative self-hosted Hermes CI routing.
- `list-performance-baseline.md` — list-rendering performance baseline.
- `responsive-mobile-ui.md` — Safe Area, floating navigation, sticky actions, scrolling, keyboard and responsive layout contract.

## Backend references

Do not maintain backend API/database/schema copies in this mobile architecture tree or in `docs/backend/`.

Use the backend repository directly:

- `ivangemini/smart-fitness-backend/docs/project-context.md` — detailed backend baseline;
- `ivangemini/smart-fitness-backend/docs/api-reference.md` — test-checked Fastify route inventory;
- `ivangemini/smart-fitness-backend/docs/data-model.md` — test-checked Drizzle schema inventory;
- `ivangemini/smart-fitness-backend/docs/architecture/README.md` — focused backend architecture index.

`../backend/README.md` is redirect-only.

## Maintenance rule

Update this index when a focused architecture document is added, renamed, superseded or removed.

Do not add generic `mobile-architecture.md`, `system-overview.md`, duplicate backend overviews or duplicate `data-sync.md` files unless a future audit proves the canonical/focused documents cannot represent the required information without material ambiguity.
