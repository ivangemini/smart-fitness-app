# Smart Fitness — Implementation Plan

Updated: 2026-08-18

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision remains `docs/architecture/local-state-performance-decision.md`; do not reopen that architecture without new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current repository `main`: `2027566349026af0a209ceb57a330101259e330e` (#745 docs checkpoint).

Current verified runtime baseline: `cf4af93344b9b7645a839af46ac29866cc7ea218` (#746).

The repository-wide Liquid Glass convergence priority is source/CI-complete for the current reviewed scope. #746 merged the final workout-builder, Social and workout-finish residual material owners after exact-head Mobile CI passed line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Evidence-only #747 reran the repository-wide direct legacy-material inventory from exact post-#746 runtime `main`. The 21 remaining hits are all intentional structural dividers previously inspected in source; no unmatched material owner remains. #747 was intentionally closed without merge.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current known backend `main`: `211d1966bcac01a21c047eaf8f844843a764a186` (#265).

Phase 14 provider/runtime source preparation remains complete for the reviewed contracts. Existing isolated Hermes staging and bounded Labs/Stories evidence tooling remain the execution foundation for external evidence work.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: source/CI-complete for the current reviewed scope; repository-wide convergence is closed by #746/#747 evidence.
- Stories S10: source/CI plus basic isolated backend route/auth/account-lifecycle staging evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained. Companion is the user-facing embodiment of Coach, not a second assistant. Cosmetic progression remains deferred.
- Phase 14: ordinary autonomous source/runtime-preparation work is exhausted for the currently reviewed contracts. Remaining work is external provider material, signed native/physical-device evidence, deliberate rollout, or bounded repair of a reproduced defect.
- Phase 15: **Coach Intelligence & Data Access + Progress UX/Analytics** is the next reviewed product priority and may proceed in parallel with Phase 14 external evidence.
- Phase 16: **Proactive Coach** is planned after the Phase 15 intelligence/data contracts are stable.
- Phase 17: **Goals & Planning** is planned after Coach can reliably retrieve and explain canonical user data.

## Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics

### Product model

Coach and Companion are one product surface. Companion is the character/interface through which the existing Coach communicates; do not create a second assistant, second recommendation authority or separate conversational state authority.

Phase 15 prioritizes information access, deterministic analysis and understandable explanations. Cosmetic progression, rooms, clothing, collectible systems and similar gamification are explicitly out of scope for this phase.

Detailed analytics belong primarily in **Progress**. Home should remain concise and contextual. Coach should explain relevant facts rather than reproduce dashboards in chat. Graphs should be available through intentional drill-down, not presented as a wall of charts.

A separate Program Intelligence/linting product is **not** part of Phase 15. Coach may answer questions about a program using the same bounded data-access and deterministic-analysis layer, but no independent program-scoring subsystem should be created.

### P15-A — Bounded Coach data-access layer

Build typed, privacy-bounded read capabilities over canonical application data rather than sending a broad raw state dump to a model.

Initial capability families:

1. workout history retrieval by bounded period;
2. exercise-specific history and recent working sets;
3. current program/routine retrieval when relevant to the user's question;
4. deterministic training summary retrieval;
5. progress/measurement/weight trend retrieval;
6. bounded nutrition summary retrieval;
7. confirmed Labs marker/history retrieval only from authoritative structured facts;
8. user/profile preferences required to interpret units and presentation.

Requirements:

- tools/capabilities return minimal structured facts needed for the request;
- raw Labs documents and unconfirmed extraction drafts are excluded;
- no unrestricted model access to `AppState`, AsyncStorage, SecureStore or provider payloads;
- access remains user-scoped and respects existing private/server-authoritative domain boundaries;
- deterministic calculations happen outside the model;
- every capability has bounded date/range/result limits and typed error states;
- model-visible context must not include secrets, tokens or internal diagnostics.

### P15-B — Deterministic training/progress analytics

Create reusable pure analysis functions that can serve both Coach and Progress without duplicating business logic.

Candidate facts include:

- workout frequency and adherence over a selected period;
- exercise progression from comparable working sets;
- personal records and recent best performances;
- estimated 1RM where inputs make the estimate meaningful;
- volume trends where the underlying exercise/set data is comparable;
- RPE/RIR trends when the user actually recorded them;
- plateau/stagnation signals using conservative deterministic thresholds;
- body-weight and measurement trends;
- nutrition averages/adherence when sufficient diary data exists.

Rules:

- missing data stays missing; do not infer unrecorded RPE, nutrition, body composition or Labs values;
- calculations expose evidence/sample size and period so Coach can qualify weak conclusions;
- avoid pseudo-precision and universal scoring systems;
- analytics describe observed training/progress patterns, not medical status;
- shared analytics must be independently testable without invoking a model.

### P15-C — Coach retrieval/orchestration

Teach the existing Coach/Companion orchestration to request only relevant capabilities for a user's question.

Target examples:

- “How have my workouts been going?” → bounded training summary + relevant progress facts;
- “Why have my pull-ups stalled?” → pull-up history, recent training context and relevant weight trend if needed;
- “What did I do for chest two weeks ago?” → bounded workout-history retrieval;
- “How has my ferritin changed?” → confirmed Labs marker history only;
- “Is my current program reasonable?” → current program + relevant execution history, answered through the general Coach layer rather than a separate Program Intelligence feature.

The model interprets validated facts and explains them. It must not silently mutate workouts, programs, goals, nutrition targets or Labs data. Any future action/application capability requires explicit reviewed contracts and user confirmation.

### P15-D — Progress information architecture redesign

Progress becomes the primary detailed analytics destination.

First-level UX should remain compact and understandable, organized around a small number of summary domains rather than a long sequence of graphs. Proposed information architecture:

- **Body** — weight and measurements with concise trend summary;
- **Strength & Training** — recent progression, PR summary and training consistency;
- **Activity** — steps/activity when supported and available;
- **Highlights** — meaningful recent achievements or changes, bounded to avoid noise.

Each summary exposes deliberate drill-down. Detailed views may contain period selection, exercise selection, comparison and charts. The first-level screen should not render every available metric simultaneously.

UX requirements:

- progressive disclosure: summary → detail → chart/data;
- one primary message per summary card;
- clear period labels and units;
- accessible chart alternatives / textual summaries;
- no chart when there is insufficient data;
- useful empty states that explain what data creates the view;
- preserve Liquid Glass material contracts and responsive/safe-area rules;
- avoid duplicate analytics presentation across Home, Coach and Progress.

### P15-E — Coach ↔ Progress linking

Coach responses may link to the relevant Progress detail when a user wants evidence or deeper inspection. Progress may offer a contextual “Ask Coach” entry that passes only the selected metric/exercise/period context, not a raw state dump.

This is the preferred solution to information overload: Coach provides interpretation; Progress provides inspectable evidence.

### P15-F — Validation and rollout

Phase 15 source work should be delivered in large coherent, non-overlapping workstreams where possible:

1. data contracts/selectors and deterministic analytics;
2. Coach capability/orchestration integration;
3. Progress IA and summary UX;
4. Progress drill-down analytics;
5. Coach ↔ Progress contextual linking;
6. regression/accessibility/performance closure and canonical docs sync.

Mobile runtime/code PRs require exact-head Mobile CI. Backend changes, if genuinely required for server-authoritative domains such as Labs retrieval, require their applicable backend gates. Do not add a backend merely for locally authoritative workout/progress data that can be safely exposed through existing mobile boundaries.

## Phase 16 — Proactive Coach

Planned after Phase 15 contracts stabilize.

Coach may surface a small number of meaningful contextual observations without the user first asking, using the same deterministic facts established in Phase 15. This is not a notification firehose or an autonomous plan-changing agent.

Initial direction:

- notable PR/progression milestone;
- conservative stagnation signal with sufficient evidence;
- meaningful consistency change;
- contextual observation relevant to an active user goal once Phase 17 exists.

Default presentation should be one concise insight with optional drill-down. Frequency limits, dismissal semantics and anti-compulsion safeguards must be reviewed before implementation.

## Phase 17 — Goals & Planning

Planned after Phase 15 and the relevant Phase 16 contracts.

Goals become canonical context for Coach and Progress. Examples may include strength, training consistency, weight/body measurement or other reviewed fitness outcomes.

Requirements before implementation:

- typed goal model with explicit user ownership;
- measurable target/current-state semantics where appropriate;
- no automatic plan mutation;
- no punitive streak-loss or guilt mechanics;
- Coach recommendations remain explainable and confirmation-gated;
- Progress shows goal-relative status without turning the screen into a dense dashboard.

## P14-A — Push

Source/CI complete. Remaining work:

1. provide staging-only APNs and/or FCM provider material;
2. run privacy-safe readiness preflight before enabling delivery;
3. execute bounded staging sends covering success/transient/permanent/timeout/restart/redaction behavior;
4. collect physical-device permission/token/delivery/tap/deep-link evidence;
5. verify device/account isolation and offline/reconnect ordering;
6. keep production scheduling/rollout a deliberate action with rollback evidence.

Do not invent another Push source package without a reproduced defect or reviewed contract.

## P14-B — Labs / Analyses

Source/CI, isolated staging and bounded configured-provider evidence tooling are complete. Remaining work:

1. provide a staging-only **HTTPS S3-compatible** private-storage namespace and credentials;
2. provide a staging-only Gemini credential/model;
3. require exact configured readiness before processing;
4. upload one synthetic document through the normal staging flow;
5. run exactly one bounded worker/evidence lifecycle;
6. capture privacy-safe provider/output/error/redaction/lifecycle evidence;
7. collect physical-device PDF/photo picker and accessibility evidence.

Do not weaken the HTTPS storage boundary to bypass the external prerequisite. Extracted data remains confirmation-gated and must not infer diagnosis, treatment or missing values.

## P14-C — Stories

Source/CI plus basic isolated backend staging route/auth/account-lifecycle evidence are complete. Remaining work is mobile/physical-device/runtime evidence outside the server probe. Continue source work only for a concrete reproduced defect or newly reviewed contract.

## P14-D — Steps

Source/CI includes reviewed read-only HealthKit and Health Connect adapters and Home consumption. Remaining work is signed native/physical-device evidence for support detection, user-initiated permissions, real aggregate reads, unsupported/no-data states, local-day/DST behavior and Home presentation.

## Liquid Glass closure contract

The source-convergence priority is complete at #746/#747. The final inventory retains 21 direct `colors.border` / `colors.borderSubtle` hits because they are structural dividers, not material surfaces.

Do not mechanically replace those tokens. Reopen the priority only if:

- a reachable screen demonstrates a partial/legacy material owner;
- a future refactor turns a retained divider into a card/control/material owner;
- a newly reviewed UI contract expands the intended scope.

The detailed final inventory is recorded in `docs/architecture/liquid-glass-residual-inventory.md`.

## Current execution order

1. Start Phase 15 with bounded Coach data contracts/selectors and shared deterministic analytics while independently designing the Progress information architecture.
2. Integrate Coach/Companion retrieval only after each capability has a typed, bounded, privacy-reviewed contract.
3. Build Progress summary and drill-down UX on the shared deterministic analytics rather than duplicating calculations in screens.
4. Add Coach ↔ Progress contextual linking after both surfaces have stable contracts.
5. Execute Phase 14 provider/device evidence whenever its external prerequisites become available; it may proceed independently of Phase 15 source work.
6. If evidence or normal use reproduces a defect, repair it in a coherent bounded package and validate exact head.
7. Keep `docs/current-status.md`, `docs/handoffs/latest.md`, `ROADMAP_PROGRESS.md` and this plan synchronized with verified Git/evidence.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

A source-contract failure must be distinguished from a runtime/type failure. When a reviewed migration intentionally changes a source invariant, update the stale contract to require the new invariant rather than reverting valid runtime code; behavioral/accessibility/compatibility invariants must still remain protected.

Backend source/operations changes require the applicable backend/PostgreSQL/account-lifecycle gates for their scope.

Evidence-only diagnostics may intentionally fail after printing the requested evidence and should be closed without merge when their purpose is complete.

Documentation-only synchronization must never claim provider, physical-device or production evidence that did not run.

## Activation boundary

Provider configuration, native/device execution and rollout actions remain governed by the current repository authorization, least-privilege, privacy, preflight, evidence, recovery and rollback controls in `AGENTS.md` and the relevant operational docs. Closing Liquid Glass source convergence does not change those boundaries.
