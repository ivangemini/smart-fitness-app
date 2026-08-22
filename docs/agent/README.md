# Agent Operating Guide

Updated: 2026-08-22

## Purpose

This directory is the operational layer for coding agents working on Smart Fitness. It reduces repeated repository discovery, makes ownership/blast-radius/validation decisions explicit, and keeps those decisions machine-readable where practical.

It does **not** replace exact source, migrations, schemas, tests, Git history, focused architecture, roadmap, privacy, release, operations, or backend documentation.

Use this layer to answer:

1. **Where do I start?** — `PROJECT_MAP.md` and this guide.
2. **Who owns truth?** — `ownership-map.md`.
3. **What else can this affect?** — `change-impact.md`.
4. **What evidence is required?** — `validation-matrix.md`.
5. **What does the current diff imply automatically?** — `config/agent-project-graph.json` through the Agent Tooling commands below.

## Session bootstrap

For a new agent/session:

1. read `AGENTS.md`;
2. read `PROJECT_MAP.md`;
3. read this guide;
4. run `npm run agent:preflight`;
5. inspect exact current mobile/backend Git/GitHub refs, open PRs and CI state;
6. read `docs/project-context.md`;
7. read `docs/current-status.md`;
8. read `docs/handoffs/latest.md`;
9. read `docs/implementation-plan.md`;
10. read `ROADMAP_PROGRESS.md` when roadmap completion/sequencing matters;
11. read `PROJECT_LEARNINGS.md`;
12. inspect the relevant ownership/impact/validation rows and focused docs.

Do not read the whole repository by default. Build the smallest correct working set, then expand only when source evidence or the dependency graph shows a wider dependency.

## Freshness contract

**Git/GitHub is the only live authority for current branch heads, commit SHAs, open/merged PR state and CI status.** Version-controlled documentation must not pretend to be a live ref database because merging a docs change would make such values stale immediately.

Mutable facts have these homes:

- live refs / PR state / CI state → Git/GitHub;
- last verified product/workstream checkpoint → `docs/current-status.md`;
- continuation/restart checkpoint → `docs/handoffs/latest.md`;
- forward sequencing → `docs/implementation-plan.md`;
- cross-program phase ledger → `ROADMAP_PROGRESS.md` and focused roadmap files;
- stable architecture/ownership → `docs/project-context.md`, focused architecture/privacy/operations docs and `docs/agent/*`.

Historical merge or evidence SHAs are appropriate when they identify a durable reviewed checkpoint (for example, the commit that actually passed a named CI run). Do **not** copy a SHA merely to say “this is current main”.

After a merge that invalidates a pending-PR instruction, reconcile `current-status`, handoff and the affected roadmap entry in the same closure change. At session start, treat any prose that says a PR is “open”, “ready to merge”, “pending CI” or “unmerged” as a dated claim that must be checked against GitHub before acting.

## Agent Tooling v2

The canonical machine-readable graph is:

```text
config/agent-project-graph.json
```

It maps source paths to product/architecture nodes, authority, change classes, cross-repository review requirements, dependency edges, and validation profiles.

The graph includes semantic external backend nodes so a mobile change can surface the backend authority that must be inspected without pretending that the mobile checkout owns backend source.

### Preflight

```bash
npm run agent:preflight
npm run agent:preflight -- --fetch
npm run agent:preflight -- --strict
npm run agent:preflight -- --json
```

`agent:preflight` checks:

- Node/toolchain expectations;
- Git branch/HEAD/base/ahead/behind state;
- dirty working tree;
- agent navigation integrity;
- current changed-file set;
- documentation update markers;
- open PR visibility and changed-file overlap when GitHub CLI is available.

`--fetch` performs a bounded read-only `git fetch origin main` before evaluating local freshness. GitHub CLI absence is non-blocking because connected-agent environments may inspect GitHub through another connector. Exact remote state still overrides stale local refs.

### Impact classification

