# Phase 18 — Knowledge & Learning System Architecture

Updated: 2026-08-19

## Purpose

Phase 18 turns Smart Fitness into a product that not only recommends actions but teaches the user the underlying training, nutrition, physiology, recovery, body-composition and Labs concepts in a controlled, evidence-linked way.

This is an educational system, not an engagement game. No XP, levels, streaks, badges, leaderboards, reward loops or punitive knowledge mechanics are part of the reviewed scope.

## Product loop

The reviewed end-state loop is:

`bounded user evidence → deterministic Coach finding → approved knowledge recommendation → canonical article → validated quiz → learning state → future Coach personalization`

The system may later note that a previously observed pattern changed after learning, but must not claim causality from article reading alone.

## Canonical content authority

Scientific and educational facts are not generated from scratch on every user request.

Canonical educational content is versioned and published ahead of user consumption. The publishing pipeline is AI-assisted but evidence-grounded:

`topic → curated evidence pack → AI draft → claim extraction → claim/source verification → quiz generation → quiz validation → review state → publish`

Published article versions are immutable. Updating factual content creates a new article version rather than silently rewriting the version a user previously read.

## Core content model

The reviewed conceptual entities are:

- `KnowledgeConcept` — stable concept identity such as `rir`, `training_volume`, `fiber_basics` or `protein_distribution`;
- `KnowledgeArticle` — stable article identity and category/slug metadata;
- `KnowledgeArticleVersion` — immutable published content version plus difficulty/depth metadata;
- `KnowledgeSource` — allowlisted bibliographic/source metadata;
- `KnowledgeClaim` — bounded factual claim in an article version with evidence-strength/review metadata;
- `KnowledgeClaimSource` — explicit support relationship between a claim and one or more sources;
- `KnowledgeQuizItem` — versioned, pre-generated question tied to one or more claims/concepts;
- `KnowledgeRecommendationRule` — deterministic mapping from an approved Coach finding to one or more concepts/articles;
- `UserLearningState` — minimal account-scoped progress over published article/concept versions.

Do not use one unstructured JSON document as the only persistence shape for core queryable ownership/versioning fields.

## Article formats

The content model may support presentation variants without changing the factual source of truth:

- quick lesson — one concept, typically 2–4 minutes;
- standard article — practical explanation with evidence boundaries;
- deep dive — longer evidence/context view;
- practical guide — application-oriented material;
- reference — compact factual lookup.

A single concept may have multiple article versions or presentation depths, but factual claims remain evidence-linked.

## Article generation rules

AI may generate or revise drafts only from an approved evidence pack and explicit editorial instructions.

The generation layer must not:

- browse or import arbitrary sources directly into a published article without an allowlisted source-ingestion/review step;
- create diagnosis, prescribing, medication/supplement dosing or hormone/SARM protocols;
- convert uncertain evidence into a stronger claim;
- fabricate citations, study results, mechanisms or consensus;
- personalize canonical factual claims from private user data.

Every material factual claim must be traceable to one or more reviewed source records or be rejected from publication.

## Evidence and claim review

Each claim has an explicit review state and evidence linkage. A verifier may use a separate model, deterministic checks or human review, but publication fails closed when support is missing or ambiguous.

Suggested risk tiers:

- Tier 1 — low-risk fitness education, eligible for automated evidence/quiz validation before editorial publication;
- Tier 2 — nutrition, supplements, recovery and body-composition topics, requiring stronger evidence review;
- Tier 3 — Labs/medical-adjacent physiology, requiring human editorial approval before publication.

Risk tier never grants diagnosis or treatment authority.

## Quiz generation and validation

Quizzes are not generated ad hoc after every read. A bank of questions is generated and validated for a specific article version before publication.

Every quiz item must:

- map to at least one canonical concept/claim;
- contain exactly one defensible answer for single-select v1;
- provide bounded explanation/feedback grounded in the same article/source claims;
- avoid questions whose answer depends on facts not present in the reviewed material;
- fail closed when two answers are defensible or the key cannot be proven;
- preserve article-version identity so later content revisions do not rewrite historical learning evidence.

