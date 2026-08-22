# Agent Validation Matrix

Updated: 2026-08-22

## Purpose

Use this file to choose the **minimum sufficient local validation** and the **authoritative evidence class** required for a change. It prevents both running everything after every tiny edit and calling a risky change complete after a narrow test.

Exact repository CI policy and focused release/QA documents override this quick matrix where stricter.

## Evidence classes

### V0 — static/document integrity

For documentation/navigation-only changes where no runtime behavior changes.

Examples: link/path verification, source-baseline verification, agent navigation integrity and line-limit checks.

### V1 — local source validation

For bounded TypeScript/JavaScript changes without native/provider/database behavior.

```bash
npm run typecheck
npm test
```

Add focused tests where available.

### V2 — authoritative repository CI

Exact-head validation on configured self-hosted Hermes runners.

Mobile: `[self-hosted, linux, x64, hermes-mobile-ci]`.

Backend: `[self-hosted, linux, x64, hermes-backend-ci]`.

A local pass does not replace required exact-head CI.

### V3 — database/integration/concurrency evidence

Required when correctness depends on PostgreSQL, migrations, ownership queries, transactions, locks, uniqueness, concurrency, retry/replay or multi-account isolation.

### V4 — native/physical-device evidence

Required when correctness depends on iOS/Android native runtime, permissions, entitlements, HealthKit/Health Connect, push token behavior, deep links, document/image pickers, camera, native file persistence, native build configuration or actual device lifecycle.

### V5 — external provider/staging evidence

Required when correctness depends on configured APNs/FCM, object storage, Gemini/model transport, moderation/classification, email or another external provider.

### V6 — release/deployment/production evidence

Required only when the task includes activation/deployment/release state: OTA publication, native build/install, backend deploy, migration execution, provider activation, worker scheduling, production smoke/health or store submission.

Source merge does not satisfy V6.

## Mobile command set

```bash
npm ci
npm run agent:check
npm run typecheck
npm test
node scripts/check-repository-file-lines.mjs
node scripts/check-changed-file-lines.mjs
```

Authoritative Mobile CI additionally exercises current repository gates such as expanded-model smoke, Expo export and Expo Doctor according to `.github/workflows/ci.yml`.

Useful direct checks:

```bash
node scripts/run-expanded-sync-intent-model.mjs
npx expo export --clear
npx expo-doctor@1.20.1
```

Do not substitute a hand-picked local subset for required exact-head CI before merge.

## Backend command set

```bash
npm run build
npm test
npm run lint
npm run format:check
```

For schema/data changes, also run the backend PostgreSQL/integration/migration validation required by exact scope.

## Change matrix

| Change type | Local minimum | Authoritative source evidence | Additional evidence when applicable |
| --- | --- | --- | --- |
| Markdown/docs only | V0 | docs/link/source verification | none unless docs claim runtime/deployment evidence |
| Agent map/index/script docs | V0 + `npm run agent:check` when script available | exact changed paths verified | V2 if non-doc script/CI/package files change |
| Leaf TS/TSX UI | V1 | V2 before merge when required | representative interaction/layout runtime |
| Shared UI component | V1 | V2 | light/dark/small-screen/dynamic-type runtime as relevant |
| Navigation/root provider | V1 | V2 | V4 if native/deep-link/global lifecycle involved |
| Pure deterministic calculation | focused unit tests + V1 | V2 | property/adversarial cases when warranted |
| Local persistence behavior | focused persistence/restart tests + V1 | V2 | V4 when device termination/restart is part of claim |
| Progress-photo UI/read-only presentation | focused tests + V1 | mobile V2 | representative runtime; no provider evidence unless scope expands |
| Progress-photo camera/library/storage/delete | focused storage/privacy/account-cleanup tests + V1 | mobile V2 | **V4 required** for permission/capture/import/relaunch/delete/account-cleanup claims; use `docs/qa/progress-photo-device-validation.md` |
| Progress-photo comparison/overlay | deterministic pose/chronology/aspect tests + V1 | mobile V2 | **V4 required** for real-device side-by-side/overlay visual claims |
| Sync adapter/entity serializer | focused sync tests + V1 | V2 mobile + backend if contract changes | V3 concurrency/replay; V4 real second-device when required |
| Sync conflict/recovery | adversarial/retry/restart tests + V1 | V2 both sides as applicable | V3 + real second-device evidence for operational closure |
| Mobile API client | V1 + contract tests | V2 | backend V2 if contract semantics change |
| API DTO/route contract | both-side focused tests | V2 mobile + backend | compatibility rollout evidence when released contract changes |
| Auth/session/refresh | focused auth/concurrency tests | V2 both repos | V3 concurrency; V4 runtime as applicable |
| Account deletion | lifecycle tests including local progress-photo cleanup | mobile/backend V2 as touched | V3 server-owned lifecycle; V4 if local native-file deletion is claimed |
| Backend service/repository | focused tests + build/lint/format | backend V2 | V3 for PostgreSQL semantics |
| Database schema/migration | build/tests + migration inspection | backend V2 | V3 migration/integration; V6 only for actual execution/deploy |
| Labs UI/read-only | V1 | mobile V2 | representative runtime |
| Labs upload/extraction/provider | both-side source tests | mobile/backend V2 | V4 import/device + V5 configured storage/model staging |
| Social relationship/visibility | both-side focused tests | mobile/backend V2 | V3 multi-account isolation; V4 if native push involved |
| Story lifecycle | both-side lifecycle tests | mobile/backend V2 | V3 + V4; V5 for real push/media providers |
| Backend-managed media | fail-closed/provider-neutral tests | mobile/backend V2 | V5 storage/moderation staging; V6 only if deployment requested |
| Push registration | source tests | mobile/backend V2 | V4 permission/token + V5 APNs/FCM delivery |
| Push delivery worker | backend integration tests | backend V2 | V5 configured provider + V4 receipt/tap/device evidence |
| HealthKit/Health Connect | source/type checks | mobile V2 | V4 signed physical-device evidence; native build required |
| Coach deterministic logic | deterministic tests | backend V2 | V3 if persistence/concurrency semantics change |
| Coach model/provider path | strict schema/fail-closed tests | backend V2 | V5 configured staging model evidence |
| Coach confirmation/application | stale/revision tests | mobile/backend V2 | V3 target-domain transactions as relevant |
| Companion derivation | deterministic tests + V1 | mobile V2 | representative runtime |
| Knowledge published content read | exact-version tests | mobile/backend V2 | none unless editorial/provider activation changes |
| Knowledge editorial/publication | backend publication-gate tests | backend V2 | V3 persistence + human/editorial evidence per tier |
| Learning state | retry/idempotency/account tests | mobile/backend V2 | V3 ownership/deletion/export integration |
| Coach→Learn mapping | deterministic allowlist/fail-closed tests | backend/mobile V2 as touched | editorial mapping approval is separate authority evidence |
| Expo config/plugin | config checks + V1 | mobile V2 | V4 native build/install if native runtime changes |
| Native dependency | source/config checks | mobile V2 | V4 native build/install; OTA insufficient |
| CI workflow | syntax/source inspection | run exact changed workflow | additional release evidence only if release/deploy workflow changes |
| Release workflow/gate | source inspection + focused scripts | exact release-gate CI | V6 for actual publication/deployment |
| Backend deployment config | source/config validation | backend V2 | V6 preflight/deploy/health/rollback if deployment requested |
| Provider secret/config | fail-closed checks | backend V2 | V5 staging/config readiness; never expose secrets |

