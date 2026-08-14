# Latest Handoff

Updated: 2026-08-14

Exact Git history, source and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge before this documentation synchronization: `7036cb0257fe38a945ec18726389954c82641dd3` (#657). Documentation-only merges may advance `main` without changing that runtime/source baseline.

Recent merged Phase 14-adjacent source:

- #647 — native push readiness foundation;
- #648 — Labs interpretation repository boundary;
- #651 — Steps runtime source seam;
- #653 — Labs interpretation state controller;
- #654 — Labs interpretation composition through `LabsContext`;
- #656 — authenticated mobile push-registration client;
- #657 — confirmed-result Labs interpretation presentation.

There are no open mobile runtime/source PRs at this checkpoint before the docs synchronization PR.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge before this documentation synchronization: `404963da88939ab2913a5f8a72ae90a51f77459f` (#234). Documentation-only merges may advance `main` without changing that runtime/source baseline.

Merged push lifecycle sequence:

- #231 — provider-neutral delivery contracts;
- #232 — persistent device registrations + authenticated register/unregister API;
- #233 — current-device registration invalidation on logout;
- #234 — remote-session/revoke-others registration cleanup.

#234 final exact head: `4145b7cad3e87ba53f87e413e76864ba79576a2c`.

Before merge:

- Backend CI: green;
- Backend PostgreSQL CI: green;
- review threads: 0;
- branch was exactly one commit ahead of then-current backend runtime/source `main`.

Squash merge runtime/source baseline: `404963da88939ab2913a5f8a72ae90a51f77459f`.

There are no open backend runtime/source PRs at this checkpoint before the docs synchronization PR.

Prepared next backend branch:

- `feat/p14-push-delivery-outbox-worker`;
- currently points to runtime/source baseline `404963d` with no additional commit;
- no overlapping runtime/source PR exists.

## Active continuation target

The next bounded Phase 14 source package is **durable push outbox/delivery worker**.

Target properties:

- durable per-device jobs in PostgreSQL;
- registration-reference-based delivery rather than copying raw reusable credentials into ordinary outbox payloads;
- lease/claim ownership suitable for concurrent workers;
- bounded retries/backoff using the existing push retry policy;
- injected provider transport boundary with no production credential activation;
- stale-worker protection so a worker that loses its lease cannot finalize a job;
- permanent invalid-token feedback scoped to the exact registration version/token that was attempted, preventing a delayed provider response from invalidating a newer credential;
- deterministic terminal/retry state and PostgreSQL evidence;
- privacy/data-inventory/account-deletion coverage for any new table/state;
- applicable exact-head Backend CI and PostgreSQL CI before merge.

Out of scope for this worker package:

- live APNs/FCM activation;
- provider credentials;
- native permission prompts;
- native build/install;
- production worker scheduling;
- backend deployment/migration execution;
- OTA/EAS;
- production data access.

## Push lifecycle state to preserve

Already source-complete:

- registration uses authenticated owner + existing `AuthSession.device.id`;
- mobile repository retries once after auth 401 and fails before network without authenticated session;
- readiness coordination never requests permission implicitly;
- token/account handoff is atomic;
- current-device backend logout cleanup is transactional (#233);
- remote-session delete and revoke-others cleanup are transactional (#234);
- current session/device remains active during revoke-others;
- raw delivery credentials remain excluded from normal API responses, export candidate surfaces, logs/model context.

Still unresolved before real delivery activation:

- offline logout/reconnect convergence;
- concrete provider adapter and permanent-invalid-token semantics in runtime;
- notification enqueue/content policy;
- native permission UX and native credential acquisition/rotation;
- deep-link routing and Story interaction delivery;
- physical-device and second-account/device evidence.

See `docs/architecture/push-registration-lifecycle.md`.

## Labs state

Labs source composition now includes #654 and #657.

Merged behavior:

- interpretation capability/state is composed through `LabsContext`;
- stale asynchronous runs cannot overwrite newer document/reset state;
- interpretation runs only for confirmed documents through the existing authenticated boundary;
- confirmed-result presentation is bounded to structured reference/trend/data-quality context;
- provider/model provenance may be displayed without raw provider payloads;
- copy distinguishes informational context from diagnosis/treatment.

Remaining Labs work is provider/native/runtime activation, not another duplicate interpretation state layer.

## Stories state

Stories S10 source is merged. Continue only runtime matrix evidence and bounded reproduced defects. Do not reopen source scope merely because deployment/device evidence is missing.

## Steps state

Provider-neutral Steps seam is merged. HealthKit/Health Connect adapters, permissions and device evidence remain separately gated.

## CI policy

Mobile exact-head source validation remains on `[self-hosted, linux, x64, hermes-mobile-ci]`.

Backend exact-head source validation remains on `[self-hosted, linux, x64, hermes-backend-ci]` with PostgreSQL/account-deletion gates when applicable.

Do not weaken CI or substitute source CI for provider/device/deployment evidence.

## Next execution order

1. Implement durable push outbox/delivery worker on `feat/p14-push-delivery-outbox-worker` from backend runtime/source baseline `404963d`.
2. Validate exact head; inspect review threads; merge only the validated head.
3. Add enqueue/provider-feedback composition as a separate bounded package if it can remain non-overlapping.
4. Enter concrete APNs/FCM/native permission/token/deep-link activation only after explicit authorization.
5. Treat Labs provider-neutral source composition as complete; continue provider/native/runtime evidence only when opened.
6. Collect Stories and Steps device/runtime evidence only in authorized environments.
7. Re-synchronize canonical docs after each material merge.

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
