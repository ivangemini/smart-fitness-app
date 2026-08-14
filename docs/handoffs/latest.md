# Latest Handoff

Updated: 2026-08-15

Exact Git history, source and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `2d34fca37bfed92289b097f89ccb8b36d13a1353` (#659).

Recent merged Phase 14-adjacent source:

- #647 — native push readiness foundation;
- #648 — Labs interpretation repository boundary;
- #651 — Steps runtime source seam;
- #653 — Labs interpretation state controller;
- #654 — Labs interpretation composition through `LabsContext`;
- #656 — authenticated mobile push-registration client;
- #657 — confirmed-result Labs interpretation presentation;
- #659 — DST-safe device-local Steps day windows and fail-closed unsupported/denied semantics.

There are no open mobile runtime/source PRs at this checkpoint.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `dc99dd4d483acfd47c03e0bab9801b7d7d8f6634` (#238).

Merged push lifecycle sequence:

- #231 — provider-neutral delivery contracts;
- #232 — persistent device registrations + authenticated register/unregister API;
- #233 — current-device registration invalidation on logout;
- #234 — remote-session/revoke-others registration cleanup;
- #237 — durable PostgreSQL delivery outbox + provider-neutral worker;
- #238 — Story interaction enqueue + source-removal cancellation.

#237 final exact head: `d093bbd843ec9340c647f3ec6b9dee81914a608b`.

Before merge it passed:

- Backend CI;
- Backend PostgreSQL CI;
- Account Deletion Receipt CI;
- review threads: 0.

Squash merge: `3ff5d598d12c3e0d612f9371084fabc8a3200754`.

#238 final exact head: `ff762d56b130233b57ea0ddc8b27531d0de4779a`.

Before merge it passed:

- Backend CI;
- Backend PostgreSQL CI;
- Story delete/expiry source-removal regression beginning from an already-claimed delivery;
- stale `markDelivered` / `markRetryable` fencing after cancellation;
- review threads: 0.

Squash merge: `dc99dd4d483acfd47c03e0bab9801b7d7d8f6634`.

There are no open backend runtime/source PRs at this checkpoint.

## Active continuation target

There is **no remaining large independent source-only package** that should be started automatically after #659/#237/#238 without crossing an explicit provider/native/runtime gate.

The next meaningful work is gate-dependent:

- APNs/FCM concrete delivery and configured-environment evidence;
- native push permission/token lifecycle;
- offline logout/reconnect convergence;
- HealthKit/Health Connect native adapters and permissions;
- Labs production storage/OCR/model/native picker runtime;
- Stories deployment/device evidence.

Until one of those gates is explicitly opened, continue only:

- read-only contract/audit work;
- QA/evidence preparation;
- bounded fixes for reproduced defects;
- canonical documentation synchronization.

Do not manufacture duplicate source work solely because runtime evidence is unavailable.

## Push lifecycle state to preserve

Source-complete behavior now includes:

- registration uses authenticated owner + existing `AuthSession.device.id`;
- mobile repository retries once after auth 401 and fails before network without authenticated session;
- readiness coordination never requests permission implicitly;
- token/account handoff is atomic;
- current-device backend logout cleanup is transactional (#233);
- remote-session delete and revoke-others cleanup are transactional (#234);
- durable jobs are account/device scoped and do not persist raw reusable provider credentials (#237);
- claim-token fencing prevents stale workers from finalizing a newer lease (#237);
- delayed invalid-token feedback cannot invalidate a rotated credential (#237);
- Story interaction push enqueue is fail-closed unless provider availability is explicitly injected and the owner preference is enabled (#238);
- Story source removal terminalizes undelivered pending/retryable/claimed jobs and fences stale completion (#238).

Still unresolved before real delivery activation:

- concrete APNs/FCM adapter/configuration;
- provider credentials and production worker schedule;
- native permission UX and native credential acquisition/rotation;
- offline logout/reconnect convergence;
- final external-delivery notification privacy/content policy;
- physical-device and second-account/device evidence.

See `docs/architecture/push-registration-lifecycle.md`.

## Labs state

Labs provider-neutral source composition remains complete through confirmed-result interpretation presentation.

Remaining Labs work is provider/native/runtime activation, not another duplicate interpretation state layer.

## Stories state

Stories S10 source is merged. Continue only runtime matrix evidence and bounded reproduced defects. Do not reopen source scope merely because deployment/device evidence is missing.

## Steps state

Provider-neutral Steps source is merged through #659 with device-local/DST-safe day windows and fail-closed unsupported/denied semantics. HealthKit/Health Connect adapters, permissions and device evidence remain separately gated.

## Companion state

Companion remains at the bounded Phase 13 v1 baseline. Richer pet/cosmetics/naming/progression remains deferred unless explicitly reprioritized.

## CI policy

Mobile exact-head source validation remains on `[self-hosted, linux, x64, hermes-mobile-ci]` and includes the released Expo Doctor baseline currently pinned to `1.20.1`.

Backend exact-head source validation remains on `[self-hosted, linux, x64, hermes-backend-ci]` with PostgreSQL/account-deletion gates when applicable.

Do not weaken CI or substitute source CI for provider/device/deployment evidence.

## Next execution order

1. Keep `ROADMAP_PROGRESS.md`, `docs/implementation-plan.md`, `docs/current-status.md`, this handoff and `docs/roadmap/phase14-active-workstreams.md` synchronized to mobile `2d34fca` / backend `dc99dd4d`.
2. Do not reopen #237/#238/#659 as new source packages.
3. Continue bounded read-only audits, QA preparation and reproduced-defect repair while activation gates remain closed.
4. Enter APNs/FCM/native push only after explicit provider/native authorization.
5. Enter HealthKit/Health Connect only after explicit dependency/permission authorization.
6. Treat Labs source composition as complete until provider/native/runtime work is opened or a concrete defect appears.
7. Collect Stories/Labs/Steps physical-device or deployed evidence only in authorized environments.
8. Re-synchronize canonical docs after every material merge.

## Closed activation gates

Without direct authorization, do not:

- deploy backend code or execute production migrations;
- schedule/activate production workers;
- activate APNs/FCM or change provider credentials;
- request native notification permission implicitly;
- activate HealthKit/Health Connect;
- activate production Labs storage/OCR/model providers;
- add native PDF/health/push dependencies solely to bypass a reviewed gate;
- publish OTA/EAS;
- build/install native releases;
- access or mutate production data;
- submit to app stores.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, exercise repository/provider behavior, Social/Stories authority/privacy, Labs privacy/confirmation semantics, Coach auth/API contracts, active-program owner authority, backend revision/idempotency semantics or privacy/export boundaries as incidental follow-up.
