# Smart Fitness — Implementation Plan

Updated: 2026-08-09

This file is the **canonical forward roadmap**. PR-by-PR history and exact validation detail belong in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Liquid Glass execution detail belongs in `docs/roadmap/liquid-glass.md`.

## Current verified mobile checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current mobile `main`: `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- Latest runtime merge: `eaad35aac4733ba7488ae0aa151c285dca3acc38` (PR #511 — LG-2C Nutrition primary surfaces).
- PR #511 exact validated head: `e1dfaed79f45080d06dd2d590a757e5547f4111b`; Mobile CI #1947 passed the full required gate.
- Active package: **Phase 11 / LG-2D Profile primary surfaces**.
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

**Status: complete.** Legacy/demo ownership cleanup, migration/repository foundations, canonical sync-capable entities, migration idempotency and schema verification are complete.

## Phase 2 — backend auth/session/account foundation

**Status: complete for the established source contract.** Registration, login, refresh, current-user, sessions, password reset/change, account deletion and restart-safe deletion recovery exist. Further backend implementation is a separate workstream.

## Phase 3 — mobile auth + durable sync

**Status: complete for current source scope.** Authenticated shell, session restoration, ownership-safe sync, durable outbox/retry/idempotency/conflict handling, current entity coverage, rehydration and logout/account-delete cleanup boundaries are complete.

## Phase 4 — product domain convergence

**Status: complete for current source scope.** Workouts/Programs/session logging, Nutrition diary/targets/library/templates, Progress history and Profile/account settings are converged on the current architecture.

## Phase 5 — deterministic Coach

**Status: complete for current planned source scope.** Nutrition, Strength, Safety & Recovery and Combined Coach flows use deterministic/versioned inputs and outputs with explicit review/confirmation boundaries.

## Phase 6 — provider-neutral agent foundation

**Status: source-complete with safe disabled defaults.** Provider-neutral interfaces, validation, provenance/audit metadata, bounded retries/errors and capability gates exist. Provider activation remains evidence/authorization-gated.

## Phase 7 — Social foundation

**Status: complete for current planned source scope.** Profiles, graph, chronological Following feed, workout posts, reactions, comments, notifications, moderation/reporting/restrictions and managed-media governance source contracts exist. Social remains server-authoritative and separate from private revisioned `AppState` synchronization.

## Phase 8 — privacy/security hardening

**Status: substantially complete for current source scope.** Data/retention inventories, account deletion, auth/sync/moderation/export privacy exclusions and fail-closed provider/analytics defaults are in source. Exact environment/runtime evidence remains a release/privacy gate.

---

# Phase 9 — release, privacy evidence and data access

Phase 9 remains a cross-repository/release program and is **not part of the current autonomous mobile UI workstream** except where a separately authorized product surface is explicitly requested.

## P9-A — release evidence

**Status: source checks exist; physical/release evidence remains authorization-gated.** Standalone real-device runtime, production-scheme/native build evidence, OTA/EAS channel and rollback verification, and store/release rollback evidence are still required when explicitly authorized. CI/source compilation does not substitute for these checks.

## P9-B — privacy/retention evidence

**Status: source inventories exist; exact provider/environment evidence remains external.** Activated providers/environments must prove bounded retention, access, expiry/deletion behavior, monitoring, account-deletion behavior and exceptional/legal-hold behavior where applicable.

## P9-C — analytics and consent

**Status: collection remains disabled.** Before activation define purpose/region policy, exact provider/environment, retention/deletion/ownership semantics, event/property allowlists, consent persistence/UX, disclosure/localization/accessibility and explicit activation approval.

## P9-D — authenticated data-access export

**Status: product availability remains fail closed until the full reviewed chain exists.** Do not infer availability from source-only pieces or activate backend export routes/providers/storage implicitly from mobile work.

---

# Phase 10 — Responsive Mobile UI Hardening

Canonical contract: `docs/architecture/responsive-mobile-ui.md`.

**Status: complete for the current source/CI scope.** RUI work established shared floating-tab clearance, short-screen scroll/reflow ownership, keyboard-aware editable surfaces, bounded text-pressure behavior, virtualized growing pickers, measured sticky-footer clearance, responsive workout set-table behavior, and focused source guardrails.

Phase 10 must not be reopened as a broad refactor. New responsive defects should be fixed only when concrete evidence appears in current product work. Physical responsive evidence on real devices remains a separate authorization-gated release step.

---

# Phase 11 — Liquid Glass migration

