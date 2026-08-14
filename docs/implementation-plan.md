# Smart Fitness — Implementation Plan

Updated: 2026-08-15

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Phase 14 scope belongs in `docs/roadmap/phase14-active-workstreams.md`. Exact code, tests, current Git history and repository `AGENTS.md` override stale prose.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `2d34fca37bfed92289b097f89ccb8b36d13a1353` (#659).

Merged Phase 14-adjacent source includes:

- Stories S10 #643;
- Phase 12 Labs + Settings #644;
- native push readiness #647;
- Labs interpretation repository #648;
- Steps source seam #651;
- Labs interpretation controller #653;
- Labs context composition #654;
- authenticated push-registration client #656;
- confirmed-result Labs interpretation presentation #657;
- Steps local-day/DST/fail-closed semantics #659.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `dc99dd4d483acfd47c03e0bab9801b7d7d8f6634` (#238).

Merged push source includes:

- provider-neutral delivery contracts #231;
- persistent device registration/API #232;
- current-device cleanup on logout #233;
- remote-session/revoke-others cleanup #234;
- durable outbox/delivery worker #237;
- Story interaction enqueue/source-removal cancellation #238.

#237 passed exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI before merge. #238 passed exact-head Backend CI and PostgreSQL CI, including the Story delete/expiry claimed-job cancellation regression, before merge.

There are no open runtime/source PRs in either repository at this checkpoint.

Release readiness remains lower than source completeness because native/device/provider/deployment/production evidence is separately authorization-gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded evidence-backed packages over broad speculative refactors.
- There is no remaining approved autonomous broad source-refactor phase; new source work must belong to a bounded roadmap package or a demonstrated defect.
- Preserve routes, stable IDs, persistence/sync contracts, calculations, authentication/session semantics, workout/program lifecycle, completed-history immutability, Social authority/privacy, Labs ownership, active-program authority and backend revision/idempotency contracts unless explicitly changed.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md`.
- Local AsyncStorage remains the active local-state strategy; see `docs/architecture/local-state-performance-decision.md`.
- Stories remain server-authoritative Social state and must not enter private revisioned `AppState` sync.
- Labs remains server-authoritative private health data and must not become Social-visible.
- Provider calls and credentials remain backend-only except for reviewed native platform APIs required to obtain device-owned credentials/permissions.
- Source-complete provider, worker, delivery or native seams are not production activation authorization.

## Phase status

- **Phases 1–10:** complete for their established source/CI scope.
- **Phase 11:** source/CI-complete for the authorized Liquid Glass + Home convergence scope; future work is bounded demonstrated defects only.
- **Stories S10:** source-complete; runtime/deployment/device evidence remains.
- **Phase 12 Labs + Settings:** provider-neutral source composition is complete through confirmed-result interpretation presentation; provider/native/runtime activation remains gated.
- **Phase 13 Companion v1:** retained; richer pet/cosmetics/progression remains deferred.
- **Phase 14:** active bounded completion program, but the remaining large workstreams now cross explicit activation/runtime gates.

## Phase 14 workstreams

### P14-A — Real push delivery

#### Source-complete foundation

Backend/mobile source now covers:

- provider-neutral delivery contracts;
- owner/device persistent registrations;
- authenticated mobile registration client using `AuthSession.device.id`;
- fail-closed readiness coordination without implicit permission prompts;
- atomic provider-token account handoff;
- current-device logout cleanup;
- remote-session/revoke-others cleanup;
- durable PostgreSQL outbox jobs;
- claim/lease semantics and stale-worker finalization protection;
- bounded retry/backoff;
- exact-registration invalid-token invalidation with credential-rotation protection;
- Story like/reaction/reply enqueue behind an explicitly enabled provider-availability seam and owner preference;
- source-removal cancellation for direct interaction removal and Story deletion/expiry;
- PostgreSQL evidence for source-removal cancellation of already-claimed jobs;
- credential redaction/export exclusion/privacy inventory boundaries.

#### Remaining push work

The remaining major packages cross provider/native/runtime gates:

- concrete APNs/FCM adapter implementation and configured-environment validation;
- provider credentials and production worker scheduling;
- explicit native notification permission UX;
- native credential acquisition/rotation and synchronization;
- offline logout/reconnect convergence policy and evidence;
- final notification privacy/content/deep-link policy for external delivery;
- physical-device and second-account/device isolation evidence.

Do not rebuild the durable worker or Story enqueue path.

### P14-B — Labs / Analyses completion

Provider-neutral source composition is complete through confirmed-result interpretation presentation:

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

Do not interpret raw OCR drafts or mutate diagnosis/treatment state.

### P14-C — Stories runtime evidence

Stories S10 source is merged. Use `docs/qa/stories-s10-runtime-matrix.md` and distinguish:

1. source/CI evidence;
2. deployed backend/migration evidence;
3. physical-device evidence;
4. second-device/privacy/lifecycle evidence.

Repair only reproduced defects. Preserve chronological Following semantics and server-authoritative Story access.

### P14-D — Steps / native health activity

Provider-neutral source is complete through #659:

- fail-closed runtime source registry;
- daily aggregate hook;
- deterministic unavailable state;
- device-local calendar-day query contract;
- DST-safe 23/24/25-hour day windows;
- invalid-date rejection;
- unsupported/denied source evidence;
- no fake/workout-derived Steps;
- no raw health samples in Social/telemetry/model context.

Still separately gated:

- HealthKit read-only adapter/dependency;
- Health Connect adapter/dependency;
- explicit permission/disclosure UX;
- native denied/unsupported runtime evidence;
- physical-device evidence;
- Home presentation dependent on real native aggregate data.

## Current execution order

1. Keep canonical docs aligned with mobile `2d34fca` and backend `dc99dd4d`.
2. Do not start another broad source package merely because Phase 14 is active; the remaining large work is gated.
3. Continue read-only contract audits, QA preparation and bounded demonstrated-defect fixes that do not cross a gate.
4. Open concrete APNs/FCM/native push work only after explicit provider/native authorization.
5. Treat Labs source composition as complete until provider/native/runtime work is explicitly opened or a concrete defect is reproduced.
6. Collect Stories runtime evidence only in authorized environments.
7. Enter HealthKit/Health Connect only after explicit dependency/permission authorization.
8. Re-synchronize roadmap/status/handoff after every material merged checkpoint.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI:

- repository file line audit;
- changed-file line audit;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- pinned released Expo Doctor baseline until the reviewed SDK upgrade is opened.

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
