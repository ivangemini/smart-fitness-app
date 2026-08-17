# Smart Fitness App — Agent Instructions

## Repository role

This repository is the Expo / React Native mobile client for Smart Fitness.

Connected backend:

- repository: `ivangemini/smart-fitness-backend`;
- production API: `https://api.peptonio.com`;
- stack: Node.js 22, TypeScript, Fastify, PostgreSQL, Drizzle ORM, Zod, Pino, Docker Compose.

Do not introduce Supabase, Firebase, a second backend, or direct provider calls from mobile.

## Documentation source of truth

Read before changing code:

1. `AGENTS.md`;
2. `docs/project-context.md`;
3. `docs/current-status.md`;
4. `docs/handoffs/latest.md`;
5. `PROJECT_LEARNINGS.md`;
6. `docs/implementation-plan.md`;
7. relevant focused documents under `docs/architecture/`, `docs/privacy/`, `docs/roadmap/`, `docs/qa/`, and `docs/release/`.

Exact code, migrations, tests and current Git history override stale prose. Update canonical status/handoff/roadmap documentation when a change materially alters architecture, supported product scope, blockers or continuation state.

## Autonomous execution policy

Default to parallel-first autonomous execution and maximize useful completed roadmap work per pass.

- Partition approved work into independent workstreams and execute non-overlapping workstreams in parallel whenever safe.
- Prefer large coherent batches over micro-PRs or repeated tiny inspect/edit/test cycles. A batch may include multiple closely related demonstrated fixes when they share one contract and can be validated together.
- CI, review latency, or an external blocker on one PR blocks only that PR. Continue other independent approved work instead of ending the pass.
- Multiple simultaneous PRs are allowed when their changed files, migrations, contracts, and generated artifacts do not overlap or depend on unmerged behavior.
- Do not stop merely to report progress while another safe, approved, autonomous roadmap task is executable. Continue until available work is exhausted or a genuine authorization, product-decision, dependency, conflict, or environment blocker is reached.
- After a dependency merges, rebase or rebuild dependent work from exact current `main` before merge and revalidate the exact resulting head.
- Run validation at meaningful batch boundaries rather than after every microscopic edit, while preserving all required authoritative gates before merge.
- Mobile and backend work may proceed concurrently when their contracts are independent. Coordinated API/schema changes remain one dependency-aware workstream.
- Read-only audits and preparation may continue while CI is queued or running, including identifying and scoping subsequent non-overlapping demonstrated defects.
- Never manufacture refactors solely to keep busy. Work must remain roadmap-backed, source-demonstrated, or necessary to unblock an approved package.

Parallel execution does not weaken safety or merge quality. Exact-head required CI must pass before source completion/merge where policy requires it, and operational actions that require explicit authorization remain prohibited.

## Current product boundaries

Approved product scope includes:

- workout, nutrition and progress tracking;
- profile, authentication, offline-first persistence and revision-aware synchronization;
- deterministic and structured AI Coach flows;
- the server-authoritative Social workout network and Stories contracts already reviewed in source;
- adaptive Liquid Glass UI and the social-first Home integration;
- **Labs / Analyses** as a private, server-authoritative longitudinal laboratory-results domain;
- **Companion** as the user-facing motivational/presentation layer over existing Coach and canonical fitness history.

Labs rules:

- raw/extracted document data is never Social-visible;
- OCR/extraction output is reviewable draft data until explicit confirmation;
- confirmed structured facts, source units and laboratory reference intervals remain authoritative;
- chart/reference classifications are descriptive presentation states, not diagnoses;
- panel comparison must not claim health improvement/worsening from classification movement;
- provider-backed extraction and interpretation remain capability-gated and fail closed;
- mobile never calls OCR/vision/model providers directly;
- Labs stays outside private revisioned `AppState` sync and uses its server-authoritative repository/context boundary.

Companion rules:

