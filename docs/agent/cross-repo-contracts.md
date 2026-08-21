# Cross-repository contract verification

Updated: 2026-08-21

## Purpose

`agent:crosscheck` verifies the mobile client's required backend route surface against the backend repository's source-checked API inventory and reports which contract families are touched by the current mobile/backend diffs.

This is an operational compatibility gate, not a replacement for exact request/response schema inspection, backend tests, released-client compatibility review, or authoritative CI.

## Evidence chain

The check deliberately avoids maintaining a second full backend route inventory in the mobile repository.

```text
backend src/routes/**/*.ts
→ backend tests/documentation-reference.test.ts
→ backend docs/api-reference.md route inventory
→ mobile config/cross-repo-contracts.json
→ current mobile/backend changed files
```

Backend `tests/documentation-reference.test.ts` fails if the documented inventory differs from literal Fastify route registrations. `agent:crosscheck` then fails if a route required by the mobile registry is absent from that inventory.

## Usage

Keep both repositories as sibling checkouts when practical:

```text
<workspace>/smart-fitness-app
<workspace>/smart-fitness-backend
```

Then from the mobile checkout:

```bash
npm run agent:crosscheck
npm run agent:crosscheck -- --fetch
npm run agent:crosscheck -- --json
```

Alternative backend location:

```bash
SMART_FITNESS_BACKEND_DIR=/path/to/smart-fitness-backend npm run agent:crosscheck
npm run agent:crosscheck -- --backend=/path/to/smart-fitness-backend
```

`--fetch` performs bounded read-only updates of `origin/main` in both checkouts before comparison.

## What the registry owns

`config/cross-repo-contracts.json` contains only the backend endpoints that released/current mobile code depends on, grouped by contract family:

- auth/session/account;
- revisioned sync;
- Coach;
- Labs;
- Knowledge/Learning;
- Social/Stories;
- food proxy;
- privacy/account lifecycle.

Each group also records mobile and backend path families used to classify current change impact.

Do not copy the complete backend route catalog into this registry. Add a route only when mobile depends on it.

## Interpretation

A passing crosscheck means:

- the backend checkout contains the source-check test for its API reference;
- every mobile-required endpoint is present in the backend source-checked route inventory;
- current mobile/backend changed files are mapped to relevant contract families.

It does **not** prove:

- request/response DTO compatibility after a semantic schema change;
- migration safety;
- provider activation;
- production deployment;
- physical-device behavior;
- compatibility with every previously released mobile version.

For semantic API changes, inspect exact route schemas/services/mobile DTOs and keep backend/mobile sequencing compatible. The crosscheck is an additional fail-closed route-surface guard, not permission to skip source review.

## Backend tooling integration

If the backend checkout contains `scripts/agent-impact.mjs`, the crosscheck includes its structured impact result. If not, route-surface validation still works from the backend source-checked API inventory.

This allows the mobile contract layer to be useful before backend agent tooling is merged, while automatically becoming richer once backend tooling is available.
