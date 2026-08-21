# Agent Operating Guide

Updated: 2026-08-21

## Purpose

This directory is the fast operational layer for coding agents working on Smart Fitness. It does not replace architecture, roadmap, status, privacy, release, or backend documentation. Its job is to reduce repeated repository discovery and make the first implementation pass safer and faster.

Use these documents to answer four questions:

1. **Where do I start?** — `PROJECT_MAP.md` and this guide.
2. **Who owns truth for this data/behavior?** — `ownership-map.md`.
3. **What else can this change affect?** — `change-impact.md`.
4. **What evidence is required before calling it done?** — `validation-matrix.md`.

Exact source, migrations, schemas, tests, current Git history, and canonical focused documentation override this operational index if they conflict.

## Session bootstrap

For a new agent/session, use this order before substantive edits:

1. `AGENTS.md` — permanent execution, product, safety, CI, and deployment rules.
2. `PROJECT_MAP.md` — repository/file navigation and high-fan-out areas.
3. `docs/agent/README.md` — this operating guide.
4. `docs/project-context.md` — stable cross-repository product/architecture context.
5. `docs/current-status.md` — mutable verified state and active blockers.
6. `docs/handoffs/latest.md` — latest continuation checkpoint.
7. `docs/implementation-plan.md` — canonical cross-repository forward plan.
8. `PROJECT_LEARNINGS.md` — durable failure patterns and implementation lessons.
9. Relevant focused architecture/privacy/roadmap/QA/release/operations documents.
10. Exact current mobile/backend Git state, open PRs, and CI state.

Do not read the whole repository by default. Build the smallest correct working set from the map and impact matrix, then expand only when source evidence shows a wider dependency.

## Task startup protocol

Before editing:

- identify the user-visible/product behavior being changed;
- identify the source-of-truth owner in `ownership-map.md`;
- inspect the corresponding mobile feature/route/state/API layers;
- inspect backend route/service/repository/schema layers when the backend is authoritative or the contract crosses repositories;
- inspect current callers and focused tests before changing shared/high-fan-out code;
- check `change-impact.md` for secondary surfaces that must be inspected;
- select validation from `validation-matrix.md` before implementation so the change is testable by construction;
- preserve exact current interfaces unless the task explicitly includes a coordinated contract migration.

## Working-set strategy

### UI-only leaf change

Typical working set:

```text
src/app/<route>
src/features/<domain>/...
shared UI primitive/token only if actually used
focused tests / QA note
```

Do not open sync/backend/schema layers unless the UI behavior depends on them.

### Persisted private fitness state change

Typical working set expands to:

```text
feature
→ focused state boundary / AppContext internals
→ persistence/mutation helpers
→ sync journal/outbox/recovery
→ mobile API DTOs
→ backend sync contracts/repositories
→ compatibility/conflict/restart tests
```

### Server-authoritative domain change

For Labs, Social/Stories, Knowledge/Learning, auth/session/device state, managed media, and backend Coach authority, start from the server contract rather than inventing local truth.

Typical path:

```text
mobile feature
→ src/api/
→ backend route
→ service/application layer
→ repository
→ schema/migration when applicable
```

### Shared/high-fan-out change

For `src/context/`, `src/cloud/`, shared `src/api/`, root layout/navigation, auth/session code, CI/release/native config, or backend schema/auth/shared repository code:

- inspect callers first;
- search for invariants and tests before editing;
- prefer a coherent bounded batch;
- explicitly check the relevant row in `change-impact.md`;
- do not rely on a single happy-path test.

## Canonical documentation hierarchy

When prose disagrees, prefer:

1. exact source, migrations, schemas, tests, and current Git history;
2. `docs/implementation-plan.md` for cross-repository forward sequencing;
3. `docs/current-status.md` for mutable verified status/blockers;
4. relevant focused architecture/privacy/operations/QA/release documents;
5. `docs/project-context.md` for stable cross-repository context;
6. `PROJECT_MAP.md` and `docs/agent/*` for navigation/operational routing;
7. `PROJECT_LEARNINGS.md` for durable lessons;
8. historical PR descriptions, old handoffs, and chat summaries.

