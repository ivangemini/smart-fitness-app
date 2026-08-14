# Smart Fitness Roadmap Progress

Updated: 2026-08-14

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Use it together with:

- `AGENTS.md`;
- `PROJECT_LEARNINGS.md`;
- `docs/implementation-plan.md` for the canonical forward plan;
- `docs/current-status.md` for current evidence;
- `docs/handoffs/latest.md` for the active handoff;
- `docs/roadmap/phase14-active-workstreams.md` for the active Phase 14 package;
- `docs/roadmap/labs.md` for the Labs source/provider/runtime boundary;
- `docs/roadmap/stories.md` for the Stories source/release/expansion boundary;
- `docs/roadmap/release-and-account.md` for release/account evidence;
- `docs/roadmap/localization-settings.md` for localization/settings scope;
- `docs/roadmap/data-quality-and-scale.md` for data-quality/scale scope;
- `docs/architecture/push-registration-lifecycle.md` for real-push identity/logout/privacy requirements;
- focused provider, Social, privacy and backend documentation for retained contracts.

Exact code, tests and current Git history override stale prose.

## Verified phase baseline

- Phase 1 cleanup/migration foundation: complete.
- Phase 2 auth/session/account foundation: complete for the established source contract.
- Phase 3 mobile auth + durable sync: complete for current source scope.
- Phase 4 product-domain convergence: complete for current source scope.
- Phase 5 deterministic Coach: complete for current planned source scope.
- Phase 6 provider-neutral agent foundation: source-complete with safe disabled defaults.
- Phase 7 Social/Stories: image-only baseline, S9 and Stories S10 source are merged across backend/mobile; remaining Stories Phase 14 work is runtime/evidence plus bounded reproduced defects.
- Phase 8 privacy/security hardening: substantially complete for current source scope; provider/environment evidence remains external.
- Phase 9 release/privacy/data-access evidence: separate cross-repository program; production/release activation remains separately gated.
- Phase 10 Responsive Mobile UI Hardening: complete for current source/CI scope.
- Phase 11 Liquid Glass + Home convergence: LG-4 source convergence and LG-5 validation-first QA complete for the authorized scope.
- Phase 12 Labs + Settings: backend PR #230 and mobile PR #644 are merged; provider/native/runtime evidence remains separate.
- Phase 13 Companion v1: merged on mobile and intentionally bounded; richer pet/cosmetics progression is deferred unless reprioritized.
- **Phase 14 is the active bounded product/source program.** Use `docs/roadmap/phase14-active-workstreams.md`.

## Current Phase 14 checkpoint

### Completed / merged

- Stories S10 backend #229 + mobile #643.
- Phase 12 Labs backend #230 + mobile Labs/Settings #644.
- Push provider-neutral delivery contracts backend #231.
- Mobile native push contract/readiness foundation #647.
- Labs interpretation repository boundary #648.
- Labs interpretation state controller #653.
- Steps provider-neutral runtime source seam #651, merged as `b71e1f6bf3724238ebef4aebc67350d4260fbb5b` after complete exact-head Mobile CI.

### Active source PRs

- **Mobile #654 — Labs interpretation composition.** `LabsContext` loads capability/state, runs interpretation only behind server capability, scopes retained output to the originating document and uses request-generation invalidation so stale async results cannot overwrite newer document/run state.
- **Backend #232 — push device registration persistence/HTTP boundary.** Includes migration/journal/schema parity, authenticated owner-scoped register/unregister routes, strict platform/provider validation, atomic credential handoff, technical privacy inventory, Data Access Export exclusion and account-deletion lifecycle integration. No provider activation/deployment is part of this source PR.

### Prepared but unpublished source

- `feat/p14-mobile-registration-client` — authenticated mobile push registration repository + readiness coordinator. No PR yet; must be validated against merged backend #232 before publication.
- `docs/p14-runtime-completion` — documentation consolidation branch. No PR yet.

### Runtime/evidence-only work

