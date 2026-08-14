# Phase 14 — Active product workstreams

Updated: 2026-08-14

Status: explicitly prioritized source program; provider/native/deployment activation remains separately gated.

This is the focused Phase 14 roadmap. It supersedes stale forward-looking statements that describe Stories S10 or Phase 12 Labs/Settings as pending source work. Exact code, tests and Git history remain authoritative.

## Verified merged baseline

### Stories

- Stories S10 backend PR #229 is merged.
- Stories S10 mobile PR #643 is merged.
- Source authority exists for viewers, Close Friends/audience, replies, fail-closed push preference state, Archive and Highlights.
- Further Stories work in Phase 14 is runtime/evidence validation plus bounded fixes for reproduced defects, not duplicate S10 implementation.

### Labs and Settings

- Phase 12 Labs backend PR #230 is merged.
- Phase 12 Labs/Settings mobile PR #644 is merged.
- Labs is the fifth primary tab; Settings uses grouped child-route information architecture.
- Labs document review, confirmed biomarker history, comparisons, trends, private ingestion seams, bounded interpretation contracts and privacy lifecycle are source-established.
- Production storage/OCR/model providers and PDF-native picker activation remain separate gates.

### Companion

- Phase 13 Companion v1 is merged on mobile and remains intentionally basic.
- Pet/cosmetics/naming/richer progression is not part of the active Phase 14 source package unless separately reprioritized.

### Push foundation

- Backend provider-neutral delivery contracts are merged through PR #231.
- Mobile native push contract/readiness foundation is merged through PR #647.
- No APNs/FCM delivery provider, native permission flow, credential set, background delivery worker or production activation is implied by those merges.

### Labs interpretation foundation

- Mobile repository interpretation endpoint boundary is merged through PR #648.
- Mobile interpretation state controller is merged through PR #653.
- Interpretation remains fail-closed when backend capability is unavailable.

### Steps source seam

- Mobile PR #651 is merged as `b71e1f6bf3724238ebef4aebc67350d4260fbb5b` after complete exact-head Mobile CI.
- The merged source provides a fail-closed runtime activity-source registry and daily Steps hook.
- The default source remains unavailable; no fake or workout-derived steps are introduced.
- HealthKit/Health Connect dependency, permission UX and physical-device evidence remain separately gated.

## Active workstreams

### P14-A — Labs completion

Current mobile source PR: #654.

Current target:

- expose interpretation capability/state through `LabsContext`;
- preserve previous interpretation only for the originating document;
- use request-generation invalidation so a late async result from an older document/run cannot overwrite a newer state;
- invalidate in-flight interpretation writes across refresh/logout/fail-closed resets;
- keep provider execution behind the existing authenticated repository boundary;
- preserve review-before-confirmation and private health-data boundaries;
- do not enable external provider execution or treatment/diagnostic mutation through source composition alone.

After this source layer is stable, a user-facing confirmed-result interpretation surface may be added only under the same confirmed-data/provenance/fail-closed constraints.

Still gated:

- production object storage/OCR/model provider configuration;
- backend deployment and production migration execution;
- PDF mobile native dependency/picker;
- model-tool exposure policy for Companion/Coach;
- physical-device/provider/runtime evidence.

### P14-B — Stories runtime completion

Stories S10 source is already merged. Current work is evidence/runtime validation.

Use `docs/qa/stories-s10-runtime-matrix.md` to distinguish:

1. source/CI evidence;
2. backend runtime/migration evidence;
3. physical-device evidence;
4. second-device/privacy/lifecycle evidence.

Repair only demonstrated runtime defects without reopening the S10 product contract. Preserve rollout compatibility: backend authority before mobile activation when a future runtime rollout is explicitly authorized.

### P14-C — Real push delivery

Current backend source PR: #232.

Current provider-neutral source target:

- owner-scoped persistent device registrations;
- migration, Drizzle journal and actual migrated-schema parity;
- authenticated register/unregister routes;
- route-boundary platform/provider validation;
- atomic provider-token handoff so account switching cannot leave a stale active owner route;
- logger redaction and response behavior that do not expose reusable delivery credentials;
- technical data inventory/account deletion coverage;
- Data Access Export policy that inventories registration state but excludes reusable routing/credential material from candidate exports.

