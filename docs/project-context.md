# Smart Fitness Project Context

Updated: 2026-08-23

## Purpose

Smart Fitness is an offline-first fitness application covering workouts, nutrition, progress, authentication/profile, synchronization, deterministic/structured AI Coach workflows, private Labs / Analyses, a privacy-first Social workout network, evidence-linked Knowledge & Learning, Exercise/Training Intelligence, Adaptive Program proposals and private Progress Photos / Body Composition.

Repositories:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`;
- production API: `https://api.peptonio.com`.

This file is **stable orientation context**. Live commit/PR/CI truth comes from Git/GitHub; mutable product/workstream state belongs in `docs/current-status.md`; restart state belongs in `docs/handoffs/latest.md`; forward sequencing belongs in `docs/implementation-plan.md` and `ROADMAP_PROGRESS.md`.

Exact code, schemas, migrations, tests and current Git history override stale prose.

## Product surfaces

The mobile application includes:

- social-first Home with personal daily context, Stories and Social workout feed;
- Workouts, programs, custom templates, exercise library and active workout logging;
- exercise preferences and deterministic Smart Replace candidates;
- Workout Assistant guidance, warm-ups, rest timer, set types/supersets and bounded contextual adjustments;
- Nutrition diary, targets, reusable meals and saved library items;
- Progress with body, strength/training, activity and highlights drill-downs;
- canonical SVG muscle anatomy, Exercise Intelligence, Training Coverage and deterministic Training Intelligence reviews;
- Adaptive Program + Recovery proposals with explicit bounded future-template Apply and optional read-only Coach explanation;
- private standardized progress photos, deterministic comparison and body-composition progress;
- Profile, authentication, Data & Sync and privacy-facing controls;
- Coach/Companion flows for Nutrition, Strength, Safety & Recovery, Combined review and bounded questions;
- Labs / Analyses as a private server-authoritative longitudinal laboratory-results domain;
- Social profiles, relationships, Stories, workout posts, feeds, reactions, comments, notifications and moderation/reporting surfaces;
- Knowledge Library, immutable article reader, quizzes, account-owned learning state and reviewed learning paths;
- optional Coach → Learn recommendation cards only when an approved deterministic mapping exists.

Knowledge is deliberately non-gamified. No Knowledge XP, levels, streaks, badges, leaderboards, punishment or reward currency belong to the reviewed contract.

## Mobile architecture

- Expo SDK 56, React Native, Expo Router and TypeScript.
- One authoritative internal `AppState` is persisted through AsyncStorage for private offline-first fitness domains.
- Production screens consume focused state boundaries rather than the broad compatibility `useAppContext` hook.
- Ordered observable mutations protect critical persistence paths.
- Native access and refresh tokens use Expo SecureStore.
- API access is centralized under `src/api/`.
- Synchronization orchestration lives in `src/context/SyncContext.tsx` and `src/cloud/`.
- Presentation uses the adaptive Liquid Glass system documented under `docs/architecture/`.

Local AsyncStorage remains the reviewed storage strategy for private offline-first fitness state; alternatives are not implementation authorization without new evidence/review.

## Data authority classes

### Private revisioned fitness state

Mobile owns the offline working copy; backend owns account revision/conflict/tombstone authority for synchronized entities.

Revisioned synchronization includes:

- weight history;
- completed workout sessions and sets;
- workout templates;
- food entries and nutrition targets;
- fitness profiles and user limitations;
- recovery check-ins;
- body measurements;
- training programs and custom exercises;
- meal templates and Nutrition library items.

Core invariants include stable IDs, schema-versioned payloads, ISO timestamps, idempotent operations, authoritative server revisions, explicit tombstones, persisted conflicts and safe cursor advancement.

### Server-authoritative account/domain state

These are not ordinary private fitness `AppState` sync families:

- authentication, sessions and devices;
- Coach run/orchestration/provenance authority;
- Labs documents/results/jobs;
- Social/Stories/notifications and managed media;
- canonical Knowledge content;
- account-owned learning state.

Mobile renders bounded DTOs/actions but must not fabricate server truth.

### Private local progress-photo media

Phase 20 progress photos remain a separate private local-media authority:

- account-owned app metadata plus app-owned native document storage;
- camera/library input re-encoded before durable storage;
- imported EXIF/location metadata not copied into durable app metadata;
- durable deletion/account cleanup required;
- no cloud/provider/social upload in the reviewed scope;
- comparison/body-composition views are derived/read-only and do not create a second measurement authority.

## Backend authority

The backend is server authority for:

- authentication, sessions, devices and account ownership;
- synchronized revisions, idempotency, conflicts and tombstones;
- server-backed Coach orchestration, findings, confirmation and provenance;
- provider credentials/access;
- Labs result/document ownership and confirmation;
- Social, Stories and managed-media state;
- canonical Knowledge concepts/articles/versions/sources/claims/quizzes/publication state;
- private account-owned learning state;
- deterministic Coach → Learn rule evaluation and exact-version recommendation hydration;
- privacy, retention, deletion and export-source controls.

Mobile must not call privileged model, moderation, OCR, storage, evidence/search, email or similar providers directly.

## AI Coach / Companion model

Required backend architecture remains:

