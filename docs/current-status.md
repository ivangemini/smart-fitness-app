# Smart Fitness Current Status

Updated: 2026-08-14

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current merged runtime/source baseline at this checkpoint includes:

- Stories S10 mobile PR #643;
- Phase 12 Labs + Settings PR #644;
- native push contract/readiness foundation PR #647;
- Labs interpretation repository boundary PR #648;
- Labs interpretation state controller PR #653;
- Steps provider-neutral runtime source seam PR #651, merged as `b71e1f6bf3724238ebef4aebc67350d4260fbb5b` after complete exact-head Mobile CI;
- post-merge Mobile CI for the Steps main tree also passed repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Active mobile source PR:

- #654 — Labs interpretation composition through `LabsContext`.
- The branch is based on the merged Steps baseline.
- It loads interpretation capability with Labs state, exposes explicit run/capability actions, fails closed when unavailable, retains previous output only for the originating document and uses request-generation invalidation so a late async response cannot overwrite a newer document/run or a reset/logout state.
- External interpretation-provider activation and a user-facing diagnosis/treatment mutation are not part of this source PR.

Prepared but unpublished mobile source:

- branch `feat/p14-mobile-registration-client` — authenticated push registration repository and readiness coordinator. It has no PR at this checkpoint and is not merged/CI-validated source.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Merged source baseline includes:

- Stories S10 backend PR #229;
- Phase 12 Labs backend PR #230;
- provider-neutral push delivery contracts PR #231.

Active backend source PR:

- #232 — provider-neutral persistent push device registrations and authenticated registration HTTP boundary.
- Current exact head at this checkpoint: `12bf0f03c1d36ee30a06a222341a3de9f56d735d`.
- Required exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI remain the merge gates.

## Phase 14 status

`docs/roadmap/phase14-active-workstreams.md` is the focused active roadmap.

Phase 14 is an explicitly prioritized product/source program, not a new broad refactor phase. Its four workstreams are:

1. Labs completion;
2. Stories runtime/evidence completion;
3. real-push source/runtime preparation;
4. Steps/native health activity.

Provider/native/deployment activation remains separately gated from source completion.

## Stories

Stories S10 source is merged across backend/mobile.

Established source authority includes:

- owner-only viewer list;
- Close Friends membership and `following | close_friends` audience;
- bounded private replies with idempotency/retry identity;
- provider-neutral fail-closed push preference state;
- owner Archive/Highlights lifecycle;
- existing S9 camera/caption/overlay/Like/Reaction/in-app-notification foundation.

Remaining Phase 14 Stories work is runtime/evidence validation using `docs/qa/stories-s10-runtime-matrix.md` plus bounded fixes for reproduced defects.

Do not convert missing runtime evidence into duplicate source work. Chronological Following ordering and server-authoritative Social/Stories ownership remain unchanged.

## Labs and Settings

Phase 12 backend/mobile source is merged.

Established Labs source includes:

- visible Labs primary tab;
- private owner-scoped document lifecycle;
- signed/private image-upload seam;
- provider-neutral extraction/processing foundation;
- explicit review-before-confirmation;
- deterministic biomarker normalization and source reference preservation;
- confirmed biomarker history;
- 3M / 6M / 1Y / All windows;
- bounded multi-marker trends;
- relative-to-reference visualization only with valid two-sided source-lab interval;
- panel comparison and attention surfaces;
- read-only bounded Coach/Labs service;
- account-deletion/export/privacy lifecycle;
- Dynamic Type, safe-area, keyboard, accessibility-summary and Reduce Transparency source hardening.

Interpretation source foundation:

- backend confirmed-context builder/orchestration/audit is merged through Phase 12;
- mobile repository boundary #648 is merged;
- mobile state controller #653 is merged;
- active PR #654 composes capability/run state into `LabsContext` and prevents stale cross-document async writes.

Still gated:

- production object storage/OCR/model provider configuration;
- production backend deployment/migration execution;
- PDF mobile native picker/dependency;
- model-tool exposure policy;
- physical-device/provider/runtime evidence.

Settings Phase 12 grouped information architecture is merged and currently compliant. No new Settings churn is justified without a reproduced defect or explicit product change.

## Steps

Provider-neutral Steps source seam is merged through #651.

Merged behavior:

- typed daily-step activity source;
- fail-closed runtime registry;
- default `unavailable` source;
- daily aggregate hook;
- no fake steps;
- no workout-derived step inference;
- no HealthKit/Health Connect activation.

Remaining work is the separately gated native package: reviewed dependencies/adapters, explicit user permission UX, platform-specific semantics and physical-device evidence.

## Push delivery

### Merged source foundation

