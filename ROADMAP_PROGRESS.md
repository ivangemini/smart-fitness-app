# Smart Fitness Roadmap Progress

Updated: 2026-08-16

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Use it with `docs/implementation-plan.md`, `docs/current-status.md`, `docs/handoffs/latest.md`, `docs/roadmap/phase14-active-workstreams.md`, focused QA matrices and repository `AGENTS.md`. Exact source, tests, migrations and Git history override stale prose.

Focused roadmap references retained by the active index:

- `docs/roadmap/release-and-account.md`
- `docs/roadmap/localization-settings.md`
- `docs/roadmap/data-quality-and-scale.md`

## Verified phase baseline

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: source/CI-complete; only bounded reproduced regressions remain eligible.
- Stories S10: source-complete; deployment/device/privacy evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition complete through confirmed-result presentation; production provider/native/runtime activation remains gated.
- Phase 13 Companion v1: merged bounded baseline retained; richer progression/cosmetics remain deferred.
- **Phase 14 remains the active bounded completion program.**

## Current Phase 14 checkpoint

### Mobile

Latest runtime/source merge: `de2f0f01d2167aa91d7167130159f1b63c595b35` (#667).

Relevant merged work now includes:

- authenticated server-owned push registration contract alignment #663;
- native Expo Notifications runtime #667;
- explicit Settings → Notifications permission entry point;
- APNs/FCM native device-token acquisition and synchronization to the authenticated `AuthSession.device.id`;
- native token-rotation listener and re-registration;
- foreground notification presentation;
- one-time cold-start notification-response consumption;
- allowlisted Story destination routing gated by an active authenticated session;
- `expo-notifications` config plugin and npm-generated lockfile;
- permanent Mobile CI restored to read-only permissions with ordinary `npm ci`.

#667 final exact head `923435267ae09e02671dcafcb04c88dfeae31ff2` passed repository/changed-file audits, TypeScript, full regression suite, expanded-model smoke, Expo export and Expo Doctor before squash merge.

### Backend

Latest runtime/source merge: `c7108f3fb98818cdb726c28a4e235ef642b7902d` (#245).

Relevant merged push work includes:

- provider-neutral contracts and persistent registrations/API #231/#232;
- current-device and remote-session registration cleanup #233/#234;
- durable PostgreSQL outbox + worker #237;
- Story enqueue/source-removal cancellation #238;
- active-session expiry semantics #239;
- Story preference opt-out cancellation/race serialization #240;
- concrete APNs HTTP/2 and FCM HTTP v1 transports #242;
- fail-closed environment composition #245.

#245 requires the explicit master switch `PUSH_DELIVERY_ENABLED=true`, then per-provider enablement and complete provider credentials. Credentials alone do not activate delivery. No production worker schedule or provider credential is committed or activated.

## What Phase 14 source now guarantees

### Push source/CI

The merged source path now covers:

- authenticated owner/device registration with server-owned device authority;
- online logout/session-revocation registration cleanup;
- local logout credential erasure even when remote logout fails;
- durable per-device outbox jobs with claim/lease fencing and bounded retry;
- exact-registration invalid-token handling with credential-rotation protection;
- Story interaction enqueue and source-removal/preference cancellation;
- concrete APNs and FCM provider transports;
- fail-closed provider configuration;
- explicit native permission UX;
- native token acquisition and token-rotation synchronization;
- auth-gated allowlisted Story notification routing;
- foreground and cold-start notification response source behavior.

This is **source/CI completion only**. It does not establish configured-provider delivery, physical-device behavior, second-device/account isolation, production scheduling, or offline/reconnect convergence.

### Remaining push activation/runtime work

Use `docs/qa/push-runtime-evidence-matrix.md` as the stop/go checklist. Remaining work includes:

1. configured non-production APNs/FCM evidence against the real worker/transports;
2. provider credentials and production worker scheduling as separately authorized rollout actions;
3. physical-device permission/token/background/terminated-app/deep-link evidence;
4. second-device and second-account isolation evidence;
5. offline logout/reconnect server-convergence policy and runtime evidence without retaining reusable auth credentials;
6. final reviewed external notification content/privacy behavior;
7. timeout/unknown-provider-result evidence and duplicate-delivery-risk documentation.

A provider send that already started externally cannot be recalled by terminalizing its database job. Completion language must preserve that boundary.

### Labs / Analyses

Provider-neutral source composition remains complete through confirmed-result interpretation presentation. Remaining work is production private storage/OCR/model configuration, authorized deployment/migrations, PDF native picker/dependency rollout, model-tool exposure policy and provider/device/accessibility evidence.

### Stories

Stories S10 remains source-complete. Continue runtime/deployment/device evidence through `docs/qa/stories-s10-runtime-matrix.md` and repair only demonstrated defects.

### Steps

Provider-neutral daily Steps source remains complete through local-day/DST-safe/fail-closed semantics. HealthKit/Health Connect adapters, explicit permission/disclosure UX and physical-device evidence remain separately gated.

## Current execution order

1. Keep canonical docs synchronized to mobile `de2f0f01` and backend `c7108f3f`.
2. Do not reopen durable outbox, Story enqueue/opt-out, active-session expiry or local logout packages without reproduced evidence.
3. Use the push runtime evidence matrix for the next P14-A work; configured-provider, physical-device and offline/reconnect evidence remain distinct gates.
4. Do not activate production APNs/FCM credentials, worker scheduling or backend deployment without direct authorization.
5. Keep Labs source closed unless provider/native/runtime work is explicitly opened or a concrete defect is reproduced.
6. Collect Stories/Labs/Steps physical-device or deployed evidence only in authorized environments.
7. Keep Companion v1 bounded; richer progression remains deferred unless reprioritized.

## Closed activation and release gates

Without direct authorization, do not deploy backend changes or production migrations, activate/schedule the production push worker, configure or rotate APNs/FCM credentials, publish OTA/EAS updates, create/install native release builds, activate HealthKit/Health Connect, activate production Labs providers, access/mutate production user data or submit to app stores.
