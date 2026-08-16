# Smart Fitness Roadmap Progress

Updated: 2026-08-16

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Use it with `docs/implementation-plan.md`, `docs/current-status.md`, `docs/handoffs/latest.md`, `docs/roadmap/phase14-active-workstreams.md`, focused QA matrices and repository `AGENTS.md`. Exact source, tests, migrations and Git history override stale prose.

Focused roadmap references retained as stable contracts:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`.

## Verified phase baseline

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: source/CI-complete; only bounded reproduced regressions remain eligible.
- Stories S10: source-complete; deployment/device/privacy evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition complete through confirmed-result presentation; production provider/native/runtime activation remains gated.
- Phase 13 Companion v1: merged bounded baseline retained; richer progression/cosmetics remain deferred.
- **Phase 14: source/CI completion checkpoint reached for the currently authorized provider-neutral/native contracts. Ordinary autonomous Phase 14 source work is closed.**

There is currently **no separately approved Phase 15/general successor source package** in the canonical roadmap. The next source package must come from an explicit reprioritization, a reviewed contract change, or a bounded defect reproduced by authorized runtime evidence.

## Current verified checkpoint

### Mobile

Latest runtime/source merge remains `4ea37c11c81fafc64c2ef5e1e8479868b66e689e` (#675) for Phase 14 runtime/source behavior.

Relevant merged push work includes:

- authenticated server-owned push registration contract alignment #663;
- native Expo Notifications runtime #667;
- foreground registration reconciliation and freshness renewal #669;
- queued-operation user provenance across auth transitions #674;
- authenticated-only foreground push renewal with signed-out regression coverage #675.

The native source path covers explicit notification permission UX, APNs/FCM native token acquisition and token rotation, foreground presentation, one-time cold-start response consumption and auth-gated allowlisted Story routing.

### Backend

Latest runtime/source merge: `b1643893fc42c57ceaaa54094a1c1c4e1e58b068` (#252).

Relevant merged push/security work includes:

- durable PostgreSQL outbox + provider-neutral worker #237;
- Story enqueue/source-removal/preference cancellation and race hardening #238/#240;
- concrete APNs HTTP/2 and FCM HTTP v1 transports #242;
- explicit fail-closed provider environment composition #245;
- atomic refresh-token CAS rotation #246;
- bounded manual push worker plus registration freshness lease #247;
- privacy-minimized generic Story notification payload regression #249;
- provider-token account handoff regression #250;
- privacy-safe push delivery readiness preflight, staging-first rollout/rollback evidence contract, operational runbook and source-prepared one-shot entrypoint templates #252.

#252 merged only after exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI passed. The readiness command is read-only and does not call APNs/FCM, disclose credential values or activate delivery.

## What Phase 14 source now guarantees

### Push source/CI

The merged source path covers:

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
- foreground and cold-start notification response source behavior;
- bounded registration freshness for offline/logout convergence;
- account handoff ownership convergence;
- atomic refresh-token reuse rejection;
- privacy-safe readiness reporting and source-prepared rollout/rollback evidence contracts.

This is **source/CI completion only**. It does not establish configured-provider delivery, deployed-backend success, physical-device behavior, second-device/account isolation, production scheduling or offline/reconnect runtime ordering.

### Remaining push activation/runtime evidence

Use `docs/qa/push-runtime-evidence-matrix.md` as the stop/go checklist and backend `docs/operations/push-delivery-rollout.md` plus `deploy/operations/push-delivery-rollout.template.json` as the operational evidence contract. Remaining work includes:

1. configured non-production APNs/FCM evidence against the real worker/transports;
2. provider success/transient/permanent/timeout/restart/redaction evidence;
3. physical-device permission/token/foreground/background/terminated-app/deep-link evidence;
4. second-device and second-account isolation evidence;
5. offline logout/reconnect freshness-expiry and authenticated-renewal evidence under real device/network ordering;
6. provider credentials, backend deployment and production worker scheduling only as separately authorized rollout actions.

A provider send that already started externally cannot be recalled by terminalizing its database job. Completion language must preserve that boundary.

### Labs / Analyses

Provider-neutral source composition is complete through confirmed-result interpretation presentation. Remaining work is production private storage/OCR/model configuration, authorized deployment/migrations, PDF native picker/dependency rollout, model-tool exposure policy and provider/device/accessibility evidence.

### Stories

Stories S10 is source-complete. Continue runtime/deployment/device evidence through `docs/qa/stories-s10-runtime-matrix.md` and repair only demonstrated defects.

### Steps

Provider-neutral daily Steps source is complete through local-day/DST-safe/fail-closed semantics. HealthKit/Health Connect adapters, explicit permission/disclosure UX and physical-device evidence remain separately gated.

## Current execution order

1. Keep Phase 14 ordinary source work closed unless runtime evidence reproduces a defect or an explicitly authorized provider/native/deployment package is opened.
2. Use the push runtime evidence matrix and backend rollout/readiness contract for P14-A external evidence; a green readiness manifest is not runtime evidence.
3. Collect Stories/Labs/Steps provider/device/deployed evidence only in authorized environments.
4. Do not activate production APNs/FCM credentials, worker scheduling, backend deployment, production migrations, HealthKit/Health Connect or production Labs providers without direct authorization.
5. Keep Companion v1 bounded; richer progression remains deferred unless reprioritized.
6. Do not manufacture a Phase 15 or broad refactor package. The next autonomous source program requires explicit prioritization in this index and the canonical implementation/status/handoff documents.

## Closed activation and release gates

Without direct authorization, do not deploy backend changes or production migrations, activate/schedule the production push worker, configure or rotate APNs/FCM credentials, publish OTA/EAS updates, create/install native release builds, activate HealthKit/Health Connect, activate production Labs providers, access/mutate production user data or submit to app stores.
