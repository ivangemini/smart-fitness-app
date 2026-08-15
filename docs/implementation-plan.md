# Smart Fitness — Implementation Plan

Updated: 2026-08-15

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Phase 14 scope belongs in `docs/roadmap/phase14-active-workstreams.md`. Exact code, tests, current Git history and repository `AGENTS.md` override stale prose.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660).

Merged Phase 14-adjacent source includes Stories S10 #643, Phase 12 Labs + Settings #644, native push readiness #647, Labs interpretation #648/#653/#654/#657, Steps source/day-boundary work #651/#659, authenticated push registration #656 and offline-logout local credential/session cleanup regression #660.

#660 locks a security invariant: failed remote logout while offline must still erase local session metadata plus access/refresh tokens. Future server convergence must not retain reusable auth credentials after logout.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `37cd865ef94bfc9b2eef4c554ba83e3179726541` (#240).

Merged push/auth source includes provider-neutral contracts #231, persistent registration/API #232, online logout/session cleanup #233/#234, durable outbox/worker #237, Story interaction enqueue/source-removal cancellation #238, active-session expiry semantics #239 and Story preference opt-out race/cancellation hardening #240.

#239 final exact head `f7279651abf98e9658600f082abd1071ad80602e` passed Backend CI and Backend PostgreSQL CI before squash merge to `a2792afe34608e49ba83abcc8fa7ca9a14661b36`. It changes active-list semantics only; cleanup/revoke semantics remain broader.

#240 final exact head `cbcf858e0d6e1b88b8583493ad98ca75f1cc0e55` passed Backend CI and the full Backend PostgreSQL CI before squash merge to `37cd865ef94bfc9b2eef4c554ba83e3179726541`.

There are no open runtime/source PRs in either repository at this checkpoint.

Release readiness remains lower than source completeness because native/device/provider/deployment/production evidence is separately authorization-gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded evidence-backed packages over broad speculative refactors.
- There is no remaining approved autonomous source-refactor phase; new source work must belong to a bounded roadmap package or a demonstrated defect.
- The reviewed local-state storage/performance decision remains `docs/architecture/local-state-performance-decision.md`; do not introduce SQLite without a new evidence-backed decision.
- Preserve routes, stable IDs, persistence/sync contracts, calculations, authentication/session semantics, workout/program lifecycle, completed-history immutability, Social authority/privacy, Labs ownership, active-program authority and backend revision/idempotency contracts unless explicitly changed.
- Stories remain server-authoritative Social state and Labs remains server-authoritative private health data.
- Provider calls and credentials remain backend-only except reviewed native APIs required to obtain device-owned credentials/permissions.
- Source-complete provider/worker/native seams are not production activation authorization.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11:** source/CI-complete for authorized Liquid Glass + Home convergence; future work is bounded demonstrated defects only.
- **Stories S10:** source-complete; runtime/deployment/device evidence remains.
- **Phase 12 Labs + Settings:** provider-neutral source composition complete through confirmed-result interpretation; provider/native/runtime activation gated.
- **Phase 13 Companion v1:** retained; richer pet/cosmetics/progression deferred.
- **Phase 14:** active bounded completion program; remaining large workstreams now cross explicit provider/native/runtime gates.

## Phase 14 workstreams

### P14-A — Real push delivery

#### Source-complete provider-neutral foundation

Backend/mobile source now covers authenticated owner/device registration, `AuthSession.device.id` reuse, fail-closed readiness without implicit permission prompts, atomic account/token handoff, online logout/session cleanup, active-session expiry semantics, durable PostgreSQL outbox jobs, claim/lease fencing, bounded retry/backoff, exact-registration invalid-token handling, Story interaction enqueue behind explicit provider availability + owner preference, source-removal cancellation, Story preference opt-out cancellation/race serialization, credential redaction/export boundaries and local offline-logout credential erasure.

#240 closes the enqueue-vs-opt-out race:

- Story enqueue locks the preference row inside the existing interaction transaction;
- opt-out updates the same preference row and terminalizes only matching pending/retryable/claimed Story jobs in the same transaction;
- a deterministic PostgreSQL regression proves a late job committed by an in-flight enqueue transaction is cancelled before opt-out completes;
- stale claim completion remains fenced.

