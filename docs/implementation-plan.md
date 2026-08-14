# Smart Fitness — Implementation Plan

Updated: 2026-08-14

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Phase 14 scope belongs in `docs/roadmap/phase14-active-workstreams.md`. Exact code, tests, current Git history and repository `AGENTS.md` override stale prose.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge before this documentation synchronization: `7036cb0257fe38a945ec18726389954c82641dd3` (#657). Documentation-only merges may advance `main` without changing that runtime/source baseline.

Merged Phase 14-adjacent source now includes:

- Stories S10 #643;
- Phase 12 Labs + Settings #644;
- native push readiness foundation #647;
- Labs interpretation repository #648;
- Steps runtime source seam #651;
- Labs interpretation controller #653;
- Labs context composition #654;
- authenticated push registration client #656;
- confirmed-result Labs interpretation presentation #657.

Current source package #659 closes provider-neutral Steps local-day/day-boundary semantics without native activation.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge before this documentation synchronization: `404963da88939ab2913a5f8a72ae90a51f77459f` (#234). Documentation-only merges may advance `main` without changing that runtime/source baseline.

Merged push source now includes:

- provider-neutral contracts #231;
- persistent device registration/API #232;
- current-device cleanup on logout #233;
- remote-session/revoke-others cleanup #234.

#234 was merged only after exact-head Backend CI and PostgreSQL CI passed and review threads were empty.

Phase 14 push worker/enqueue work continues in bounded backend PRs; provider credentials, deployment and worker activation remain separately gated.

Release readiness remains lower than source completeness because native/device/provider/deployment/production evidence is separately authorization-gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded evidence-backed packages over broad speculative refactors.
- There is no remaining approved autonomous source-refactor phase; new source work must belong to a bounded roadmap package or a demonstrated defect.
- Preserve routes, stable IDs, persistence/sync contracts, calculations, authentication/session semantics, workout/program lifecycle, completed-history immutability, Social authority/privacy, Labs ownership, active-program authority and backend revision/idempotency contracts unless explicitly changed.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md`.
- Local AsyncStorage remains the active local-state strategy; see `docs/architecture/local-state-performance-decision.md`.
- Stories remain server-authoritative Social state and must not enter private revisioned `AppState` sync.
- Labs remains server-authoritative private health data and must not become Social-visible.
- Provider calls and credentials remain backend-only except for reviewed native platform APIs required to obtain device-owned credentials/permissions.
- Source-complete provider, export, worker, delivery or native seams are not production activation authorization.

## Phase status

- **Phases 1–10:** complete for their established source/CI scope.
- **Phase 11:** source/CI-complete for the authorized Liquid Glass + Home convergence scope; future work is bounded demonstrated defects only.
- **Stories S10:** source-complete; runtime/deployment/device evidence remains.
- **Phase 12 Labs + Settings:** source composition now includes confirmed-result interpretation presentation; provider/native/runtime activation remains gated.
- **Phase 13 Companion v1:** retained; richer pet/cosmetics/progression remains deferred.
- **Phase 14:** active bounded runtime/source-completion program.

## Phase 14 active workstreams

### P14-A — Real push delivery

This is the current highest-priority source workstream.

Already source-complete:

- provider-neutral delivery contracts;
- owner/device persistent registrations;
- authenticated mobile registration client;
- reuse of `AuthSession.device.id`;
- one refresh-on-401 mobile retry;
- fail-closed readiness coordination without implicit permission prompts;
- atomic provider-token account handoff;
- current-device cleanup on authenticated logout;
- remote-session/revoke-others cleanup;
- credential redaction/export exclusion/privacy inventory boundaries.

Current backend packages cover the durable push outbox/delivery worker and transactional Story interaction enqueue composition.

Required worker properties:

- durable per-device jobs in PostgreSQL;
- lease/claim semantics for concurrent workers;
- bounded retry/backoff using existing policy;
- provider transports injected behind the existing contract;
- stale-worker finalization protection through claim identity;
- exact-registration invalid-token invalidation so delayed provider responses cannot invalidate a newer credential;
- no raw reusable token in ordinary outbox/event payloads where a registration reference is sufficient;
- migration/schema/privacy/account-deletion coverage as applicable;
- exact-head Backend CI + PostgreSQL CI.

Later non-overlapping packages:

- concrete APNs/FCM adapter(s);
- permanent-invalid-token feedback;
- native permission UX and credential acquisition/rotation;
- offline logout/reconnect cleanup policy;
- notification content/deep-link policy and remaining delivery composition;
- physical-device and second-account/device evidence.

Still separately gated:

- provider credentials;
- APNs/FCM activation;
- production worker scheduling;
- backend deployment/migrations;
- native build/install, OTA/EAS and device evidence.

### P14-B — Labs / Analyses completion

Provider-neutral source composition is now complete through mobile #657:

- repository/state/context boundary;
- fail-closed capability handling;
- stale async generation protection;
- confirmed-document-only interpretation;
- bounded confirmed-result presentation;
- provider/model provenance display without raw provider payload exposure;
- explicit non-diagnostic/non-treatment product copy.

Remaining work is mainly provider/native/runtime activation:

- production private object storage/OCR/model provider decision/configuration;
- backend deployment/migrations in an authorized environment;
- PDF native picker/dependency rollout;
- internal Labs-to-model tool exposure policy;
- physical-device/accessibility/provider evidence.

Do not interpret raw OCR drafts or mutate treatment/diagnosis state.

### P14-C — Stories runtime evidence

Stories S10 source is merged. Use `docs/qa/stories-s10-runtime-matrix.md` and distinguish:

1. source/CI evidence;
2. deployed backend/migration evidence;
3. physical-device evidence;
4. second-device/privacy/lifecycle evidence.

Repair only reproduced defects. Preserve chronological Following semantics and server-authoritative Story access.

### P14-D — Steps / native health activity

Provider-neutral source seam is merged. Current package #659 adds source-level local calendar-day semantics:

- half-open `[local midnight, next local midnight)` native query windows;
- DST-safe 23/24/25-hour day handling;
- strict invalid local-date rejection;
- explicit unsupported/denied fail-closed evidence.

Still separately gated after #659:

- HealthKit/Health Connect dependency selection;
- read-only adapter implementation;
- explicit permission/disclosure UX;
- native denied/unsupported runtime evidence;
- physical-device evidence;
- Home presentation changes dependent on real native aggregate data.

## Current execution order

1. Validate/review/merge the durable push outbox/delivery worker.
2. Validate the smallest transactional Story enqueue/source-removal package on top of the worker, then retarget it to `main` after the worker merge.
3. Enter concrete APNs/FCM/native push activation only when its credentials/native/device authorization gate is opened.
4. Treat Labs source composition as complete until provider/native/runtime work is explicitly opened or a concrete defect is reproduced.
5. Collect Stories runtime evidence only in authorized environments.
6. Complete #659 provider-neutral Steps local-day semantics; enter HealthKit/Health Connect only after explicit dependency/permission authorization.
7. Synchronize roadmap/status/handoff after every material merged checkpoint.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI:

- repository file line audit;
- changed-file line audit;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- Expo Doctor.

Backend source PRs require the repository's relevant exact-head gates, including PostgreSQL and account-deletion validation when schema/privacy surfaces change.

Documentation-only synchronization uses diff/ancestry verification when workflows intentionally ignore Markdown-only changes. Documentation must not claim runtime/provider/device evidence that did not run.

## Closed activation gates

Without direct authorization, do not:

- deploy the backend;
- execute production migrations;
- activate/schedule production push workers;
- activate APNs/FCM or configure/rotate provider credentials;
- request native push permission implicitly;
- activate HealthKit/Health Connect;
- activate production Labs storage/OCR/model providers;
- add native PDF/health/push dependencies solely to bypass a reviewed gate;
- publish OTA/EAS updates;
- create/install native release builds;
- access/mutate production data;
- submit to app stores.

## Deferred product scope

Do not begin without explicit reprioritization:

- algorithmic Following feed ranking/retention changes;
- broad Coach product/material expansion;
- Companion pet/cosmetics/progression expansion beyond current v1;
- DMs/groups/trainer marketplace/subscriptions;
- public private-health/body/nutrition/Coach data;
- broad autonomous UI/refactor phases unrelated to a demonstrated defect or reviewed product contract.
