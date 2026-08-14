# Smart Fitness — Implementation Plan

Updated: 2026-08-14

This file is the **canonical forward roadmap**. Verified evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Phase 14 scope belongs in `docs/roadmap/phase14-active-workstreams.md`. Exact code, tests, current Git history and repository `AGENTS.md` override stale prose.

## Current verified checkpoint

### Mobile

- Repository: `ivangemini/smart-fitness-app`.
- Stories S10 mobile PR #643 is merged.
- Phase 12 Labs + Settings PR #644 is merged.
- Native push contract/readiness foundation PR #647 is merged with safe-disabled defaults.
- Labs interpretation repository PR #648 and state controller PR #653 are merged.
- Steps provider-neutral runtime source seam PR #651 is merged as `b71e1f6bf3724238ebef4aebc67350d4260fbb5b` after complete exact-head Mobile CI; the subsequent `main` CI also passed the complete gate.
- Labs interpretation context PR #654 is merged as `f66476fb613a313aae74d1e30befa3a202c98a8f` after complete exact-head Mobile CI. Its generation guard prevents stale asynchronous interpretation runs from overwriting newer document state.
- A prepared branch `feat/p14-mobile-registration-client` contains the provider-neutral authenticated mobile push-registration client and readiness coordinator. It is not yet merged and does not activate native permission or APNs/FCM delivery.

### Backend

- Repository: `ivangemini/smart-fitness-backend`.
- Stories S10 PR #229 and Phase 12 Labs PR #230 are merged.
- Provider-neutral push delivery contracts PR #231 is merged.
- Push-registration persistence/API PR #232 is merged as `aa0b1e97951fab107756c4138866cd3bc618219b` after exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI all passed.
- Migration `0051_push_device_registrations` is registered in the Drizzle journal, applies successfully, is idempotent and passes migrated-schema validation.