The reviewed v1 question families may include recall, understanding, application and misconception checks. Open-ended/model-graded examinations are outside v1.

## Learning state — no gamification

Learning state is informational, not a reward system.

Initial states may be represented as:

- `unseen`;
- `read`;
- `understood`;
- `refresh_useful`.

Do not expose points, levels, XP, streaks, competitive ranks or loss mechanics.

A read event alone must not imply mastery. `understood` requires reviewed quiz evidence or an equivalent future reviewed verification contract.

## Coach → Learn recommendation boundary

The Coach must not choose educational content by unconstrained free-form generation.

Preferred flow:

`deterministic finding code → allowlisted recommendation mapping → article/concept selector → personalized explanation`

Example:

- `nutrition_low_fiber` → `fiber_basics`, optionally `increasing_fiber`;
- `training_high_failure_frequency` → `rir_basics`, `training_to_failure`, optionally `fatigue_management`.

The model may explain why an approved article is relevant to the user’s bounded evidence. It does not invent a new scientific lesson or bypass the mapping/review boundary.

## Daily-report integration

A daily Coach report may attach a knowledge recommendation only when:

1. the underlying finding is already valid under the Coach evidence contract;
2. a published article/concept mapping exists;
3. the recommendation is educational rather than punitive;
4. recommendation frequency/deduplication is bounded;
5. the report does not claim that reading the material is medically necessary.

## User-data isolation

Canonical article text, claims, sources and quiz items are shared educational content and must not contain private user data.

Private user data may be used only in bounded recommendation/context layers, for example:

- why the article is relevant now;
- which reviewed concept is most relevant;
- what depth of explanation is appropriate;
- whether a previously read concept may benefit from refresh.

Do not write private user evidence into shared article/source records.

## Content freshness and versioning

Content must expose stable article identity plus explicit version. A source/evidence update that changes material claims produces a new draft and eventually a new published version.

User learning history records the exact article/quiz version seen. A prior `understood` state must not automatically certify a materially revised article version.

## Editorial/admin boundary

The reviewed architecture anticipates an internal editorial workflow for:

- source/evidence-pack management;
- draft generation/regeneration;
- claim review;
- quiz review;
- risk-tier review state;
- preview;
- publish/deprecate/version actions.

The end-user mobile app is not an article authoring or publication authority.

## Phase decomposition

### P18-A — Knowledge/content/evidence foundation

Define versioned contracts, ownership, publication states, evidence linkage and the minimum persistence/API boundary. No model provider activation is required.

### P18-B — Editorial generation pipeline

Evidence pack → draft → claims → verification → review-ready state. Provider-neutral and fail closed.

### P18-C — Library and reader

Mobile browse/search/article detail, source visibility, depth metadata and stable article-version parsing.

### P18-D — Quiz bank and validation

Pre-generated versioned quiz items, strict validators, answer feedback and article-version linkage.

### P18-E — Learning state

Account-scoped `unseen/read/understood/refresh_useful` state. No points, levels, streaks or badges.

### P18-F — Coach → Learn recommendation engine

Deterministic finding-to-content mapping with bounded personalized relevance explanation.

### P18-G — Daily-report integration

Attach reviewed learning recommendations to applicable Coach reports and allow later refresh prompts without guilt or compulsion.

### P18-H — Learning paths / curriculum

Optional ordered concept paths after the underlying content, quiz and learning-state systems are proven. Paths are curriculum navigation, not progression rewards.

## Explicitly out of scope for the reviewed first phase

- gamification, XP, streaks, badges, leaderboards or competitive learning;
- unreviewed public/community article creation;
- arbitrary live web generation of scientific articles for end users;
- model-generated answer keys without validation;
- diagnosis, emergency triage, prescribing or medication/supplement dosing;
- automatic canonical workout/nutrition/goal/Labs mutation after reading;
- claiming that reading caused a later fitness/health outcome;
- using raw Labs documents as ordinary article-generation or recommendation context.

## Validation principle

The quality gate is not “the model produced plausible prose.” The system must prove versioning, claim/source traceability, publication state, strict quiz keys, private/shared-data separation and fail-closed behavior before content is treated as canonical or Coach-recommendable.
