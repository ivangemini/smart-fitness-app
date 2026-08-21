# Agent Ownership Map

Updated: 2026-08-21

## Purpose

Use this file to answer **who owns truth** before changing data, state, persistence, or behavior. It is a navigation/impact aid, not a replacement for exact schemas, services, focused architecture, or privacy documentation.

The most dangerous agent mistake in this project is creating a second source of truth because a screen needs data quickly. When ownership is unclear, inspect the exact source and focused architecture before adding state.

## Ownership classes

### A. Private offline-first fitness state

Mobile owns the local working copy. Backend owns synchronized revision/conflict/tombstone authority for the account copy.

Required pattern:

```text
focused mobile state
→ local AppState / AsyncStorage
→ mutation journal / outbox / recovery
→ mobile sync client
→ backend revisioned sync authority
```

Do not add a parallel local store or bypass sync metadata for an existing synced entity.

### B. Server-authoritative account/domain state

Backend owns canonical rows and lifecycle. Mobile caches/presents bounded DTOs but must not fabricate server truth.

Typical pattern:

```text
mobile feature
→ src/api/
→ authenticated backend route
→ service/application layer
→ repository
→ PostgreSQL / Drizzle
```

### C. Shared canonical content

Backend owns shared publication/content truth. Mobile renders immutable/bounded published DTOs and account-owned state separately.

### D. Derived presentation state

Derived values may live on mobile when they can be recomputed deterministically from canonical inputs and are not a second persisted truth.

## Domain matrix

| Domain / entity | Mobile authority | Backend authority | Persistence / transport | Primary mobile entry | Primary backend entry | Key invariant |
| --- | --- | --- | --- | --- | --- | --- |
| Weight history | local working copy | revision/conflict/tombstone account authority | AsyncStorage + sync | progress/state/sync | sync contracts/repositories | stable IDs, timestamps, revisions |
| Completed workout sessions/sets | local working copy; completed history semantics preserved | revisioned account authority | AsyncStorage + sync | workouts/state/sync | sync contracts/repositories | completed history is not casually rewritten |
| Workout templates | local working copy | revisioned account authority | AsyncStorage + sync | workouts/state/sync | sync contracts/repositories | preserve template IDs and references |
| Training programs | local working copy | revisioned account authority | AsyncStorage + sync | workouts/programs/state | sync contracts/repositories | coordinated lifecycle and IDs |
| Custom exercises | local working copy | revisioned account authority | AsyncStorage + sync | exercises/state | sync contracts/repositories | canonical cross-entity references remain valid |
| Food entries | local working copy | revisioned account authority | AsyncStorage + sync | nutrition/state | sync contracts/repositories | diary semantics and IDs remain stable |
| Nutrition targets | local working copy | revisioned account authority | AsyncStorage + sync | nutrition/state | sync contracts/repositories | confirmation/application paths stay explicit |
| Meal templates | local working copy | revisioned account authority | AsyncStorage + sync | nutrition/state | sync contracts/repositories | nested snapshots remain contract-valid |
| Nutrition library items | local working copy | account-scoped revisioned authority | AsyncStorage + sync | nutrition/state | sync contracts/repositories | ownership and conflict semantics preserved |
| Fitness profile | local working copy | revisioned account authority | AsyncStorage + sync | profile/goals/state | sync contracts/repositories | profile remains canonical input to derived logic |
| User limitations | local working copy | revisioned account authority | AsyncStorage + sync | profile/safety state | sync contracts/repositories | safety inputs are never silently dropped |
| Recovery check-ins | local working copy | revisioned account authority | AsyncStorage + sync | safety/recovery state | sync contracts/repositories | preserve timestamps and safety semantics |
| Body measurements | local working copy | revisioned account authority | AsyncStorage + sync | progress/state | sync contracts/repositories | typed measurements and units remain explicit |
| Authentication | bounded client session state only | canonical account/auth authority | API + SecureStore tokens | `src/auth/`, `src/api/` | auth routes/services/repositories | client payload never chooses ownership |
| Access/refresh tokens | SecureStore only | session/token issuance and revocation authority | SecureStore + auth API | `src/auth/` | auth/session/device modules | tokens never enter ordinary AppState/cache |
| Sessions/devices | display/actions only | canonical authority | authenticated API | settings/account/auth | auth/session/device modules | ownership derived from authenticated session |
| Sync conflicts/revisions | local unresolved UI/recovery state | canonical revision/conflict authority | sync protocol | `SyncContext`, `src/cloud/` | sync repositories/services | cursor/revision safety; no silent overwrite |
| Coach runs | render persisted result/provenance; explicit confirmation UI | canonical run/orchestration/provenance authority | authenticated API | `src/features/coach/` | Coach routes/orchestrator/services | model output is not direct mutation authority |
| Coach calculations/guardrails | client may present bounded results | deterministic backend workers own authoritative orchestration calculations where server-run | API | Coach UI/helpers | deterministic workers/validators | hard guardrails stay outside free-form model prose |
| Coach confirmations | explicit user action only | validates/applies server-authoritative mutation contract | authenticated API | Coach confirmation surfaces | Coach services | no automatic application |
| Companion progression v1 | deterministic derived presentation from canonical completed workout days | no separate required persistence for v1 | recomputed locally | `src/features/companion/` | none for deterministic v1 | do not create duplicate persisted truth |
| Labs documents | upload/review UI only | canonical private document authority | authenticated API / managed storage via backend | `src/features/labs/` | Labs routes/services/repositories | raw docs never ordinary AppState/Social truth |
| Labs extraction drafts | reviewable draft presentation | canonical draft/job authority | authenticated API | Labs review flows | Labs processing domain | draft is not confirmed result |
| Confirmed Labs results | render/query bounded structured facts | canonical confirmed result authority | authenticated API | Labs result/history/compare | Labs repositories/services | confirmed structured facts are authoritative |
| Labs charts/classification | derived presentation from confirmed values/reference data | supplies confirmed facts/reference context | API + deterministic presentation | Labs trends/marker UI | Labs read services | descriptive, not diagnostic |
| Social profile/relationships | render/actions | canonical authority | authenticated API | `src/features/social/` | Social routes/services/repositories | no fabricated follow/friend state |
| Social workout posts | explicit sharing UI; render snapshots | canonical post/feed authority | authenticated API | Social/share flows | Social domain | sharing is explicit; private data not implicitly public |
| Stories | render/create/reply/view actions | canonical lifecycle/audience/archive/highlight authority | authenticated API | Social/Stories | Stories services/repositories | visibility and expiry owned by backend |
| Social notifications | render/read actions | canonical notification state | authenticated API | notifications/social | notification services | UI does not invent delivery state |
| Managed media | local selection/upload progress only | canonical approval/object lifecycle authority | backend-managed upload/provider boundary | Social/Labs media flows | managed-media services/providers | provider object keys/secrets stay server-only |
| Push registration | native permission/token acquisition + registration request | canonical device registration/outbox authority | notifications API/provider via backend | notifications capability | push registration/outbox services | provider credentials server-only |
| Push delivery | local receipt/tap handling | canonical enqueue/retry/provider transport authority | APNs/FCM through backend | notification handlers | push worker/transport | source support does not prove external delivery |
| HealthKit / Health Connect readings | platform permission/read boundary; bounded local derived integration | no invented server authority unless an explicit contract stores data | native platform APIs | `src/features/health/` | only if explicit backend contract exists | preserve platform privacy/permission rules |
| Canonical Knowledge concepts/articles | render published immutable versions | shared canonical publication authority | authenticated/public bounded API as reviewed | `src/features/knowledge/` | `src/modules/knowledge/` | published versions are immutable evidence boundaries |
| Knowledge sources/claims/quizzes | render only end-user-safe fields | canonical editorial/review authority | backend DTOs | Knowledge reader/quiz | Knowledge module/editorial services | editorial internals never leak to end-user DTOs |
| Learning state | bounded account state UI/retry behavior | account-owned server authority | authenticated API + bounded retry queue | Knowledge state UI | Knowledge learning-state services | outside private fitness AppState sync |
| Learning paths | render immutable reviewed path versions | canonical reviewed curriculum authority | backend DTOs | Knowledge navigation | Knowledge module | no XP/locks/punishment mechanics |
| Coach → Learn mapping | render optional recommendation | deterministic allowlisted mapping authority | Coach/Knowledge backend contract | Coach run detail | Coach + Knowledge mapping services | no model-selected arbitrary article IDs |
| App appearance | local user preference/presentation | none required | local app settings | settings/theme | none | not server truth unless explicit future contract |
| Localization | presentation resources | none | bundled source | `src/localization/` | none | user-facing copy stays localized |
| Observability/support diagnostics | bounded local collection/display | backend may own server diagnostics | privacy-safe diagnostics only | `src/observability/` | backend observability | no tokens/raw health/private provider payloads |
| Provider credentials | none | backend/environment authority | server secrets only | never mobile | provider adapters/config | never `EXPO_PUBLIC_*`, source, logs, or UI |
| Production deployment state | none | deployment/platform authority | CI/CD/runtime platform | release UI only if any | backend deployment config | merge is not deployment |
| Admin/editorial actions | mobile has no implicit authority | backend/admin authorization boundary | admin surface/API | none unless explicit consumer | backend admin | ordinary authenticated user is not admin/editor |

