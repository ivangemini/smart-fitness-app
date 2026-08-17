# Latest Handoff

Updated: 2026-08-17

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `3b99382f1b189b07fa7efaf897499269adc10a83` (#726).

Recent merged sequence relevant to the active workstream:

- #711 — shared Liquid Glass primitive convergence;
- #713 — live Home daily-step consumption;
- #716 — Expo SDK 56 patch alignment;
- #718 — self-hosted Hermes Mobile CI resilience;
- #719 — local-persistence retry integrity;
- #723 — strict merged-PR push CI deduplication;
- #724 — broad post-foundation Liquid Glass rollup across Settings, Progress, Companion, Labs, Social profile controls, account modals, Notifications, Nutrition add-food surfaces and Workouts secondary surfaces;
- #726 — Auth/Register training-experience plus Onboarding input/choice material convergence.

#724 and #726 both passed exact-head Mobile CI before merge. Their actual merge pushes then exercised the accepted dedup path: detector success, heavyweight Mobile CI steps skipped. Corresponding EAS update runs completed as `skipped`; no OTA publish occurred.

Repository-wide Liquid Glass coverage is **not yet declared complete**. The reachable-surface audit remains the active autonomous priority.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/operations checkpoint retained from the Phase 14 evidence set: `bd98b1184e0153b3c7b9dfda7a47f3365b6e208f` (#261). Latest Phase 14 evidence/docs checkpoint: `8638604fb98a1ee84a0a225087a7e64ffd8f2c4e` (#263).

#254 merged fail-closed Labs private processing. #255 merged isolated Hermes staging. #256 retained permanent bounded bootstrap. #257 added the bounded configured-Labs evidence gate. #261 added the permanent bounded Stories evidence command.

## Phase 14 evidence checkpoint

### Isolated staging

`hermes-backend-ci-01` revalidated:

- project `smart-fitness-staging`;
- backend loopback-only at `127.0.0.1:3100`;
- staging PostgreSQL with no host port and dedicated staging state/networking;
- external runner-owned `0600` staging env;
- successful loopback `/health`;
- Labs fail-closed readiness: `enabled=false storageReady=false extractionReady=false interpretationEnabled=false ready=false`;
- no production Compose/credentials/user data used.

### Labs prerequisite boundary

Evidence-only #258 retained:

```text
env_file=true provider_fields=false activation_flags=false
```

Staging-only HTTPS S3-compatible storage and Gemini material are not configured, so configured Labs evidence cannot proceed yet.

### Push prerequisite boundary

Evidence-only #260 retained:

```text
env_file=true apns_fields=false fcm_fields=false provider_flags=false master_enabled=false
```

Neither complete APNs nor FCM staging material is configured. Provider flags and master delivery remain disabled, so configured push evidence cannot proceed yet.

### Stories staging boundary

After #261 merged `npm run staging:stories-evidence`, evidence-only #262 ran it on isolated Hermes staging and closed without merge with:

```text
registered=true profileReady=true authenticatedListReady=true freshAccountIsolated=true unauthenticatedFailClosed=true accountDeleted=true deletedSessionRejected=true ready=true
```

The pass used one synthetic account, verified an empty authenticated Stories list, required unauthenticated access to fail closed, deleted the account and verified session revocation. No media/provider call, scheduler, persistent fixture or production surface was used.

## Phase 14 interpretation

The ordinary autonomous source/runtime-preparation portion of Phase 14 is exhausted. Remaining gates are external provider material, signed native/physical-device execution, deliberate rollout, or bounded repair after a reproduced defect. This does **not** claim configured-provider or physical-device evidence is finished.

### Push

Source/CI complete. Remaining: staging-only APNs/FCM configuration and sends, physical-device delivery/taps, second-device/account isolation, offline/reconnect ordering and rollout/scheduling evidence.

### Labs

Source/CI, isolated staging and bounded evidence tooling complete. Remaining: staging-only HTTPS private storage + Gemini configuration, exact `ready=true`, one synthetic upload/worker pass, privacy-safe lifecycle evidence and physical-device picker/accessibility evidence.

### Stories

Source/CI plus basic isolated backend staging route/auth/account-lifecycle evidence complete. Remaining: mobile/device/runtime evidence outside the server probe and bounded reproduced-defect fixes.

### Steps

Read-only HealthKit/Health Connect source/CI complete. Remaining: signed native build/physical-device support detection, permission flow, real aggregate reads, local-day/DST semantics and Home rendering evidence.

## Current autonomous workstream

Continue repository-wide reachable-surface Liquid Glass audit/remediation while the external Phase 14 gates are unavailable.

Rules for this workstream:

1. inspect actual reachable source before editing;
2. treat shared reviewed primitives as converged unless source demonstrates a gap;
3. migrate coherent clusters rather than one-line micro-PRs;
4. preserve business logic, persistence/sync schemas and API contracts;
5. add/update regression or source-contract coverage for each migrated cluster;
6. require exact-head Mobile CI for runtime/code PRs;
7. verify post-merge dedup and ensure EAS/OTA remains unexecuted unless explicitly authorized;
8. do not claim repository-wide convergence until the reachable inventory has no unresolved partial/legacy surface.

## Next execution order

1. Continue the Liquid Glass reachable-surface audit and merge demonstrated remediation clusters.
2. Run Labs configured-provider evidence as soon as staging-only HTTPS storage + Gemini material becomes available.
3. Run push configured-provider evidence as soon as staging-only APNs/FCM material becomes available.
4. Run native/physical-device evidence for Steps, Push, Labs and remaining Stories behavior when signed builds/devices are available.
5. Do not begin unrelated Phase 15 expansion before the Liquid Glass convergence priority is complete.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, Social/Stories authority/privacy, Labs privacy/confirmation semantics, Coach auth/API contracts, active-program owner authority, backend revision/idempotency semantics or privacy/export boundaries as incidental follow-up.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes, OTA/EAS publish, native build/install and app-store submission remain deliberate actions outside ordinary source convergence work.
