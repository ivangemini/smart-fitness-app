# Smart Fitness — Implementation Plan

Updated: 2026-08-20

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision remains `docs/architecture/local-state-performance-decision.md`; do not reopen that architecture without new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified runtime `main`: `3a99b017b679da295207e4a8e4d1506681368023` (#793).

The repository-wide Liquid Glass convergence and Phase 15 Coach Intelligence + Progress scope remain source/CI-complete for reviewed boundaries. Phase 16 deterministic foreground v1 remains source/CI-complete through #770–#772.

The first reviewed Phase 17 Goals & Planning scope remains source/CI-complete:

- #773 — deterministic typed goal facts + neutral Progress Goals context;
- #776 — selector-only Goals → Companion context handoff;
- #777 — authenticated read-only Ask Coach surface, strict response parsing, capability-aware availability and mobile Coach capabilities compatibility through v13;
- #781 — typed ephemeral goal proposal preview, explicit current→proposed changes and guarded `applied | stale` canonical update;
- #783 — inline Liquid Glass proposal review with preview invalidation after further edits while preserving the #781 atomic stale-source guard.

Phase 18 mobile source has advanced through #793, which merged the Knowledge Library / immutable article reader. P18-E mobile runtime is prepared in #794 at exact code head `e43576ec83db1c299972b8667be4966ba49a1945`; Mobile CI run `32380637863` passed repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Focused Phase 17 first-scope closure evidence: `docs/qa/phase17-goals-planning-closure.md`.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `d705457ae36147bb65f110266da2dbceb880cc98` (#295).

The reviewed read-only Coach question infrastructure remains in place, including minimal routing (#266), minimized evidence/strict answer output (#267), authenticated `/v1/coach/questions` composition (#269), confirmed structured Labs evidence (#270), and bounded goal-progress evidence/capabilities v13 (#271).

Phase 18 backend source has advanced through #285 canonical Knowledge persistence/reader, #290 provider-neutral editorial orchestration and #294 exact-version quiz-bank/backend evaluation.

P18-E backend #296 is source/CI-ready at exact head `91bacc7f2732b843dd01d754aba2a3eb31790ac4`. Backend CI run `32400589482` / #2182, Backend PostgreSQL CI run `32400589540` / #643 and Account Deletion Receipt CI run `32400589605` / #559 all passed.

Phase 14 provider/runtime source preparation remains complete for reviewed contracts. Existing isolated Hermes staging and bounded Labs/Stories evidence tooling remain the execution foundation for external evidence work.

Backend `main` merge is currently an explicit production-activation boundary because it is configured to trigger the Vercel production deployment for `peptonio-admin`. Source-ready Phase 18 work must not bypass that boundary.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: source/CI-complete for the reviewed convergence scope.
- Stories S10: source/CI plus basic isolated backend route/auth/account-lifecycle staging evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained. Companion is the user-facing embodiment of Coach, not a second assistant. Cosmetic progression remains deferred.
- Phase 14: ordinary autonomous source/runtime preparation is exhausted for current contracts; remaining work is external provider material, signed native/physical-device evidence, deliberate rollout, or bounded repair of a reproduced defect.
- Phase 15: **Coach Intelligence & Data Access + Progress UX/Analytics is source/CI-complete for the currently reviewed scope.**
- Phase 16: **Proactive Coach deterministic foreground v1 is source/CI-complete through #770–#772.**
- Phase 17: **Goals & Planning P17-A through P17-D are source/CI-complete for the currently reviewed first scope through mobile #783 and backend #271. P17-E remains richer-goal-threshold gated.**
- Phase 18: **Knowledge & Learning is active. P18-A/B/C/D are merged for their reviewed source scopes; P18-E is source/CI-ready in backend #296 + mobile #794 but remains dependency/production-boundary blocked from merge.**

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

Phase 17 extends this architecture with a reviewed purpose-specific goal scope; it does not create a second retrieval authority.

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

Phase 17 uses the goal fields already owned by the canonical fitness profile:

- `ProfileState.goalType`;
- `ProfileState.targetWeight`;
- `ProfileState.weeklyWeightChangeGoal`;
- `ProfileState.trainingDaysPerWeek`.

They participate in the existing fitness-profile synchronization path. Do **not** add a second persisted goal collection merely to support goal-aware Progress, Coach or temporary planning proposals.

A new persisted goal entity is justified only when a reviewed requirement cannot safely be represented by the current authority, for example multiple independently versioned simultaneous goals, explicit goal deadlines/status or historical goal lifecycle records. Before implementation, such expansion must define ownership, migration, sync/revision, conflict, deletion/account-cleanup and privacy/export semantics.

Detailed authority decision: `docs/architecture/phase17-goal-authority.md`.

### P17-A — Typed goal facts + Progress context

#773 derives deterministic `buildGoalFacts()` from canonical profile goals, canonical weight history, completed workout sessions and an explicit time anchor.

Current facts include saved goal type, target weight, current recorded weight/signed target delta when evidence exists, target training days/week, unique active training days in the bounded last-seven-local-day mobile window, completed-session count and evidence-window metadata.

Progress presents these neutrally and links to the existing Profile goal editor. No universal goal/adherence score, inferred body composition or moralized success/failure label is allowed.

**Status:** source/CI-complete for the reviewed first fact/presentation slice.

### P17-B — Goals → Companion handoff

#776 passes only reviewed `goal_progress` intent and an ISO anchor from Progress to Companion. It does not serialize goal values, weight history or workout history through navigation. Companion rebuilds goal facts from canonical state in a focused context card.

**Status:** source/CI-complete.

### P17-C — Goal-aware Ask Coach

Backend #271 extends the existing question router with dedicated `goal` scope and `goal_progress` intent. Goal-only evidence reads only the existing fitness profile, bounded 42-day weight history and bounded recent completed-session history.

It does not read food logs/workout sets and does not expose user/storage ids, notes or session payloads to the answer model. Mixed-unit weight deltas remain unknown rather than silently converted. Capabilities schema v13 advertises the goal scope explicitly.

The first backend seven-day active-training-day evidence uses **UTC-day buckets**, because no server-side user-timezone authority has been introduced. Do not claim local-calendar parity with mobile P17-A until a reviewed timezone contract exists.

Mobile #777 adds strict fail-closed `coach-question-answer-v3` parsing, existing bearer/refresh stack reuse, question-text-only POST payload/no POST retry, shared 600-character boundary, capability-aware availability, capabilities compatibility v11 → v12 → v13, main Companion Ask Coach presentation, no conversation persistence and no automatic canonical mutation.

**Status:** source/CI-complete for the reviewed first goal-aware question/UI contract.

### P17-D — Planning/proposal preview

#781 implements the first reviewed goal-planning mutation boundary.

The typed proposal is ephemeral and contains:

- schema version;
- exact source snapshot of the four canonical goal fields;
- proposed replacement snapshot;
- only explicit current→proposed field changes.

Reviewed state flow:

`editable goal form → explicit preview → guarded apply → applied | stale`

Before mutation, the app compares the proposal source snapshot with the latest canonical goal state inside the functional state transition. A mismatch returns `stale`; current state remains unchanged and persistence is not scheduled for the rejected proposal.

Applying a proposal mutates only the four canonical goal fields. The previous hidden nutrition-target recalculation was removed. Nutrition targets, training programs, workouts, Labs, recovery and safety remain separate domains with their own reviewed application requirements.

The form preserves unsaved goal edits across unrelated profile changes. It also preserves exact canonical kg values when the displayed kg/lb number was not edited, avoiding format/convert round-trip drift.

#783 refines the presentation boundary without changing authority: proposal review is now an inline Liquid Glass card, any subsequent form edit invalidates the current preview, and Apply still passes the captured source snapshot into the #781 atomic stale guard. No second proposal persistence or goal store was added.

Detailed architecture: `docs/architecture/phase17-goal-proposal-contract.md`.

**Status:** source/CI-complete through #783.

### P17-E — Richer goal model threshold

**Do not implement by default.** Revisit only if a reviewed product requirement needs semantics the current profile cannot safely express, such as:

- multiple simultaneous independent goals;
- explicit goal deadlines/status;
- lifecycle/history semantics;
- separately synchronized/versioned goal records.

If triggered, design first:

- identity/ownership;
- schema/migration;
- sync/revision/conflict rules;
- deletion/account-cleanup semantics;
- privacy/export behavior;
- relationship to existing profile goal fields and migration authority.

Do not manufacture a new goal persistence or model-planning domain merely because P17-D is complete.

## Phase 18 — Knowledge & Learning System

Phase 18 is now the active successor source phase. Its purpose is to make Smart Fitness teach users the reasoning behind training, nutrition, physiology, recovery, body-composition and selected Labs concepts, then connect those reviewed lessons to real Coach findings.

This phase is **not gamified**. Do not add knowledge XP, levels, streaks, badges, leaderboards, competition, loss mechanics or engagement rewards.

Reviewed content pipeline:

`topic → curated evidence pack → AI-assisted draft → claim extraction → claim/source verification → quiz generation → quiz validation/review → published article version`

Reviewed user loop:

`bounded user evidence → deterministic Coach finding → allowlisted content mapping → canonical article → validated quiz → informational learning state → future bounded personalization`

Permanent Phase 18 rules:

- canonical scientific/educational articles are generated and reviewed ahead of end-user consumption;
- a live user request does not cause a new scientific article to be invented and treated as canonical;
- AI is an editorial drafting/verifier tool over an approved evidence pack, not publication authority;
- every material claim is source-linked and approval-gated;
- published article versions are stable; material updates produce a new version;
- quizzes are pre-generated against exact article versions and reviewed claims;
- single-select v1 requires exactly four options and one defensible answer;
- ambiguous answer keys fail closed;
- Tier-3 Labs/medical-adjacent content requires human review before publication;
- canonical shared content contains no private user evidence;
- private user evidence may influence only bounded recommendation/relevance/depth layers;
- Coach uses deterministic finding→content mappings rather than unconstrained article generation;
- learning state is informational, not reward-based;
- reading/quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety;
- later behavior/outcome changes cannot be claimed as caused by reading;
- raw Labs documents/extraction drafts remain outside ordinary Knowledge generation/recommendation context.

Focused architecture: `docs/architecture/phase18-knowledge-learning-system.md`.
Focused roadmap: `docs/roadmap/knowledge-learning.md`.

### P18-A — Knowledge/content/evidence foundation

Backend #285 delivered stable concepts/articles/immutable localized versions, allowlisted sources, reviewed claim/source linkage, risk/review state, deterministic publication eligibility, relational persistence, authenticated publication-eligible reading and shared/private separation.

**Status:** merged/stable for reviewed source scope through backend #285.

### P18-B — Editorial generation pipeline

Backend #290 delivered provider-neutral `evidence pack → draft → extracted claims → independent verification → review-ready/rejected` orchestration with bounded retries, structured outputs, source validation, no persisted hidden chain-of-thought and risk-tier-aware human review. Generator/provider output is never publication authority.

**Status:** merged for reviewed source scope through backend #290; provider/content activation remains separate.

### P18-C — Library and reader

Mobile #793 delivered the Knowledge Library, category/concept browse, bounded search, strict version parsing, immutable reader, reviewed source/evidence presentation and hidden editorial states.

**Status:** merged through mobile #793.

### P18-D — Quiz bank + validation

Backend #294 delivered the reviewed exact-version four-option/one-answer quiz bank, claim/version linkage, structural/publication validation, hidden answer-key isolation and backend-only canonical evaluation.

**Status:** merged through backend #294.

### P18-E — Learning state

States remain `unseen | read | understood | refresh_useful`. Backend #296 + mobile #794 implement account-owned persistence outside fitness sync, exact-version read/quiz authority, exact `articleId + locale` refresh resolution, bounded account-partitioned offline read transport, backend-only quiz scoring, account-isolated auth/async guards, deletion cleanup/cascade and subject-access export v2. Reading alone never implies understanding; no gamification or cross-domain mutation is introduced.

**Status:** source/CI-ready on backend #296 exact head `91bacc7f2732b843dd01d754aba2a3eb31790ac4` and mobile #794 exact code head `e43576ec83db1c299972b8667be4966ba49a1945`. Mobile merge requires backend P18-E merged/stable first. Backend merge is blocked on the explicit production-activation boundary below.

### P18-F — Coach → Learn recommendation engine

After merged/stable P18-E, start a host-independent/provider-neutral selector from exact backend `main`: strict versioned typed finding + mapping contracts, stable `articleId` targets, exact locale hydration through canonical reader logic, rechecked publication eligibility, explicit risk/cooldown policy, deterministic ranking/dedupe, P18-E-aware relevance and no model selection authority. Current backend has no reviewed stable `findingCode`; local mobile Proactive Coach kinds are not substitutes.

**Status:** architecture-approved and implementation design prepared; runtime waits for merged/stable P18-E.

### P18-G — Daily-report / Coach surface integration

Attach optional educational context only when P18-F returns an approved exact recommendation and the host has trustworthy typed backend finding provenance. Preserve host usefulness without Knowledge, bounded frequency, non-punitive framing and no automatic canonical mutation.

**Status:** architecture-approved; blocked on P18-F plus trustworthy backend finding provenance.

### P18-H — Curriculum / learning paths

After stable P18-E, use immutable localized path versions with bounded ordered exact-version article steps. Old path versions fail closed when a referenced exact article version is superseded; newly reviewed path versions reference the replacement. Navigation remains free skip/revisit/open and decorates from P18-E instead of inventing duplicate progress/XP/streak/rank authority.

**Status:** architecture-approved; runtime may begin independently after merged/stable P18-E.

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

1. Keep P18-E backend #296 and mobile #794 frozen on their validated source boundaries; repair only a newly demonstrated failure.
2. Do not merge backend #296 until the production-activation side effect of backend `main` is explicitly authorized or a separately reviewed safe no-production mechanism exists.
3. After backend #296 is merged/stable, merge/revalidate mobile #794 against exact current mobile `main`.
4. After P18-E is merged/stable, start P18-F from exact current backend `main` and P18-H from exact current backend/mobile `main` as independent workstreams where their files/contracts do not overlap.
5. Keep P18-G host integration blocked until P18-F exists and a trustworthy typed backend finding identity is available.
6. Keep P17-A through P17-D closed for the currently reviewed first Goals & Planning scope. Do not start P17-E unless its richer-goal threshold is actually crossed.
7. Keep Phase 15 and reviewed Phase 16 foreground v1 closed unless a reproduced defect, failed invariant or newly reviewed purpose requires reopening them.
8. Execute Phase 14 provider/device evidence whenever external prerequisites become available; it remains independent of Phase 18 source work.
9. If evidence or normal use reproduces a defect, repair it in a coherent bounded package and validate exact head.
10. Keep `docs/current-status.md`, `docs/handoffs/latest.md`, `ROADMAP_PROGRESS.md`, `docs/project-context.md`, `PROJECT_LEARNINGS.md`, `docs/roadmap/knowledge-learning.md` and this plan synchronized with verified Git/evidence.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

A source-contract failure must be distinguished from a runtime/type failure. When a reviewed migration intentionally changes a source invariant, update the stale contract to require the new invariant rather than reverting valid runtime code; behavioral/accessibility/compatibility invariants remain protected.

Backend source/operations changes require the applicable backend/PostgreSQL/account-lifecycle gates for their scope.

Phase 18 publication/model pipelines must additionally prove strict schema parsing, source/claim traceability, review-state enforcement, quiz answer-key uniqueness and private/shared data separation. Model plausibility is not a publication test.

Evidence-only diagnostics may intentionally fail after printing requested evidence and should be restored/closed without merge when their purpose is complete.

Documentation-only synchronization must never claim provider, physical-device, editorial publication or production evidence that did not run.

## Activation boundary

Provider configuration, native/device execution and rollout actions remain governed by current repository authorization, least privilege, privacy, preflight, evidence, recovery and rollback controls in `AGENTS.md` and relevant operational docs. Successor source phases do not relax those boundaries.

Phase 18 activation of any editorial/model/search provider is a separate configuration/evidence step. A source-level generation interface does not imply that provider-backed article generation or publication is active.

Backend `main` is currently known to trigger the Vercel production deployment for `peptonio-admin`. Therefore merging a backend source PR into `main` is not treated as an ordinary source-only merge while that configuration remains active; it requires explicit production-activation authorization or a separately reviewed and authorized no-production mechanism.