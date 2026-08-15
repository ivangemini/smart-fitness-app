# Smart Fitness Current Status

Updated: 2026-08-15

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660).

Recent merged source includes Stories S10 #643, Phase 12 Labs + Settings #644, native push readiness #647, Labs interpretation #648/#653/#654/#657, Steps runtime/day-boundary source #651/#659, authenticated push registration #656 and offline-logout local credential cleanup regression #660.

#660 proves that a failed remote `/v1/auth/logout` does not weaken local logout: session metadata plus access/refresh tokens are removed and the local session is gone. Deferred server cleanup must not be implemented by retaining reusable auth credentials after logout.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `37cd865ef94bfc9b2eef4c554ba83e3179726541` (#240).

Recent merged push/auth source:

- #231 — provider-neutral delivery contracts;
- #232 — persistent push registrations and authenticated register/unregister boundary;
- #233 — current authenticated device registration invalidation on logout;
- #234 — remote session and revoke-others registration cleanup;
- #237 — durable PostgreSQL push outbox + provider-neutral delivery worker;
- #238 — transactional Story interaction enqueue + source-removal cancellation;
- #239 — expired non-current sessions excluded from active-session/device listing with permanent PostgreSQL coverage;
- #240 — Story preference opt-out cancellation and enqueue/opt-out race serialization.

#239 final exact head `f7279651abf98e9658600f082abd1071ad80602e` passed Backend CI and Backend PostgreSQL CI with zero review threads before squash merge to `a2792afe34608e49ba83abcc8fa7ca9a14661b36`. It changes active-list semantics only; remote revoke/revoke-others cleanup remains broader and can still revoke expired-but-unrevoked sessions and invalidate their device registrations.

#240 final exact head `cbcf858e0d6e1b88b8583493ad98ca75f1cc0e55` passed Backend CI and the full Backend PostgreSQL CI with zero review threads before squash merge to `37cd865ef94bfc9b2eef4c554ba83e3179726541`.

There are no open runtime/source PRs in either repository at this checkpoint; the current mobile branch is documentation-only.

## Phase 14 status

`docs/roadmap/phase14-active-workstreams.md` is the focused active roadmap.

The provider-neutral source-critical path now includes durable push delivery, Story enqueue/source-removal, Story preference opt-out privacy hardening, Steps local-day semantics and local offline-logout credential erasure. Remaining major work is provider/native/runtime/deployment evidence or separately authorized activation.

## Push delivery

### Source-complete provider-neutral foundation

Backend/mobile source includes:

- provider-neutral delivery contracts;
- owner/device registration persistence;
- authenticated registration and owner-scoped unregister routes;
- registration responses that do not echo reusable credentials;
- atomic provider/token handoff between accounts;
- current-device cleanup on logout;
- remote-session/revoke-others cleanup;
- active-session/device listing that excludes expired sessions without narrowing cleanup semantics;
- authenticated mobile registration client bound to `AuthSession.device.id`;
- one mobile access-token refresh retry after 401;
- readiness coordination that never requests notification permission implicitly;
- durable PostgreSQL outbox jobs;
- claim/lease ownership and stale-worker fencing;
- bounded retry/backoff;
- exact-registration invalid-token invalidation with credential-rotation protection;
- Story like/reaction/reply enqueue behind explicit provider availability plus owner preference;
- source-removal cancellation for unlike/reaction clear/reply delete and Story deletion/expiry;
- owner preference opt-out cancellation for matching pending/retryable/claimed Story jobs;
- preference-row locking that closes the enqueue-vs-opt-out late-job race;
- PostgreSQL claimed-job cancellation/stale-completion regression evidence;
- raw provider tokens excluded from durable outbox content.

### #240 privacy semantics

#240 uses `SELECT ... FOR UPDATE` on the Story push preference inside the existing interaction transaction. Disabling the preference updates the same row and terminalizes only jobs matching both the Story interaction idempotency prefix and Story destination prefix in the same database transaction.

