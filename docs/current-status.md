# Smart Fitness Current Status

Updated: 2026-08-17

Exact code, tests, migrations and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Latest mobile merge: `a874947f81443af335c38a88800d7a16b07a740d` (#724), the post-foundation Liquid Glass convergence rollup. Its exact-head Mobile CI passed repository/changed-file audits, TypeScript, the full regression suite (446 test files / 1945 tests), expanded-model smoke, Expo export and Expo Doctor. The post-merge push was then accepted by the validated-PR dedup detector with heavyweight validation skipped, and the EAS update workflow was skipped; no OTA publish ran.

The preceding CI hardening merge #723 (`e5fafed6918932e1f6289d2a88f62993f2d94fa3`) replaced fragile merged-PR evidence parsing with structural JSON validation and proved the push-dedup path end-to-end on Hermes.

Recent Phase 14 source includes authenticated native push foundations, generic Labs PDF/JPEG/PNG/HEIC signed-upload support, read-only iOS HealthKit and Android Health Connect daily-step adapters, Android `READ_STEPS`, native dependencies/lockfile and native PDF document picking. Post-foundation mobile work has also continued independently through reachable-surface Liquid Glass, localization, responsive-layout and interaction-state convergence without activating external providers or production rollout surfaces.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/operations merge: `bd98b1184e0153b3c7b9dfda7a47f3365b6e208f` (#261). Latest Phase 14 evidence/docs checkpoint: `8638604fb98a1ee84a0a225087a7e64ffd8f2c4e` (#263).

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

These privacy-safe probes establish that the remaining configured-provider Labs and Push gates are blocked on missing staging-only external material rather than missing source/runtime plumbing.

### Stories runtime result

After backend #261 merged the permanent evidence command, temporary evidence-only #262 ran against isolated loopback staging and closed without merge with:

```text
registered=true profileReady=true authenticatedListReady=true freshAccountIsolated=true unauthenticatedFailClosed=true accountDeleted=true deletedSessionRejected=true ready=true
```

One synthetic account was created, its Social profile initialized, an empty authenticated Stories list verified, unauthenticated access rejected, the account deleted, and its deleted session rejected. No media/provider call, scheduler, persistent fixture or production surface was used. The same Backend CI run passed lint, formatting, build, configuration/isolation checks and the full non-PostgreSQL suite.

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

## Current remaining roadmap

1. Continue the reachable-surface Liquid Glass / responsive / localization / interaction-state convergence workstream autonomously where concrete source gaps remain; keep changes scoped to presentation integrity and preserve existing business logic/persistence contracts.
2. When staging-only HTTPS private storage + Gemini material exists, run the already-prepared bounded Labs configured-provider evidence.
3. When staging-only APNs/FCM material exists, run the already-prepared push readiness/provider evidence.
4. When suitable signed builds/devices are available, collect Push, Steps, Labs and remaining Stories physical-device/mobile evidence.
5. Until an external gate becomes actionable, do not manufacture additional Phase 14 provider/runtime source work; only fix reproduced defects or implement newly reviewed contracts. Broad unrelated Phase 15 expansion remains behind the current convergence workstream.

## Activation boundaries

HealthKit/Health Connect, Labs provider/staging runtime, backend staging deployment/migrations, APNs/FCM staging, native/EAS builds and physical-device QA require deliberate execution with the relevant credentials/signing material and/or physical device; they are not implied by ordinary autonomous source work.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes, OTA/EAS publish and app-store submission remain deliberate rollout actions with their own evidence and rollback controls.
