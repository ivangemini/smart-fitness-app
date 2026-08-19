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
- **Phase 17 — Goals & Planning: active. First canonical goal-fact, Progress/Companion and backend question slices are implemented.**

## Current verified checkpoint

### Mobile

Current `main`: `45119f2ef3cc381e667fa8e17ad2d108a9114062` (#776).

Phase 15 mobile includes bounded Coach capabilities/selective retrieval (#749–#751), compact Progress IA/current drill-downs (#755–#764), and selector-only exercise, Weight, Measurements, Activity and Highlights Progress → Companion handoffs through #768.

Phase 16 foreground includes:

- #770 deterministic bounded selector for notable strength progression, conservative stagnation and positive consistency change;
- #771 account-scoped schema-versioned cooldown/dismissal state with privacy/account-cleanup integration;
- #772 one authenticated Companion card, persistence-before-display, fail-closed storage behavior, neutral localized copy and evidence-specific Progress navigation.

Phase 17 mobile includes:

- #773 existing fitness-profile goal authority + deterministic typed `buildGoalFacts()` + neutral Progress Goals card;
- #776 selector-only Goals → Companion handoff with canonical fact rebuilding on the destination;
- #777 authenticated read-only Ask Coach UI, strict question-response parsing and Coach capabilities v11–v13 compatibility is in final exact-head validation and is not yet claimed merged here.

### Backend

Current verified backend `main`: `eebca930893f3b2a5bcc4e2293873695d1bbb3c6` (#271).

Backend Coach question infrastructure includes minimal-scope routing (#266), minimized evidence/strict structured answers (#267), authenticated read-only question API composition (#269), confirmed structured Labs evidence (#270), and bounded goal-progress evidence (#271).

#271 adds the dedicated `goal` question scope, `goal_progress` intent and capabilities schema v13. Goal-only retrieval reads the existing fitness profile, a bounded 42-day weight history and bounded recent completed-session history; it does not read food logs or workout sets and does not expose user/storage ids, notes or session payloads to the answer model.

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

The reviewed first Proactive Coach product slice is complete for source/CI evidence.

### Completed

- deterministic trigger/evidence contracts;
- bounded source input before analytics;
- stable evidence-derived deduplication keys;
- seven-day global presentation cooldown;
- account-scoped dismissal memory and deletion cleanup;
- one concise foreground Companion card;
- neutral EN/RU copy;
- targeted evidence drill-down to Strength & Training or Activity;
- fail-closed presentation when storage is unavailable;
- explicit anti-compulsion/no-auto-mutation boundaries.

### Not included

- Home takeover;
- push/background/OS notification delivery;
- provider/model-triggered proactive generation;
- badges, streak-loss or punitive engagement mechanics;
- automatic workout/program/nutrition/goal/Labs/safety mutation;
- production rollout or signed physical-device evidence.

Further Phase 16 expansion requires a newly reviewed purpose/delivery contract rather than widening the current selector implicitly.

## Phase 17 — Goals & Planning

### P17-A — Canonical authority and typed goal facts

Current authority remains the existing fitness profile:

- `goalType`;
- `targetWeight`;
- `weeklyWeightChangeGoal`;
- `trainingDaysPerWeek`.

#773 established typed deterministic goal facts over canonical profile state, weight history, completed workout sessions and an explicit time anchor. Progress shows goal type, target/current recorded weight and active-days/planned-days context without a universal goal score or inferred body composition.

**Status:** source/CI-complete for the reviewed first fact/presentation slice.

### P17-B — Goal context handoff

#776 routes only reviewed `goal_progress` intent plus an ISO time anchor from Progress to Companion. It does not serialize goal values, weight history or workout history through navigation. Companion rebuilds the facts from canonical state.

**Status:** source/CI-complete.

### P17-C — Goal-aware Coach questions

Backend #271 adds purpose-specific goal question routing/evidence and keeps the answer path read-only. Capabilities v13 explicitly advertises the new scope.

Mobile #777 adds the user-facing Ask Coach composer/result surface through the existing bearer/refresh API stack, strict fail-closed response parsing and capabilities compatibility for v11 → v12 → v13. It is only complete once exact-head Mobile CI passes and the PR is merged.

Permanent P17-C rules:

- question text is the only client payload for generic Ask Coach;
- the router chooses the minimum approved scope before user data is read;
- goal-only retrieval does not broaden into nutrition food logs or strength set history;
- no conversation persistence is introduced by this slice;
- no automatic goal/program/workout/nutrition mutation;
- unavailable provider-backed structured answering is surfaced through capabilities rather than hidden retries.

### P17-D — Planning/proposal contract (next)

The next source slice should define a reviewed proposal/preview contract over the existing profile goal authority before adding richer planning UI.

Required boundaries:

1. proposals are separate from canonical state until explicit user confirmation;
2. no second goal store merely to hold a temporary proposal;
3. any proposed target weight, weekly rate or training-day change must identify the current value and proposed value explicitly;
4. nutrition/program changes remain separate confirmed applications rather than hidden side effects;
5. stale-source/revision handling must be defined before a proposal can mutate canonical data;
6. neutral copy only — no guilt, punishment, streak loss or moralized adherence;
7. if requirements expand to multiple independent goals or historical goal lifecycle records, define the new persistence/sync/conflict/deletion model before implementation.

## Remaining Phase 14 gates

- **Push:** staging-only APNs/FCM material, bounded provider sends, signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** staging-only private S3-compatible storage plus Gemini material, configured-provider readiness, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Finish #777 exact-head validation/merge and synchronize canonical checkpoint docs.
2. Define and implement P17-D planning/proposal preview with explicit stale-source and confirmation boundaries over the existing profile authority.
3. Keep Phase 15 and reviewed Phase 16 foreground v1 closed unless a reproduced defect or new reviewed purpose requires reopening them.
4. Execute Phase 14 provider/device evidence independently whenever its prerequisites become available.
5. Repair reproduced defects; do not manufacture unrelated cleanup work.

## Authorization / release boundary

Source/CI closure does not relax provider, native/device, production or medical-safety controls. Those remain governed by current `AGENTS.md`, least privilege, privacy, preflight, evidence, recovery and rollback requirements.
