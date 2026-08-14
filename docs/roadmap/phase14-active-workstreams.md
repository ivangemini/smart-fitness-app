# Phase 14 — Active product workstreams

Updated: 2026-08-15

Status: explicitly prioritized bounded completion program; provider/native/deployment activation remains separately gated.

This is the focused Phase 14 roadmap. Exact code, tests and Git history remain authoritative.

## Verified merged baseline

### Mobile

Latest runtime/source merge: `2d34fca37bfed92289b097f89ccb8b36d13a1353` (#659).

Merged Phase 14-adjacent work includes:

- Stories S10 #643;
- Phase 12 Labs + Settings #644;
- native push readiness #647;
- Labs interpretation repository #648;
- Steps runtime source #651;
- Labs interpretation controller #653;
- Labs context composition #654;
- authenticated push-registration client #656;
- confirmed-result Labs interpretation UI #657;
- Steps local-day/DST/fail-closed source semantics #659.

### Backend

Latest runtime/source merge: `dc99dd4d483acfd47c03e0bab9801b7d7d8f6634` (#238).

Merged push work includes:

- provider-neutral contracts #231;
- persistent registrations/API #232;
- current-device logout cleanup #233;
- remote-session/revoke-others cleanup #234;
- durable outbox/delivery worker #237;
- Story interaction enqueue/source-removal cancellation #238.

There are no open runtime/source PRs in either repository at this checkpoint.

## Active workstreams

### P14-A — Real push delivery

**Status: provider-neutral durable source path complete through Story enqueue; external provider/native/runtime activation remains gated.**

#### Completed source foundation

Backend:

- typed provider-neutral delivery contracts;
- `push_device_registrations` persistence and migration/schema parity;
- authenticated register/unregister boundary;
- strict platform/provider validation;
- token/account handoff with no stale active previous owner;
- credential redaction and export exclusion;
- current-device invalidation on logout (#233);
- remote-session and revoke-others invalidation (#234);
- durable PostgreSQL outbox jobs (#237);
- per-device idempotency identity without duplicating raw reusable credentials into the outbox;
- claim/lease semantics for concurrent workers (#237);
- bounded retry/backoff using the existing retry policy (#237);
- injected provider transport boundary (#237);
- stale-worker finalization protection through claim identity (#237);
- exact-registration invalid-token invalidation and credential-rotation protection (#237);
- Story like/reaction/reply enqueue behind explicit provider availability and owner preference (#238);
- cancellation of undelivered Story jobs on direct interaction removal and Story deletion/expiry (#238);
- cancellation of already-claimed jobs with stale-finalization fencing (#238);
- permanent PostgreSQL regression coverage for the durable lifecycle and Story source-removal path.

Mobile:

- typed native readiness seam;
- authenticated register/unregister repository;
- one auth-refresh retry after 401;
- fail-closed no-session behavior;
- strict response binding;
- readiness coordinator that does not request permission implicitly;
- reuse of existing `AuthSession.device.id`.

#### Remaining push work

The remaining large work crosses provider/native/runtime gates:

1. concrete APNs/FCM provider adapter implementation and configured-environment evidence;
2. provider credentials and production worker scheduling;
3. explicit native permission UX;
4. native credential acquisition/rotation and synchronization;
5. offline logout/reconnect convergence;
6. final external notification content/privacy/deep-link policy;
7. physical-device and second-account/device isolation evidence.

Online logout/session-revocation cleanup, durable outbox/worker and Story enqueue/source-removal are already implemented and must not be duplicated.

### P14-B — Labs / Analyses completion

**Status: provider-neutral source composition complete; provider/native/runtime work gated.**

Merged source includes:

- confirmed-data repository/state/controller/context interpretation path;
- fail-closed capability handling;
- stale async generation invalidation;
- confirmed-document-only run boundary;
- bounded confirmed-result presentation;
- reference/trend/data-quality context presentation;
- provider/model provenance display without raw provider payload exposure;
- non-diagnostic/non-treatment user copy.

Remaining:

- production private object storage/OCR/model provider selection/configuration;
- backend deployment/production migration execution;
- PDF native picker/dependency;
- internal Labs/Coach model-tool exposure policy;
- provider/device/accessibility/runtime evidence.

Preserve review-before-confirmation, confirmed-data-only interpretation and private owner scope.

### P14-C — Stories runtime completion

**Status: source-complete; evidence/runtime only unless a defect is reproduced.**

Use `docs/qa/stories-s10-runtime-matrix.md` to distinguish:

1. source/CI evidence;
2. backend runtime/migration evidence;
3. physical-device evidence;
4. second-device/privacy/lifecycle evidence.

Repair only demonstrated runtime defects. Preserve chronological Following semantics and server-authoritative Story visibility/ownership.

### P14-D — Steps / native health activity

**Status: provider-neutral source seam plus local-day boundary/fail-closed semantics complete; native package remains gated.**

Merged source includes:

- fail-closed runtime source registry;
- daily aggregate hook;
- deterministic unavailable state;
- device-local calendar-day query semantics;
- half-open `[local midnight, next local midnight)` native bridge interval;
- DST-safe 23/24/25-hour local-day handling without adjacent-day overlap;
- strict rejection of impossible local calendar dates;
- explicit unsupported/denied fail-closed evidence;
- no fake/workout-derived Steps;
- no raw health samples in Social/telemetry/model context.

Remaining:

- reviewed iOS HealthKit read-only adapter/dependency;
- reviewed Android Health Connect adapter/dependency;
- explicit user-initiated permission/disclosure UX;
- native denied/unsupported runtime evidence;
- physical-device evidence;
- Home presentation after real aggregate data is available.

No HealthKit/Health Connect dependency, entitlement, permission request, native build or activation was introduced by #659.

## Parallel execution rules

Independent work may proceed in parallel only when contracts/files do not overlap.

While activation gates remain closed, useful parallel work is limited to:

- read-only push lifecycle/content/deep-link audits;
- QA/evidence preparation for Stories, Labs and Steps;
- bounded fixes for reproduced defects;
- canonical documentation synchronization.

Do not create new broad source branches merely to keep work moving when the remaining feature work requires a closed gate.

Shared authentication lifecycle, database schema/journal, package manifests, root configuration and canonical roadmap files require deliberate integration rather than concurrent overlapping branches.

## Validation gates

### Mobile source

Exact-head Mobile CI requires:

- repository/changed-file line audits;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- Expo Doctor (currently pinned to released `1.20.1` until a reviewed SDK upgrade is opened).

### Backend source

Applicable exact-head gates include:

- Backend CI;
- Backend PostgreSQL CI;
- Account Deletion Receipt CI for schema/privacy/account lifecycle changes.

### Native/provider/runtime

Native push/health packages require native build and physical-device evidence before runtime-complete status. Provider-backed Labs/push work requires configured-environment evidence before activation-complete status.

Source CI does not substitute for those gates.

## Current execution order

1. Keep canonical docs synchronized to mobile `2d34fca` / backend `dc99dd4d`.
2. Do not reopen the merged durable worker, Story enqueue/source-removal or Steps local-day packages.
3. Continue only read-only audits, QA preparation and bounded reproduced-defect fixes while activation gates remain closed.
4. Enter concrete APNs/FCM/native push only after explicit provider/native authorization.
5. Keep Labs source closed unless a concrete defect appears; otherwise next Labs work is provider/native/runtime evidence.
6. Collect Stories runtime evidence only in authorized environments.
7. Enter HealthKit/Health Connect only after explicit native dependency/permission authorization.
8. Re-synchronize canonical status/roadmap/handoff after material merges.

## Closed activation boundaries

Without direct authorization, Phase 14 work must not:

- deploy backend code;
- execute production migrations;
- schedule/activate production workers;
- activate APNs/FCM or provider credentials;
- request native push permission implicitly;
- activate HealthKit/Health Connect;
- activate production Labs storage/OCR/model providers;
- add new native PDF/health/push dependencies solely to bypass a reviewed gate;
- publish OTA/EAS;
- build/install native releases;
- access/mutate production data;
- submit to app stores.

## Deferred

- Companion pet/cosmetics/naming/richer progression unless reprioritized;
- feed ranking/retention; chronological Following remains authoritative;
- broad Coach product/material expansion;
- DMs/groups/marketplace/subscriptions;
- broad autonomous refactoring outside an active product contract or demonstrated defect.
