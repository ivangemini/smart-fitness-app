# Smart Fitness Project Map

Updated: 2026-08-21

## Purpose

This file is the fast navigation layer for the Smart Fitness codebase. It answers **where to look first** without duplicating the detailed architecture, API, data-model, privacy, QA, release, or roadmap documents.

Use it to orient a new agent/session, then read the canonical documents for the area being changed.

This map is **not** a source of truth for mutable execution state. When anything here conflicts with source, schemas, migrations, tests, or current Git history, the source wins.

Recommended startup sequence:

1. `AGENTS.md` — permanent execution/safety rules;
2. `PROJECT_MAP.md` — repository and file navigation;
3. `docs/project-context.md` — stable cross-repository context;
4. `docs/current-status.md` — current verified state/blockers;
5. `docs/handoffs/latest.md` — latest continuation checkpoint;
6. `docs/implementation-plan.md` — canonical cross-repository forward plan;
7. focused documents for the domain being changed.

For a live filesystem view from a checkout, run:

```bash
node scripts/print-project-tree.mjs
node scripts/print-project-tree.mjs --depth=4
```

The generated tree is navigation-only and deliberately excludes vendor/build/generated noise.

---

## Repositories and authorities

| Surface | Repository / endpoint | Role |
| --- | --- | --- |
| Mobile | `ivangemini/smart-fitness-app` | Expo / React Native client, offline-first private fitness state, UI, sync client, server-authoritative domain clients |
| Backend | `ivangemini/smart-fitness-backend` | Production server authority, Fastify API, PostgreSQL/Drizzle persistence, provider boundaries, Coach/Labs/Social/Knowledge authority |
| Production API | `https://api.peptonio.com` | Mobile-facing production backend endpoint |
| Admin | backend repository | Administrative/editorial surface and deployment boundary; check current backend status/handoff before touching production-affecting admin work |

Do not create a second backend or move provider secrets/calls into the mobile repository.

---

## Mobile repository — top-level map

```text
smart-fitness-app/
├── AGENTS.md                    permanent agent rules
├── PROJECT_MAP.md               this navigation index
├── README.md                    public repository entry point
├── ROADMAP_PROGRESS.md          historical/high-level roadmap progress
├── PROJECT_LEARNINGS.md         durable implementation learnings
├── app.config.ts / app.json     Expo/native application configuration
├── assets/                      static application assets
├── config/                      build/link/provenance configuration helpers
├── docs/                        canonical context, architecture, roadmap, QA, release, privacy and operations evidence
├── scripts/                     repository validation and maintenance scripts
├── src/                         mobile application source
└── .github/workflows/           CI, release-gate, adversarial validation and EAS update workflows
```

Generated/vendor/native-build output is not part of the conceptual map. Inspect it only when a build/native task specifically requires it.

---

## Mobile `src/` — responsibility map

### Routing and composition

- `src/app/` — Expo Router route files and root composition.
- `src/app/_layout.tsx` — root application/provider/navigation composition.
- `src/app/(tabs)/` — primary tab routes.
- route folders/files under `src/app/` should stay thin; domain behavior belongs in focused feature/state/API layers.

Primary product navigation invariant:

```text
Home | Workouts | Nutrition | Progress | Labs
                     +
global Companion entry → Coach/Companion route
```

### Product features

`src/features/` is the first place to look for user-facing domain implementation.

| Domain | Primary mobile area | Notes |
| --- | --- | --- |
| Home | `src/features/home/` | social-first home plus bounded personal daily context |
| Workouts | `src/features/workouts/` | workout hub/session flows and workout presentation |
| Exercises | `src/features/exercises/` | exercise library and exercise-facing flows |
| Nutrition | `src/features/nutrition/` | diary, targets, meals, saved/library surfaces |
| Progress | `src/features/progress/` | body, strength/training, activity and highlight analytics |
| Labs / Analyses | `src/features/labs/` | private server-authoritative lab documents/results/history/compare UI |
| Coach | `src/features/coach/` | deterministic/structured Coach consumer flows and persisted run presentation |
| Companion | `src/features/companion/` | user-facing Companion/pet presentation over reviewed contracts |
| Social | `src/features/social/` | profiles, relationships, feed, Stories and social interaction UI |
| Knowledge | `src/features/knowledge/` | canonical article/library/reader, learning state and Coach→Learn UI |
| Goals | `src/features/goals/` | goal-facing presentation and bounded proposal/application flows |
| Health | `src/features/health/` | device/platform health integration surfaces |
| Notifications | `src/features/notifications/` | mobile notification-facing behavior |
| Profile | `src/features/profile/` | profile data and profile-facing flows |
| Settings | `src/features/settings/` | account/app settings and controls |
| Onboarding | `src/features/onboarding/` | onboarding flow |

