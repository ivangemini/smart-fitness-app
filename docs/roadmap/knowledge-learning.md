# Knowledge & Learning Roadmap

Updated: 2026-08-20

This is the focused execution roadmap for Phase 18. The canonical cross-repository priority remains `docs/implementation-plan.md`; the architecture boundary is `docs/architecture/phase18-knowledge-learning-system.md`.

## Current execution checkpoint

Phase 18 is active and dependency-ordered.

- **P18-A contracts/publication gate:** merged in backend #272.
- **P18-A persistence + published reader:** merged in backend #285 as backend `main` `e0ae0e4506674a533903bb046fd2ff16b2cf44a3`. Its exact head passed Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI before merge.
- **P18-B editorial orchestration:** clean exact-main rebuild is open as backend #290 at head `8d14c54159128b71f42b6b01cb28c9e5adad36d9`. It adds bounded provider-neutral editorial orchestration, deterministic preflight/readiness, independent claim verification and quiz validation, Tier-3 human-review handling and fail-closed provider-output consistency checks. Merge remains exact-head Hermes CI gated.
- **P18-C Library/reader:** merged in mobile #793 as mobile `main` `3a99b017b679da295207e4a8e4d1506681368023` after exact-head Mobile CI passed.
- **P18-D quiz bank:** hardened four-file package is privately prepared one dependency step above #290 at `18e2b318aa7ccd80320bead09c07c9b13c6b3267`; no PR is open while P18-B owns the dependency/CI lane. The package composes full publication eligibility with quiz-specific eligibility, snapshots/freeze-protects canonical quiz evidence, uses module-private `WeakSet` runtime membership to reject structural or reflected-brand forgeries, returns presentation-safe assembly DTOs without answer keys/feedback, and keeps answer evaluation backend-only. It must be rebuilt from exact backend `main` after #290 merges, then exact-head validated before merge.
- **P18-E learning state:** ownership/versioning/privacy/deletion/export/offline-replay contracts are reviewed. Runtime remains intentionally blocked until merged/stable P18-A reader identity and P18-D quiz identity/evaluation exist.
- **P18-F Coach → Learn:** recommendation authority is reviewed in `docs/architecture/phase18-coach-learn-recommendation-contract.md`. Runtime waits for P18-A/P18-D plus enough P18-E state for deterministic suppression/revisit semantics.
- **P18-G Coach/report surface integration:** authority is reviewed in `docs/architecture/phase18-coach-learn-surface-integration.md`. Runtime waits for P18-F plus an existing host surface with a trustworthy typed finding identity; it must not create a second scheduler or promote local presentation labels into backend finding authority.
- **P18-H curriculum/learning paths:** authority is reviewed in `docs/architecture/phase18-learning-paths-contract.md`. Paths are immutable reviewed navigation over exact article versions, reuse P18-E state, never lock content and do not create duplicate progress truth.

Immediate order: exact-head validate/fix/merge #290 P18-B → rebuild hardened P18-D from the resulting exact backend `main` → exact-head validate/merge P18-D → implement P18-E under the reviewed account-state authority → implement deterministic P18-F mapping/selector → integrate only into an already-authoritative Coach/report surface under P18-G → implement P18-H after reader/quiz/learning-state layers are stable.

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
- relational canonical persistence and authenticated published-reader API.

Acceptance:

- an article cannot be publishable with unapproved claims;
- every publishable claim references allowlisted evidence;
- a quiz item references the exact article version and reviewed claim(s);
- Tier-3 medical-adjacent material cannot publish without human review;
- no provider/model is required for the foundation to function;
- canonical article data contains no private user evidence;
- reader delivery reruns publication eligibility and omits editorial authority/answer keys.

**Current state:** complete for the reviewed runtime/source scope. Contract/publication foundation merged in backend #272; relational persistence and authenticated fail-closed published reader merged in #285 after exact-head CI/PostgreSQL/receipt validation.

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
- a `supported` verification requires explicit supporting evidence and cannot simultaneously carry issue codes;
- a `valid` quiz validation cannot simultaneously carry blocking issue codes;
- source identifiers are verified rather than fabricated by the model;
- raw Labs documents/private application state are outside the normal editorial evidence pack.

**Current state:** clean exact-main rebuild is backend #290 at `8d14c54159128b71f42b6b01cb28c9e5adad36d9`. It is mergeable but remains exact-head Hermes Backend CI gated. No provider activation, canonical write path or publication action is included.

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

**Current state:** merged in mobile #793 after exact-head Mobile CI. The runtime now consumes the P18-A server contract without changing the five primary tabs.

## P18-D — Quiz bank and validation

Deliver:

- pre-generated single-select question bank v1;
- recall/understanding/application/misconception categories;
- strict four-option/one-answer validation;
- claim/article-version linkage;
- bounded explanations for submitted options;
- article-specific deterministic quiz assembly;
- opaque server-authoritative bank eligibility.

