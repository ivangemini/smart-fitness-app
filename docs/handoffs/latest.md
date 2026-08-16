# Latest Handoff

Updated: 2026-08-16

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

#682 closes the native-source gaps for Phase 14 Steps/Labs by adding read-only HealthKit/Health Connect adapters, explicit native health permission/disclosure wiring, `READ_STEPS`, Home integration against real aggregate data, and native PDF document picking. It passed exact-head Mobile CI before merge.

This is source/CI evidence only. Physical-device HealthKit/Health Connect and native picker behavior have not been claimed as verified.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest merged runtime/source checkpoint remains #252 while #254 completes exact-head validation.

#254 is the active Labs processing-runtime candidate. It adds private-storage/model extraction composition, a strict structured-result contract, fail-closed `LAB_PROCESSING_ENABLED` / provider configuration, privacy-safe readiness and bounded worker commands, production Compose/systemd templates and rollout/rollback documentation. It remains disabled by default and does not itself perform deployment, migration execution, provider activation or production data mutation.

## Phase 14 checkpoint

Phase 14 is closed for ordinary autonomous source implementation under the currently authorized contracts once backend #254 is either merged green or explicitly rejected. External runtime evidence remains distinct from source completion.

### Push

Source/CI remains complete for registration authority, durable outbox delivery, APNs/FCM transports, fail-closed configuration, freshness leases, native token lifecycle, privacy-minimized payloads, account handoff, atomic refresh rotation and rollout/readiness tooling.

Remaining evidence: configured provider sends, physical-device delivery/taps, second-device/account isolation, offline/reconnect ordering and authorized deployment/production scheduling.

### Labs

Native PDF picking is merged in mobile #682. Backend #254 is the pending source candidate for private extraction runtime. After merge, remaining work is configured provider/private-storage evidence, authorized deployment/migrations, physical-device picking/accessibility evidence and any separately reviewed model-tool exposure policy.

### Stories

Source-complete. Continue only runtime/deployment/device/privacy evidence and bounded reproduced-defect fixes.

### Steps

Read-only HealthKit/Health Connect source integration is merged in #682. Remaining work is physical-device evidence for support detection, denied/granted permissions, real aggregate reads, local-day/DST semantics and Home rendering. Native release activation/install remains separately gated.

### Companion

Phase 13 Companion v1 remains the bounded baseline. Richer progression/cosmetics remains deferred unless explicitly reprioritized.

## Next execution order

1. Require exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI for #254.
2. Merge #254 only if all required gates are green and the review surface is clean.
3. Replace the pending backend checkpoint in canonical docs with the actual merge SHA and merge one documentation-only synchronization PR.
4. Do not manufacture additional Phase 14 source work merely because external evidence is still pending.
5. Run configured-provider, physical-device, deployment or production actions only with direct authorization.

## Closed activation gates

Without direct authorization, do not deploy backend code or production migrations, schedule/activate production workers, configure/rotate APNs/FCM credentials, publish OTA/EAS, create/install native release builds, activate HealthKit/Health Connect on production/release devices, activate production Labs providers, access/mutate production data or submit to app stores.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, Social/Stories authority/privacy, Labs privacy/confirmation semantics, Coach auth/API contracts, active-program owner authority, backend revision/idempotency semantics or privacy/export boundaries as incidental follow-up.
