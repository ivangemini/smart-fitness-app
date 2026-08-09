# Smart Fitness — Implementation Plan

Updated: 2026-08-09

This file is the **canonical forward roadmap**. PR-by-PR history and exact validation detail belong in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Liquid Glass execution detail belongs in `docs/roadmap/liquid-glass.md`.

## Current verified mobile checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current mobile `main`: `7a9274d910c0e2dfc8bd270d0d1dc332989d6863`.
- Latest runtime merge: `7a9274d910c0e2dfc8bd270d0d1dc332989d6863` (PR #519 — LG-3C Social interaction controls).
- PR #519 exact validated head: `d739a5406490e38773e9acc91e69605a21184c98`; Mobile CI #1955 passed the full required gate.
- Active package: **Phase 11 / LG-3D Social shell + notification controls**.
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

- **LG-1 foundation:** PR #501 / Mobile CI #1922.
- **LG-2A Home pilot:** PR #503 / Mobile CI #1925.
- **LG-H1 social-first Home:** PR #505 / Mobile CI #1931.
- **LG-2B Progress + Coach primary:** PR #507 + #509 / Mobile CI #1937 + #1943.
- **LG-2C Nutrition primary:** PR #511 / Mobile CI #1947.
- **LG-2D Profile primary:** PR #513 / Mobile CI #1949.
- **LG-3A Settings controls/disclosures:** PR #515 / Mobile CI #1951.
- **LG-3B Nutrition secondary:** PR #517 / Mobile CI #1953.
- **LG-3C Social interaction controls:** PR #519 / exact green head `d739a5406490e38773e9acc91e69605a21184c98` / Mobile CI #1955 / merge `7a9274d910c0e2dfc8bd270d0d1dc332989d6863`.

Home remains a social-first hybrid: compact personal daily metrics → future Stories only after real contracts → existing server-authoritative Following Feed. Do not fabricate Stories or Steps.

## Blocked Home follow-ups

- **LG-H2 Stories:** blocked until reviewed DTO/schema, expiry, ownership, follow/block/private-profile, media lifecycle, moderation, viewed-state, retention/account-deletion, pagination and cache contracts exist.
- **LG-H3 Steps:** blocked until a reviewed native health/activity source, dependency/permission disclosure, and later separately authorized physical runtime evidence exist.
- **LG-H4 feed retention:** planned after the base Home feed is stable; preserve current chronological Following semantics unless a separately reviewed ranking contract exists.

## LG-3 — secondary surfaces

LG-3A Settings and LG-3B Nutrition secondary are complete. LG-3C Social interaction controls is complete for source/CI scope: report option material, relationship back navigation, tabs and avatar fallback are adaptive while moderation/relationship domain behavior and Social API authority remain unchanged.

### LG-3D — Social shell + notification controls

**Status: active.**

Bounded package:

- `SocialNotificationScreen`: use shared `LiquidGlassIconButton` for back navigation; migrate notification-card/avatar material and pressed feedback to adaptive card/control tokens while preserving optimistic read, mark-read API call and profile/post routing;
- `SocialCommunityGuidelinesScreen`: migrate only the local back control; retain existing shared `AppCard` content ownership;
- `SocialProfileLookupScreen`: migrate only the local back control; preserve username normalization/validation, keyboard/safe-area behavior, sign-in route and public-profile navigation;
- update stale Social shell/profile-lookup source guards with the runtime change;
- Share Workout is explicitly deferred to a later LG-3 package because publishing/media form material has broader domain risk;
- no native blur per notification card or shell control.

After LG-3D, continue remaining Settings/account, Sync & Backup, Social publishing/detail, Progress detail, Coach detail and exercise detail/library surfaces by shared defect.

## Remaining Phase 11 execution order

1. **LG-3 secondary surfaces**, currently LG-3D Social shell + notification controls.
2. **LG-4 Workouts:** hub/program cards → library/builder → active workout chrome → set-table states → finish/summary.
3. **LG-5 elevated chrome/motion:** true blur only for bounded elevated/floating roles.
4. **LG-6 visual QA/stabilization:** exact-head CI/source guards first; physical evidence only when separately authorized.
5. Revisit LG-H2/H3 only when blockers are genuinely resolved.

---

# Validation policy

Runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. Responsive/Liquid Glass packages must also follow their canonical architecture documents. CI does not substitute for physical-device evidence.

Docs-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes.

# Current definition of done

LG-3D is done only when the audited Social shell/back and notification-card material uses adaptive shared primitives/tokens, notification/profile lookup/domain behavior is unchanged, no per-card native blur is introduced, exact-head Mobile CI is green, docs agree with Git history, and the validated head merges without unresolved review blockers.

Physical-device, OTA/EAS, native-release, provider, production and store evidence remain separate gates and must not be inferred from source/CI completion.
