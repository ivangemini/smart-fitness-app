# Smart Fitness Project Context

Updated: 2026-08-11

## Purpose

Smart Fitness is an offline-first fitness application covering workouts, nutrition, progress, profile/authentication, synchronization, deterministic structured AI Coach workflows, and a privacy-first server-authoritative Social workout network.

Repositories:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`;
- production API: `https://api.peptonio.com`.

This file is stable orientation context. Mutable execution state belongs in `docs/current-status.md`; detailed roadmap state belongs in `docs/implementation-plan.md` and focused roadmap files.

## Product surfaces

The mobile application currently contains:

- social-first Home with compact personal daily fitness context, server-backed Stories, and the Social workout feed;
- Workouts and active workout logging;
- Nutrition diary, targets, reusable meals, and saved library items;
- Progress and measurements;
- Profile, authentication, Data & Sync, and privacy-facing controls;
- Nutrition, Strength, Safety & Recovery, and Combined Coach surfaces;
- Social profiles, relationships, Stories, workout posts, following feed, reactions, comments, notifications, reporting/moderation surfaces, and managed-media contracts.

Home Stories are a real server-authoritative domain. The current approved image-only v1 source contract includes strict Story contracts, 24-hour server expiry, viewed state, Following/privacy enforcement, managed-media delivery, media-library image selection, bounded local preprocessing, signed `story_image` upload/finalize/polling, restart-safe authoring draft recovery, explicit publication, authoritative refresh and owner deletion. The full long-term Stories product is broader than that approved v1 and is tracked without implicit authorization in `docs/roadmap/stories.md`.

Real steps likewise require a reviewed device-health/activity source rather than inferred or demo values.

Excluded unless explicitly approved:

- blood-test analysis;
- diagnosis;
- pharmacology, hormone, SARM, or medication dosing;
- marketplace;
- payments and subscriptions;
- unreviewed Social/Stories domains outside the approved focused roadmaps.

## Mobile architecture

- Expo SDK 56, React Native, Expo Router, and TypeScript.
- One authoritative internal `AppState` is persisted through AsyncStorage.
- Production screens consume focused state boundaries rather than the full compatibility `useAppContext` hook.
- Ordered observable mutations protect critical persistence paths.
- Native access and refresh tokens use Expo SecureStore.
- API access is centralized under `src/api/`.
- Synchronization orchestration lives in `src/context/SyncContext.tsx` and `src/cloud/`.
- Presentation uses the adaptive Liquid Glass system documented in `docs/architecture/liquid-glass-ui.md`.

Local AsyncStorage remains the active storage strategy; architecture-only design options are not implementation authorization.

## Backend authority

The backend is the only server authority for:

- authentication and account ownership;
- authoritative revisions and idempotency;
- synchronized conflicts and tombstones;
- Coach orchestration and confirmation;
- provider access and secrets;
- Social, Stories, and managed-media authority;
- privacy, retention, deletion, and export source controls.

Mobile must not call food, model, moderation, classifier, OCR, storage, email, or other providers directly.

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

Implemented user-facing categories:

- deterministic Nutrition review;
- Nutrition Strategy proposal and confirmation;
- deterministic Strength review;
- Strength Strategy proposal and confirmation;
- deterministic Safety & Recovery review;
- Combined Review;
- Combined Proposal with Safety-capped effective Strength;
- separate explicit application paths;
- run history, provenance, trust state, and privacy-safe coverage.

Automatic application is prohibited. Hidden chain-of-thought is not stored.

## Social, Stories, media, and private state

Private fitness state uses revisioned synchronization.

Social, Stories, and managed media are separate server-authoritative domains and must not be inserted into private `AppState` synchronization. The Home feed and Story strip reuse this Social authority, account-scoped caches, pagination, block/private-profile enforcement, and moderation boundaries.

Stories are image-only in the current approved v1 contract. The backend owns authenticated creation, 24-hour expiry, active-only reads, Following/private/block/restriction visibility, viewed state, owner deletion, account-deletion cascade, retention cleanup, and the `story_image` managed-media lifecycle. Mobile strictly consumes that authority and provides the managed image selection/preprocessing/upload/recovery/publication/view/delete surface without creating a parallel upload system.

“Image-only v1 source-complete” is a scoped engineering statement, not a claim that all future Stories capabilities or release evidence are complete. `docs/roadmap/stories.md` separates source-complete v1, authorization-gated runtime/environment evidence, and non-authorized product-expansion candidates.

A shared workout remains an immutable bounded public snapshot created only through the explicit Social sharing flow. Home does not make private workout/nutrition/progress data public merely by displaying personal metrics next to Social content.

Provider-backed capabilities remain disabled or fail closed until configuration, policy, infrastructure, deployment, and evidence requirements are explicitly satisfied.

## Documentation hierarchy

Use this order when statements conflict:

1. exact code, migrations, schemas, tests, and current Git history;
2. `docs/implementation-plan.md`;
3. `docs/current-status.md`;
4. focused architecture, privacy, operations, QA, and release documents;
5. `docs/project-context.md`;
6. `PROJECT_LEARNINGS.md`;
7. old PR descriptions, chat summaries, and historical notes.

For Stories, `docs/roadmap/stories.md` is the focused source/release/expansion roadmap and must agree with the canonical implementation plan. For the Liquid Glass/Home UI program, `docs/roadmap/liquid-glass.md` is the focused execution/evidence roadmap.

Permanent agent rules belong in `AGENTS.md`. The latest restart checkpoint belongs in `docs/handoffs/latest.md`.

## Change discipline

A pull request that changes architecture, synchronization coverage, roadmap state, active blockers, Social privacy boundaries, or deployment boundaries must update the corresponding documentation in the same change.

Do not create a second broad overview when a current canonical file already covers the subject. Add a focused document or update the architecture/index hierarchy instead.
