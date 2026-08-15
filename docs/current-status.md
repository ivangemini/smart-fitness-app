# Smart Fitness Current Status

Updated: 2026-08-16

Exact code, tests, migrations and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `de2f0f01d2167aa91d7167130159f1b63c595b35` (#667).

Recent push source includes:

- #663 — registration aligned to server-owned authenticated device authority;
- #667 — native Expo Notifications runtime, explicit notification settings UX, native APNs/FCM token acquisition, token rotation synchronization, foreground presentation, cold-start tap consumption and auth-gated allowlisted Story routing.

#667 final exact head `923435267ae09e02671dcafcb04c88dfeae31ff2` passed the full Mobile CI gate before squash merge.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `c7108f3fb98818cdb726c28a4e235ef642b7902d` (#245).

Recent push source includes:

- #231/#232 — provider-neutral contracts and persistent authenticated registrations;
- #233/#234 — current-device and remote-session registration cleanup;
- #237 — durable PostgreSQL outbox + provider-neutral worker;
- #238 — Story interaction enqueue + source-removal cancellation;
- #239 — active-session expiry semantics;
- #240 — Story preference opt-out cancellation and enqueue/opt-out serialization;
- #242 — concrete APNs HTTP/2 and FCM HTTP v1 transports;
- #245 — explicit fail-closed provider environment composition.

#245 does not activate delivery. `PUSH_DELIVERY_ENABLED=true` is required before any provider can be composed, and each provider must also be explicitly enabled with complete credentials.

## Phase 14 status

`docs/roadmap/phase14-active-workstreams.md` is the focused roadmap. The P14-A source path now reaches concrete provider and native adapters. Remaining push work is predominantly configured-provider, physical-device, second-account/device, offline/reconnect and rollout evidence.

## Push delivery

### Source / CI-complete foundation

Backend/mobile source now includes:

- authenticated server-owned device registration;
- registration ownership/token handoff and auth retry behavior;
- current-device and remote-session cleanup;
- local logout credential/session erasure even when remote logout fails;
- durable outbox, claim/lease ownership, stale-worker fencing and bounded retry/backoff;
- exact-registration invalid-token handling with rotation protection;
- Story enqueue, source-removal cancellation and preference opt-out serialization;
- concrete APNs and FCM transports;
- fail-closed provider composition requiring explicit enable switches;
- explicit native permission UX;
- native APNs/FCM device-token acquisition and synchronization;
- token-rotation listener and re-registration;
- foreground notification handler;
- one-time cold-start notification response consumption;
- Story notification destination allowlist plus active-auth requirement.

### Runtime evidence still pending

Source CI does not prove external/provider/device runtime. Still pending:

- configured APNs/FCM send evidence through the durable worker;
- provider success/transient/permanent/timeout behavior in an authorized environment;
- production credentials and worker scheduling as separate rollout actions;
- physical-device permission/token/background/terminated-app behavior;
- authenticated and logged-out deep-link device evidence;
- second-device/account isolation;
- offline logout/reconnect server convergence without retained reusable credentials;
- reviewed external notification content/privacy behavior.

Canonical checklist: `docs/qa/push-runtime-evidence-matrix.md`.

### Offline logout boundary

Local logout security is permanently regression-covered: access token, refresh token and session metadata are erased even when the device cannot reach the backend. Immediate authoritative server cleanup is impossible without connectivity.

Before real external delivery is called runtime-complete, the reconnect/eligibility policy must bound stale server registration behavior without retaining reusable credentials after logout. The policy must also account for the OS/provider regaining network connectivity before application JavaScript runs.

## Labs / Analyses

Provider-neutral Labs source remains complete through confirmed-result interpretation presentation. Remaining work is production private storage/OCR/model configuration, authorized deployment/migrations, PDF native picker/dependency, model-tool exposure policy and provider/device/accessibility evidence.

## Stories

Stories S10 source remains merged. Continue only deployment/device/privacy evidence through `docs/qa/stories-s10-runtime-matrix.md` plus bounded fixes for reproduced defects.

## Steps

Provider-neutral Steps source remains complete through deterministic unavailable state, device-local calendar-day windows, DST-safe 23/24/25-hour handling and no fake/workout-derived Steps. HealthKit/Health Connect integration and physical-device evidence remain separately gated.

## Companion

Phase 13 Companion v1 remains the bounded merged baseline. Richer pet/cosmetics/naming/progression stays deferred unless explicitly reprioritized.

## CI execution

Mobile authoritative routine CI uses `[self-hosted, linux, x64, hermes-mobile-ci]` and includes repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend authoritative routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` and applicable lint/format/build/test/PostgreSQL/account-deletion gates.

Do not substitute source CI for configured-provider, physical-device, deployment or production evidence.

## Current remaining roadmap

1. Keep canonical docs aligned to mobile `de2f0f01` and backend `c7108f3f`.
2. Use `docs/qa/push-runtime-evidence-matrix.md` for remaining P14-A evidence; do not duplicate already merged provider/native source.
3. Define and validate offline logout/reconnect convergence before real external delivery activation.
4. Run configured-provider and physical-device evidence only in explicitly authorized environments.
5. Keep Labs source closed unless provider/native/runtime work is opened or a concrete defect appears.
6. Collect Stories/Steps runtime evidence only in authorized environments.
7. Keep broad Coach/Companion expansion and feed-ranking scope deferred unless reprioritized.

## Safety / activation boundaries

Do not perform without direct authorization: OTA/EAS publication, native release build/install, backend deployment, production migrations, production push worker scheduling, production data access/mutation, APNs/FCM credential activation/rotation, HealthKit/Health Connect activation, production Labs provider activation, DNS changes, destructive production cleanup or app-store submission.
