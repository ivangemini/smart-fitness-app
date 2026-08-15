# Smart Fitness Roadmap Progress

Updated: 2026-08-15

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Use it together with `docs/implementation-plan.md`, `docs/current-status.md`, `docs/handoffs/latest.md`, `docs/roadmap/phase14-active-workstreams.md`, focused roadmaps and repository `AGENTS.md`. Exact source, tests, migrations and Git history override stale prose.

Focused roadmap index:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/phase14-active-workstreams.md`.

## Verified phase baseline

- Phases 1–10: complete for their established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: complete for the authorized source/CI scope; only reproduced bounded regressions remain eligible for follow-up.
- Stories S10: source-complete across mobile/backend; remaining work is runtime/deployment/device evidence plus reproduced defects.
- Phase 12 Labs + Settings: provider-neutral source composition is complete through confirmed-result presentation; external provider/native/runtime activation remains gated.
- Phase 13 Companion v1: merged baseline retained; richer pet/cosmetics/progression remains deferred unless reprioritized.
- **Phase 14 remains the active bounded completion program.**

## Current Phase 14 checkpoint

### Merged mobile baseline

Latest runtime/source merge: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660).

Relevant merged source includes:

- Stories S10 #643;
- Phase 12 Labs + Settings #644;
- native push readiness #647;
- Labs interpretation repository #648;
- Steps source seam #651;
- Labs interpretation controller/context #653/#654;
- authenticated push registration client #656;
- confirmed-result Labs interpretation presentation #657;
- Steps local-day/DST/fail-closed source semantics #659;
- offline-logout local credential/session cleanup regression #660.

#660 permanently locks the local security invariant: if authenticated remote logout cannot reach the backend, local logout still clears session metadata, access token and refresh token. Do not retain credentials after logout merely to perform deferred push cleanup.

### Merged backend baseline

Latest runtime/source merge: `37cd865ef94bfc9b2eef4c554ba83e3179726541` (#240).

Relevant merged push/auth source includes:

- provider-neutral contracts #231;
- persistent registrations/API #232;
- current-device logout cleanup #233;
- remote-session/revoke-others cleanup #234;
- durable PostgreSQL delivery outbox + worker #237;
- transactional Story interaction enqueue + source-removal cancellation #238;
- expired-session exclusion from active-device/session listing + permanent PostgreSQL regression #239 (`a2792afe34608e49ba83abcc8fa7ca9a14661b36`);
- Story push preference opt-out cancellation + enqueue/opt-out race serialization #240 (`37cd865ef94bfc9b2eef4c554ba83e3179726541`).

#239 changes active-list semantics only: expired non-revoked sessions are no longer presented as active. Remote revocation/revoke-others cleanup remains intentionally broader and can still revoke expired-but-unrevoked sessions and invalidate their device registrations.

#240 final exact head `cbcf858e0d6e1b88b8583493ad98ca75f1cc0e55` passed Backend CI and the full Backend PostgreSQL CI before squash merge. PostgreSQL evidence includes domain-scoped Story opt-out cancellation, stale-claim fencing and a deterministic preference-row lock race proving a late enqueue cannot survive a completed opt-out.

There are no open runtime/source PRs in either repository at this checkpoint.

## What Phase 14 source now guarantees

### Push

Merged provider-neutral foundation now includes:

- owner/device registration persistence and authenticated registration boundary;
- online logout/session-revocation registration cleanup;
- durable per-device outbox jobs;
- claim/lease fencing and stale-worker finalization protection;
- bounded retry/backoff;
- exact-registration invalid-token cleanup with credential-rotation protection;
- Story like/reaction/reply enqueue when the injected provider-availability seam is explicitly enabled and the owner preference allows it;
- source-removal cancellation for direct interaction removal and Story deletion/expiry;
- owner preference opt-out terminalization of matching pending/retryable/claimed Story jobs;
- row-lock serialization that closes the enqueue-vs-opt-out late-job race;
- PostgreSQL regression evidence for already-claimed cancellation and stale completion fencing;
- no raw APNs/FCM credential copied into the durable outbox.

This does **not** mean external delivery is activated. Cancelling a claimed database row fences database finalization/retry but cannot retract a provider send that has already begun outside the database.

### Offline logout boundary

Local logout security semantics are regression-covered by #660, but server-side convergence while the device is offline remains unresolved before real external push activation.

Allowed future solutions must not depend on retaining reusable auth credentials after logout. A reviewed provider-independent eligibility/lease or reconnect mechanism should only be introduced together with the native/runtime synchronization path that can actually maintain it.

### Steps

Provider-neutral source includes fail-closed unsupported/denied semantics, device-local calendar-day windows, half-open `[local midnight, next local midnight)` native query intervals, DST-safe 23/24/25-hour days, invalid-date rejection and no fake/workout-derived Steps data. Concrete HealthKit/Health Connect integration remains gated.

### Labs / Analyses

Provider-neutral source composition remains complete through confirmed-result interpretation presentation. Production storage/OCR/model/native picker/runtime evidence remains gated.

### Stories

Stories source remains complete. Missing runtime/device/deployment evidence must not be converted into duplicate implementation work.

## Remaining active roadmap

### 1. Real external push delivery

The remaining work crosses provider/native/runtime gates:

1. concrete APNs/FCM adapter implementation and configured-environment evidence;
2. provider credentials and production worker scheduling;
3. explicit native notification permission UX;
4. native credential acquisition/rotation and registration convergence;
5. offline logout/reconnect server convergence policy and evidence without credential retention;
6. final notification content/privacy/deep-link policy for external delivery;
7. physical-device and second-account/device isolation evidence.

The durable worker, Story enqueue/source-removal and Story opt-out packages are already merged and must not be reimplemented.

### 2. Labs / Analyses runtime completion

Remaining work is primarily gated: private object storage/OCR/model provider selection/configuration, authorized deployment/migrations, PDF native picker/dependency decision, model-tool exposure policy and provider/device/accessibility evidence.

### 3. Stories runtime evidence

Use `docs/qa/stories-s10-runtime-matrix.md` for deployed backend/migration evidence, physical-device behavior, second-device/privacy/lifecycle evidence and bounded fixes only for reproduced defects.

### 4. Steps native health activity

Remaining work is separately gated: HealthKit/Health Connect adapters/dependencies, explicit permission/disclosure UX, native denied/unsupported runtime evidence, physical-device evidence and final Home presentation against real aggregate data.

## Current execution order

1. Keep canonical docs synchronized with merged mobile `97bb0ab` / backend `37cd865` baselines.
2. Do not open another broad autonomous source package solely to keep Phase 14 busy; the remaining large items are provider/native/runtime gated.
3. Continue read-only audits, QA preparation and bounded fixes for demonstrated defects without crossing those gates.
4. Enter APNs/FCM/native push only after explicit authorization for that gate.
5. Enter HealthKit/Health Connect only after explicit dependency/permission authorization.
6. Run Labs/Stories deployment or physical-device evidence only in authorized environments.
7. Keep Companion v1 bounded; richer pet/cosmetics/progression remains deferred.

## Working rules

- Re-check exact `main`, open PRs, `AGENTS.md` and canonical docs before new source work.
- Prefer bounded evidence-backed packages over speculative refactors.
- Preserve stable IDs, persistence/sync contracts, auth/session semantics, completed-history immutability, Social authority/privacy, Labs ownership/privacy and backend revision/idempotency contracts unless explicitly changed.
- Keep Social/Stories and Labs server-authoritative.
- Keep provider calls and reusable credentials out of ordinary mobile/network diagnostics and model context.
- Source-complete provider/worker/native seams are prerequisites for activation, not authorization to activate them.

## Closed activation and release gates

Without direct authorization, do not deploy backend changes or execute production migrations, activate/schedule the production push worker, configure or rotate APNs/FCM/provider credentials, request native notification permission implicitly, activate HealthKit/Health Connect, activate production OCR/storage/model providers, add native PDF/health/push dependencies solely to bypass a reviewed gate, publish OTA/EAS updates, create/install native release builds, access or mutate production user data or submit to app stores.

## Deferred product scope

Do not begin without explicit reprioritization: DMs/groups/marketplace/subscriptions, algorithmic feed ranking, contact-book/location discovery, public private-health/body/nutrition/Coach data, broad Companion progression, broad Coach expansion, rich Stories/media expansion beyond reviewed defects or another broad autonomous refactor phase.