`docs/handoffs/latest.md` is the restart checkpoint, not a stronger architecture authority than exact source or focused canonical docs.

## Repositories and environment boundaries

### Mobile

- repository: `ivangemini/smart-fitness-app`;
- Expo / React Native client;
- authoritative routine CI runner: `[self-hosted, linux, x64, hermes-mobile-ci]`;
- production API base: `https://api.peptonio.com`;
- Expo public environment variables must never contain provider secrets.

### Backend

- repository: `ivangemini/smart-fitness-backend`;
- Node.js 22 / Fastify / PostgreSQL / Drizzle backend authority;
- authoritative routine CI runner: `[self-hosted, linux, x64, hermes-backend-ci]`;
- detailed API/data-model/deployment authority lives in the backend repository.

### State claims

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

Do not collapse these into one “done” state.

## Common commands

From the mobile checkout:

```bash
npm ci
npm run typecheck
npm test
node scripts/check-repository-file-lines.mjs
node scripts/check-changed-file-lines.mjs
node scripts/print-project-tree.mjs
node scripts/print-project-tree.mjs --depth=4
npx expo export --clear
npx expo-doctor@1.20.1
```

After this agent layer is installed:

```bash
npm run project:tree
npm run agent:check
```

Use `validation-matrix.md` to decide which subset is sufficient locally and which authoritative CI/device/provider evidence is additionally required.

## Cross-repository rules

A mobile change is cross-repository when it changes or depends on:

- API request/response semantics;
- server ownership/authorization;
- persisted server schema;
- sync entity payloads/revisions/conflicts/tombstones;
- Coach authority/findings/confirmation contracts;
- Labs/Social/Stories/Knowledge/Learning state;
- provider-backed behavior;
- account deletion/export/privacy lifecycle.

For coordinated changes:

1. inspect exact current `main` and open PRs in both repositories;
2. establish which repository owns the contract;
3. preserve compatibility with released mobile clients unless the plan explicitly includes a migration;
4. sequence backend/mobile changes so no intermediate deployed state is invalid;
5. validate each exact head under its repository's authoritative CI;
6. keep deployment/activation evidence separate from source completion.

## Documentation update routing

Update documentation only where the fact belongs:

- permanent execution/product/safety rule → `AGENTS.md`;
- top-level repository/file/authority navigation changed → `PROJECT_MAP.md`;
- agent ownership/impact/validation routing changed → `docs/agent/*`;
- stable architecture/product baseline changed → `docs/project-context.md` or focused architecture doc;
- mutable state/blocker changed → `docs/current-status.md`;
- continuation checkpoint changed → `docs/handoffs/latest.md`;
- forward sequence changed → `docs/implementation-plan.md` / focused roadmap;
- durable implementation lesson discovered → `PROJECT_LEARNINGS.md`;
- release/evidence result → relevant QA/release document.

Do not duplicate one fact across several broad documents merely for visibility. Link to the canonical owner instead.

## Staleness rules

Agent documents are intentionally structural and should change less often than roadmaps/status files.

Update this layer when:

- a source-of-truth owner moves;
- a product domain changes authority model;
- a new high-fan-out subsystem is introduced;
- validation expectations materially change;
- canonical entry points are renamed/removed;
- cross-repository dependency direction changes.

Do not update it for ordinary leaf files, one-off bugs, current PR numbers, temporary blockers, or small UI details.

## Integrity check

`scripts/check-agent-navigation.mjs` checks that critical agent entry points exist, stay linked from the expected indexes, and remain within the hand-written documentation line limit.

It is a structural guard only. It cannot prove that prose still matches implementation. Source inspection remains mandatory.
