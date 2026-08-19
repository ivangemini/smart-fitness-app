# Smart Fitness — Implementation Plan

Updated: 2026-08-19

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision remains `docs/architecture/local-state-performance-decision.md`; do not reopen that architecture without new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `e086f6795b0ea5f07ad00c3d03283759a1889780` (#777).

The repository-wide Liquid Glass convergence and Phase 15 Coach Intelligence + Progress scope remain source/CI-complete for the reviewed boundaries. Phase 16 deterministic foreground v1 is source/CI-complete through #770–#772.

Phase 17 is active over the existing fitness-profile goal authority:

- #773 — deterministic typed goal facts + neutral Progress Goals context;
- #776 — selector-only Goals → Companion context handoff;
- #777 — authenticated read-only Ask Coach surface, strict response parsing, capability-aware availability and mobile Coach capabilities compatibility through v13.

#777 passed exact-head Mobile CI: repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `eebca930893f3b2a5bcc4e2293873695d1bbb3c6` (#271).

The reviewed read-only Coach question infrastructure now includes minimal routing (#266), minimized evidence/strict answer output (#267), authenticated `/v1/coach/questions` composition (#269), confirmed structured Labs evidence (#270), and bounded goal-progress evidence/capabilities v13 (#271).

#271 passed exact-head Backend CI: lint, Prettier, build, production-configuration validation, isolated-staging topology validation and the full test suite.

Phase 14 provider/runtime source preparation remains complete for the reviewed contracts. Existing isolated Hermes staging and bounded Labs/Stories evidence tooling remain the execution foundation for external evidence work.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: source/CI-complete for the reviewed convergence scope.
- Stories S10: source/CI plus basic isolated backend route/auth/account-lifecycle staging evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained. Companion is the user-facing embodiment of Coach, not a second assistant. Cosmetic progression remains deferred.
- Phase 14: ordinary autonomous source/runtime preparation is exhausted for current contracts; remaining work is external provider material, signed native/physical-device evidence, deliberate rollout, or bounded repair of a reproduced defect.
- Phase 15: **Coach Intelligence & Data Access + Progress UX/Analytics is source/CI-complete for the currently reviewed scope.**
- Phase 16: **Proactive Coach deterministic foreground v1 is source/CI-complete through #770–#772.**
- Phase 17: **Goals & Planning is active. P17-A/B/C first slices are source/CI-complete through mobile #777 and backend #271.**

## Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics

### Product model

Coach and Companion are one product surface. Companion is the character/interface through which the existing Coach communicates; do not create a second assistant, recommendation authority or conversational-state authority.

Detailed analytics belong primarily in **Progress**. Home remains concise and contextual. Coach explains relevant facts rather than reproducing dashboards in chat.

### P15-A — Bounded Coach data access

Reviewed capability families cover bounded workout/exercise history, current program context, deterministic training summaries, body/measurement/weight facts, nutrition aggregates, profile facts, safety/recovery context and confirmed structured Labs facts.

Permanent requirements:

- minimum purpose-specific structured facts;
- raw Labs documents and unconfirmed extraction drafts excluded;
- no unrestricted model access to AppState/AsyncStorage/SecureStore/provider payloads;
- user-scoped/private-domain boundaries preserved;
- deterministic calculations outside the model;
- bounded date/range/result limits and typed errors;
- no secrets/tokens/internal diagnostics in model-visible context.

**Status:** source/CI-complete for the reviewed capability set.

### P15-B — Deterministic analytics

Shared pure analytics support bounded workout frequency, exercise progression, comparable e1RM/volume evidence, body/measurement trends, Activity/Highlights and Progress drill-downs.

Permanent rules:

- missing data stays missing;
- calculations expose evidence/sample size/period;
- no pseudo-precision or universal scoring systems;
- analytics describe observed fitness/progress patterns, not medical status;
- pure calculations remain independently testable without model invocation.

**Status:** source/CI-complete for the reviewed fact set.

### P15-C — Coach retrieval/orchestration

Reviewed architecture:

`question → minimal scope router → only required user-scoped contexts → minimized evidence → strict structured answer`.

Milestones:

- #266 minimal-scope routing;
- #267 minimized evidence + strict answer contract;
- #269 authenticated read-only `/v1/coach/questions` composition;
- #270 confirmed structured Labs overview/marker-history scope.

Phase 17 extends this same architecture with a newly reviewed purpose-specific goal scope; it does not create a second retrieval authority.

**Status:** source/CI-complete for the Phase 15 reviewed scopes.

### P15-D — Progress information architecture

Progress remains the primary detailed analytics destination, organized around Body, Strength & Training, Activity and Highlights with progressive disclosure and deliberate period/exercise selection.

**Status:** source/CI-complete for the reviewed drill-down set.

### P15-E — Coach ↔ Progress linking

Reviewed selector-only handoffs cover selected exercise/period (#760), Weight/period (#762), measurement/period (#766), Activity/period (#767) and Highlights/period (#768). Destination screens rebuild facts from canonical state; route params never carry raw private state or broad prebuilt analytics.

**Status:** source/CI-complete for the reviewed set.

### P15-F — Validation and closure

Focused evidence remains in `docs/qa/phase15-closure.md`.

Mobile CI covers repository/changed-file line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Backend question changes use lint/format/build/config/staging-topology/full-test gates.

**Status:** source/CI-complete.

## Phase 16 — Proactive Coach

The first reviewed Proactive Coach foreground slice is source/CI-complete.

### Completed v1 contract

- #770 deterministic bounded selector for notable strength progression, conservative stagnation and positive consistency change;
- #771 schema-versioned account-scoped presentation memory, seven-day global cooldown, evidence-key dismissal and account cleanup;
- #772 one authenticated foreground Companion insight card with persistence-before-display, fail-closed storage behavior, neutral EN/RU copy and evidence-specific Progress drill-down.

Permanent rules:

- bounded deterministic evidence before presentation;
- frequency caps/deduplication;
- dismissible/non-punitive presentation;
- no guilt, streak loss or compulsive engagement mechanics;
- no automatic workout/program/nutrition/goal/Labs/safety mutation;
- no Home takeover, push/background delivery or model-triggered proactive generation unless a new purpose-specific contract is reviewed.

Focused closure evidence: `docs/qa/phase16-foreground-closure.md`.

**Status:** source/CI-complete for foreground v1.

## Phase 17 — Goals & Planning

### Product authority

Phase 17 starts from the goal fields already owned by the canonical fitness profile:

- `ProfileState.goalType`;
- `ProfileState.targetWeight`;
- `ProfileState.weeklyWeightChangeGoal`;
- `ProfileState.trainingDaysPerWeek`.

They already mutate through `updateProfileGoals` and participate in the existing fitness-profile synchronization path. Do **not** add a second persisted goal collection merely to support goal-aware Progress, Coach or temporary planning proposals.

A new persisted goal entity is justified only when a reviewed requirement cannot safely be represented by the current authority, for example multiple independently versioned simultaneous goals or historical goal lifecycle records. Before implementation, such expansion must define ownership, migration, sync/revision, conflict and deletion semantics.

Detailed authority decision: `docs/architecture/phase17-goal-authority.md`.

### P17-A — Typed goal facts + Progress context

#773 derives deterministic `buildGoalFacts()` from canonical profile goals, canonical weight history, completed workout sessions and an explicit time anchor.

Current facts include:

- saved goal type;
- target weight;
- current recorded weight and signed target delta when evidence exists;
- target training days/week;
- unique active training days in the bounded last-seven-local-day mobile window;
- completed-session count and evidence window metadata.

Progress presents these neutrally and links to the existing Profile goal editor. No universal goal/adherence score, inferred body composition or moralized success/failure label is allowed.

**Status:** source/CI-complete for the reviewed first fact/presentation slice.

### P17-B — Goals → Companion handoff

#776 passes only reviewed `goal_progress` intent and an ISO anchor from Progress to Companion. It does not serialize goal values, weight history or workout history through navigation. Companion rebuilds goal facts from canonical state in a focused context card.

**Status:** source/CI-complete.

### P17-C — Goal-aware Ask Coach

Backend #271 extends the existing question router with dedicated `goal` scope and `goal_progress` intent. Goal-only evidence reads only:

- existing fitness profile;
- bounded 42-day weight history;
- bounded recent completed-session history.

It does not read food logs/workout sets and does not expose user/storage ids, notes or session payloads to the answer model. Mixed-unit weight deltas remain unknown rather than silently converted. Capabilities schema v13 advertises the goal scope explicitly.

The first backend seven-day active-training-day evidence uses **UTC-day buckets**, because no server-side user-timezone authority has been introduced. Do not claim local-calendar parity with mobile P17-A until a reviewed timezone contract exists.

Mobile #777 adds:

- strict fail-closed `coach-question-answer-v3` parsing;
- existing bearer/refresh network stack reuse;
- question-text-only POST payload and no POST retry;
- 600-character client boundary matching backend;
- capability-aware availability (`structuredAnswer`, `readOnly:true`, `automaticApplication:false`);
- capabilities compatibility v11 → v12 → v13;
- main Companion Ask Coach composer/result presentation;
- no conversation persistence and no automatic canonical mutation.

**Status:** source/CI-complete for the reviewed first goal-aware question/UI contract.

### P17-D — Planning/proposal preview contract

This is the next planned source slice.

Before richer planning UI, define a typed non-canonical proposal/preview contract over the existing fitness-profile goal authority.

Required invariants:

1. proposal state is separate from canonical profile state until explicit confirmation;
2. no second persisted goal store merely to hold a proposal;
3. each proposed change identifies current value, proposed value and the goal field it affects;
4. stale-source handling is explicit before mutation (revision/source fingerprint or another reviewed equivalent);
5. nutrition-target and training-program changes are separate confirmed applications, not hidden side effects of accepting a goal proposal;
6. rejected/dismissed proposals do not mutate canonical state;
7. neutral copy only — no guilt, punishment, streak-loss or moralized adherence;
8. Coach explanations remain evidence-bounded and cannot invent missing body composition, recovery, nutrition or Labs facts.

Initial implementation should prefer a deterministic proposal/preview state machine and explicit user edits/confirmation before adding any model-generated planning proposal.

### P17-E — Richer goal model threshold

Do not implement by default. Revisit only if product requirements require semantics the current profile cannot express, such as multiple simultaneous goals, independent deadlines/status, lifecycle history or separately synced goal records.

If triggered, design first:

- identity/ownership;
- schema/migration;
- sync/revision/conflict rules;
- deletion/account-cleanup semantics;
- privacy/export behavior;
- relationship to existing profile goal fields and migration authority.

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

1. Treat P17-A/B/C as source/CI-complete for the reviewed first goal-aware slice set.
2. Begin P17-D planning/proposal preview with explicit non-canonical/stale-source/confirmation boundaries over existing profile authority.
3. Keep Phase 15 and reviewed Phase 16 foreground v1 closed unless a reproduced defect, failed invariant or newly reviewed purpose requires reopening them.
4. Execute Phase 14 provider/device evidence whenever external prerequisites become available; it remains independent of successor source phases.
5. If evidence or normal use reproduces a defect, repair it in a coherent bounded package and validate exact head.
6. Keep `docs/current-status.md`, `docs/handoffs/latest.md`, `ROADMAP_PROGRESS.md` and this plan synchronized with verified Git/evidence.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

A source-contract failure must be distinguished from a runtime/type failure. When a reviewed migration intentionally changes a source invariant, update the stale contract to require the new invariant rather than reverting valid runtime code; behavioral/accessibility/compatibility invariants remain protected.

Backend source/operations changes require the applicable backend/PostgreSQL/account-lifecycle gates for their scope.

Evidence-only diagnostics may intentionally fail after printing requested evidence and should be restored/closed without merge when their purpose is complete.

Documentation-only synchronization must never claim provider, physical-device or production evidence that did not run.

## Activation boundary

Provider configuration, native/device execution and rollout actions remain governed by current repository authorization, least privilege, privacy, preflight, evidence, recovery and rollback controls in `AGENTS.md` and the relevant operational docs. Successor source phases do not relax those boundaries.
