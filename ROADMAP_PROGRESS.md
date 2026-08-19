# Smart Fitness Roadmap Progress

Updated: 2026-08-19

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI and Git history override stale prose.

Focused roadmap references retained as stable contracts:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`.

## Verified phase baseline

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: source/CI-complete, including repository-wide convergence closure.
- Stories S10: source/CI plus isolated backend route/auth/account-lifecycle staging evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained. Companion is the presentation/character of the existing Coach, not a separate assistant.
- Phase 14: autonomous source/runtime preparation is complete for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics: source/CI-complete for the currently reviewed scope.**
- **Phase 16 — Proactive Coach: deterministic foreground Companion-card v1 source/CI-complete through #770–#772.**
- **Phase 17 — Goals & Planning: P17-A through P17-D source/CI-complete for the currently reviewed first scope through mobile #783 and backend #271.**

## Current verified checkpoint

### Mobile

Current `main`: `b2531e2122d6d7357129c76c48554b3a915d2e6c` (#783).

Phase 15 mobile includes bounded Coach capabilities/selective retrieval (#749–#751), compact Progress IA/current drill-downs (#755–#764), and selector-only exercise, Weight, Measurements, Activity and Highlights Progress → Companion handoffs through #768.

Phase 16 foreground includes:

- #770 deterministic bounded selector for notable strength progression, conservative stagnation and positive consistency change;
- #771 account-scoped schema-versioned cooldown/dismissal state with privacy/account-cleanup integration;
- #772 one authenticated Companion card, persistence-before-display, fail-closed storage behavior, neutral localized copy and evidence-specific Progress navigation.

Phase 17 mobile includes:

- #773 existing fitness-profile goal authority + deterministic typed `buildGoalFacts()` + neutral Progress Goals card;
- #776 selector-only Goals → Companion handoff with canonical fact rebuilding on the destination;
- #777 authenticated read-only Ask Coach UI, strict fail-closed question-response parsing, capability-aware availability, and Coach capabilities v11–v13 compatibility;
- #781 ephemeral typed goal proposal preview, exact source snapshot, explicit current→proposed changes, guarded `applied | stale` update and removal of hidden nutrition-target mutation;
- #783 inline Liquid Glass proposal review with preview invalidation after further edits while preserving the same atomic stale-source guard.

#783 exact-head `98aece0b5a44b97988797db2fedd04529bf302df` passed Mobile CI run `32245117299` / 2641: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Focused first-scope closure evidence: `docs/qa/phase17-goals-planning-closure.md`.

### Backend

Current verified backend `main`: `eebca930893f3b2a5bcc4e2293873695d1bbb3c6` (#271).

Backend Coach question infrastructure includes minimal-scope routing (#266), minimized evidence/strict structured answers (#267), authenticated read-only question API composition (#269), confirmed structured Labs evidence (#270), and bounded goal-progress evidence (#271).

#271 adds the dedicated `goal` question scope, `goal_progress` intent and capabilities schema v13. Goal-only retrieval reads the existing fitness profile, bounded 42-day weight history and bounded recent completed-session history; it does not read food logs or workout sets and does not expose user/storage ids, notes or session payloads to the answer model.

The first backend goal training window uses UTC-day buckets because server-side user-timezone authority has not been introduced. Do not describe this v1 evidence as local-calendar-week parity with mobile.

## Phase 15 — closure status

P15-A through P15-F remain source/CI-complete for the reviewed scope. Detailed evidence and boundary notes remain in `docs/qa/phase15-closure.md`.

Permanent Phase 15 invariants remain:

- purpose-specific bounded data access;
- deterministic analytics outside model prompts;
- read-only Coach orchestration unless the user explicitly confirms a separately reviewed mutation flow;
- compact Progress progressive disclosure;
- selector-only Progress ↔ Companion handoffs;
- raw Labs documents/unconfirmed drafts outside ordinary Coach context;
- missing evidence remains missing.

## Phase 16 — foreground closure

The reviewed first Proactive Coach product slice remains source/CI-complete.

Completed boundaries include deterministic bounded triggers, evidence-derived deduplication keys, seven-day presentation cooldown, account-scoped dismissal memory, one concise authenticated foreground Companion card, neutral EN/RU copy, targeted Progress drill-down and fail-closed presentation when storage is unavailable.

Not included: Home takeover, push/background delivery, provider/model-triggered proactive generation, badges/streak-loss mechanics, automatic workout/program/nutrition/goal/Labs/safety mutation, production rollout or signed physical-device evidence.

Further Phase 16 expansion requires a newly reviewed purpose/delivery contract rather than widening the current selector implicitly.

## Phase 17 — Goals & Planning

### P17-A — Canonical authority and typed goal facts

Current authority remains the existing fitness profile:

- `goalType`;
- `targetWeight`;
- `weeklyWeightChangeGoal`;
- `trainingDaysPerWeek`.

#773 established typed deterministic goal facts over canonical profile state, weight history, completed workout sessions and an explicit time anchor. Progress shows goal type, target/current recorded weight and active-days/planned-days context without a universal goal score or inferred body composition.

**Status:** source/CI-complete for the reviewed fact/presentation slice.

### P17-B — Goal context handoff

#776 routes only reviewed `goal_progress` intent plus an ISO time anchor from Progress to Companion. It does not serialize goal values, weight history or workout history through navigation. Companion rebuilds facts from canonical state.

**Status:** source/CI-complete.

### P17-C — Goal-aware Coach questions

Backend #271 adds purpose-specific goal question routing/evidence and keeps the answer path read-only. Capabilities v13 explicitly advertises the new scope.

Mobile #777 adds the user-facing Ask Coach composer/result surface through the existing bearer/refresh API stack, strict fail-closed response parsing and capabilities compatibility for v11 → v12 → v13.

Permanent P17-C rules remain: question text only from the client, minimum backend scope before user-data retrieval, no goal-only broadening into food logs/set history, no conversation persistence, no automatic canonical mutation and capability-visible provider availability.

**Status:** source/CI-complete for the reviewed first scope/UI contract.

### P17-D — Planning/proposal preview

#781 implements the first reviewed planning mutation boundary without a second goal store.

Flow:

`editable goal form → explicit current→proposed preview → guarded canonical apply → applied | stale`

The proposal is ephemeral and contains an exact source snapshot plus only changed fields. Before mutation, `updateProfileGoals` compares the proposal source against current canonical goal state inside the functional state transition. Any mismatch returns `stale` and preserves current state unchanged.

Applying a proposal changes only goal fields. It no longer recalculates nutrition targets or mutates programs as a hidden side effect. Nutrition/program changes remain separate reviewed explicit application flows.

The form preserves unsaved goal edits across unrelated profile-field changes and preserves exact canonical kg values when a displayed kg/lb value was not edited, avoiding display round-trip drift.

#783 refines only the review UX: the preview is rendered inline in Liquid Glass, further edits invalidate it, and Apply still passes the captured source snapshot into the #781 atomic guard. No second proposal persistence or goal authority was added.

Detailed architecture: `docs/architecture/phase17-goal-proposal-contract.md`.

**Status:** source/CI-complete through #783.

### P17-E — Richer goal model threshold

**Not automatically active.** Revisit only if a reviewed product requirement needs semantics the current profile cannot safely express, such as multiple simultaneous independent goals, goal deadlines/status, lifecycle history or separately synchronized goal records.

Before implementation, define:

- identity/ownership;
- schema/migration;
- sync/revision/conflict rules;
- deletion/account-cleanup semantics;
- privacy/export behavior;
- relationship to existing profile goal fields and migration authority.

Do not manufacture a new goal persistence domain merely because P17-D is complete.

## Remaining Phase 14 gates

- **Push:** staging-only APNs/FCM material, bounded provider sends, signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** staging-only private S3-compatible storage plus Gemini material, configured-provider readiness, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Keep P17-A through P17-D closed for the currently reviewed first Goals & Planning scope through #783 unless a reproduced defect or newly reviewed capability requires expansion.
2. Do not start P17-E persistence/model-planning work until the richer-goal threshold is actually met.
3. Keep Phase 15 and reviewed Phase 16 foreground v1 closed unless a reproduced defect/new reviewed purpose requires reopening them.
4. Execute Phase 14 provider/device evidence independently whenever external prerequisites become available.
5. Repair reproduced defects; do not manufacture unrelated cleanup work.

## Authorization / release boundary

Source/CI closure does not relax provider, native/device, production or medical-safety controls. Those remain governed by current `AGENTS.md`, least privilege, privacy, preflight, evidence, recovery and rollback requirements.