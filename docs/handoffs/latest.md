# Latest Handoff

Updated: 2026-08-15

Exact Git history, source and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660).

Recent Phase 14-adjacent source includes native push readiness #647, Labs interpretation #648/#653/#654/#657, Steps source/day-boundary work #651/#659, authenticated mobile push registration #656 and offline-logout local credential/session cleanup regression #660.

#660 means deferred server cleanup must never be implemented by retaining access/refresh credentials after local logout.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `37cd865ef94bfc9b2eef4c554ba83e3179726541` (#240).

Merged push/auth sequence:

- #231 — provider-neutral delivery contracts;
- #232 — persistent device registrations + authenticated register/unregister API;
- #233 — current-device registration invalidation on logout;
- #234 — remote-session/revoke-others registration cleanup;
- #237 — durable PostgreSQL delivery outbox + provider-neutral worker;
- #238 — Story interaction enqueue + source-removal cancellation;
- #239 — expired sessions excluded from active-device/session listing;
- #240 — Story preference opt-out cancellation + enqueue/opt-out race serialization.

#239 final exact head `f7279651abf98e9658600f082abd1071ad80602e` passed Backend CI and Backend PostgreSQL CI with review threads 0 before squash merge to `a2792afe34608e49ba83abcc8fa7ca9a14661b36`.

#240 final exact head `cbcf858e0d6e1b88b8583493ad98ca75f1cc0e55` passed Backend CI and the full Backend PostgreSQL CI with review threads 0 before squash merge to `37cd865ef94bfc9b2eef4c554ba83e3179726541`.

There are no open runtime/source PRs in either repository at this checkpoint.

## Active continuation target

There is **no remaining large independent source-only package** that should be started automatically without crossing a provider/native/runtime gate.

The next meaningful work is gate-dependent:

- concrete APNs/FCM delivery and configured-environment evidence;
- native push permission/token lifecycle;
- offline logout/reconnect server convergence without retained credentials;
- HealthKit/Health Connect native adapters and permissions;
- Labs production storage/OCR/model/native picker runtime;
- Stories deployment/device evidence.

Until a gate is explicitly opened, continue only read-only contract/audit work, QA/evidence preparation, bounded fixes for reproduced defects and canonical documentation synchronization. Do not manufacture duplicate source work solely because runtime evidence is unavailable.

## Push lifecycle state to preserve

Source-complete behavior now includes:

- registration uses authenticated owner + existing `AuthSession.device.id`;
- mobile registration retries once after auth 401 and fails before network without authenticated session;
- readiness coordination never requests permission implicitly;
- token/account handoff is atomic;
- current-device backend logout cleanup is transactional (#233);
- remote-session delete/revoke-others cleanup is transactional (#234);
- durable jobs are account/device scoped and omit raw reusable provider credentials (#237);
- claim-token fencing prevents stale worker finalization (#237);
- delayed invalid-token feedback cannot invalidate a rotated credential (#237);
- Story interaction enqueue is fail-closed unless provider availability and owner preference allow it (#238);
- Story source removal terminalizes matching undelivered jobs and fences stale completion (#238);
- active-session/device listing excludes expired sessions while cleanup remains broader (#239);
- local logout erases credentials/session even when remote logout fails (#660);
- Story interaction enqueue and preference opt-out serialize on the preference row, so a completed opt-out cannot leave a late queued Story job (#240);
- opt-out terminalizes only matching pending/retryable/claimed Story jobs and preserves unrelated push categories (#240).

Important runtime limit: terminalizing a claimed database row cannot recall a provider request whose external send has already begun. Provider-level behavior remains activation evidence, not a database guarantee.

Still unresolved before real delivery activation:

- concrete APNs/FCM adapter/configuration;
- provider credentials and production worker schedule;
- native permission UX and native credential acquisition/rotation;
- offline logout/reconnect server convergence;
- final external notification privacy/content policy;
- physical-device and second-account/device evidence.

See `docs/architecture/push-registration-lifecycle.md`.

## Labs state

Labs provider-neutral source composition remains complete through confirmed-result interpretation presentation. Remaining Labs work is provider/native/runtime activation, not another duplicate interpretation state layer.

## Stories state

Stories S10 source is merged. Continue only runtime matrix evidence and bounded reproduced defects. Do not reopen source scope merely because deployment/device evidence is missing.

## Steps state

Provider-neutral Steps source is merged through #659 with device-local/DST-safe day windows and fail-closed unsupported/denied semantics. HealthKit/Health Connect adapters, permissions and device evidence remain separately gated.

## Companion state

Companion remains at the bounded Phase 13 v1 baseline. Richer pet/cosmetics/naming/progression remains deferred unless explicitly reprioritized.

## CI policy

Mobile exact-head source validation remains on `[self-hosted, linux, x64, hermes-mobile-ci]`.

Backend exact-head source validation remains on `[self-hosted, linux, x64, hermes-backend-ci]` with PostgreSQL/account-deletion gates when applicable.

Do not weaken CI or substitute source CI for provider/device/deployment evidence.

## Next execution order

1. Keep `ROADMAP_PROGRESS.md`, `docs/implementation-plan.md`, `docs/current-status.md`, this handoff and `docs/roadmap/phase14-active-workstreams.md` synchronized to mobile `97bb0ab` / backend `37cd865`.
2. Do not reopen #237/#238/#239/#240/#659/#660 as duplicate source packages.
3. Continue bounded read-only audits, QA preparation and reproduced-defect repair while activation gates remain closed.
4. Enter APNs/FCM/native push only after explicit provider/native authorization.
5. Enter HealthKit/Health Connect only after explicit dependency/permission authorization.
6. Treat Labs source composition as complete until provider/native/runtime work is opened or a concrete defect appears.
7. Collect Stories/Labs/Steps physical-device or deployed evidence only in authorized environments.
8. Re-synchronize canonical docs after every material merge.

## Closed activation gates

Without direct authorization, do not deploy backend code or production migrations, schedule/activate production workers, activate APNs/FCM or provider credentials, request native notification permission implicitly, activate HealthKit/Health Connect, activate production Labs providers, add native dependencies solely to bypass a reviewed gate, publish OTA/EAS, build/install native releases, access/mutate production data or submit to app stores.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, exercise repository/provider behavior, Social/Stories authority/privacy, Labs privacy/confirmation semantics, Coach auth/API contracts, active-program owner authority, backend revision/idempotency semantics or privacy/export boundaries as incidental follow-up.
