# Trainer / Coach Collaboration — Human Authority Contract

Updated: 2026-08-23

This is a reviewed product/authority contract for a future **human trainer ↔ client** collaboration package. It does not activate the feature, add a backend schema, change private fitness synchronization, grant cross-account access, or extend AI Coach authority by itself.

The package remains an unnumbered roadmap package. It does **not** create P21-F or Phase 22.

## Objective

Allow a user to deliberately collaborate with a human trainer while preserving current ownership, privacy, synchronization and mutation boundaries.

The intended flow is:

```text
explicit relationship invitation
→ explicit acceptance
→ bounded granted read scopes
→ human comments / proposals with provenance
→ client review
→ explicit client Apply through existing target-domain authority
→ auditable relationship / proposal lifecycle
```

A trainer is never silent mutation authority over private fitness state.

## Three authority classes must stay separate

### 1. Social relationship

Existing Social follow/private/block state is a server-authoritative **network and visibility graph**. It may control reviewed Social visibility, but it is not permission to read or change private fitness data.

- following a user does not create a trainer relationship;
- accepting a private Social follow does not grant trainer scopes;
- a Social profile is not the canonical trainer/client account identity for this package;
- Social workout/story publication remains separate from private trainer collaboration.

A future product rule may coordinate Social blocking with trainer access, but that is **not** inferred by this contract. Any such coupling requires an explicit reviewed rule because Social and trainer relationships have different purposes and lifecycle semantics.

### 2. AI Coach / Trainer

Existing Coach is deterministic-first AI orchestration with bounded model explanation/proposal behavior.

- AI Coach is not a human trainer identity;
- Coach capability or run history does not grant human cross-account access;
- human trainer comments/proposals must not be serialized as model authority;
- a model may later explain an already-authorized human proposal only through a separately reviewed read-only contract;
- model output never becomes automatic Apply authority.

### 3. Human trainer relationship

Human trainer collaboration is a new account-scoped authorization domain. Backend ownership must derive from authenticated account identity rather than Social profile identity or client-supplied owner IDs.

This relationship is the only authority considered by future trainer collaboration endpoints.

## Relationship lifecycle

Minimum lifecycle:

```text
invited → active → revoked
```

`invited` means no private fitness read/write scope is active yet.

`active` begins only after explicit acceptance by the invited account. The relationship stores stable relationship identity and the exact granted scope set.

`revoked` is terminal for that grant. Revocation must immediately prevent future authorized reads/proposals under that relationship. Re-establishing collaboration requires a new explicit invitation/acceptance lifecycle rather than silently reactivating the old grant.

Decline, expiration and cancellation may be represented as terminal invitation outcomes during implementation, but they must never be treated as active authorization.

### Direction and consent

- both participating accounts are identified from authenticated backend state;
- an invitation explicitly identifies the proposed trainer and client roles;
- the invited party must accept before any private data becomes available;
- neither party can silently expand scopes after acceptance;
- scope expansion requires a new explicit client-facing confirmation event;
- trainer self-grant is prohibited.

## Initial read scopes

The first implementation should be deliberately minimal. Scopes are allowlisted capabilities, not arbitrary object/path access.

Recommended initial read scopes:

- `workout_history_summary` — bounded completed-workout/session summaries;
- `workout_templates` — future/custom workout templates needed to discuss proposed changes;
- `training_programs` — program structure and exact template references;
- `progress_summary` — weight/body-measurement/progress aggregates required by reviewed collaboration UI;
- `recovery_summary` — bounded recovery context only where already approved for training decisions.

Implementation may ship a smaller subset first. It must not silently broaden a scope based on which fields are convenient to return.

### Excluded by default

The initial relationship does **not** grant access to:

- authentication/session/device data;
- access or refresh tokens;
- provider credentials or provider payloads;
- raw Labs documents, extraction drafts or confirmed Labs results;
- Progress Photo image files or local photo metadata;
- Social private messages or unrelated Social graph state;
- raw Coach provider/model payloads or hidden reasoning;
- account export artifacts;
- unrelated nutrition or profile data unless a future reviewed scope explicitly requires it.

Progress Photos remain private local media under the Phase 20 contract. Labs is a separate private server-authoritative domain. Neither becomes trainer-visible by implication.

## Data minimization

Every trainer read must be purpose-specific and bounded to the granted scope.

