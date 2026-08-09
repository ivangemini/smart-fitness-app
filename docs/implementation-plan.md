# Smart Fitness — Implementation Plan

Updated: 2026-08-09

This file is the **canonical forward roadmap**. PR-by-PR history and exact validation detail belong in `docs/current-status.md` and `docs/handoffs/latest.md`. Focused Liquid Glass execution detail belongs in `docs/roadmap/liquid-glass.md`.

## Current verified mobile checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime mobile `main`: `7ca5aba37dd0e994739f52a88afd8601bed5794a`.
- Latest runtime merge: PR #531 — LG-3I Coach secondary shared navigation.
- PR #531 exact validated head: `3d5255b6545bbb8d3fe8aa5972c9c984ce060394`; Mobile CI #1974 passed the full required gate.
- Backend baseline inspected for Stories dependency work: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`.
- Active package: **Home / LG-H2 Stories contracts and implementation**.
- **Coach material is deferred by explicit product priority.**

Release readiness remains lower than source completeness because staging/provider/physical-device/native-release/production evidence is separately gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, repository `AGENTS.md`, this plan, current status, handoff, and focused roadmaps before new work.
- Prefer one bounded package that closes adjacent defects over one micro-PR per visual nudge.
- Preserve routes, IDs, persistence schemas, synchronization contracts, calculations, auth/session semantics, workout/program lifecycle, completed history, Social authority/privacy boundaries, and backend API contracts unless a task explicitly changes them.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md` for mobile UI work.
- Use shared navigation/safe-area geometry and shared material primitives instead of screen-local magic clearances or duplicate glass recipes.
- Preserve the reviewed local-state decision in `docs/architecture/local-state-performance-decision.md`; do not replace the current AsyncStorage architecture without new measured evidence and a separately reviewed decision.
- Local AsyncStorage remains the active storage strategy; architecture-only design options are not implementation authorization.
- There is no remaining approved autonomous source-refactor phase for local-state storage; Stories must stay in the separate server-authoritative Social boundary rather than being added to private revisioned AppState sync.
- Keep analytics/telemetry collection disabled until the P9-C consent/evidence gate is explicitly satisfied.
- Do not claim provider, production, physical-device, native-release, OTA, or deployment evidence unless it actually ran.
- Do not perform backend deployment/migration execution, provider activation, production data access, OTA/EAS publication, native build/install, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation, or store submission without direct authorization.

---

# Phase status

## Phase 1 — cleanup and migration foundation

**Status: complete.** Legacy/demo ownership cleanup, migration/repository foundations, canonical sync-capable entities, migration idempotency and schema verification are complete.

## Phase 2 — backend auth/session/account foundation

**Status: complete for the established source contract.** Registration, login, refresh, current-user, sessions, password reset/change, account deletion and restart-safe deletion recovery exist.

## Phase 3 — mobile auth + durable sync

**Status: complete for current source scope.** Authenticated shell, session restoration, ownership-safe sync, durable outbox/retry/idempotency/conflict handling, current entity coverage, rehydration and logout/account-delete cleanup boundaries are complete.

## Phase 4 — product domain convergence

**Status: complete for current source scope.** Workouts/Programs/session logging, Nutrition diary/targets/library/templates, Progress history and Profile/account settings are converged on the current architecture.

## Phase 5 — deterministic Coach

**Status: complete for current planned source scope.** Nutrition, Strength, Safety & Recovery and Combined Coach flows use deterministic/versioned inputs and outputs with explicit review/confirmation boundaries.

## Phase 6 — provider-neutral agent foundation

**Status: source-complete with safe disabled defaults.** Provider-neutral interfaces, validation, provenance/audit metadata, bounded retries/errors and capability gates exist. Provider activation remains evidence/authorization-gated.

## Phase 7 — Social foundation

**Status: base Social source scope complete; Home Stories extension active.** Profiles, graph, chronological Following feed, workout posts, reactions, comments, notifications, moderation/reporting/restrictions and managed-media governance source contracts exist. Social is server-authoritative and separate from private revisioned `AppState` synchronization.

