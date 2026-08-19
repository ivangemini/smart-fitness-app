# Phase 18 Coach → Learn Recommendation Contract

Updated: 2026-08-19

Status: reviewed P18-F architecture contract. Runtime implementation remains dependency-gated on merged/stable P18-A canonical reader, P18-D quiz identities and P18-E learning-state authority.

## Decision

Coach does not choose Knowledge content by free-form generation.

The v1 authority chain is:

```text
reviewed deterministic Coach finding
→ exact typed finding code
→ versioned allowlisted recommendation rule
→ current publication-eligible canonical article/version
→ deterministic ranking/deduplication/suppression
→ optional bounded relevance explanation
```

If any link cannot be proven, no Knowledge recommendation is emitted.

The model may explain an already-selected recommendation. It is never article-selection, publication, evidence, quiz or learning-state authority.

## Ownership

Recommendation rules are shared backend-authoritative product configuration, not user-owned state and not mobile-authored state.

Private user evidence remains outside canonical rule/article records. The rule stores only reusable mapping metadata such as typed finding identity, target concept/article identity, applicability policy and rule version.

End-user recommendation delivery history and learning-state-derived suppression are private account-owned data when persistence is required.

## Finding input boundary

Only a reviewed typed deterministic Coach finding may enter the selector.

A valid finding input includes at minimum:

- stable finding code;
- finding schema/policy version;
- bounded severity/priority class when that class already exists in the reviewed Coach contract;
- exact source/run identity required for audit/replay;
- minimum structured evidence reference needed to explain relevance.

Free-form model prose is not a finding code.

Unknown, deprecated, malformed, model-invented or unsupported finding codes map to no recommendation.

Raw Labs documents, OCR text, provider payloads and unrestricted medical context are prohibited recommendation inputs. Labs-adjacent education may consume only reviewed confirmed structured facts/findings already permitted by the Coach/Labs boundary.

## Recommendation rule identity

Each rule has stable backend identity and explicit versioning.

Logical fields should include:

- `ruleId`;
- `ruleVersion`;
- exact `findingCode` plus compatible finding-policy/schema version range;
- one or more target Knowledge concept/article identities;
- bounded ranking priority;
- locale/depth applicability metadata only where reviewed;
- active/deprecated state;
- optional risk-tier restrictions;
- policy/provenance metadata required for audit.

Do not store private user evidence in a rule.

Do not target title text, route text or mutable slugs as canonical identity when stable concept/article IDs exist.

Mapping changes are versioned/reviewed. A model cannot create or mutate a mapping during an end-user request.

## Candidate eligibility

A mapped candidate is eligible only when all relevant boundaries pass:

1. the incoming finding is valid under its originating Coach contract;
2. the recommendation rule is active and compatible with that finding version;
3. the target article exists;
4. the exact target article version is currently publication-eligible under canonical Knowledge authority;
5. locale/presentation requirements can be satisfied without fabricating content;
6. risk-tier rules are satisfied;
7. private learning-state suppression can be evaluated when required;
8. the candidate does not violate a deterministic deduplication/frequency policy.

Unpublished, draft, review-ready, rejected, withdrawn or otherwise non-reader-eligible content cannot be recommended.

A rule pointing at unavailable content fails closed to no recommendation; it must not fall back to arbitrary search/model selection.

## Version selection

Rules may target a stable article identity, but the selector resolves the exact currently eligible published article version before returning a recommendation.

The returned DTO always carries exact article and article-version identity.

A material article update that produces a new version is therefore visible to learning-state logic rather than silently inheriting historical `read`/`understood` evidence from an older version.

If a rule must pin one exact version for safety/editorial reasons, that pin is explicit and versioned in the rule.

## Learning-state interaction

Learning state influences suppression/revisit behavior; it does not alter canonical article facts or Coach findings.

Conservative v1 behavior:

- `unseen` — candidate may be recommended;
- `read` — candidate may be deprioritized or paired with an available reviewed quiz rather than repeatedly presenting the same reading prompt;
- `understood` — same exact article version is normally suppressed unless another reviewed policy explicitly warrants revisit;
- `refresh_useful` — same exact version or an explicitly resolved newer version may become eligible for a bounded revisit prompt.

A new article version does not inherit `understood` from the older version.

The model cannot set or clear learning state and cannot override deterministic suppression.

## Deterministic selection

The selector is a pure/backend-deterministic policy over validated candidates and minimal private state.

Recommended ordering dimensions, in stable precedence, are:

1. hard eligibility;
2. finding/rule priority defined by reviewed policy;
3. exact-version learning-state relevance;
4. deduplication against already-selected concepts/articles;
5. stable rule/article identity tie-break.

Do not use model probability, engagement score, predicted click-through rate or opaque recommender ranking as authority in v1.

The selector returns a bounded number of recommendations. The exact product cap belongs to the implementation/report surface policy, but must be small and explicit rather than unbounded.

## Deduplication

A single Coach output may contain multiple findings mapping to the same concept/article.