Database cancellation cannot recall an external provider send that already began. Current provider availability remains disabled, so merged #240 is source/privacy hardening only.

The 2026-08-15 bounded integration audit found no additional provider-neutral source defect: native push APIs remain intentionally unwired before the gate, the Story deep-link route exists and fails closed before private fetch when logged out, Story route composition does not enable provider availability, and the shared enqueue helper requires `deliveryProviderAvailable === true`.

Canonical activation/evidence checklist: `docs/qa/push-runtime-evidence-matrix.md`.

#### Remaining push work

The remaining major packages cross explicit gates and must be completed against the push runtime evidence matrix:

- concrete APNs/FCM adapters and configured-environment evidence;
- provider credentials and production worker scheduling;
- explicit native notification permission UX;
- native credential acquisition/rotation and synchronization;
- offline logout/reconnect server convergence without retained credentials;
- final notification privacy/content/deep-link policy;
- physical-device and second-account/device isolation evidence.

Offline/reconnect convergence is a stop-gate before real delivery activation. A network-isolated device cannot immediately update backend authority, and access/refresh credentials must not be retained after logout to create artificial convergence.

Do not rebuild the durable worker, Story enqueue/source-removal/opt-out paths, active-list expiry semantics or local logout behavior.

### P14-B — Labs / Analyses completion

Provider-neutral source composition is complete through confirmed-result interpretation presentation. Remaining work is production private storage/OCR/model configuration, authorized backend deployment/migrations, PDF native picker/dependency rollout, internal Labs-to-model tool exposure policy and physical-device/accessibility/provider evidence. Do not interpret raw OCR drafts or mutate diagnosis/treatment state.

### P14-C — Stories runtime evidence

Stories S10 source is merged. Use `docs/qa/stories-s10-runtime-matrix.md` and distinguish source/CI evidence, deployed backend/migration evidence, physical-device evidence and second-device/privacy/lifecycle evidence. Repair only reproduced defects and preserve chronological Following/server-authoritative Story access.

### P14-D — Steps / native health activity

Provider-neutral source is complete through #659 with fail-closed availability, daily aggregate seam, device-local calendar-day query contract, DST-safe 23/24/25-hour windows, invalid-date rejection and no fake/workout-derived Steps. HealthKit/Health Connect adapters/dependencies, permission/disclosure UX and physical-device evidence remain separately gated.

## Current execution order

1. Keep canonical docs synchronized to mobile `97bb0ab` and backend `37cd865`.
2. Do not start another broad source package merely because Phase 14 is active; remaining large work is gated.
3. Use `docs/qa/push-runtime-evidence-matrix.md` for future push activation/evidence; otherwise continue read-only audits, QA preparation and bounded demonstrated-defect fixes that do not cross a gate.
4. Open concrete APNs/FCM/native push work only after explicit provider/native authorization.
5. Treat Labs source composition as complete until provider/native/runtime work is explicitly opened or a concrete defect is reproduced.
6. Collect Stories runtime evidence only in authorized environments.
7. Enter HealthKit/Health Connect only after explicit dependency/permission authorization.
8. Re-synchronize roadmap/status/handoff after every material merged checkpoint.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and the reviewed released Expo Doctor baseline.

Backend source PRs require applicable exact-head Backend CI and PostgreSQL CI, plus account-deletion validation when schema/privacy/account lifecycle surfaces change.

Documentation-only synchronization uses diff/ancestry verification when workflows intentionally ignore Markdown-only changes. Documentation must not claim runtime/provider/device evidence that did not run.

## Closed activation gates

Without direct authorization, do not deploy the backend, execute production migrations, activate/schedule production push workers, activate APNs/FCM or provider credentials, request native push permission implicitly, activate HealthKit/Health Connect, activate production Labs providers, add native dependencies solely to bypass a reviewed gate, publish OTA/EAS, create/install native release builds, access/mutate production data or submit to app stores.

## Deferred product scope

Do not begin without explicit reprioritization: algorithmic Following ranking/retention, broad Coach expansion, Companion progression beyond current v1, DMs/groups/marketplace/subscriptions, public private-health/body/nutrition/Coach data, or broad autonomous UI/refactor phases unrelated to a demonstrated defect/reviewed contract.
