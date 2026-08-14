# Smart Fitness Roadmap Progress

Updated: 2026-08-14

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

### Completed / merged baseline

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

Latest runtime/source merge heads before the current Phase 14 packages:

- mobile: `7036cb0257fe38a945ec18726389954c82641dd3` (#657);
- backend: `404963da88939ab2913a5f8a72ae90a51f77459f` (#234).

Documentation-only merges may advance repository `main` without changing that runtime/source baseline. Git history remains authoritative.

### Active source work

Mobile #659 (`feat/p14-steps-local-day-window`) closes provider-neutral Steps day-boundary semantics:

- device-local calendar-day windows;
- half-open `[local midnight, next local midnight)` native query contract;
- DST-safe 23/24/25-hour days without adjacent-day overlap;
- invalid local-date rejection;
- fail-closed unsupported/denied source evidence.

Backend #237 covers the durable push outbox/delivery worker. Backend #238 is the stacked Story interaction enqueue/source-removal package. Provider credentials, deployment, production scheduling and native activation remain outside both packages.

## Remaining active roadmap

### 1. Real push delivery — highest-priority source work

Current packages close the durable worker and Story interaction enqueue composition. Remaining after their validated merge:

1. concrete provider adapter(s) behind the reviewed transport contract;
2. permanent-invalid-token/provider-feedback composition not already handled by the worker;
3. mobile native permission UX and native credential acquisition/rotation;
4. authenticated registration synchronization and offline-logout/reconnect convergence;
5. notification deep-link/content policy and any remaining external-delivery composition;
6. physical-device and second-account/device isolation evidence.

Online server-assisted logout and remote-session cleanup are already source-complete through backend #233/#234 and must not be reimplemented.

### 2. Labs / Analyses

The provider-neutral interpretation chain and confirmed-result presentation are source-complete through mobile #657.

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

After #659, provider-neutral Steps source includes day-boundary and fail-closed source semantics. Remaining work is separately gated:

- HealthKit read-only adapter/dependency;
- Health Connect adapter/dependency;
- explicit permission/disclosure UX;
- native denied/unsupported runtime evidence;
- physical-device evidence and final Home presentation against real aggregate data.

## Current execution order

1. Validate/review/merge backend #237 durable push outbox/delivery worker.
2. Complete #238 Story source-removal regression, retarget it to `main` after #237, then exact-head validate/review/merge.
3. Exact-head validate/review/merge mobile #659 independently.
4. Continue native push permission/token/deep-link composition only when the native/provider gate is explicitly opened.
5. Treat Labs source composition as complete for now; continue only provider/native/runtime packages or demonstrated defects.
6. Collect Stories runtime evidence only in authorized environments.
7. Enter HealthKit/Health Connect only after the dependency/permission gate is opened.
8. Synchronize canonical docs after each materially merged checkpoint.

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
