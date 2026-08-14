# Smart Fitness Current Status

Updated: 2026-08-15

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `2d34fca37bfed92289b097f89ccb8b36d13a1353` (#659).

Recent merged source:

- Stories S10 #643;
- Phase 12 Labs + Settings #644;
- native push readiness #647;
- Labs interpretation repository #648;
- Steps runtime source seam #651;
- Labs interpretation controller #653;
- Labs context composition #654;
- authenticated push registration client #656;
- confirmed-result Labs interpretation presentation #657;
- Steps local-day/DST/fail-closed source semantics #659.

There are no open mobile runtime/source PRs at this checkpoint.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `dc99dd4d483acfd47c03e0bab9801b7d7d8f6634` (#238).

Recent merged push source:

- #231 — provider-neutral delivery contracts;
- #232 — persistent push registrations and authenticated register/unregister boundary;
- #233 — current authenticated device registration invalidation on logout;
- #234 — remote session and revoke-others registration cleanup;
- #237 — durable PostgreSQL push outbox + provider-neutral delivery worker;
- #238 — transactional Story interaction enqueue + source-removal cancellation.

#237 final exact head `d093bbd843ec9340c647f3ec6b9dee81914a608b` passed Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI before squash merge to `3ff5d598d12c3e0d612f9371084fabc8a3200754`.

#238 final exact head `ff762d56b130233b57ea0ddc8b27531d0de4779a` passed Backend CI and Backend PostgreSQL CI before squash merge to `dc99dd4d483acfd47c03e0bab9801b7d7d8f6634`. PostgreSQL coverage includes Story deletion and expiry cancelling an already-claimed delivery and stale completion/retry fencing.

There are no open backend runtime/source PRs at this checkpoint.

## Phase 14 status

`docs/roadmap/phase14-active-workstreams.md` is the focused active roadmap.

Phase 14 currently consists of:

1. real external push activation/runtime completion;
2. Labs provider/native/runtime completion after source composition;
3. Stories runtime evidence and bounded defect repair;
4. Steps native health activity.

The provider-neutral source-critical path for durable push delivery, Story enqueue/source-removal and Steps local-day semantics is merged. Provider/native/deployment activation remains separately gated from source completion.

## Push delivery

### Source-complete foundation

Backend/mobile source now includes:

- provider-neutral delivery contracts;
- owner/device registration persistence;
- authenticated registration and owner-scoped unregister routes;
- iOS/APNs and Android/FCM route validation;
- registration responses that do not echo reusable credentials;
- atomic provider/token handoff between accounts;
- current-device cleanup on logout;
- remote-session/revoke-others cleanup;
- authenticated mobile registration client bound to `AuthSession.device.id`;
- one mobile access-token refresh retry after 401;
- readiness coordination that never requests notification permission implicitly;
- durable PostgreSQL outbox jobs;
- claim/lease ownership and stale-worker fencing;
- bounded retry/backoff;
- exact-registration invalid-token invalidation with credential-rotation protection;
- Story like/reaction/reply enqueue behind explicit provider availability plus owner preference;
- source-removal cancellation for unlike/reaction clear/reply delete and Story deletion/expiry;
- PostgreSQL claimed-job cancellation regression evidence;
- raw provider tokens excluded from durable outbox content.

### Remaining activation/runtime state

Still unresolved or gated before real external delivery:

- concrete APNs/FCM transport adapter and configured-environment evidence;
- provider credentials and production worker scheduling;
- native push permission UX;
- native credential acquisition/rotation;
- offline logout/reconnect convergence policy/evidence;
- final external notification content/privacy/deep-link policy;
- physical-device and second-account/device evidence.

No production worker, APNs/FCM credentials or external delivery is active from the merged source packages alone.

## Labs / Analyses

Phase 12 backend/mobile source and Phase 14 provider-neutral interpretation composition are source-complete through confirmed-result presentation.

Established source includes:

- private server-authoritative document/review/confirmation lifecycle;
- confirmed biomarker history, trends, comparison and attention surfaces;
- review-before-confirmation;
- provider-neutral extraction/processing and interpretation contracts;
- minimum confirmed interpretation context and bounded provenance;
- fail-closed mobile capability/state/context composition;
- stale async run protection;
- confirmed-result interpretation presentation;
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

Provider-neutral daily Steps source is merged through #659.

Source now covers:

- deterministic unavailable/fail-closed state;
- device-local calendar-day queries;
- half-open local midnight boundaries;
- DST-safe 23/24/25-hour days;
- impossible-date rejection;
- unsupported/denied source evidence;
- no fake/workout-derived Steps.

Remaining work is separately gated native implementation/evidence:

- HealthKit adapter/dependency;
- Health Connect adapter/dependency;
- explicit permission/disclosure UX;
- native denied/unsupported runtime evidence;
- physical-device evidence;
- real aggregate-driven Home presentation.

## Companion

Phase 13 Companion v1 remains the bounded merged baseline. Richer pet/cosmetics/naming/progression is deferred unless explicitly reprioritized.

## CI execution

Mobile authoritative routine CI uses `[self-hosted, linux, x64, hermes-mobile-ci]` and includes line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Expo Doctor is currently pinned to released baseline `1.20.1` until a reviewed SDK upgrade is opened.

Backend authoritative routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` and includes applicable lint/format/build/tests, PostgreSQL migration/schema/API/sync evidence and account-deletion receipt validation when relevant.

Do not substitute source CI for provider/device/deployment evidence.

## Current remaining roadmap

1. Keep canonical docs aligned with merged mobile `2d34fca` and backend `dc99dd4d`.
2. Do not recreate #237/#238/#659 work; those source packages are closed.
3. Continue only bounded source fixes for reproduced defects and read-only/QA preparation that does not cross activation gates.
4. Enter concrete APNs/FCM/native push work only after explicit provider/native authorization.
5. Treat Labs source composition as complete for now; remaining work is provider/native/deployment/device evidence or reproduced defects.
6. Collect Stories runtime evidence in authorized environments.
7. Implement HealthKit/Health Connect only after explicit dependency/permission authorization.
8. Keep broad Coach/Companion expansion and feed-ranking scope deferred unless reprioritized.

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