Release readiness remains lower than source completeness because physical-device, native-release, provider, deployment and production evidence are separately authorization-gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded evidence-backed packages over cosmetic churn.
- Preserve routes, stable IDs, private persistence/sync contracts, calculations, authentication/session semantics, workout/program lifecycle, completed-history immutability, Social authority/privacy, active-program owner authority and backend ownership/revision/idempotency contracts unless a task explicitly changes them.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md`.
- Local AsyncStorage remains the active local-state strategy. Reviewed decision evidence: `docs/architecture/local-state-performance-decision.md`.
- Stories remain in the server-authoritative Social boundary and must not be added to private revisioned `AppState` sync.
- Provider calls and credentials remain backend-only unless a reviewed native capability explicitly requires device-side provider interaction.
- Source-complete provider, export, worker, delivery or native seams are not activation authorization.
- Do not claim physical-device, native-release, deployment, provider or production evidence unless it actually ran and was explicitly authorized.

## Phase status

- **Phases 1–10:** complete for their established source/CI scope.
- **Phase 11 Liquid Glass + Home convergence:** source/CI-complete for the authorized LG-1 through LG-5 scope. Later demonstrated regressions may receive bounded fixes; there is no implicit LG-6/LG-7 refactor program.
- **Stories S10:** source-complete across mobile/backend. Remaining work is runtime/deployment/device evidence only unless a concrete regression is reproduced.
- **Phase 12 Labs + Settings:** source foundation merged. Provider/runtime/native document-import completion remains separately gated.
- **Phase 13 Companion v1:** merged baseline retained; pet/cosmetics/progression expansion remains deferred unless explicitly reprioritized.
- **Phase 14:** active bounded runtime/source-completion program described below.

## Phase 14 active workstreams

### P14-A — Labs interpretation composition

**Current source status:** context integration complete through PR #654.

Established:

- authenticated repository and interpretation state controller;
- capability loading through `LabsContext`;
- fail-closed unavailable state;
- document-scoped retained interpretation;
- stale asynchronous run invalidation;
- logout/refresh invalidation of in-flight interpretation writes.

Remaining source candidates must preserve confirmed-data-only interpretation, explicit review before canonical confirmation, minimum necessary model context and no automatic diagnosis/treatment mutation.

Still separately gated:

- production OCR/storage/model provider activation;
- native PDF picker/dependency rollout;
- backend deployment/migration execution;
- physical-device/import/provider evidence.

### P14-B — Stories runtime evidence

Stories S10 source is already merged. Remaining work is evidence, not duplicate source implementation.

Use the consolidated runtime matrix in `docs/qa/stories-s10-runtime-matrix.md` and distinguish:

1. source/CI evidence;
2. deployed backend/migration evidence;
3. physical-device evidence;
4. second-device/privacy/lifecycle evidence.

Repair only demonstrated runtime defects. Preserve chronological Following semantics and server-authoritative Story access.

### P14-C — Real push delivery

**Backend registration source is merged through PR #232. Mobile client source is prepared but not yet merged.**

Next source package:

- publish the prepared authenticated mobile registration repository and readiness coordinator as its own bounded PR;
- bind registration to existing `AuthSession.device.id` rather than creating a second device UUID;
- preserve one refresh-on-401 retry and fail before network access without an authenticated session;
- require native readiness before backend registration;
- never request native permission automatically from the repository/coordinator;
- preserve account-switch token handoff and owner-scoped unregister semantics;
- keep registration credentials out of API responses, logs and Data Access Export candidate surfaces.

After that, separately review logout/device-revocation composition, notification outbox/delivery worker, provider adapter, retry/invalid-token policy, deep-link routing and Story interaction delivery.

Still separately gated:

- APNs/FCM/Expo transport activation;
- provider credentials;
- native permission prompt rollout;
- production delivery worker;
- backend deployment;
- OTA/EAS/native release/device evidence.

### P14-D — Steps / native health activity

**Provider-neutral source seam is merged through PR #651.**

Established:

- fail-closed runtime source registry;
- typed daily Steps hook;
- unavailable default;
- no fake or workout-derived steps.

Still separately gated:

- HealthKit/Health Connect dependency selection;
- permission/disclosure UX;
- native adapter implementation;
- physical-device/native build evidence;
- Home presentation changes dependent on real native data.

## Current execution order

1. Publish and merge the canonical Phase 14 documentation consolidation.
2. Rebase/validate/publish the prepared mobile push-registration client against mobile `main` and merged backend #232.
3. Add logout/account-switch/device-revocation composition only after the mobile registration client contract is green and merged.
4. Continue Labs confirmed-result presentation/provider-independent composition only where source changes remain useful without activating external providers.
5. Collect Stories runtime evidence only in authorized environments; do not manufacture duplicate source work.
6. Enter HealthKit/Health Connect, APNs/FCM, PDF-native, provider, deployment or physical-device work only after the corresponding explicit authorization gate is opened.

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

Documentation-only synchronization uses diff/ancestry verification when workflows intentionally ignore Markdown-only changes. Documentation must not claim runtime/provider/device evidence that did not actually run.

## Closed activation gates

Without direct authorization, do not:

- deploy the backend;
- execute production migrations;
- activate APNs/FCM or provider delivery;
- configure/rotate provider credentials;
- request native push permission from users;
- activate HealthKit or Health Connect;
- add a native PDF/health/push dependency solely to bypass the reviewed gate;
- publish OTA/EAS updates;
- create/install a native release build;
- access or mutate production data;
- submit to an app store.

## Deferred product scope

Do not begin without explicit reprioritization:

- algorithmic Following feed ranking/retention changes;
- broad Coach product/material expansion;
- Companion pet/cosmetics/progression expansion beyond the current v1 baseline;
- DMs/groups/trainer marketplace/subscriptions;
- public private-health/body/nutrition/Coach data;
- broad autonomous UI/refactor phases unrelated to a demonstrated defect or reviewed product contract.
