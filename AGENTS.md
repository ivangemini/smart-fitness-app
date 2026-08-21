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
2. `PROJECT_MAP.md` — fast repository/file navigation and high-fan-out areas;
3. `docs/agent/README.md` — session bootstrap and operational routing;
4. `docs/project-context.md`;
5. `docs/current-status.md`;
6. `docs/handoffs/latest.md`;
7. `PROJECT_LEARNINGS.md`;
8. `docs/implementation-plan.md`;
9. the relevant `docs/agent/ownership-map.md`, `docs/agent/change-impact.md`, `docs/agent/validation-matrix.md`, and focused documents under `docs/architecture/`, `docs/privacy/`, `docs/roadmap/`, `docs/qa/`, and `docs/release/`.

Use the agent maps for navigation/impact/validation routing, not as replacements for canonical focused architecture or exact source. Exact code, migrations, tests and current Git history override stale prose. Update canonical status/handoff/roadmap documentation when a change materially alters architecture, supported product scope, blockers or continuation state.

## Autonomous execution policy

Default to throughput-first, parallel-first autonomous execution. A work pass is not one PR, one fix, one validation cycle, or one roadmap bullet: it is the largest safe amount of approved roadmap work that can be completed with the available repository, CI, connector, and environment access.

- Partition approved work into independent workstreams immediately and execute non-overlapping workstreams concurrently whenever safe.
- Keep multiple independent workstreams active when useful. One workstream waiting on CI, review, mergeability, an external service, or a dependency must not idle the rest of the pass.
- Prefer large coherent batches over micro-PRs or repeated tiny inspect/edit/test cycles. A batch may contain multiple closely related demonstrated fixes when they share a contract, ownership boundary, or validation strategy.
- Optimize for completed roadmap scope per pass rather than PR count. Do not artificially split a coherent package merely to produce smaller progress increments.
- Do not stop after opening, updating, validating, or merging a PR while another safe approved roadmap task remains executable.
- Do not stop merely to report progress. Progress reporting is informational and must not become a synchronization barrier unless user input is genuinely required.
- Continue until currently executable approved work is exhausted or a genuine product-decision, unavailable dependency, conflicting ownership, missing access, destructive-risk, or environment blocker prevents further safe progress.
- When a dependency merges, immediately rebase or rebuild dependent work from exact current `main`, then revalidate the exact resulting head before merge.
- Run validation at meaningful batch boundaries rather than after every microscopic edit. Preserve every authoritative gate required before merge.
- Mobile, backend, documentation, tests, and preparation may proceed concurrently when their files and contracts are independent. Coordinated API/schema changes remain one dependency-aware workstream.
- While CI is queued or running, continue read-only audits, next-package preparation, documentation reconciliation, and implementation of non-overlapping workstreams.
- Inspect and merge validated work opportunistically during the pass; do not defer all merges to the end if merging safely unlocks dependent work.
- Never manufacture refactors solely to stay busy. Every change must be roadmap-backed, source-demonstrated, required by an approved contract, or necessary to unblock approved work.
- Prefer resolving routine implementation choices autonomously from source, tests, architecture, and existing product contracts rather than asking the user to choose between technically equivalent options.

Parallel execution and higher throughput do not weaken correctness. Exact-head required CI must pass before source completion/merge where policy requires it.

## Standing operational authorization

The user has granted standing authorization to perform operational actions when they are materially necessary to complete an approved roadmap item or validate a reproduced defect. This authorization is not permission to perform speculative production changes.

Operationally authorized actions include, when technically required and the relevant access/material exists:

- OTA publication;
- EAS/native builds and device installation;
- backend staging or production deployment;
- staging or production migration execution;
- provider activation and staging/production provider configuration;
- credential or DNS changes;
- HealthKit/Health Connect activation;
- worker scheduling;
- production diagnostics/data access necessary for bounded validation;
- store submission.

For operational actions:

