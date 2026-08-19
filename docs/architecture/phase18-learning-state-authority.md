# Phase 18 Learning State Authority Decision

Updated: 2026-08-19

Status: reviewed architecture decision for P18-E implementation after the P18-A reader and P18-D quiz identities are merged/stable.

This decision narrows the options left open by `phase18-learning-state-contract.md`. It does not authorize a schema migration, route, provider activation, production rollout or end-user mutation before the dependency gates in the Phase 18 roadmap are satisfied.

## Decision

Use a **dedicated server-authoritative account-scoped learning-state domain with a bounded mobile offline retry queue**.

Do not add Knowledge learning state to the existing private revisioned fitness `AppState` sync family.

Do not create a second broad synchronization framework.

The resulting boundary is:

```text
published canonical Knowledge content (shared backend authority)
                  ↓ exact article/version/quiz identities
account-scoped Knowledge learning service (server authority)
                  ↑ authenticated idempotent writes
focused mobile Knowledge cache + bounded retry queue
```

## Why this authority model

Learning state is low-frequency informational account activity, not offline-first fitness source data. It does not need the full conflict/tombstone semantics of workout, nutrition, profile or measurement synchronization.

Keeping it outside revisioned `AppState` preserves the existing architecture:

- canonical Knowledge content remains shared backend authority;
- private fitness sync remains focused on fitness entities;
- Social, Labs and Knowledge continue to use their own server-authoritative boundaries where appropriate;
- mobile production consumers do not regain broad `useAppContext` subscriptions;
- a learning-state failure cannot block or corrupt workout/nutrition/profile synchronization.

The mobile queue is intentionally narrow: it transports retryable Knowledge learning operations while offline. It is not a general entity-sync subsystem and must not own canonical conflict resolution.

## Stored semantics: evidence first, display state derived

The four reviewed product states remain:

- `unseen`;
- `read`;
- `understood`;
- `refresh_useful`.

Persistence should not model these as one destructive mutable enum if doing so would discard stronger historical evidence.

Prefer minimal structured evidence from which the current presentation state can be derived, for example:

- `readAt` for explicit exact-version read completion;
- `understoodAt` plus reviewed quiz-evidence identity for server-confirmed understanding;
- `refreshUsefulAt` plus a deterministic reason code when a refresh is currently useful;
- server revision / updated timestamp for replay and cache freshness.

Absence remains `unseen`.

A conservative derivation is:

```text
if active refresh marker exists -> refresh_useful
else if understood evidence exists -> understood
else if read evidence exists -> read
else -> unseen
```

Clearing a refresh marker after a reviewed revisit must not erase historical `understood` evidence. This prevents a non-punitive refresh signal from acting as a destructive downgrade and makes two-device reconciliation safer.

The exact SQL shape is implementation-owned by the backend package, but it must preserve these semantics.

## Canonical identity

Every positive learning record is scoped by the authenticated account and exact canonical content identity.

Minimum logical identity:

`userId + articleId + articleVersionId`

Do not key by slug, title, locale label, concept display name or route text.

Quiz evidence additionally references the exact canonical quiz item identity required by the merged P18-D contract.

A newer article version does not inherit `read` or `understood` from an older version. Older evidence remains historical account data while the new version starts as `unseen` unless a later reviewed deterministic rule says otherwise.

## Server-authoritative write model

All canonical transitions are evaluated on the backend.

### Read completion

A future read-completion mutation must:

- derive `userId` from the authenticated session;
- reference one exact currently publication-eligible article version;
- use an idempotency key or equivalent operation identity;
- reject malformed, unpublished, withdrawn or mismatched content identities;
- be replay-safe;
- never change workout, nutrition, goal, Labs, recovery, Safety or Social state.

The UI may show a local pending state while an offline operation is queued, but it must distinguish pending transport from server-confirmed canonical state.

### Quiz evaluation / understanding

The client never scores canonical quizzes locally.

A future answer endpoint receives only the minimum identities and selected option. The backend resolves the exact approved quiz item, checks exact article-version linkage, evaluates the answer and returns a strict versioned result.

Only reviewed server evaluation may contribute to `understood`.

Failed, abandoned, stale-version, malformed or unapproved quiz attempts cannot produce `understood`.

The first implementation should store only the minimum evaluated evidence needed for product semantics rather than a high-volume interaction log.

### Refresh-useful marker

`refresh_useful` is server-derived or server-validated deterministic state.

The client must not arbitrarily set it from presentation telemetry. A model must not arbitrarily set or clear it.

Initial eligible reason codes should remain bounded and reviewable, for example:

- `newer_version_available`;
- `explicit_refresh_request`;
- later, a reviewed deterministic Coach finding mapping when P18-F exists.

Time-spent, scroll depth, missed workouts, body-weight movement, food adherence or unrelated app engagement are not learning-state authority.

## Revision and two-device semantics

The server is the conflict authority.

Each returned account/article-version record should include a monotonically increasing server revision or equivalent opaque version token.