- return projected DTOs rather than raw private fitness rows where practical;
- do not expose sync revisions, tombstone internals, conflict payloads or internal diagnostics unless required for a reviewed mutation protocol;
- user-authored notes are excluded unless a specific reviewed scope explicitly includes them;
- no endpoint may accept arbitrary requested field paths from the trainer client;
- exact IDs needed for proposal provenance may be returned, but only for entities inside the granted scope.

## Human comments and proposals

Trainer-authored collaboration content is server-authoritative account data with human provenance.

Every stored comment/proposal must include enough immutable provenance to identify:

- relationship ID;
- trainer account actor;
- client account target;
- creation timestamp;
- target entity type and exact target ID when applicable;
- proposal schema/version;
- proposal lifecycle state;
- bounded human-authored message/content.

Do not persist credentials, provider payloads, hidden model reasoning or arbitrary snapshots of private source state inside comment text/blob fields.

### Proposal types

The first implementation should support proposal types only after their target-domain Apply contract is defined. Likely initial candidates are future workout-template or training-program proposals because existing app authority already distinguishes future plans from completed history.

Free-form comments may exist without mutation authority.

## Mutation boundary

Human trainer proposals are **never direct writes** to private fitness state.

Required flow:

```text
trainer proposal
→ client sees deterministic preview
→ current source identity/revision is revalidated
→ client explicitly confirms Apply
→ existing target-domain mutation/persistence/sync authority performs the change
```

Rules:

- completed `WorkoutSession` history remains immutable;
- exact workout/template/exercise/program identity is required;
- name fallback must not authorize mutation;
- stale target identity/revision/fingerprint fails closed;
- unrelated target fields remain unchanged;
- client rejection/dismissal has no target-domain side effect;
- proposal creation never queues an AppState mutation;
- trainer cannot invoke existing Coach confirmation endpoints as a bypass;
- backend cannot treat trainer role as blanket write permission to private fitness rows.

Where an existing stale-safe explicit Apply primitive exists, reuse it rather than adding a second mutation path.

## Auditability

High-impact collaboration actions require durable, inspectable provenance.

At minimum audit:

- invitation creation;
- acceptance;
- scope change confirmation;
- revocation;
- proposal creation;
- proposal withdrawal when supported;
- client Apply/reject outcome for mutation-capable proposals.

Audit records must not contain secrets or oversized source snapshots. Account deletion semantics for audit history must be deliberately defined in backend schema/repository design rather than inferred from Social behavior.

## Revocation and stale access

Revocation is an authorization boundary, not presentation state.

- backend authorization checks active relationship + required scope on every protected request;
- cached mobile data must not be treated as continuing server authorization;
- new reads/proposals fail closed immediately after revocation;
- pending mutation proposals must become non-applicable after relationship revocation unless a future contract explicitly allows the client to retain/apply a previously received proposal independently;
- retries/idempotency must not resurrect a revoked relationship.

The safest initial rule is: **revocation blocks new proposal application from that relationship**. A client can manually recreate the desired target change through normal app editing if needed.

## Account deletion, export and retention

Human trainer relationship/proposal/comment data is account-related server-authoritative data and must join the existing deletion/export/privacy lifecycle before production activation.

Required backend design work:

- relationship rows cannot survive in an authorization-capable state after either participant account is deleted;
- deletion must not leave orphaned grants that resolve to a replacement/new account;
- account data-access export includes the requesting account's relevant relationship/proposal/comment records in a bounded end-user-safe projection;
- cross-account records must avoid exposing the other account's private data beyond what the requester legitimately authored/received;
- audit retention/redaction behavior must be explicit and consistent with existing legal/privacy architecture;
- implementation documents which rows cascade, null actor references, redact, or remain as operational audit history.

Do not improvise retention behavior only in mobile UI.

## Backend authorization requirements

All cross-account trainer endpoints must derive ownership and actor identity from the authenticated session.

Prohibited:

- trusting payload `userId`, `ownerId`, `clientId` or `trainerId` as authorization proof;
- deriving private fitness access from Social follow status;
- relying on mobile-hidden controls as authorization;
- exposing generic repository methods that skip relationship/scope checks;
- returning private records before invitation acceptance.

Repository/service boundaries should make `relationship + scope + authenticated actor` checks difficult to bypass accidentally.

