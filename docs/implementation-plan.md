# Smart Fitness — Implementation Plan

Updated: 2026-08-17

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase for replacing the current single AsyncStorage AppState persistence strategy; reopen that decision only with new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest repository/docs merge before this checkpoint: `8b483a200cb1eeb2c6a1173cfa2dcc6ac58f2722` (#685).

Latest runtime/source merge remains `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682). #682 closes the native-source gaps for Phase 14 Steps/Labs with read-only HealthKit/Health Connect adapters, native health permission/disclosure plumbing, Android `READ_STEPS`, Home integration against real aggregate data and native PDF document picking. #684 (`267c6cb75c05b015ac21062a536ce0b36112df1c`) then stabilized reproducible Expo typed-route validation and restored roadmap/local-state documentation contracts. Applicable exact-head Mobile CI passed.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/operations merge: `e67e446c7819ae531da35f8a9a00c6c17eb50bad` (#256).

#254 merged the fail-closed Labs private-processing runtime with private storage + Gemini extraction composition, strict structured output, readiness/worker entrypoints and rollout/rollback plumbing. #255 added the isolated `smart-fitness-staging` Compose topology. #256 then made the bounded staging bootstrap permanent and recorded real Hermes evidence while retaining fail-closed provider defaults.

Exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI were green for #256 before merge.

Verified Hermes staging evidence from the #256 rollout pass:

- Compose project `smart-fitness-staging` exists separately from production;
- backend is exposed only on `127.0.0.1:3100`;
- staging PostgreSQL has no host port and uses dedicated staging state/networking;
- staging secrets live in an external runner-owned `0600` environment file;
- loopback `/health` succeeds;
- Labs readiness is fail-closed: `enabled=false`, `storageReady=false`, `extractionReady=false`, `interpretationEnabled=false`, `ready=false`;
- production Compose, production credentials, production user data and production schedulers were not used.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11: source/CI-complete for authorized Liquid Glass + Home convergence.
- Stories S10: source-complete; runtime/deployment/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native PDF import, private-processing runtime and isolated staging bootstrap are complete for source/CI plus fail-closed staging evidence; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained; richer progression/cosmetics deferred.
- Phase 14: source/CI completion checkpoint reached for currently authorized contracts. Remaining work is configured external-provider evidence, physical-device evidence, deliberate rollout actions or bounded repair of reproduced defects.

## P14-A — Push

Source/CI complete. Remaining work is configured APNs/FCM staging evidence, physical-device notification behavior, second-device/account isolation, offline/reconnect ordering and explicit rollout evidence.

## P14-B — Labs / Analyses

Source/CI and initial isolated-staging evidence are complete through backend #256. The staging topology boots independently on Hermes, health is verified and Labs remains safely disabled/unready until staging-only storage/model prerequisites are supplied.

Remaining work:

1. configure a **staging-only** HTTPS S3-compatible private-storage bucket/namespace and credentials;
2. configure a **staging-only** Gemini credential/model;
3. enable Labs only in staging and require `labs:processing-readiness` to return `ready=true`;
4. process one synthetic document with exactly one bounded worker pass;
5. capture privacy-safe success/error/redaction/lifecycle evidence before enabling any periodic scheduler;
6. collect physical-device PDF/photo picker and accessibility evidence.

Draft extraction remains confirmation-gated and must not infer diagnosis, treatment or missing values.

A plain internal MinIO shortcut is intentionally not part of the current plan: the backend S3-compatible transport requires HTTPS with normal TLS trust, and the security contract must not be weakened merely to simplify staging.

## P14-C — Stories

Source-complete. Continue only runtime/deployment/device/privacy evidence and bounded fixes for reproduced defects.

## P14-D — Steps

Source/CI includes reviewed read-only HealthKit and Health Connect adapters plus permission/disclosure wiring. Remaining work is native-build/physical-device evidence for support detection, permissions, real aggregate reads, local-day/DST behavior and Home presentation.

## Current execution order

1. Supply/configure staging-only HTTPS private object storage + Gemini prerequisites, then run bounded synthetic Labs evidence on the already bootstrapped Hermes staging environment.
2. Collect HealthKit/Health Connect native-build/physical-device evidence for mobile #682 on the current validation baseline.
3. Continue push configured-provider/device evidence through the existing runtime matrix.
4. Keep Stories evidence-only unless a concrete runtime defect is reproduced.
5. Do not manufacture a Phase 15 or broad refactor package without explicit prioritization.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend source/operations PRs require applicable exact-head Backend CI and PostgreSQL CI, plus account-deletion validation when schema/privacy/account-lifecycle surfaces change.

Documentation-only synchronization must not claim configured-provider, physical-device or production evidence that did not run.

## Activation boundary

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA are explicitly authorized. Execution still requires actual access, credentials/signing material and devices.

Production credential rotation, production scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence and rollback requirements.
