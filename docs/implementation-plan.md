# Smart Fitness — Implementation Plan

Updated: 2026-08-09

This file is the **canonical forward roadmap**. PR-by-PR history and exact validation detail belong in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Liquid Glass execution detail belongs in `docs/roadmap/liquid-glass.md`.

## Current verified mobile checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current mobile `main`: `be332729c070bbdf5050536d038b270656a5f0e8`.
- Latest runtime merge: `be332729c070bbdf5050536d038b270656a5f0e8` (PR #515 — LG-3A Settings controls/disclosures).
- PR #515 exact validated head: `cf12f4c62eacce618a6c7832163d438514dd7f1d`; Mobile CI #1951 passed the full required gate.
- Active package: **Phase 11 / LG-3B Nutrition secondary surfaces**.
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
- **LG-2C Nutrition primary surfaces:** complete via PR #511 / Mobile CI #1947 / merge `eaad35aac4733ba7488ae0aa151c285dca3acc38`.
- **LG-2D Profile primary surfaces:** complete via PR #513 / Mobile CI #1949 / merge `fb5943c1497cf893858d59ca6b41dcab60790da8`.
- **LG-3A Settings controls/disclosures:** complete via PR #515 / exact green head `cf12f4c62eacce618a6c7832163d438514dd7f1d` / Mobile CI #1951 / merge `be332729c070bbdf5050536d038b270656a5f0e8`.

Home remains a social-first hybrid: compact personal daily metrics → future Stories only after real contracts → existing server-authoritative Following Feed. Do not fabricate Stories or Steps.

## Blocked Home follow-ups

- **LG-H2 Stories:** blocked until reviewed DTO/schema, expiry, ownership, follow/block/private-profile, media lifecycle, moderation, viewed-state, retention/account-deletion, pagination and cache contracts exist.
- **LG-H3 Steps:** blocked until a reviewed native health/activity source, dependency/permission disclosure, and later separately authorized physical runtime evidence exist.
- **LG-H4 feed retention:** planned after the base Home feed is stable; preserve current chronological Following semantics unless a separately reviewed ranking contract exists.

## Completed primary migration

LG-2B Progress + Coach, LG-2C Nutrition primary, and LG-2D Profile primary are complete for source/CI scope. Product/domain semantics, persistence/sync contracts, localization, accessibility and responsive ownership were preserved.

## LG-3 — secondary surfaces

Execute secondary surfaces in coherent batches by shared defect rather than route count.

### LG-3A — Settings controls and disclosures

**Status: complete for source/CI scope.** Settings back navigation, shared `SegmentedControl`, and Personal Details formula radios now use shared/adaptive Liquid Glass controls with explicit neutral/selected pressed states. Existing AppCard/divider ownership, validation/save behavior, accessibility roles/states, safe-area and keyboard behavior remain intact.

### LG-3B — Nutrition secondary surfaces

**Status: active.**

Audited bounded scope:

- migrate Nutrition date-picker day/header/month controls to adaptive glass tokens while preserving calendar/date/routing semantics and touch ownership;
- pass the active Liquid Glass palette through the existing Add Food route/style factory;
- migrate Add Food base/sheet/scanner style factories from direct `surfacePrimary` / `surfaceSecondary` / `borderSubtle` material to adaptive card/control/accent tokens;
- do not change food search/provider results, favorites, meal templates, food entry mutation/persistence, barcode lookup/manual-food behavior, localization, keyboard/reflow, or existing `expo-camera` permission/dependency behavior;
- do not add native blur to dense Add Food rows, modal sheet content, scanner camera/status cards, or controls.

After LG-3B, continue Settings/account, Sync & Backup, Social detail, Progress detail, Coach detail, and exercise detail/library surfaces by shared defect.

## Remaining Phase 11 execution order

1. **LG-3 secondary surfaces**, currently LG-3B Nutrition secondary surfaces.
2. **LG-4 Workouts:** hub/program cards → library/builder → active workout chrome → set-table states → finish/summary. Preserve session persistence and dense set-table readability.
3. **LG-5 elevated chrome/motion:** use true blur only for bounded elevated/floating roles.
4. **LG-6 visual QA/stabilization:** exact-head CI/source guards first; physical cross-device/light-dark/Dynamic Type/keyboard/performance evidence only when separately authorized.
5. Revisit LG-H2/H3 when their contract/native blockers are actually resolved; do not use placeholders as a substitute.

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

The active LG-3B package is done only when:

- audited Nutrition date-picker and Add Food style factories use adaptive Liquid Glass card/control/accent tokens instead of direct legacy surface recipes;
- product/search/template/scanner behavior, localization, persistence, routing, keyboard/reflow and touch ownership remain intact;
- no native blur is added to dense or camera-backed secondary surfaces;
- repository line limits, TypeScript, regression tests, model smoke, Expo export and Expo Doctor pass on the exact PR head;
- roadmap/status/handoff agree with actual Git history;
- the validated exact head merges without unresolved review blockers.

Physical-device, OTA/EAS, native-release, provider, production and store evidence remain separate gates and must not be inferred from source/CI completion.
