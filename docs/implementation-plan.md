# Smart Fitness — Implementation Plan

Updated: 2026-08-19

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision remains `docs/architecture/local-state-performance-decision.md`; do not reopen that architecture without new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `bf302de39c1190f736f17c731f0d2fac2f41e569` (#768).

The repository-wide Liquid Glass convergence remains source/CI-complete for the reviewed scope. Phase 15 mobile source work is also source/CI-complete for the current reviewed set: bounded Coach capabilities/selective retrieval (#749–#751), compact Progress IA and drill-downs (#755–#764), and selector-only exercise/Weight/Measurements/Activity/Highlights Progress → Companion handoffs (#760, #762, #766, #767, #768).

#768 passed exact-head Mobile CI and closes the reviewed P15-E current set. Its Highlights path filters session input to the 90-day Coach window before analytics so longer-history all-time record evidence cannot silently widen Companion context.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

Phase 15 backend question infrastructure is source/CI-complete for the reviewed read-only scopes: minimal routing (#266), minimized evidence/strict structured answer (#267), authenticated `POST /v1/coach/questions` composition (#269), and bounded confirmed structured Labs overview/marker history (#270).

Phase 14 provider/runtime source preparation remains complete for the reviewed contracts. Existing isolated Hermes staging and bounded Labs/Stories evidence tooling remain the execution foundation for external evidence work.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: source/CI-complete for the current reviewed scope; repository-wide convergence is closed by #746/#747 evidence.
- Stories S10: source/CI plus basic isolated backend route/auth/account-lifecycle staging evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained. Companion is the user-facing embodiment of Coach, not a second assistant. Cosmetic progression remains deferred.
- Phase 14: ordinary autonomous source/runtime preparation is exhausted for the currently reviewed contracts. Remaining work is external provider material, signed native/physical-device evidence, deliberate rollout, or bounded repair of a reproduced defect.
- Phase 15: **Coach Intelligence & Data Access + Progress UX/Analytics is source/CI-complete for the currently reviewed scope.**
- Phase 16: **Proactive Coach** is the next planned product source phase and must reuse Phase 15 bounded deterministic facts.
- Phase 17: **Goals & Planning** remains planned after the relevant Proactive Coach contracts.

## Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics

### Product model

Coach and Companion are one product surface. Companion is the character/interface through which the existing Coach communicates; do not create a second assistant, second recommendation authority or separate conversational state authority.

Detailed analytics belong primarily in **Progress**. Home remains concise and contextual. Coach explains relevant facts rather than reproducing dashboards in chat. Graphs live behind intentional drill-down rather than a first-level wall of charts.

A separate Program Intelligence/linting product is not part of Phase 15. Program questions use the same bounded data-access and deterministic-analysis layer.

### P15-A — Bounded Coach data-access layer

Reviewed capability families now cover bounded workout/exercise history, current program context, deterministic training summaries, body/measurement/weight facts, nutrition aggregates, profile facts, safety/recovery context and confirmed structured Labs facts.

Permanent requirements:

- tools/capabilities return the minimum structured facts needed for the request;
- raw Labs documents and unconfirmed extraction drafts are excluded;
- no unrestricted model access to `AppState`, AsyncStorage, SecureStore or provider payloads;
- access remains user-scoped and respects private/server-authoritative domain boundaries;
- deterministic calculations happen outside the model;
- every capability has bounded date/range/result limits and typed error states;
- model-visible context excludes secrets, tokens and internal diagnostics.

**Status:** source/CI-complete for the reviewed capability set. Extend only for a newly reviewed purpose-specific scope.

### P15-B — Deterministic training/progress analytics

Shared pure analytics now support bounded workout frequency, exercise progression, comparable e1RM/volume evidence, body/measurement trends, Activity/Highlights and the existing Progress drill-down surfaces.

Permanent rules:

- missing data stays missing; do not infer unrecorded RPE, nutrition, body composition or Labs values;
- calculations expose evidence/sample size and period;
- avoid pseudo-precision and universal scoring systems;
- analytics describe observed fitness/progress patterns, not medical status;
- shared analytics remain independently testable without invoking a model.

**Status:** source/CI-complete for the current reviewed fact set.

### P15-C — Coach retrieval/orchestration

Reviewed architecture now composes:

`question → minimal scope router → only required user-scoped contexts → minimized evidence → strict structured answer`.

Backend milestones:

- #266 minimal-scope routing;
- #267 minimized evidence and strict answer contract;
- #269 authenticated read-only `/v1/coach/questions` composition;
- #270 confirmed structured Labs overview/marker-history scope.

The model interprets validated facts and explains them. It must not silently mutate workouts, programs, goals, nutrition targets or Labs data. Labs answers are descriptive recorded-value/history summaries only and must not diagnose, prescribe or make unsupported causal medical claims.

**Status:** source/CI-complete for strength, nutrition, safety/recovery and confirmed structured Labs question scopes.

### P15-D — Progress information architecture redesign

Progress is the primary detailed analytics destination. The reviewed first level is compact and organized around:

- **Body** — weight and measurements;
- **Strength & Training** — progression and training evidence;
- **Activity** — supported activity/training cadence;
- **Highlights** — bounded meaningful achievements/changes.

The current reviewed detail set includes Weight, Body measurements, Strength & Training, Activity and Highlights, with deliberate period/exercise selection where relevant.

UX invariants:

- progressive disclosure: summary → detail → chart/data;
- one primary message per summary card;
- clear period labels and units;
- accessible textual summaries / empty states;
- no chart when evidence is insufficient;
- preserve Liquid Glass, responsive layout and Safe Area contracts;
- avoid duplicate detailed analytics across Home, Coach and Progress.

**Status:** source/CI-complete for the current reviewed drill-down set.

### P15-E — Coach ↔ Progress linking

The reviewed contextual handoffs now cover:

- selected exercise/period (#760);
- Weight/period (#762);
- measurement/period (#766);
- Activity/period (#767);
- Highlights/period (#768).

Navigation passes selector/period/anchor context only. Companion rebuilds facts from canonical state through bounded retrieval/analysis; raw private state and prebuilt broad analytics do not travel through route params.

Closure review of #768 found that shared Highlights analytics could inspect older history internally even when all-time output fields were omitted. The final implementation therefore filters session input to the 90-day Coach boundary before analytics, with regression coverage proving older out-of-window sessions cannot influence Companion facts.

**Status:** source/CI-complete for the current reviewed Progress drill-down set.

### P15-F — Validation and closure

Focused evidence is recorded in `docs/qa/phase15-closure.md`.

Authoritative Mobile CI covers repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Backend question changes use separate lint/format/build/config/staging-topology/full-test gates.

Closure review found no source-demonstrated accessibility defect requiring speculative UI refactoring. Shared Safe Area, localized accessible back control and standard `AppButton` primitives remain the current source contract. Physical-device/Dynamic Type/VoiceOver evidence is a separate evidence class and is not claimed by CI.

**Status:** source/CI-complete.

Phase 15 source/CI closure does not claim provider activation, signed physical-device evidence, production rollout, production-model quality evidence, diagnosis/prescribing authority or automatic canonical mutation.

## Phase 16 — Proactive Coach

Phase 16 is the next planned product source phase after Phase 15 closure.

Coach may surface a small number of meaningful contextual observations without the user first asking, using the same bounded deterministic facts established in Phase 15. This is not a notification firehose or an autonomous plan-changing agent.

Initial direction:

- notable PR/progression milestone;
- conservative stagnation signal with sufficient evidence;
- meaningful consistency change;
- contextual observation relevant to an active user goal once Phase 17 exists.

Requirements before implementation/rollout:

- explicit deterministic trigger/evidence contracts;
- frequency caps and deduplication;
- clear dismissal/snooze semantics;
- no guilt, punishment, streak-loss or compulsive engagement mechanics;
- one concise insight by default with optional Progress drill-down;
- no automatic workout/program/nutrition/goal mutation;
- reuse P15 fact/retrieval boundaries rather than introducing a second data authority.

## Phase 17 — Goals & Planning

Planned after Phase 15 and the relevant Phase 16 contracts.

Goals become canonical context for Coach and Progress. Examples may include strength, training consistency, weight/body measurement or other reviewed fitness outcomes.

Requirements before implementation:

- typed goal model with explicit user ownership;
- measurable target/current-state semantics where appropriate;
- explicit persistence/sync/revision semantics before any cross-device authority is claimed;
- no automatic plan mutation;
- no punitive streak-loss or guilt mechanics;
- Coach recommendations remain explainable and confirmation-gated;
- Progress shows goal-relative status without becoming a dense dashboard.

## P14-A — Push

Source/CI complete. Remaining work:

1. provide staging-only APNs and/or FCM provider material;
2. run privacy-safe readiness preflight before enabling delivery;
3. execute bounded staging sends covering success/transient/permanent/timeout/restart/redaction behavior;
4. collect physical-device permission/token/delivery/tap/deep-link evidence;
5. verify device/account isolation and offline/reconnect ordering;
6. keep production scheduling/rollout deliberate with rollback evidence.

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

The source-convergence priority remains complete at #746/#747. The final inventory retains intentional structural-divider token hits; do not mechanically rewrite them.

Reopen only if:

- a reachable screen demonstrates a partial/legacy material owner;
- a future refactor turns a retained divider into a card/control/material owner;
- a newly reviewed UI contract expands intended scope.

Detailed inventory: `docs/architecture/liquid-glass-residual-inventory.md`.

## Current execution order

1. Keep Phase 15 closed for the reviewed scope unless a reproduced defect, failed closure invariant or newly reviewed capability requires reopening it.
2. Execute Phase 14 provider/device evidence whenever its external prerequisites become available; it remains independent of successor source phases.
3. Begin Phase 16 Proactive Coach with explicit trigger/frequency/dismissal/anti-compulsion contracts and reuse Phase 15 bounded deterministic facts.
4. Begin Phase 17 Goals & Planning only after typed ownership/persistence/state contracts are reviewed.
5. If evidence or normal use reproduces a defect, repair it in a coherent bounded package and validate exact head.
6. Keep `docs/current-status.md`, `docs/handoffs/latest.md`, `ROADMAP_PROGRESS.md` and this plan synchronized with verified Git/evidence.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

A source-contract failure must be distinguished from a runtime/type failure. When a reviewed migration intentionally changes a source invariant, update the stale contract to require the new invariant rather than reverting valid runtime code; behavioral/accessibility/compatibility invariants remain protected.

Backend source/operations changes require the applicable backend/PostgreSQL/account-lifecycle gates for their scope.

Evidence-only diagnostics may intentionally fail after printing requested evidence and should be closed without merge when their purpose is complete.

Documentation-only synchronization must never claim provider, physical-device or production evidence that did not run.

## Activation boundary

Provider configuration, native/device execution and rollout actions remain governed by current repository authorization, least privilege, privacy, preflight, evidence, recovery and rollback controls in `AGENTS.md` and the relevant operational docs. Phase 15 source closure does not change those boundaries.