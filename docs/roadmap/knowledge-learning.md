# Knowledge & Learning Roadmap

Updated: 2026-08-19

This is the focused execution roadmap for Phase 18. The canonical cross-repository priority remains `docs/implementation-plan.md`; the architecture boundary is `docs/architecture/phase18-knowledge-learning-system.md`.

## Current execution checkpoint

Phase 18 is active and dependency-ordered.

- **P18-A contracts/publication gate:** merged in backend #272.
- **P18-A persistence + published reader:** backend #275 is open at exact head `e76ec127de1c297c7ebf6bb1a68bfbda99584cf1`. Account Deletion Receipt CI passed. Its first Backend PostgreSQL CI attempt proved migrations/idempotency/schema and preceding PostgreSQL suites before the self-hosted Hermes runner exhausted disk during later Social tests; the failed PostgreSQL job has been requeued and Backend CI is running. Backend #281 separately adds a bounded PostgreSQL-service tmpfs mitigation for that demonstrated runner-disk failure without reducing test coverage. Do not merge #275 until all required exact-head gates pass.
- **P18-B editorial orchestration:** backend #276 is prepared as a stacked branch and must be rebuilt/retargeted from exact backend `main` after #275 merges, with its known Prettier-only CI failure corrected before exact-head revalidation.
- **P18-C Library/reader:** mobile #786 is prepared and its previous exact head passed Mobile CI, but it depends on #275 and must be rebuilt/revalidated from exact current mobile `main` after the backend reader contract merges.
- **P18-D quiz bank:** a deterministic foundation was prepared as backend #279 on top of #276. #279 is currently closed/unmerged; rebuild/reopen or replace it only after P18-B is merged and stable. The rebuild must make presentation/evaluation consume a proven eligible exact-version bank so exported helpers cannot bypass Tier-3/review eligibility.
- **P18-E learning state:** the ownership/versioning/privacy/deletion/export/offline-replay contract is merged through #787 and the dedicated server-authoritative account-state + bounded mobile retry-queue authority decision is merged through #789. Persistence remains blocked until P18-A reader identities and P18-D quiz identities are merged/stable.
- **P18-F Coach → Learn:** architecture is reviewed in `docs/architecture/phase18-coach-learn-recommendation-contract.md`. Runtime remains blocked until P18-A, P18-D and enough of P18-E are merged/stable.
- **P18-G/H:** remain downstream of the canonical content, quiz, learning-state and recommendation boundaries below.

Immediate order: finish #275 exact-head CI (or land/rebuild through #281 if runner disk pressure recurs) → merge dependency-clean P18-A → rebuild/revalidate #276 and #786 in parallel → merge dependency-clean heads → rebuild hardened P18-D → implement P18-E under the reviewed authority contract → implement deterministic P18-F mapping/selector → continue report integration.

## Product objective

Teach users how training, nutrition, physiology, recovery, body composition and selected Labs concepts work, then connect those reviewed educational materials to real Coach findings.

This roadmap explicitly excludes gamification. Do not add knowledge XP, levels, streaks, badges, leaderboards, competitive ranks or punitive learning mechanics.

## P18-A — Knowledge/content/evidence foundation

Deliver:

- versioned concept/article/article-version contracts;
- allowlisted source records;
- claim/source traceability;
- content risk tiers and review states;
- versioned quiz-item contracts;
- deterministic publication eligibility;
- shared/private data-separation rules;
- minimum read API/persistence design after the domain contract is validated.

Acceptance:

- an article cannot be publishable with unapproved claims;
- every publishable claim references allowlisted evidence;
- a quiz item references the exact article version and reviewed claim(s);
- Tier-3 medical-adjacent material cannot publish without human review;
- no provider/model is required for the foundation to function;
- canonical article data contains no private user evidence.

**Current state:** contract/publication-gate foundation merged in backend #272. Relational persistence and the authenticated published-reader API are pending in backend #275 and remain exact-head CI gated; #281 addresses the demonstrated self-hosted PostgreSQL CI disk-pressure failure mode independently.

## P18-B — Editorial generation pipeline

Deliver:

- curated evidence-pack input contract;
- provider-neutral draft generation interface;
- claim extraction;
- independent claim verification;
- review-ready/rejected transitions;
- risk-tier-aware human-review requirement;
- generation/provenance metadata without chain-of-thought.

Acceptance:

- the generator cannot publish directly;
- unsupported claims fail closed;
- provider output is strict/versioned and never returned raw to mobile;
- retries are bounded;
- source identifiers are verified rather than fabricated by the model.

**Current state:** provider-neutral foundation prepared in backend #276, stacked behind #275. Its prior CI failure is formatting-only in three P18-B files. Rebuild/retarget from exact current `main` after #275 merges, apply exact Prettier output, and revalidate before merge.

## P18-C — Library and reader

Deliver:

- mobile Knowledge/Library destination;
- category/concept browsing;
- bounded search;
- article detail with quick/standard/deep/practical/reference presentation metadata;
- visible reviewed source list/evidence context;
- strict versioned API parsing;
- good offline/empty/error behavior where appropriate.

Acceptance:

- mobile never calls model/search providers directly;
- unpublished/deprecated/private editorial states do not appear in the end-user library;
- article version remains stable while reading;
- user-facing sources correspond to the canonical article version.

