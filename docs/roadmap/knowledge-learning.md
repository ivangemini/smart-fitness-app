# Knowledge & Learning Roadmap

Updated: 2026-08-20

This is the focused execution roadmap for Phase 18. The canonical cross-repository priority remains `docs/implementation-plan.md`; exact source, migrations, tests, CI and Git history override stale prose.

## Current execution checkpoint

Phase 18 is active and dependency-ordered.

- **P18-A — canonical Knowledge persistence/reader:** merged and stable for the reviewed source boundary through backend #285.
- **P18-B — editorial orchestration:** merged through backend #290. Provider-neutral preparation only; it does not activate a provider or publish content.
- **P18-C — Library/reader:** merged through mobile #793.
- **P18-D — quiz authority:** merged through backend #294 with exact-version eligible-bank preparation, hidden answer-key isolation and backend-only evaluation.
- **P18-E — learning state:** active in backend #296 + mobile #794. Runtime exists on both PR branches and is under final exact-head validation. It includes ownership, deletion/export/privacy, replay/offline and account-isolation behavior rather than deferring those obligations.
- **P18-F — Coach → Learn selector:** architecture is reviewed. Runtime starts only after P18-E is merged/stable and must begin as a strict deterministic selector boundary; there is currently no trustworthy backend finding-code authority to attach under P18-G.
- **P18-G — Coach/report integration:** architecture is reviewed but host integration remains blocked until P18-F exists and a trustworthy typed backend finding identity is available. Local mobile Proactive Coach kinds are not backend finding codes.
- **P18-H — curriculum/learning paths:** architecture is reviewed. Runtime may begin after stable P18-E because it depends on the canonical reader/quiz/learning-state layers, not on P18-G host integration.

Immediate source order:

1. finish exact-head validation for backend #296 and mobile #794;
2. repair only demonstrated failures and keep both branches dependency-clean;
3. establish P18-E source readiness without bypassing CI;
4. merge/advance only within the active production-activation authorization boundary;
5. after P18-E is merged/stable, start P18-F from exact backend `main` and P18-H from exact current backend/mobile `main` as independent workstreams where their files/contracts do not overlap;
6. keep P18-G host integration blocked until trustworthy typed finding provenance exists.

## Product objective

Teach users how training, nutrition, physiology, recovery, body composition and selected Labs concepts work, then connect reviewed educational material to deterministic product findings when an approved mapping exists.

This domain is educational and intentionally non-gamified.

Do not add Knowledge XP, levels, streaks, badges, leaderboards, competitive ranks, reward currency, punishment, loss mechanics or daily pressure loops.

## Permanent authority model

Reviewed editorial pipeline:

`topic → curated evidence pack → AI-assisted draft → claim/source verification → quiz validation/review → published immutable article version`

Reviewed future user loop:

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
- user learning evidence is private account-owned state outside revisioned fitness `AppState` synchronization;
- reading/quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety;
- later fitness/health changes are not attributed causally to reading content.

## P18-A — Knowledge/content/evidence foundation

Delivered:

- stable concepts and article identity;
- immutable localized article versions;
- allowlisted evidence-source records;
- reviewed claim/source linkage;
- article risk tiers/review state;
- exact-version quiz identities;
- deterministic publication eligibility;
- relational persistence and migration;
- authenticated publication-eligible reader API;
- shared-content/private-user-data separation.

Acceptance remains:

- no publishable article with unapproved/unsupported claims;
- every material claim is evidence-linked;
- Tier-3 content fails closed without required human review;
- reader projections omit editorial/provider authority fields and hidden answer keys;
- no provider/model is required for canonical reading.

**Current state:** merged/stable for reviewed source scope through backend #285.

## P18-B — Editorial generation pipeline

Delivered provider-neutral orchestration for:

- evidence-pack input;
- structured draft generation;
- extracted claims;
- independent verification;
- bounded retries;
- review-ready/rejected transitions;
- risk-tier-aware human review;
- provenance without persisted chain-of-thought.