Deduplicate deterministically by exact article identity/version and preserve the strongest eligible reason according to reviewed policy. Additional compatible finding codes may be retained as bounded structured reason metadata if useful, but must not produce repeated cards for the same article version.

Do not deduplicate across materially different article versions in a way that hides an explicit `refresh_useful` new-version signal.

## Frequency policy

Repeated prompting must be bounded and non-punitive.

The first runtime package must define an explicit deterministic frequency/suppression policy before persistent delivery history is introduced. The policy may use account-owned recommendation-delivery metadata, learning state and stable finding/run identity.

It must not use:

- streak preservation;
- guilt/loss language;
- missed-workout punishment;
- body-weight change as engagement pressure;
- hidden advertising/CTR optimization;
- arbitrary model judgment.

No numeric frequency interval is hard-coded by this architecture decision; the implementation surface must choose and test an explicit product policy rather than inheriting an undocumented magic number.

## Personalized relevance explanation

After deterministic selection, an optional provider-neutral explanation stage may explain why the approved article is relevant now.

Its input is minimized to:

- selected exact article/version title/summary metadata approved for presentation;
- approved typed finding code/category;
- minimum reviewed structured evidence needed to explain relevance;
- strict instruction that it may not diagnose, prescribe, strengthen evidence or introduce new scientific claims.

Its output is a bounded versioned DTO such as one short relevance explanation.

The explanation is presentation only. If generation fails, times out, is malformed or violates validation, the canonical recommendation may still render using deterministic reviewed copy or no personalized explanation.

Provider output cannot change the selected article, finding code, risk tier, source claims, quiz, learning state or any fitness domain state.

## Labs and medical-adjacent content

Tier-3/Labs-adjacent recommendation requires the same publication/human-review boundary as the canonical article.

The recommendation layer may say that an approved educational article is relevant to an already-reviewed structured finding. It does not interpret raw lab documents, diagnose a condition, prescribe treatment or turn an educational recommendation into medical necessity.

No emergency/clinical triage behavior is introduced by P18-F.

## API projection

Mobile receives only a strict versioned recommendation projection needed for navigation/presentation, for example:

- recommendation schema version;
- stable recommendation identity for the output/run;
- exact article ID and article-version ID;
- concept IDs where useful;
- typed reason/finding code suitable for reviewed presentation;
- bounded deterministic/reviewed relevance copy;
- article presentation metadata already allowed by the canonical reader DTO.

Mobile does not receive:

- mapping-editorial internals;
- provider prompts/payloads;
- hidden publication diagnostics;
- raw private evidence snapshots;
- raw Labs documents;
- quiz answer keys;
- arbitrary rule mutation authority.

## Replay and audit

For a given immutable Coach finding snapshot, rule-policy version, canonical publication snapshot and relevant learning-state snapshot, deterministic selection must be replayable to the same result.

Persist or audit only the minimum structured identifiers required by the owning Coach/report/recommendation surface. Do not persist chain-of-thought or duplicate canonical article bodies into recommendation records.

A future rule change does not rewrite historical recommendation evidence; historical records retain the rule/policy identity used when selected.

## Cross-domain mutation boundary

Recommendation, article opening, reading, quiz completion or learning-state changes do not automatically mutate:

- workouts/programs/templates;
- nutrition targets/entries;
- goals;
- Labs source data;
- recovery/safety state;
- Social state.

Any future mutation proposal remains a separate reviewed Coach proposal/confirmation path.

## Failure behavior

Fail closed to no recommendation when:

- finding identity is invalid/unsupported;
- mapping is absent/deprecated/incompatible;
- target content is not publication-eligible;
- exact version cannot be resolved;
- required risk-tier review is absent;
- private state cannot be safely associated with the authenticated account;
- deterministic selector detects an invalid/ambiguous policy state.

Knowledge recommendation failure must not fail the underlying valid Coach report/question/run. Education is an optional bounded addition.

## Implementation gate

P18-F runtime implementation starts only after:

1. P18-A reader/article-version identity is merged/stable;
2. P18-D quiz identity/evaluation boundary is merged/stable;
3. P18-E account-owned learning-state authority is merged/stable enough for suppression/revisit semantics;
4. the implementation branch starts from exact current backend/mobile `main`.

The first runtime package must include:

- strict versioned mapping/selector contracts;
- unknown/deprecated finding fail-closed tests;
- unpublished/withdrawn article rejection;
- exact-version selection tests;
- deterministic ranking/tie-break tests;
- duplicate finding/article collapse tests;
- learning-state suppression/revisit tests;
- Tier-3/Labs boundary tests;
- no-model-selection-authority tests;
- account ownership/privacy coverage for any persisted delivery state;
- no-cross-domain-mutation coverage.

## Non-goals

This contract does not authorize:

- live arbitrary article search/selection by a model;
- collaborative filtering or opaque engagement ranking;
- public learning history;
- gamification;
- auto-generated canonical science at request time;
- diagnosis/prescribing;
- automatic fitness/nutrition/goal/Labs mutation;
- provider activation;
- deployment/production rollout.