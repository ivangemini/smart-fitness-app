# Phase 18 Learning State Contract

Updated: 2026-08-19

This document defines the reviewed product/data boundary that must exist before Phase 18 P18-E learning-state persistence is implemented. It is intentionally architecture-only: it does not authorize a schema migration, API write route, background job, gamification mechanic, provider activation, rollout, or production data change.

Exact code, migrations, tests, current Git history, `AGENTS.md`, and the canonical `docs/implementation-plan.md` override stale prose.

## Purpose

Knowledge learning state is a small account-owned informational record that helps the product remember which exact published educational material a user has encountered and whether a later refresh may be useful.

It is not an engagement score and it is not evidence that the user's training, nutrition, recovery, Labs, body composition, health, or behavior improved because they read an article or answered a quiz.

The only reviewed semantic states are:

- `unseen` — no persisted positive evidence for this article version;
- `read` — the exact published article version was explicitly marked/read by the user under a reviewed interaction boundary;
- `understood` — the user completed reviewed quiz evidence for the exact article version at the product-defined correctness threshold;
- `refresh_useful` — later deterministic/version-aware logic indicates that revisiting the material may be useful.

These values are descriptive and informational. They must never be presented as rank, achievement, compliance, success/failure morality, or competitive standing.

## Authority and identity

Canonical educational content remains shared backend-authoritative data. Learning state is private account-owned data.

A future persisted learning-state record must be keyed by stable account ownership plus exact canonical Knowledge identities. The minimum logical identity is:

`userId + articleId + articleVersionId`

The record must not be keyed only by slug, title, concept name, locale display text, quiz text, or mutable navigation labels.

`articleVersionId` is required because published article versions are immutable evidence boundaries. A material article update creates a new version; prior reading/quiz evidence must remain attached to the version that was actually seen.

If quiz evidence is persisted, it must additionally retain the exact reviewed quiz-item identity/version boundary required by the canonical quiz contract. Do not infer completion against a newer quiz merely because the article slug is unchanged.

## State semantics

### `unseen`

`unseen` is the absence/default product interpretation when no positive persisted learning evidence exists for the requested exact article version.

An implementation does not need to materialize one database row per unseen article. Prefer absence-as-unseen unless a later reviewed requirement demonstrates a need for explicit rows.

### `read`

`read` requires an explicit user-visible reading completion boundary. Merely opening a route, prefetching an article, rendering the first screen, receiving a push/deep link, or background-fetching content must not mark an article read.

The eventual UI may use an explicit completion control or a conservative deterministic completion condition, but the exact trigger must be reviewed with accessibility and offline/retry behavior before persistence ships.

### `understood`

`understood` is stronger evidence than `read` but remains informational. It requires successful evaluation of reviewed quiz content tied to the same exact article version.

The client must not be publication or answer-key authority. Correct answers and scoring authority remain backend-controlled. A mobile client must never receive hidden answer-key material solely to score locally.

A failed, abandoned, malformed, stale-version, or unreviewed quiz attempt must not produce `understood`.

### `refresh_useful`

`refresh_useful` indicates that revisiting a lesson may be useful. It is not a penalty, streak break, downgrade, or loss of mastery.

The first implementation must use deterministic, reviewable criteria. Examples of acceptable future inputs include:

- a newer published article version supersedes the version previously read/understood;
- a bounded period has elapsed since the last exact-version evidence and the user explicitly asks for refresh guidance;
- a reviewed deterministic Coach finding maps to the same canonical content and the saved evidence is stale for that exact version/mapping.

A model must not arbitrarily downgrade users to `refresh_useful`.

## Transition model

The initial permitted conceptual transitions are monotonic within one exact article version except for an explicit deterministic refresh marker:

`unseen -> read -> understood`

and

`read | understood -> refresh_useful`

A later successful revisit may return the informational state to `read` or `understood` depending on new exact-version evidence.

Do not infer `understood` from time spent, scroll depth, article opens, Coach conversation, device activity, workout adherence, nutrition adherence, Labs changes, or any unrelated product telemetry.

