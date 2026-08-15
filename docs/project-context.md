# Smart Fitness Project Context

Updated: 2026-08-15

## Purpose

Smart Fitness is an offline-first fitness application covering workouts, nutrition, progress, profile/authentication, synchronization, deterministic structured AI Coach workflows, a privacy-first server-authoritative Social workout network, private Labs / Analyses and the bounded Companion presentation layer.

Repositories:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`;
- production API: `https://api.peptonio.com`.

This file is stable mobile/product orientation context. Mutable execution state belongs in `docs/current-status.md`; forward sequencing belongs in `docs/implementation-plan.md` and focused roadmap files.

The canonical **detailed backend baseline** lives only in backend `docs/project-context.md`. Do not recreate backend API/database/architecture snapshots in this repository.

## Product surfaces

The mobile application currently contains:

- social-first Home with compact personal daily fitness context, server-backed Stories and the Social workout feed;
- Workouts and active workout logging;
- Nutrition diary, targets, reusable meals and saved library items;
- Progress and measurements;
- Labs / Analyses as a private, server-authoritative longitudinal laboratory-results surface;
- authentication, Data & Sync and privacy-facing controls;
- Nutrition, Strength, Safety & Recovery and Combined Coach surfaces;
- Social profiles, relationships, Stories, workout posts, following feed, reactions, comments, notifications, reporting/moderation surfaces and managed-media contracts;
- Companion v1 as the user-facing motivational/presentation layer over canonical Coach/fitness history.

Home Stories are a real server-authoritative domain. S10 adds owner viewer activity, Close Friends/per-Story audience, bounded private replies, provider-neutral push preference and owner Archive/Highlights. Environment, native/provider and release activation remain separate gates.

Real Steps require a reviewed device health/activity source rather than inferred or demo values. Home consumes the provider-neutral Steps source and remains fail closed when no authorized native source is registered.

### Labs / Analyses boundary

Labs is **approved product scope**. It is not excluded merely because it contains blood-test data.

The approved boundary is:

- private server-authoritative lab documents/results;
- OCR/extraction output remains reviewable draft data until explicit confirmation;
- confirmed structured facts, source units and laboratory reference intervals are authoritative;
- chart/reference classifications are descriptive presentation states, not diagnoses;
- panel comparison must not claim health improvement/worsening from classification movement alone;
- interpretation uses confirmed minimum structured context and bounded validated output;
- provider-backed extraction/interpretation is capability-gated and fail closed;
- mobile never calls OCR/vision/model providers directly;
- Labs stays outside private revisioned `AppState` sync and uses its own server-authoritative repository/context boundary.

Still excluded unless separately reviewed/authorized:

- diagnosis, emergency triage or clinical urgency inference;
- prescriptions, medication dosing, pharmacology, hormone or SARM protocols;
- unrestricted model access to raw Labs documents/provider payloads;
- marketplace;
- payments/subscriptions;
- unreviewed Social/Stories domains outside approved focused roadmaps/contracts.

## Mobile architecture

- Expo SDK 56, React Native, Expo Router and TypeScript.
- One authoritative internal `AppState` is persisted through AsyncStorage for private offline-first fitness state.
- Production screens consume focused state boundaries rather than the full compatibility `useAppContext` hook.
- Ordered observable mutations protect critical persistence paths.
- Native access and refresh tokens use Expo SecureStore.
- API access is centralized under `src/api/`.
- Synchronization orchestration lives in `src/context/SyncContext.tsx` and `src/cloud/`.
- Presentation uses the adaptive Liquid Glass system documented in `docs/architecture/liquid-glass-ui.md`.
- Social/Stories and Labs are separate server-authoritative domains and do not become private revisioned `AppState` entities.

Local AsyncStorage remains the active storage strategy for the private offline-first state; architecture-only alternatives are not implementation authorization.

## Backend authority

The backend is the only server authority for:

- authentication and account ownership;
- authoritative revisions and idempotency;
- synchronized conflicts and tombstones;
- Coach orchestration and confirmation;
- provider access and secrets;
- Social, Stories and managed-media authority;
- Labs server authority;
- privacy, retention, deletion and export source controls.

Mobile must not call food, model, moderation, classifier, OCR, storage, email, push or other providers directly.

Canonical backend references:

- backend `docs/project-context.md` — detailed baseline;
- backend `docs/api-reference.md` — test-checked route inventory;
- backend `docs/data-model.md` — test-checked exported schema inventory;
- backend `docs/architecture/README.md` — focused architecture index.

`docs/backend/README.md` in this repository is redirect-only.

## Synchronization model

Revisioned synchronization exists for:

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
- Nutrition library items.

Core invariants:

- stable entity IDs;
- schema-versioned payloads;
- ISO timestamps;
- per-operation idempotency;
- authoritative server revisions;
- explicit tombstones;
- validated pull materialization;
- persisted unresolved conflicts;
- cursor advancement only after safe handling;
- explicit restart recovery for save/enqueue gaps.

Source-level hardening is complete for the current contracts. Matching standalone-runtime and physical second-device validation remains outstanding.

## AI Coach model

Required architecture:

```text
Fastify route
→ Orchestrator
→ typed specialized Subagents
→ deterministic TypeScript Workers / Validation
→ Output Engine
→ PostgreSQL / Drizzle
```

Implemented user-facing categories include Nutrition, Strength, Safety & Recovery, Combined Review and Combined Proposal with explicit application/confirmation boundaries and persisted provenance/trust state.

Automatic application is prohibited. Hidden chain-of-thought is not stored.

## Social, Stories, media and private state

Private fitness state uses revisioned synchronization.

Social, Stories and managed media are separate server-authoritative domains. Labs is also server-authoritative private health data and remains non-Social.

A shared workout is an immutable bounded public snapshot created only through the explicit Social sharing flow. Home does not make private workout/nutrition/progress/Labs/Coach data public merely by displaying personal context next to Social content.

Provider-backed capabilities remain disabled or fail closed until configuration, policy, infrastructure, deployment and evidence requirements are explicitly satisfied.

## Companion boundary

Companion is not a second Coach, health record, workout store or recommendation authority.

Progression may be derived deterministically from canonical completed history and must not mutate source fitness data. Current v1 rewards unique completed workout days only and avoids punishment, guilt, streak-loss mechanics and rewards for medical testing, food restriction or weight loss.

Provider/model-backed conversational or autonomous Companion behavior requires a separately reviewed contract.

## Documentation hierarchy

Use this order when statements conflict:

1. exact code, migrations, schemas, tests and current Git history;
2. `docs/implementation-plan.md` for cross-repository forward sequencing;
3. `docs/current-status.md` for the short current checkpoint;
4. focused architecture/privacy/operations/QA/release documents;
5. this project context for stable mobile/product orientation;
6. backend `docs/project-context.md` for detailed backend baseline facts;
7. `PROJECT_LEARNINGS.md`;
8. old PR descriptions, chat summaries and historical notes.

Permanent agent rules belong in `AGENTS.md`. The latest restart checkpoint belongs in `docs/handoffs/latest.md`.

## Change discipline

A pull request that changes architecture, synchronization coverage, product scope, active blockers, Social/Labs privacy boundaries, provider gates or deployment boundaries must update the corresponding canonical documentation in the same change.

Do not create a second backend API/database/architecture overview in `docs/backend/`; keep that directory redirect-only and put mobile-specific integration contracts under the appropriate focused mobile documentation area.
