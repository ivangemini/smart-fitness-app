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
- `docs/roadmap/stories.md` for the audited Stories source/release/expansion boundary;
- `docs/roadmap/release-and-account.md` for release/account evidence;
- `docs/roadmap/localization-settings.md` for localization/settings scope;
- `docs/roadmap/data-quality-and-scale.md` for data-quality/scale scope;
- focused provider, Social, privacy and architecture documents for retained contracts;
- backend `AGENTS.md` and focused backend documentation when backend work is required.

Exact code, tests and current Git history override stale historical prose.

## Verified repository checkpoint

### Mobile

- Current repository/runtime `main`: `b354fb58f8b1759cca0e2dfd4cb68d48ad5b26b4`.
- Latest runtime merge: PR #617 — Program Builder persisted-state boundary fix.
- PR #617 exact validated head: `4773f60339d70f4ee40163ecc92a492547c9ccc7`; Mobile CI #2179 run `31491962947` passed the full Hermes gate before merge.
- PR #617 is a bounded post-LG-5 regression fix, not LG-5 runtime package #39.
- LG-5 demonstrated-defect runtime packages remain **38**.
- Final LG-5 package sequence: #610 New Routine virtualization, #611 Program Workout Editor virtualization, #614 Safety Gate responsive/accessibility hardening, #613 Program Editor interaction-material convergence.
- PR #612 was rejected/reset as speculative after confirming Program Detail/Builder day collections are bounded by the seven-day `WeekdayKey` model.
- Routine authoritative Mobile CI remains on `[self-hosted, linux, x64, hermes-mobile-ci]`; merge-generated duplicate validation remains deduplicated under the existing policy.

### Backend

- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #216 persists the CI-runner policy in `AGENTS.md`.
- Backend PR #215 remains CI infrastructure only. It has been refreshed directly onto current backend main at exact head `f5c7f2d4cd1d150f5894fcc60725e85f05631d22`; Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI must all execute and pass before ready/merge.

Always re-check exact `main`, open PRs and exact-head workflow state before changing source.

## Current phase state

- Phase 1 cleanup/migration foundation: complete.
- Phase 2 auth/session/account foundation: complete for the established source contract.
- Phase 3 mobile auth + durable sync: complete for current source scope.
- Phase 4 product-domain convergence: complete for current source scope.
- Phase 5 deterministic Coach: complete for current planned source scope.
- Phase 6 provider-neutral agent foundation: source-complete with safe disabled defaults.
- Phase 7 Social foundation: base Social plus the **approved image-only Stories v1 source scope** is complete. This does **not** mean the full long-term Stories product or its runtime/release evidence is complete; use `docs/roadmap/stories.md`.
- Phase 8 privacy/security hardening: substantially complete for current source scope; environment/provider evidence remains external.
- Phase 9 release/privacy/data-access evidence: separate cross-repository program with source contracts substantially advanced; product/provider/release activation remains separately gated.
- Phase 10 Responsive Mobile UI Hardening: complete for current source/CI scope.
- **Phase 11 Liquid Glass + Home convergence: LG-4 source convergence and LG-5 validation-first source/CI QA complete for the currently authorized scope.**

## Active autonomous source program

**None.** There is no remaining approved autonomous source-refactor phase and no implicit `LG-6`/`LG-7` continuation.

The audited Stories roadmap also has **0 remaining autonomous source packages inside the already approved image-only v1 contract**. Future Stories expansion requires an explicitly prioritized product/privacy/media contract; missing physical-device/provider/release evidence remains gated rather than an excuse for speculative source churn.

Future source work requires one of:

- a concrete reproduced/source-demonstrated regression, fixed as the smallest coherent package; or
- an explicitly prioritized and reviewed new product/architecture scope.

Compliant surfaces remain no-change evidence instead of targets for cosmetic churn.

## Stories boundary

`docs/roadmap/stories.md` is the focused Stories roadmap.

Current source-complete image-only v1 includes:

- server-authoritative 24-hour lifecycle, active-only reads, viewed state, privacy/block/restriction enforcement, cursor pagination and owner deletion;
- managed `story_image` ownership and approved-media publication;
- mobile media-library selection, bounded image preprocessing, signed upload/finalize/polling, restart-safe draft recovery and explicit publish;
- Home Story strip, viewer/progress/advance/view acknowledgement and authoritative revalidation after create/delete.

Still separate from that source-complete claim:

- authorization-gated physical-device/standalone and deployed provider/storage/moderation evidence;
- future product candidates such as richer authoring, Story interactions, audience controls, video, archive/highlights and viewer/analytics surfaces. These are inventory only until explicitly prioritized.

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
2. Keep the approved Stories image-only v1 source scope closed; collect its physical-device/provider/release evidence only with explicit authorization, and do not start product-expansion candidates until one receives an explicit reviewed contract.
3. Perform other physical-device/native/release/deployment/provider evidence only with explicit authorization.
4. Keep LG-H3 Steps blocked until a reviewed native health/activity provider/dependency/permission contract exists and the required physical runtime work is separately authorized.
5. Preserve chronological Following semantics; LG-H4 ranking/retention remains later until a separate reviewed contract exists.
6. Keep Coach product/material expansion deferred until explicit reprioritization.
7. Treat future concrete source regressions as bounded fixes, not as a new autonomous migration phase.

## Working rules

- Continue through meaningful bounded packages rather than stopping after every micro-change.
- Use branches and pull requests; merge runtime code only after an exact fully green head.
- Preserve routes, stable IDs, persistence/sync schemas, authentication/session semantics, revisions, idempotency, conflict behavior, completed-history immutability, explicit Coach confirmations, media state versions, leases, retention, legal holds and immutable audit unless a task explicitly changes them.
- Keep private fitness data in the existing offline-first/revision-aware boundary.
- Keep Social and Stories server-authoritative.
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
- Stories expansion candidates listed in `docs/roadmap/stories.md` beyond the approved image-only v1 contract;
- multi-image/advanced media formats before the bounded image pipeline is proven in authorized runtime evidence;
- lab-analysis, diagnosis, pharmacology, hormone or supplement protocol product features.
