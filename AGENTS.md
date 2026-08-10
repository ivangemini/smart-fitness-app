# Smart Fitness App — Agent Instructions

## Repository role

This repository is the Expo / React Native mobile client for Smart Fitness.

Connected backend:

- repository: `ivangemini/smart-fitness-backend`;
- production API: `https://api.peptonio.com`;
- stack: Node.js 22, TypeScript, Fastify, PostgreSQL, Drizzle ORM, Zod, Pino, Docker Compose.

Do not introduce Supabase, Firebase, a second backend, or direct provider calls from mobile.

## Documentation source of truth

Read these documents before changing code:

1. `AGENTS.md` — permanent execution and safety rules.
2. `docs/project-context.md` — stable product and architecture context.
3. `docs/current-status.md` — verified current repository and roadmap state.
4. `docs/handoffs/latest.md` — the latest continuation checkpoint.
5. `PROJECT_LEARNINGS.md` — reusable project-specific implementation lessons.
6. `docs/implementation-plan.md` — canonical cross-repository execution plan.
7. Relevant focused documents under `docs/architecture/`, `docs/privacy/`, `docs/roadmap/`, `docs/qa/`, and `docs/release/`.

Code, migrations, tests, and exact current Git history override stale prose. When a change materially alters architecture, status, active blockers, or continuation state, update the relevant documentation in the same pull request.

Do not create broad duplicate architecture documents when a focused canonical document already exists. Use `docs/architecture/README.md` as the architecture index.

## Product boundaries

Approved product scope:

- workout tracking;
- nutrition tracking;
- progress tracking;
- profile and authentication;
- offline-first local persistence;
- revision-aware synchronization;
- deterministic and structured AI Coach flows;
- the server-authoritative Social workout network defined in `docs/roadmap/social-network.md`;
- the approved social-first Home integration defined in `docs/roadmap/liquid-glass.md`.

Do not add without explicit approval and a reviewed contract where applicable:

- blood-test analysis;
- diagnosis logic;
- pharmacology, hormone, SARM, or medication-dosing logic;
- coach marketplace;
- new Social domains outside the approved Social/Home roadmaps;
- payments or subscriptions.

Stories are an approved product direction but must not be implemented as fake/local content before their server, privacy, expiry, media, moderation, and viewed-state contracts exist.

## Mobile architecture

- Expo SDK 56;
- React Native and Expo Router;
- TypeScript;
- AsyncStorage for offline-first application state, metadata, and queues;
- Expo SecureStore for native access and refresh tokens;
- shared backend API through `src/api/`;
- adaptive Liquid Glass UI with the floating bottom navigation as the material reference and coherent light/dark/system appearance.

One authoritative internal `AppState` still backs repositories, persistence, mutation ordering, outbox generation, and synchronization. Production consumers must use focused state boundaries rather than the full compatibility `useAppContext` hook.

Available focused boundaries include:

- `AppActions`;
- `AppInfrastructure`;
- `WorkoutState`;
- `NutritionDataState`;
- `ProgressState`;
- `ProfileDataState`;
- `SafetyRecoveryState`.

Synchronization orchestration lives in `src/context/SyncContext.tsx` and `src/cloud/`.

Social remains server-authoritative and separate from private `AppState` synchronization. Do not route Social profiles, follows, posts, reactions, comments, notifications, reports, moderation, or future Stories through the private revisioned-sync layer.

## Current synchronization baseline

First-class revisioned synchronization exists for:

- weight history;
- completed workout sessions and sets;
- custom workout templates;
- food entries;
- nutrition targets;
- fitness profiles;
- user limitations;
- recovery check-ins;
- typed body measurements;
- training programs;
- custom exercises with stable UUID references;
- meal templates with strict nested food snapshots;
- account-scoped Nutrition library items.

Do not describe synchronization as weight-only. Do not describe custom exercises or meal templates as local-only. Do not route unrelated entities through the weight adapter.

Source-level synchronization hardening is complete for the current contracts:

- eager weight-history outbox operations are journaled for restart replay;
- planner-based domains regenerate missing operations from persisted state, metadata, and pending queue state;
- push and pull token-refresh retries preserve cursor, payload, base revision, and idempotency identity;
- concurrent-pull coverage protects local mutations during remote materialization;
- two-device conflict coverage spans every mutable synchronized domain;
- unresolved conflict state persists and Data & Sync exposes bounded retry, recovery, review, and diagnostics.

Remaining validation requires matching physical standalone runtimes: offline termination/restart, reconnect, recovery, and second-device conflicts.

Application-state persistence and outbox enqueue are not one atomic transaction. Preserve explicit recovery semantics.

