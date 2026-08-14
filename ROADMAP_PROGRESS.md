# Smart Fitness Roadmap Progress

Updated: 2026-08-15

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Use it together with `docs/implementation-plan.md`, `docs/current-status.md`, `docs/handoffs/latest.md`, `docs/roadmap/phase14-active-workstreams.md`, focused roadmaps and repository `AGENTS.md`. Exact source, tests, migrations and Git history override stale prose.

Focused roadmap index:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/phase14-active-workstreams.md`.

## Verified phase baseline

- Phases 1–10: complete for their established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: complete for the authorized source/CI scope; only reproduced bounded regressions remain eligible for follow-up.
- Stories S10: source-complete across mobile/backend; remaining work is runtime/deployment/device evidence plus reproduced defects.
- Phase 12 Labs + Settings: provider-neutral source composition is complete through confirmed-result presentation; external provider/native/runtime activation remains gated.
- Phase 13 Companion v1: merged baseline retained; richer pet/cosmetics/progression remains deferred unless reprioritized.
- **Phase 14 remains the active bounded completion program.**

## Current Phase 14 checkpoint

### Merged mobile baseline

Latest runtime/source merge: `2d34fca37bfed92289b097f89ccb8b36d13a1353` (#659).

Relevant merged source includes:

- Stories S10 #643;
- Phase 12 Labs + Settings #644;
- native push readiness #647;
- Labs interpretation repository #648;
- Steps source seam #651;
- Labs interpretation controller/context #653/#654;
- authenticated push registration client #656;
- confirmed-result Labs interpretation presentation #657;
- Steps local-day/DST/fail-closed source semantics #659.

### Merged backend baseline

Latest runtime/source merge: `dc99dd4d483acfd47c03e0bab9801b7d7d8f6634` (#238).

Relevant merged push source includes:

- provider-neutral contracts #231;
- persistent registrations/API #232;
- current-device logout cleanup #233;
- remote-session/revoke-others cleanup #234;
- durable PostgreSQL delivery outbox + worker #237 (`3ff5d598...`);
- transactional Story interaction enqueue + source-removal cancellation #238 (`dc99dd4d...`).

At this checkpoint there are no open mobile or backend runtime/source PRs.

## What Phase 14 source now guarantees

### Push

Source-complete provider-neutral foundation now includes:

- owner/device registration persistence and authenticated registration boundary;
- online logout/session-revocation registration cleanup;
- durable per-device outbox jobs;
- claim/lease fencing and stale-worker finalization protection;
- bounded retry/backoff;
- exact-registration invalid-token cleanup with credential-rotation protection;
- Story like/reaction/reply enqueue when the injected provider-availability seam is explicitly enabled and the owner preference allows it;
- source-removal cancellation for direct interaction removal and Story deletion/expiry;
- PostgreSQL regression evidence for already-claimed cancellation and stale completion fencing;
- no raw APNs/FCM credential copied into the durable outbox.

This does **not** mean external delivery is activated.

### Steps

Provider-neutral source now includes:

- fail-closed unsupported/denied semantics;
- device-local calendar-day query windows;
- half-open `[local midnight, next local midnight)` native query contract;
- DST-safe 23/24/25-hour days;
- invalid local-date rejection;
- no fake/workout-derived Steps data.

Concrete HealthKit/Health Connect integration remains gated.

### Labs / Analyses

Provider-neutral source composition remains complete through confirmed-result interpretation presentation. Production storage/OCR/model/native picker/runtime evidence remains gated.

### Stories

Stories source remains complete. Missing runtime/device/deployment evidence must not be converted into duplicate implementation work.

## Remaining active roadmap

### 1. Real external push delivery

Remaining work crosses provider/native/runtime gates:

1. concrete APNs/FCM adapter implementation and configured-environment evidence;
2. provider credentials and production worker scheduling;
3. explicit native notification permission UX;
4. native credential acquisition/rotation and registration convergence;
5. offline logout/reconnect policy and evidence;
6. final notification content/privacy/deep-link policy for external delivery;
7. physical-device and second-account/device isolation evidence.

The durable worker and Story enqueue/source-removal packages are already merged and must not be reimplemented.

### 2. Labs / Analyses runtime completion

Remaining work is primarily gated:

- private object storage/OCR/model provider selection and configuration;
- deployment/migration execution in an authorized environment;
- PDF native picker/dependency decision;
- model-tool exposure policy for the internal read-only Labs service;
- provider/device/small-screen/Dynamic Type/VoiceOver evidence.

### 3. Stories runtime evidence

Use `docs/qa/stories-s10-runtime-matrix.md` for:

- deployed backend/migration evidence;
- physical-device behavior;
- second-device/privacy/lifecycle evidence;
- bounded fixes only for reproduced defects.

### 4. Steps native health activity

Remaining work is separately gated:

- HealthKit read-only adapter/dependency;
- Health Connect adapter/dependency;
- explicit permission/disclosure UX;
- native denied/unsupported runtime evidence;
- physical-device evidence;
- final Home presentation against real aggregate data.

## Current execution order

1. Keep canonical docs synchronized with merged `2d34fca` / `dc99dd4d` baselines.
2. Do not open another broad autonomous source package solely to keep Phase 14 busy; the remaining large items are provider/native/runtime gated.
3. Continue read-only audits, QA preparation and bounded fixes for demonstrated defects without crossing those gates.
4. Enter APNs/FCM/native push only after explicit authorization for that gate.
5. Enter HealthKit/Health Connect only after explicit dependency/permission authorization.
6. Run Labs/Stories deployment or physical-device evidence only in authorized environments.
7. Keep Companion v1 bounded; richer pet/cosmetics/progression remains deferred.

## Working rules

- Re-check exact `main`, open PRs, `AGENTS.md` and canonical docs before new source work.
- Prefer bounded evidence-backed packages over speculative refactors.
- Preserve stable IDs, persistence/sync contracts, auth/session semantics, completed-history immutability, Social authority/privacy, Labs ownership/privacy and backend revision/idempotency contracts unless explicitly changed.
- Keep Social/Stories and Labs server-authoritative.
- Keep provider calls and reusable credentials out of ordinary mobile/network diagnostics and model context.
- Source-complete provider/worker/native seams are prerequisites for activation, not authorization to activate them.

## Closed activation and release gates

Without direct authorization, do not:

- deploy backend changes or execute production migrations;
- activate/schedule the production push worker;
- configure or rotate APNs/FCM/provider credentials;
- request native notification permission implicitly;
- activate HealthKit/Health Connect;
- activate production OCR/storage/model providers;
- add native PDF/health/push dependencies solely to bypass a reviewed gate;
- publish OTA/EAS updates;
- create/install native release builds;
- access or mutate production user data;
- submit to app stores.

## Deferred product scope

Do not begin without explicit reprioritization:

- DMs, groups/communities, trainer marketplace, subscriptions/payments;
- algorithmic feed ranking/recommendations;
- contact-book discovery or location sharing;
- public private-health/body/nutrition/Coach data;
- broad Companion pet/cosmetics progression;
- broad Coach product/material expansion;
- rich Stories/media expansion beyond reviewed runtime defects;
- a new autonomous broad refactor phase.