Stories extend this same Social authority. They must reuse existing profile/follow/block/restriction and managed-media boundaries rather than creating parallel privacy or upload systems.

## Phase 8 — privacy/security hardening

**Status: substantially complete for current source scope.** Data/retention inventories, account deletion, auth/sync/moderation/export privacy exclusions and fail-closed provider/analytics defaults are in source. Exact environment/runtime evidence remains a release/privacy gate.

---

# Phase 9 — release, privacy evidence and data access

Phase 9 remains a cross-repository/release program and is not part of the current source package except where Stories needs source-level privacy/retention/account-deletion correctness.

## P9-A — release evidence

**Status: source checks exist; physical/release evidence remains authorization-gated.** Standalone real-device runtime, production-scheme/native build evidence, OTA/EAS channel and rollback verification, and store/release rollback evidence are still required when explicitly authorized. CI/source compilation does not substitute for these checks.

## P9-B — privacy/retention evidence

**Status: source inventories exist; exact provider/environment evidence remains external.** Activated providers/environments must prove bounded retention, access, expiry/deletion behavior, monitoring, account-deletion behavior and exceptional/legal-hold behavior where applicable.

## P9-C — analytics and consent

**Status: collection remains disabled.** Before activation define purpose/region policy, exact provider/environment, retention/deletion/ownership semantics, event/property allowlists, consent persistence/UX, disclosure/localization/accessibility and explicit activation approval.

## P9-D — authenticated data-access export

**Status: product availability remains fail closed until the full reviewed chain exists.** Do not infer availability from source-only pieces or activate backend export routes/providers/storage implicitly from product work.

---

# Phase 10 — Responsive Mobile UI Hardening

Canonical contract: `docs/architecture/responsive-mobile-ui.md`.

**Status: complete for the current source/CI scope.** RUI work established shared floating-tab clearance, short-screen scroll/reflow ownership, keyboard-aware editable surfaces, bounded text-pressure behavior, virtualized growing pickers, measured sticky-footer clearance, responsive workout set-table behavior, and focused source guardrails.

Phase 10 must not be reopened as a broad refactor. New responsive defects should be fixed only when concrete evidence appears in current product work. Physical responsive evidence on real devices remains a separate authorization-gated release step.

---

# Phase 11 — Liquid Glass + Home convergence

Canonical architecture: `docs/architecture/liquid-glass-ui.md`.
Focused execution roadmap: `docs/roadmap/liquid-glass.md`.

**Status: active, with Home Stories prioritized ahead of remaining cosmetic material debt.**

## Completed milestones

- **LG-1 foundation:** PR #501 / Mobile CI #1922.
- **LG-2A Home pilot:** PR #503 / Mobile CI #1925.
- **LG-H1 social-first Home:** PR #505 / Mobile CI #1931.
- **LG-2B Progress + Coach primary:** PR #507 + #509 / Mobile CI #1937 + #1943.
- **LG-2C Nutrition primary:** PR #511 / Mobile CI #1947.
- **LG-2D Profile primary:** PR #513 / Mobile CI #1949.
- **LG-3A Settings controls/disclosures:** PR #515 / Mobile CI #1951.
- **LG-3B Nutrition secondary:** PR #517 / Mobile CI #1953.
- **LG-3C Social interaction controls:** PR #519 / Mobile CI #1955.
- **LG-3D Social shell + notification controls:** PR #521 + #525 / Mobile CI #1957 + #1963.
- **LG-3E Social Share Workout material:** PR #523 / Mobile CI #1960.
- **LG-3F Account Sessions + Social Profile Editor navigation:** PR #526 / Mobile CI #1965.
- **LG-3G Social workout-post shell navigation:** PR #528 / Mobile CI #1967.
- **LG-3H Social profile/avatar material:** PR #529 / Mobile CI #1970.
- **LG-3I Coach secondary shared navigation:** PR #531 / exact green head `3d5255b6545bbb8d3fe8aa5972c9c984ce060394` / Mobile CI #1974 / merge `7ca5aba37dd0e994739f52a88afd8601bed5794a`.

