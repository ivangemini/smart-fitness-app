# Smart Fitness Roadmap Progress

Updated: 2026-08-10

This is the canonical cross-program roadmap index for:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

Use it together with:

- `AGENTS.md`;
- `PROJECT_LEARNINGS.md`;
- `docs/implementation-plan.md` for the canonical forward plan;
- `docs/current-status.md` for current evidence;
- `docs/handoffs/latest.md` for the active handoff;
- `docs/roadmap/liquid-glass.md` for Phase 11 execution;
- focused provider, Social, privacy, release and architecture documents for historical contracts and activation boundaries;
- backend `AGENTS.md` and backend focused documentation when backend work is required.

Exact code, tests and current Git history override stale historical prose.

## Verified repository checkpoint

### Mobile

- Current `main`: `975440b6098fb4aebf6d874acca87be581334ed4`.
- Latest runtime merge: PR #565 — shared `SectionHeader` now follows the active app theme instead of `Colors.dark`.
- PR #565 exact validated head: `1a60e87b64db0d87ec99c6ad5c6f47002cf87dde`; Mobile CI #2049 passed before merge.
- LG-5 runtime evidence already merged:
  - PR #559 — Create Program keyboard/safe-area resilience;
  - PR #560 — Workouts short-height/large-text resilience and 44 px notes input;
  - PR #561 — shared `ListRow`, button and segmented-control text resilience; exact head `e16f8d961b4a128c4d7b1de5b4fc36d66342fd8e`, Mobile CI #2043 green;
  - PR #565 — shared `SectionHeader` theme consistency.
- CI execution policy also advanced without changing app behavior:
  - PR #562 routes routine authoritative Mobile CI to Hermes;
  - PR #563 skips only duplicate merge-generated post-merge Mobile CI after an exact-head validated PR;
  - PR #564 persists the Hermes policy for future agents.
- No open mobile pull requests were present at this checkpoint.

### Backend

- Current `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #216 persisted the current CI-runner policy in `AGENTS.md`.
- Open backend PR #215, `Route routine backend CI to Hermes`, remains **draft and unvalidated** at exact head `0826ff18dac7d4afe78943d9881c5a530507f1af`.
- Its Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI exact-head runs remain queued. Do not merge #215 until the required Hermes jobs actually execute and pass on that exact head or a deliberately updated replacement head.

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
- **Phase 11 Liquid Glass + Home convergence: LG-4 source convergence complete; LG-5 QA and bounded polish active.**

## Active autonomous source program

The current autonomous product/source program is **Phase 11 / LG-5 QA and bounded polish**.

LG-5 is validation-first. Runtime work is allowed only when inspection, CI evidence or an authorized runtime observation identifies a concrete defect. Do not manufacture broad migration packages merely to keep changing source.

Current required source/CI matrix:

- light / dark / system appearance;
- narrow phone width and short phone height;
- increased text size and long EN/RU copy;
- keyboard-open forms and editors;
- safe-area ownership on iPhone and Android system navigation;
- populated / empty / loading / error / disabled states;
- long exercise, workout-history and program collections;
- Active Session set entry, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history read/edit/delete;
- elevated material and blur/fallback behavior.

Already confirmed/fixed LG-5 defect classes include keyboard reachability, short-height scrolling, minimum touch geometry, long/localized shared-control text resilience and shared-header theme consistency.

## Historical programs remain authoritative as contracts

Older provider/release, Social, privacy/data-access, synchronization and architecture documents are retained as evidence and contract history. They are not permission to restart an earlier broad phase when the newer Phase 11 plan says validation-first.

Important examples:

- provider/source readiness does not authorize credentials, real provider calls or activation;
- backend privacy/export source work has progressed beyond several early planning notes, so later focused evidence files and current code override old `next slice` wording;
- Social remains server-authoritative and separate from private revisioned `AppState` synchronization;
- analytics/telemetry remains fail-closed until its separate consent/evidence gate is satisfied;
- the approved local-state strategy remains the existing AsyncStorage `AppState` snapshot unless measured evidence reopens that decision.

The mobile `docs/backend/*` Architecture 1.0 documents are historical design material. The actual backend implementation and backend repository documentation are authoritative for current backend behavior.

## Current execution order

1. Continue LG-5 source/CI QA across secondary/shared surfaces.
2. Create runtime PRs only for demonstrated defects; validate the exact head before merge.
3. Keep backend PR #215 blocked until its exact-head Hermes jobs execute and pass; do not weaken validation merely to clear the queue.
4. Collect physical-device/native evidence only when separately authorized.
5. Resume deferred Coach material only after explicit reprioritization.
6. Keep LG-H3 Steps blocked until a reviewed native health/activity source and permission contract exist.
7. Preserve chronological Following semantics until a separate LG-H4 ranking contract is reviewed.

## Working rules

- Continue through a meaningful bounded package rather than stopping after every micro-change.
- Use branches and pull requests; merge only an exact fully green runtime head.
- Preserve routes, stable IDs, persistence/sync schemas, authentication/session semantics, revisions, idempotency, conflict behavior, completed history, explicit Coach confirmations, media state versions, leases, retention, legal holds and immutable audit unless a task explicitly changes them.
- Keep private fitness data in the existing offline-first/revision-aware boundary.
- Keep Social server-authoritative.
- Keep provider calls and credentials backend-only.
- Keep hand-written source and architecture files within repository line-limit policy.
- New user-facing copy must use the localization layer and bounded display mappings.
- Never put health, workout, nutrition, limitation, authentication, Coach, Social content, email, tokens, object keys, signed URLs, OCR plaintext, provider payloads or raw private values into telemetry/diagnostics.

## Activation and release boundary

Source completeness does not activate production behavior.

Without explicit authorization, do not:

- configure credentials, provider accounts, buckets, CDN, DNS or sender domains;
- make real provider calls or run staging calibration/smoke against real environments;
- deploy backend changes or execute migrations outside CI;
- schedule/start workers;
- activate staging or production product capabilities;
- publish OTA/EAS updates;
- create/install native builds;
- enable public media uploads;
- activate production password-reset email;
- access production user data;
- activate HealthKit/Health Connect or submit to stores.

Physical-device, second-device, offline-restart, accessibility, EN/RU/unit, Android, release and rollback evidence remain separate from source/CI completion.

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
