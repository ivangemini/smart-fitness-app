# Smart Fitness Roadmap Progress

Updated: 2026-08-16

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations and Git history override stale prose.

Focused roadmap references retained as stable contracts:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`.

## Verified phase baseline

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: source/CI-complete.
- Stories S10: source-complete; deployment/device/privacy evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition complete; native PDF import and private-processing runtime source are merged; provider/deployment/device evidence remains.
- Phase 13 Companion v1: bounded baseline retained; richer progression/cosmetics deferred.
- Phase 14: source/CI completion checkpoint reached for the currently authorized contracts. Ordinary autonomous Phase 14 source work is closed except for bounded reproduced-defect repair or reviewed contract changes.

There is currently no separately approved Phase 15/general successor source package.

## Current verified checkpoint

### Mobile

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

Relevant merged work includes native Expo Notifications, push reconciliation/provenance hardening, read-only HealthKit/Health Connect Steps integration and native PDF document picking for Labs. #682 passed exact-head Mobile CI.

### Backend

Latest runtime/source merge: `c88410455fa9428724910bfc66da5846f7c4070a` (#254).

#254 merged the fail-closed Labs private-processing runtime: private storage/model extraction composition, strict structured output, privacy-safe readiness, bounded worker commands, production configuration templates and rollout/rollback documentation. It passed exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI.

## What Phase 14 source now guarantees

### Push

Reviewed source covers authenticated registration authority, durable outbox delivery, APNs/FCM transports, fail-closed provider configuration, native token lifecycle, bounded freshness, privacy-minimized payloads, account handoff, atomic refresh-token CAS rotation and readiness/rollback tooling.

Remaining evidence is external: configured-provider sends, physical devices, second-account/device isolation, offline/reconnect ordering and rollout scheduling.

### Labs / Analyses

Native PDF picking is merged in mobile #682 and private extraction runtime is merged in backend #254. Remaining work is configured private storage/model evidence, staging deployment/migrations, provider-output/redaction/error evidence, worker execution/scheduling evidence, physical-device picker/accessibility evidence and separately reviewed model-tool exposure policy.

### Stories

Source-complete. Continue only runtime/deployment/device evidence and repair demonstrated defects.

### Steps

Read-only HealthKit/Health Connect source integration and permission/disclosure wiring are merged in #682. Remaining work is physical-device support/permission/aggregate-read evidence and Home verification against real data. Local-day/DST-safe semantics remain part of the source contract.

## Current execution order

1. Run Labs staging readiness/deployment/provider evidence using #254.
2. Run HealthKit/Health Connect native-build/physical-device evidence using #682.
3. Continue push configured-provider/device evidence through the canonical matrix.
4. Keep Stories evidence-only unless runtime reproduces a defect.
5. Do not manufacture Phase 15 or a broad refactor package without explicit reprioritization.

## Authorization / release boundary

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA are explicitly authorized. Actual execution still requires available access, secrets/signing material and devices.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence and rollback requirements.
