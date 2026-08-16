# Phase 14 — Active product workstreams

Updated: 2026-08-17

Status: **source/CI completion plus initial isolated Hermes staging evidence are complete for the explicitly opened native-health, native PDF import and Labs private-processing packages.** Remaining work is configured-provider and physical-device evidence rather than another broad source implementation pass.

Exact code, tests, migrations and Git history remain authoritative.

## Verified merged baseline

### Mobile

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

#682 merged read-only iOS HealthKit + Android Health Connect daily-step integration, native configuration/dependencies, Android `READ_STEPS`, npm-generated lockfile and native Labs PDF picking. It passed exact-head Mobile CI. #684 (`267c6cb75c05b015ac21062a536ce0b36112df1c`) subsequently stabilized reproducible typed-route validation.

### Backend

Latest runtime/operations merge: `e67e446c7819ae531da35f8a9a00c6c17eb50bad` (#256).

#254 merged the fail-closed Labs private-processing runtime. #255 added the isolated `smart-fitness-staging` topology. #256 made the bounded staging bootstrap permanent, strengthened env isolation and recorded real Hermes staging evidence. Exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI passed before merge.

## P14-A — Real push delivery

**Status: source/CI complete; configured-provider, physical-device, second-device/account and rollout evidence remain.**

Canonical checklist: `docs/qa/push-runtime-evidence-matrix.md`.

Remaining evidence:

1. configured APNs/FCM staging sends including success/transient/permanent/timeout/restart/redaction behavior;
2. physical-device permission/token/foreground/background/terminated-app/deep-link behavior;
3. second-device/account isolation and handoff evidence;
4. offline/reconnect ordering evidence;
5. production rollout only after reviewed staging evidence and rollback readiness.

## P14-B — Labs / Analyses

**Status: native import, private-processing source/CI and initial isolated-staging boot/health evidence complete. Configured-provider/device evidence remains.**

Merged source/runtime provides:

- native PDF/photo import through the shared private signed-upload path;
- Gemini extraction for PDF/JPEG/PNG/HEIC with strict structured-result validation;
- no diagnosis, treatment, missing-value inference or unit conversion in extraction;
- draft-only rows pending explicit confirmation;
- fail-closed private storage + extraction composition and privacy-safe readiness;
- bounded one-shot processing worker;
- isolated `smart-fitness-staging` topology and permanent `npm run staging:bootstrap` entrypoint.

Verified Hermes staging evidence:

- backend only on `127.0.0.1:3100`;
- staging PostgreSQL has no host port and retains dedicated staging state/networking;
- separate runner-owned `0600` staging environment;
- loopback `/health` succeeds;
- readiness is `enabled=false`, `storageReady=false`, `extractionReady=false`, `interpretationEnabled=false`, `ready=false`;
- no production Compose/credentials/user data and no Labs worker/scheduler were used.

Remaining evidence:

1. configure staging-only **HTTPS** S3-compatible private storage/namespace and credentials;
2. configure staging-only Gemini credentials/model;
3. require `labs:processing-readiness` to return `ready=true` before processing;
4. process one synthetic document with exactly one bounded worker pass;
5. record privacy-safe provider/output/redaction/error/lifecycle evidence;
6. collect native PDF/photo picker and accessibility evidence;
7. keep production provider activation/scheduling as a separate rollout decision.

The existing S3 transport is HTTPS-only. Do not weaken TLS validation or add plain internal MinIO merely to bypass the configured-storage evidence gate.

## P14-C — Stories

Source-complete; evidence/runtime only unless a defect is reproduced.

## P14-D — Steps / native health activity

**Status: native HealthKit/Health Connect source integration merged and exact-head Mobile CI green. Physical-device/native-build evidence remains.**

Merged #682 provides read-only HealthKit `StepCount`, read-only Health Connect `Steps`, Android `READ_STEPS`, platform runtime selection, DST-safe local-day semantics and no fake/workout-derived steps.

Important iOS privacy constraint: HealthKit does not provide an authoritative read-denied signal for a data type after the permission sheet; runtime must not invent one.

Remaining evidence:

1. create/install authorized native builds;
2. exercise user-initiated permission flows on supported devices;
3. verify real daily aggregate reads and unsupported/no-data states;
4. validate Home presentation against real data;
5. capture platform-specific evidence rather than inferring it from source tests.

## Completion interpretation

Phase 14 remains closed for ordinary autonomous source work. Runtime evidence can reopen only a bounded defect fix or reviewed contract change.

## Next execution order

1. configure Labs staging-only HTTPS private storage + Gemini prerequisites and run bounded synthetic processing evidence;
2. collect HealthKit/Health Connect physical-device evidence for #682;
3. collect push provider/device evidence through the existing matrix;
4. keep Stories evidence-only unless a defect is reproduced;
5. explicitly define the next ordinary product phase before beginning broad autonomous source work.

## Authorization / execution boundary

The native-health, Labs provider/staging, backend staging deployment/migration, APNs/FCM staging, native/EAS build and physical-device QA gates have been explicitly opened by the user. Evidence must still reflect only actions actually executed with available credentials, signing material and devices.

Production credentials, production scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence/rollback requirements.