```bash
npm run agent:impact
npm run agent:impact -- --json
npm run agent:impact -- --base origin/main
npm run agent:impact -- --files=src/api/client.ts,src/features/labs/LabsScreen.tsx
```

`agent:impact` reports:

- changed files;
- matched domains;
- source-of-truth authority;
- dependencies and dependents to inspect;
- high-fan-out/privacy/native/release/server-authoritative flags;
- cross-repository review requirements;
- required validation profiles;
- conservative OTA-safe candidacy.

`OTA-safe candidate` means only that the changed paths satisfy the repository's JS/TS/TSX/assets path rule. It does **not** override backend-contract, privacy, deployment, provider, or production gates.

### Dependency / contract graph

```bash
npm run agent:graph
npm run agent:graph -- --changed
npm run agent:graph -- --changed --json
npm run agent:graph -- --changed --dot
```

`agent:graph -- --changed` shows the current working-set neighborhood rather than the full project graph.

Use the graph for navigation and blast-radius discovery. Exact imports/callers/tests and backend source remain authoritative.

### Targeted validation

```bash
npm run agent:validate
npm run agent:validate -- --plan
npm run agent:validate -- --json
npm run agent:validate -- --full
```

`agent:validate`:

1. classifies the current diff;
2. runs repository/changed-file line checks;
3. always runs agent integrity;
4. selects additional checks from the graph;
5. executes only the required local validation profiles unless `--full` is requested.

Examples:

- docs/agent tooling → integrity + focused tooling tests;
- ordinary TS/TSX feature change → typecheck + full regression suite;
- sync change → typecheck + tests + expanded sync-intent smoke;
- native/dependency/release-sensitive change → release config + Expo export + Expo Doctor in addition to source gates.

Authoritative PR CI still decides source acceptance. `agent:validate` does not replace required exact-head CI, physical-device evidence, provider evidence, deployment validation, or production verification.

## Task startup protocol

Before editing:

- identify the user-visible/product behavior;
- establish source-of-truth ownership with `ownership-map.md`;
- run `agent:impact` or classify the intended paths explicitly;
- inspect the primary feature/route/state/API layer;
- inspect backend route/service/repository/schema when the backend is authoritative;
- inspect callers/tests before changing shared/high-fan-out code;
- use `change-impact.md` and `agent:graph -- --changed` to expand the working set;
- select evidence before implementation so the change is testable by construction;
- preserve released interfaces unless the task explicitly includes a coordinated migration.

## Working-set strategy

### UI-only leaf change

Typical working set:

```text
src/app/<route>
src/features/<domain>/...
shared UI primitive/token only if actually used
focused tests / QA evidence
```

Do not open sync/backend/schema layers unless the behavior depends on them.

### Persisted private fitness state

Expand through:

```text
feature
→ focused state boundary / AppContext internals
→ persistence/mutation helpers
→ sync journal/outbox/recovery
→ mobile API DTOs
→ backend sync contracts/repositories
→ compatibility/conflict/restart tests
```

### Private local media

Progress Photos use a different authority shape from both revisioned fitness sync and backend-managed media:

```text
src/features/progressPhotos/
→ app-owned metadata/storage helper
→ native camera/photo-library capability
→ privacy + account-cleanup lifecycle
→ QA/device evidence
```

Do not silently add cloud upload, server sync, Social sharing, EXIF/location persistence, AI vision or image-derived body-fat authority. Any such expansion needs a separately reviewed architecture/privacy/storage contract.

### Server-authoritative domain

For Labs, Social/Stories, Knowledge/Learning, authentication/session/device state, managed media, and backend Coach authority:

```text
mobile feature
→ src/api/
→ backend route
→ service/application layer
→ repository
→ schema/migration when applicable
```

Do not invent local server rows/state to satisfy UI behavior.

### Shared/high-fan-out change

For `src/context/`, `src/cloud/`, shared `src/api/`, root navigation, auth/session, native/release config, CI, or backend schema/auth/shared repositories:

- inspect callers first;
- inspect invariants and focused tests;
- review the graph neighborhood;
- prefer a coherent bounded batch;
- do not rely on one happy-path test.