- Companion is not a second Coach, health record, workout store or recommendation authority;
- progression may be derived deterministically from canonical completed history and must not mutate source fitness data;
- do not reward repeated same-day workouts, medical testing, food restriction, weight loss, or other potentially compulsive behavior;
- avoid punishment, guilt, streak-loss language or dark patterns;
- Companion may surface existing Coach/Safety actions but cannot automatically apply a plan;
- model/provider-backed conversational or autonomous behavior requires a separately reviewed contract before activation.

Still prohibited without an explicit reviewed contract and direct authorization where relevant:

- diagnosis, emergency triage or clinical urgency inference;
- prescriptions, medication dosing, pharmacology, hormone or SARM protocols;
- unrestricted model access to raw Labs documents;
- payments/subscriptions;
- new Social domains beyond reviewed contracts;
- real push/provider activation, HealthKit/Health Connect activation or new native dependencies.

## Mobile architecture

- Expo SDK 56;
- Expo Router + React Native + TypeScript;
- AsyncStorage for offline-first application state, metadata and queues;
- Expo SecureStore for native access/refresh tokens;
- shared backend API through `src/api/`;
- adaptive Liquid Glass with light/dark/system appearance.

One authoritative internal `AppState` still backs private offline-first fitness domains. Production consumers use focused state boundaries rather than the compatibility `useAppContext` hook.

Focused boundaries include `AppActions`, `AppInfrastructure`, `WorkoutState`, `NutritionDataState`, `ProgressState`, `ProfileDataState`, and `SafetyRecoveryState`.

Synchronization orchestration lives in `src/context/SyncContext.tsx` and `src/cloud/`.

Social and Labs are server-authoritative domains separate from private revisioned `AppState` synchronization.

## Synchronization baseline

First-class revisioned synchronization exists for weight history, completed workout sessions/sets, workout templates, food entries, nutrition targets, fitness profiles, limitations, recovery check-ins, typed body measurements, training programs, custom exercises, meal templates and account-scoped Nutrition library items.

Preserve stable IDs, ISO timestamps, schema versions, idempotency, revision metadata, conflict state, cursor safety and explicit recovery semantics. Do not silently overwrite unresolved conflicts or replace local state with unvalidated remote payloads.

Application-state persistence and outbox enqueue are not one atomic transaction. Preserve journal/planner recovery paths.

## AI Coach and Labs AI boundaries

Coach uses deterministic-first typed orchestration. Models may interpret validated facts and propose structured strategies but deterministic workers own calculations and hard guardrails. Automatic application remains prohibited.

Labs interpretation uses confirmed minimum structured context, bounded validated output and provenance. Raw Labs documents/provider payloads must not be exposed to ordinary Coach/model context. Provider/model identity comes from the transport boundary, not generated model fields.

Hidden chain-of-thought is never persisted.

## Phase 13 Companion baseline

The Companion is the hidden Coach route reached through the global floating Companion entry above the tab bar.

Phase 13 v1 rules:

- preserve existing Coach/Safety/Profile actions inside the Companion surface;
- derive XP only from unique completed workout days: one grant per local calendar day;
- current source formula is deterministic: 100 XP per active training day and 500 XP per level;
- multiple sessions on one day do not increase XP;
- show a neutral seven-day rhythm and non-punitive mood state;
- no separate persisted Companion truth is required for derived progress;
- no backend migration, provider activation or model call is required for this deterministic v1;
- future cosmetics, naming, richer pet state or conversational behavior require explicit product/state contracts rather than ad-hoc local persistence.

## CI runner and validation policy

Routine authoritative Mobile CI must run on `[self-hosted, linux, x64, hermes-mobile-ci]`. Do not move routine validation to GitHub-hosted runners for convenience. Preserve `concurrency.cancel-in-progress`, documentation path filters and merge-push deduplication.

For TypeScript/TSX changes run, when available:

```bash
npx tsc --noEmit
npm test
```

Authoritative Mobile CI also includes repository/changed-file line limits, expanded-model smoke, Expo export and Expo Doctor. Do not claim source completion while required exact-head CI is failing.

