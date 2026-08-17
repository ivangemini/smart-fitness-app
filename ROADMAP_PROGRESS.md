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
- Stories S10: source/CI plus isolated backend staging route/auth/account-lifecycle evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native PDF import, private-processing runtime and isolated Hermes staging bootstrap/evidence are complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: bounded baseline retained; richer progression/cosmetics deferred.
- Phase 14: ordinary autonomous source/runtime-preparation work is exhausted for the currently authorized contracts. Remaining work is external provider material, native/physical-device evidence, deliberate rollout, or bounded repair of a reproduced defect.

There is currently no separately approved Phase 15/general successor source package.

## Current verified checkpoint

### Mobile

Latest runtime/source merge remains `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682); #684 (`267c6cb75c05b015ac21062a536ce0b36112df1c`) stabilized persistent-checkout typed-route validation. Applicable exact-head Mobile CI passed. Later documentation checkpoints preserve the reviewed local-state and Phase 14 contracts.

### Backend

Latest runtime/operations merge: `bd98b1184e0153b3c7b9dfda7a47f3365b6e208f` (#261). Latest Phase 14 evidence/docs checkpoint: `8638604fb98a1ee84a0a225087a7e64ffd8f2c4e` (#263).

#257 merged the bounded Labs staging evidence gate. #261 merged the permanent bounded Stories staging evidence command. Evidence-only #262 then executed that command on `hermes-backend-ci-01` against the isolated loopback staging backend and closed without merge.

## What Phase 14 now proves

### Push

Reviewed source covers authenticated registration authority, durable outbox delivery, APNs/FCM transports, fail-closed provider configuration, native token lifecycle, bounded freshness, privacy-minimized payloads, account handoff, atomic refresh-token CAS rotation and readiness/rollback tooling.

Hermes prerequisite probe #260 retained:

```text
env_file=true apns_fields=false fcm_fields=false provider_flags=false master_enabled=false
```

Configured-provider sends cannot proceed until staging-only APNs and/or FCM material is supplied. Physical-device delivery/taps, second-account/device isolation, offline/reconnect ordering and deliberate rollout evidence also remain.

### Labs / Analyses

Native PDF picking is merged in mobile #682 and private extraction runtime in backend #254. Isolated Hermes staging boots separately from production with loopback-only backend ingress, a private staging database, dedicated staging state, external runner-owned secrets, successful `/health` and fail-closed Labs readiness.

Hermes prerequisite probe #258 retained:

```text
env_file=true provider_fields=false activation_flags=false
```

Remaining work is:

- staging-only **HTTPS** S3-compatible private storage/namespace and credentials;
- staging-only Gemini credential/model;
- readiness `ready=true` after configuration while interpretation remains disabled;
- one synthetic upload and exactly one bounded worker pass;
- privacy-safe provider/output/error/redaction/lifecycle evidence;
- physical-device picker/accessibility evidence.

The current S3-compatible transport intentionally rejects non-HTTPS endpoints. Do not weaken that security boundary or substitute plain internal MinIO merely to bypass the configured-storage gate.

### Stories

Backend #261 provides the permanent bounded evidence command. Evidence-only #262 revalidated isolated staging and returned:

```text
registered=true profileReady=true authenticatedListReady=true freshAccountIsolated=true unauthenticatedFailClosed=true accountDeleted=true deletedSessionRejected=true ready=true
```

This closes the basic backend staging route/auth/account-lifecycle boundary: one synthetic account was created, an empty authenticated Stories list was verified, unauthenticated access failed closed, the account was deleted and the deleted session was rejected. No media/provider call, scheduler, persistent fixture or production surface was used.

Remaining Stories work is mobile/device/runtime evidence outside that bounded server probe and bounded fixes only if a concrete defect is reproduced.

### Steps

Read-only HealthKit/Health Connect source integration and permission/disclosure wiring are merged in #682. Remaining work is physical-device support/permission/aggregate-read evidence and Home verification against real data. Local-day/DST-safe semantics remain part of the source contract.

## Current execution order

1. When staging-only HTTPS private storage + Gemini material becomes available, run bounded synthetic Labs configured-provider evidence.
2. When staging-only APNs/FCM material becomes available, run push readiness and bounded provider/device evidence.
3. When a suitable signed native build/physical device is available, collect HealthKit/Health Connect, Push and Labs native evidence plus remaining mobile Stories evidence.
4. Until one of those external gates becomes actionable, do not manufacture another Phase 14 source refactor; only repair reproduced defects or implement newly reviewed contracts.
5. The repository-wide Liquid Glass convergence audit remains the next explicitly prioritized broad product work after Phase 14 is considered fully complete under the canonical implementation plan.

## Authorization / release boundary

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA are explicitly authorized. Actual execution still requires available credentials/signing material and devices.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence and rollback requirements.