Home remains a social-first hybrid: compact personal daily metrics → Stories → existing server-authoritative Following Feed.

## Active — LG-H2 Stories

The previous blocker is now the implementation target. Do not build placeholder/fake Stories UI; establish the real server contract first.

### Backend Stories package

Required source behavior:

- versioned strict Story DTOs/schemas and stable bounded error codes;
- authenticated ownership derived only from the session;
- idempotent Story creation;
- an explicit server-derived expiry timestamp and active-only reads;
- owner deletion plus account-deletion cascade;
- chronological bounded list semantics suitable for Home;
- server-side Following, private-profile, symmetric block and moderation-restriction enforcement;
- reuse the existing managed-media asset lifecycle, moderation and immutable public delivery descriptors;
- Story creation accepts only an owned approved compatible managed-media asset;
- idempotent viewed-state persistence scoped to the authenticated viewer;
- retention/cleanup semantics that do not expose expired content;
- forward-safe migration source plus repository/service/route tests;
- no migration execution or deployment as part of source completion.

Initial contract: **one approved managed image per Story, no caption/text overlay**. This keeps the first lifecycle small and reuses the already reviewed image moderation path. Richer authoring can follow after the lifecycle is stable.

### Mobile Stories package

Only after the backend contract merges:

- strict versioned DTO parsers and stable error mapping;
- authenticated API client for list/create/delete/mark-viewed;
- Home horizontal Stories strip ordered by backend contract;
- seen/unseen visual state from server-authoritative viewed state;
- full-screen Story viewer with safe-area/responsive ownership;
- owner creation/deletion flow using managed-media upload/approval status rather than arbitrary URLs;
- bounded privacy-safe account-scoped first-page cache if justified, with immediate backend revalidation;
- localized loading/empty/offline/session/expired/deleted/private/restricted states;
- source guards and exact-head Mobile CI.

### Acceptance boundary

Stories are not complete until server privacy enforcement, expiry, viewed state, media approval, deletion/account cleanup, strict mobile parsing and Home rendering all agree. UI appearance alone is not completion.

## LG-H3 Steps

**Blocked.** Require a reviewed native health/activity source, dependency/permission disclosure and later separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 feed retention

Planned after Home Stories/base feed stability. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred secondary material

LG-3A through LG-3I are complete for their approved packages. Remaining Progress/exercise secondary material can be reprioritized after Stories. **Coach material is explicitly deferred**; do not automatically migrate recovery score controls, limitation choices, Safety lookback buttons, history filters, Combined domain/result cards or related surfaces.

## Later Phase 11 execution

1. Finish LG-H2 Stories end to end.
2. Reassess remaining Progress/exercise secondary material.
3. **LG-4 Workouts:** hub/program cards → library/builder → active workout chrome → set-table states → finish/summary.
4. **LG-5 elevated chrome/motion:** true blur only for bounded elevated/floating roles.
5. **LG-6 visual QA/stabilization:** exact-head CI/source guards first; physical evidence only when separately authorized.
6. LG-H3 Steps only after its native capability boundary is reviewed and authorized.

---

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. Responsive/Liquid Glass packages must also follow their canonical architecture documents. CI does not substitute for physical-device evidence.

Backend Stories runtime/source PRs must follow backend `AGENTS.md`: routes → services → repositories → DB, strict request validation, authenticated ownership, fail-closed privacy, forward-safe migration source, handwritten files under repository limits, `npm run build`, `npm test`, `npm run lint`, and `npm run format:check`. Source work must not execute migrations or deploy the backend.

Docs-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes.

# Current definition of done

The active milestone is LG-H2 Stories. It is done only when the real backend lifecycle/privacy/media/viewed-state contract is merged and validated, the mobile client consumes that strict contract, the Home strip/viewer/owner flow is implemented without duplicating Social authority, exact-head CI is green in each repository, docs agree with Git history, and no unresolved review blockers remain.

Physical-device, OTA/EAS, native-release, backend deployment/migration execution, provider, production and store evidence remain separate gates and must not be inferred from source/CI completion.
