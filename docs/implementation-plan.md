# Smart Fitness — Implementation Plan

Updated: 2026-08-21

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision remains `docs/architecture/local-state-performance-decision.md`; do not reopen that architecture without new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Current `main`: `d0ea13038d9b46dc8b77b9fe6575689f4c044c1d` (#796 documentation closure).
- Current merged runtime source immediately below that docs-only merge: `ea080ecb170d8399fe4d534692dc3ed771121174` (#797).
- Phase 18 mobile source is merged through:
  - #793 — Knowledge Library and immutable article reader;
  - #794 — account-scoped exact-version learning state;
  - #795 — reviewed curriculum / learning paths;
  - #797 — optional Coach → Learn recommendation consumer.
- #797 exact head `3d88b6b4f28349b6c11c5302e865e156b81c17d5` passed Mobile CI #2680 before merge.

The repository-wide Liquid Glass convergence, Phase 15 Coach Intelligence + Progress scope, Phase 16 deterministic foreground v1 and Phase 17 Goals & Planning P17-A through P17-D remain source/CI-complete for their reviewed boundaries.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- Current `main`: `a6179aff35093325f0571139d6ced7e3987a2f10` (#309).
- Phase 18 backend source is merged through:
  - #285 — canonical Knowledge persistence and published reader;
  - #290 — provider-neutral editorial orchestration;
  - #294 — exact-version quiz authority;
  - #296 — account-scoped learning state;
  - #306 — deterministic Coach → Learn selector;
  - #307 — reviewed curriculum / learning paths;
  - #308 — trustworthy deterministic Coach finding authority;
  - #309 — optional Coach run-detail Learn projection host.
- #309 exact head `c4b4da92a926141ad3cea5e898c96177e1c2a49d` passed Backend CI #2243 before merge.

Admin v5-v12 backend PR #305 is a separate source-ready operations workstream. Current exact head `d636d948bd75db8f399227d7ea6e2b51596f2571` passed Backend CI #2278, Backend PostgreSQL CI #709, Account Deletion Receipt CI #623 and exact-head Vercel preview. PR #305 is ready for review and mergeable, but remains unmerged because landing it on backend `main` triggers the configured Peptonio Admin production deployment.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete; configured-provider and physical-device evidence remains.
- **Phase 13 — Companion v1:** retained. Companion remains the user-facing presentation layer over Coach rather than a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts. Remaining work is external provider material, signed native/physical-device evidence, deliberate rollout, or bounded repair of a reproduced defect.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete through #770–#772.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** **P18-A through P18-H are source/CI-complete and merged for the reviewed scope. There is no approved P18-I.**

## Phase 15 — retained authority

Coach and Companion remain one product surface. Companion is the character/interface through which existing Coach authority is presented; do not create a second recommendation or conversational-state authority.

Detailed analytics belong primarily in Progress. Reviewed bounded Coach access, deterministic analytics, minimal-scope retrieval, Progress drill-downs and selector-only Coach ↔ Progress handoffs remain closed unless a reproduced defect or newly reviewed purpose requires reopening them.

Permanent rules:

- minimum purpose-specific structured facts;
- no unrestricted model access to AppState, AsyncStorage, SecureStore or provider payloads;
- raw Labs documents and unconfirmed extraction drafts excluded from ordinary Coach context;
- deterministic calculations and hard guardrails remain outside the model;
- no pseudo-precision or universal scoring systems;
- route params do not carry broad private state or prebuilt analytics.

## Phase 16 — Proactive Coach retained authority

Foreground v1 remains closed and includes deterministic bounded insight selection, account-scoped presentation memory, cooldown/deduplication and a dismissible Companion insight card.

Do not add guilt, streak-loss mechanics, automatic workout/program/nutrition/goal/Labs/safety mutation, Home takeover, push/background delivery or model-triggered proactive generation without a newly reviewed purpose-specific contract.

## Phase 17 — Goals & Planning retained authority

The canonical fitness profile continues to own:

- `ProfileState.goalType`;
- `ProfileState.targetWeight`;
- `ProfileState.weeklyWeightChangeGoal`;
- `ProfileState.trainingDaysPerWeek`.

P17-A through P17-D remain closed. Existing goal facts, Goals → Companion handoff, goal-aware Ask Coach and guarded proposal preview all operate over that authority.

### P17-E threshold

Do not implement a richer persisted goal model by default. Revisit only when an approved requirement needs semantics the current profile cannot safely express, such as multiple independently versioned simultaneous goals, explicit deadlines/status or historical lifecycle records.

If that threshold is crossed, design identity/ownership, schema/migration, sync/revision/conflict, deletion/account-cleanup, privacy/export and migration authority before implementation.

## Phase 18 — Knowledge & Learning delivered authority

Reviewed product loop:

`bounded user evidence → deterministic Coach finding → allowlisted content mapping → canonical article → validated quiz → informational learning state`

Merged Phase 18 now provides:

- canonical concepts/articles with immutable localized versions;
- reviewed evidence/source linkage and deterministic publication eligibility;
- provider-neutral editorial preparation where model output alone cannot publish;
- authenticated Knowledge Library / Reader UX;
- exact-version reviewed quiz authority with hidden answer keys backend-only;
- private account-owned `unseen | read | understood | refresh_useful` learning state outside revisioned fitness AppState sync;
- deterministic Coach → Learn selection over strict normalized findings and versioned mapping rules;
- deterministic trustworthy backend finding provenance from persisted Combined Coach runs;
- immutable reviewed learning paths with exact article-version steps;
- optional mobile Coach Learn cards that open the exact recommended article version;
- failure isolation so optional Knowledge recommendation failure cannot invalidate an otherwise valid Coach run.

### Permanent Phase 18 rules

- no Knowledge XP, levels, streaks, badges, leaderboards, punishment, reward currency or daily-pressure loops;
- canonical educational content is prepared and reviewed ahead of use;
- model/provider output alone is never publication authority;
- every material factual claim remains tied to reviewed source evidence;
- published article versions remain immutable evidence boundaries;
- quizzes bind to exact article versions and reviewed claims;
- Tier-3 Labs/medical-adjacent educational content requires human review and remains non-diagnostic and non-prescriptive;
- canonical Knowledge content never contains private account evidence;
- raw Labs documents and unconfirmed extraction drafts remain outside ordinary Knowledge generation/recommendation context;
- reading or quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety;
- free-form/model prose is never Coach → Learn selection authority.

### P18-G content activation boundary

The runtime host and selector are merged, but the reviewed production mapping registry is intentionally empty because no approved canonical `findingCode → articleId` mappings exist in the repositories.

Therefore:

- no Learn card is expected when no reviewed rule exists;
- runtime code must not invent article IDs, mappings or provider-selected fallback lessons;
- adding a real mapping is a separate editorial/product-authority action and must reference an approved canonical article;
- publication eligibility, exact-version selection, learning-state suppression and risk-tier checks remain mandatory once mappings are added.

This is a deliberate fail-closed content boundary, not unfinished P18 runtime infrastructure.

## Phase 14 — external evidence backlog

### P14-A Push

Source/CI complete. Remaining work requires staging-only APNs/FCM material and signed physical-device evidence for permission, token, delivery, tap/deep-link, account/device isolation and offline/reconnect behavior.

### P14-B Labs / Analyses

Source/CI and bounded staging tooling are complete. Remaining work requires a staging-only HTTPS S3-compatible private storage namespace, staging-only Gemini material, one bounded synthetic configured-provider lifecycle and physical-device PDF/photo picker/accessibility evidence.

Do not weaken the HTTPS storage boundary or confirmation gate to bypass missing prerequisites.

### P14-C Stories

Source/CI plus bounded backend staging account/auth/lifecycle evidence are complete. Remaining work is mobile/physical-device/runtime evidence unless a concrete defect or newly reviewed contract is demonstrated.

### P14-D Steps

Source/CI includes reviewed read-only HealthKit and Health Connect adapters and Home consumption. Remaining work is signed native/physical-device evidence for support detection, user-initiated permissions, aggregate reads, unsupported/no-data states, local-day/DST behavior and Home presentation.

## Admin v5-v12 source-ready boundary

Backend PR #305 remains read-only and preserves the browser → Next.js BFF → backend boundary. It adds Product Analytics, Operations Center, count-only account support, server-side User Directory activity filters, Catalog & Cache operations, Social governance, Security & Access and Delivery/Notifications/Sync diagnostics.

The source package is exact-head validated and its Vercel preview is green. Do not merge #305 solely because source validation is complete: merge to backend `main` triggers the configured Peptonio Admin production deployment and therefore requires separate explicit production authorization.

## Liquid Glass closure contract

The reviewed source convergence remains complete. Reopen only if a reachable screen demonstrates a partial/legacy material owner, a future refactor turns a retained divider into a card/control/material owner, or a newly reviewed UI contract expands intended scope.

Detailed inventory: `docs/architecture/liquid-glass-residual-inventory.md`.

## Current execution order

1. Keep backend Admin #305 source-ready and unmerged until separate explicit production authorization is given.
2. Treat P18-A through P18-H as closed for the reviewed source/CI scope; reopen only for a reproduced defect or newly reviewed requirement.
3. Do not invent P18-I solely to continue Phase 18 work.
4. If product/editorial work supplies reviewed canonical articles and approved `findingCode → articleId` mappings, add those rules as a separately reviewed P18-G content-activation change and validate exact-version behavior end to end.
5. Keep P17-E inactive until a richer-goal requirement actually crosses its documented threshold.
6. Keep Phases 15 and 16 closed unless a reproduced defect, failed invariant or newly reviewed purpose requires reopening them.
7. Execute Phase 14 provider/device evidence whenever external prerequisites become available; it remains independent of closed Phase 18 source work.
8. If normal use or evidence reproduces a defect, repair it as one coherent bounded package and validate exact head.
9. Keep `docs/current-status.md`, `docs/handoffs/latest.md`, `ROADMAP_PROGRESS.md`, `docs/project-context.md`, `PROJECT_LEARNINGS.md`, `docs/roadmap/knowledge-learning.md` and this plan synchronized with verified Git/evidence.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend source/operations changes require the applicable Backend CI, Backend PostgreSQL CI and account-lifecycle gates for their scope.

Source-contract failures must be distinguished from runtime/type failures. When a reviewed migration intentionally changes a source invariant, update the stale contract rather than reverting valid runtime code; behavioral/accessibility/compatibility invariants remain protected.

Phase 18 publication/model pipelines additionally require strict schema parsing, source/claim traceability, review-state enforcement, quiz answer-key uniqueness and private/shared data separation. Model plausibility is not a publication test.

Documentation-only synchronization must never claim provider, physical-device, editorial publication or production evidence that did not run.

## Activation boundary

Provider configuration, native/device execution and rollout remain governed by repository authorization, least privilege, privacy, preflight, evidence, recovery and rollback controls in `AGENTS.md` and focused operational docs.

Backend `main` is known to participate in the configured Peptonio Admin production deployment path. Merging backend Admin #305 is therefore production-affecting and remains outside ordinary autonomous source merge authority until explicitly authorized.

Source merge, deployment, provider/content activation, canonical publication, OTA/native release and physical-device validation remain separate claims.

## Reference surfaces

- current checkpoint: `docs/current-status.md`;
- detailed architecture/context: `docs/project-context.md`;
- latest handoff: `docs/handoffs/latest.md`;
- Phase 18 roadmap: `docs/roadmap/knowledge-learning.md`;
- progress ledger: `ROADMAP_PROGRESS.md`;
- accumulated operational lessons: `PROJECT_LEARNINGS.md`.