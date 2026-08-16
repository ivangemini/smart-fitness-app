# Smart Fitness — Implementation Plan

Updated: 2026-08-16

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Phase 14 scope belongs in `docs/roadmap/phase14-active-workstreams.md`. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase for replacing the current local AppState persistence strategy; reopen that decision only with new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `4ea37c11c81fafc64c2ef5e1e8479868b66e689e` (#675).

Recent Phase 14 push source now additionally includes:

- #669 — foreground registration reconciliation and lease renewal;
- #674 — queued-operation user-provenance enforcement across auth changes;
- #675 — authenticated-only foreground push renewal with signed-out regression coverage.

The native Expo Notifications runtime from #667 remains the reviewed base for explicit permission UX, APNs/FCM device-token acquisition, token-rotation synchronization, foreground presentation, cold-start response consumption and auth-gated allowlisted Story routing.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `8592cd9ea0291796e5c5d8c810bfe11ec21826da` (#250).

Recent Phase 14 push source now additionally includes:

- #246 — atomic refresh-token CAS rotation and concurrent refresh regression coverage;
- #247 — bounded manual delivery worker plus configurable registration freshness lease that bounds stale offline-registration eligibility without retaining logout credentials;
- #249 — regression coverage locking privacy-minimized generic Story notification payloads;
- #250 — PostgreSQL account-handoff coverage proving one provider token converges atomically to the latest authenticated account/device owner.

No provider credential, production worker schedule, backend deployment or production activation is implied by these merges.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11:** source/CI-complete for authorized Liquid Glass + Home convergence.
- **Stories S10:** source-complete; runtime/deployment/device evidence remains.
- **Phase 12 Labs + Settings:** provider-neutral source composition complete through confirmed-result interpretation presentation.
- **Phase 13 Companion v1:** retained; richer pet/cosmetics/progression deferred.
- **Phase 14:** **source/CI completion checkpoint reached for the currently authorized provider-neutral/native contracts.** Remaining work is external evidence, gated native/provider integration, deployment or production activation rather than an unfinished general source package.

## Phase 14 completion state

### P14-A — Real push delivery

**Source/CI scope: complete for the currently authorized architecture. Runtime activation/evidence: not complete.**

Merged source now covers:

- authenticated owner/device registration and server-owned device authority;
- current-device and remote-session registration cleanup;
- local logout credential/session erasure even when remote logout fails;
- durable PostgreSQL outbox, claim/lease fencing and bounded retry/backoff;
- exact-registration invalid-token handling with credential-rotation protection;
- Story interaction enqueue, source-removal cancellation and preference opt-out race hardening;
- concrete APNs HTTP/2 and FCM HTTP v1 transports;
- explicit fail-closed provider configuration;
- bounded manual delivery-worker entry point;
- configurable registration freshness lease bounding stale server eligibility after offline logout;
- explicit native notification permission entry point;
- native APNs/FCM token acquisition and token-rotation synchronization;
- foreground registration reconciliation only while an authenticated device exists;
- foreground notification presentation;
- one-time cold-start notification-response consumption;
- auth-gated allowlisted Story notification routing;
- privacy-minimized generic Story notification payload regression coverage;
- account A → B provider-token ownership handoff regression coverage;
- atomic refresh-token rotation under concurrent HTTP refresh attempts.

Canonical activation/evidence checklist: `docs/qa/push-runtime-evidence-matrix.md`.

Remaining push work is **environment evidence and rollout**, not another duplicate provider-neutral implementation:

1. configured-provider runtime evidence against APNs/FCM transports and the durable worker;
2. physical-device permission, token, foreground/background/terminated-app and deep-link evidence;
3. second-device/account evidence against real clients/providers;
4. offline/reconnect evidence showing the registration freshness lease and authenticated foreground renewal behave as designed in real runtime ordering;
5. provider timeout/unknown-result and redaction evidence;
6. provider credentials, worker scheduling and deployment only under separate authorization.

Do not rebuild the durable worker, Story enqueue/cancellation paths, provider transports, registration lease or native runtime merely because external evidence remains pending.

### P14-B — Labs / Analyses completion

**Provider-neutral source composition is complete.** Remaining work requires explicitly opened provider/native/runtime scope: production private storage/OCR/model configuration, authorized backend deployment/migrations, PDF native picker/dependency rollout, internal Labs-to-model tool exposure policy and physical-device/accessibility/provider evidence. Do not interpret raw OCR drafts or mutate diagnosis/treatment state.

### P14-C — Stories runtime evidence

**Source-complete.** Use `docs/qa/stories-s10-runtime-matrix.md` and distinguish source/CI evidence, deployed backend/migration evidence, physical-device evidence and second-device/privacy/lifecycle evidence. Repair only reproduced defects.

### P14-D — Steps / native health activity

**Provider-neutral source-complete through device-local calendar-day and DST-safe semantics.** HealthKit/Health Connect adapters/dependencies, explicit permission/disclosure UX and physical-device evidence remain separately gated.

## Current execution order

1. Treat Phase 14 provider-neutral/native source composition as closed unless a reproduced defect or explicitly opened gated package appears.
2. Use `docs/qa/push-runtime-evidence-matrix.md` for P14-A external evidence; never infer provider/device completion from source CI.
3. Collect Stories/Labs/Steps provider/device/deployed evidence only in authorized environments.
4. Keep provider-backed capabilities fail closed while credentials/deployment/native activation gates remain closed.
5. Re-synchronize roadmap/status/handoff after every material runtime-evidence or rollout checkpoint.
6. Move ordinary autonomous source work to the next explicitly prioritized phase rather than manufacturing additional Phase 14 refactors.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and the reviewed Expo Doctor baseline.

Backend source PRs require applicable exact-head Backend CI and PostgreSQL CI, plus account-deletion validation when schema/privacy/account lifecycle surfaces change.

Documentation-only synchronization uses diff/ancestry verification when workflows intentionally ignore Markdown-only changes. Documentation must not claim configured-provider, physical-device, second-account/device, deployment or production evidence that did not run.

## Closed activation gates

Without direct authorization, do not deploy the backend, execute production migrations, activate/schedule production push workers, configure/rotate APNs/FCM credentials, publish OTA/EAS, create/install native release builds, activate HealthKit/Health Connect, activate production Labs providers, access/mutate production data or submit to app stores.

## Deferred product scope

Do not begin without explicit reprioritization: algorithmic Following ranking/retention, broad Coach expansion, Companion progression beyond current v1, DMs/groups/marketplace/subscriptions, public private-health/body/nutrition/Coach data or broad autonomous UI/refactor phases unrelated to a demonstrated defect/reviewed contract.
