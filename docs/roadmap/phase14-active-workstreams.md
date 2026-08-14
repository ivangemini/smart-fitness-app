# Phase 14 — Active product workstreams

Updated: 2026-08-14

Status: explicitly prioritized bounded completion program; provider/native/deployment activation remains separately gated.

This is the focused Phase 14 roadmap. Exact code, tests and Git history remain authoritative.

## Verified merged baseline

### Mobile

Current `main`: `7036cb0257fe38a945ec18726389954c82641dd3`.

Merged Phase 14-adjacent work now includes:

- Stories S10 #643;
- Phase 12 Labs + Settings #644;
- native push readiness #647;
- Labs interpretation repository #648;
- Steps runtime source #651;
- Labs interpretation controller #653;
- Labs context composition #654;
- authenticated push-registration client #656;
- confirmed-result Labs interpretation UI #657.

### Backend

Current `main`: `404963da88939ab2913a5f8a72ae90a51f77459f`.

Merged push work now includes:

- provider-neutral contracts #231;
- persistent registrations/API #232;
- current-device logout cleanup #233;
- remote-session/revoke-others cleanup #234.

There are no open PRs in either repository at this checkpoint.

Prepared next branch: backend `feat/p14-push-delivery-outbox-worker`, currently equal to `main` with no additional commit.

## Active workstreams

### P14-A — Real push delivery

**Status: active and highest-priority source workstream.**

#### Completed source foundation

Backend:

- typed provider-neutral delivery contracts;
- `push_device_registrations` persistence and migration/journal/schema parity;
- authenticated register/unregister boundary;
- strict platform/provider validation;
- token/account handoff with no stale active previous owner;
- credential redaction and export exclusion;
- current-device invalidation on logout (#233);
- remote-session and revoke-others invalidation (#234).

Mobile:

- typed native readiness seam;
- authenticated register/unregister repository;
- one auth-refresh retry after 401;
- fail-closed no-session behavior;
- strict response binding;
- readiness coordinator that does not request permission implicitly;
- reuse of existing `AuthSession.device.id`.

#### Current package — durable outbox/delivery worker

Branch: `feat/p14-push-delivery-outbox-worker`.

Required design:

- durable PostgreSQL outbox jobs;
- per-device/registration delivery identity without duplicating raw reusable credentials into ordinary job payloads where avoidable;
- atomic claim/lease semantics for concurrent workers;
- bounded retry/backoff using the existing retry policy;
- injected provider transport boundary;
- stale-worker finalization protection through claim identity;
- deterministic terminal/retry state;
- permanent invalid-token feedback scoped to the exact attempted registration so delayed provider responses cannot invalidate a newer credential;
- privacy/data-inventory/account-deletion coverage for new persistent state;
- exact-head Backend CI + PostgreSQL CI.

The worker package does **not** activate provider credentials, APNs/FCM, deployment or production scheduling.

#### Later push packages

After the outbox/worker is merged:

1. enqueue eligible notification events into the outbox without widening Social/private data exposure;
2. concrete APNs/FCM provider adapter(s) behind the reviewed transport contract;
3. permanent invalid-token/provider-feedback composition;
4. explicit native permission UX;
5. native credential acquisition/rotation and synchronization;
6. offline logout/reconnect convergence;
7. notification content/privacy policy and deep-link routing;
8. Story interaction external-delivery composition;
9. physical-device and second-account/device isolation evidence.

Online logout/session-revocation cleanup is already implemented and must not be duplicated.

### P14-B — Labs / Analyses completion

**Status: provider-neutral source composition complete; provider/native/runtime work gated.**

Merged source now includes:

- confirmed-data repository/state/controller/context interpretation path;
- fail-closed capability handling;
- stale async generation invalidation;
- confirmed-document-only run boundary;
- bounded confirmed-result presentation (#657);
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

**Status: provider-neutral source seam complete; native package gated.**

Merged contract:

- fail-closed runtime source registry;
- daily aggregate hook;
- deterministic unavailable state;
- no fake/workout-derived steps;
- no raw health samples in Social/telemetry/model context.

Remaining:

- reviewed iOS HealthKit read-only adapter/dependency;
- reviewed Android Health Connect adapter/dependency;
- explicit user-initiated permission/disclosure UX;
- timezone/day-boundary semantics;
- denied/unsupported paths;
- physical-device evidence;
- Home presentation after real aggregate data is available.

## Parallel execution rules

Independent work may proceed in parallel only when contracts/files do not overlap.

Good candidates:

- push worker internals vs read-only Stories evidence collection;
- Labs runtime/provider planning vs push backend work;
- Steps dependency review vs backend push work when no shared package/app config is edited.

Shared authentication lifecycle, database schema/journal, package manifests, root configuration and canonical roadmap files require deliberate integration rather than concurrent overlapping branches.

## Validation gates

### Mobile source

Exact-head Mobile CI requires:

- repository/changed-file line audits;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- Expo Doctor.

### Backend source

Applicable exact-head gates include:

- Backend CI;
- Backend PostgreSQL CI;
- Account Deletion Receipt CI for schema/privacy/account lifecycle changes.

### Native/provider/runtime

Native push/health packages require native build and physical-device evidence before runtime-complete status. Provider-backed Labs/push work requires configured-environment evidence before activation-complete status.

Source CI does not substitute for those gates.

## Current execution order

1. Build durable push outbox/delivery worker from backend `404963d`.
2. Exact-head validate/review/merge that bounded worker package.
3. Add enqueue/provider-feedback composition as the next smallest non-overlapping push package.
4. Enter concrete APNs/FCM/native push activation only after explicit authorization.
5. Keep Labs source closed unless a concrete defect appears; otherwise next Labs work is provider/native/runtime evidence.
6. Collect Stories runtime evidence in authorized environments.
7. Enter HealthKit/Health Connect only after explicit native dependency/permission authorization.
8. Synchronize canonical status/roadmap/handoff after material merges.

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