## Cross-domain ownership rules

### Private fitness sync versus server-authoritative domains

Do not put these into private revisioned fitness `AppState` sync merely because the mobile UI needs them:

- auth/session/device rows;
- Labs documents/results/jobs;
- Social/Stories/notifications;
- managed media;
- canonical Knowledge content;
- account learning state;
- canonical Coach run authority;
- provider delivery/job state.

### Derived state

A derived value is safe to keep presentation-local only when all are true:

- canonical inputs already exist;
- the value can be deterministically recomputed;
- no other device/service needs to treat the derived value as canonical;
- losing the derived value does not lose user-authored meaning;
- it does not become a hidden mutation authority.

If any condition fails, inspect architecture before persisting it.

### Ownership identifiers

Backend user-owned reads/writes derive ownership from the authenticated session. Do not trust `userId`, `ownerId`, or `accountId` supplied by an untrusted mobile payload as authority.

## Before adding new state

Ask in this order:

1. Does an existing canonical entity already represent this fact?
2. Is this merely presentation/derived state?
3. Is it private offline-first fitness data or a server-authoritative domain?
4. Does it need cross-device synchronization?
5. Who owns deletion/export/privacy lifecycle?
6. What happens during offline/retry/duplicate delivery/conflict?
7. Does the backend need a schema/API contract before mobile persistence exists?

If these questions are not answerable from current source and focused architecture, do not invent a new store ad hoc.

## Maintenance rule

Update this map only when an authority boundary materially changes or a new durable domain/entity family is introduced. Leaf implementation movement belongs in `PROJECT_MAP.md` or the live tree, not here.
