# Knowledge & Learning Roadmap

Updated: 2026-08-21

This is the focused execution roadmap for Phase 18. Exact source, migrations, tests, CI and Git history override stale prose. The canonical cross-repository priority remains `docs/implementation-plan.md`.

## Current execution checkpoint

Phase 18 is complete for the reviewed source/CI scope.

- **P18-A — canonical Knowledge persistence/reader:** merged through backend #285.
- **P18-B — editorial orchestration:** merged through backend #290. Provider-neutral preparation only; it does not activate a provider or publish content.
- **P18-C — Library/reader:** merged through mobile #793.
- **P18-D — quiz authority:** merged through backend #294 with exact-version reviewed-bank preparation, hidden answer-key isolation and backend-only evaluation.
- **P18-E — learning state:** merged through backend #296 and mobile #794 with account ownership, exact-version evidence, backend-only quiz scoring, deletion/export/privacy and bounded mobile replay.
- **P18-F — Coach → Learn selector:** merged through backend #306. Deterministic/provider-neutral selection over strict normalized findings and reviewed versioned rules.
- **P18-G — Coach/report integration:** finding authority merged through backend #308, runtime Learn host through backend #309, optional mobile consumer through #797.
- **P18-H — curriculum/learning paths:** merged through backend #307 and mobile #795.

There is no approved P18-I. Do not manufacture another Phase 18 slice merely to keep work active.

## Product objective

Teach users how training, nutrition, physiology, recovery, body composition and selected Labs concepts work, then connect reviewed educational material to deterministic product findings only when an approved mapping exists.

This domain is educational and intentionally non-gamified.

Do not add Knowledge XP, levels, streaks, badges, leaderboards, competitive ranks, reward currency, punishment, loss mechanics or daily pressure loops.

## Permanent authority model

Reviewed editorial pipeline:

`topic → curated evidence pack → AI-assisted draft → claim/source verification → quiz validation/review → published immutable article version`

Reviewed user loop:

`bounded evidence → trustworthy typed deterministic finding → versioned allowlisted mapping → publication-eligible exact article version → reviewed quiz → informational learning state`

Permanent rules:

- canonical scientific/educational content is prepared and reviewed ahead of end-user consumption;
- model/provider output alone is never publication authority;
- every material factual claim remains linked to reviewed evidence sources;
- material factual changes create a new immutable article version;
- quizzes bind to exact article versions and reviewed claim identities;
- hidden correct-option keys remain backend-only;
- Tier-3 Labs/medical-adjacent content requires human review and remains educational, non-diagnostic and non-prescriptive;
- canonical shared Knowledge records never contain private account evidence;
- raw Labs documents/extraction drafts remain outside ordinary Knowledge generation/recommendation context;
- learning evidence is private account-owned state outside revisioned fitness `AppState` synchronization;
- reading/quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety;
- later fitness/health changes are not attributed causally to reading content;
- Coach → Learn article selection is deterministic over reviewed typed findings and reviewed mappings; free-form/model prose is never selection authority.

## P18-A — Knowledge/content/evidence foundation

Delivered stable concepts and article identity, immutable localized article versions, allowlisted evidence-source records, reviewed claim/source linkage, article risk tiers/review state, deterministic publication eligibility, relational persistence and authenticated published-reader API.

**Current state:** merged/stable through backend #285.

## P18-B — Editorial generation pipeline

Delivered provider-neutral orchestration for evidence-pack input, structured draft generation, extracted claims, independent verification, bounded retries, review-ready/rejected transitions and risk-tier-aware human review.

Generator/provider output cannot publish directly.

**Current state:** merged through backend #290. Operational provider/content activation remains separate.

## P18-C — Library and reader

Delivered Knowledge Library navigation, category/concept browsing, bounded search, strict versioned client parsing, immutable article Reader, reviewed source/evidence presentation and normal authenticated backend access.

**Current state:** merged through mobile #793.

## P18-D — Quiz bank and validation

Delivered exact-version reviewed single-select banks, four-option/one-answer structural authority, claim/version linkage, publication eligibility composition, opaque runtime bank preparation and backend-only canonical evaluation.

**Current state:** merged through backend #294.

## P18-E — Learning state

Informational states remain:

- `unseen`;
- `read`;
- `understood`;
- `refresh_useful`.

Backend #296 and mobile #794 establish dedicated private account-owned learning evidence outside revisioned fitness sync, exact-version list/get/read/quiz-evaluate authority, replay-safe `read`, monotonic `understood`, complete backend quiz evaluation, deterministic `refresh_useful`, stale/unavailable write rejection, deletion/export semantics and account-partitioned mobile replay.

**Current state:** merged through backend #296 and mobile #794.

## P18-F — Coach → Learn deterministic recommendation engine

Reviewed authority: `docs/architecture/phase18-coach-learn-recommendation-contract.md`.

Backend #306 delivers:

