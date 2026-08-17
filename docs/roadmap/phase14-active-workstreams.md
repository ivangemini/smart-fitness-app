# Phase 14 — Active product workstreams

Updated: 2026-08-17

Status: **ordinary autonomous source/runtime-preparation work is exhausted for the explicitly opened Phase 14 contracts.** Remaining work depends on staging-only provider material, signed native/physical-device evidence, deliberate rollout, or a reproduced defect.

Exact code, tests, migrations and Git history remain authoritative.

## Verified merged baseline

### Mobile

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

#682 merged read-only iOS HealthKit + Android Health Connect daily-step integration, native configuration/dependencies, Android `READ_STEPS`, npm-generated lockfile and native Labs PDF picking. It passed exact-head Mobile CI. #684 (`267c6cb75c05b015ac21062a536ce0b36112df1c`) subsequently stabilized reproducible typed-route validation.

### Backend

Latest runtime/operations merge: `bd98b1184e0153b3c7b9dfda7a47f3365b6e208f` (#261). Latest Phase 14 evidence/docs checkpoint: `8638604fb98a1ee84a0a225087a7e64ffd8f2c4e` (#263).

#254 merged fail-closed Labs private processing. #255 added the isolated `smart-fitness-staging` topology. #256 made the bounded staging bootstrap permanent. #257 added the bounded configured-Labs evidence gate. #261 added the permanent bounded Stories evidence command. Exact-head CI passed for the applicable runtime PRs.

## P14-A — Real push delivery

**Status: source/CI complete; configured-provider, physical-device, second-device/account and rollout evidence remain.**

Canonical checklist: `docs/qa/push-runtime-evidence-matrix.md`.

Hermes prerequisite probe #260 retained:

```text
env_file=true apns_fields=false fcm_fields=false provider_flags=false master_enabled=false
```

This confirms the staging env exists but neither complete APNs nor complete FCM material is configured; provider flags and master delivery remain disabled. No provider call or push worker invocation occurred.

Remaining evidence:

1. supply staging-only APNs and/or FCM material and pass privacy-safe readiness with master delivery still disabled;
2. configured staging sends including success/transient/permanent/timeout/restart/redaction behavior;
3. physical-device permission/token/foreground/background/terminated-app/deep-link behavior;
4. second-device/account isolation and handoff evidence;
5. offline/reconnect ordering evidence;
6. production rollout only after reviewed staging evidence and rollback readiness.

No additional autonomous push source package is currently identified to cross this boundary.

## P14-B — Labs / Analyses

**Status: native import, private-processing source/CI, isolated-staging boot/health and bounded evidence tooling are complete. Configured-provider/device evidence remains.**

Merged source/runtime provides:

- native PDF/photo import through the shared private signed-upload path;
- Gemini extraction for PDF/JPEG/PNG/HEIC with strict structured-result validation;
- no diagnosis, treatment, missing-value inference or unit conversion in extraction;
- draft-only rows pending explicit confirmation;
- fail-closed private storage + extraction composition and privacy-safe readiness;
- bounded one-shot processing worker;
- isolated `smart-fitness-staging` topology, permanent `npm run staging:bootstrap`, and permanent `npm run staging:labs-evidence` entrypoints.

Hermes prerequisite probe #258 retained:

```text
env_file=true provider_fields=false activation_flags=false
```

Verified staging remains loopback-only with separate PostgreSQL state/networking, runner-owned `0600` environment and fail-closed readiness. The missing boundary is external staging-only storage/Gemini configuration, not source plumbing.

Remaining evidence:

1. configure staging-only **HTTPS** S3-compatible private storage/namespace and credentials;
2. configure staging-only Gemini credentials/model;
3. require `labs:processing-readiness` to return exact `ready=true` while interpretation remains disabled;
4. process one synthetic document with exactly one bounded worker pass;
5. record privacy-safe provider/output/redaction/error/lifecycle evidence;
6. collect native PDF/photo picker and accessibility evidence;
7. keep production provider activation/scheduling as a separate rollout decision.

The existing S3 transport is HTTPS-only. Do not weaken TLS validation or add plain internal MinIO merely to bypass the configured-storage evidence gate.

## P14-C — Stories

**Status: source/CI plus isolated backend staging route/auth/account-lifecycle evidence complete; remaining mobile/device/runtime evidence only unless a defect is reproduced.**

Backend #261 merged `npm run staging:stories-evidence`. Temporary evidence-only #262 ran it on `hermes-backend-ci-01` and closed without merge with:

```text
registered=true profileReady=true authenticatedListReady=true freshAccountIsolated=true unauthenticatedFailClosed=true accountDeleted=true deletedSessionRejected=true ready=true
```

The bounded pass used one synthetic account, observed an empty authenticated Stories list, required unauthenticated access to fail closed, deleted the account and verified the deleted session was rejected. No media/provider call, scheduler, persistent fixture or production surface was used.

Remaining evidence is limited to mobile/physical-device behavior or other runtime paths not exercised by that server probe. Source work reopens only for a concrete reproduced defect or reviewed contract change.

## P14-D — Steps / native health activity

**Status: native HealthKit/Health Connect source integration merged and exact-head Mobile CI green. Physical-device/native-build evidence remains.**

Merged #682 provides read-only HealthKit `StepCount`, read-only Health Connect `Steps`, Android `READ_STEPS`, platform runtime selection, DST-safe local-day semantics and no fake/workout-derived steps.

Important iOS privacy constraint: HealthKit does not provide an authoritative read-denied signal for a data type after the permission sheet; runtime must not invent one.

Remaining evidence:

1. create/install authorized signed native builds;
2. exercise user-initiated permission flows on supported devices;
3. verify real daily aggregate reads and unsupported/no-data states;
4. validate Home presentation against real data;
5. capture platform-specific evidence rather than inferring it from source tests.

No additional autonomous Steps source package is currently identified without real-device evidence.

## Completion interpretation

Phase 14 is closed for ordinary autonomous source work. The remaining gates are external/provider/native/device/deliberate-rollout gates. Runtime evidence may reopen only a bounded defect fix or reviewed contract change.

This is **not** a claim that configured-provider or physical-device Phase 14 evidence is complete.

## Next execution order

1. execute Labs configured-provider evidence when staging-only HTTPS storage + Gemini material becomes available;
2. execute push configured-provider/device evidence when staging-only APNs/FCM material becomes available;
3. execute HealthKit/Health Connect, Push, Labs and remaining Stories device evidence when signed builds/devices are available;
4. otherwise do not invent further Phase 14 implementation work;
5. after Phase 14 is fully completed under the canonical implementation plan, begin the explicitly prioritized repository-wide Liquid Glass convergence audit before unrelated Phase 15 expansion.

## Authorization / execution boundary

The native-health, Labs provider/staging, backend staging deployment/migration, APNs/FCM staging, native/EAS build and physical-device QA gates have been explicitly opened by the user. Evidence must still reflect only actions actually executed with available credentials, signing material and devices.

Production credentials, production scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence/rollback requirements.
