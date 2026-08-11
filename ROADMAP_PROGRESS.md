# Smart Fitness Roadmap Progress

Updated: 2026-08-11

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Use it together with:

- `AGENTS.md`;
- `PROJECT_LEARNINGS.md`;
- `docs/implementation-plan.md` for the canonical forward plan;
- `docs/current-status.md` for current evidence;
- `docs/handoffs/latest.md` for the active handoff;
- `docs/roadmap/liquid-glass.md` for Phase 11 evidence and history;
- focused release, localization, data-quality, provider, Social, privacy and architecture documents for retained contracts;
- backend `AGENTS.md` and focused backend documentation when backend work is required.

Exact code, tests and current Git history override stale historical prose.

## Verified repository checkpoint

### Mobile

- Current runtime `main`: `a8b2c4530cbdc944e7a3821cdc7926296fb78f18`.
- Latest runtime merge: PR #613 — Program Editor/Picker interaction-material convergence.
- PR #613 exact validated head: `fae10aa93a1d26279eabe9d56eaf1efeb7103974`; Mobile CI #2170 run `31476083264` passed the full Hermes gate before merge.
- PR #614 immediately preceded it: exact head `ca2a9277cac376b52d6332798ce3cf6ebadadd11`; Mobile CI #2167 run `31474957650`; merge `d0f44018ea457a4acc2d33bc69fb608621b3fbe5`.
- LG-5 demonstrated-defect runtime packages total **38**.
- Final package sequence: #610 New Routine virtualization, #611 Program Workout Editor virtualization, #614 Safety Gate responsive/accessibility hardening, #613 Program Editor interaction-material convergence.
- PR #612 was rejected/reset as speculative after confirming Program Detail/Builder day collections are bounded by the seven-day `WeekdayKey` model.
- Routine authoritative Mobile CI remains on `[self-hosted, linux, x64, hermes-mobile-ci]`; merge-generated duplicate validation remains deduplicated under the existing policy.

### Backend

- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #216 persists the CI-runner policy in `AGENTS.md`.
- Backend PR #215 remains CI infrastructure only. It has been refreshed directly onto current backend main at exact head `f5c7f2d4cd1d150f5894fcc60725e85f05631d22` and is mergeable, but its Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI must all execute and pass before ready/merge.

Always re-check exact `main`, open PRs and exact-head workflow state before changing source.

## Current phase state

- Phase 1 cleanup/migration foundation: complete.
- Phase 2 auth/session/account foundation: complete for the established source contract.
- Phase 3 mobile auth + durable sync: complete for current source scope.
- Phase 4 product-domain convergence: complete for current source scope.
- Phase 5 deterministic Coach: complete for current planned source scope.
- Phase 6 provider-neutral agent foundation: source-complete with safe disabled defaults.
- Phase 7 Social foundation: base Social plus image-only v1 Stories source scope complete.
- Phase 8 privacy/security hardening: substantially complete for current source scope; environment/provider evidence remains external.
- Phase 9 release/privacy/data-access evidence: separate cross-repository program with source contracts substantially advanced; product/provider/release activation remains separately gated.
- Phase 10 Responsive Mobile UI Hardening: complete for current source/CI scope.
- **Phase 11 Liquid Glass + Home convergence: LG-4 source convergence and LG-5 validation-first source/CI QA complete for the currently authorized scope.**

## Active autonomous source program

**None.** There is no remaining approved autonomous source-refactor phase and no implicit `LG-6`/`LG-7` continuation.

Future source work requires one of:

- a concrete reproduced/source-demonstrated regression, fixed as the smallest coherent package; or
- an explicitly prioritized and reviewed new product/architecture scope.

Compliant surfaces remain no-change evidence instead of targets for cosmetic churn.

## LG-5 closure evidence

The final Workouts audit rechecked bounded/unbounded collections, stable identity, responsive/safe-area behavior, long/localized copy, accessibility semantics and material pressed/disabled states.

- New Routine and Program Workout Editor arbitrary exercise collections are virtualized with stable IDs (#610/#611).
- Safety Gate narrow-width localized metric/action behavior and secondary-action semantics are hardened (#614).
- Program Editor picker/builder direct interactions own explicit adaptive control/accent/destructive/disabled materials (#613).
- Workout History list/detail and Workout Template Detail already satisfied their virtualized/stable-ID/read-only contracts and were retained unchanged.
- Program Detail/Builder day collections are seven-day bounded and were deliberately not refactored for virtualization.
- Existing Workouts source guards cover the remaining established live boundaries; future changes need new evidence.

Source/CI evidence does **not** establish physical-device or release evidence.

## Current execution order

1. Finish backend PR #215 only after all three exact-head Hermes workflows pass; do not weaken validation to clear a queue.
2. Perform physical-device/native/release/deployment/provider evidence only with explicit authorization.
3. Keep LG-H3 Steps blocked until a reviewed native health/activity provider/dependency/permission contract exists and the required physical runtime work is separately authorized.
4. Preserve chronological Following semantics; LG-H4 ranking/retention remains later until a separate reviewed contract exists.
5. Keep Coach product/material expansion deferred until explicit reprioritization.
6. Treat future concrete source regressions as bounded fixes, not as a new autonomous migration phase.

## Working rules

- Continue through meaningful bounded packages rather than stopping after every micro-change.
- Use branches and pull requests; merge runtime code only after an exact fully green head.
- Preserve routes, stable IDs, persistence/sync schemas, authentication/session semantics, revisions, idempotency, conflict behavior, completed-history immutability, explicit Coach confirmations, media state versions, leases, retention, legal holds and immutable audit unless a task explicitly changes them.
- Keep private fitness data in the existing offline-first/revision-aware boundary.
- Keep Social server-authoritative.
- Keep provider calls and credentials backend-only.
- Potentially long collections use suitable virtualized list boundaries with stable IDs; bounded collections are not virtualization targets by default.
- New user-facing copy must use the localization layer and bounded display mappings.
- Never put health, workout, nutrition, limitation, authentication, Coach, Social content, email, tokens, object keys, signed URLs, OCR plaintext, provider payloads or raw private values into telemetry/diagnostics.

## Activation and release boundary

Source completeness does not activate production behavior.

Without explicit authorization, do not:

- configure credentials, provider accounts, buckets, CDN, DNS or sender domains;
- make real provider calls or run staging calibration/smoke against real environments;
- deploy backend changes or execute migrations outside CI;
- schedule/start production workers;
- activate staging or production product capabilities;
- publish OTA/EAS updates;
- create/install native builds;
- enable public media uploads;
- activate production password-reset email;
- access production user data;
- activate HealthKit/Health Connect or submit to stores.

Physical-device, second-device, offline-restart, accessibility-runtime, EN/RU/unit, Android, release and rollback evidence remain separate from source/CI completion.

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
- multi-image/advanced media formats before the bounded image pipeline is proven;
- lab-analysis, diagnosis, pharmacology, hormone or supplement protocol product features.