- strict versioned normalized finding, mapping-rule, selection-input and recommendation-output contracts;
- active/deprecated compatible mapping rules;
- stable canonical `articleId` targets instead of mutable title/route text;
- exact mapped identity hydration through canonical Knowledge repository logic;
- mandatory publication-eligibility re-evaluation;
- explicit article-version pins/ranges, locale and risk-tier constraints;
- deterministic finding priority → rule priority → learning relevance → stable identity ordering;
- exact article-version duplicate collapse;
- current exact `understood` suppression and lower relevance for current exact `read`;
- historical `refresh_useful` promotion of the exact newer current version;
- explicit exact-version cooldown and bounded delivery-window input;
- no model selection authority, scheduler, delivery table or cross-domain mutation.

Fail closed when finding/rule input is malformed, unknown, deprecated or version-incompatible; when article/version identity cannot be proven; when publication/risk/human-review eligibility fails; or when deterministic state is ambiguous.

**Current state:** merged through backend #306.

## P18-G — Coach/report surface integration

Reviewed authority: `docs/architecture/phase18-coach-learn-surface-integration.md`.

### Finding authority

Backend #308 projects existing persisted deterministic Combined Coach runs into strict typed finding identity.

The bridge accepts only exact persisted request/result/policy provenance and allowlisted issue code + exact domain/severity. Unknown/model-invented codes, stale policy versions, altered metadata, duplicates and local/mobile Proactive-insight-shaped objects fail closed.

**Current state:** merged through backend #308.

### Runtime host

Backend #309 attaches optional Learn projection to the existing persisted Coach run-detail surface without creating a second report/scheduler path.

The host:

- derives only #308-authorized findings;
- normalizes them to the #306 selector contract;
- uses P18-E learning-state suppression;
- returns `knowledge-recommendation-v1` only for a valid non-empty deterministic selection;
- preserves exact published article/version identity;
- fails open for the optional Knowledge projection so a valid Coach run remains usable.

**Current state:** merged through backend #309. Exact head `c4b4da92a926141ad3cea5e898c96177e1c2a49d` passed Backend CI #2243.

### Mobile consumer

Mobile #797 strictly parses the optional recommendation projection, fails open on malformed optional Learn data, renders reviewed article title/summary on persisted Coach run detail and opens the existing Reader with an exact expected article-version pin.

Finding codes are not exposed as user-facing copy and Coach confirmation/application flows are unchanged.

**Current state:** merged through mobile #797. Exact head `3d88b6b4f28349b6c11c5302e865e156b81c17d5` passed Mobile CI #2680.

### Reviewed mapping activation boundary

The runtime recommendation registry is intentionally empty because repository authority currently contains no approved canonical `findingCode → articleId` mappings.

Do not invent UUIDs, arbitrary articles or provider-selected fallback lessons merely to make recommendations appear.

When reviewed mappings are later supplied, they must still satisfy:

- stable canonical article identity;
- compatible finding-policy version;
- active reviewed mapping status;
- locale/risk/version constraints;
- current publication eligibility and Tier-3 human-review rules;
- P18-E learning-state semantics;
- exact-version cooldown/delivery policy.

This is a content/editorial activation gate, not missing P18-G runtime plumbing.

## P18-H — Curriculum / learning paths

Reviewed authority: `docs/architecture/phase18-learning-paths-contract.md`.

Backend #307 implements shared stable path identity, immutable localized versions, bounded ordered exact article-version steps, approved + human-reviewed publication boundary, authenticated read-only list/detail API and fail-closed stale/unavailable/non-publishable/Tier-3 handling.

Mobile #795 implements strict path list/detail parsing, ordinary Knowledge path navigation, exact-version Reader navigation, P18-E evidence-derived step decoration and bounded fallback hydration without a duplicate progress/mastery store.

**Current state:** merged through backend #307 and mobile #795.

## Phase 18 closure criteria

The reviewed A–H source program is closed because the following boundaries now exist in merged source:

- canonical reviewed content/evidence identity;
- publication gate;
- Reader;
- quiz authority;
- private exact-version learning evidence;
- deterministic recommendation selector;
- trustworthy deterministic Coach finding provenance;
- optional runtime/mobile Learn integration;
- reviewed curriculum paths;
- privacy/deletion/export semantics for account-owned learning state;
- no duplicate mastery store, gamification or hidden cross-domain mutation.

A missing reviewed production mapping registry does not reopen P18-G; it intentionally prevents content activation until product/editorial authority exists.

## Next execution order

1. Keep P18-A through P18-H closed unless a reproduced defect or newly reviewed requirement appears.
2. Do not invent P18-I.
3. If reviewed canonical content + finding mappings are approved, implement the mapping registry as a separate content-activation delta and run end-to-end exact-version recommendation validation.
4. Keep P17-E inactive without a richer-goal requirement.
5. Continue independent Phase 14 provider/native/device evidence when external prerequisites are available.

## Production / rollout boundary

Source/CI completion remains separate from deployment and activation.

Phase 18 source closure does not itself prove or authorize backend/admin production deployment, production migration execution, OTA/native publication, editorial provider activation, canonical content publication, medical review completion or physical-device validation.