- backend provider-neutral delivery contracts #231;
- mobile native contract/readiness foundation #647.

### Active backend #232

Current source scope includes:

- migration `0051_push_device_registrations.sql`;
- Drizzle migration-journal registration for 0051;
- canonical schema/table registration;
- authenticated `POST /v1/push/registrations`;
- owner-scoped non-enumerating `DELETE /v1/push/registrations/:deviceId`;
- strict iOS/APNs and Android/FCM request validation;
- registration response that does not echo reusable delivery credential material;
- owner-scoped active listing/invalidation store;
- atomic provider/credential handoff so a current authenticated registration cannot leave a stale previous-owner active route;
- account-deletion cascade;
- technical data inventory;
- Data Access Export policy that inventories registration state but marks routing/credential material as excluded secret state;
- existing backend logger body/token redaction covering the registration endpoint.

Important PostgreSQL finding repaired during #232 validation:

- the 0051 SQL file initially existed but was missing from Drizzle `meta/_journal.json`;
- therefore `db:migrate` reported success while never executing 0051;
- journal entry `idx: 51` was added and formatted;
- subsequent PostgreSQL validation applied all migrations, passed migration idempotency and passed actual migrated-schema validation before continuing to broader Social/sync PostgreSQL suites.

### Prepared mobile registration client

The unpublished mobile branch currently establishes:

- authenticated register/unregister repository;
- one refresh retry after HTTP 401;
- no backend request without authenticated access token;
- strict response parsing and response-to-request device/platform/provider binding;
- readiness coordinator that never requests notification permission implicitly;
- no backend registration until permission and native credential readiness already exist.

Future composition must reuse existing `AuthSession.device.id`; do not invent another device identity.

`docs/architecture/push-registration-lifecycle.md` defines the unresolved activation lifecycle: explicit permission UX, pre-logout/server-assisted cleanup, offline logout, account switching, credential rotation, provider invalid-token feedback, retry/dead-letter policy and physical-device isolation evidence.

## Home / active program

Home active-program selection remains source/CI-complete across backend/mobile.

Preserve:

- nullable owner-private `fitness_profiles.active_training_program_id`;
- `null` product-default mode;
- no training-program FK, preserving offline/out-of-order sync and stale-reference repair;
- canonical mobile selector identity through existing training-program sync mapping;
- explicit Set active / Use default actions;
- clear-on-active-program-delete;
- post-pull stale-reference repair;
- deterministic Home schedule resolution from the selector rather than favorite/recency/array order.

## LG-4 / LG-5

- LG-4 Workouts source convergence remains complete.
- LG-5 remains closed at **38 demonstrated-defect runtime batches**.
- PR #617 remains a later bounded Program Builder persistence regression fix and is not LG-5 batch #39.
- Future reproduced regressions may receive bounded fixes; completion does not authorize manufactured refactor work.

## CI execution

Mobile authoritative routine CI uses `[self-hosted, linux, x64, hermes-mobile-ci]` and requires:

- repository/changed-file line limits;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- Expo Doctor.

Backend authoritative routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` and requires the applicable combination of:

- lint/format/build/full tests;
- production-config validation;
- PostgreSQL migration/schema/API/sync validation;
- Account Deletion Receipt CI for schema/privacy changes.

Do not substitute source CI for physical-device/provider/deployment evidence.

## Current remaining roadmap

1. Finish exact-head Mobile CI and merge Labs context PR #654 if green/review-clean.
2. Finish backend #232 through Backend CI, PostgreSQL CI and Account Deletion Receipt CI; fix demonstrated source/privacy/schema defects only.
3. After backend #232 is merged, rebase/validate the prepared mobile push-registration branch and publish it as a separate bounded PR in a later publish workflow.
4. Synchronize canonical implementation plan, roadmap index, current status and handoff from final merged SHAs.
5. Collect Stories runtime evidence from the dedicated matrix when the required environments/devices are authorized.
6. Enter native push/HealthKit/Health Connect/PDF/provider packages only after their explicit gates are opened.
7. Keep feed ranking/retention and broad Coach/Companion expansion deferred unless explicitly reprioritized.

## Safety / activation boundaries

Do not perform without direct authorization:

- OTA/EAS publication;
- native build/install;
- backend deployment;
- production migration execution;
- production data access/mutation;
- APNs/FCM activation;
- provider credential configuration/rotation;
- HealthKit/Health Connect activation;
- native PDF/health/push dependency introduction solely to bypass a reviewed gate;
- DNS changes;
- destructive production cleanup;
- app-store submission.

Source-complete provider, worker, health, push and release seams are prerequisites for those actions, not authorization to perform them.
