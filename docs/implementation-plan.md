# Smart Fitness — Implementation Plan

Updated: 2026-08-09

This file is the **canonical forward roadmap**. PR-by-PR history and exact validation detail belong in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Liquid Glass execution detail belongs in `docs/roadmap/liquid-glass.md`.

## Current verified mobile checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Mobile `main` at the start of the active package: `8fe97589d652a48ad45b295c2e460a145439b5c5`.
- Latest runtime merge: `9c9e67a929d10e9f91475c92ba0b579bbadbb805` (PR #505 — LG-H1 social-first Home).
- PR #505 exact validated head: `9f28c198ed75070bcf10484ef09a28a78cbc5571`; Mobile CI #1931 passed.
- Active mobile UI branch: `ui/lg2b-progress-coach-primary`.
- Active package: **Phase 11 / LG-2B Progress + Coach primary surfaces — first bounded Progress batch**.
- Backend baseline inspected for dependency awareness: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend is not part of this package.

Release readiness remains lower than source completeness because staging/provider/physical-device/native-release/production evidence is separately gated.

## Operating rules

- Re-check exact mobile `main`, open PRs, `AGENTS.md`, this plan, current status, handoff, and the focused roadmap before new work.
- Prefer one bounded package that closes adjacent defects over one micro-PR per visual nudge.
- Preserve routes, IDs, persistence schemas, synchronization contracts, calculations, auth/session semantics, workout/program lifecycle, completed history, Social authority/privacy boundaries, and backend API contracts unless a task explicitly changes them.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md` for mobile UI work.
- Use shared navigation/safe-area geometry and shared material primitives instead of screen-local magic clearances or duplicate glass recipes.
- Preserve the reviewed local-state decision in `docs/architecture/local-state-performance-decision.md`; do not replace the current AsyncStorage architecture without new measured evidence and a separately reviewed decision.
- There is no remaining approved autonomous source-refactor phase for local-state storage; Phase 11 Liquid Glass work does not reopen that decision.
- Keep analytics/telemetry collection disabled until the P9-C consent/evidence gate is explicitly satisfied.
- Do not claim provider, production, physical-device, native-release, OTA, or deployment evidence unless it actually ran.
- Do not perform backend deployment/migrations, provider activation, production data access, OTA/EAS publication, native build/install, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation, or store submission without direct authorization.

---

# Phase status

## Phase 1 — cleanup and migration foundation

**Status: complete.**

Legacy/demo ownership cleanup, migration/repository foundations, canonical sync-capable entities, migration idempotency and schema verification are complete.

## Phase 2 — backend auth/session/account foundation

**Status: complete for the established source contract.**

Registration, login, refresh, current-user, sessions, password reset/change, account deletion and restart-safe deletion recovery exist. Further backend implementation is a separate workstream.

## Phase 3 — mobile auth + durable sync

**Status: complete for current source scope.**

Authenticated shell, session restoration, ownership-safe sync, durable outbox/retry/idempotency/conflict handling, current entity coverage, rehydration and logout/account-delete cleanup boundaries are complete.

## Phase 4 — product domain convergence

**Status: complete for current source scope.**

Workouts/Programs/session logging, Nutrition diary/targets/library/templates, Progress history and Profile/account settings are converged on the current architecture.

## Phase 5 — deterministic Coach

**Status: complete for current planned source scope.**

Nutrition, Strength, Safety & Recovery and Combined Coach flows use deterministic/versioned inputs and outputs with explicit review/confirmation boundaries.

## Phase 6 — provider-neutral agent foundation

**Status: source-complete with safe disabled defaults.**

Provider-neutral interfaces, validation, provenance/audit metadata, bounded retries/errors and capability gates exist. Provider activation remains evidence/authorization-gated.

## Phase 7 — Social foundation

**Status: complete for current planned source scope.**

Profiles, graph, chronological Following feed, workout posts, reactions, comments, notifications, moderation/reporting/restrictions and managed-media governance source contracts exist. Social remains server-authoritative and separate from private revisioned `AppState` synchronization.

## Phase 8 — privacy/security hardening

**Status: substantially complete for current source scope.**

Data/retention inventories, account deletion, auth/sync/moderation/export privacy exclusions and fail-closed provider/analytics defaults are in source. Exact environment/runtime evidence remains a release/privacy gate.

---

# Phase 9 — release, privacy evidence and data access

Phase 9 remains a cross-repository/release program and is **not part of the current autonomous mobile UI workstream** except where a separately authorized product surface is explicitly requested.

## P9-A — release evidence

**Status: source checks exist; physical/release evidence remains authorization-gated.**

Still required when explicitly authorized: standalone real-device runtime, production-scheme/native build evidence, OTA/EAS channel and rollback verification, and store/release rollback evidence. CI/source compilation does not substitute for these checks.

## P9-B — privacy/retention evidence

**Status: source inventories exist; exact provider/environment evidence remains external.**

Activated providers/environments must prove bounded retention, access, expiry/deletion behavior, monitoring, account-deletion behavior and exceptional/legal-hold behavior where applicable.

## P9-C — analytics and consent

**Status: collection remains disabled.**

Before activation define purpose/region policy, exact provider/environment, retention/deletion/ownership semantics, event/property allowlists, consent persistence/UX, disclosure/localization/accessibility and explicit activation approval.

## P9-D — authenticated data-access export

**Status: product availability remains fail closed until the full reviewed chain exists.**

Do not infer availability from source-only pieces or activate backend export routes/providers/storage implicitly from mobile work.

---

# Phase 10 — Responsive Mobile UI Hardening

Canonical contract: `docs/architecture/responsive-mobile-ui.md`.

**Status: complete for the current source/CI scope.**

RUI-1 through the final responsive guardrail work are merged. The completed phase established shared floating-tab clearance, short-screen scroll/reflow ownership, keyboard-aware editable surfaces, bounded text-pressure behavior, virtualized growing pickers, measured sticky-footer clearance, responsive workout set-table behavior, and focused source guardrails.

Phase 10 must not be reopened as a broad refactor. New responsive defects should be fixed only when concrete evidence appears in current product work.

Physical responsive evidence on real devices remains a separate authorization-gated release step.

---

# Phase 11 — Liquid Glass migration

Canonical architecture: `docs/architecture/liquid-glass-ui.md`.
Focused execution roadmap: `docs/roadmap/liquid-glass.md`.

**Status: active.**

## Completed milestones

- **LG-1 shared foundation:** complete via PR #501 / Mobile CI #1922.
- **LG-2A original Home pilot:** complete via PR #503 / Mobile CI #1925.
- **LG-H1 social-first Home:** complete via PR #505 / exact green head `9f28c198ed75070bcf10484ef09a28a78cbc5571` / Mobile CI #1931.

Home remains a social-first hybrid: compact personal daily metrics → future Stories only after real contracts → existing server-authoritative Following Feed. Do not fabricate Stories or Steps.

## Blocked Home follow-ups

- **LG-H2 Stories:** blocked until reviewed DTO/schema, expiry, ownership, follow/block/private-profile, media lifecycle, moderation, viewed-state, retention/account-deletion, pagination and cache contracts exist.
- **LG-H3 Steps:** blocked until a reviewed native health/activity source, dependency/permission disclosure, and later separately authorized physical runtime evidence exist.
- **LG-H4 feed retention:** planned after the base Home feed is stable; preserve current chronological Following semantics unless a separately reviewed ranking contract exists.

## Active LG-2B — Progress + Coach primary surfaces

Coach primary audit found that the screen already uses shared `AppCard` and `AppButton` primitives. Do not create meaningless Coach churn.

First bounded Progress batch:

- migrate the 7D/30D/90D weight-range selector to shared `LiquidGlassSurface` and adaptive selected/pressed tokens;
- migrate body-measurement metric/unit choices and inputs to adaptive control tokens;
- migrate the reusable Progress trend-chart shell to shared `LiquidGlassSurface` without per-chart native blur;
- add focused source-contract regression coverage.

Preserve 44 pt interaction ownership, Progress analytics, chart data, navigation, persistence, localization, accessibility states, and Coach domain behavior.

This first batch does **not** complete LG-2B. Remaining Progress material debt includes nested Safety/Recovery filters/detail summary surfaces that still use local recipes. Continue them as one coherent follow-up after the first batch passes exact-head CI and merges.

## Remaining Phase 11 execution order

1. Validate/merge the first bounded LG-2B Progress batch.
2. Finish the remaining coherent LG-2B Progress/Coach primary-surface debt, especially Safety/Recovery nested material recipes.
3. **LG-2C Nutrition primary surfaces.** Keep dense diary/food rows fast; no blur per row.
4. **LG-2D Profile primary surfaces.** Preserve completed theme/safe-area behavior.
5. **LG-3 secondary surfaces.** Batch adjacent Settings/Sync/Social detail/Progress detail/Nutrition detail/Coach detail/exercise surfaces by shared defect.
6. **LG-4 Workouts:** hub/program cards → library/builder → active workout chrome → set-table states → finish/summary. Preserve session persistence and dense set-table readability.
7. **LG-5 elevated chrome/motion:** use true blur only for bounded elevated/floating roles.
8. **LG-6 visual QA/stabilization:** exact-head CI/source guards first; physical cross-device/light-dark/Dynamic Type/keyboard/performance evidence only when separately authorized.
9. Revisit LG-H2/H3 when their contract/native blockers are actually resolved; do not use placeholders as a substitute.

---

# Validation policy

For runtime/code PRs, use repository-required exact-head Mobile CI:

- repository and changed-file line limits;
- TypeScript;
- full regression suite and relevant source contracts;
- expanded sync/model smoke;
- Expo export;
- Expo Doctor.

Responsive and Liquid Glass UI packages must also be reviewed against their canonical architecture documents. CI does not substitute for physical-device evidence.

For docs-only synchronization, verify diff/ancestry; workflows may intentionally ignore Markdown-only changes.

# Current definition of done

The active LG-2B batch is done only when:

- the bounded Progress material migration and focused guard are present on the PR head;
- Coach primary compliance is verified without unnecessary runtime churn;
- Progress analytics/domain behavior and accessibility ownership remain unchanged;
- repository line limits, TypeScript, regression tests, model smoke, Expo export and Expo Doctor pass on the exact PR head;
- roadmap/status/handoff agree with actual Git history;
- the validated exact head merges without unresolved review blockers.

Physical-device, OTA/EAS, native-release, provider, production and store evidence remain separate gates and must not be inferred from source/CI completion.