Do not automatically clear earlier exact-version evidence when a new article version is published. The new version is separately `unseen` unless a reviewed migration/reconciliation rule says otherwise; historical evidence remains tied to the old version.

## Ownership and authorization

Learning state is private user data.

Any future read/write API must:

- derive ownership from the authenticated session, never from a client-supplied `userId`, `ownerId`, or `accountId`;
- scope every query and mutation to the authenticated user;
- reject cross-account access even when article/version IDs are valid;
- validate canonical article/version existence and publish eligibility before accepting positive learning evidence;
- use stable versioned DTOs and strict trust-boundary validation;
- use idempotency or equivalent replay-safe semantics for retryable writes;
- preserve device/session ownership rules already used by the backend.

Shared Knowledge article IDs are not secrets, but the association between an account and learning evidence is private.

## Offline-first and synchronization boundary

P18-E must not create an ad-hoc second synchronization architecture.

Before implementation, choose one explicit authority model:

1. server-authoritative learning-state writes with a small retryable offline queue; or
2. integration into the existing revisioned account-sync framework with a fully reviewed entity contract.

Do not partially implement both.

The decision must define:

- operation identity and replay behavior;
- device ownership;
- server revision or equivalent conflict authority;
- duplicate delivery behavior;
- stale article-version rejection;
- deletion/tombstone behavior if records are mutable/deletable;
- two-device conflict semantics;
- account switching/logout cleanup;
- local cache invalidation and hydration.

Because learning state is low-frequency informational data, simplicity is preferred over manufacturing a broad new sync family. A dedicated bounded server-authoritative write/read contract is acceptable if it preserves offline retry and deterministic conflict behavior.

## Version semantics

Published article versions are immutable. Learning evidence always refers to the exact version consumed.

A newer version must never silently inherit `understood` from an older version. The UI may show historical context such as "previous version understood" only if the distinction is explicit and does not label the new version as completed.

If a version is deprecated or withdrawn:

- historical private learning evidence may remain for account history/export unless legal/safety policy requires stronger handling;
- the withdrawn canonical content must no longer be offered as ordinary published reading content;
- the client must tolerate a learning-state reference whose canonical article version is no longer readable;
- recommendation logic must map only to currently eligible published content.

## Quiz evidence boundary

Normal article reading may expose question/options for display, but hidden answer keys, internal review notes, publication diagnostics, and provider metadata remain backend-only.

For a future quiz submission API, the client should submit only the minimum required identities and user selections. The backend must resolve the canonical reviewed quiz item, validate the exact article version, evaluate the answer, and return a versioned result DTO.

Persist only concise structured evidence required for product semantics, for example:

- article/article-version identity;
- quiz-item identity/version boundary;
- evaluated outcome required for state derivation;
- attempt/completion timestamp;
- server schema version / revision metadata.

Do not persist chain-of-thought, hidden model reasoning, raw provider payloads, or unnecessary answer text copies when canonical identities suffice.

## Privacy classification

Learning state is account-scoped product activity data. It can reveal educational interests and, when associated with Labs/medical-adjacent concepts, may indirectly reveal sensitive interests.

Therefore:

- treat all account/article associations as private;
- do not include them in shared canonical Knowledge records;
- do not expose them to unrelated users, public profiles, Social, leaderboards, or trainer discovery by default;
- do not use raw learning history as unrestricted model context;
- only provide the minimum reviewed structured state to Coach/recommendation systems when a purpose-specific contract exists;
- keep Tier-3/Labs-adjacent learning state inside the same conservative privacy posture used for other sensitive account data.

No advertising, competitive ranking, public comparison, or engagement-optimization use is authorized by P18-E.

## Account deletion

A future persistence package must include learning state in the canonical account-deletion path in the same migration/package that introduces the table or storage authority.

Deletion requirements:

- all account-owned learning-state rows and quiz-attempt evidence owned solely by the deleted account are deleted/anonymized according to the repository's established deletion contract;
- shared canonical Knowledge articles, sources, claims, and quiz definitions are not deleted when one account is deleted;
- deletion receipt/tests must prove no account-owned learning-state record survives normal account deletion;
- local mobile caches/queues for the deleted account are cleared under the existing account cleanup boundary.