The deterministic PostgreSQL race regression verifies both serialization orders: a late job committed by an enqueue transaction that locked first is cancelled before opt-out returns, while an enqueue transaction that runs after opt-out observes the disabled preference and skips enqueue.

Cancelling an already-claimed database row fences stale finalization/retry but does not retract a provider send that has already begun externally. Current API composition still leaves provider availability disabled, so this is source/privacy hardening rather than external-delivery activation.

### Offline logout boundary

Local logout security is permanently regression-covered by #660. If the device is offline, authoritative backend session/registration cleanup still cannot occur immediately.

Before real external delivery, define a bounded server/reconnect convergence mechanism that does not retain reusable auth credentials after logout. A lease/eligibility design should only be introduced together with an actual native/runtime synchronization path capable of maintaining it.

### Remaining activation/runtime state

Still unresolved or gated before real external delivery:

- concrete APNs/FCM transport adapter and configured-environment evidence;
- provider credentials and production worker scheduling;
- native push permission UX;
- native credential acquisition/rotation;
- offline logout/reconnect server convergence;
- final external notification content/privacy/deep-link policy;
- physical-device and second-account/device evidence.

No production worker, APNs/FCM credentials or external delivery is active from the merged source packages alone.

## Labs / Analyses

Phase 12 backend/mobile source and Phase 14 provider-neutral interpretation composition are source-complete through confirmed-result presentation. Remaining work is mainly gated production private storage/OCR/model activation, authorized deployment/migrations, PDF native picker/dependency, internal model-tool exposure policy and provider/device/accessibility evidence.

## Stories

Stories S10 source is merged across backend/mobile. Remaining work is runtime/evidence validation through `docs/qa/stories-s10-runtime-matrix.md` plus bounded repairs for reproduced defects. Do not convert missing deployed/device evidence into duplicate source implementation.

## Steps

Provider-neutral daily Steps source is merged through #659: deterministic unavailable/fail-closed state, device-local calendar-day queries, half-open local-midnight boundaries, DST-safe 23/24/25-hour days, impossible-date rejection, unsupported/denied evidence and no fake/workout-derived Steps. HealthKit/Health Connect adapters, permissions and physical-device evidence remain separately gated.

## Companion

Phase 13 Companion v1 remains the bounded merged baseline. Richer pet/cosmetics/naming/progression is deferred unless explicitly reprioritized.

## CI execution

Mobile authoritative routine CI uses `[self-hosted, linux, x64, hermes-mobile-ci]` and includes line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend authoritative routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` and includes applicable lint/format/build/tests, PostgreSQL migration/schema/API/sync evidence and account-deletion receipt validation when relevant.

Do not substitute source CI for provider/device/deployment evidence.

## Current remaining roadmap

1. Keep canonical docs aligned with mobile `97bb0ab` and backend `37cd865`.
2. Do not recreate #237/#238/#239/#240/#659/#660 work; those source packages are closed.
3. Continue only bounded source fixes for reproduced defects and read-only/QA preparation that does not cross activation gates.
4. Enter concrete APNs/FCM/native push work only after explicit provider/native authorization.
5. Treat Labs source composition as complete for now; remaining work is provider/native/deployment/device evidence or reproduced defects.
6. Collect Stories runtime evidence in authorized environments.
7. Implement HealthKit/Health Connect only after explicit dependency/permission authorization.
8. Keep broad Coach/Companion expansion and feed-ranking scope deferred unless reprioritized.

## Safety / activation boundaries

Do not perform without direct authorization: OTA/EAS publication, native build/install, backend deployment, production migrations, production push worker scheduling, production data access/mutation, APNs/FCM activation or credential changes, HealthKit/Health Connect activation, production Labs providers, native dependencies solely to bypass a reviewed gate, DNS changes, destructive production cleanup or app-store submission.
