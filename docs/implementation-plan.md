# Smart Fitness — Implementation Plan

Updated: 2026-08-16

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Phase 14 scope belongs in `docs/roadmap/phase14-active-workstreams.md`. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase for replacing the current local AppState persistence strategy; reopen that decision only with new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `de2f0f01d2167aa91d7167130159f1b63c595b35` (#667).

Recent Phase 14 push source now includes server-owned registration contract alignment #663 and native Expo Notifications runtime #667. #667 adds explicit permission UX, APNs/FCM device-token acquisition, token-rotation synchronization, foreground presentation, cold-start response consumption and auth-gated allowlisted Story routing.

Final exact head `923435267ae09e02671dcafcb04c88dfeae31ff2` passed the full Mobile CI gate before squash merge.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `c7108f3fb98818cdb726c28a4e235ef642b7902d` (#245).

Recent push source includes concrete APNs HTTP/2 and FCM HTTP v1 transports #242 plus fail-closed provider composition #245. Provider delivery remains disabled unless `PUSH_DELIVERY_ENABLED=true` and the selected provider is explicitly enabled with complete credentials.

No provider credential, production worker schedule, backend deployment or production activation is implied by these merges.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded evidence-backed packages over broad speculative refactors.
- Preserve routes, stable IDs, persistence/sync contracts, calculations, authentication/session semantics, workout/program lifecycle, completed-history immutability, Social authority/privacy, Labs ownership and backend revision/idempotency contracts unless explicitly changed.
- Stories remain server-authoritative Social state and Labs remains server-authoritative private health data.
- Provider calls and credentials remain backend-only except reviewed native APIs required to obtain device-owned permissions/tokens.
- Source-complete provider/native seams are prerequisites for activation, not authorization to activate them.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11:** source/CI-complete for authorized Liquid Glass + Home convergence.
- **Stories S10:** source-complete; runtime/deployment/device evidence remains.
- **Phase 12 Labs + Settings:** provider-neutral source composition complete through confirmed-result interpretation presentation.
- **Phase 13 Companion v1:** retained; richer pet/cosmetics/progression deferred.
- **Phase 14:** active bounded completion program.

## Phase 14 workstreams

### P14-A — Real push delivery

#### Source/CI foundation now complete through native/provider adapters

Merged source covers:

- authenticated owner/device registration and server-owned device authority;
- current-device and remote-session registration cleanup;
- local logout credential/session erasure even when remote logout fails;
- durable PostgreSQL outbox, claim/lease fencing and bounded retry/backoff;
- exact-registration invalid-token handling with credential-rotation protection;
- Story interaction enqueue, source-removal cancellation and preference opt-out race hardening;
- concrete APNs and FCM transports;
- explicit fail-closed provider configuration;
- explicit native notification permission entry point;
- native APNs/FCM token acquisition and token-rotation synchronization;
- foreground notification presentation;
- one-time cold-start notification-response consumption;
- auth-gated allowlisted Story notification routing.

Canonical activation/evidence checklist: `docs/qa/push-runtime-evidence-matrix.md`.

#### Remaining push work

The remaining major work is evidence/activation, not another duplicate provider-neutral implementation:

1. configured-provider runtime evidence against APNs/FCM transports and the durable worker;
2. provider credentials and production worker scheduling under separate authorization;
3. physical-device permission, token, background, terminated-app and deep-link evidence;
4. second-device/account isolation evidence;
5. offline logout/reconnect server convergence without retaining reusable auth credentials;
6. final external notification content/privacy policy;
7. timeout/unknown-result duplicate-risk evidence.

Offline/reconnect convergence remains a stop-gate before real delivery activation. A network-isolated device cannot immediately update backend authority, and access/refresh credentials must not be retained after logout merely to perform deferred cleanup.

Do not rebuild the durable worker, Story enqueue/source-removal/opt-out paths, active-list expiry semantics, local logout behavior, provider adapters or native runtime merely because device/provider evidence is pending.

### P14-B — Labs / Analyses completion

Provider-neutral source composition remains complete through confirmed-result interpretation presentation. Remaining work is production private storage/OCR/model configuration, authorized backend deployment/migrations, PDF native picker/dependency rollout, internal Labs-to-model tool exposure policy and physical-device/accessibility/provider evidence. Do not interpret raw OCR drafts or mutate diagnosis/treatment state.

### P14-C — Stories runtime evidence

Stories S10 source is merged. Use `docs/qa/stories-s10-runtime-matrix.md` and distinguish source/CI evidence, deployed backend/migration evidence, physical-device evidence and second-device/privacy/lifecycle evidence. Repair only reproduced defects.

### P14-D — Steps / native health activity

Provider-neutral source remains complete through device-local calendar-day and DST-safe semantics. HealthKit/Health Connect adapters/dependencies, explicit permission/disclosure UX and physical-device evidence remain separately gated.

## Current execution order

1. Keep canonical docs synchronized to mobile `de2f0f01` and backend `c7108f3f`.
2. Use `docs/qa/push-runtime-evidence-matrix.md` for the next P14-A work; do not infer provider/device completion from source CI.
3. Continue only bounded fixes for reproduced defects while provider/device/deployment gates are closed.
4. Do not activate production APNs/FCM credentials, worker scheduling or backend deployment without direct authorization.
5. Treat Labs source composition as complete until provider/native/runtime work is explicitly opened or a concrete defect appears.
6. Collect Stories/Labs/Steps physical-device or deployed evidence only in authorized environments.
7. Re-synchronize roadmap/status/handoff after every material merged checkpoint.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and the reviewed Expo Doctor baseline.

Backend source PRs require applicable exact-head Backend CI and PostgreSQL CI, plus account-deletion validation when schema/privacy/account lifecycle surfaces change.

Documentation-only synchronization uses diff/ancestry verification when workflows intentionally ignore Markdown-only changes. Documentation must not claim configured-provider, physical-device, second-account/device, deployment or production evidence that did not run.

## Closed activation gates

Without direct authorization, do not deploy the backend, execute production migrations, activate/schedule production push workers, configure/rotate APNs/FCM credentials, publish OTA/EAS, create/install native release builds, activate HealthKit/Health Connect, activate production Labs providers, access/mutate production data or submit to app stores.

## Deferred product scope

Do not begin without explicit reprioritization: algorithmic Following ranking/retention, broad Coach expansion, Companion progression beyond current v1, DMs/groups/marketplace/subscriptions, public private-health/body/nutrition/Coach data or broad autonomous UI/refactor phases unrelated to a demonstrated defect/reviewed contract.