Writes are operation-idempotent and fact-monotonic where possible:

- duplicate read completion is a no-op success;
- a later read write cannot erase confirmed understanding;
- confirmed understanding cannot be erased by stale client state;
- setting/clearing a refresh marker cannot delete historical read/understood evidence;
- duplicate quiz-answer delivery returns the same canonical evaluation for the same operation identity;
- stale local cache never overwrites a newer server record.

Two devices may submit independent valid operations. The backend merges accepted evidence according to the deterministic rules above and returns the current canonical projection.

No last-writer-wins whole-record replacement from mobile is allowed.

## Mobile persistence boundary

Mobile uses a focused Knowledge learning repository/context, separate from private fitness `AppState`.

Permitted local data:

- tokenless cached server projections keyed by account + exact article version;
- bounded pending operations with stable operation IDs;
- retry metadata required to deliver those operations.

Not permitted:

- access/refresh tokens in AsyncStorage;
- hidden quiz answer keys;
- provider payloads;
- broad user fitness/Labs snapshots inside Knowledge queue records;
- a duplicate canonical learning-state truth that can overwrite the backend.

Account switch/logout cleanup must delete or partition cached projections and pending operations so one account never sees or delivers another account's learning activity.

Retry uses the existing authenticated API/token refresh stack. No direct provider call is allowed.

## Queue rules

The queue is bounded and domain-specific.

Each operation includes at minimum:

- operation ID;
- operation type;
- exact canonical content identities;
- minimum user action payload;
- creation timestamp;
- retry state.

Operations must be serializable, size-bounded and safe to replay.

Use deterministic compaction where semantics permit it. For example, repeated pending read-completion operations for the same exact version should collapse to one logical operation rather than grow unbounded.

Do not compact quiz answer operations in a way that changes which reviewed selection was actually submitted.

Permanent failure such as withdrawn content, invalid identity or ownership/auth failure must leave a typed recoverable presentation state or be discarded under a documented rule; it must not retry forever.

## API shape direction

Exact routes belong to the backend implementation package, but the first surface should remain small and purpose-specific.

Expected capabilities:

- bounded authenticated read of learning-state projections for exact article/version identities;
- idempotent explicit read-completion mutation;
- server-side quiz selection evaluation tied to one exact approved quiz item/article version;
- returned updated learning projection after accepted state-changing evidence.

Avoid a generic arbitrary learning-state PATCH endpoint. Clients should submit evidence/actions, while the backend derives the canonical informational state.

## Deletion, export and retention

The implementation package that introduces persistence must update account deletion and export/subject-access behavior in the same package.

Account deletion removes all account-owned learning records and retained quiz evidence for that user while leaving shared canonical Knowledge content intact.

Export distinguishes exact article/version identity, current informational state and retained completion timestamps/evidence without exposing hidden answer keys, reviewer notes, provider prompts/payloads or publication diagnostics.

Default retention remains account lifetime for minimal structured evidence unless a stricter requirement applies.

## Privacy

Learning state is private account activity. Labs/medical-adjacent article associations can indirectly reveal sensitive interests and therefore use the conservative private-data posture.

Do not expose learning state to:

- Social/public profiles;
- leaderboards or trainer discovery by default;
- unrelated accounts;
- unrestricted model context;
- advertising/engagement optimization.

P18-F may consume only the minimum reviewed structured projection needed for deterministic recommendation deduplication/relevance.

## Failure and offline behavior

Knowledge reading remains useful when a learning-state write cannot currently reach the server.

- article content reading is not blocked by a queued read-completion write;
- the UI distinguishes pending synchronization from confirmed state;
- quiz correctness/`understood` is not fabricated offline when server evaluation is unavailable;
- queue failure does not block unrelated fitness sync or app startup;
- stale/deprecated article versions fail closed for new positive evidence while historical cached state may remain displayable with explicit unavailable-content handling.

## Implementation gate

P18-E runtime implementation may begin only after:

1. backend P18-A persistence/reader identities are merged and stable;
2. the P18-D canonical quiz item/evaluation identity contract is merged and stable;
3. the implementation branch starts from exact current backend/mobile `main` as appropriate.

The first runtime package must then include:

- schema/migration and forward-safe constraints;
- authenticated ownership tests;
- idempotent/replay tests;
- two-device/stale-cache semantics tests;
- exact-version and withdrawn/unpublished handling;
- account deletion coverage;
- privacy/data inventory updates;
- export treatment;
- focused mobile cache/queue/account-cleanup coverage;
- no-gamification and no-cross-domain-mutation preservation.

## Non-goals

This decision does not authorize:

- Knowledge XP, streaks, levels, badges or leaderboards;
- public learning history;
- automatic curriculum progression;
- model-authored learning state;
- local client answer-key authority;
- arbitrary generic state mutation endpoints;
- integration into private fitness revisioned sync;
- provider activation;
- production migration/deployment;
- diagnosis, prescribing or medication/pharmacology workflows.