## AI Coach baseline

Implemented mobile surfaces include:

- deterministic Nutrition review and metrics;
- structured Nutrition Strategy preview and explicit confirmation;
- deterministic Strength review and structured Strategy preview;
- explicit workout-template confirmation;
- deterministic Safety & Recovery review;
- pre-workout Safety acknowledgement and immutable workout provenance;
- read-only Combined Review;
- Combined Proposal with effective Safety-capped Strength;
- separate explicit Strength-template and Nutrition-target confirmations;
- run history, provenance, before/after summaries, trust state, and privacy-safe input coverage.

Provider-backed models are capability-gated by the backend. Mobile remains provider-neutral and never contains provider secrets.

Automatic application is prohibited. Do not invent a client-only compensating revert. A safe revert requires an explicit backend contract covering ownership, revisions, idempotency, conflicts, and audit history.

## CI runner and Actions cost policy

This is a permanent cross-repository execution rule, not a temporary optimization note.

- Routine authoritative **Mobile CI** must run on the dedicated self-hosted runner label `[self-hosted, linux, x64, hermes-mobile-ci]`.
- Routine **Backend CI**, **Backend PostgreSQL CI**, and **Account Deletion Receipt CI** must also use the Hermes self-hosted runner once the corresponding backend policy change is merged.
- Do **not** move routine validation back to `ubuntu-latest` or another GitHub-hosted runner for convenience, diagnostics, or ordinary PR work. A hosted fallback requires an explicit demonstrated Hermes outage or incompatibility and must be bounded to the affected validation.
- Do not run hosted and Hermes copies of the same authoritative gate in parallel.
- Preserve `concurrency.cancel-in-progress: true` and documentation-only path filters.
- Avoid intermediate pushes after a PR is opened when they are not necessary: each new head can trigger another complete validation run.
- After an exact-head PR validation succeeds, do not repeat the same full Mobile CI merely because GitHub created a `Merge pull request #…` merge commit. Preserve CI for direct/non-merge pushes to `main` and manual dispatches. The canonical deduplication contract is documented in `docs/architecture/mobile-ci-runner-policy.md`.
- Never create temporary per-task GitHub Actions workflows when an existing permanent workflow or local/self-hosted execution can perform the work.
- Optimizing runner usage must not weaken the authoritative validation surface: TypeScript, regression tests, required model smoke, Expo export/Doctor, backend lint/format/build/tests, and relevant PostgreSQL validation remain required where applicable.

When starting a new chat or agent session, assume this policy is active unless exact current Git history shows that it was deliberately superseded. Do not require the user to restate it.

## Required workflow

Before changes:

1. Inspect exact current `main` in both repositories.
2. Inspect open pull requests in both repositories.
3. Read the documentation source-of-truth set above.
4. Read `DEBUGGING_SKILL.md` for failures or regressions.
5. Inspect only files relevant to the bounded task.
6. Work from a clean branch based on exact current `main`.
7. Avoid overlapping an active pull request unless coordination is explicit.

After TypeScript or TSX changes, run locally when available:

```bash
npx tsc --noEmit
npm test
```

Authoritative validation is the full Mobile CI workflow, including:

- repository and changed-file line limits;
- TypeScript;
- Coach and sync contract tests;
- the full regression suite;
- Expo export;
- Expo Doctor.

Do not claim completion while required CI is failing. Merge only the exact validated head.

Documentation-only changes do not require Expo execution, but links, paths, repository baselines, and cross-repository claims must be verified.

## File-size policy

Hand-written source files must remain at or below 500 physical lines.

- Extract cohesive components, hooks, styles, parsers, contracts, or pure helpers.
- Do not create generic abstractions only to reduce line count.
- Keep every new hand-written file below the limit.
- Preserve public behavior and tests when moving logic.
- Generated files, lockfiles, generated migrations, and packed outputs are excluded.

## API, authentication, and security

Use shared API configuration from `src/api/config.ts`.

- Preferred public variable: `EXPO_PUBLIC_API_BASE_URL`.
- Production default: `https://api.peptonio.com`.
- `EXPO_PUBLIC_FOOD_API_BASE_URL` is only a backwards-compatible fallback.
- Secrets must never use `EXPO_PUBLIC_*` or be committed.
- Food-provider and AI-provider credentials remain backend-only.
- Native access and refresh tokens use Expo SecureStore.
- Ordinary cached session storage remains tokenless.
- Web and non-native test runtimes use volatile token storage.
- Never expose tokens, email, raw health data, payloads, full idempotency keys, provider diagnostics, or internal error text in telemetry or UI.

