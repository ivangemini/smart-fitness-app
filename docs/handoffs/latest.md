# Latest Handoff

Updated: 2026-08-14

Exact Git history, source and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Merged Phase 14-adjacent source at this checkpoint:

- Stories S10 mobile #643;
- Phase 12 Labs + Settings #644;
- native push contract/readiness #647;
- Labs interpretation repository boundary #648;
- Labs interpretation state controller #653;
- Steps provider-neutral runtime seam #651, merged as `b71e1f6bf3724238ebef4aebc67350d4260fbb5b` after complete exact-head Mobile CI. Post-merge main CI also passed the full Mobile gate.

Active mobile PR:

- #654 — `LabsContext` interpretation composition.
- Current head at this handoff: `bcf7372868b1721ff298714e0999bf4071f12a2e`.
- Branch is based on the merged Steps baseline.
- It loads interpretation capability with Labs state, exposes explicit run/capability actions, fails closed when unavailable, retains previous output only for the originating document and uses request-generation invalidation so a late response from an older document/run cannot overwrite newer state or a reset/logout state.
- Exact-head Mobile CI is required before merge.

Prepared but unpublished mobile branch:

- `feat/p14-mobile-registration-client` — authenticated push registration repository + readiness coordinator. No PR. Do not describe as merged or CI-validated source.

Documentation consolidation branch:

- `docs/p14-runtime-completion` — intentionally no PR in this publish workflow.
- It now updates the Phase 14 roadmap, Labs roadmap, roadmap index, current status, Stories runtime matrix, push lifecycle contract and this handoff.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Merged baseline:

- Stories S10 backend #229;
- Phase 12 Labs backend #230;
- provider-neutral push delivery contracts #231.

Active backend PR:

- #232 — persistent owner-scoped push registrations and authenticated registration HTTP boundary.
- Current exact head at this handoff: `12bf0f03c1d36ee30a06a222341a3de9f56d735d`.
- Required gates: Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI.

## Phase 14 workstreams

Focused roadmap: `docs/roadmap/phase14-active-workstreams.md`.

### P14-A — Labs interpretation composition

Active PR #654.

Current source contract:

- capability loads alongside Labs documents/markers;
- `LabsContext` exposes typed interpretation state, capability refresh and explicit run action;
- unavailable capability fails closed;
- unauthenticated/reset refresh clears interpretation state;
- previous output is retained only for the same document ID;
- request-generation guards reject stale async writes from earlier documents/runs or pre-reset requests;
- no external model provider activation;
- no raw OCR draft interpretation path;
- no treatment/diagnostic mutation.

A user-facing confirmed-result interpretation card was investigated but is not part of #654 because the screen mutation was rejected by the tooling boundary. Do not claim that presentation surface as merged.

### P14-B — Push registration persistence and HTTP boundary

Active backend PR #232.

Current source contract:

- migration `0051_push_device_registrations.sql`;
- 0051 registered in Drizzle `meta/_journal.json` as `idx: 51`;
- canonical Drizzle table/schema export;
- authenticated `POST /v1/push/registrations`;
- owner-scoped non-enumerating `DELETE /v1/push/registrations/:deviceId`;
- strict iOS/APNs and Android/FCM request validation;
- response deliberately excludes reusable delivery credential material;
- owner-scoped active list/invalidation store;
- atomic provider/credential handoff so an account switch cannot leave the old owner as the active route;
- logger body/token redaction covers the new endpoint;
- technical data inventory includes the table without rewriting unrelated privacy documentation;
- Data Access Export inventories the state but classifies routing/credential material as `excluded_secret`, `surfaceId=null`, `rowScope=none`;
- account deletion owns final cascade cleanup.

Important repaired PostgreSQL defect:

- the 0051 SQL file initially existed but was missing from Drizzle `_journal.json`;
- therefore `db:migrate` did not execute 0051 even though the migration command itself succeeded;
- after adding the journal entry, PostgreSQL CI successfully applied all migrations, passed migration idempotency and passed actual migrated-schema validation before entering broader Social/sync PostgreSQL tests.

### P14-C — Steps

Provider-neutral source seam is **merged** through #651.

Merged behavior:

