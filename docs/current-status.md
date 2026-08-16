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
- #682 — read-only iOS HealthKit and Android Health Connect daily-step adapters, platform runtime wiring, Android `READ_STEPS`, Expo/native dependency configuration, npm-generated lockfile and native PDF document picker for Labs.

#682 passed exact-head Mobile CI: dependency install, repository and changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `c88410455fa9428724910bfc66da5846f7c4070a` (#254).

#254 adds the authorized Labs private-processing runtime:

- bounded Gemini document extraction for PDF/JPEG/PNG/HEIC;
- strict structured extraction validation and draft-only review semantics;
- fail-closed `LAB_PROCESSING_ENABLED` / provider configuration;
- private-object-storage + extraction runtime composition;
- privacy-safe processing readiness output;
- one-shot Labs processing worker;
- production Compose variable plumbing plus Docker/systemd rollout templates and rollback runbook.

#254 merged only after exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI were all green. No credential, deployment, migration execution, scheduler activation or production provider call is implied by source readiness.

## Phase 14 status

**Phase 14 source/CI scope now includes the explicitly authorized native-health, native PDF import and Labs private-processing packages.** External provider, deployed-environment and physical-device evidence remains distinct from source completion.

### P14-A — Push

Source/CI covers authenticated registration authority, logout/session cleanup, durable delivery, APNs/FCM transports, fail-closed configuration, registration freshness, native token lifecycle, auth-only foreground renewal, privacy-minimized payloads, account handoff and rollout/readiness tooling.

Remaining evidence: configured APNs/FCM sends, provider failure/retry/timeout/restart behavior, physical-device notification behavior, second-device/account isolation, offline/reconnect ordering, deployment and production scheduling.

### P14-B — Labs / Analyses

Mobile source contains a native PDF picker and the generic private signed-upload path supports PDF/JPEG/PNG/HEIC. Backend #254 supplies fail-closed private-processing composition, Gemini extraction, privacy-safe readiness and a bounded one-shot worker.

Remaining evidence:

- configured private storage and model credentials in an authorized environment;
- backend staging deployment/migrations;
- controlled provider-output/redaction/error evidence;
- worker execution/scheduling evidence;
- physical-device PDF/photo picker and accessibility evidence;
- production provider activation as a separate rollout decision.

Extracted rows remain drafts until explicit user confirmation; source does not diagnose, prescribe, infer missing values or convert units.

### P14-C — Stories

Stories S10 remains source-complete. Continue only deployment/device/privacy evidence through `docs/qa/stories-s10-runtime-matrix.md` plus bounded fixes for reproduced defects.

### P14-D — Steps

Native source/CI is complete:

- iOS read-only HealthKit `StepCount` adapter;
- Android read-only Health Connect `Steps` aggregate adapter;
- Android `android.permission.health.READ_STEPS` only for this slice;
- device-local calendar-day and DST-safe 23/24/25-hour semantics preserved;
- no workout-derived or fake steps;
- native dependencies and npm lockfile committed and exact-head Mobile CI green.

Remaining evidence is native-build/physical-device behavior: user permission flow, unsupported/no-data states, real aggregate reads and Home presentation on supported devices.

## Current remaining roadmap

1. Run Labs staging readiness/deployment/provider evidence using #254 and reviewed rollback controls.
2. Collect HealthKit/Health Connect physical-device/native-build evidence for #682.
3. Use `docs/qa/push-runtime-evidence-matrix.md` for remaining push provider/device evidence.
4. Keep Stories evidence-only unless a runtime defect is reproduced.
5. Define the next ordinary autonomous product phase explicitly instead of manufacturing additional Phase 14 refactors.

## Activation boundaries

The user has explicitly authorized HealthKit/Health Connect, Labs provider/staging runtime work, backend staging deployment/migrations, APNs/FCM staging work, native/EAS builds and physical-device QA. Execution still requires the relevant environment access, credentials/signing material and/or physical device; source completion must not be reported as executed runtime evidence.

Production credential rotation, production worker scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with their own evidence and rollback controls.
