# Latest Handoff

Updated: 2026-08-16

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `4ea37c11c81fafc64c2ef5e1e8479868b66e689e` (#675).

Recent P14-A completion source:

- #669 — foreground registration reconciliation and freshness renewal;
- #674 — queued-operation user provenance across auth transitions;
- #675 — authenticated-only foreground push renewal with signed-out regression coverage.

The reviewed native runtime from #667 remains the base for explicit notification permission UX, native APNs/FCM token acquisition, token rotation synchronization, foreground presentation, one-time cold-start response consumption and authenticated allowlisted Story routing.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `b1643893fc42c57ceaaa54094a1c1c4e1e58b068` (#252).

Recent P14-A completion source:

- #246 — atomic refresh-token CAS rotation and concurrent refresh regression coverage;
- #247 — bounded manual delivery worker plus configurable registration freshness lease;
- #249 — privacy-minimized generic Story notification payload regression;
- #250 — provider-token account handoff regression proving a single current account/device owner;
- #252 — privacy-safe push readiness preflight, rollout/rollback evidence contract, operational runbook and source-prepared one-shot Docker/systemd entrypoints.

#252 merged only after exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI were green. The readiness command is read-only and credential-minimized; it does not call APNs/FCM or enable delivery.

No provider credential, production worker schedule, backend deploy or production activation is part of these merges.

## Phase 14 completion checkpoint

Phase 14 is **closed for ordinary source/CI implementation work under the currently authorized contracts**.

This means:

- P14-A has a complete reviewed provider-neutral/native source path plus a source-prepared operational rollout/readiness contract;
- P14-B Labs provider-neutral source composition is complete;
- P14-C Stories is source-complete;
- P14-D Steps is provider-neutral source-complete.

It does **not** mean configured-provider, physical-device, deployed-backend or production evidence has been collected.

## P14-A source state to preserve

Merged behavior includes:

- registration binds to authenticated server-owned device identity;
- mobile auth retry remains bounded and no-session paths fail closed;
- local logout erases reusable credentials even when remote cleanup cannot run;
- backend current/remote session cleanup invalidates linked registrations when authoritative cleanup runs;
- durable jobs are account/device scoped and omit raw provider credentials;
- claim-token fencing prevents stale worker finalization;
- delayed invalid-token feedback cannot invalidate a rotated registration;
- Story enqueue requires explicit delivery-provider availability and owner preference;
- source-removal and preference opt-out terminalize matching undelivered Story jobs;
- concrete APNs/FCM transports exist but remain unactivated without explicit config;
- provider config is fail-closed unless `PUSH_DELIVERY_ENABLED=true` and a provider is separately enabled with complete credentials;
- a bounded one-shot worker command exists without automatic production scheduling;
- registration eligibility is bounded by a configurable freshness lease;
- offline logout never retains access/refresh credentials for deferred cleanup;
- authenticated foreground runtime renews registration freshness; signed-out foreground runtime does not;
- provider token reuse under a different account/device converges atomically to the latest owner;
- Story external title/body remain generic/privacy-minimized by regression contract;
- notification destinations pass through the Story allowlist and require an active authenticated session;
- refresh-token rotation uses atomic CAS and rejects concurrent reuse;
- `push:delivery-readiness` exposes only bounded provider-selection/configuration/readiness booleans and credential-field presence, never credential values;
- the backend rollout runbook requires staging-first verification, immutable green SHAs/rollback refs, master delivery disabled through initial deployment and external evidence capture before scheduling.

Important boundary: source behavior and readiness tooling are not physical-device or configured-provider evidence. A provider request already started externally cannot be recalled by later database cancellation.

## Remaining Phase 14 evidence only

Use `docs/qa/push-runtime-evidence-matrix.md` as the P14-A stop/go checklist and the backend `docs/operations/push-delivery-rollout.md` plus `deploy/operations/push-delivery-rollout.template.json` as the operational evidence contract. Remaining evidence includes:

1. configured APNs/FCM runtime through the reviewed worker/transports;
2. provider success/transient/permanent/timeout/restart/redaction behavior;
3. physical-device permission/token/background/terminated-app/deep-link behavior;
4. second-device/account isolation against real clients/providers;
5. offline/reconnect ordering evidence for freshness expiry and authenticated renewal;
6. provider credentials, deployment and production worker scheduling only as separately authorized rollout actions.

## Other workstreams

### Labs

Provider-neutral source remains complete through confirmed-result interpretation presentation. Remaining work is provider/native/deployment/device evidence and explicitly authorized provider configuration.

### Stories

Stories S10 source remains complete. Continue only runtime/deployment/device/privacy evidence and bounded reproduced-defect fixes.

### Steps

Provider-neutral source remains complete through local-day/DST-safe fail-closed semantics. HealthKit/Health Connect integration and physical-device evidence remain separately gated.

### Companion

Phase 13 Companion v1 remains the bounded baseline. Richer progression/cosmetics remains deferred unless explicitly reprioritized.

## Next execution order

1. Do not manufacture additional Phase 14 source work merely because external evidence is still pending.
2. Reopen P14 only for a reproduced runtime defect, a reviewed contract change or an explicitly authorized gated provider/native/deployment package.
3. Use the push runtime evidence matrix and backend rollout contract for P14-A external verification.
4. Run configured-provider, physical-device, deployment or production actions only with direct authorization.
5. Keep Labs source closed unless provider/native/runtime work is explicitly opened or a concrete defect appears.
6. Collect Stories/Steps runtime evidence only in authorized environments.
7. Move ordinary autonomous source work to the next explicitly prioritized roadmap package.

## Closed activation gates

Without direct authorization, do not deploy backend code or production migrations, schedule/activate production workers, configure/rotate APNs/FCM credentials, publish OTA/EAS, create/install native release builds, activate HealthKit/Health Connect, activate production Labs providers, access/mutate production data or submit to app stores.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, Social/Stories authority/privacy, Labs privacy/confirmation semantics, Coach auth/API contracts, active-program owner authority, backend revision/idempotency semantics or privacy/export boundaries as incidental follow-up.
