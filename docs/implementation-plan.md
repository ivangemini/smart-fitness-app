# Smart Fitness — Implementation Plan

Updated: 2026-08-17

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase for replacing the current single AsyncStorage AppState persistence strategy; reopen that decision only with new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge remains `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682). #682 closes the native-source gaps for Phase 14 Steps/Labs with read-only HealthKit/Health Connect adapters, native health permission/disclosure plumbing, Android `READ_STEPS`, Home integration against real aggregate data and native PDF document picking. #684 (`267c6cb75c05b015ac21062a536ce0b36112df1c`) stabilized reproducible Expo typed-route validation. Applicable exact-head Mobile CI passed.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/operations merge: `bd98b1184e0153b3c7b9dfda7a47f3365b6e208f` (#261). Latest Phase 14 evidence/docs checkpoint: `8638604fb98a1ee84a0a225087a7e64ffd8f2c4e` (#263).

#254 merged fail-closed Labs private processing. #255 added isolated Hermes staging. #256 made bounded staging bootstrap permanent. #257 added `staging:labs-evidence`. #261 added permanent bounded `staging:stories-evidence`.

## Verified Hermes staging evidence

The isolated `smart-fitness-staging` project has been booted and revalidated on `hermes-backend-ci-01` with:

- backend ingress only on `127.0.0.1:3100`;
- PostgreSQL with no host port and dedicated staging state/networking;
- external runner-owned `0600` staging environment;
- successful loopback `/health`;
- Labs still fail-closed before provider configuration: `enabled=false storageReady=false extractionReady=false interpretationEnabled=false ready=false`;
- no production Compose, production credentials or production user data used.

External prerequisite probes establish the exact current provider boundary.

Labs #258:

```text
env_file=true provider_fields=false activation_flags=false
```

Push #260:

```text
env_file=true apns_fields=false fcm_fields=false provider_flags=false master_enabled=false
```

After backend #261 merged the permanent Stories evidence command, evidence-only #262 ran on isolated Hermes staging and closed without merge with:

```text
registered=true profileReady=true authenticatedListReady=true freshAccountIsolated=true unauthenticatedFailClosed=true accountDeleted=true deletedSessionRejected=true ready=true
```

The Stories pass used one synthetic account, verified an empty authenticated Stories list and unauthenticated fail-closed behavior, deleted the account and verified its session was rejected. No media/provider call, scheduler, persistent fixture or production surface was used.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11: source/CI-complete for authorized Liquid Glass + Home convergence.
- Stories S10: source/CI plus basic isolated backend staging route/auth/account-lifecycle evidence complete; remaining mobile/device/runtime evidence is external to that server probe.
- Phase 12 Labs + Settings: provider-neutral source composition, native PDF import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained; richer progression/cosmetics deferred.
- Phase 14: ordinary autonomous source/runtime-preparation work is exhausted for currently authorized contracts. Remaining work is external provider material, signed native/physical-device evidence, deliberate rollout or bounded repair of a reproduced defect.

This is not a claim that configured-provider or physical-device Phase 14 evidence is complete.

## P14-A — Push

Source/CI complete. Staging provider material is currently absent per #260, and provider/master flags remain disabled.

Remaining work:

1. configure staging-only APNs and/or FCM provider material;
2. keep `PUSH_DELIVERY_ENABLED=false` through privacy-safe readiness preflight;
3. run bounded staging sends for success/transient/permanent/timeout/restart/redaction behavior;
4. collect physical-device permission/token/delivery/tap/deep-link evidence;
5. verify second-device/account isolation and offline/reconnect ordering;
6. treat production scheduling/rollout as a separate deliberate action with rollback evidence.

No additional autonomous Push source package is currently identified without external provider/device evidence.

## P14-B — Labs / Analyses

Source/CI, isolated staging and the bounded configured-provider evidence gate are complete. The exact current blocker is external staging-only provider configuration, not missing source plumbing.

Current prerequisite result:

```text
env_file=true provider_fields=false activation_flags=false
```

Remaining work:

1. configure a **staging-only HTTPS S3-compatible** private-storage bucket/namespace and credentials;
2. configure a staging-only Gemini credential/model;
3. enable Labs only in staging and require `labs:processing-readiness` to return exact `ready=true` while interpretation remains disabled;
4. upload one synthetic document through the normal staging flow;
5. run exactly one bounded `staging:labs-evidence` worker pass;
6. capture privacy-safe success/error/redaction/lifecycle evidence before any periodic scheduler;
7. collect physical-device PDF/photo picker and accessibility evidence.

Draft extraction remains confirmation-gated and must not infer diagnosis, treatment or missing values.

A plain internal MinIO shortcut is intentionally not part of the current plan: the backend S3-compatible transport requires HTTPS with normal TLS trust, and the security contract must not be weakened merely to simplify staging.

## P14-C — Stories

Source/CI plus the basic isolated backend staging route/auth/account-lifecycle boundary are complete. #262 proved registration, Social profile setup, authenticated empty Stories listing, fresh-account isolation, unauthenticated fail-closed behavior, account cleanup and post-delete session rejection.

Remaining work is mobile/physical-device/runtime evidence outside this server probe. Continue source work only for a concrete reproduced defect or newly reviewed contract.

## P14-D — Steps

Source/CI includes reviewed read-only HealthKit and Health Connect adapters plus permission/disclosure wiring. Remaining work is signed native-build/physical-device evidence for support detection, user-initiated permissions, real aggregate reads, unsupported/no-data states, local-day/DST behavior and Home presentation.

No additional autonomous Steps source package is currently identified without physical-device evidence.

## Autonomous Phase 14 boundary

At the current checkpoint there is no ordinary autonomous Phase 14 implementation package left that can honestly close one of the remaining gates. The unresolved gates require at least one of:

- staging-only storage/model credentials;
- staging-only APNs/FCM credentials/configuration;
- signing material/native build execution;
- a physical device;
- a deliberate rollout decision;
- a concrete reproduced defect.

Do not manufacture source refactors, fake provider evidence or inferred device evidence merely to make Phase 14 appear complete.

## Priority UI convergence — complete Liquid Glass coverage

Immediately after the currently active Phase 14 work is fully completed, perform a repository-wide screen and navigation audit for Liquid Glass consistency and treat every uncovered or partially migrated user-facing surface as the next highest-priority implementation work.

Required scope:

1. inventory every reachable tab, primary screen, secondary screen, modal, sheet, picker, empty/error/loading state and persistent navigation/action surface;
2. classify each surface as fully converged, partially converged or legacy/non-Liquid-Glass using the established shared material/navigation primitives rather than visual guesswork alone;
3. migrate every partial or legacy surface to the same established Liquid Glass design language, including hierarchy, materials, typography, spacing, controls, navigation, safe-area behavior and interaction states;
4. remove obsolete one-off styling/material implementations when a reviewed shared primitive already exists, without changing unrelated business logic or persistence contracts;
5. validate small-screen/responsive layout, Dynamic Island/notch/Home Indicator safe areas, scrolling, keyboard interaction, accessibility/reduced-transparency behavior and dark appearance across the migrated surfaces;
6. add or update regression/source-contract coverage so newly converged screens cannot silently fall back to legacy styling;
7. update the roadmap with the exact audited inventory and close this priority only when no reachable in-scope user-facing screen remains partially migrated or visually inconsistent with the established Liquid Glass system.

This is an explicit prioritization and therefore supersedes the previous restriction against inventing a new broad post-Phase-14 package. Do not begin unrelated Phase 15 feature expansion before this convergence audit and remediation are complete.

## Current execution order

1. Keep Phase 14 provider/device gates ready but do not invent source work while required external material/devices are absent.
2. As soon as staging-only HTTPS storage + Gemini material becomes available, run bounded Labs configured-provider evidence.
3. As soon as staging-only APNs/FCM material becomes available, run push readiness/provider evidence.
4. As soon as signed builds/physical devices are available, collect Steps, Push, Labs and remaining Stories native/mobile evidence.
5. Only after Phase 14 is fully completed, start the full Liquid Glass coverage audit/remediation as the highest-priority broad implementation work.
6. Do not begin unrelated Phase 15 feature expansion before the Liquid Glass convergence priority is complete.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend source/operations PRs require applicable exact-head Backend CI and PostgreSQL CI, plus account-deletion validation when schema/privacy/account-lifecycle surfaces change.

Documentation-only synchronization must not claim configured-provider, physical-device or production evidence that did not run.

## Activation boundary

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA are explicitly authorized. Execution still requires actual access, credentials/signing material and devices.

Production credential rotation, production scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence and rollback requirements.
