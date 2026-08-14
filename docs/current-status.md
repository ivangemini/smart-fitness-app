# Smart Fitness Current Status

Updated: 2026-08-14

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current merged `main`: `7036cb0257fe38a945ec18726389954c82641dd3`.

Recent merged source:

- Stories S10 #643;
- Phase 12 Labs + Settings #644;
- native push readiness foundation #647;
- Labs interpretation repository #648;
- Steps runtime source seam #651;
- Labs interpretation state controller #653;
- Labs context composition #654;
- authenticated mobile push registration client #656;
- confirmed-result Labs interpretation presentation #657.

There are no open mobile PRs at this checkpoint.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current merged `main`: `404963da88939ab2913a5f8a72ae90a51f77459f`.

Recent merged push source:

- #231 — provider-neutral delivery contracts;
- #232 — persistent push registrations and authenticated register/unregister boundary;
- #233 — current authenticated device registration invalidation on logout;
- #234 — remote session and revoke-others registration cleanup.

#234 exact-head `4145b7cad3e87ba53f87e413e76864ba79576a2c` passed Backend CI and Backend PostgreSQL CI with zero review threads before squash merge to `404963d`.

There are no open backend PRs at this checkpoint.

Prepared backend source branch:

- `feat/p14-push-delivery-outbox-worker`, currently equal to backend `main` `404963d` with no additional commit yet.

## Phase 14 status

`docs/roadmap/phase14-active-workstreams.md` is the focused active roadmap.

Phase 14 now consists of:

1. durable/real push delivery completion;
2. Labs provider/native/runtime completion after source composition;
3. Stories runtime evidence and bounded defect repair;
4. Steps native health activity.

Provider/native/deployment activation remains separately gated from source completion.

## Push delivery

### Source-complete foundation

Backend:

- provider-neutral delivery contracts;
- owner/device registration persistence and migration `0051_push_device_registrations`;
- Drizzle journal/schema parity;
- authenticated registration and owner-scoped unregister routes;
- iOS/APNs and Android/FCM route validation;
- registration responses that do not echo reusable credentials;
- atomic provider/token handoff between accounts;
- account-deletion/privacy inventory/export exclusion coverage;
- current-device cleanup on logout #233;
- remote-session and revoke-others cleanup #234.

Mobile:

- typed native readiness contract;
- authenticated register/unregister repository;
- one access-token refresh retry after 401;
- fail before network access without authenticated session;
- strict response/request identity binding;
- readiness coordinator that never requests notification permission implicitly;
- registration bound to existing `AuthSession.device.id`.

### Important lifecycle state

Online server-assisted session cleanup is now source-complete:

- logout invalidates the current authenticated device registration in the same backend transaction as session revocation;
- explicit remote-session deletion invalidates that session device registration;
- revoke-others invalidates only devices returned by the set-based non-current session revocation;
- current session/device registration remains active during revoke-others.

Offline logout/reconnect behavior is still unresolved for real provider activation and remains an explicit lifecycle gate.

### Current next source package

`feat/p14-push-delivery-outbox-worker` targets:

- durable PostgreSQL outbox jobs;
- lease/claim semantics;
- bounded retries/backoff;
- injected provider transport;
- stale-worker finalization protection;
- exact-registration invalid-token cleanup;
- schema/privacy/account deletion coverage as required;
- exact-head Backend CI/PostgreSQL evidence.

No production worker scheduling, APNs/FCM credentials or external delivery is active.

## Labs / Analyses

Phase 12 backend/mobile source is merged and Phase 14 provider-neutral interpretation composition now extends through #657.

Established source includes:

- private server-authoritative document/review/confirmation lifecycle;
- confirmed biomarker history, trends, comparison and attention surfaces;
- review-before-confirmation;
- provider-neutral extraction/processing and interpretation contracts;
- minimum confirmed interpretation context and bounded provenance;
- fail-closed mobile capability/state/context composition;
- stale async run protection;
- confirmed-result interpretation presentation with bounded `reference_context`, `trend_context` and `data_quality_context` findings;
- provider/model provenance display without exposing raw provider payloads;
- explicit copy separating informational context from diagnosis/treatment.

Remaining Labs work is mainly gated runtime/provider/native work:

- production private object storage/OCR/model provider activation;
- backend deployment/migration execution;
- PDF native picker/dependency;
- internal model-tool exposure policy;
- provider/device/accessibility evidence.

## Stories

Stories S10 source is merged across backend/mobile.

Remaining work is runtime/evidence validation through `docs/qa/stories-s10-runtime-matrix.md` plus bounded repairs for reproduced defects.

Do not convert missing deployed/device evidence into duplicate source implementation. Stories remain chronological/server-authoritative and outside private revisioned `AppState` sync.

## Steps

Provider-neutral daily Steps source seam is merged.

Remaining work is separately gated native implementation/evidence:

- HealthKit adapter/dependency;
- Health Connect adapter/dependency;
- explicit permission/disclosure UX;
- timezone/day semantics;
- denied/unsupported paths;
- physical-device evidence;
- real aggregate-driven Home presentation.

No fake/workout-derived steps are allowed.

## Companion

Phase 13 Companion v1 remains the bounded merged baseline. Richer pet/cosmetics/naming/progression is deferred unless explicitly reprioritized.

## CI execution

Mobile authoritative routine CI uses `[self-hosted, linux, x64, hermes-mobile-ci]` and includes line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend authoritative routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` and includes the applicable lint/format/build/tests, PostgreSQL migration/schema/API/sync evidence and account-deletion receipt validation when relevant.

Do not substitute source CI for provider/device/deployment evidence.

## Current remaining roadmap

1. Implement durable push outbox/delivery worker from backend `main` `404963d`.
2. Add the smallest follow-up notification enqueue/provider-feedback package after the worker contract is merged.
3. Complete concrete APNs/FCM/native push permission/token/deep-link runtime only when the provider/native gate is opened.
4. Treat Labs source composition as complete for now; remaining work is provider/native/deployment/device evidence or reproduced defects.
5. Collect Stories runtime evidence in authorized environments.
6. Implement HealthKit/Health Connect only after explicit dependency/permission authorization.
7. Keep broad Coach/Companion expansion and feed-ranking scope deferred unless reprioritized.

## Safety / activation boundaries

Do not perform without direct authorization:

- OTA/EAS publication;
- native build/install;
- backend deployment;
- production migration execution;
- production push worker scheduling;
- production data access/mutation;
- APNs/FCM activation or provider credential changes;
- HealthKit/Health Connect activation;
- production Labs provider activation;
- native PDF/health/push dependency introduction solely to bypass a reviewed gate;
- DNS changes;
- destructive production cleanup;
- app-store submission.