Permanent boundary:

- generator cannot publish directly;
- provider output cannot override evidence/review/risk authority;
- no provider activation is implied by source support.

**Current state:** merged through backend #290. Operational provider/content activation remains separate.

## P18-C — Library and reader

Delivered:

- Knowledge Library destination;
- category/concept browsing and bounded search;
- strict versioned client parsing;
- immutable article reader;
- reviewed evidence/source presentation;
- bounded Markdown rendering;
- EN/RU copy;
- normal authenticated backend access without direct provider calls.

**Current state:** merged through mobile #793.

## P18-D — Quiz bank and validation

Delivered:

- reviewed pre-generated single-select bank;
- exact four-option/one-answer structural authority;
- recall/understanding/application/misconception categories;
- exact article-version and claim linkage;
- full publication eligibility composition;
- opaque eligible-bank runtime boundary;
- presentation-safe question/options DTOs;
- server-only correct-option and feedback snapshots;
- backend evaluation helpers that reject forged/unapproved banks.

**Current state:** merged through backend #294.

## P18-E — Learning state

Reviewed informational states:

- `unseen`;
- `read`;
- `understood`;
- `refresh_useful`.

### Backend deliverables

Backend #296 implements:

- dedicated account-owned `knowledge_learning_states` persistence outside revisioned fitness sync;
- exact-version authenticated list/get/read/quiz-evaluate routes;
- replay-safe `read` and monotonic `understood` evidence;
- complete canonical quiz evaluation before `understood` may be persisted;
- current version lookup by exact stable `articleId + locale`;
- deterministic `refresh_useful` only when a newer publication-eligible version exists;
- fail-closed stale/unavailable writes;
- account deletion cascade;
- privacy inventory;
- subject-access export v2 retaining exact historical evidence and separately reporting current state/latest-version refresh metadata;
- repeatable-read snapshot consistency for export state derivation;
- migration/replay/deletion/regression coverage.

### Mobile deliverables

Mobile #794 implements:

- strict `knowledge-learning-state-v1` contracts and parsers;
- account-partitioned tokenless cache;
- bounded pending-read queue with duplicate compaction and retry ceiling;
- no optimistic canonical completion;
- backend-only quiz scoring;
- exact user/article-version guards for async work;
- account-bound token refresh preventing stale API instances from acting on another signed-in account;
- quiz interaction only after server-confirmed read evidence for the exact currently available version;
- no queued/offline quiz scoring;
- recovery-safe deletion of the account's local Knowledge cache and pending reads on confirmed account deletion;
- Reader state/quiz UI with EN/RU copy.

Acceptance:

- reading alone never marks `understood`;
- queued transport is distinguishable from server-confirmed state;
- stale/historical versions never inherit completion onto a newer version;
- hidden answer keys never reach mobile;
- account switch cannot cross-display or cross-deliver learning activity;
- account deletion removes server and local account-owned evidence while shared canonical content remains;
- subject-access export preserves exact historical version identity;
- no gamification or cross-domain mutation.

**Current state:** active in backend #296 + mobile #794. Final exact-head CI is required. Mobile merge remains dependent on stable merged backend P18-E.

## P18-F — Coach → Learn deterministic recommendation engine

Reviewed authority: `docs/architecture/phase18-coach-learn-recommendation-contract.md`.

First runtime package after stable P18-E should be deliberately host-independent and provider-neutral.

Deliver:

- strict versioned typed finding input contract;
- strict versioned mapping/recommendation contracts;
- active/deprecated compatible mapping rules;
- mapping target by stable canonical `articleId` rather than slug/title;
- exact `articleId + locale` current candidate resolution through canonical Knowledge repository logic;
- mandatory re-evaluation of publication eligibility;
- explicit permitted risk-tier policy;
- deterministic ranking/tie-break and exact-version duplicate collapse;
- P18-E-aware suppression/revisit behavior;
- explicit frequency/cooldown input rather than hidden timing;
- bounded result limit;
- no model dependency for selection.

