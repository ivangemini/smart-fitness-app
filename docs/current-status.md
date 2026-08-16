# Smart Fitness Current Status

Updated: 2026-08-16

Exact code, tests, migrations and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

Recent Phase 14 source now includes:

- #663/#667/#669/#674/#675 — authenticated native push registration/runtime, foreground renewal, auth-transition provenance and privacy-preserving routing foundations;
- #681 — generic Labs signed-upload support for PDF/JPEG/PNG/HEIC without bypassing private upload authority;
- #682 — read-only iOS HealthKit and Android Health Connect daily-step adapters, platform runtime wiring, Android `READ_STEPS`, Expo/native dependency configuration, npm-generated lockfile and real PDF document picker for Labs.

#682 passed exact-head Mobile CI: dependency install, repository and changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest merged runtime/source checkpoint remains `b1643893fc42c57ceaaa54094a1c1c4e1e58b068` (#252) until Labs runtime PR #254 is merged. The docs branch must replace this pending statement with the exact #254 merge SHA before merge.

Existing reviewed backend Phase 14 source includes durable push delivery, APNs/FCM transports, fail-closed provider configuration, atomic refresh-token rotation, registration freshness/account handoff protections and privacy-safe rollout readiness tooling through #252.

Backend #254 is the opened Labs runtime package and adds, subject to exact-head CI and merge:

- bounded Gemini document extraction for PDF/JPEG/PNG/HEIC;
- strict structured extraction validation and draft-only review semantics;
- fail-closed `LAB_PROCESSING_ENABLED` / provider configuration;
- private-object-storage + extraction runtime composition;
- privacy-safe processing readiness output;
- one-shot Labs processing worker;
- production Compose variable plumbing plus Docker/systemd rollout templates and rollback runbook.

No credential, deployment, migration execution, scheduler activation or production provider call is implied by source readiness.

## Phase 14 status

**Phase 14 source scope has advanced through the explicitly authorized native-health, PDF-import and Labs-runtime packages.** External provider, deployed-environment and physical-device evidence remains distinct from source/CI completion.

Focused roadmap: `docs/roadmap/phase14-active-workstreams.md`.

### P14-A — Push

Source/CI covers authenticated registration authority, logout/session cleanup, durable delivery, APNs/FCM transports, fail-closed configuration, registration freshness, native token lifecycle, auth-only foreground renewal, privacy-minimized external payloads, account handoff and privacy-safe rollout/readiness tooling.

Runtime evidence still pending:

- configured APNs/FCM sends through the reviewed worker;
- provider success/transient/permanent/timeout/restart/redaction behavior;
- physical-device permission/token/background/terminated-app behavior;
- authenticated/logged-out notification tap behavior;
- second-device/account isolation against real clients/providers;
- offline/reconnect ordering evidence;
- deployed staging/production worker scheduling and credentials when explicitly activated.

Canonical checklist: `docs/qa/push-runtime-evidence-matrix.md`.

### P14-B — Labs / Analyses

Mobile source now contains a native PDF picker and the generic private signed-upload path supports PDF/JPEG/PNG/HEIC. The opened backend runtime package #254 supplies configured private-processing composition, Gemini extraction, readiness and a bounded one-shot worker once merged.

What source completion does **not** prove:

- that private storage credentials are configured in a deployed environment;
- that Gemini credentials/model configuration have been activated or called against a real user document;
- that backend migrations/deployment have run on staging/production;
- that the worker has been scheduled;
- physical-device PDF/photo picker evidence, accessibility evidence or provider-output evidence;
- diagnosis/treatment correctness. Extracted rows remain drafts until explicit user confirmation.

### P14-C — Stories

Stories S10 remains source-complete. Continue only deployment/device/privacy evidence through `docs/qa/stories-s10-runtime-matrix.md` plus bounded fixes for reproduced defects.

### P14-D — Steps

The native source package is now complete at source/CI level:

- iOS uses a read-only HealthKit `StepCount` adapter;
- Android uses a read-only Health Connect `Steps` aggregate adapter;
- Android declares only `android.permission.health.READ_STEPS` for this slice;
- existing device-local calendar-day and DST-safe 23/24/25-hour semantics are preserved;
- no workout-derived or fake step values are introduced;
- package configuration and npm lockfile are committed and exact-head Mobile CI is green.

Remaining evidence is native-build/physical-device behavior: user permission flow, unavailable/denied/no-data behavior, real aggregate reads and Home presentation on supported iOS/Android devices.

## Companion

Phase 13 Companion v1 remains the bounded merged baseline. Richer pet/cosmetics/naming/progression stays deferred unless explicitly reprioritized.

## CI execution

Mobile authoritative routine CI uses `[self-hosted, linux, x64, hermes-mobile-ci]` and includes repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend authoritative routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` and applicable lint/format/build/test/PostgreSQL/account-deletion gates. #254 must pass all applicable exact-head gates before its merge SHA becomes the backend checkpoint in this document.

Do not substitute source CI or a green readiness manifest for configured-provider, physical-device, deployment or production evidence.

## Current remaining roadmap

1. Finish exact-head validation and merge backend #254; then record its exact merge SHA across canonical docs.
2. Run Labs staging readiness/deployment/provider evidence only with actual environment credentials and reviewed rollback boundaries.
3. Collect HealthKit/Health Connect physical-device/native-build evidence for #682.
4. Use the push runtime evidence matrix for remaining configured-provider/device evidence.
5. Keep Stories evidence-only unless a concrete runtime defect is reproduced.
6. Define the next ordinary autonomous product phase explicitly instead of manufacturing additional Phase 14 refactors.

## Activation boundaries

The user has explicitly authorized HealthKit/Health Connect, Labs provider/staging runtime work, backend staging deployment/migrations, APNs/FCM staging work, native/EAS builds and physical-device QA for this program. Those actions still require the relevant environment access, credentials/signing material and/or physical device; source completion must not be reported as executed runtime evidence.

Production credential activation/rotation, production worker scheduling, production user-data access/mutation, destructive production cleanup, DNS changes and app-store submission remain actions that must be executed deliberately with their own evidence and rollback controls.
