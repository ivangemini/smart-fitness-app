# Smart Fitness Current Status

Updated: 2026-08-17

Exact code, tests, migrations and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `3b99382f1b189b07fa7efaf897499269adc10a83` (#726).

Recent verified sequence:

- #711 — shared Liquid Glass primitive convergence;
- #713 — live Home daily-step consumption;
- #716 — Expo SDK 56 patch alignment;
- #718 — self-hosted Hermes Mobile CI resilience;
- #719 — local-persistence retry integrity;
- #723 — strict merged-PR push CI deduplication using PR API evidence plus structural JSON parsing;
- #724 — post-foundation Liquid Glass rollup across Settings, Progress, Companion, Labs, Social profile controls, account modals, Notifications, Nutrition add-food surfaces and Workouts secondary surfaces;
- #726 — Auth/Register training-experience and Onboarding input/choice controls migrated from direct legacy surfaces/generic opacity feedback to the active Liquid Glass palette.

#724 exact-head Mobile CI passed all required steps, including 1945 regression tests, expanded-model smoke, Expo export and Expo Doctor. Its real merge-push acceptance then proved the dedup path: detector succeeded and heavyweight steps were skipped; the EAS update workflow was skipped and no OTA publish occurred.

#726 exact-head Mobile CI also passed all required steps. Its merge-push acceptance again produced detector-only Mobile CI with Checkout through Expo Doctor skipped; the EAS update workflow completed as `skipped`, with no OTA publish.

The repository-wide reachable-surface Liquid Glass audit remains active. It is not yet valid to claim complete repository-wide visual convergence.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/operations merge recorded by the Phase 14 checkpoint: `bd98b1184e0153b3c7b9dfda7a47f3365b6e208f` (#261). Latest Phase 14 evidence/docs checkpoint: `8638604fb98a1ee84a0a225087a7e64ffd8f2c4e` (#263).

Relevant sequence:

- #254 — fail-closed Labs private-processing runtime, Gemini extraction, private-storage composition, readiness, bounded worker and rollout/rollback plumbing;
- #255 — isolated Hermes staging topology with dedicated PostgreSQL state/networking, loopback-only backend ingress and separate provider egress;
- #256 — permanent bounded `staging:bootstrap` plus real Hermes staging evidence and stronger production/repository-env isolation guards;
- #257 — permanent bounded `staging:labs-evidence` gate for the later configured-provider pass;
- #261 — permanent bounded `staging:stories-evidence` command;
- #263 — synchronized backend Phase 14 evidence checkpoint after the successful Stories staging probe.

## Hermes staging evidence

The isolated staging environment has actually booted and been revalidated on `hermes-backend-ci-01`:

- Compose project `smart-fitness-staging`;
- backend exposed only on `127.0.0.1:3100`;
- staging PostgreSQL has no host port and retains dedicated staging state/networking;
- staging environment lives outside the repository under the runner account with mode `0600`;
- loopback `/health` succeeds;
- Labs remains fail-closed before provider configuration: `enabled=false storageReady=false extractionReady=false interpretationEnabled=false ready=false`;
- production Compose, production credentials and production user data were not used.

### External prerequisite results

Labs probe #258:

```text
env_file=true provider_fields=false activation_flags=false
```

Push probe #260:

```text
env_file=true apns_fields=false fcm_fields=false provider_flags=false master_enabled=false
```

These probes establish that the remaining configured-provider Labs and Push gates are blocked on missing staging-only external material rather than missing source/runtime plumbing.

### Stories runtime result

After backend #261 merged the permanent evidence command, evidence-only #262 ran against isolated loopback staging and closed without merge with:

```text
registered=true profileReady=true authenticatedListReady=true freshAccountIsolated=true unauthenticatedFailClosed=true accountDeleted=true deletedSessionRejected=true ready=true
```

One synthetic account was created, its Social profile initialized, an empty authenticated Stories list verified, unauthenticated access rejected, the account deleted, and its deleted session rejected. No media/provider call, scheduler, persistent fixture or production surface was used.

## Phase 14 status

**Ordinary autonomous Phase 14 source/runtime-preparation work is exhausted for the currently authorized contracts.** This is not a claim that configured-provider or physical-device evidence is complete.

### P14-A — Push

Source/CI complete. Remaining evidence is external: staging-only APNs/FCM material and provider sends, physical-device notification delivery/taps, second-device/account isolation, offline/reconnect ordering and deliberate rollout/scheduling evidence.

### P14-B — Labs / Analyses

Native PDF/photo import, fail-closed private processing, isolated Hermes staging and the bounded configured-provider evidence gate are prepared. Remaining work requires staging-only **HTTPS** S3-compatible private storage plus Gemini credentials/model, then `ready=true`, one synthetic upload/worker pass, privacy-safe lifecycle evidence and physical-device picker/accessibility evidence.

Extracted rows remain drafts until explicit user confirmation; source does not diagnose, prescribe, infer missing values or convert units.

### P14-C — Stories

Source/CI plus basic isolated backend staging route/auth/account-lifecycle evidence are complete. Remaining work is mobile/physical-device/runtime evidence outside that server probe and bounded fixes only if a concrete defect is reproduced.

### P14-D — Steps

Native HealthKit/Health Connect source/CI is complete. Remaining evidence is signed native-build/physical-device behavior: permission flow, unsupported/no-data states, real aggregate reads, local-day/DST behavior and Home presentation.

## Active autonomous work

Repository-wide reachable-surface Liquid Glass audit/remediation is the active autonomous priority while the external Phase 14 gates remain unavailable.

Already merged convergence evidence includes #724 and #726. Continue by inventorying reachable primary/secondary screens, modals, sheets, pickers, empty/error/loading states and persistent action/navigation surfaces; migrate only demonstrated partial/legacy implementations, preserve business/persistence contracts, and add focused regression/source contracts for every migrated cluster.

Do not begin unrelated Phase 15 feature expansion until this convergence priority is closed.

## Current execution order

1. Continue the reachable-surface Liquid Glass audit and remediate demonstrated gaps in coherent batches.
2. As soon as staging-only HTTPS private storage + Gemini material exists, run the already-prepared bounded Labs configured-provider evidence.
3. As soon as staging-only APNs/FCM material exists, run the already-prepared push readiness/provider evidence.
4. As soon as suitable signed builds/physical devices are available, collect Push, Steps, Labs and remaining Stories native/mobile evidence.
5. Do not manufacture provider/device evidence or unrelated Phase 14 refactors while those external gates remain unavailable.

## Activation boundaries

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA remain gated by the relevant credentials/signing material/device access and by explicit execution boundaries.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes, OTA/EAS publish, native build/install and app-store submission remain deliberate actions and are not implied by source merges or this checkpoint.