## Private local-media checklist

For Progress Photos or any future explicitly reviewed local-media domain, verify the relevant subset:

- account ownership is preserved across metadata and native file paths;
- imported media is re-encoded before durable storage when the contract requires metadata stripping;
- no EXIF/location/provider metadata becomes durable accidentally;
- delete is durable and retry-safe;
- account cleanup removes owned metadata and native files;
- missing/corrupt files fail closed rather than fabricating readiness;
- comparison/derived presentation does not create a second canonical measurement;
- no cloud upload, server sync, Social sharing, AI vision or image-derived body-fat claim appears unless separately reviewed;
- camera/library/native lifecycle claims use V4 evidence, not source tests alone.

## UI runtime checklist

Select only relevant items:

- Safe Area / Dynamic Island / home indicator clearance;
- small-height scrolling/reachability;
- keyboard open/close/tap persistence;
- Dynamic Type / wrapping;
- light/dark/system appearance;
- loading/empty/error states;
- disabled/enabled actions;
- back/cancel/finish navigation;
- active-session persistence for workout flow;
- floating tab/Companion clearance;
- list virtualization/stable identity for long collections.

A screenshot can support visual evidence but does not prove persistence, navigation, API or ownership semantics.

## Persistence/sync checklist

When persisted or synced state changes, inspect:

- save/load round trip;
- stable IDs;
- ISO timestamps/schema versions;
- restart between mutation and enqueue;
- duplicate delivery/response loss/retry;
- stale revision and explicit conflict persistence;
- local-vs-account resolution serialization;
- tombstone/deletion behavior;
- cursor advancement only after safe materialization;
- account/device ownership;
- second-device behavior where operational closure claims it.

## Server-authoritative domain checklist

For Labs, Social/Stories, Knowledge/Learning, auth/session/device, backend-managed media and canonical Coach state:

- client does not fabricate canonical state;
- authenticated ownership is server-enforced;
- schemas reject invalid critical fields;
- private/provider/editorial fields do not leak;
- deletion/export/privacy lifecycle remains covered;
- unavailable provider capability fails closed;
- replay/idempotency semantics are explicit for retryable writes.

## Release-state checklist

Before claiming an operational action is complete, name the exact achieved state:

- source merged?;
- backend deployed?;
- migration executed?;
- worker scheduled?;
- provider configured?;
- OTA published to which channel?;
- native binary built/installed?;
- physical-device behavior verified?;
- production health/smoke verified?;
- rollback/recovery retained?

Do not use “deployed” or “released” when only source is merged.

## Failure handling

If authoritative CI fails:

1. inspect the failing step/log;
2. classify product defect vs environment/flaky failure;
3. fix the demonstrated cause in a coherent batch;
4. revalidate the new exact head;
5. never merge an earlier passing head after the branch moved.

If one workstream waits on CI or external evidence, continue independent approved work.

## Maintenance rule

Update this matrix when a validation class, CI gate, native/provider evidence requirement or major-domain completion standard changes. Transient CI failures belong in status/handoff/QA, not here.
