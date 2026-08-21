# Agent Validation Matrix

Updated: 2026-08-21

## Purpose

Use this file to choose the **minimum sufficient local validation** and the **authoritative evidence class** required for a change. It prevents two opposite failures:

- running the entire world after every tiny edit;
- calling a change complete after a narrow test when the contract requires CI, migration, provider, or physical-device evidence.

Exact repository CI policy and focused release/QA documents override this quick matrix where they are stricter.

## Evidence classes

### V0 — static/document integrity

For documentation/navigation-only changes where no runtime behavior changes.

Examples:

- link/path verification;
- source baseline verification;
- agent navigation integrity;
- line-limit checks where applicable.

### V1 — local source validation

For bounded TypeScript/JavaScript changes without native/provider/database behavior.

Typical commands:

```bash
npm run typecheck
npm test
```

Add focused test commands where available.

### V2 — authoritative repository CI

Exact-head validation on the repository's configured self-hosted Hermes runner.

Mobile:

```text
[self-hosted, linux, x64, hermes-mobile-ci]
```

Backend:

```text
[self-hosted, linux, x64, hermes-backend-ci]
```

A local pass does not replace required exact-head CI.

### V3 — database/integration/concurrency evidence

Required when correctness depends on PostgreSQL behavior, migrations, ownership queries, transactions, locks, uniqueness, concurrency, retry/replay, or multi-account isolation.

### V4 — native/physical-device evidence

Required when correctness depends on iOS/Android native runtime, permissions, entitlements, HealthKit/Health Connect, push token behavior, deep links, document/image pickers, camera, native build configuration, or actual device lifecycle.

### V5 — external provider/staging evidence

Required when correctness depends on configured APNs/FCM, object storage, Gemini/model transport, moderation/classification, email, or another external provider.

Provider source support that fails closed without credentials is not the same as configured provider evidence.

### V6 — release/deployment/production evidence

Required only when the task actually includes activation/deployment/release state.

Examples:

- OTA publication;
- native build/install;
- backend deployment;
- migration execution;
- provider activation;
- worker scheduling;
- production smoke/health verification;
- store submission.

Source merge does not satisfy V6.

## Mobile command set

Standard source checks:

```bash
npm ci
npm run agent:check
npm run typecheck
npm test
node scripts/check-repository-file-lines.mjs
node scripts/check-changed-file-lines.mjs
```

Authoritative Mobile CI additionally exercises current repository gates such as expanded-model smoke, Expo export, and Expo Doctor according to `.github/workflows/ci.yml`.

Useful direct checks:

```bash
node scripts/run-expanded-sync-intent-model.mjs
npx expo export --clear
npx expo-doctor@1.20.1
```

Do not substitute a hand-picked local subset for required exact-head CI before merge.

## Backend command set

From the backend checkout, the canonical baseline is:

```bash
npm run build
npm test
npm run lint
npm run format:check
```

For schema/data changes, also run the relevant PostgreSQL/integration/migration validation defined by the backend repository. Generate and inspect a forward-safe Drizzle migration when schema changes require one.

## Change matrix

