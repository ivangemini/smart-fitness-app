# Smart Fitness Roadmap Progress

Updated: 2026-08-14

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Use it together with `docs/implementation-plan.md`, `docs/current-status.md`, `docs/handoffs/latest.md`, `docs/roadmap/phase14-active-workstreams.md`, focused roadmaps and repository `AGENTS.md`. Exact source, tests, migrations and Git history override stale prose.

## Verified phase baseline

- Phases 1–10: complete for their established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: complete for the authorized source/CI scope; only reproduced bounded regressions remain eligible for follow-up.
- Stories S10: source-complete across mobile/backend; remaining work is runtime/deployment/device evidence plus reproduced defects.
- Phase 12 Labs + Settings: source foundation is merged; external provider/native/runtime activation remains gated.
- Phase 13 Companion v1: merged baseline retained; richer pet/cosmetics/progression remains deferred unless reprioritized.
- **Phase 14 remains the active bounded completion program.**

## Current Phase 14 checkpoint

### Completed / merged

Mobile:

- #647 — provider-neutral native push readiness contract.
- #648 — Labs interpretation repository boundary.
- #651 — provider-neutral Steps runtime source seam.
- #653 — Labs interpretation state controller.
- #654 — Labs interpretation composition through `LabsContext`.
- #656 — authenticated mobile push-registration client + readiness coordinator.
- #657 — confirmed-result Labs interpretation presentation.

Backend:

- #231 — provider-neutral push delivery contracts.
- #232 — persistent owner-scoped push registrations and authenticated registration HTTP boundary.
- #233 — current-device registration invalidation on authenticated logout in the same server transaction as session revocation.
- #234 — remote-session and revoke-others registration cleanup with exact-head Backend CI + PostgreSQL CI evidence.

Current merged heads at this checkpoint:

- mobile `main`: `7036cb0257fe38a945ec18726389954c82641dd3`;
- backend `main`: `404963da88939ab2913a5f8a72ae90a51f77459f`.

There are no open PRs in either repository at this checkpoint.

### Active source work

Backend branch `feat/p14-push-delivery-outbox-worker` exists from backend `main` `404963d` and currently has no additional commit. Its bounded target is the next real-push source package:

- durable per-device notification outbox;
- lease/claim ownership for concurrent workers;
- bounded retry/backoff using the existing retry policy;
- injected provider transport boundary rather than production credential activation;
- stale-worker protection through claim identity;
- exact-registration invalid-token cleanup so a delayed provider response cannot invalidate a newer token;
- PostgreSQL lifecycle evidence and privacy/schema inventory updates where required.

This branch is source preparation only. It does not activate APNs/FCM, credentials, worker scheduling, deployment or production delivery.

## Remaining active roadmap

### 1. Real push delivery — highest-priority source work

Still required before external delivery can be considered source-complete:

1. durable push outbox schema/store/lease worker;
2. enqueue composition from eligible in-app notification events without widening private data exposure;
3. provider adapter(s) behind the reviewed transport contract;
4. retry/dead-letter and permanent invalid-token feedback into registration state;
5. mobile native permission UX and native credential acquisition/rotation;
6. authenticated registration synchronization using existing `AuthSession.device.id`;
7. offline-logout/reconnect cleanup policy;
8. notification deep-link/content policy and Story interaction delivery integration;
9. physical-device and second-account/device isolation evidence.

Online server-assisted logout and remote-session cleanup are already source-complete through backend #233/#234 and must not be reimplemented.

### 2. Labs / Analyses

The provider-neutral interpretation chain and confirmed-result presentation are now source-complete through mobile #657.

Remaining work is mostly activation/runtime:

- production private object storage/OCR/model provider selection and configuration;
- deployment/migration execution in an authorized environment;
- PDF native picker/dependency decision;
- model-tool exposure policy for the internal read-only Labs service;
- provider/device/small-screen/Dynamic Type/VoiceOver runtime evidence.

Raw OCR/extraction remains draft until explicit confirmation; interpretation remains confirmed-data-only and non-diagnostic.

### 3. Stories runtime completion

Stories S10 source is merged. Remaining work uses `docs/qa/stories-s10-runtime-matrix.md`:

- deployed backend/migration evidence;
- physical-device behavior;
- second-device/privacy/lifecycle evidence;
- bounded fixes only for reproduced defects.

Do not manufacture duplicate source work because runtime evidence is missing.

### 4. Steps / native health activity

Provider-neutral Steps source is merged. Remaining work is separately gated:

- HealthKit read-only adapter/dependency;
- Health Connect adapter/dependency;
- explicit permission/disclosure UX;
- timezone/day-boundary semantics;
- denied/unsupported behavior;
- physical-device evidence and final Home presentation against real aggregate data.

## Current execution order

1. Implement the durable push outbox/delivery worker as a bounded backend package from `404963d`.
2. After that worker is green/merged, add the smallest non-overlapping enqueue/provider-feedback package required for real delivery.
3. Continue native push permission/token/deep-link composition only when the native/provider gate is explicitly opened.
4. Treat Labs source composition as complete for now; continue only provider/native/runtime packages or demonstrated defects.
5. Collect Stories runtime evidence only in authorized environments.
6. Enter HealthKit/Health Connect only after the dependency/permission gate is opened.
7. Synchronize canonical docs after each materially merged checkpoint.

## Working rules

- Continue through meaningful bounded packages rather than stopping after every micro-change.
- Use exact current `main`, open PRs and relevant docs before new work.
- Avoid overlapping branches that modify shared auth/schema/workflow/roadmap surfaces.
- Preserve stable IDs, persistence/sync contracts, authentication/session semantics, revisions, idempotency, completed-history immutability, Social authority/privacy, Labs ownership and privacy/export boundaries unless the task explicitly changes them.
- Keep Social/Stories and Labs server-authoritative.
- Keep provider calls and reusable credentials out of ordinary mobile/network diagnostics and model context.
- Source-complete provider/worker/native seams are prerequisites for activation, not authorization to activate them.

## Closed activation and release gates

Without direct authorization, do not:

- deploy backend changes or execute production migrations;
- activate/schedule the production push worker;
- configure or rotate APNs/FCM/provider credentials;
- request native notification permission implicitly;
- activate HealthKit/Health Connect;
- activate production OCR/storage/model providers;
- add native PDF/health/push dependencies solely to bypass a reviewed gate;
- publish OTA/EAS updates;
- create/install native release builds;
- access or mutate production user data;
- submit to app stores.

## Deferred product scope

Do not begin without explicit reprioritization:

- DMs, groups/communities, trainer marketplace, subscriptions/payments;
- algorithmic feed ranking/recommendations;
- contact-book discovery or location sharing;
- public private-health/body/nutrition/Coach data;
- broad Companion pet/cosmetics progression;
- broad Coach product/material expansion;
- rich Stories/media expansion beyond reviewed runtime defects;
- a new autonomous broad refactor phase.