- Stories S10 runtime evidence matrix: `docs/qa/stories-s10-runtime-matrix.md`.
- Existing PR #650 is documentation/evidence-only and has stale ancestry; it is not a source blocker.

## Active execution order

1. Finish exact-head Mobile CI for #654; fix only demonstrated defects, review threads, then merge if green.
2. Finish backend #232 through exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI; do not weaken gates or confuse runner teardown flakes with source failures.
3. After backend #232 is merged, rebase/validate the prepared mobile registration client and publish it as a separate bounded PR in a later publish workflow.
4. Synchronize `docs/implementation-plan.md`, `docs/current-status.md`, this index and `docs/handoffs/latest.md` from final merged SHAs.
5. Enter native/provider/runtime packages only when their explicit authorization gates are open.

## Phase 14 workstream boundaries

### Labs completion

Source may continue the confirmed-data interpretation flow and provider-neutral composition. Raw OCR output is not canonical history. External storage/OCR/model credentials, production deployment/migrations and native PDF dependency activation remain separate gates.

### Stories runtime completion

S10 source is merged. Runtime QA must distinguish source/CI, deployed backend/migration, physical-device and second-device/privacy evidence. Fix reproduced defects only; do not reopen the S10 product contract merely because runtime evidence is missing.

### Real push delivery

Provider-neutral registration source may be completed without activating delivery. Real push requires the lifecycle contract in `docs/architecture/push-registration-lifecycle.md`: existing authenticated device identity, explicit permission UX, logout/account-switch cleanup, offline logout policy, provider invalid-token handling, bounded delivery retries, credential redaction and physical-device evidence.

### Steps / native health activity

The provider-neutral daily aggregate seam is merged. HealthKit/Health Connect adapters, native dependencies, explicit permission UX and physical-device evidence are separate work. Never infer steps from workouts and never put raw health samples into Social, telemetry or ordinary model context.

## Working rules

- Continue through meaningful bounded packages rather than stopping after every micro-change.
- Use branches and pull requests; merge runtime code only after the required exact-head gates pass.
- Preserve routes, stable IDs, persistence/sync schemas, authentication/session semantics, revisions, idempotency, conflict behavior, completed-history immutability, explicit Coach confirmations, media state versions, retention and immutable audit unless a task explicitly changes them.
- Keep private fitness/Labs data in its reviewed owner-private boundaries.
- Keep Social and Stories server-authoritative.
- Keep provider calls and credentials backend-only.
- Potentially long collections use suitable virtualized list boundaries with stable IDs; bounded collections are not virtualization targets by default.
- New user-facing copy uses the localization layer and bounded display mappings.
- Never place health, workout, nutrition, limitation, authentication, Coach, Social content, email, reusable credentials, object keys, signed URLs, OCR plaintext, provider payloads or raw private values into telemetry/diagnostics.

## Closed activation and release gates

Source completeness does not activate production behavior.

Without direct authorization, do not:

- configure/rotate provider credentials, buckets, CDN, DNS or sender domains;
- deploy backend changes or execute production migrations;
- activate APNs/FCM or production push workers;
- request native notification permission implicitly;
- activate HealthKit/Health Connect;
- add a native PDF/health/push dependency solely to bypass a reviewed gate;
- publish OTA/EAS updates;
- create/install native release builds;
- access/mutate production user data;
- submit to app stores.

Physical-device, second-device, offline-restart, accessibility-runtime, Android, provider, release and rollback evidence remain separate from source/CI completion.

## Deferred product scope

Do not begin without explicit product prioritization:

- direct messages;
- groups/communities;
- trainer marketplace;
- subscriptions/payments/tips;
- algorithmic feed ranking/recommendations;
- contact-book discovery;
- location sharing;
- automatic workout publication;
- public nutrition, weight, measurements, limitation, recovery or Coach data;
- public health/body leaderboards;
- broad Companion pet/cosmetics progression;
- broad Coach product/material expansion;
- rich Stories/media expansion beyond reviewed runtime defects;
- a new autonomous broad refactor phase.