## Canonical documentation hierarchy

Resolve conflicts by claim type rather than by copying one universal file everywhere:

1. exact source, migrations, schemas, tests and current Git/GitHub state;
2. the focused canonical architecture/privacy/operations/QA document for the claim;
3. `docs/current-status.md` for the last verified mutable checkpoint;
4. `docs/implementation-plan.md` and focused roadmap for forward sequencing;
5. `docs/project-context.md` for stable orientation;
6. `PROJECT_MAP.md` and `docs/agent/*` for navigation/impact guidance;
7. `PROJECT_LEARNINGS.md` for durable lessons;
8. historical PR descriptions, old handoffs and chat summaries.

`docs/handoffs/latest.md` is a restart checkpoint, not architecture authority.

## Repository and state boundaries

### Mobile

- `ivangemini/smart-fitness-app`;
- Expo / React Native;
- routine CI: `[self-hosted, linux, x64, hermes-mobile-ci]`;
- production API: `https://api.peptonio.com`.

### Backend

- `ivangemini/smart-fitness-backend`;
- Node.js 22 / Fastify / PostgreSQL / Drizzle;
- routine CI: `[self-hosted, linux, x64, hermes-backend-ci]`;
- backend repo owns detailed API/data-model/deployment authority.

Always distinguish:

```text
source merged
≠ deployed
≠ migration executed
≠ provider configured
≠ worker scheduled
≠ OTA published
≠ native build installed
≠ physical-device evidence collected
≠ production behavior verified
```

## Common commands

```bash
npm ci

npm run project:tree
npm run agent:check
npm run agent:preflight
npm run agent:impact
npm run agent:graph -- --changed
npm run agent:validate -- --plan
npm run agent:validate
npm run agent:tooling:test

npm run typecheck
npm test
npx expo export --clear
npx expo-doctor@1.20.1
```

Use `validation-matrix.md` to decide what local checks prove and what additional CI/device/provider/production evidence is required.

## Cross-repository rules

A mobile change is cross-repository when it changes or depends on:

- API request/response semantics;
- server ownership/authorization;
- persisted server schema;
- sync payload/revision/conflict/tombstone behavior;
- Coach authority/findings/confirmation contracts;
- Labs/Social/Stories/Knowledge/Learning state;
- provider-backed behavior;
- account deletion/export/privacy lifecycle.

For coordinated changes:

1. inspect exact current `main` and open PRs in both repos;
2. identify the contract owner;
3. preserve released-client compatibility unless a migration is explicit;
4. sequence backend/mobile changes so no intermediate deployed state is invalid;
5. validate each exact head with its authoritative CI;
6. keep source completion separate from activation/deployment evidence.

## Documentation update routing

- permanent execution/product/safety rule → `AGENTS.md`;
- repository/file/authority navigation → `PROJECT_MAP.md`;
- agent ownership/impact/validation/tooling → `docs/agent/*` and `config/agent-project-graph.json`;
- stable architecture/product baseline → focused architecture or `docs/project-context.md`;
- last verified mutable product/workstream checkpoint → `docs/current-status.md`;
- continuation checkpoint → `docs/handoffs/latest.md`;
- forward sequence → `docs/implementation-plan.md`;
- cross-program phase ledger → `ROADMAP_PROGRESS.md` plus focused roadmap;
- durable lesson → `PROJECT_LEARNINGS.md`;
- release/evidence result → relevant QA/release document.

Do not duplicate one mutable fact across several broad documents.

## Staleness and integrity

`scripts/check-agent-navigation.mjs` checks:

- required agent entry points;
- required navigation links;
- package command wiring;
- agent-doc line bounds;
- graph schema/node/edge/validation-profile integrity;
- graph coverage for current top-level feature directories.

The graph is structural. It cannot prove that prose matches implementation or that an external backend contract is current. Live ref/PR/CI truth therefore must come from Git/GitHub; source inspection remains mandatory.