**Current state:** prepared in mobile #786. Previous exact head passed Mobile CI, but merge is intentionally blocked on backend #275 and a rebuild/revalidation from exact current mobile `main`.

## P18-D — Quiz bank and validation

Deliver:

- pre-generated single-select question bank v1;
- recall/understanding/application/misconception categories;
- strict four-option/one-answer validation;
- claim/article-version linkage;
- bounded explanations for all options;
- article-specific quiz assembly.

Acceptance:

- no live arbitrary quiz generation is required for reading;
- questions with ambiguous answer keys cannot publish;
- each question is provably supported by reviewed article claims;
- presentation/evaluation cannot bypass the exact-version bank eligibility/Tier-3 human-review gate;
- updating an article does not silently rewrite historical quiz evidence.

**Current state:** deterministic foundation was prepared as backend #279 on top of #276. #279 is closed/unmerged and must be rebuilt from the merged P18-B baseline before it can become mergeable roadmap progress. The rebuild must harden the service/public-helper boundary so bank eligibility is a proven prerequisite of presentation and answer evaluation.

## P18-E — Learning state

Deliver minimal account-scoped informational state:

- `unseen`;
- `read`;
- `understood`;
- `refresh_useful`.

Acceptance:

- reading alone never marks `understood`;
- quiz evidence references exact article/question versions;
- account deletion/export/privacy behavior is explicit before persistence ships;
- no scores are converted into XP, levels, streaks or engagement rewards.

The reviewed semantic/privacy contract is `docs/architecture/phase18-learning-state-contract.md` (#787). The chosen implementation authority is `docs/architecture/phase18-learning-state-authority.md` (#789): learning state is a dedicated server-authoritative private account domain with a focused bounded mobile offline retry queue, not another entity in revisioned fitness `AppState` sync. Positive evidence is keyed to exact article/article-version identities; hidden answer keys remain backend-controlled; the persistence package must include authenticated ownership, retry/replay, stale/deprecated handling, two-device behavior, deletion, export/privacy and account-switch/logout cleanup rather than deferring those responsibilities.

**Current state:** architecture-approved; persistence intentionally not started until P18-A reader identities and P18-D quiz identities are merged/stable.

## P18-F — Coach → Learn recommendation engine

Deliver:

- deterministic Coach finding codes eligible for education;
- versioned allowlisted finding → concept/article mapping;
- publication-eligible exact-version resolution;
- deterministic ranking/deduplication/suppression rules;
- bounded personalized relevance explanation;
- links back to inspectable Coach evidence when useful.

Acceptance:

- the model cannot recommend arbitrary or unpublished content;
- recommendation requires an already-valid typed finding, compatible active mapping and currently publication-eligible canonical article/version;
- unknown/deprecated/model-invented finding codes fail closed to no recommendation;
- learning state may suppress or permit a bounded revisit but cannot be model-overridden;
- the same article/version is deduplicated and repeated prompting is frequency-bounded without guilt/reward mechanics;
- Tier-3/Labs-adjacent recommendations preserve the canonical human-review and structured-evidence boundary;
- no diagnosis/prescribing inference or automatic cross-domain mutation is introduced.

The reviewed authority is `docs/architecture/phase18-coach-learn-recommendation-contract.md`. The model may provide an optional bounded explanation only after deterministic selection; selection, publication, risk tier, learning state and canonical content remain non-model authority.

**Current state:** architecture-approved; runtime implementation intentionally waits for stable P18-A reader identity, hardened P18-D quiz identity/evaluation and enough P18-E account state to implement deterministic suppression/revisit semantics.

## P18-G — Daily-report integration

Deliver optional educational recommendations inside applicable Coach daily/periodic reports.

Acceptance:

- reports remain useful when no article is recommended;
- education is phrased as optional context, not punishment or medical necessity;
- no automatic fitness/nutrition/goal/Labs mutation follows reading or quiz completion;
- future behavior changes are not attributed causally to the educational intervention.

## P18-H — Curriculum / learning paths

Only after P18-A–G are stable, compose reviewed concept sequences such as:

- Training fundamentals;
- Nutrition fundamentals;
- Build your first program;
- Fat-loss fundamentals;
- Muscle-gain fundamentals;
- Recovery fundamentals;
- Understanding Labs.

Paths are curriculum/navigation, not gamified progression.

## Content-generation operating model

Canonical content is generated ahead of use:

`topic → evidence pack → AI draft → claims → evidence verification → quiz bank → validation/review → published version`

Dynamic model use for an end user is limited to reviewed personalization such as explaining why a canonical article is relevant now. It must not rewrite the factual core from private user data.

## Source policy direction

The editorial source policy should prefer higher-level evidence when appropriate: systematic reviews, meta-analyses, consensus/position documents and high-quality primary studies. Exact source allowlisting/review criteria belong in the backend editorial contract; this roadmap does not authorize arbitrary web ingestion.

## Medical-adjacent boundary

Labs and medical-adjacent physiology remain educational only. The system may explain what a marker represents and the limitations of interpretation using reviewed sources. It does not diagnose, prescribe, recommend medication/supplement dosing or reinterpret raw private documents through the learning library.

## Validation / rollout boundary

Source/CI completion for Phase 18 does not imply:

- editorial provider activation;
- content quality approval for every topic;
- publication of generated drafts;
- production rollout;
- medical review completion;
- device evidence.

Each claim is tracked separately.