- use the least-privileged and least-destructive path that can satisfy the roadmap/evidence requirement;
- run applicable preflight validation first and preserve rollback/recovery paths;
- prefer staging/synthetic evidence before production when both can establish the same fact;
- do not expose secrets, production user data, provider payloads or internal diagnostics in commits, PRs, logs, screenshots or user-facing UI;
- production user-data mutation, destructive cleanup, irreversible credential/DNS changes, schema migrations without a tested rollback/recovery path, and store submission still require deliberate evidence that the action is actually necessary for the approved roadmap item;
- if the required credential, signing material, physical device or environment access is unavailable, treat that as a real blocker and continue other independent work rather than stopping the whole pass.

Standing operational authorization does not expand product scope. Diagnosis, prescribing, medication dosing, unrestricted model access to private health documents, payments, new Social domains, or other unreviewed product behavior still require their own reviewed product contract.

## Current product boundaries

Approved product scope includes:

- workout, nutrition and progress tracking;
- profile, authentication, offline-first persistence and revision-aware synchronization;
- deterministic and structured AI Coach flows;
- the server-authoritative Social workout network and Stories contracts already reviewed in source;
- adaptive Liquid Glass UI and the social-first Home integration;
- **Labs / Analyses** as a private, server-authoritative longitudinal laboratory-results domain;
- **Companion** as the user-facing motivational/presentation layer over existing Coach and canonical fitness history;
- **Knowledge & Learning** as a backend-authoritative, evidence-linked educational system with versioned canonical articles, source-linked claims, validated quizzes and bounded Coach→Learn recommendations.

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

Knowledge & Learning rules:

- the system is educational, not gamified: do not add knowledge XP, levels, streaks, badges, leaderboards, competitive ranks, reward loops or punishment mechanics;
- canonical scientific/educational articles are generated and reviewed ahead of end-user consumption, not invented live and treated as canonical for each user;
- AI may draft/revise/verify only inside the reviewed editorial pipeline over approved evidence packs; model output alone is never publication authority;
- published article versions are stable; material factual changes create a new version;
- every material factual claim must remain traceable to reviewed source records before publication;
- quizzes are pre-generated/validated against exact article versions and reviewed claims; ambiguous answer keys fail closed;
- Tier-3 Labs/medical-adjacent educational content requires human review and remains non-diagnostic/non-prescriptive;
- canonical article/source/claim/quiz records never contain private user evidence;
- user data may influence only bounded content recommendation/relevance/depth layers through reviewed contracts;
- Coach→Learn selection uses typed deterministic findings and allowlisted content mappings rather than unconstrained free-form article choice;
- future user learning state is informational (`unseen/read/understood/refresh_useful`) and requires explicit ownership/deletion/export/privacy/version semantics before persistence ships;
- reading/quiz completion must not automatically mutate workouts, nutrition, goals, Labs, recovery or safety state;
- do not claim that reading an article caused later fitness or health outcomes;
- raw Labs documents and unconfirmed extraction drafts remain outside ordinary Knowledge generation/recommendation context;
- mobile never calls editorial model/search/evidence providers directly.

Still prohibited without an explicit reviewed product contract where relevant:

- diagnosis, emergency triage or clinical urgency inference;
- prescriptions, medication dosing, pharmacology, hormone or SARM protocols;
- unrestricted model access to raw Labs documents;
- payments/subscriptions;
- new Social domains beyond reviewed contracts;
- public/community publishing into canonical Knowledge authority;
- arbitrary live scientific-content publication outside the reviewed Knowledge pipeline;
- other unreviewed product behavior that changes the established privacy, safety or recommendation authority boundaries.

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

Social and Labs are server-authoritative domains separate from private revisioned `AppState` synchronization. Canonical Knowledge content is backend-authoritative shared content and must not be inserted into private fitness `AppState` sync. Future learning state requires its own reviewed account-scoped ownership contract.

## Synchronization baseline

First-class revisioned synchronization exists for weight history, completed workout sessions/sets, workout templates, food entries, nutrition targets, fitness profiles, limitations, recovery check-ins, typed body measurements, training programs, custom exercises, meal templates and account-scoped Nutrition library items.