Do not ship P18-E persistence first and "add deletion later".

## Export and user access

A future account export must include the user's private learning state in a stable machine-readable form once persistence exists.

The export should distinguish:

- article identity and exact version identity;
- locale/version metadata available without exposing internal editorial fields;
- state (`read`, `understood`, `refresh_useful` where persisted/derived by contract);
- relevant completion timestamps;
- concise quiz outcome evidence if retained.

Exports must not include hidden answer keys, internal publication diagnostics, reviewer notes, provider prompts/payloads, or unrelated users' data.

If the existing product has no general user-facing export route at implementation time, the persistence package must still update the backend privacy/data inventory and document how the data participates in the established account export/subject-access process.

## Retention

Default retention is account lifetime for minimal learning-state evidence unless a more restrictive legal/privacy requirement applies.

Do not retain redundant high-volume interaction telemetry merely to support this state. Prefer the minimum structured evidence necessary to reconstruct the current informational state and relevant exact-version history.

If detailed quiz attempts are not necessary for product semantics, retain only the minimal evaluated outcome/evidence needed by the reviewed contract rather than every interaction event.

## Coach and recommendation use

P18-F may read learning state only after its own deterministic finding-to-content mapping is valid.

Permitted use is bounded, for example:

- avoid recommending the exact same already-understood version too frequently;
- select a newer reviewed version when one exists;
- explain that a refresh may be useful when deterministic criteria are met.

Learning state must not become a model-generated score. A model may explain a deterministic recommendation but cannot invent publication state, rewrite completion evidence, mark understanding, or select arbitrary unpublished content.

## No automatic cross-domain mutation

Learning-state writes must never automatically mutate:

- workout templates/programs/sessions;
- nutrition targets or food entries;
- fitness-profile goals;
- recovery/safety state;
- Labs records;
- Coach proposal authority;
- notification permissions;
- Social/public profile data.

The inverse is also true: unrelated cross-domain changes must not silently mark educational content read or understood.

## No gamification

The following remain prohibited for Knowledge learning state unless the product policy is deliberately re-reviewed:

- XP;
- levels;
- streaks;
- badges;
- leaderboards;
- competitive rank;
- loss/punishment mechanics;
- daily pressure loops;
- moralized "good/bad learner" labels.

A curriculum may order content for navigation, but position in a path is not a competitive progression score.

## Minimum implementation gate for P18-E persistence

Before the first schema/API implementation PR is mergeable, it must include or demonstrate all of the following:

1. exact current canonical Knowledge article/version/quiz identities are stable enough to reference;
2. authenticated ownership and route DTOs are documented;
3. chosen offline/retry/sync authority is explicit;
4. exact-version transition semantics are covered by tests;
5. stale/deprecated/unpublished version handling is deterministic;
6. no hidden quiz answer key is exposed to mobile;
7. account deletion includes the new account-owned records;
8. privacy/data inventory is updated;
9. export/subject-access treatment is documented;
10. two-device/replay behavior is tested for the chosen write model;
11. mobile account switch/logout cleanup is covered where local state exists;
12. no automatic cross-domain mutation or gamification is introduced.

Until these conditions are met, P18-E remains architecture-approved but persistence-incomplete.

## Non-goals for the first P18-E package

The first persistence package must not add:

- social sharing of learning history;
- trainer visibility by default;
- public achievements;
- model-authored completion states;
- autonomous curriculum progression;
- behavioral outcome attribution;
- medication/pharmacology education workflows outside the approved product safety scope;
- unrestricted raw Labs/model context;
- provider activation or production rollout.

## Follow-on sequence

After P18-A reader and P18-D quiz contracts are merged and stable:

1. implement the minimum server ownership/persistence/API package using this contract;
2. add mobile offline-safe read/write integration without creating a parallel sync architecture;
3. add deterministic UI presentation for informational state;
4. validate deletion/export/privacy/account-switch and two-device/replay behavior;
5. only then allow P18-F Coach -> Learn recommendation logic to consume the bounded state.
