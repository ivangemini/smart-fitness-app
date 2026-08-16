# Smart Fitness Current Status

Updated: 2026-08-17

Exact code, tests, migrations and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682). Latest validation hardening merge: `267c6cb75c05b015ac21062a536ce0b36112df1c` (#684). Latest docs checkpoint before this update: `8b483a200cb1eeb2c6a1173cfa2dcc6ac58f2722` (#685).

Recent Phase 14 source includes authenticated native push foundations, generic Labs PDF/JPEG/PNG/HEIC signed-upload support, read-only iOS HealthKit and Android Health Connect daily-step adapters, Android `READ_STEPS`, native dependencies/lockfile and native PDF document picking. Applicable exact-head Mobile CI passed.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/operations merge: `e67e446c7819ae531da35f8a9a00c6c17eb50bad` (#256).

Relevant sequence:

- #254 — fail-closed Labs private-processing runtime, Gemini extraction, private-storage composition, readiness, bounded worker and rollout/rollback plumbing;
- #255 — isolated Hermes staging topology with dedicated PostgreSQL state/networking, loopback-only backend ingress and separate provider egress;
- #256 — permanent bounded `staging:bootstrap` entrypoint plus real Hermes staging evidence and stronger production/repository-env isolation guards.

#256 merged only after exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI were green.

## Hermes staging evidence

The isolated staging environment has now actually booted on the authoritative Hermes runner:

- Compose project: `smart-fitness-staging`;
- backend ingress: `127.0.0.1:3100 -> 3000/tcp` only;
- staging PostgreSQL: no host port;
- dedicated staging volume/private network and separate backend egress retained;
- staging environment stored outside the repository with mode `0600`;
- loopback `/health` succeeded;
- Labs readiness verified as `enabled=false`, `storageReady=false`, `extractionReady=false`, `interpretationEnabled=false`, `ready=false`;
- no Labs worker/scheduler was enabled;
- production Compose, production credentials and production user data were not used.

The temporary evidence-only workflow hook was removed before #256 merge. The permanent `npm run staging:bootstrap` command preserves the bounded fail-closed checks.

## Phase 14 status

**Phase 14 source/CI plus initial isolated-staging bootstrap evidence are complete for the authorized Labs/Steps packages.** Configured external providers and physical devices remain separate evidence gates.

### P14-A — Push

Source/CI complete. Remaining evidence: configured APNs/FCM staging sends, provider failure/retry/timeout/restart behavior, physical-device notification behavior, second-device/account isolation, offline/reconnect ordering and deliberate rollout/scheduling evidence.

### P14-B — Labs / Analyses

Native PDF/photo import, fail-closed private processing and isolated Hermes staging are operationally prepared. Initial staging boot/health is no longer a blocker.

Remaining evidence:

- staging-only **HTTPS** S3-compatible private storage and credentials;
- staging-only Gemini credential/model;
- readiness `ready=true` after both prerequisites are configured;
- one synthetic upload + exactly one bounded processing pass;
- privacy-safe provider/output/error/redaction/lifecycle evidence;
- physical-device PDF/photo picker and accessibility evidence;
- production provider activation/scheduling only as a separate rollout decision.

Extracted rows remain drafts until explicit user confirmation; source does not diagnose, prescribe, infer missing values or convert units.

### P14-C — Stories

Stories S10 remains source-complete. Continue only deployment/device/privacy evidence through `docs/qa/stories-s10-runtime-matrix.md` plus bounded fixes for reproduced defects.

### P14-D — Steps

Native HealthKit/Health Connect source/CI is complete. Remaining evidence is native-build/physical-device behavior: user permission flow, unsupported/no-data states, real aggregate reads, local-day/DST behavior and Home presentation.

## Current remaining roadmap

1. Configure staging-only HTTPS private storage + Gemini prerequisites and run the bounded synthetic Labs evidence on the already bootstrapped Hermes staging project.
2. Collect HealthKit/Health Connect physical-device/native-build evidence for #682.
3. Use `docs/qa/push-runtime-evidence-matrix.md` for remaining push provider/device evidence.
4. Keep Stories evidence-only unless a runtime defect is reproduced.
5. Define the next ordinary autonomous product phase explicitly instead of manufacturing additional Phase 14 refactors.

## Activation boundaries

The user has explicitly authorized HealthKit/Health Connect, Labs provider/staging runtime work, backend staging deployment/migrations, APNs/FCM staging work, native/EAS builds and physical-device QA. Execution still requires the relevant credentials/signing material and/or physical device.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with their own evidence and rollback controls.