- fail-closed runtime activity source;
- default `unavailable` source;
- daily aggregate hook;
- no fake or workout-derived steps;
- no HealthKit/Health Connect activation or native dependency in this package.

Remaining work is the separately gated native adapter/permission/device-evidence package.

### P14-D — Stories runtime evidence

Stories S10 source is merged. Remaining work is evidence/runtime validation only unless a defect is reproduced.

The runtime matrix is consolidated on the docs branch at `docs/qa/stories-s10-runtime-matrix.md`. Existing PR #650 remains stale-ancestry documentation work and is not a source blocker.

## Prepared mobile Push source

Branch: `feat/p14-mobile-registration-client`.

Prepared source currently establishes:

- authenticated registration/unregister repository;
- one access-token refresh retry after HTTP 401;
- no network request when authenticated access token is absent;
- strict platform/provider response parsing;
- response device/platform/provider binding to the original request;
- encoded unregister path;
- readiness coordinator that never requests notification permission implicitly;
- no backend registration until permission and native credential readiness already exist.

Future composition must reuse the existing server-issued `AuthSession.device.id`; do not generate a second push-specific device UUID.

`docs/architecture/push-registration-lifecycle.md` records the unresolved real-delivery lifecycle: explicit permission UX, pre-logout or server-assisted cleanup, offline logout, account switching, credential rotation, invalid-provider feedback, retry/dead-letter policy, logging/privacy controls and physical-device evidence.

## CI state / policy

### Mobile

Exact-head runtime/source validation requires:

- repository file line audit;
- changed-file line audit;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- Expo Doctor.

Steps #651 passed this complete gate before merge, and its post-merge main run passed the complete gate again.

### Backend

Exact-head runtime/source validation requires the applicable combination of:

- lint/format/build/full tests;
- production-config validation;
- PostgreSQL migration/schema/API/sync validation;
- Account Deletion Receipt CI for relevant schema/privacy changes.

For #232, migration application, idempotency and migrated-schema validation have already passed on the repaired journal path. Broader PostgreSQL Social/sync tests and the other exact-head workflows remain required before merge.

## Privacy / lifecycle findings to preserve

- Push routing/credential state is account-owned but security-sensitive and is excluded from Data Access Export candidate surfaces.
- Push registration API responses do not echo the stored delivery credential.
- Backend logger redacts request/response bodies and token-like fields.
- A provider/credential can move atomically to the current authenticated owner, preventing stale account delivery ownership during account switching.
- Mobile push composition must use the existing authenticated device identity.
- Real delivery must define logout/offline-logout behavior before activation.
- Labs interpretation consumes confirmed structured data; raw OCR drafts are not authoritative health history.
- Stories remain server-authoritative and outside private revisioned `AppState` sync.

## Next execution order

1. Finish exact-head Mobile CI for #654, check review threads, squash-merge if green.
2. Finish backend #232 exact-head Backend CI + PostgreSQL CI + Account Deletion Receipt CI; fix only demonstrated failures and distinguish runner teardown flakes from source defects.
3. After #232 merges, rebase/validate the prepared mobile registration client and publish it as a separate bounded PR in a later publish workflow.
4. Synchronize canonical docs from the final merged SHAs before publishing the docs consolidation branch.
5. Enter native/provider/runtime evidence work only when its explicit gate is opened.

## Closed activation gates

Without direct authorization, do not:

- deploy the backend;
- execute production migrations;
- activate APNs/FCM;
- add/rotate provider credentials;
- request native notification permission implicitly;
- activate HealthKit/Health Connect;
- add native PDF/health/push dependencies solely to bypass a reviewed gate;
- publish OTA/EAS;
- build/install native releases on physical devices;
- access or mutate production data;
- submit to app stores.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, exercise repository/provider behavior, Social/Stories authority/privacy, Coach auth/API contracts, active-program owner authority, backend ownership/revision/idempotency semantics or privacy/export boundaries as incidental follow-up.

Potentially long collections retain suitable virtualized boundaries with stable identity. Keyboard forms retain active-input/primary-action reachability. Safe-area ownership remains singular per edge. Keep `docs/architecture/local-state-performance-decision.md` referenced from the canonical implementation plan. There is no separate autonomous broad refactor phase unless explicitly prioritized again.
