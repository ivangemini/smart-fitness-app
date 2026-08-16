# Smart Fitness — Implementation Plan

Updated: 2026-08-16

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

Recent Phase 14 source completion now includes:

- #667 — native Expo Notifications runtime;
- #669/#674/#675 — authenticated push reconciliation, queue provenance and signed-out renewal hardening;
- #682 — read-only HealthKit/Health Connect Steps adapters, explicit native health permission/disclosure plumbing, `READ_STEPS`, Home integration against real aggregate data, and native PDF document picking for Labs.

#682 passed exact-head Mobile CI before merge. This establishes source/CI completion only; no physical-device HealthKit/Health Connect or PDF-picker evidence is implied.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest merged checkpoint remains #252 while #254 completes exact-head validation. #254 adds the fail-closed private Labs processing runtime, structured Gemini extraction adapter, readiness/worker entrypoints, provider/private-storage configuration, deployment templates and rollout/rollback documentation. It must not be treated as merged until its Backend CI, PostgreSQL CI and Account Deletion Receipt CI are green on the exact head.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11: source/CI-complete for authorized Liquid Glass + Home convergence.
- Stories S10: source-complete; runtime/deployment/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition complete; native PDF source integration is now merged in #682; provider/deployment/device evidence remains gated.
- Phase 13 Companion v1: retained; richer progression/cosmetics deferred.
- Phase 14: source/CI completion checkpoint reached for currently authorized contracts. Remaining work is external evidence, configured-provider/deployment activation or reproduced-defect repair.

## P14-A — Real push delivery

Source/CI is complete for the reviewed architecture. Remaining work is configured APNs/FCM runtime evidence, physical-device notification behavior, second-device/account isolation, offline/reconnect ordering and explicitly authorized deployment/production activation.

Canonical checklist: `docs/qa/push-runtime-evidence-matrix.md`.

## P14-B — Labs / Analyses

Mobile source now includes the native PDF document picker/dependency path from #682. Backend #254 is the active merge candidate for private storage + structured extraction runtime and remains fail-closed by default.

After #254 merges, remaining Labs work is environment evidence and activation: configured private storage/model provider, authorized deployment/migrations, physical-device PDF/image picking, accessibility/runtime evidence and any separately reviewed internal model-tool exposure policy. Draft extraction must remain confirmation-gated and must not infer diagnosis, treatment or missing values.

## P14-C — Stories

Source-complete. Continue only runtime/deployment/device/privacy evidence through `docs/qa/stories-s10-runtime-matrix.md` and bounded fixes for reproduced defects.

## P14-D — Steps / native health activity

Source/CI now includes reviewed read-only HealthKit and Health Connect adapters plus explicit permission/disclosure wiring from #682. The previous native-integration source gate is closed.

Remaining work is physical-device evidence: supported/unsupported states, denied/granted permissions, real aggregate reads, local-day/DST behavior against device data and Home presentation. Production/native activation and release-build/device installation remain separately authorized actions.

## Current execution order

1. Complete exact-head validation and merge backend #254 only if all required gates are green.
2. Synchronize canonical docs with the actual #254 merge SHA.
3. Treat Phase 14 ordinary source work as closed unless runtime evidence reproduces a defect or an explicitly authorized provider/native/deployment package is opened.
4. Collect Push/Labs/Stories/Steps runtime evidence only in authorized environments.
5. Do not manufacture a Phase 15 or broad refactor package without explicit prioritization.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend source PRs require applicable exact-head Backend CI and PostgreSQL CI, plus account-deletion validation when schema/privacy/account-lifecycle surfaces change.

Documentation-only synchronization must not claim configured-provider, physical-device, deployment or production evidence that did not run.

## Closed activation gates

Without direct authorization, do not deploy the backend, execute production migrations, activate/schedule production workers, configure/rotate APNs/FCM credentials, publish OTA/EAS, create/install native release builds, activate HealthKit/Health Connect on production/release devices, activate production Labs providers, access/mutate production data or submit to app stores.