Preserve stable IDs, ISO timestamps, schema versions, idempotency, revision metadata, conflict state, cursor safety and explicit recovery semantics. Do not silently overwrite unresolved conflicts or replace local state with unvalidated remote payloads.

Application-state persistence and outbox enqueue are not one atomic transaction. Preserve journal/planner recovery paths.

## AI Coach and Labs AI boundaries

Coach uses deterministic-first typed orchestration. Models may interpret validated facts and propose structured strategies but deterministic workers own calculations and hard guardrails. Automatic application remains prohibited.

Labs interpretation uses confirmed minimum structured context, bounded validated output and provenance. Raw Labs documents/provider payloads must not be exposed to ordinary Coach/model context. Provider/model identity comes from the transport boundary, not generated model fields.

Phase 18 Knowledge editorial generation uses the same deterministic-first/fail-closed philosophy: evidence/source authority and publication gates remain deterministic/reviewed; providers may assist drafting/verification but cannot override source, risk or review rules.

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

Companion XP is a separate pre-existing character/progression contract. It must not be reused as Knowledge learning progress or educational reward mechanics.

## CI runner and validation policy

Routine authoritative Mobile CI must run on `[self-hosted, linux, x64, hermes-mobile-ci]`. Do not move routine validation to GitHub-hosted runners for convenience. Preserve `concurrency.cancel-in-progress`, documentation path filters and merge-push deduplication.

For TypeScript/TSX changes run, when available:

```bash
npx tsc --noEmit
npm test
```

Authoritative Mobile CI also includes repository/changed-file line limits, agent navigation integrity, expanded-model smoke, Expo export and Expo Doctor. Do not claim source completion while required exact-head CI is failing.

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
- call AI/OCR/storage/search/evidence providers from mobile;
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

A future Knowledge destination must follow the reviewed Phase 18 navigation/IA package rather than silently replacing a primary tab or creating a duplicate Coach surface.

## Git and deployment

Before changes:

1. inspect exact current `main` in mobile and backend;
2. inspect open PRs;
3. read `PROJECT_MAP.md`, `docs/agent/README.md`, and the source-of-truth docs;
4. use `docs/agent/ownership-map.md` to establish the source-of-truth owner;
5. use `docs/agent/change-impact.md` to determine the initial blast radius and expand it from source evidence;
6. use `docs/agent/validation-matrix.md` to select the required evidence class before implementation;
7. read `DEBUGGING_SKILL.md` for failures/regressions;
8. inspect relevant files/callers/tests for each workstream;
9. branch each independent workstream from exact current `main`;
10. avoid overlapping changed files/contracts across active PRs unless dependency coordination is explicit.

For approved changes: implement coherent scope, validate exact head, inspect review threads and merge only the validated head. Queued/running CI on one head is not a reason to stop unrelated work.

Use `[ota]` only for OTA-safe JS/TS/TSX/assets.

Operational actions covered by the standing authorization above may be executed when they are materially necessary for the approved roadmap and their prerequisites are available. Do not turn operational authorization into speculative deployment activity; preserve preflight, evidence, privacy, recovery and rollback requirements.

## Priority handling

Mutable priorities belong in `docs/current-status.md`, `docs/implementation-plan.md` and `docs/handoffs/latest.md`.

Default order:

1. keep architecture/status/handoff docs synchronized with code;
2. maximize completed approved roadmap scope per pass across as many independent safe workstreams as practical;
3. keep provider-backed capabilities fail closed until their reviewed activation prerequisites are satisfied;
4. collect physical/device/release evidence when required access and materials exist under standing authorization;
5. fix demonstrated bounded regressions without manufacturing broad refactor work;
6. while one workstream is blocked by CI/review/external dependency, continue another independent approved workstream instead of ending the pass;
7. end a pass only when executable approved work is exhausted or all remaining work is blocked by genuine dependencies, unavailable access, destructive-risk constraints, or unresolved product decisions.