Canonical architecture: `docs/architecture/liquid-glass-ui.md`.
Focused execution roadmap: `docs/roadmap/liquid-glass.md`.

**Status: active.**

## Completed milestones

- **LG-1 shared foundation:** complete via PR #501 / Mobile CI #1922.
- **LG-2A original Home pilot:** complete via PR #503 / Mobile CI #1925.
- **LG-H1 social-first Home:** complete via PR #505 / Mobile CI #1931.
- **LG-2B Progress + Coach primary surfaces:** complete across PR #507 / Mobile CI #1937 and PR #509 / Mobile CI #1943 / merge `7355c0aa8b4b94a7cac8a7682acba90808739b77`.
- **LG-2C Nutrition primary surfaces:** complete via PR #511 / exact green head `e1dfaed79f45080d06dd2d590a757e5547f4111b` / Mobile CI #1947 / merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.

Home remains a social-first hybrid: compact personal daily metrics → future Stories only after real contracts → existing server-authoritative Following Feed. Do not fabricate Stories or Steps.

## Blocked Home follow-ups

- **LG-H2 Stories:** blocked until reviewed DTO/schema, expiry, ownership, follow/block/private-profile, media lifecycle, moderation, viewed-state, retention/account-deletion, pagination and cache contracts exist.
- **LG-H3 Steps:** blocked until a reviewed native health/activity source, dependency/permission disclosure, and later separately authorized physical runtime evidence exist.
- **LG-H4 feed retention:** planned after the base Home feed is stable; preserve current chronological Following semantics unless a separately reviewed ranking contract exists.

## LG-2B — Progress + Coach primary surfaces

**Status: complete for source/CI scope.** Progress primary surfaces use shared/adaptive Liquid Glass material for the weight range selector, body-measurement controls and inputs, trend-chart shell, Safety/Recovery period controls, selected-week state/history actions, and selected-week detail owner. Coach primary already used shared primitives.

## LG-2C — Nutrition primary surfaces

**Status: complete for source/CI scope.** Primary Nutrition material ownership is migrated to adaptive Liquid Glass tokens while dense diary/food rows remain free of per-row native blur. Calculations, targets, date/day semantics, diary grouping, add/edit routing, persistence/sync, localization/accessibility, SectionList virtualization, keyboard/reflow and touch ownership remain unchanged. Secondary Nutrition flows remain for LG-3.

## Active LG-2D — Profile primary surfaces

Audit has isolated the remaining primary Profile material debt to a bounded presentation-only package:

- replace the Profile settings icon's local control recipe with the shared Liquid Glass icon control;
- migrate the goals disclosure surface and pressed state to shared/adaptive control material without blur;
- remove static `Colors.dark` text ownership from the Social profile entry while preserving its existing shared `AppCard`/`SecondaryButton` structure;
- preserve Profile state, goal validation/save behavior, nutrition-target recalculation, routes, localization, accessibility, completed safe-area behavior and 44 pt interaction ownership.

LG-2D is complete only after direct Profile primary material debt is removed and exact-head Mobile CI passes.

## Remaining Phase 11 execution order

1. **LG-2D Profile primary surfaces.** Preserve completed theme/safe-area and Profile domain behavior.
2. **LG-3 secondary surfaces.** Batch adjacent Settings/Sync/Social detail/Progress detail/Nutrition detail/Coach detail/exercise surfaces by shared defect.
3. **LG-4 Workouts:** hub/program cards → library/builder → active workout chrome → set-table states → finish/summary. Preserve session persistence and dense set-table readability.
4. **LG-5 elevated chrome/motion:** use true blur only for bounded elevated/floating roles.
5. **LG-6 visual QA/stabilization:** exact-head CI/source guards first; physical cross-device/light-dark/Dynamic Type/keyboard/performance evidence only when separately authorized.
6. Revisit LG-H2/H3 when their contract/native blockers are actually resolved; do not use placeholders as a substitute.

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

The active LG-2D package is done only when:

- Profile settings/disclosure direct material recipes are replaced by shared/adaptive material without unnecessary native blur;
- Social Profile entry text uses the active theme rather than static `Colors.dark` ownership;
- Profile state, goal validation/save behavior, nutrition-target recalculation, routes, localization, accessibility, safe-area and touch ownership remain intact;
- repository line limits, TypeScript, regression tests, model smoke, Expo export and Expo Doctor pass on the exact PR head;
- roadmap/status/handoff agree with actual Git history;
- the validated exact head merges without unresolved review blockers.

Physical-device, OTA/EAS, native-release, provider, production and store evidence remain separate gates and must not be inferred from source/CI completion.
