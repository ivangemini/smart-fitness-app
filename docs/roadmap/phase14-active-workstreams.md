# Phase 14 — Active product workstreams

Updated: 2026-08-16

Status: **source/CI completion now includes the explicitly opened native-health, native PDF import and Labs private-processing runtime packages.** Remaining work is configured-environment, deployment and physical-device evidence rather than another broad source implementation pass.

Exact code, tests, migrations and Git history remain authoritative.

## Verified merged baseline

### Mobile

Latest runtime/source merge: `f87b3ea07588e255f6773b1fcac7b4ec8c9f4238` (#682).

Relevant merged packages:

- #669/#674/#675 — push freshness/auth-transition completion packages;
- #681 — generic private Labs signed-upload support for PDF/JPEG/PNG/HEIC;
- #682 — iOS HealthKit + Android Health Connect read-only daily-step integration, platform wiring, native configuration/dependencies, Android `READ_STEPS`, npm-generated lockfile and native Labs PDF picker.

#682 passed exact-head Mobile CI including install, line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

### Backend

Latest merged runtime/source checkpoint remains `b1643893fc42c57ceaaa54094a1c1c4e1e58b068` (#252) until #254 completes exact-head CI and merges. Replace this pending checkpoint with the exact #254 merge SHA before this docs branch is merged.

Backend #254 is the authorized Labs private-processing runtime package. Its intended merged source adds Gemini extraction, fail-closed Labs processing configuration, private storage composition, readiness tooling, a bounded one-shot worker and rollout/rollback templates without activating credentials or deployment.

## P14-A — Real push delivery

**Status: source/CI complete for the reviewed architecture; configured-provider, physical-device, second-device/account and rollout evidence remain.**

Canonical stop/go checklist: `docs/qa/push-runtime-evidence-matrix.md`.

Completed source includes authenticated owner/device registration, logout/session cleanup, durable PostgreSQL outbox delivery, APNs/FCM transports, fail-closed provider composition, claim/lease fencing, bounded retry, invalid-token rotation protection, Story cancellation/preference handling, registration freshness, account handoff, native Expo Notifications runtime, auth-gated routing and privacy-safe rollout/readiness tooling.

### Remaining push evidence

1. configured APNs/FCM staging sends through the reviewed worker, including success/transient/permanent/timeout/restart/redaction behavior;
2. physical-device permission/token/foreground/background/terminated-app/deep-link behavior;
3. second-device/account isolation and handoff evidence;
4. offline/reconnect ordering evidence for freshness expiry and authenticated renewal;
5. explicit production rollout only after reviewed staging evidence and rollback readiness.

A readiness manifest or source CI is not provider-send or physical-device evidence.

## P14-B — Labs / Analyses completion

**Status: native import source is merged; private-processing backend source is the active #254 completion package.**

Mobile now provides:

- photo import plus a native PDF document picker;
- a shared signed-upload path for PDF/JPEG/PNG/HEIC;
- no separate client-side bypass of private upload authority.

Backend #254, once merged, provides:

- a bounded Gemini Interactions API extraction adapter for PDF/JPEG/PNG/HEIC;
- strict structured-result validation;
- prompts/contracts that prohibit diagnosis, treatment, unit conversion, missing-value inference and non-result patient metadata;
- draft-only extracted rows pending explicit user confirmation;
- fail-closed `LAB_PROCESSING_ENABLED` and extraction-provider configuration;
- private storage + extraction composition;
- privacy-safe readiness output;
- a one-shot Labs processing worker;
- Compose/systemd/Docker rollout plumbing and rollback guidance without automatic scheduling.

Remaining Labs evidence after source merge:

1. configure authorized non-production private storage and model credentials;
2. run backend deployment/migrations in the authorized environment;
3. prove readiness without credential leakage;
4. process controlled test documents and record provider/output/redaction/error behavior;
5. collect native PDF/photo picker and accessibility evidence;
6. keep extracted rows user-confirmed before they become canonical results;
7. production provider activation/scheduling remains an explicit rollout decision.

## P14-C — Stories runtime completion

**Status: source-complete; evidence/runtime only unless a defect is reproduced.**

Use `docs/qa/stories-s10-runtime-matrix.md` to distinguish source/CI, deployed backend/migration, physical-device and second-device/privacy/lifecycle evidence.

## P14-D — Steps / native health activity

**Status: native HealthKit/Health Connect source integration is merged and exact-head Mobile CI is green. Physical-device/native-build evidence remains.**

Merged #682 preserves the existing provider-neutral contract while supplying:

- iOS read-only HealthKit `StepCount` access;
- Android read-only Health Connect `Steps` aggregation;
- only `android.permission.health.READ_STEPS` for the Android slice;
- platform source selection through the existing runtime seam;
- device-local calendar-day windows and DST-safe 23/24/25-hour boundaries;
- fail-closed unsupported/permission/no-data handling without workout-derived fake steps;
- Expo/native dependency configuration and a committed npm-generated lockfile.

Important iOS privacy constraint: HealthKit does not provide an authoritative read-denied signal for a data type after the permission sheet; source behavior must not invent a reliable read-denied state where the platform intentionally withholds it.

Remaining Steps evidence:

1. create/install an authorized native build containing the HealthKit/Health Connect modules;
2. exercise the user-initiated permission flow on supported physical devices;
3. verify real daily aggregate reads, no-data/unsupported behavior and date/DST boundaries;
4. validate Home presentation against real device data;
5. capture platform-specific evidence rather than inferring it from source tests.

## Completion interpretation

Phase 14 remains **closed for ordinary autonomous source work** after the opened #682/#254 packages. Runtime evidence can reopen a bounded source fix only when it reproduces a defect or requires a reviewed contract change.

Do not create broad source branches merely to keep Phase 14 active.

## Validation gates

### Mobile source

Exact-head Mobile CI requires repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. #682 passed this gate before merge.

### Backend source

Applicable exact-head gates include Backend CI, PostgreSQL CI and Account Deletion Receipt CI. #254 must pass all applicable gates on its final non-diagnostic head before merge.

### Provider/device/runtime

Configured-provider runtime, deployed-environment and physical-device evidence remain distinct from source CI. Source tests and readiness tooling do not complete those rows.

## Next execution order

1. complete and merge #254 after exact-head Backend/PostgreSQL/account-deletion CI;
2. collect Labs staging deployment/storage/model evidence using the merged readiness/worker contract;
3. collect HealthKit/Health Connect physical-device evidence for #682;
4. collect push configured-provider/device evidence through the existing matrix;
5. keep Stories evidence-only unless a defect is reproduced;
6. explicitly define the next ordinary product phase before beginning broad autonomous source work.

## Authorization / execution boundary

The native-health, Labs provider/staging, backend staging deployment/migration, APNs/FCM staging, native/EAS build and physical-device QA gates have been explicitly opened by the user for this program. That authorization does not make unavailable secrets, signing material, external provider accounts or physical-device actions magically complete; evidence must reflect only actions actually executed.

Production credentials, production scheduling, production user-data mutation, destructive cleanup, DNS changes and app-store submission remain deliberate rollout actions with separate evidence/rollback requirements.

## Deferred

Companion progression beyond current v1, feed ranking/retention, broad Coach expansion, DMs/groups/marketplace/subscriptions and broad autonomous refactoring outside an active product contract or demonstrated defect remain deferred unless explicitly reprioritized.
