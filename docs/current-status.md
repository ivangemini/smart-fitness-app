# Smart Fitness Current Status

Updated: 2026-08-19

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current verified runtime `main`: `b2531e2122d6d7357129c76c48554b3a915d2e6c` (#783). Documentation checkpoint #784 follows without runtime changes.

Phase 15 remains source/CI-complete for the reviewed Coach Intelligence + Progress scope. Phase 16 deterministic foreground v1 is source/CI-complete through #770–#772.

The first reviewed Phase 17 Goals & Planning scope is source/CI-complete:

- #773 — typed deterministic goal facts from canonical fitness-profile goals, weight history and completed workout history, plus neutral goal-relative Progress context;
- #776 — selector-only Goals → Companion handoff with canonical fact rebuilding at the destination;
- #777 — authenticated read-only Ask Coach UI, strict question-response parsing, capability-aware availability and Coach capability-schema compatibility through v13;
- #781 — typed non-canonical goal proposal preview, explicit current→proposed changes and guarded `applied | stale` canonical update;
- #783 — inline Liquid Glass proposal review, preview invalidation after further edits, and preservation of the #781 atomic stale-source guard without adding a second goal authority.

#783 exact-head `98aece0b5a44b97988797db2fedd04529bf302df` passed Mobile CI run `32245117299` / 2641: repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

The existing fitness profile remains the canonical goal authority. No second persisted goal collection or proposal store was introduced. Applying a goal proposal changes only goal fields; the previous hidden nutrition-target recalculation remains removed, so nutrition/program changes remain separate reviewed application flows. The review surface is ephemeral: changing the editable form invalidates the current preview and requires a fresh review before apply.

Focused closure evidence: `docs/qa/phase17-goals-planning-closure.md`.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `eebca930893f3b2a5bcc4e2293873695d1bbb3c6` (#271).

The read-only Coach question path includes:

- #266 — minimal-scope structured question routing;
- #267 — minimized evidence, strict structured answer output and fail-closed scope validation;
- #269 — authenticated `POST /v1/coach/questions` composition;
- #270 — bounded confirmed structured Labs overview/marker-history evidence;
- #271 — bounded `goal_progress` routing/evidence over the existing fitness profile, 42-day weight history and recent completed sessions, with capabilities schema v13.

#271 passed exact-head Backend CI: lint, Prettier, build, production-configuration validation, isolated-staging topology validation and the full test suite.

Goal-only questions do not read food logs or workout sets and do not expose notes/session payloads. The first backend goal evidence contract uses a bounded seven-day **UTC-day** training window because server-side user-timezone authority has not been introduced; it must not be described as a local-calendar-week contract.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains the user-facing presentation of Coach, not a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the currently reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground Companion-card v1 source/CI-complete through #770–#772; expansion requires a separate purpose/delivery contract.
- **Phase 17 — Goals & Planning:** P17-A through P17-D are source/CI-complete for the currently reviewed first scope through #783. P17-E richer goal persistence remains threshold-gated and is not an automatic next task.
- **Phase 18 — Knowledge & Learning:** newly approved and active. P18-A knowledge/content/evidence foundation is the current autonomous source priority; later editorial generation, reader, quizzes, learning state and Coach→Learn integration remain dependency ordered.

## Phase 17 authority and boundaries

Canonical goal-related fields remain:

- `ProfileState.goalType`;
- `ProfileState.targetWeight`;
- `ProfileState.weeklyWeightChangeGoal`;
- `ProfileState.trainingDaysPerWeek`.

They already participate in the fitness-profile synchronization path and mutate through `updateProfileGoals`.

P17-D adds an ephemeral proposal contract over those fields. A proposal captures the source goal snapshot plus only explicit current→proposed changes. Before canonical mutation, the app compares that source snapshot with current state inside the state transition. A mismatch returns `stale` and preserves newer state unchanged.

#783 refines presentation only: review now happens in an inline Liquid Glass card, any subsequent form edit invalidates that review, and Apply still uses the captured source snapshot through the atomic guarded update.

Permanent Phase 17 first-scope rules:

- missing evidence remains missing;
- no universal goal/adherence score;
- no moralized success/failure or punitive streak mechanics;
- no inferred body composition;
- navigation passes selectors/anchors rather than raw private state;
- generic Coach questions are read-only and minimum-scope;
- proposals remain non-canonical until explicit confirmation;
- stale proposals fail closed;
- accepting a goal proposal does not automatically mutate nutrition targets, programs, workouts, Labs, recovery or safety state.

A new persisted goal entity is justified only by a reviewed requirement the current profile cannot safely express, such as multiple independently versioned simultaneous goals, explicit deadlines/status or goal lifecycle history. Ownership, migration, sync/revision, conflict, deletion/account-cleanup and privacy/export semantics must be designed before such expansion.

## Phase 18 approved product boundary

Phase 18 adds a controlled educational layer across training, nutrition, physiology, recovery, body composition and selected Labs concepts.

The reviewed loop is:

`bounded user evidence → deterministic Coach finding → approved knowledge mapping → canonical article → validated quiz → informational learning state → future Coach personalization`

Permanent first-scope rules:

- **no gamification**: no knowledge XP, levels, streaks, badges, leaderboards, competitive ranks or punitive learning mechanics;
- canonical articles are generated/reviewed ahead of use and are versioned; end-user requests do not create a new scientific article from scratch;
- AI is an editorial assistant over an approved evidence pack, not the publication authority;
- every material factual claim must be traceable to reviewed source records before publication;
- quizzes are pre-generated for an exact article version and must have a provably unique answer key;
- medical-adjacent/Labs educational material remains non-diagnostic and requires stronger review; Tier-3 publication requires human review;
- canonical article/source/quiz records contain no private user evidence;
- private evidence may be used only in bounded recommendation/relevance layers;
- Coach recommendations use allowlisted deterministic finding→content mappings rather than unconstrained content generation;
- reading or quiz completion never automatically mutates workouts, nutrition targets, goals, Labs, recovery or safety state;
- later behavior change must not be attributed causally to having read an article.

Focused architecture: `docs/architecture/phase18-knowledge-learning-system.md`.

Focused execution roadmap: `docs/roadmap/knowledge-learning.md`.

## Phase 14 external evidence boundary

Phase 14 remains independently actionable when external prerequisites become available.

- **Push:** staging-only APNs/FCM material plus signed physical-device permission/token/delivery/tap evidence remain.
- **Labs / Analyses:** configured-provider evidence still requires staging-only private S3-compatible storage plus Gemini material, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** backend route/auth/account-lifecycle staging evidence is complete; remaining mobile/physical-device runtime evidence remains.
- **Steps:** signed native/physical-device support, permissions, real aggregate reads and local-day/DST/Home evidence remain.

## Validation / closure boundary

Source/CI completion does **not** claim production deployment, provider activation, signed physical-device evidence, production-model quality, diagnosis/prescribing authority, server-side local-timezone parity or automatic cross-domain mutation.

Phase 18 source completion likewise does not claim editorial publication quality merely because a model produced a draft. Publication requires the reviewed evidence/claim/quiz gates.

## Current execution order

1. Execute **P18-A Knowledge/content/evidence foundation**: versioned domain contracts, source/claim traceability, risk/review states and deterministic publication eligibility; then define the minimum persistence/read API boundary.
2. Keep P17-A through P17-D closed for the currently reviewed first Goals & Planning scope through #783; do not manufacture P17-E unless its richer-goal threshold is crossed.
3. After P18-A is validated, continue P18-B editorial generation pipeline and P18-C library/reader as dependency-safe workstreams; do not skip publication gates to accelerate UI.
4. Keep Phase 15 and reviewed Phase 16 foreground v1 closed unless a reproduced defect or newly reviewed capability requires expansion.
5. Execute Phase 14 provider/device evidence independently whenever its external prerequisites become available.
6. Repair demonstrated defects before unrelated cleanup work.

## Execution boundary

`AGENTS.md` remains the operational authority. Provider activation, deployment, native/device execution, credential changes and production-sensitive operations remain separately evidence- and authorization-gated.