Acceptance:

- no live arbitrary quiz generation is required for reading;
- questions with ambiguous answer keys cannot publish;
- each question is provably supported by reviewed article claims;
- presentation/evaluation cannot bypass full publication eligibility, exact-version bank eligibility or Tier-3 human-review gates;
- runtime authority cannot be forged by structural typing or by reflecting a private brand symbol from a genuine bank;
- normal assembly/presentation never exposes `correctOptionId`, option feedback-before-answer or review metadata;
- updating an article does not silently rewrite historical quiz evidence;
- successful evaluation resolves only an item/option inside the eligible exact-version bank.

**Current state:** privately prepared at `18e2b318aa7ccd80320bead09c07c9b13c6b3267` as exactly four files above the current #290 head. It is deliberately not a PR yet. After #290 merges, rebuild the same reviewed package from exact new backend `main`, update the architecture index, exact-head validate, then merge.

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
- offline writes use a bounded retry/replay queue rather than fitness `AppState` revision sync;
- two-device replay is idempotent/server-authoritative;
- no scores are converted into XP, levels, streaks or engagement rewards.

The reviewed semantic/privacy contract is `docs/architecture/phase18-learning-state-contract.md`. The chosen implementation authority is `docs/architecture/phase18-learning-state-authority.md`: learning state is a dedicated server-authoritative private account domain with a focused bounded mobile offline retry queue, not another entity in revisioned fitness `AppState` sync. Positive evidence is keyed to exact article/article-version identities; hidden answer keys remain backend-controlled; the persistence package must include authenticated ownership, retry/replay, stale/deprecated handling, two-device behavior, deletion, export/privacy and account-switch/logout cleanup.

**Current state:** architecture-approved. Runtime must not begin until P18-D quiz identity/evaluation is merged/stable alongside already-merged P18-A reader identity.

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
- Tier-3/Labs-adjacent recommendations preserve canonical human-review and structured-evidence boundaries;
- no diagnosis/prescribing inference or automatic cross-domain mutation is introduced.

The reviewed authority is `docs/architecture/phase18-coach-learn-recommendation-contract.md`. The model may provide an optional bounded explanation only after deterministic selection; selection, publication, risk tier, learning state and canonical content remain non-model authority.

**Current state:** architecture-approved; runtime intentionally waits for hardened P18-D plus enough P18-E account state.

## P18-G — Coach/report surface integration

Deliver optional educational attachments inside applicable existing Coach/report surfaces.

Acceptance:

- the host Coach surface remains useful and valid when no article is recommended or Knowledge is unavailable;
- only a P18-F-approved exact article/version attachment may render;
- education is phrased as optional context, not punishment or medical necessity;
- a host cooldown/frequency policy cannot be bypassed by rendering Knowledge as a second unsolicited card;
- local mobile Proactive Coach insight kinds are not silently treated as trusted backend finding codes;
- navigation uses exact canonical article/version identity;
- article opening/impression alone does not imply `read` or `understood`;
- no automatic fitness/nutrition/goal/Labs mutation follows reading or quiz completion;
- future behavior changes are not attributed causally to the educational intervention.

The reviewed authority is `docs/architecture/phase18-coach-learn-surface-integration.md`. Current Proactive Coach v1 remains a local mobile deterministic presentation domain and is not a P18-F finding authority. P18-G does not create a new daily/periodic scheduler merely to carry Knowledge.

**Current state:** architecture-approved; runtime waits for P18-F and an existing eligible Coach/report surface with a trustworthy compatible finding identity.

## P18-H — Curriculum / learning paths

Deliver reviewed shared curriculum/navigation over immutable path versions and exact article versions.

Acceptance:

- a published path version references exact canonical article-version identities;
- changing material curriculum/article content produces a new reviewed version rather than silently rewriting a published path;
- all required steps remain publication-eligible and Tier-3 review rules are preserved;
- sequence is recommended navigation, never an access lock;
- users may skip/revisit/open any visible step without quiz/mastery gating;
- step state is derived from P18-E exact-version evidence rather than a duplicate path-completion authority;
- no XP, levels, streaks, badges, ranks, reward currency or loss mechanics are introduced;
- model personalization cannot rewrite canonical path order or insert unpublished content;
- path failure does not make the standalone Knowledge Library/reader unavailable.

The reviewed authority is `docs/architecture/phase18-learning-paths-contract.md`. Shared path definitions are backend-authoritative curriculum content. User-specific decoration reuses P18-E account-owned state; a future enrollment/resume preference would require a separate minimal ownership contract without redefining learning truth.

**Current state:** architecture-approved; runtime remains downstream of stable reader/quiz/learning-state layers.

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
