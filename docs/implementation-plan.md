# Smart Fitness — Implementation Plan

Updated: 2026-08-18

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase for replacing the current single AsyncStorage AppState persistence strategy; reopen that decision only with new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `b7b9d7e1dd8a5ef2eab88f110270f9bae888a1ef` (#737).

The current baseline includes the earlier product/runtime work plus the August 18 convergence checkpoints:

- #733 — autonomous repository operating rules in `AGENTS.md`: throughput-first, parallel-first execution, coherent batches, CI/review waits do not stop independent workstreams, and ordinary repo inspect/edit/test/PR/merge actions do not require repeated confirmation;
- #735 — canonical current-status and handoff synchronization;
- #736 — mutation-failure/recovery notice Liquid Glass convergence;
- #737 — remaining active workout-session material convergence across navigator, headers/progress, set controls, modals and finish notes.

Evidence-only #734 refreshed the repository-wide direct legacy-material inventory and was intentionally closed without merge after its diagnostic output was extracted.

Active post-#737 source packages are:

- #738 — Coach semantic/status glass materials, rebuilt exactly on current `main`;
- #739 — workout-builder residual glass materials, rebuilt exactly on current `main`;
- #740 — shared navigation shell and `ListRow` residual glass materials;
- #741 — Coach history filter/nested-surface convergence, rebuilt on current `main` after correcting a stale source-contract expectation;
- #742 — Social warning/native-control residual glass materials, rebuilt on current `main` after correcting a stale source-contract expectation;
- #743 — workout-finish integration-switch glass materials while intentionally preserving sticky-footer divider semantics.

These open packages are not considered merged evidence until their exact-head Mobile CI succeeds and normal merge/review gates are satisfied.

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
- Phase 11: source/CI-complete for authorized Liquid Glass + Home convergence; repository-wide presentation convergence is being closed as the active priority below rather than reopened as a new feature phase.
- Stories S10: source/CI plus basic isolated backend staging route/auth/account-lifecycle evidence complete; remaining mobile/device/runtime evidence is external to that server probe.
- Phase 12 Labs + Settings: provider-neutral source composition, native PDF import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained; richer progression/cosmetics deferred.
- Phase 14: ordinary autonomous provider/runtime-preparation source work is exhausted for currently authorized contracts. Remaining work is external provider material, signed native/physical-device evidence, deliberate rollout, or bounded repair of a reproduced defect.
- Priority Liquid Glass convergence: active autonomous workstream while the external Phase 14 gates remain unavailable. The broad foundation/primary/secondary waves are merged; work is now on source-demonstrated residual material owners and inventory closure.

This is not a claim that configured-provider or physical-device Phase 14 evidence is complete, nor that repository-wide Liquid Glass coverage is complete before the active residual packages merge and a refreshed inventory confirms no unresolved partial/legacy owner.

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

At the current checkpoint there is no ordinary autonomous Phase 14 implementation package left that can honestly close one of the remaining external gates. The unresolved gates require at least one of:

- staging-only storage/model credentials;
- staging-only APNs/FCM credentials/configuration;
- signing material/native build execution;
- a physical device;
- a deliberate rollout decision;
- a concrete reproduced defect.

Do not manufacture source refactors, fake provider evidence or inferred device evidence merely to make Phase 14 appear complete.

## Priority UI convergence — complete Liquid Glass coverage

Because ordinary autonomous Phase 14 source work is exhausted while its remaining gates depend on external material/devices, repository-wide Liquid Glass audit/remediation remains the active highest-priority autonomous workstream. It proceeds without claiming that the external Phase 14 evidence is complete.

### Completed convergence layers

The merged and validated waves now cover the shared foundation and the major Home, Settings, Progress, Companion, Labs, Social, Auth/account, Notifications, Nutrition and Workouts primary/secondary surfaces. #736 and #737 additionally closed the mutation-failure notice and active workout-session material clusters.

### Current residual batches

1. #738 — Coach semantic/status badges, choice controls and result boundaries;
2. #739 — workout-builder picker/forms/exercise-row residual materials;
3. #740 — Expo Router shared shell plus shared `ListRow` badge materials;
4. #741 — Coach history filter controls and true nested card surfaces while preserving intentional hairline dividers;
5. #742 — Social semantic-warning surface and Story native switch materials;
6. #743 — workout-finish integration native switch materials while preserving sticky-footer divider semantics.

### Residual classification rule

Do not mechanically replace every legacy-looking token. Each hit from the inventory must be classified by ownership and semantics:

- interactive controls, cards, selected/pressed/disabled states and semantic notices should use the established active Liquid Glass palette/primitives;
- intentional structural hairline dividers may remain divider/theme tokens when they are not material surfaces;
- native controls should use active palette values without changing their behavioral contracts;
- a migration must preserve safe-area, keyboard, accessibility, lifecycle, persistence and API behavior unless the roadmap explicitly scopes a behavioral change.

Examples already classified as intentional divider semantics include diagnostic/privacy internal row separators, sync-conflict version separators, Coach provenance/history section dividers, sticky footer top borders, workout-history draft-row separators and builder/header separators.

### Closure criteria

Close this priority only when all of the following are true:

1. every active residual package has exact-head validation and is merged or explicitly rejected with documented rationale;
2. a refreshed repository-wide source inventory is run from the resulting `main` rather than from an older rollup baseline;
3. every remaining hit is either migrated or explicitly classified as an intentional divider/native/system semantic rather than an unresolved material owner;
4. no reachable in-scope screen, modal, sheet, picker, empty/error/loading state or persistent action/navigation surface remains demonstrably partial/legacy;
5. focused source/regression contracts protect the migrated owners and any intentional semantic distinctions;
6. responsive/safe-area/keyboard/accessibility contracts remain green.

Do not begin unrelated Phase 15 feature expansion before this convergence audit and remediation are complete.

## Current execution order

1. Keep multiple independent residual UI workstreams moving in parallel; do not serialize source work behind a single self-hosted CI run.
2. Merge #738–#743 individually as each exact-head Mobile CI run becomes green and review/mergeability gates are satisfied; repair real failures immediately and rebuild stale-base branches on the then-current `main` when needed.
3. After the residual merges, run a fresh repository-wide legacy-material inventory from the new `main` and classify the remainder by actual material ownership rather than token name alone.
4. Remediate any newly demonstrated real residual owners in coherent batches; do not create cosmetic one-line PRs for intentional dividers.
5. Synchronize `docs/current-status.md`, `docs/handoffs/latest.md` and this roadmap again when the convergence priority reaches its new merged checkpoint.
6. Execute Phase 14 provider/device gates as soon as the required external staging material, signing or physical-device access exists.
7. Do not begin unrelated Phase 15 feature expansion before the Liquid Glass convergence priority is complete.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

A source-contract failure must be distinguished from a runtime/type failure. If a reviewed migration intentionally changes the source contract, update the stale contract to require the new invariant rather than reverting a valid migration merely to satisfy obsolete literal text. Behavior, accessibility and compatibility invariants must still be preserved.

Merged-PR push deduplication is accepted only when the merge push detector proves exact PR merge SHA, merged state and `main` base from the GitHub PR API; any missing parser/API evidence fails open to the full validation pipeline.

Backend source/operations PRs require applicable exact-head Backend CI and PostgreSQL CI, plus account-deletion validation when schema/privacy/account-lifecycle surfaces change.

Documentation-only synchronization must not claim configured-provider, physical-device or production evidence that did not run.

## Activation boundary

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA are authorized when the required access/material actually exists and the relevant preflight/rollback gates are satisfied.

Production credential rotation, production scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence and rollback requirements.
