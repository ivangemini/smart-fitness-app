# Latest Handoff

Updated: 2026-08-17

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682). #682 merged read-only HealthKit/Health Connect adapters, native health permission/disclosure wiring, Android `READ_STEPS`, Home integration against real aggregate data and native PDF document picking. #684 (`267c6cb75c05b015ac21062a536ce0b36112df1c`) made Expo typed-route validation reproducible on persistent Hermes checkouts. Applicable exact-head Mobile CI passed.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/operations merge: `e67e446c7819ae531da35f8a9a00c6c17eb50bad` (#256).

#254 merged fail-closed Labs private processing. #255 merged the isolated Hermes staging topology. #256 retained a permanent bounded `npm run staging:bootstrap` command, strengthened staging-env isolation and recorded real Hermes staging evidence. Exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI were green before #256 merge.

## Hermes staging evidence

A bounded run on `hermes-backend-ci-01` successfully bootstrapped and revalidated the isolated staging project:

- project `smart-fitness-staging`;
- backend `127.0.0.1:3100` only;
- staging PostgreSQL with no host port;
- dedicated staging state/networking and provider egress;
- external runner-owned `0600` staging env;
- loopback `/health` succeeds;
- Labs readiness is fail-closed: `enabled=false`, `storageReady=false`, `extractionReady=false`, `interpretationEnabled=false`, `ready=false`;
- no Labs worker/scheduler enabled;
- no production Compose, credentials or user data used.

The temporary evidence-only workflow hook was removed before merge. Permanent bootstrap guards reject `.env.production`, relative env paths and repository-local env targets.

## Phase 14 checkpoint

Phase 14 remains closed for broad autonomous source implementation under the currently authorized contracts. Runtime evidence may drive only bounded fixes or explicitly reviewed contract changes.

### Push

Source/CI complete. Remaining evidence: configured provider sends, physical-device delivery/taps, second-device/account isolation, offline/reconnect ordering and authorized rollout/scheduling.

### Labs

Initial isolated-staging boot/health is now verified. Remaining work is staging-only **HTTPS** S3-compatible private storage, staging-only Gemini configuration, `ready=true` readiness, one synthetic upload/one bounded worker pass, provider/error/redaction/lifecycle evidence and physical-device picker/accessibility evidence.

Do not weaken the HTTPS-only S3 transport merely to simplify staging. Plain internal MinIO is not an acceptable shortcut under the current security contract.

### Stories

Source-complete. Continue only runtime/deployment/device/privacy evidence and bounded reproduced-defect fixes.

### Steps

Read-only HealthKit/Health Connect source integration is merged in #682. Remaining work is physical-device evidence for support detection, permission flow, real aggregate reads, local-day/DST semantics and Home rendering.

### Companion

Phase 13 Companion v1 remains the bounded baseline. Richer progression/cosmetics remains deferred unless explicitly reprioritized.

## Next execution order

1. Configure staging-only HTTPS S3-compatible storage and Gemini prerequisites, then require Labs readiness `ready=true`.
2. Upload one synthetic Labs fixture and run exactly one processing-worker pass; capture privacy-safe success/error/redaction/lifecycle evidence before any scheduler is enabled.
3. Run native-build/physical-device HealthKit/Health Connect evidence using #682.
4. Continue configured-provider/device push evidence using the canonical matrix.
5. Keep Stories evidence-only unless a concrete defect is reproduced.
6. Define the next ordinary product phase explicitly before broad autonomous source work.

## Authorization / execution boundary

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA are explicitly authorized. Actual execution still depends on available credentials/signing material and physical devices.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with their own evidence and rollback controls.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, Social/Stories authority/privacy, Labs privacy/confirmation semantics, Coach auth/API contracts, active-program owner authority, backend revision/idempotency semantics or privacy/export boundaries as incidental follow-up.
