# Smart Fitness Current Status

Updated: 2026-08-19

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `e086f6795b0ea5f07ad00c3d03283759a1889780` (#777).

Phase 15 remains source/CI-complete for the reviewed Coach Intelligence + Progress scope. Phase 16 deterministic foreground v1 is source/CI-complete through #770–#772.

Phase 17 Goals & Planning is now active over the existing fitness-profile goal authority:

- #773 — typed deterministic goal facts from canonical profile goals, weight history and completed workout history, plus neutral goal-relative Progress context;
- #776 — selector-only Goals → Companion handoff; navigation carries reviewed intent/time anchor only and Companion rebuilds facts from canonical state;
- #777 — authenticated read-only Ask Coach UI, strict question-response parsing, capability-aware availability and mobile Coach capability-schema compatibility through v13.

#777 passed exact-head Mobile CI: repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

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
- **Phase 17 — Goals & Planning:** in progress. Canonical goal facts, Progress context, Goals → Companion context and goal-aware Ask Coach are source/CI-complete for the reviewed first slices.

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

1. Treat P17-A/B/C as source/CI-complete for the reviewed first goal-aware slices through mobile #777 and backend #271.
2. Continue Phase 17 with a reviewed P17-D planning/proposal preview contract over the existing fitness-profile goal authority; proposals remain non-canonical until explicit confirmation and must define stale-source handling before mutation.
3. Keep Phase 15 and the reviewed Phase 16 foreground v1 closed unless a reproduced defect or newly reviewed contract requires expansion.
4. Execute Phase 14 provider/device evidence independently whenever its prerequisites become available.
5. Repair demonstrated defects; do not manufacture unrelated cleanup work.

## Execution boundary

`AGENTS.md` remains the operational authority. Provider activation, deployment, native/device execution, credential changes and production-sensitive operations remain separately evidence- and authorization-gated.