## Cross-account isolation tests

Backend implementation is not source-complete without multi-account tests covering at least:

1. unrelated account cannot discover/read a client relationship or private fitness projection;
2. invited-but-not-accepted trainer cannot read private fitness data;
3. active trainer can read only granted scopes;
4. active trainer cannot read excluded scopes;
5. trainer cannot change scope without client confirmation;
6. revoked trainer immediately loses read/proposal access;
7. client cannot impersonate trainer actor provenance;
8. trainer cannot target a private entity owned by another client;
9. stale/replayed proposal Apply fails closed;
10. account deletion removes authorization capability;
11. Social follow/private acceptance alone grants no private fitness access;
12. AI Coach capability/run state grants no human trainer access.

Because correctness depends on PostgreSQL ownership/relationship queries and multi-account isolation, backend implementation requires V3 integration evidence in addition to ordinary backend CI.

## Mobile presentation requirements

Future mobile UI must make authority visible rather than implicit.

- show whether an invitation is pending or relationship is active;
- show the human trainer identity independently from AI Coach;
- show granted scopes in understandable user-facing terms;
- make scope expansion and revocation explicit actions;
- label trainer comments/proposals with human provenance and time;
- mutation-capable proposals require separate Preview and Apply/Reject controls;
- unavailable/stale/revoked proposal state is explicit;
- do not route collaboration through existing Social follow UI as if they are the same relationship.

## Offline behavior

Authorization is backend-owned and cross-account. Mobile may cache presentation, but it cannot fabricate an active relationship or execute cross-account authorization while offline.

- relationship creation/acceptance/revocation/proposal writes require authenticated backend confirmation;
- cached relationship state is display-only while connectivity is unavailable;
- target-domain Apply may use an existing offline-first mutation path only **after** the app has a still-valid locally represented client-confirmed proposal contract and the relevant stale-safe rules support it; initial implementation should prefer online revalidation before Apply;
- offline retries preserve idempotency and never duplicate invitations/proposals.

## Notifications

Notifications are optional presentation/delivery, not relationship authority.

A missed, delayed or disabled push notification must never change whether an invitation/proposal exists or whether a relationship is active. Canonical state is fetched from the backend.

## Initial package sequence

After Progress Stories / Share Cards source work reaches its own closure or genuine dependency gate, implement human trainer collaboration in this order:

1. **C1 — backend relationship + scope foundation**
   - schema/migration;
   - invitation/accept/revoke lifecycle;
   - allowlisted scope authorization;
   - deletion/export integration;
   - PostgreSQL multi-account isolation tests.
2. **C2 — mobile relationship surfaces**
   - invitation/acceptance/status/scopes/revoke;
   - no private fitness mutation.
3. **C3 — comments + read-only client evidence**
   - bounded scoped projections;
   - human provenance;
   - no direct mutation.
4. **C4 — trainer proposal lifecycle**
   - only reviewed proposal types;
   - exact target IDs/revisions;
   - client-visible preview.
5. **C5 — explicit client Apply + audit/privacy hardening**
   - reuse existing target-domain mutation authority;
   - stale/revoked fail closed;
   - completed history immutable;
   - deletion/export/audit lifecycle verified.

This sequence may be split further for validation, but later slices must not bypass earlier authority prerequisites.

## Validation classes

- contract/docs only: V0;
- backend relationship/schema: backend V2 + V3 PostgreSQL/multi-account evidence;
- mobile relationship/read UI: mobile V2;
- API contract changes: both-side V2;
- proposal Apply: both-side V2 + target-domain V3 where persistence/revision semantics require it;
- notifications/native behavior: add V4/V5 only when actually in scope;
- production activation/deployment: V6 and is separate from source merge.

## Permanent boundaries

- Social follow is not trainer authorization.
- AI Coach is not human trainer identity or authority.
- Human trainer relationship is explicit, scoped, revocable and account-authenticated.
- Private data is minimized by purpose and excluded by default.
- Labs and Progress Photos are not trainer-readable without separately reviewed opt-in scopes.
- Completed workout/session history remains immutable.
- Trainer proposals require explicit client review and Apply.
- Exact identity and stale checks fail closed.
- Model output never applies a human trainer proposal automatically.
- Source merge, database migration execution, deployment, notification delivery and production activation are separate claims.
