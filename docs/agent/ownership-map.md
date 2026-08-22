# Agent Ownership Map

Updated: 2026-08-22

## Purpose

Use this file to answer **who owns truth** before changing data, state, persistence, or behavior. It is a navigation/impact aid, not a replacement for exact schemas, services, focused architecture, or privacy documentation.

The most dangerous agent mistake in this project is creating a second source of truth because a screen needs data quickly. When ownership is unclear, inspect the exact source and focused architecture before adding state.

## Ownership classes

### A. Private offline-first fitness state

Mobile owns the local working copy. Backend owns synchronized revision/conflict/tombstone authority for the account copy.

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

### E. Private local media

Some account-owned media is intentionally local and does **not** belong to revisioned fitness sync or backend-managed media. Phase 20 Progress Photos use this class.

```text
progress-photo metadata
→ app-owned native document storage
→ account cleanup/privacy lifecycle
→ derived comparison/body-composition presentation
```

Do not silently convert this class into cloud sync, Social media, provider-managed media or AI-vision input. That requires a separately reviewed storage/privacy/sync contract.

## Domain matrix

| Domain / entity | Mobile authority | Backend authority | Persistence / transport | Primary mobile entry | Key invariant |
| --- | --- | --- | --- | --- | --- |
| Weight history | local working copy | revision/conflict/tombstone account authority | AsyncStorage + sync | progress/state/sync | stable IDs, timestamps, revisions |
| Completed workout sessions/sets | local working copy | revisioned account authority | AsyncStorage + sync | workouts/state/sync | completed history is not casually rewritten |
| Workout templates | local working copy | revisioned account authority | AsyncStorage + sync | workouts/state/sync | preserve template IDs/references |
| Training programs | local working copy | revisioned account authority | AsyncStorage + sync | workouts/programs/state | coordinated lifecycle and IDs |
| Custom exercises | local working copy | revisioned account authority | AsyncStorage + sync | exercises/state | canonical cross-entity references remain valid |
| Food entries | local working copy | revisioned account authority | AsyncStorage + sync | nutrition/state | diary semantics and IDs remain stable |
| Nutrition targets | local working copy | revisioned account authority | AsyncStorage + sync | nutrition/state | confirmation/application stays explicit |
| Meal templates | local working copy | revisioned account authority | AsyncStorage + sync | nutrition/state | nested snapshots remain contract-valid |
| Nutrition library items | local working copy | account-scoped revisioned authority | AsyncStorage + sync | nutrition/state | ownership/conflict semantics preserved |
| Fitness profile | local working copy | revisioned account authority | AsyncStorage + sync | profile/goals/state | canonical input to derived logic |
| User limitations | local working copy | revisioned account authority | AsyncStorage + sync | profile/safety state | safety inputs are never silently dropped |
| Recovery check-ins | local working copy | revisioned account authority | AsyncStorage + sync | safety/recovery state | preserve timestamps/safety semantics |
| Body measurements | local working copy | revisioned account authority | AsyncStorage + sync | progress/state | typed measurements/units remain explicit |
| Progress photos | private account-owned local-media authority | none in reviewed Phase 20 scope | app-owned native document storage + local metadata | `src/features/progressPhotos/` | private by default; re-encode imports; no cloud/social/provider upload or image-derived body-fat authority |
| Progress-photo comparison | derived/read-only | none | none beyond source photos | progressPhotos comparison | same-pose/chronology/aspect checks fail closed; no registration/measurement claim |
| Authentication | bounded client session state only | canonical account/auth authority | API + SecureStore tokens | `src/auth/`, `src/api/` | client payload never chooses ownership |
| Access/refresh tokens | SecureStore only | issuance/revocation authority | SecureStore + auth API | `src/auth/` | tokens never enter ordinary AppState/cache |
| Sessions/devices | display/actions only | canonical authority | authenticated API | settings/account/auth | ownership from authenticated session |
| Sync conflicts/revisions | local unresolved UI/recovery state | canonical revision/conflict authority | sync protocol | `SyncContext`, `src/cloud/` | cursor/revision safety; no silent overwrite |
| Coach runs | render result/provenance; explicit confirmation UI | canonical run/orchestration/provenance authority | authenticated API | `src/features/coach/` | model output is not direct mutation authority |
| Coach calculations/guardrails | bounded presentation | deterministic backend workers own server-run authority | API | Coach UI/helpers | hard guardrails stay outside model prose |
| Coach confirmations | explicit user action only | validates/applies server mutation contract | authenticated API | Coach confirmation surfaces | no automatic application |
| Companion progression v1 | deterministic derived presentation from completed workout days | none required for v1 | recomputed locally | `src/features/companion/` | no duplicate persisted truth |
| Labs documents | upload/review UI only | canonical private document authority | authenticated API / managed storage via backend | `src/features/labs/` | raw docs never ordinary AppState/Social truth |
| Labs extraction drafts | reviewable draft presentation | canonical draft/job authority | authenticated API | Labs review flows | draft is not confirmed result |
| Confirmed Labs results | render/query structured facts | canonical confirmed-result authority | authenticated API | Labs result/history/compare | confirmed facts authoritative |
| Social profile/relationships | render/actions | canonical authority | authenticated API | `src/features/social/` | no fabricated relationship state |
| Social workout posts | explicit sharing UI; render snapshots | canonical post/feed authority | authenticated API | Social/share flows | sharing is explicit |
| Stories | render/create/reply/view actions | canonical lifecycle/audience/archive/highlight authority | authenticated API | Social/Stories | visibility/expiry owned by backend |
| Social notifications | render/read actions | canonical notification state | authenticated API | notifications/social | UI does not invent delivery state |
| Managed media | local selection/upload progress only | canonical approval/object lifecycle authority | backend-managed provider boundary | Social/Labs media | provider object keys/secrets server-only |
| Push registration | native permission/token acquisition + request | canonical registration/outbox authority | notifications API/provider via backend | notifications | provider credentials server-only |
| Push delivery | receipt/tap handling | canonical enqueue/retry/provider transport authority | APNs/FCM via backend | notification handlers | source support does not prove external delivery |
| HealthKit / Health Connect readings | platform permission/read boundary | none unless explicit storage contract exists | native platform APIs | `src/features/health/` | preserve platform privacy/permission rules |
| Canonical Knowledge concepts/articles | render immutable published versions | shared publication authority | bounded API | `src/features/knowledge/` | published versions are immutable evidence boundaries |
| Knowledge sources/claims/quizzes | render end-user-safe fields | canonical editorial/review authority | backend DTOs | Knowledge reader/quiz | editorial internals never leak |
| Learning state | bounded account-state UI/retry behavior | account-owned server authority | authenticated API + bounded retry queue | Knowledge state UI | outside private fitness AppState sync |
| Learning paths | render immutable reviewed path versions | canonical reviewed curriculum authority | backend DTOs | Knowledge navigation | no XP/locks/punishment mechanics |
| Coach → Learn mapping | render optional recommendation | deterministic allowlisted mapping authority | Coach/Knowledge backend contract | Coach run detail | no model-selected arbitrary article IDs |
| App appearance | local preference/presentation | none required | local settings | settings/theme | not server truth unless explicit future contract |
| Localization | presentation resources | none | bundled source | `src/localization/` | user-facing copy stays localized |
| Observability/support diagnostics | bounded local collection/display | backend may own server diagnostics | privacy-safe diagnostics only | `src/observability/` | no tokens/raw health/provider payloads |
| Provider credentials | none | backend/environment authority | server secrets only | never mobile | never `EXPO_PUBLIC_*`, source, logs or UI |
| Production deployment state | none | deployment/platform authority | CI/CD/runtime platform | none | merge is not deployment |
| Admin/editorial actions | no implicit mobile authority | backend/admin authorization boundary | admin surface/API | none | ordinary authenticated user is not admin/editor |