Backend routine CI uses its separate `[self-hosted, linux, x64, hermes-backend-ci]` registration. Never substitute the mobile/backend labels for one another.

## File-size policy

Hand-written source files must remain at or below 500 physical lines. Extract cohesive components, hooks, styles, contracts, parsers and pure helpers. Do not create generic abstractions only to reduce line count.

## API, authentication and security

Use shared API configuration from `src/api/config.ts`.

- preferred public variable: `EXPO_PUBLIC_API_BASE_URL`;
- production default: `https://api.peptonio.com`;
- secrets never use `EXPO_PUBLIC_*` or enter source control;
- provider credentials remain backend-only;
- native tokens use Expo SecureStore;
- ordinary cached session storage remains tokenless;
- do not expose tokens, email, raw health data, private Labs contents, payloads, provider diagnostics or internal error text in telemetry/UI.

## Coding and UI rules

Prefer bounded coherent diffs. Preserve routes, IDs, persistence/sync contracts, calculations, auth/session semantics, workout/program lifecycle, completed-history immutability, Social privacy, Labs ownership and backend API contracts unless the task explicitly changes them.

Do:

- keep TypeScript strict-compatible;
- use existing UI and Liquid Glass primitives/tokens;
- keep calculations in pure functions;
- keep persisted data serializable;
- localize new user-facing copy;
- use bounded display mappings for enums/status/errors;
- use centralized locale/date/number/unit formatting where applicable;
- account for Safe Area, Dynamic Type, keyboard reachability and floating tab clearance.

Do not:

- refactor unrelated code;
- install dependencies without approval;
- duplicate API clients;
- call AI/OCR/storage providers from mobile;
- expose raw backend/provider/schema/error strings in presentation;
- use screen-relative coordinates or isolated pixel nudges to align related controls.

Potentially long collections require a suitable virtualized owner with stable identity. Scrollable forms use `keyboardShouldPersistTaps="handled"`. Related labels/controls remain siblings in one Flexbox parent.

## Navigation invariants

Do not break:

- Home → Start Workout → `/workout-session`;
- Workouts → Start Workout → `/workout-session`;
- Finish Workout → save session and return to Home;
- Cancel Workout → return without saving;
- active workout resume after leaving the session screen;
- primary tabs: Home, Workouts, Nutrition, Progress, Labs;
- global Companion entry → hidden Coach/Companion route.

Workout session remains outside the tab group.

## Git and deployment

Before changes:

1. inspect exact current `main` in mobile and backend;
2. inspect open PRs;
3. read the source-of-truth docs;
4. read `DEBUGGING_SKILL.md` for failures/regressions;
5. inspect relevant files for each workstream;
6. branch each independent workstream from exact current `main`;
7. avoid overlapping changed files/contracts across active PRs unless dependency coordination is explicit.

For approved changes: implement coherent scope, validate exact head, inspect review threads and merge only the validated head. Queued/running CI on one head is not a reason to stop unrelated work.

Use `[ota]` only for OTA-safe JS/TS/TSX/assets.

Do **not** perform or claim OTA publication, EAS/native builds, device installation, backend deployment, production migration execution, provider activation, credential/DNS changes, HealthKit/Health Connect activation, worker scheduling, store submission or production data access unless explicitly requested.

## Priority handling

Mutable priorities belong in `docs/current-status.md`, `docs/implementation-plan.md` and `docs/handoffs/latest.md`.

Default order:

1. keep architecture/status/handoff docs synchronized with code;
2. continue the explicitly approved roadmap package across as many independent safe workstreams as practical;
3. keep provider-backed capabilities fail closed until blockers and approvals are resolved;
4. require separately authorized physical/device/release evidence;
5. fix demonstrated bounded regressions without manufacturing broad refactor work;
6. while one workstream is blocked by CI/review/external dependency, continue another independent approved workstream instead of ending the pass.