When a route is only a wrapper, continue into the corresponding `src/features/<domain>/` implementation before making conclusions about behavior.

### State, persistence and synchronization

- `src/context/AppContext.tsx` — compatibility/internal aggregate context over the authoritative private app state.
- `src/context/appContext/` — focused AppContext internals.
- `src/context/*StateContext.tsx` — focused production state boundaries.
- `src/context/SyncContext.tsx` — synchronization orchestration owner.
- `src/context/applySyncPullResult.ts` and nearby sync helpers/tests — pull materialization/conflict-sensitive behavior.
- `src/cloud/` — sync queue/outbox/cloud adapters, recovery and cloud-side mobile orchestration.

Private offline-first fitness state follows the conceptual path:

```text
feature / focused state boundary
→ authoritative local AppState
→ AsyncStorage persistence
→ sync journal/outbox/recovery
→ src/cloud + SyncContext
→ authenticated backend sync API
→ authoritative server revision/conflict/tombstone state
```

Do not casually bypass the focused state boundaries or write independent persistence for an existing synchronized entity.

### API and authentication

- `src/api/` — shared backend HTTP/API boundary. Start here for mobile↔backend contract work.
- `src/api/config.ts` — shared API-base configuration; production default is `https://api.peptonio.com`.
- `src/auth/` — mobile authentication/session behavior.
- native access/refresh tokens belong in Expo SecureStore, not ordinary cached app state.

Provider rule:

```text
mobile → Smart Fitness backend → provider adapter
```

Never:

```text
mobile → food/model/OCR/storage/moderation/search/email/push provider secret API
```

### Domain and shared implementation

- `src/domain/` — deterministic domain logic/types where behavior is not presentation-owned.
- `src/components/` — shared reusable UI components/primitives.
- `src/hooks/` — shared hooks.
- `src/capabilities/` — capability/availability boundaries and fail-closed client behavior.
- `src/config/` and `src/constants/` — runtime/static configuration and constants.
- `src/data/` — bounded app data/catalog sources.
- `src/lib/` — shared low-level helpers.
- `src/localization/` — localization/copy infrastructure.
- `src/observability/` — privacy-bounded diagnostics/observability support.

Before adding a new helper/client/store, search these existing ownership areas first.

---

## Data-authority map

The most important architectural question is not only “which file?”, but **who owns truth?**

### Private offline-first fitness domains

Mobile keeps authoritative local working state and synchronizes revisioned entities with the backend for:

- weight history;
- completed workout sessions and sets;
- custom workout templates;
- food entries;
- nutrition targets;
- fitness profiles;
- user limitations;
- recovery check-ins;
- body measurements;
- training programs;
- custom exercises;
- meal templates;
- account-scoped Nutrition library items.

For these, inspect both mobile state/sync code and backend sync contracts before changing schemas or semantics.

### Server-authoritative domains

These are intentionally **not** ordinary private `AppState` sync families:

- authentication, sessions and devices;
- Labs / Analyses;
- Social and Stories;
- managed media;
- canonical Knowledge content;
- account-owned learning state;
- Coach run authority/provenance and structured confirmations;
- provider-backed capabilities.

Do not fabricate server rows/state locally merely to make a screen work.

---

## Backend repository — semantic map

The backend owns the detailed backend architecture. Do not duplicate its API/database documents here.

Start in `ivangemini/smart-fitness-backend` with:

```text
smart-fitness-backend/
├── AGENTS.md
├── README.md
├── docs/project-context.md       canonical detailed backend baseline
├── docs/current-status.md        mutable verified backend state
├── docs/handoffs/latest.md       continuation checkpoint
├── docs/api-reference.md         route inventory/reference
├── docs/data-model.md            exported Drizzle data-model reference
├── docs/architecture/README.md   backend architecture index
├── docs/deployment.md            deployment boundary
├── src/routes/                   Fastify HTTP/trust-boundary layer
├── src/services/                 application/service layer
├── src/repositories/             persistence access layer
├── src/schema/                   Drizzle schema authority
└── src/modules/                  bounded domain modules, including Knowledge
```

Required dependency direction:

```text
routes
→ application/services
→ repositories
→ PostgreSQL / Drizzle
```

Coach execution adds its reviewed orchestration pipeline:

```text
Fastify endpoint
→ Orchestrator
→ typed specialized Subagents
→ deterministic TypeScript Workers / Validation
→ Output Engine
→ PostgreSQL / Drizzle
```

For backend changes, exact route/service/repository/schema/migration/test source overrides this semantic outline.

---

## Documentation map

### Read on almost every substantial task

