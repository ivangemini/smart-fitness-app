# Smart Fitness — Implementation Plan

Updated: 2026-08-16

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase for replacing the current single AsyncStorage AppState persistence strategy; reopen that decision only with new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest repository merge: `267c6cb75c05b015ac21062a536ce0b36112df1c` (#684).

Latest runtime/source merge remains `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682). #682 closes the native-source gaps for Phase 14 Steps/Labs with read-only HealthKit/Health Connect adapters, native health permission/disclosure plumbing, Android `READ_STEPS`, Home integration against real aggregate data and native PDF document picking. #684 then stabilized reproducible Expo typed-route validation and restored roadmap/local-state documentation contracts. Both passed their applicable exact-head Mobile CI.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `0ab06b98fc1941911d9fcc8f39af588a86cb25e5` (#255).

#254 merged the fail-closed Labs private-processing runtime with private storage + Gemini extraction composition, strict structured output, readiness/worker entrypoints, production configuration plumbing and rollout/rollback templates. #255 then added the isolated Hermes staging topology: a separate `smart-fitness-staging` Compose project, dedicated PostgreSQL volume/network, loopback-only backend ingress, separate provider egress, fresh staging-only secrets and fail-closed provider defaults. #255 passed exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI before merge.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11: source/CI-complete for authorized Liquid Glass + Home convergence.
- Stories S10: source-complete; runtime/deployment/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition complete; native PDF import, private-processing runtime and isolated staging topology are merged; configured-provider/deployment/device evidence remains.
- Phase 13 Companion v1: retained; richer progression/cosmetics deferred.
- Phase 14: source/CI completion checkpoint reached for currently authorized contracts. Remaining work is external evidence, configured-provider/deployment activation or reproduced-defect repair.

## P14-A — Push

Source/CI complete. Remaining work is configured APNs/FCM runtime evidence, physical-device notification behavior, second-device/account isolation, offline/reconnect ordering and explicit rollout evidence.

## P14-B — Labs / Analyses

Source/CI now includes native PDF import, fail-closed private processing and an isolated Hermes staging topology. Remaining work is environment evidence: initial staging boot/migrations, configured private storage/model provider, controlled provider-output/redaction/error evidence, physical-device PDF/image picking, accessibility evidence and any separately reviewed model-tool exposure policy.

Draft extraction remains confirmation-gated and must not infer diagnosis, treatment or missing values.

## P14-C — Stories

Source-complete. Continue only runtime/deployment/device/privacy evidence and bounded fixes for reproduced defects.

## P14-D — Steps

Source/CI includes reviewed read-only HealthKit and Health Connect adapters plus permission/disclosure wiring. Remaining work is native-build/physical-device evidence for support detection, permissions, real aggregate reads, local-day/DST behavior and Home presentation.

## Current execution order

1. Boot and validate the merged isolated Labs staging topology from backend #255, then collect configured private-storage/Gemini evidence with synthetic fixtures only.
2. Collect HealthKit/Health Connect native-build/physical-device evidence for mobile #682 on the current #684 validation baseline.
3. Continue push configured-provider/device evidence through the existing runtime matrix.
4. Keep Stories evidence-only unless a concrete runtime defect is reproduced.
5. Do not manufacture a Phase 15 or broad refactor package without explicit prioritization.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend source PRs require applicable exact-head Backend CI and PostgreSQL CI, plus account-deletion validation when schema/privacy/account-lifecycle surfaces change.

Documentation-only synchronization must not claim configured-provider, physical-device, deployment or production evidence that did not run.

## Activation boundary

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA are explicitly authorized. Execution still requires actual access, credentials/signing material and devices.

Production credential rotation, production scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence and rollback requirements.