```text
Fastify route
→ Orchestrator
→ typed specialized Subagents
→ deterministic TypeScript Workers / Validation
→ Output Engine
→ PostgreSQL / Drizzle
```

Deterministic calculations and hard guardrails stay outside model prompts. Automatic application is prohibited. Hidden chain-of-thought is not stored.

Coach and Companion remain one product surface. Progress is the primary detailed analytics destination; Coach/Companion present or explain bounded facts and link to inspectable evidence rather than becoming a second data authority.

## Knowledge & Learning authority

Canonical content is prepared/reviewed ahead of end-user consumption:

`topic → curated evidence → AI-assisted draft → claim/source verification → quiz validation/review → immutable published article version`

User relevance loop:

`bounded user evidence → deterministic Coach finding → allowlisted mapping → canonical article → validated quiz → informational learning state`

Key rules:

- published article versions are immutable evidence boundaries;
- material claims are source-linked and approval-gated;
- quizzes reference exact article versions/reviewed claims;
- Tier-3 Labs/medical-adjacent education requires human review and remains non-diagnostic/non-prescriptive;
- canonical shared content contains no private user evidence;
- learning state is private account-owned state outside fitness AppState sync;
- reading/quiz completion cannot automatically mutate fitness/Labs/safety state;
- no Learn recommendation is emitted when no approved mapping exists.

## Exercise + Training Intelligence authority

- one reviewed canonical muscle taxonomy and reusable local SVG anatomy;
- exact/fail-closed muscle mapping;
- deterministic completed-session analytics under explicit windows;
- reviewed static Exercise Intelligence for canonical local exercise identities only;
- no runtime guessing of movement pattern/technique/ROM/fatigue/substitutions from labels;
- qualitative fatigue cost is programming guidance, not a measured readiness signal;
- `training-intelligence-v1` findings remain deterministic evidence, not model output authority;
- Training Coverage and Training Intelligence Loop compose existing deterministic evidence without a second analytics store.

## Smart Replace authority

Candidate authority starts from reviewed Exercise Intelligence substitutions and exact repository resolution.

- `avoid` filters the reviewed shortlist but does not prohibit explicit manual selection;
- active-session replacement mutates only explicitly pending sets and preserves completed/legacy history;
- #824 established the exact-ID custom-template replacement primitive and deterministic `Workout.prescription` identity remapping;
- the remaining custom-template Smart Replace product flow must be previewed and explicitly confirmed;
- no automatic active-session, template or program rewrite is authorized.

## Adaptive Program + Recovery authority

The completed A1–A4 package composes existing deterministic training evidence into explicit proposals.

- exact active/default `TrainingProgram` and `Workout`/exercise identity remain authority;
- proposal actions are deterministic `progress | maintain | review`;
- fresh stored recovery check-in evidence may conservatively downgrade proposals without a weighted universal readiness score;
- descriptive recent exposure evidence is not a physiological recovery timer;
- eligible future custom-template prescription changes require explicit preview and Apply;
- A3 uses exact identity, bounded target changes, idempotency marker and stale fingerprint checks;
- completed workout history is immutable;
- A4 Coach explanation is read-only over already-derived facts and cannot recalculate or apply the proposal.

Do not silently extend A1–A4; future adaptive work requires a new reviewed unnumbered package.

## Labs boundary

Labs is private and server-authoritative. OCR/extraction remains reviewable draft data until explicit confirmation. Confirmed structured facts, source units and reference intervals are authoritative. Ordinary Coach/Knowledge context excludes raw documents, unconfirmed extraction drafts, provider payloads and secrets.

No reviewed Labs/Knowledge contract authorizes diagnosis, emergency triage, prescribing or medication/supplement dosing.

## Social / managed media boundary

Social, Stories and managed media are server-authoritative. Sharing private fitness data is explicit; Home co-location does not make private workout/nutrition/progress/Labs data public. Provider object keys, secrets and raw provider payloads remain backend-only.

## Release and deployment boundary

Source merge, backend deployment, database migration execution, provider activation, canonical content activation, OTA/native publication and physical-device validation are separate claims.

Admin production activation is closed for the reviewed scope; operational deployment truth still belongs to backend current-status/operations and must be re-checked before production actions.

## Documentation hierarchy

When statements conflict:

1. exact code, migrations, schemas, tests and current Git/GitHub state;
2. focused architecture/privacy/operations/QA/release documents for stable contracts;
3. `docs/current-status.md` for mutable workstream checkpoint;
4. `docs/implementation-plan.md` and `ROADMAP_PROGRESS.md` for forward sequencing;
5. this stable project context;
6. `PROJECT_LEARNINGS.md`;
7. historical PR descriptions/chat summaries.

Permanent agent rules belong in `AGENTS.md`. Fast navigation belongs in `PROJECT_MAP.md` and `docs/agent/`. Latest continuation state belongs in `docs/handoffs/latest.md`.

## Change discipline

A change that materially alters architecture, ownership, sync coverage, privacy, roadmap status, deployment boundaries or major product authority must update the corresponding canonical documentation in the same PR.

Do not create another broad overview when an existing canonical file already owns the subject. Prefer focused docs and links over duplicated mutable facts.
