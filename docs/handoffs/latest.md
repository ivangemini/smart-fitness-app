# Latest Handoff

Updated: 2026-08-19

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified runtime `main`: `b2531e2122d6d7357129c76c48554b3a915d2e6c` (#783); documentation checkpoint #784 follows without runtime changes.

Phase 15 remains source/CI-complete for its reviewed Coach Intelligence + Progress scope. Phase 16 foreground v1 remains source/CI-complete through #770–#772.

The first reviewed Phase 17 Goals & Planning scope is source/CI-complete:

- #773 — canonical fitness-profile goal authority, deterministic typed goal facts and neutral Progress Goals context;
- #776 — selector-only Goals → Companion handoff with canonical fact rebuilding at the destination;
- #777 — authenticated read-only Ask Coach UI, strict response parsing, capability-aware availability and mobile Coach capabilities compatibility through v13;
- #781 — typed ephemeral goal proposal preview with exact source snapshot and guarded `applied | stale` canonical update;
- #783 — inline Liquid Glass proposal review with edit invalidation while retaining the #781 atomic stale-source guard.

#783 exact-head `98aece0b5a44b97988797db2fedd04529bf302df` passed Mobile CI run `32245117299` / 2641: line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Focused closure evidence: `docs/qa/phase17-goals-planning-closure.md`.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified `main`: `eebca930893f3b2a5bcc4e2293873695d1bbb3c6` (#271).

The reviewed read-only question path consists of:

- #266 minimal-scope structured router;
- #267 minimized evidence + strict structured answer boundary;
- #269 authenticated `POST /v1/coach/questions` composition;
- #270 confirmed structured Labs overview/marker-history evidence;
- #271 dedicated bounded `goal_progress` scope and capabilities v13.

#271 passed exact-head Backend CI including lint, Prettier, build, production-configuration validation, isolated staging topology validation and full tests.

## Phase 18 is active

The next approved product phase is **Phase 18 — Knowledge & Learning System**.

The product goal is to teach the user why training/nutrition/recovery decisions work, connect those lessons to real Coach findings and verify understanding with controlled article-linked quizzes.

The architecture is deliberately non-gamified. Do not add educational XP, levels, streaks, badges, leaderboards, competition or punishment mechanics.

Reviewed pipeline:

`topic → curated evidence pack → AI-assisted draft → claim/source verification → validated quiz bank → reviewed published article version`

Reviewed user loop:

`bounded evidence → deterministic Coach finding → allowlisted article mapping → article → quiz → minimal learning state`

Canonical factual articles are not generated live per user. AI may personalize the explanation of why an already-published article is relevant, but must not rewrite its scientific factual core from private user data.

Focused architecture: `docs/architecture/phase18-knowledge-learning-system.md`.
Focused roadmap: `docs/roadmap/knowledge-learning.md`.

## P18-A current work

P18-A is the current autonomous source priority.

Backend branch started from exact #271 `main`:

`codex/phase18-knowledge-foundation-2026-08-19`

Initial foundation scope:

- versioned Zod contracts for concepts, article versions, sources, claims and quiz items;
- strict four-option/one-answer quiz structure;
- risk/review metadata;
- deterministic publication eligibility that fails closed for unapproved claims, missing/unallowlisted evidence and Tier-3 material without human review;
- no database migration, route, provider/model call or publication action until the domain contract is validated.

The next P18-A step after contract CI is to define the minimum relational persistence/read API shape and privacy/export ownership before adding tables.

## Contracts to preserve

- Coach and Companion are one product surface, not separate assistants.
- Deterministic calculations and hard guardrails stay outside model prompts.
- Model-visible retrieval is purpose-specific, user-scoped and bounded.
- Navigation handoffs carry selectors/anchors, never raw private state or prebuilt broad analytics.
- Generic Ask Coach sends question text only; backend routing determines the minimum approved user-data scope before retrieval.
- Goal-only backend evidence uses the existing fitness profile, bounded weight history and recent completed sessions; it does not read food logs/workout sets or expose notes/session payloads.
- Backend goal training-day evidence v1 is UTC-day-bucketed; do not claim local-calendar parity until server-side timezone authority exists.
- Proactive foreground presentation remains frequency-capped, dismissible and non-punitive.
- Canonical goal ownership remains the existing fitness profile; do not add a second goal store for the closed first scope.
- Goal proposals are ephemeral until explicit confirmation and must fail closed when their captured source snapshot is stale.
- Editing the goal form after review invalidates the current proposal preview; Apply always uses a freshly reviewed captured source snapshot.
- Applying a goal proposal changes only the four canonical goal fields; nutrition targets, programs, workouts, Labs, recovery and safety remain separate application domains.
- Automatic mutation outside separately reviewed explicit confirmation flows remains prohibited.
- Labs drafts/raw documents stay outside ordinary Coach question context.
- Missing RPE, nutrition, recovery, body, goal and Labs evidence stays missing rather than being inferred.
- Knowledge articles/claims/sources/quizzes are shared canonical content and must never contain private user evidence.
- Knowledge publication is evidence/review gated; model output alone is never publication authority.
- Quiz answer keys are article-version/claim-linked and fail closed when ambiguous.
- Tier-3 medical-adjacent educational content requires human review and never grants diagnosis or prescribing authority.
- No Knowledge gamification.

Source/CI closure is not provider, signed-device, rollout or production-model evidence.

## Next execution order

1. Continue P18-A contracts/publication gate to exact-head Backend CI, then design minimum relational persistence/read API and privacy/export ownership.
2. Synchronize the Phase 18 canonical docs in the documentation workstream and merge them independently when clean.
3. After P18-A foundation is validated, proceed to P18-B editorial generation pipeline and P18-C Library/reader without bypassing evidence/publication gates.
4. Keep P17-E richer goal persistence/model-planning dormant unless a reviewed requirement crosses its threshold.
5. Keep Phase 15 and reviewed Phase 16 foreground v1 closed unless a reproduced defect or newly reviewed purpose warrants expansion.
6. Execute remaining Phase 14 external evidence when prerequisites are available.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.