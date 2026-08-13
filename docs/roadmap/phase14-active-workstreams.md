# Phase 14 — Active product workstreams

Updated: 2026-08-13

Status: explicitly prioritized and authorized for source implementation.

This roadmap supersedes stale forward-looking statements that still describe Stories S10, Labs Phase 12, or Companion Phase 13 as pending source work. Exact Git history remains authoritative.

## Baseline

- Mobile main: `ada5d58f70dc9192ba893189b09518f7109566d4` (Phase 13 Companion v1 merged after Phase 12 Labs/Settings).
- Backend main: `0b868611cc3bcca83434808acb99861c7e8eab75` (Phase 12 Labs foundation merged after Stories S10).
- Stories S10 source is merged in both repositories.
- Phase 12 Labs source foundation is merged in both repositories.
- Phase 13 Companion v1 is merged on mobile and remains intentionally basic; no pet/cosmetics expansion is active.
- No open PR existed in either repository at this checkpoint.

## Active workstreams

The user explicitly prioritized these four workstreams for parallel implementation:

### P14-A — Labs completion

Goal: turn the merged fail-closed Labs foundation into a complete user flow while preserving review-before-confirmation and private health-data boundaries.

Source scope:

- add mobile PDF document selection using a reviewed native dependency;
- preserve image import and private upload contracts;
- complete production-capable extraction/OCR provider composition behind explicit configuration;
- complete processing worker composition, bounded retries, observability and failure states;
- surface structured AI interpretation for confirmed data only;
- expose the already implemented read-only Labs tools to Companion/Coach through an explicit minimum-context policy;
- preserve provenance, audit metadata, export, deletion and ownership guarantees;
- add end-to-end source tests for document → extraction → review → confirmation → interpretation.

Activation boundary:

- provider credentials, production storage/provider activation, backend deployment and production migrations remain separate controlled actions;
- raw documents never enter ordinary Companion/model context;
- provider output never becomes canonical laboratory history without user review.

### P14-B — Stories runtime completion

Goal: close the gap between merged S10 source and demonstrated runtime behavior.

Scope:

- validate S10 migrations and API behavior in an authorized non-destructive runtime environment;
- validate camera/picker, upload/finalize, restart recovery, expiry, Close Friends, replies, Archive/Highlights and privacy behavior on physical devices;
- validate second-device/read-after-write behavior where applicable;
- repair only demonstrated runtime defects without reopening the S10 product contract;
- preserve rollout compatibility: backend S10 before mobile S10 when runtime rollout is performed.

Production deployment, production migration execution, OTA/EAS publication and store submission are not implied by source work and remain explicit final actions.

### P14-C — Real push delivery

Goal: replace the S10 safe-disabled push seam with a real provider-neutral delivery architecture and native permission/token lifecycle.

Source scope:

- mobile notification permission UX with no prompt on launch and explicit user intent;
- native token acquisition/refresh/revocation lifecycle;
- authenticated owner-scoped device-token registration API;
- token hashing/redaction rules for logs and exports;
- backend notification outbox/delivery worker with idempotency, bounded retries and terminal invalid-token handling;
- APNs/FCM/Expo transport adapter boundary selected by reviewed configuration;
- Story interaction notifications as the first consumer without coupling the delivery core to Stories;
- deep-link routing through typed application destinations;
- account deletion/logout/device revocation cleanup;
- deterministic tests with provider adapters mocked/faked.

Activation boundary:

- provider credentials and production push delivery are not committed to source or activated implicitly;
- permission denial must remain a normal supported state;
- no health/Labs content is placed in lock-screen notification text by default.

### P14-D — Steps / native health activity

Goal: replace the blocked/fake Steps concept with real device health data.

Source scope:

- iOS HealthKit read-only step-count integration first;
- Android Health Connect adapter under the same application contract;
- explicit permission/request UX initiated by the user;
- daily step aggregation using source-local timestamps/timezone semantics;
- deterministic unavailable/denied/not-supported states;
- no inferred steps from workouts;
- no write access to HealthKit/Health Connect for the initial package;
- no raw health samples in Social, telemetry or ordinary model context;
- Home consumes only the bounded daily aggregate contract;
- native adapter is isolated behind a testable repository/service boundary.

Native dependency choices require compatibility validation with Expo SDK 56 / React Native 0.85.3 and a development/release build; Expo Go is not evidence for native health or remote push.

## Parallel execution

These workstreams should proceed independently whenever files/contracts do not overlap:

- Labs: backend processing/provider + mobile import/interpretation;
- Stories runtime: validation and bounded fixes;
- Push: backend delivery foundation + mobile native permission/token layer;
- Steps: native health adapter + Home aggregate presentation.

Shared files such as root app configuration, package manifests, authentication lifecycle and canonical docs must be integrated deliberately rather than edited concurrently by independent branches.

## Validation gates

Every mobile runtime/source head must pass authoritative Mobile CI: line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Every backend runtime/source head must pass Backend CI and relevant PostgreSQL/account-deletion gates.

Native push/health packages additionally require a native build and physical-device evidence before they are called runtime-complete. Provider-backed Labs/push work additionally requires configured-environment evidence before it is called activated.

## Deferred

- Companion pet/cosmetics/naming/richer progression remains deferred; keep the existing Phase 13 v1 baseline.
- Feed ranking/retention remains deferred; chronological Following stays authoritative.
- Broad autonomous refactoring remains unauthorized; changes must serve one of the four active product workstreams or a demonstrated regression.