- `AGENTS.md` — rules and invariants.
- `PROJECT_MAP.md` — navigation.
- `docs/project-context.md` — stable product/architecture context.
- `docs/current-status.md` — current state and blockers.
- `docs/handoffs/latest.md` — latest restart checkpoint.
- `docs/implementation-plan.md` — canonical forward roadmap.
- `PROJECT_LEARNINGS.md` — durable lessons and failure patterns.

### Focused documentation directories

- `docs/architecture/` — architecture decisions/contracts; use `docs/architecture/README.md` as index.
- `docs/backend/` — mobile-side cross-repository/backend integration evidence where appropriate.
- `docs/roadmap/` — focused domain roadmaps.
- `docs/privacy/` — privacy/data-exposure contracts.
- `docs/qa/` — QA/evidence plans and results.
- `docs/release/` and `docs/releases/` — release boundaries/evidence/history.
- `docs/operations/` — CI, disaster recovery and operational procedures/evidence.
- `docs/handoffs/` — restart/continuation checkpoints.
- `docs/plans/` — focused implementation plans that are subordinate to the canonical cross-repository plan.

Do not add another generic `system-overview.md` or broad architecture duplicate when the existing project context + this map + focused architecture index can represent the information.

---

## CI / release map

Mobile workflow entry points live under `.github/workflows/`:

- `ci.yml` — routine authoritative mobile CI;
- `release-gate.yml` — release gating;
- `adversarial-validation.yml` — bounded adversarial validation;
- `eas-update.yml` — EAS update automation.

Routine authoritative mobile CI uses the repository-scoped Hermes runner class documented in `AGENTS.md` and `docs/architecture/mobile-ci-runner-policy.md`.

Important boundary:

```text
merge to main
≠ OTA publication
≠ native build/install
≠ backend deployment
≠ provider activation
≠ production migration execution
```

Always determine which of those states the task actually requires.

---

## High-risk / high-fan-out areas

Treat these as “inspect callers/tests/contracts first” zones:

- `src/context/AppContext.tsx` and `src/context/appContext/`;
- `src/context/SyncContext.tsx`;
- `src/context/applySyncPullResult.ts` and conflict/recovery logic;
- `src/cloud/` sync/outbox/recovery code;
- `src/api/` shared transport and DTO boundaries;
- `src/app/_layout.tsx` and primary tab/navigation composition;
- auth/session/SecureStore code;
- persisted schemas/entity IDs/timestamps/revision metadata;
- Labs/Social/Knowledge server-authoritative contracts;
- backend `src/schema/`, migrations, auth/session ownership, repositories and shared route contracts;
- release/build/native configuration and GitHub workflows.

A small-looking edit in one of these areas can have cross-domain or cross-repository effects.

---

## Fast task-routing guide

| Task | Look here first |
| --- | --- |
| UI bug on a product screen | `src/app/<route>` → corresponding `src/features/<domain>/` → shared components/tokens |
| Workout persistence/session bug | `src/features/workouts/` → focused state/AppContext → persistence/sync tests |
| Nutrition data issue | `src/features/nutrition/` → Nutrition state boundary → sync/API contract if server-backed |
| Progress chart/calculation | `src/features/progress/` → deterministic domain/helpers → source history/state |
| Labs issue | `src/features/labs/` + `src/api/` + backend Labs routes/services/repositories/schema |
| Social/Stories issue | `src/features/social/` + backend Social/Stories authority |
| Knowledge/Learning issue | `src/features/knowledge/` + Phase 18 focused architecture + backend Knowledge module |
| Coach issue | `src/features/coach/` + mobile API + backend orchestrator/workers/run persistence |
| Companion UI/progression | `src/features/companion/` + reviewed Companion rules; do not mix with Knowledge learning state |
| Login/token/session | `src/auth/` + `src/api/` + backend auth/session/device ownership |
| Sync conflict/recovery | `src/context/SyncContext.tsx`, `src/context/applySyncPullResult.ts`, `src/cloud/`, backend sync repositories/tests |
| API contract change | mobile `src/api/` + exact backend route/service/schema + compatibility tests/docs |
| Database/schema change | backend `src/schema/` + migration + repositories/services + API/data-model docs |
| CI/release problem | `.github/workflows/`, release docs, runner policy, Expo/EAS config |
| “Where are we now?” | `docs/current-status.md` + `docs/handoffs/latest.md` + current Git/PR/CI state |
| “What should be done next?” | `docs/implementation-plan.md` + focused roadmap + current blockers |

---

## Maintenance rule

Update `PROJECT_MAP.md` when a change materially alters:

- repository ownership;
- top-level source layout;
- a product domain's primary directory;
- state/authority boundaries;
- canonical documentation entry points;
- CI/release entry points;
- the location of a high-fan-out subsystem.

Do **not** update this file for ordinary leaf-file additions, small refactors, or mutable roadmap status. The live tree script handles file-level orientation; current-status/handoff/roadmap documents handle execution state.
