# Phase 14 — Active product workstreams

Updated: 2026-08-16

Status: **source/CI completion now includes the explicitly opened native-health, native PDF import and Labs private-processing runtime packages.** Remaining work is configured-environment, deployment and physical-device evidence rather than another broad source implementation pass.

Exact code, tests, migrations and Git history remain authoritative.

## Verified merged baseline

### Mobile

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

#682 merged read-only iOS HealthKit + Android Health Connect daily-step integration, native configuration/dependencies, Android `READ_STEPS`, npm-generated lockfile and native Labs PDF picking. It passed exact-head Mobile CI.

### Backend

Latest runtime/source merge: `c88410455fa9428724910bfc66da5846f7c4070a` (#254).

#254 merged the fail-closed Labs private-processing runtime: Gemini extraction, private storage composition, privacy-safe readiness, bounded one-shot worker and rollout/rollback deployment templates. It passed exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI.

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

**Status: native import and private-processing source/CI complete. Environment/provider/device evidence remains.**

Merged source provides:

- native PDF/photo import through the shared private signed-upload path;
- Gemini extraction for PDF/JPEG/PNG/HEIC;
- strict structured-result validation;
- no diagnosis, treatment, missing-value inference or unit conversion in extraction;
- draft-only rows pending explicit confirmation;
- fail-closed `LAB_PROCESSING_ENABLED` and provider configuration;
- private storage + extraction composition;
- privacy-safe readiness;
- bounded one-shot processing worker;
- Compose/systemd/Docker rollout plumbing and rollback guidance.

Remaining evidence:

1. configure authorized non-production private storage and model credentials;
2. deploy backend/migrations in staging;
3. prove readiness without credential leakage;
4. process controlled documents and record provider/output/redaction/error behavior;
5. collect native PDF/photo picker and accessibility evidence;
6. keep extracted rows confirmation-gated;
7. treat production provider activation/scheduling as a separate rollout decision.

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

Phase 14 remains closed for ordinary autonomous source work after #682/#254. Runtime evidence can reopen only a bounded defect fix or reviewed contract change.

## Next execution order

1. collect Labs staging deployment/storage/model evidence using #254;
2. collect HealthKit/Health Connect physical-device evidence for #682;
3. collect push provider/device evidence through the existing matrix;
4. keep Stories evidence-only unless a defect is reproduced;
5. explicitly define the next ordinary product phase before beginning broad autonomous source work.

## Authorization / execution boundary

The native-health, Labs provider/staging, backend staging deployment/migration, APNs/FCM staging, native/EAS build and physical-device QA gates have been explicitly opened by the user. Evidence must still reflect only actions actually executed with available access, secrets, signing material and devices.

Production credentials, production scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence/rollback requirements.
