# Latest Handoff

Updated: 2026-08-16

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `de2f0f01d2167aa91d7167130159f1b63c595b35` (#667).

Recent P14-A mobile source:

- #663 — server-owned authenticated device registration contract;
- #667 — Expo Notifications native runtime, explicit permission Settings UX, APNs/FCM native token acquisition, token-rotation synchronization, foreground presentation, one-time cold-start response consumption and authenticated allowlisted Story routing.

#667 final exact head `923435267ae09e02671dcafcb04c88dfeae31ff2` passed repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor before squash merge.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `c7108f3fb98818cdb726c28a4e235ef642b7902d` (#245).

Recent P14-A backend source:

- #237 — durable PostgreSQL push outbox + worker;
- #238/#240 — Story enqueue/source-removal/preference cancellation and race hardening;
- #242 — concrete APNs HTTP/2 and FCM HTTP v1 transports;
- #245 — fail-closed provider composition behind explicit master/provider switches.

No provider credential, production worker schedule, backend deploy or production activation is part of these merges.

## Active continuation target

P14-A no longer has a missing provider/native source adapter package. The next meaningful work is evidence and convergence:

1. configured-provider runtime evidence through the durable worker;
2. physical-device permission/token/background/terminated-app/deep-link evidence;
3. second-device/account isolation evidence;
4. offline logout/reconnect server convergence without retained reusable credentials;
5. final external notification content/privacy review;
6. production provider credentials/worker scheduling only as a separately authorized rollout action.

Use `docs/qa/push-runtime-evidence-matrix.md` as the stop/go checklist. Do not infer provider/device completion from source CI.

## Push lifecycle state to preserve

Merged source behavior includes:

- registration binds to the authenticated server-owned device identity;
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
- native permission is requested only from explicit Settings UX;
- granted/provisional native credentials are synchronized to `AuthSession.device.id`;
- native token rotation triggers re-registration;
- foreground notification presentation is configured;
- cold-start notification response is consumed once;
- notification destinations pass through the Story allowlist and require an active authenticated session.

Important boundary: source behavior is not physical-device or configured-provider evidence. A provider request already started externally cannot be recalled by later database cancellation.

## Offline/reconnect stop-gate

Immediate server convergence is impossible while the device has no network path. Local logout must remain credential-destructive; do not retain access/refresh tokens for deferred cleanup.

Before real delivery is called runtime-complete, define and exercise a bounded stale-registration eligibility/convergence policy that also accounts for network returning before app JavaScript runs and for logging into a different account after offline logout.

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

1. Keep canonical docs synchronized to mobile `de2f0f01` and backend `c7108f3f`.
2. Use the push runtime evidence matrix for remaining P14-A work.
3. Do not duplicate the merged worker/provider/native runtime packages just because configured-provider/device evidence is pending.
4. Resolve offline logout/reconnect convergence before calling real push activation complete.
5. Run configured-provider, physical-device, deployment or production actions only with direct authorization.
6. Keep Labs source closed unless provider/native/runtime work is explicitly opened or a concrete defect appears.
7. Collect Stories/Steps runtime evidence only in authorized environments.
8. Re-synchronize canonical docs after every material merge.

## Closed activation gates

Without direct authorization, do not deploy backend code or production migrations, schedule/activate production workers, configure/rotate APNs/FCM credentials, publish OTA/EAS, create/install native release builds, activate HealthKit/Health Connect, activate production Labs providers, access/mutate production data or submit to app stores.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, Social/Stories authority/privacy, Labs privacy/confirmation semantics, Coach auth/API contracts, active-program owner authority, backend revision/idempotency semantics or privacy/export boundaries as incidental follow-up.
