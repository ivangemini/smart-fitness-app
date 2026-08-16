# Smart Fitness Roadmap Progress

Updated: 2026-08-16

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Exact source, tests, migrations and Git history override stale prose.

## Verified phase baseline

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: source/CI-complete.
- Stories S10: source-complete; deployment/device/privacy evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition complete; native PDF source integration is merged; provider/deployment/device evidence remains gated.
- Phase 13 Companion v1: bounded baseline retained; richer progression/cosmetics deferred.
- Phase 14: source/CI completion checkpoint reached for the currently authorized contracts. Ordinary autonomous Phase 14 source work is closed except for the active backend #254 merge candidate and bounded reproduced-defect repair.

There is currently no separately approved Phase 15/general successor source package.

## Current verified checkpoint

### Mobile

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

Relevant merged work includes native Expo Notifications, push reconciliation/provenance hardening, and #682 read-only HealthKit/Health Connect Steps integration plus native PDF document picking for Labs.

#682 passed exact-head Mobile CI. This does not establish physical-device native-health or picker evidence.

### Backend

Latest merged runtime/source checkpoint remains #252 while #254 completes exact-head validation.

#254 is the fail-closed Labs processing-runtime package: private storage/model extraction composition, strict structured output, readiness/worker commands, production configuration templates and rollout/rollback documentation. It must not be marked merged until all required exact-head backend gates pass.

## What Phase 14 source now guarantees

### Push

Reviewed source covers authenticated registration authority, durable outbox delivery, APNs/FCM transports, fail-closed provider configuration, native token lifecycle, bounded freshness, privacy-minimized payloads, account handoff, atomic refresh-token CAS rotation and readiness/rollback tooling.

Remaining evidence is external: configured-provider sends, physical devices, second-account/device isolation, offline/reconnect ordering and authorized deployment/production scheduling.

### Labs / Analyses

Native PDF picking is merged in mobile #682. Backend #254 is the pending source candidate for private extraction runtime. After a green merge, remaining work is configured private storage/model evidence, authorized deployment/migrations, physical-device picker/accessibility evidence and separately reviewed model-tool exposure policy.

### Stories

Source-complete. Continue only runtime/deployment/device evidence through the canonical Stories evidence matrix and repair demonstrated defects.

### Steps

Read-only HealthKit/Health Connect source integration and explicit permission/disclosure wiring are merged in #682. Remaining work is physical-device support/permission/aggregate-read evidence and Home verification against real data. Local-day/DST-safe semantics remain part of the source contract.

## Current execution order

1. Complete #254 exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI.
2. Merge #254 only if all required gates are green and review surface is clean.
3. Replace pending backend references in canonical docs with the actual merge SHA and merge one documentation-only sync PR.
4. Keep Phase 14 ordinary source work closed unless runtime evidence reproduces a defect or an explicitly authorized provider/native/deployment package is opened.
5. Do not manufacture a Phase 15 or broad refactor package without explicit reprioritization.

## Closed activation and release gates

Without direct authorization, do not deploy backend changes or production migrations, activate/schedule production workers, configure or rotate APNs/FCM credentials, publish OTA/EAS updates, create/install native release builds, activate HealthKit/Health Connect on production/release devices, activate production Labs providers, access/mutate production user data or submit to app stores.
