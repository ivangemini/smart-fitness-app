# Smart Fitness Project Context

Updated: 2026-08-21

## Purpose

Smart Fitness is an offline-first fitness application covering workouts, nutrition, progress, authentication/profile, synchronization, deterministic/structured AI Coach workflows, private server-authoritative Labs / Analyses, a privacy-first server-authoritative Social workout network, and an evidence-linked Knowledge & Learning system.

Repositories:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`;
- production API: `https://api.peptonio.com`.

This file is stable orientation context. Mutable execution state belongs in `docs/current-status.md`; detailed forward roadmap state belongs in `docs/implementation-plan.md` and focused roadmap files.

Exact code, schemas, tests, migrations and current Git history override stale prose.

## Current source baseline

### Mobile

- current `main`: `2405647bf6cc3f2b841adb54d0b8745ce1c43130`;
- merged runtime through #797;
- Phase 18 mobile packages merged through Knowledge Library/Reader, account-owned exact-version learning state, immutable learning paths and optional Coach → Learn consumer UI.

### Backend

- current `main`: `a6179aff35093325f0571139d6ced7e3987a2f10` (#309);
- Phase 18 backend packages merged through canonical Knowledge persistence, editorial orchestration, quiz authority, account-owned learning state, deterministic recommendation selection, learning paths, trusted Coach finding authority and the optional Coach run-detail Learn host.

Backend Admin v5-v12 PR #305 is source-ready and exact-head validated but intentionally unmerged because landing it on backend `main` triggers the configured Peptonio Admin production deployment.

## Product surfaces

The mobile application contains:

- social-first Home with compact personal daily context, Stories and Social workout feed;
- Workouts and active workout logging;
- Nutrition diary, targets, reusable meals and saved library items;
- Progress with Body / Strength & Training / Activity / Highlights drill-downs;
- Profile, authentication, Data & Sync and privacy-facing controls;
- Nutrition, Strength, Safety & Recovery, Combined and read-only question Coach/Companion flows;
- Labs / Analyses as a private server-authoritative longitudinal laboratory-results domain;
- Social profiles, relationships, Stories, workout posts, following feed, reactions, comments, notifications, reporting/moderation surfaces and managed-media contracts;
- Knowledge Library and immutable article reader;
- account-owned exact-version learning state and reviewed learning paths;
- optional Coach → Learn recommendation cards on persisted Coach run detail when an approved backend rule exists.

Knowledge & Learning is deliberately non-gamified. No Knowledge XP, levels, streaks, badges, leaderboards, competition, punishment or reward currency are part of the reviewed contract.

The reviewed Coach → Learn runtime is complete, but the production mapping registry remains intentionally empty until approved canonical `findingCode → articleId` mappings exist. Runtime code must not invent article IDs or provider-selected fallback lessons.

## Mobile architecture

- Expo SDK 56, React Native, Expo Router and TypeScript.
- One authoritative internal `AppState` is persisted through AsyncStorage for private offline-first fitness domains.
- Production screens consume focused state boundaries rather than the broad compatibility `useAppContext` hook.
- Ordered observable mutations protect critical persistence paths.
- Native access and refresh tokens use Expo SecureStore.
- API access is centralized under `src/api/`.
- Synchronization orchestration lives in `src/context/SyncContext.tsx` and `src/cloud/`.
- Presentation uses the adaptive Liquid Glass system documented in `docs/architecture/liquid-glass-ui.md`.
- Social and Labs are server-authoritative domains separate from private revisioned `AppState` synchronization.
- Canonical Knowledge is backend-authoritative shared content.
- Learning state is a separate account-owned server-authoritative domain with its own deletion/export/privacy semantics; it is not inserted into private fitness `AppState` sync.

Local AsyncStorage remains the active storage strategy for private offline-first app state; architecture-only alternatives are not implementation authorization.

## Backend authority

The backend is the server authority for:

- authentication, sessions, devices and account ownership;
- authoritative revisions, idempotency, conflicts and tombstones;
- server-backed Coach orchestration, findings, confirmation and run provenance;
- provider access and secrets;
- Labs result/document ownership and confirmation authority;
- Social, Stories and managed-media authority;
- canonical Knowledge concepts/articles/article versions/sources/claims/quizzes and publication state;
- private account-owned learning state;
- deterministic Coach → Learn rule evaluation and exact-version recommendation hydration;
- privacy, retention, deletion and export source controls.

Mobile must not call food, model, moderation, classifier, OCR, storage, email, search/evidence or other providers directly.

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

Canonical Knowledge shared content and private learning state are not fitness `AppState` sync entity families. Learning state uses its reviewed account-scoped server authority instead.

## AI Coach model

Required backend architecture:

```text
Fastify route
→ Orchestrator
→ typed specialized Subagents
→ deterministic TypeScript Workers / Validation
→ Output Engine
→ PostgreSQL / Drizzle
```

Implemented categories include:

- deterministic Nutrition review and structured strategy proposal/confirmation;
- deterministic Strength review and structured strategy proposal/confirmation;
- deterministic Safety & Recovery review;
- Combined Review and Combined Proposal with Safety-capped effective Strength;
- explicit application paths and run history/provenance/trust state;
- bounded read-only question orchestration with minimal scopes and minimized evidence;
- confirmed structured Labs overview/marker-history evidence;
- bounded goal-progress question evidence;
- deterministic trusted Coach finding identity from persisted Combined Coach runs;
- optional fail-isolated Knowledge recommendation projection.

Automatic application is prohibited. Hidden chain-of-thought is not stored. Deterministic calculations and hard guardrails stay outside model prompts.

Coach and Companion remain one product surface. Progress is the primary detailed analytics destination; Companion interprets bounded facts and links to inspectable evidence rather than becoming a second data authority.

Coach → Learn selection is deterministic and allowlisted: `trusted typed finding → approved mapping rule → canonical publication-eligible exact article version`. Free-form model prose is not article-selection authority.

## Knowledge & Learning authority

Canonical educational content is generated/reviewed ahead of end-user consumption:

`topic → curated evidence pack → AI-assisted draft → claim extraction → source verification → quiz generation → quiz validation/review → published article version`.

Merged user loop:

`bounded user evidence → deterministic Coach finding → allowlisted mapping → canonical article → validated quiz → informational learning state`.

Key rules:

- published article versions are immutable evidence boundaries;
- material factual claims are source-linked and approval-gated;
- quizzes reference exact article versions and reviewed claims;
- ambiguous answer keys fail closed;
- Tier-3 Labs/medical-adjacent education requires human review;
- canonical shared content contains no private user evidence;
- dynamic relevance may be bounded by private evidence but cannot rewrite the factual core;
- learning state is informational (`unseen | read | understood | refresh_useful`) and non-gamified;
- reading/quiz completion cannot automatically mutate workout/nutrition/goal/Labs/recovery/safety state;
- later outcome changes cannot be attributed causally to reading;
- raw Labs documents and unconfirmed extraction drafts remain outside ordinary Knowledge generation/recommendation context;
- no Learn recommendation is emitted when no reviewed mapping exists.

Focused architecture: `docs/architecture/phase18-knowledge-learning-system.md`.
Focused roadmap: `docs/roadmap/knowledge-learning.md`.

## Labs / Analyses boundary

Labs is private and server-authoritative.

- OCR/extraction output remains reviewable draft data until explicit confirmation.
- Confirmed structured facts, source units and laboratory reference intervals are authoritative.
- Chart/reference classifications are descriptive presentation states, not diagnoses.
- Ordinary Coach question context may use only bounded confirmed structured facts.
- Raw documents, extraction drafts, storage/provider payloads and secrets remain excluded from ordinary model-visible context and ordinary Knowledge generation.
- Provider-backed processing remains capability/configuration gated and fails closed.
- No reviewed Labs or Knowledge contract authorizes diagnosis, emergency triage, prescribing, medication/supplement dosing or causal clinical claims.

## Social, Stories, media and private state

Private fitness state uses revisioned synchronization.

Social, Stories, Labs and managed media are server-authoritative domains separate from private `AppState` synchronization. Canonical Knowledge is shared backend-authoritative content and learning state uses separate account-owned server authority.

The backend owns Story creation, expiry/archive transitions, Following/Close Friends visibility, viewed state, replies, Highlights, interaction lifecycle, owner deletion, account-deletion cascade, retention cleanup and managed-media lifecycle. Mobile consumes that authority and must not fabricate server Story rows, audience membership, viewer/reply activity, archive state, effective push delivery or managed-media approval.

A shared workout remains an immutable bounded public snapshot created only through the explicit Social sharing flow. Home does not make private workout/nutrition/progress/Labs data public merely by displaying personal context next to Social content.

Provider-backed capabilities remain disabled or fail closed until configuration, policy, infrastructure, deployment and evidence requirements are satisfied.

## External evidence state

Ordinary autonomous Phase 14 source/runtime preparation is exhausted for current contracts. Remaining evidence requires external prerequisites:

- Push: staging-only APNs/FCM material plus physical-device permission/token/delivery/tap/deep-link evidence;
- Labs: staging-only HTTPS S3-compatible storage + Gemini material plus bounded provider lifecycle and physical-device import evidence;
- Steps: signed HealthKit/Health Connect physical-device evidence;
- Stories: remaining mobile/physical-device runtime evidence.

These gates are independent of closed Phase 18 source work.

## Production / activation boundaries

Source completion, merge, deployment, provider activation, canonical content publication, OTA/native publication and physical-device validation are separate claims.

Backend Admin #305 is source-ready but merge remains production-affecting because backend `main` triggers the configured Peptonio Admin Vercel deployment. Do not merge it without separate explicit production authorization.

Provider-backed Knowledge/Labs/Push capabilities remain fail closed until reviewed configuration and evidence exist. Approved content mappings are an editorial/product-authority action, not something runtime code should synthesize.

## Documentation hierarchy

Use this order when statements conflict:

1. exact code, migrations, schemas, tests and current Git history;
2. `docs/implementation-plan.md`;
3. `docs/current-status.md`;
4. focused architecture, privacy, operations, QA and release documents;
5. `docs/project-context.md`;
6. `PROJECT_LEARNINGS.md`;
7. old PR descriptions, chat summaries and historical notes.

Permanent agent rules belong in `AGENTS.md`. The latest restart checkpoint belongs in `docs/handoffs/latest.md`.

## Change discipline

A pull request that changes architecture, synchronization coverage, roadmap state, active blockers, Social/Labs/Knowledge privacy boundaries or deployment boundaries must update corresponding documentation in the same change.

Do not create a second broad overview when a current canonical file already covers the subject. Add a focused document or update the existing hierarchy instead.