| Change type | Local minimum | Authoritative source evidence | Additional evidence when applicable |
| --- | --- | --- | --- |
| Markdown/docs only | V0 | docs/link/source verification | none unless docs claim runtime/deployment evidence |
| Agent map/index/script docs | V0 + `npm run agent:check` when script available | exact changed paths verified | V2 if non-doc script/CI/package files changed |
| Leaf TS/TSX UI | V1 | V2 before merge when CI is required | representative runtime for interaction/layout |
| Shared UI component | V1 | V2 | representative light/dark/small-screen/dynamic-type runtime as relevant |
| Navigation/root provider | V1 | V2 | V4/physical runtime if native/deep-link/global lifecycle behavior involved |
| Pure deterministic calculation | focused unit tests + V1 | V2 | property/adversarial cases when risk warrants |
| Local persistence behavior | focused persistence/restart tests + V1 | V2 | V4 when termination/restart/device lifecycle is part of claim |
| Sync adapter/entity serializer | focused sync tests + V1 | V2 mobile + backend exact-head if contract changes | V3 concurrency/replay; V4 real second-device when required |
| Sync conflict/recovery | adversarial/retry/restart tests + V1 | V2 both sides as applicable | V3 + real second-device evidence for operational closure |
| Mobile API client implementation | V1 + contract tests | V2 | backend V2 if contract semantics changed |
| API DTO/route contract | both-side focused tests | V2 mobile + backend | compatibility rollout evidence if released client contract changes |
| Auth/session/refresh | focused auth/concurrency tests | V2 both repositories | V3 concurrency; V4 sign-in/logout/deep-link/password-reset runtime as applicable |
| Backend service/repository | backend focused tests + build/lint/format | backend V2 | V3 when PostgreSQL semantics matter |
| Database schema/migration | backend build/tests + migration inspection | backend V2 | V3 migration/integration; V6 only if execution/deploy is requested |
| Labs UI/read-only | V1 | mobile V2 | runtime representative flow |
| Labs upload/extraction/provider | both-side source tests | mobile/backend V2 | V4 import/device + V5 configured storage/model staging |
| Labs confirmation/history | both-side integration tests | mobile/backend V2 | V3 DB lifecycle; V4 if import/document lifecycle claim included |
| Social relationship/visibility | both-side focused tests | mobile/backend V2 | V3 multi-account isolation; V4 if push/native behavior included |
| Story lifecycle | both-side lifecycle tests | mobile/backend V2 | V3 + V4; V5 for real push/media provider paths |
| Managed media | fail-closed/provider-neutral tests | mobile/backend V2 | V5 storage/moderation provider staging; V6 deployment only if requested |
| Push registration | source tests | mobile/backend V2 | V4 physical permission/token + V5 APNs/FCM for actual delivery |
| Push delivery worker | backend worker/integration tests | backend V2 | V5 configured provider + V4 receipt/tap/deep-link device evidence |
| HealthKit/Health Connect | source/type checks | mobile V2 | V4 signed physical-device evidence; native build required |
| Coach deterministic logic | deterministic unit/integration tests | backend V2 | V3 if persistence/concurrency semantics change |
| Coach model/provider path | strict schema/fail-closed tests | backend V2 | V5 configured staging model evidence |
| Coach confirmation/application | both-side stale/revision tests | mobile/backend V2 | V3 target-domain transaction evidence when relevant |
| Companion derivation | deterministic unit tests + V1 | mobile V2 | runtime representative view |
| Knowledge published content read | both-side exact-version tests | mobile/backend V2 | none unless provider/editorial activation changes |
| Knowledge editorial/publication | backend publication-gate tests | backend V2 | V3 persistence + reviewed human/editorial evidence per content tier |
| Learning state | retry/idempotency/account tests | mobile/backend V2 | V3 ownership/deletion/export integration |
| Coach→Learn mapping | deterministic allowlist/fail-closed tests | backend/mobile V2 as touched | editorial mapping approval is separate product authority evidence |
| Expo config/plugin | config checks + V1 where source touched | mobile V2 | V4 native build/install if native runtime changes |
| Native dependency | source/config checks | mobile V2 | V4 native build/install; OTA is insufficient |
| CI workflow | syntax/source inspection | run exact changed workflow on configured runner | none unless release/deploy workflow changes |
| Release workflow/gate | source inspection + focused scripts | exact release-gate CI | V6 only for actual publication/deployment |
| Backend deployment config | source/config validation | backend V2 | V6 preflight/deploy/health/rollback evidence if deployment requested |
| Provider secret/config | fail-closed source checks | backend V2 | V5 staging/config readiness; never expose secret in evidence |

## UI runtime checklist

When visual or interaction behavior changes, select only relevant items:

- Safe Area / Dynamic Island / home indicator clearance;
- small-height device scrolling/reachability;
- keyboard open/close and tap persistence;
- Dynamic Type / text wrapping;
- light/dark/system appearance;
- loading/empty/error states;
- disabled/enabled action state;
- back/cancel/finish navigation;
- active-session persistence when workout flow is involved;
- floating tab/Companion clearance;
- list virtualization and stable identity for potentially long collections.

A screenshot can support visual evidence but does not prove persistence, navigation, API, or ownership semantics.

## Persistence/sync checklist

When persisted or synced state changes, inspect evidence for:

- save/load round trip;
- stable IDs;
- ISO timestamps and schema/version fields;
- restart between mutation and enqueue;
- duplicate delivery;
- response loss/retry;
- stale revision;
- explicit conflict persistence;
- local-vs-account resolution serialization;
- tombstone/deletion behavior;
- cursor advancement only after safe materialization;
- account/device ownership;
- second-device behavior where operational closure claims it.

## Server-authoritative domain checklist

For Labs, Social/Stories, Knowledge/Learning, auth/session/device, managed media, and canonical Coach state:

- client does not fabricate canonical server state;
- authenticated ownership is enforced server-side;
- request/response schemas reject invalid critical fields;
- private/provider/editorial fields do not leak into public/mobile DTOs;
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
- OTA published to which branch/channel?;
- native binary built/installed?;
- physical-device behavior verified?;
- production health/smoke verified?;
- rollback/recovery path retained?

Do not use “deployed” or “released” as shorthand when only source is merged.

## Failure handling

If authoritative CI fails:

1. inspect the failing step/log;
2. classify product defect vs flaky/environment failure;
3. fix the demonstrated cause in a coherent batch;
4. revalidate the new exact head;
5. do not merge an earlier passing head after the branch moved.

If one workstream waits on CI or external evidence, continue independent approved work rather than ending the pass.

## Maintenance rule

Update this matrix when a validation class, CI gate, native/provider evidence requirement, or major domain completion standard changes. Do not record transient CI failures or one-off PR evidence here; those belong in current status, handoff, QA, or release records.
