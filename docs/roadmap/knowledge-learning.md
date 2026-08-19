# Knowledge & Learning Roadmap

Updated: 2026-08-19

This is the focused execution roadmap for Phase 18. The canonical cross-repository priority remains `docs/implementation-plan.md`; the architecture boundary is `docs/architecture/phase18-knowledge-learning-system.md`.

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
- updating an article does not silently rewrite historical quiz evidence.

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

## P18-F — Coach → Learn recommendation engine

Deliver:

- deterministic Coach finding codes eligible for education;
- allowlisted finding → concept/article mapping;
- ranking/deduplication rules;
- bounded personalized relevance explanation;
- links back to inspectable Coach evidence when useful.

Acceptance:

- the model cannot recommend arbitrary unpublished content;
- recommendation requires an already-valid finding and published mapping;
- no diagnosis/prescribing inference is introduced;
- the same finding is frequency-capped to avoid repetitive prompting.

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
