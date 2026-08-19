# Phase 17 Goals & Planning — First-Scope Closure

Updated: 2026-08-19

This document records source/CI closure for the first reviewed Phase 17 Goals & Planning scope. Exact Git history, source, tests and CI override this prose if it becomes stale.

## Verified baselines

### Mobile

- repository: `ivangemini/smart-fitness-app`;
- reviewed runtime merge: #781;
- exact validated PR head: `5c239c3638932568440c811f6d44e7578db1ea8a`;
- resulting `main`: `fe36a5ff00666a977099277258cd326dc5a9cf14`;
- authoritative Mobile CI run: `32242728771` / run 2638.

Final exact-head Mobile CI passed:

- repository file line audit;
- changed-file line limit;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- Expo Doctor.

The first regression run exposed two stale source-contract expectations that still required the pre-P17-D hidden nutrition recalculation and Progress-state coupling. Runtime/type checks and the new P17-D tests were green. Those two source contracts were updated to require the new reviewed boundaries, then the full exact-head gate passed.

### Backend

- repository: `ivangemini/smart-fitness-backend`;
- reviewed goal-question merge: #271;
- current verified `main`: `eebca930893f3b2a5bcc4e2293873695d1bbb3c6`.

#271 previously passed exact-head Backend CI covering lint, Prettier, build, production-configuration validation, isolated-staging topology validation and the full test suite.

## Closed first-scope packages

### P17-A — Canonical goal facts and Progress context

Mobile #773 reuses the existing fitness-profile goal authority rather than adding a new goal store. Deterministic goal facts are derived from the canonical profile, weight history, completed workout history and an explicit time anchor. Progress presents neutral goal-relative context without a universal score or inferred body composition.

### P17-B — Goals → Companion handoff

Mobile #776 passes only reviewed intent/time-anchor selectors through navigation. Companion rebuilds goal facts from canonical state; route params do not carry raw goal values, weight history or workout history.

### P17-C — Goal-aware Ask Coach

Backend #271 adds the bounded `goal` question scope / `goal_progress` intent and capabilities v13. Goal-only evidence reads only the existing profile, bounded weight history and recent completed-session history. It does not read food logs or workout-set history and does not expose notes/storage identifiers to the answer model.

Mobile #777 adds the authenticated read-only Ask Coach surface, strict `coach-question-answer-v3` parsing, capability-aware availability and v11–v13 Coach capability compatibility. Generic questions send question text only; backend routing chooses the approved data scope before retrieval.

### P17-D — Goal proposal preview and stale-source guard

Mobile #781 adds an ephemeral typed proposal contract:

`editable goal form → explicit current→proposed preview → guarded apply → applied | stale`

The proposal captures the exact canonical goal snapshot used as its source. Canonical mutation compares that snapshot with the latest state inside the functional state transition. If any goal field changed after preview creation, the operation returns `stale` and preserves current state unchanged.

Applying a goal proposal changes only:

- `goalType`;
- `targetWeight`;
- `weeklyWeightChangeGoal`;
- `trainingDaysPerWeek`.

It no longer performs the previous hidden nutrition-target recalculation. Nutrition targets and training programs remain separate domains and require their own reviewed explicit application flows.

The profile form also preserves unsaved goal edits across unrelated profile-field changes and avoids display-unit round-trip drift when an unchanged kg/lb value is merely re-rendered.

Detailed P17-D contract: `docs/architecture/phase17-goal-proposal-contract.md`.

## Permanent first-scope invariants

- canonical goal ownership remains the existing fitness profile;
- no second persisted goal collection exists for this scope;
- missing evidence remains missing;
- no inferred body composition;
- no universal goal/adherence score;
- no guilt, punishment, streak-loss or moralized success/failure mechanics;
- navigation uses selector/anchor context, not raw private state;
- generic Coach questions are read-only and minimum-scope;
- goal proposals are non-canonical until explicit confirmation;
- stale proposals fail closed instead of overwriting newer goal state;
- accepting a goal proposal does not automatically mutate nutrition targets, training programs, workouts, Labs, recovery or safety state.

## Explicitly not claimed

This closure does not claim:

- production deployment or rollout;
- OTA/EAS publication;
- native build/install or signed-device evidence;
- provider activation or production-model quality;
- server-side local-timezone parity for goal training-day evidence;
- model-generated planning proposals;
- proposal persistence/history;
- multiple simultaneous independently versioned goals;
- a new goal persistence/sync domain.

Backend goal training-day evidence v1 remains UTC-day-bucketed until a separate reviewed server-side timezone authority exists.

## Richer goal model threshold

P17-E is not automatically executable merely because P17-D is closed. A new goal entity/persistence domain is justified only by a reviewed product requirement the current profile cannot safely express, such as multiple simultaneous independent goals, explicit goal deadlines/status, lifecycle history or separately synchronized goal records.

If that threshold is reached, design ownership, identity, migration, sync/revision/conflict, deletion/account-cleanup, privacy/export and migration authority before source implementation.

## Closure decision

P17-A through P17-D are source/CI-complete for the currently reviewed first Phase 17 scope. Keep this scope closed unless a reproduced defect, failed invariant or newly reviewed capability requires expansion. Do not manufacture P17-E persistence work without the richer-goal threshold being met.
