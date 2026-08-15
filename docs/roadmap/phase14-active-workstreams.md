# Phase 14 — Active product workstreams

Updated: 2026-08-15

Status: explicitly prioritized bounded completion program; provider/native/deployment activation remains separately gated.

This is the focused Phase 14 roadmap. Exact code, tests and Git history remain authoritative.

## Verified merged baseline

### Mobile

Latest runtime/source merge: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660).

Merged Phase 14-adjacent work includes Stories S10 #643, Phase 12 Labs + Settings #644, native push readiness #647, Labs interpretation #648/#653/#654/#657, Steps source/day-boundary work #651/#659, authenticated push registration #656 and offline-logout local credential/session cleanup regression #660.

### Backend

Latest runtime/source merge: `37cd865ef94bfc9b2eef4c554ba83e3179726541` (#240).

Merged push/auth work includes provider-neutral contracts #231, persistent registrations/API #232, current-device logout cleanup #233, remote-session/revoke-others cleanup #234, durable outbox/delivery worker #237, Story interaction enqueue/source-removal cancellation #238, expired-session exclusion from active listing #239 and Story preference opt-out privacy hardening #240.

There are no open runtime/source PRs in either repository at this checkpoint.

## Active workstreams

### P14-A — Real push delivery

**Status: provider-neutral durable source path complete through Story enqueue/source-removal/preference opt-out; external provider/native/runtime activation remains gated.**

#### Completed source foundation

Backend:

- typed provider-neutral delivery contracts;
- persistent owner/device registrations and authenticated register/unregister boundary;
- token/account handoff and credential redaction;
- current-device invalidation on logout (#233);
- remote-session/revoke-others invalidation (#234);
- durable PostgreSQL outbox jobs and provider-neutral worker (#237);
- per-device idempotency without raw reusable credentials in ordinary outbox payloads;
- claim/lease concurrency and stale-worker finalization fencing;
- bounded retry/backoff;
- exact-registration invalid-token handling with credential-rotation protection;
- Story like/reaction/reply enqueue behind explicit provider availability and owner preference (#238);
- cancellation on direct interaction removal and Story deletion/expiry (#238);
- active-session listing that excludes expired sessions without narrowing cleanup semantics (#239);
- Story preference opt-out cancellation scoped to Story interaction jobs (#240);
- preference-row serialization closing the enqueue-vs-opt-out late-job race (#240);
- permanent PostgreSQL regression coverage for claimed-job cancellation, stale finalization and opt-out concurrency.

Mobile:

- typed native readiness seam;
- authenticated register/unregister repository;
- one auth-refresh retry after 401;
- fail-closed no-session behavior;
- readiness coordinator that does not request permission implicitly;
- existing `AuthSession.device.id` reuse;
- local logout that erases access/refresh tokens and session metadata even when remote logout fails (#660).

#### Story preference privacy contract — #240

#240 final exact head `cbcf858e0d6e1b88b8583493ad98ca75f1cc0e55` passed Backend CI and the full Backend PostgreSQL CI before squash merge to `37cd865ef94bfc9b2eef4c554ba83e3179726541`.

Serialization contract:

1. if enqueue locks the preference row first, opt-out waits; enqueue commits, then opt-out terminalizes the late job;
2. if opt-out locks first, enqueue waits and then sees the disabled preference and skips enqueue.

The cancellation query matches both the Story interaction idempotency prefix and Story destination prefix, preserving unrelated push categories. Pending/retryable/claimed matches are terminalized and stale claim completion is fenced.

Important boundary: cancelling a claimed row cannot recall a provider send that has already begun outside the database. Current runtime composition still keeps provider availability disabled, so #240 is privacy/source hardening only.

#### Remaining push work

The remaining large work crosses provider/native/runtime gates:

1. concrete APNs/FCM provider adapters and configured-environment evidence;
2. provider credentials and production worker scheduling;
3. explicit native permission UX;
4. native credential acquisition/rotation and synchronization;
5. offline logout/reconnect server convergence without retaining reusable auth credentials;
6. final external notification content/privacy/deep-link policy;
7. physical-device and second-account/device isolation evidence.

Do not duplicate online cleanup, durable outbox/worker, Story enqueue/source-removal/opt-out, active-list expiry semantics or local offline-logout erasure.

### P14-B — Labs / Analyses completion

**Status: provider-neutral source composition complete; provider/native/runtime work gated.**

Merged source includes confirmed-data repository/state/controller/context interpretation, fail-closed capability handling, stale async generation invalidation, confirmed-document-only runs, bounded confirmed-result presentation, provider/model provenance without raw provider payload exposure and non-diagnostic/non-treatment copy.

Remaining work: production private storage/OCR/model provider selection/configuration, authorized backend deployment/migrations, PDF native picker/dependency, internal Labs/Coach model-tool exposure policy and provider/device/accessibility/runtime evidence.

### P14-C — Stories runtime completion

**Status: source-complete; evidence/runtime only unless a defect is reproduced.**

Use `docs/qa/stories-s10-runtime-matrix.md` to distinguish source/CI, deployed backend/migration, physical-device and second-device/privacy/lifecycle evidence. Repair only demonstrated runtime defects and preserve chronological Following/server-authoritative Story visibility.

### P14-D — Steps / native health activity

**Status: provider-neutral source seam plus local-day boundary/fail-closed semantics complete; native package remains gated.**

Merged source includes fail-closed source registry, daily aggregate hook, deterministic unavailable state, device-local calendar-day semantics, half-open `[local midnight, next local midnight)` intervals, DST-safe 23/24/25-hour handling, invalid-date rejection, unsupported/denied evidence and no fake/workout-derived Steps.

Remaining: reviewed HealthKit/Health Connect read-only adapters/dependencies, explicit user-initiated permission/disclosure UX, denied/unsupported runtime evidence, physical-device evidence and Home presentation against real aggregate data.

## Parallel execution rules

Independent work may proceed in parallel only when contracts/files do not overlap. While activation gates remain closed, useful parallel work is limited to read-only lifecycle/content/deep-link audits, QA/evidence preparation, bounded fixes for reproduced defects and canonical documentation synchronization.

Do not create new broad source branches merely to keep work moving when remaining feature work requires a closed gate. Shared authentication lifecycle, database schema/journal, package manifests, root configuration and canonical roadmap files require deliberate integration.

## Validation gates

### Mobile source

Exact-head Mobile CI requires repository/changed-file line audits, TypeScript, full regression suite, expanded-model smoke, Expo export and the reviewed released Expo Doctor baseline.

### Backend source

Applicable exact-head gates include Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI for schema/privacy/account lifecycle changes.

### Native/provider/runtime

Native push/health packages require native build and physical-device evidence before runtime-complete status. Provider-backed Labs/push work requires configured-environment evidence before activation-complete status. Source CI does not substitute for those gates.

## Current execution order

1. Keep canonical docs synchronized to mobile `97bb0ab` / backend `37cd865`.
2. Do not reopen the merged durable worker, Story enqueue/source-removal/opt-out, Steps local-day, active-list or offline-logout packages.
3. Continue only read-only audits, QA preparation and bounded reproduced-defect fixes while activation gates remain closed.
4. Enter concrete APNs/FCM/native push only after explicit provider/native authorization.
5. Keep Labs source closed unless a concrete defect appears; otherwise next Labs work is provider/native/runtime evidence.
6. Collect Stories runtime evidence only in authorized environments.
7. Enter HealthKit/Health Connect only after explicit native dependency/permission authorization.
8. Re-synchronize canonical status/roadmap/handoff after material merges.

## Closed activation boundaries

Without direct authorization, Phase 14 work must not deploy backend code, execute production migrations, schedule/activate production workers, activate APNs/FCM or provider credentials, request native push permission implicitly, activate HealthKit/Health Connect, activate production Labs providers, add native dependencies solely to bypass a reviewed gate, publish OTA/EAS, build/install native releases, access/mutate production data or submit to app stores.

## Deferred

Companion pet/cosmetics/naming/richer progression, feed ranking/retention, broad Coach expansion, DMs/groups/marketplace/subscriptions and broad autonomous refactoring outside an active product contract or demonstrated defect remain deferred unless explicitly reprioritized.