A prepared mobile branch `feat/p14-mobile-registration-client` adds:

- authenticated registration/unregister repository;
- one auth-refresh retry on HTTP 401;
- fail-closed response parsing bound to the requested device/platform/provider;
- readiness-to-registration coordination that never requests native permission implicitly.

Future composition must reuse `AuthSession.device.id`; do not invent a second push-specific device UUID.

Real external delivery additionally requires the lifecycle contract in `docs/architecture/push-registration-lifecycle.md`, including explicit permission UX, logout/account-switch cleanup, offline logout behavior, provider invalid-token feedback, delivery retry policy and physical-device evidence.

Provider credentials, APNs/FCM activation and production delivery remain closed gates.

### P14-D — Steps / native health activity

Provider-neutral source seam is merged through PR #651.

Established source contract:

- fail-closed runtime source registry;
- daily Steps hook over a typed activity source;
- deterministic unavailable state;
- no inferred/workout-derived steps;
- no raw health samples in Social/telemetry/model context.

Remaining native/runtime package:

- reviewed iOS HealthKit read-only adapter/dependency;
- reviewed Android Health Connect adapter/dependency;
- explicit user-initiated permission UX;
- source-local timestamp/timezone semantics;
- physical-device evidence and denied/unsupported paths;
- Home presentation only after the real aggregate source is available.

Do not activate HealthKit/Health Connect or add a native dependency merely because the provider-neutral source seam is merged.

## Parallel execution

Independent workstreams should proceed in parallel when contracts/files do not overlap:

- Labs: interpretation composition and later provider/runtime evidence;
- Stories: runtime matrix and bounded reproduced defects;
- Push: backend registration source plus prepared mobile registration client;
- Steps: native health work only when its dependency/permission gate is explicitly opened.

Shared files such as authentication lifecycle, package manifests, root app configuration and canonical roadmaps must be integrated deliberately rather than edited concurrently by independent branches.

## Validation gates

### Mobile source

Every runtime/source head requires exact-head Mobile CI:

- repository/changed-file line audits;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- Expo Doctor.

### Backend source

Every backend runtime/source head requires the applicable exact-head gates:

- Backend CI;
- PostgreSQL migration/integration CI;
- Account Deletion Receipt CI for schema/privacy changes.

### Native/provider/runtime

Native push/health packages additionally require native build and physical-device evidence before runtime-complete status. Provider-backed Labs/push work requires configured-environment evidence before activation-complete status.

Source CI does not substitute for those gates.

## Closed activation boundaries

Without direct authorization, Phase 14 source work must not:

- deploy the backend;
- execute production migrations;
- activate APNs/FCM;
- add or rotate provider credentials;
- request native push permission implicitly;
- activate HealthKit or Health Connect;
- add a new native PDF/health/push dependency solely to bypass a reviewed gate;
- publish OTA/EAS;
- build/install native releases on physical devices;
- access/mutate production user data;
- submit to app stores.

## Current execution order

1. Finish exact-head CI and merge Labs context PR #654 if green/review-clean.
2. Finish backend push registration PR #232 through Backend CI, PostgreSQL CI and Account Deletion Receipt CI; fix real schema/privacy defects and distinguish unrelated runner teardown flakes.
3. After backend #232 is merged, validate and publish the prepared mobile registration client as a separate bounded PR in a later publish workflow.
4. Synchronize `ROADMAP_PROGRESS.md`, `docs/implementation-plan.md`, `docs/current-status.md`, focused roadmaps and handoff from final merged SHAs.
5. Enter native/provider/runtime evidence packages only when their explicit gates are opened.

## Deferred

- Companion pet/cosmetics/naming/richer progression unless reprioritized;
- feed ranking/retention; chronological Following remains authoritative;
- broad Coach product/material expansion;
- broad autonomous refactoring outside an active product contract or demonstrated defect.
