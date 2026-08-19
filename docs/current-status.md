# Smart Fitness Current Status

Updated: 2026-08-19

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `45119f2ef3cc381e667fa8e17ad2d108a9114062` (#776).

Phase 15 remains source/CI-complete for the reviewed Coach Intelligence + Progress scope. Phase 16 deterministic foreground v1 is source/CI-complete through #770–#772.

Phase 17 Goals & Planning is now active over the existing fitness-profile goal authority:

- #773 — typed deterministic goal facts from canonical profile goals, weight history and completed workout history, plus neutral goal-relative Progress context;
- #776 — selector-only Goals → Companion handoff; navigation carries reviewed intent/time anchor only and Companion rebuilds facts from canonical state;
- #777 — authenticated read-only Ask Coach UI and mobile capability-schema compatibility is in final exact-head validation and is not claimed merged by this checkpoint yet.

The existing Profile goals editor remains the canonical mutation surface. No second persisted goal collection was introduced.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `eebca930893f3b2a5bcc4e2293873695d1bbb3c6` (#271).

The read-only Coach question path now includes:

- #266 — minimal-scope structured question routing;
- #267 — minimized evidence, strict structured answer output and fail-closed scope validation;
- #269 — authenticated `POST /v1/coach/questions` composition;
- #270 — bounded confirmed structured Labs overview/marker-history evidence;
- #271 — bounded `goal_progress` routing/evidence over the existing fitness profile, 42-day weight history and recent completed sessions, with capabilities schema v13.

#271 passed exact-head Backend CI: lint, Prettier, build, production-configuration validation, isolated-staging topology validation and the full test suite.

Goal-only questions do not read food logs or workout sets and do not expose notes/sessionData. The first backend goal evidence contract uses a bounded seven-day **UTC-day** training window because server-side user-timezone authority has not been introduced; it must not be described as a local-calendar-week contract.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains the user-facing presentation of Coach, not a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the currently reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground Companion-card v1 source/CI-complete through #770–#772; expansion requires a separate purpose/delivery contract.
- **Phase 17 — Goals & Planning:** in progress. Canonical goal facts, Progress context, Goals → Companion context and backend goal-aware question scope are implemented for the reviewed first slices.

## Phase 17 authority and boundaries

Current canonical goal-related fields remain:

- `ProfileState.goalType`;
- `ProfileState.targetWeight`;
- `ProfileState.weeklyWeightChangeGoal`;
- `ProfileState.trainingDaysPerWeek`.

They already participate in the fitness-profile synchronization path and are mutated through the established `updateProfileGoals` flow. A new persisted goal entity is justified only by a reviewed requirement that these fields cannot safely express, such as multiple independently versioned simultaneous goals or goal lifecycle history; ownership, migration, sync/revision, conflict and deletion semantics must be defined before such expansion.

Permanent Phase 17 rules for the current authority:

- missing evidence remains missing;
- no universal goal/adherence score;
- no moralized success/failure or punitive streak mechanics;
- no inferred body composition;
- navigation passes selectors/anchors rather than raw private state;
- Coach questions are read-only and minimum-scope;
- planning recommendations may be proposed later, but canonical mutation remains explicit and confirmation-gated.

## Phase 14 external evidence boundary

Phase 14 remains independently actionable when external prerequisites become available.

- **Push:** staging-only APNs/FCM material plus signed physical-device permission/token/delivery/tap evidence remain.
- **Labs / Analyses:** configured-provider evidence still requires staging-only private S3-compatible storage plus Gemini material, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** backend route/auth/account-lifecycle staging evidence is complete; remaining mobile/physical-device runtime evidence remains.
- **Steps:** signed native/physical-device support, permissions, real aggregate reads and local-day/DST/Home evidence remain.

## Validation / closure boundary

Source/CI completion does **not** claim production deployment, provider activation, signed physical-device evidence, production-model quality, diagnosis/prescribing authority or automatic canonical mutation.

## Current execution order

1. Finish exact-head validation and merge of mobile #777 before claiming the Ask Coach UI as part of `main`.
2. Synchronize canonical status/roadmap/handoff docs to the resulting mobile/backend merge SHAs.
3. Continue Phase 17 with a reviewed planning/proposal contract over the existing fitness-profile goal authority; do not create a second goal store by default.
4. Keep Phase 15 and the reviewed Phase 16 foreground v1 closed unless a reproduced defect or newly reviewed contract requires expansion.
5. Execute Phase 14 provider/device evidence independently whenever its prerequisites become available.

## Execution boundary

`AGENTS.md` remains the operational authority. Provider activation, deployment, native/device execution, credential changes and production-sensitive operations remain separately evidence- and authorization-gated.
