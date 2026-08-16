# Smart Fitness Roadmap Progress

Updated: 2026-08-17

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations and Git history override stale prose.

Focused roadmap references retained as stable contracts:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`.

## Verified phase baseline

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: source/CI-complete.
- Stories S10: source-complete; deployment/device/privacy evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native PDF import, private-processing runtime and isolated Hermes staging bootstrap/evidence are complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: bounded baseline retained; richer progression/cosmetics deferred.
- Phase 14: source/CI completion checkpoint reached for the currently authorized contracts. Ordinary autonomous Phase 14 source work is closed except for bounded reproduced-defect repair or reviewed contract changes.

There is currently no separately approved Phase 15/general successor source package.

## Current verified checkpoint

### Mobile

Latest repository/docs merge before this checkpoint: `8b483a200cb1eeb2c6a1173cfa2dcc6ac58f2722` (#685). Latest runtime/source merge remains `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682); #684 (`267c6cb75c05b015ac21062a536ce0b36112df1c`) stabilized persistent-checkout typed-route validation. Applicable exact-head Mobile CI passed.

### Backend

Latest runtime/operations merge: `e67e446c7819ae531da35f8a9a00c6c17eb50bad` (#256).

#254 merged fail-closed Labs private processing. #255 added the isolated `smart-fitness-staging` topology. #256 retained the bounded permanent staging bootstrap, strengthened isolation guards and recorded real Hermes staging evidence. Exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI were green before merge.

## What Phase 14 now proves

### Push

Reviewed source covers authenticated registration authority, durable outbox delivery, APNs/FCM transports, fail-closed provider configuration, native token lifecycle, bounded freshness, privacy-minimized payloads, account handoff, atomic refresh-token CAS rotation and readiness/rollback tooling.

Remaining evidence is external: configured-provider sends, physical devices, second-account/device isolation, offline/reconnect ordering and rollout scheduling.

### Labs / Analyses

Native PDF picking is merged in mobile #682 and private extraction runtime in backend #254. Backend #255/#256 now additionally prove an isolated Hermes staging project can boot separately from production with loopback-only backend ingress, a private staging database, dedicated staging state, external runner-owned secrets, successful `/health` and fail-closed Labs readiness.

Remaining work is no longer initial staging boot. It is:

- staging-only **HTTPS** S3-compatible private storage/namespace and credentials;
- staging-only Gemini credential/model;
- readiness `ready=true` after configuration;
- one synthetic upload and exactly one bounded worker pass;
- privacy-safe provider/output/error/redaction/lifecycle evidence;
- physical-device picker/accessibility evidence.

The current S3-compatible transport intentionally rejects non-HTTPS endpoints. Do not weaken that security boundary or substitute plain internal MinIO merely to bypass the configured-storage gate.

### Stories

Source-complete. Continue only runtime/deployment/device evidence and repair demonstrated defects.

### Steps

Read-only HealthKit/Health Connect source integration and permission/disclosure wiring are merged in #682. Remaining work is physical-device support/permission/aggregate-read evidence and Home verification against real data. Local-day/DST-safe semantics remain part of the source contract.

## Current execution order

1. Configure staging-only HTTPS private storage + Gemini prerequisites and run bounded synthetic Labs processing evidence on the already bootstrapped Hermes staging environment.
2. Run HealthKit/Health Connect native-build/physical-device evidence using mobile #682 on the current validation baseline.
3. Continue push configured-provider/device evidence through the canonical matrix.
4. Keep Stories evidence-only unless runtime reproduces a defect.
5. Do not manufacture Phase 15 or a broad refactor package without explicit reprioritization.

## Authorization / release boundary

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA are explicitly authorized. Actual execution still requires available credentials/signing material and devices.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence and rollback requirements.