## Cross-domain ownership rules

### Private fitness sync versus other authority classes

Do not put these into private revisioned fitness `AppState` sync merely because the mobile UI needs them:

- auth/session/device rows;
- Labs documents/results/jobs;
- Social/Stories/notifications;
- backend-managed media;
- canonical Knowledge content;
- account learning state;
- canonical Coach run authority;
- provider delivery/job state;
- Progress Photo binary media.

Progress Photos also must not be silently routed into backend-managed media. Their reviewed Phase 20 authority is local app-owned media with explicit account cleanup and privacy behavior.

### Derived state

A derived value is safe to keep presentation-local only when all are true:

- canonical inputs already exist;
- it can be deterministically recomputed;
- no other device/service treats it as canonical;
- losing it does not lose user-authored meaning;
- it does not become hidden mutation authority.

### Ownership identifiers

Backend user-owned reads/writes derive ownership from the authenticated session. Do not trust `userId`, `ownerId`, or `accountId` supplied by an untrusted mobile payload as authority.

## Before adding new state

Ask in this order:

1. Does an existing canonical entity already represent this fact?
2. Is this presentation/derived state?
3. Is it private offline-first fitness data, private local media or a server-authoritative domain?
4. Does it need cross-device synchronization?
5. Who owns deletion/export/privacy lifecycle?
6. What happens during offline/retry/duplicate delivery/conflict?
7. Does backend schema/API authority need to exist before mobile persistence?

If these questions are not answerable from current source and focused architecture, do not invent a new store ad hoc.

## Maintenance rule

Update this map only when an authority boundary materially changes or a new durable domain/entity family is introduced. Leaf implementation movement belongs in `PROJECT_MAP.md` or the live tree, not here.