`expo-secure-store` is a native dependency. A matching native runtime is required before release.

## Synchronization invariants

The app is offline-first. Preserve local usability without a network connection.

When changing synchronization:

- use stable entity IDs and ISO timestamps;
- keep payloads schema-versioned;
- enqueue through the existing operation queue;
- preserve idempotency keys and revision metadata;
- validate remote payloads at the trust boundary;
- never replace full local state with an unvalidated response;
- never silently overwrite unresolved conflicts;
- advance the cursor only after every returned operation is safely handled;
- test round-trip, deletion, duplicate delivery, offline queueing, restart recovery, and conflicts.

Critical mutations must use the ordered observable mutation flow. Do not reintroduce unobserved `void repository.saveState(...)` or `void enqueue(...)` calls.

Recovery boundary:

- eager outbox operations must be journaled before enqueue;
- planner-based domains must retain enough persisted state and metadata to regenerate missing operations;
- do not add duplicate journals without a demonstrated loss path.

## AI Trainer architecture

Required backend shape:

```text
Fastify endpoint
→ Orchestrator
→ narrowly scoped typed Subagents
→ deterministic TypeScript Workers / Validation
→ Output Engine
→ PostgreSQL through Drizzle ORM
```

Required subagent roles:

- Nutrition Agent;
- Strength & Volume Agent;
- Safety & Recovery Agent.

All subagent outputs use strictly typed, versioned Zod schemas. Deterministic workers own authoritative calculations and hard safety limits. Hidden chain-of-thought is never persisted.

## Coding and UI rules

Prefer minimal diffs. Preserve routes, IDs, schemas, persistence, synchronization, calculations, polling, idempotency, confirmations, and completed history unless the task explicitly changes them.

Do:

- keep TypeScript strict-compatible;
- use existing UI components;
- keep calculations in pure functions;
- keep persisted data serializable;
- localize new user-facing copy;
- use bounded display mappings for statuses, enums, provider errors, and internal codes;
- use centralized locale, date, number, plural, and unit formatters.

Do not:

- refactor unrelated code;
- change routing without need;
- install dependencies without approval;
- duplicate API clients;
- call AI providers from mobile;
- expose raw backend, provider, status, schema, or error text in presentation.

UI invariants:

- preserve and extend the shared Liquid Glass visual system defined in `docs/architecture/liquid-glass-ui.md`; do not reintroduce flat dark-only presentation as the global default;
- use shared adaptive glass tokens/primitives instead of screen-local `rgba(...)` recipes;
- reserve true backdrop blur for bounded elevated/floating chrome rather than every card or list row;
- keep intentionally dense/dark Workouts surfaces stable until their dedicated LG-4 migration package;
- account for bottom-tab and safe-area overlap;
- use `keyboardShouldPersistTaps="handled"` on scrollable forms;
- keep related text and controls as siblings in one Flexbox parent;
- do not align related controls using screen-relative coordinates or isolated pixel nudges.

Home invariants while LG-H is active:

- Home is a social-first hybrid: compact personal status first, then future Stories when contracted, then Social feed;
- do not hide the existing fitness utility behind a mandatory Social interaction;
- do not fabricate steps, Stories, recommendations, or public activity;
- reuse the existing server-authoritative Following Feed contracts/cache instead of creating a second feed store;
- preserve block/private-profile/moderation/account boundaries from `docs/roadmap/social-network.md`.

## Navigation invariants

Do not break:

- Home → Start Workout → `/workout-session`;
- Workouts → Start Workout → `/workout-session`;
- Finish Workout → save session and return to Home;
- Cancel Workout → return without saving;
- active workout resume after leaving the session screen.

The workout session remains outside the tab group.

## Git and deployment

For approved changes:

1. branch from exact current `main`;
2. make a bounded change;
3. run required validation;
4. inspect review threads;
5. merge only the exact green head.

Use `[ota]` only for OTA-safe JavaScript, TypeScript, TSX, or compatible assets.

Do not perform or claim OTA publication, EAS/native builds, device installation, backend deployment, staging activation, production activation, migration execution outside CI, worker scheduling, or credential changes unless explicitly requested.

## Priority handling

The mutable priority order belongs in `docs/current-status.md` and `docs/implementation-plan.md`, not in this permanent instruction file.

Default order:

1. keep architecture, status, and handoff documentation synchronized with code;
2. continue only the currently approved roadmap package;
3. keep provider-backed capabilities and data collection fail closed until all listed blockers and approvals are resolved;
4. perform physical release, offline-restart, accessibility, localization, and second-device validation only when explicitly authorized;
5. implement newly discovered regressions or separately prioritized product scope without duplicating completed work.
