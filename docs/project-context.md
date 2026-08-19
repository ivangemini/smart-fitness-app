# Smart Fitness Project Context

Updated: 2026-08-19

## Purpose

Smart Fitness is an offline-first fitness application covering workouts, nutrition, progress, profile/authentication, synchronization, deterministic/structured AI Coach workflows, private server-authoritative Labs / Analyses, and a privacy-first server-authoritative Social workout network.

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
- Progress with compact Body / Strength & Training / Activity / Highlights information architecture and detailed drill-downs;
- Profile, authentication, Data & Sync, and privacy-facing controls;
- Nutrition, Strength, Safety & Recovery, Combined and read-only question Coach/Companion flows;
- Labs / Analyses as a private server-authoritative longitudinal laboratory-results domain with confirmation-gated structured facts;
- Social profiles, relationships, Stories, workout posts, following feed, reactions, comments, notifications, reporting/moderation surfaces, and managed-media contracts.

Home Stories are a real server-authoritative domain. The completed baseline covers image-only v1 plus reviewed S9-A through S9-F source contracts. The S10 source boundary adds owner-only viewer activity, Close Friends/per-Story audience, bounded private replies, a fail-closed provider-neutral push-preference seam, and owner Archive/Highlights. Exact S10 product/privacy rules live in `docs/architecture/stories-s10-contract.md`; environment, native/provider and release activation remain separate authorization gates in `docs/roadmap/stories.md`.

Real steps likewise require a reviewed device-health/activity source rather than inferred or demo values.

Labs is approved only inside its reviewed private boundaries. Confirmed structured marker/history facts may be used by bounded Coach question flows; raw documents, extraction drafts and unrestricted provider payloads are not ordinary Coach context.

Excluded unless explicitly approved by a separate reviewed contract:

- diagnosis, emergency triage or clinical urgency inference;
- pharmacology, hormone, SARM, medication or supplement prescribing/dosing protocols;
- unrestricted model access to raw Labs documents or private provider payloads;
- marketplace;
- payments and subscriptions;
- unreviewed Social/Stories domains outside the approved focused roadmaps and contracts.

## Mobile architecture

- Expo SDK 56, React Native, Expo Router, and TypeScript.
- One authoritative internal `AppState` is persisted through AsyncStorage for private offline-first fitness domains.
- Production screens consume focused state boundaries rather than the full compatibility `useAppContext` hook.
- Ordered observable mutations protect critical persistence paths.
- Native access and refresh tokens use Expo SecureStore.
- API access is centralized under `src/api/`.
- Synchronization orchestration lives in `src/context/SyncContext.tsx` and `src/cloud/`.
- Presentation uses the adaptive Liquid Glass system documented in `docs/architecture/liquid-glass-ui.md`.
- Social and Labs are server-authoritative domains separate from private revisioned `AppState` synchronization.

Local AsyncStorage remains the active storage strategy for private offline-first app state; architecture-only design options are not implementation authorization.

## Backend authority

The backend is the only server authority for:

- authentication and account ownership;
- authoritative revisions and idempotency;
- synchronized conflicts and tombstones;
- server-backed Coach orchestration and confirmation;
- provider access and secrets;
- Labs result/document ownership and confirmation authority;
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

Source-level hardening is complete for current contracts. Matching standalone-runtime and physical second-device validation remains a separate evidence class.

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

Implemented categories include:

- deterministic Nutrition review;
- Nutrition Strategy proposal and confirmation;
- deterministic Strength review;
- Strength Strategy proposal and confirmation;
- deterministic Safety & Recovery review;
- Combined Review and Combined Proposal with Safety-capped effective Strength;
- explicit application paths and run history/provenance/trust state;
- Phase 15 bounded read-only question orchestration with minimal scopes and minimized evidence;
- confirmed structured Labs overview/marker-history question evidence inside the reviewed read-only boundary.

Automatic application is prohibited. Hidden chain-of-thought is not stored. Deterministic calculations and hard guardrails stay outside model prompts.

Coach and Companion are one product surface. Progress is the primary detailed analytics destination; Companion interprets bounded facts and links back to inspectable Progress evidence rather than becoming a second data authority.

## Labs / Analyses boundary

Labs is private and server-authoritative.

- OCR/extraction output remains reviewable draft data until explicit confirmation.
- Confirmed structured facts, source units and laboratory reference intervals are authoritative.
- Chart/reference classifications are descriptive presentation states, not diagnoses.
- Ordinary Coach question context may use only bounded confirmed structured facts.
- Raw documents, extraction drafts, storage/provider payloads and secrets remain excluded from ordinary model-visible context.
- Provider-backed processing remains capability/configuration gated and fail closed.
- No reviewed Labs contract authorizes diagnosis, prescribing, medication/supplement dosing or causal clinical claims.

## Social, Stories, media, and private state

Private fitness state uses revisioned synchronization.

Social, Stories, Labs and managed media are server-authoritative domains separate from private `AppState` synchronization. The Home feed and Story strip reuse Social authority, account-scoped caches, pagination, block/private-profile enforcement, and moderation boundaries.

Stories retain one server-owned managed-image lifecycle and active visibility authority while reviewed product slices add bounded behavior around it. The backend owns authenticated creation, expiry/archive transitions, Following/Close Friends visibility, viewed state, replies, Highlights, interaction lifecycle, owner deletion, account-deletion cascade, retention cleanup and the `story_image` managed-media lifecycle. Mobile strictly consumes that authority and must not fabricate server Story rows, audience membership, viewer/reply activity, archive state, effective push delivery or managed-media approval.

S10 is specifically bounded by `docs/architecture/stories-s10-contract.md`: owner viewer lists are separate from liker/reactor identity privacy; Close Friends membership is subordinate to an authoritative follow edge; reply retries preserve idempotency identity; the push preference remains ineffective until a separately approved provider/native package; Archive/Highlights do not make expired Stories active again. `docs/roadmap/stories.md` separates source/CI completion from authorization-gated environment, physical-runtime and release evidence.

A shared workout remains an immutable bounded public snapshot created only through the explicit Social sharing flow. Home does not make private workout/nutrition/progress/Labs data public merely by displaying personal context next to Social content.

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

For Stories, `docs/roadmap/stories.md` is the focused source/release/expansion roadmap and `docs/architecture/stories-s10-contract.md` defines the reviewed S10 product/privacy boundary. For the Liquid Glass/Home UI program, `docs/roadmap/liquid-glass.md` is the focused execution/evidence roadmap. Phase 15 source/CI closure evidence is recorded in `docs/qa/phase15-closure.md`.

Permanent agent rules belong in `AGENTS.md`. The latest restart checkpoint belongs in `docs/handoffs/latest.md`.

## Change discipline

A pull request that changes architecture, synchronization coverage, roadmap state, active blockers, Social/Labs privacy boundaries, or deployment boundaries must update corresponding documentation in the same change.

Do not create a second broad overview when a current canonical file already covers the subject. Add a focused document or update the architecture/index hierarchy instead.