Initial learning-state policy:

- current exact `understood` → suppress ordinary repeat recommendation;
- current exact `read` → eligible only at lower relevance than unseen/refresh candidates under the reviewed rule;
- historical state whose deterministic current projection is `refresh_useful` may permit the newer exact version;
- exact current completion always wins over an older historical refresh marker;
- delivery history for the same exact article version inside the rule cooldown suppresses repeat delivery;
- publishing a genuinely newer exact article version is not suppressed merely by delivery of the old version.

Fail closed when:

- finding code is unknown;
- finding-policy version is incompatible;
- mapping is inactive/deprecated;
- model/free-form text invents a finding identity;
- article identity cannot resolve exactly;
- exact version pin mismatches;
- publication eligibility fails;
- Tier-3 policy/human-review requirements fail.

No real production finding registry should be invented merely to make P18-F appear attached. Current backend source has no reviewed stable `findingCode` authority. Implement the reusable selector boundary first; P18-G supplies trustworthy host provenance later.

**Current state:** architecture-approved and implementation design prepared; runtime waits for merged/stable P18-E and must start from exact current backend `main`.

## P18-G — Coach/report surface integration

Reviewed authority: `docs/architecture/phase18-coach-learn-surface-integration.md`.

Deliver optional educational attachment to an already-authoritative Coach/report surface only when P18-F returns an approved exact recommendation.

Acceptance:

- host remains valid/useful without Knowledge;
- only exact P18-F-approved article/version renders;
- education is optional context, not punishment/necessity;
- host cooldown cannot be bypassed through a second unsolicited Knowledge card;
- local mobile Proactive Coach insight kinds are not trusted backend finding codes;
- navigation preserves exact canonical article/version identity;
- open/impression alone does not imply `read` or `understood`;
- no automatic fitness/nutrition/goal/Labs mutation.

**Current state:** architecture-approved; blocked on P18-F plus trustworthy backend finding provenance.

## P18-H — Curriculum / learning paths

Reviewed authority: `docs/architecture/phase18-learning-paths-contract.md`.

Initial backend direction after stable P18-E:

- `KnowledgePath` stable shared curriculum identity;
- immutable localized `KnowledgePathVersion`;
- bounded ordered `KnowledgePathStep` references to stable article ID + exact article-version ID;
- reviewed publication status/review metadata for shared curriculum;
- no account-owned progress table.

Path publication eligibility must fail closed unless every required exact step:

- exists;
- has valid unique bounded order;
- resolves under the path locale/content requirements;
- matches the currently publication-eligible exact article version for its stable article identity;
- preserves Tier-3 human-review requirements.

A material article update does not silently rewrite a published path version. If v1 is replaced by eligible v2, a path version pinned to v1 becomes unavailable until a newly reviewed path version references v2.

Mobile direction:

- path list/detail as ordinary Knowledge navigation;
- free skip/revisit/open behavior, never mastery locks;
- exact-version navigation to the existing reader with a fail-closed expected-version check;
- step decoration derived from P18-E state;
- no duplicate `pathProgress`, XP, rank, streak or reward authority.

**Current state:** architecture-approved. Runtime may begin independently after stable P18-E; it does not depend on P18-G.

## Production / rollout boundary

Source/CI completion is separate from deployment and activation.

The backend repository's current Vercel Git integration deploys PR branches as previews and has demonstrated production deployment on pushes to backend `main` for the `peptonio-admin` project. Do not treat a source-ready backend PR as permission to trigger that production side effect when production activation is not authorized.

Phase 18 source completion does not imply:

- backend/admin production deployment;
- production migration execution;
- OTA/native publication;
- editorial provider activation;
- publication of generated canonical content;
- medical review completion;
- physical-device validation.

Each claim remains separately evidence/authorization gated.
