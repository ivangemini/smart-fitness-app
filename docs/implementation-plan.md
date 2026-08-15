# Smart Fitness — Implementation Plan

Updated: 2026-08-15

This file is the **canonical forward roadmap**. It intentionally does not duplicate the detailed backend source baseline. Exact source/tests/Git history and repository `AGENTS.md` override stale prose.

Reference roles:

- current checkpoint: `docs/current-status.md`;
- restart state: `docs/handoffs/latest.md`;
- focused Phase 14 sequencing: `docs/roadmap/phase14-active-workstreams.md`;
- detailed backend source baseline: [backend `docs/project-context.md`](https://github.com/ivangemini/smart-fitness-backend/blob/main/docs/project-context.md);
- push activation evidence: `docs/qa/push-runtime-evidence-matrix.md`.

## Current checkpoints

- mobile current `main`: `9313fa18419dc657423a7d363724b017b8519392` (#662);
- mobile latest merged runtime/source checkpoint before the active branch: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660);
- mobile active prepared branch: `fix/p14-home-steps-docs`;
- backend current `main`: `2b73f34e168d7a6a1dd4087df1a1992e44137d54` (#241).

Backend #237–#241 are incorporated into the canonical backend source baseline/reference set and must not be recreated as roadmap work.

Release readiness remains lower than source completeness because provider/native/deployment/device evidence is separately authorization-gated.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11:** source/CI-complete for authorized Liquid Glass + Home convergence; future work is bounded reproduced defects only.
- **Stories S10:** source-complete; runtime/deployment/device evidence remains.
- **Phase 12 Labs + Settings:** approved provider-neutral source composition complete through confirmed-result interpretation and strict confirmed-structured-facts-only Coach/model exposure; provider/native/runtime activation gated.
- **Phase 13 Companion v1:** retained; richer pet/cosmetics/progression deferred.
- **Phase 14:** active bounded completion program; remaining large work crosses explicit provider/native/runtime gates.

## Phase 14 forward work

### P14-A — Real push delivery

Provider-neutral source work through backend #241/mobile #660 is closed. #241 additionally derives registration device authority from the authenticated session/device and rejects client-selected registration `deviceId`.

Remaining work:

1. concrete APNs/FCM adapters and configured-environment evidence;
2. provider credentials and production worker scheduling;
3. explicit native notification permission UX;
4. native device credential acquisition/rotation and backend registration convergence;
5. offline logout/reconnect server convergence without retaining reusable auth credentials;
6. final external notification content/privacy/deep-link policy;
7. physical-device and second-account/device isolation evidence.

Use `docs/qa/push-runtime-evidence-matrix.md`. Do not rebuild durable outbox/worker, Story enqueue/source-removal/opt-out or active-session expiry packages.

### P14-B — Labs / Analyses completion

Labs is approved private product scope. Provider-neutral source composition is complete through confirmed-result interpretation presentation. Backend #241 makes storage-unavailable errors privacy-safe and enforces a strict confirmed-structured-facts-only Labs → Coach/model boundary that rejects raw document/OCR/provider extras.

Remaining work:

1. production private storage/OCR/model configuration;
2. authorized backend deployment/migrations;
3. PDF native picker/dependency rollout;
4. provider/device/accessibility evidence.

Do not add diagnosis/treatment state or unrestricted raw-document model access.

### P14-C — Stories runtime evidence

Use `docs/qa/stories-s10-runtime-matrix.md`. Collect deployed backend/migration, physical-device and second-device/privacy/lifecycle evidence only in authorized environments. Repair only reproduced defects.

### P14-D — Steps / native health activity

Provider-neutral local-day/fail-closed source behavior is complete. The active mobile branch also wires that source into Home and refreshes the daily aggregate on app foreground and local-day rollover with DST boundary tests.

Remaining work is HealthKit/Health Connect adapters/dependencies, explicit permission/disclosure UX and physical-device evidence.

## Current execution order

1. Finish validating the active mobile Steps/docs branch without opening provider/native gates.
2. Keep canonical docs synchronized without copying the detailed backend baseline into roadmap/status/handoff files.
3. Enter APNs/FCM/native push only after explicit provider/native authorization.
4. Treat Labs provider-neutral source/model-exposure composition as closed until provider/native/runtime work is opened or a concrete defect is reproduced.
5. Collect Stories runtime evidence only in authorized environments.
6. Enter HealthKit/Health Connect only after explicit dependency/permission authorization.
7. Re-synchronize short status/handoff/roadmap pointers after material merges.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI. Backend source PRs require applicable exact-head Backend CI/PostgreSQL CI plus account-deletion validation when schema/privacy/account lifecycle surfaces change.

Documentation/reference changes must keep links and source-checked inventories aligned. Backend `tests/documentation-reference.test.ts` checks the current API and exported data-model inventories.

## Closed activation gates

Without direct authorization, do not deploy the backend, execute production migrations, activate/schedule production push workers, activate APNs/FCM/provider credentials, request native push permission implicitly, activate HealthKit/Health Connect, activate production Labs providers, add native dependencies solely to bypass a reviewed gate, publish OTA/EAS, create/install native release builds, access/mutate production data or submit to app stores.

## Deferred product scope

Do not begin without explicit reprioritization: algorithmic Following ranking/retention, broad Coach expansion, Companion progression beyond v1, DMs/groups/marketplace/subscriptions, public private-health/body/nutrition/Coach data or broad autonomous refactor phases unrelated to a demonstrated defect/reviewed contract.
