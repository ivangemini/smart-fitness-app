# Smart Fitness — Implementation Plan

Updated: 2026-08-09

This file is the **canonical forward roadmap**. Detailed current evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass execution belongs in `docs/roadmap/liquid-glass.md`.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime mobile `main`: `89bae8d1085ffd72131142700c1d625d6fa91f40`.
- Latest runtime merge: PR #533 — server-backed Stories on Home.
- PR #533 exact validated head: `6fde319be2c932620ecec177e3c7e4b7e7e0032a`; Mobile CI #1984 passed the full required gate.
- Backend Stories foundation: PR #214 merged as `2339f6ce…`; exact validated head `9a5af3aba1f4470f261eb9ea00a6e2f2f8979bfe`.
- Active package: **LG-H2 Story authoring — managed `story_image` upload/approval/create/owner delete**.
- **Coach material is deferred by explicit product priority.**

Release readiness remains lower than source completeness because physical-device/native-release/production/provider evidence is separately gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded coherent packages over micro-PRs.
- Preserve routes, IDs, private persistence/sync contracts, calculations, auth/session semantics, workout/program lifecycle, Social authority/privacy and backend API contracts unless a task explicitly changes them.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md`.
- Use shared navigation/safe-area geometry and material primitives; avoid screen-local magic clearances and repeated native blur.
- Local AsyncStorage remains the active storage strategy; architecture-only design options are not implementation authorization. Reviewed decision evidence: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase.
- Stories remain in the server-authoritative Social boundary and must not be added to private revisioned `AppState` sync.
- Analytics/telemetry collection remains disabled until its separate consent/evidence gate is explicitly satisfied.
- Do not claim or perform provider/production/physical-device/native-release/OTA/deployment evidence unless it actually ran and was explicitly authorized.
- Do not perform backend deployment/migration execution, provider activation, production data access, OTA/EAS publication, native build/install, credential/DNS changes, destructive production cleanup, HealthKit/Health Connect activation, or store submission without direct authorization.

---

# Phase status

- **Phase 1 cleanup/migration foundation:** complete.
- **Phase 2 auth/session/account foundation:** complete for established source contract.
- **Phase 3 mobile auth + durable sync:** complete for current source scope.
- **Phase 4 product domain convergence:** complete for current source scope.
- **Phase 5 deterministic Coach:** complete for current planned source scope.
- **Phase 6 provider-neutral agent foundation:** source-complete with safe disabled defaults.
- **Phase 7 Social foundation:** base Social plus Stories server/read-view source scope complete; Story authoring active.
- **Phase 8 privacy/security hardening:** substantially complete for current source scope; environment/provider evidence remains external.
- **Phase 9 release/privacy/data-access evidence:** separate cross-repository/release program, not implicitly activated by product work.
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope.
- **Phase 11 Liquid Glass + Home convergence:** active; Stories prioritized ahead of remaining cosmetic material debt.

---

# Phase 11 — Liquid Glass + Home convergence

Home is now:

**compact personal daily metrics → server-authoritative Stories → server-authoritative chronological Following Feed**.

Completed material/navigation milestones through LG-3I remain valid. Coach material debt is intentionally deferred.

## LG-H2 Stories — current state

### Backend foundation — complete

Backend PR #214 established and validated:

- strict versioned image-only Story DTO/API contracts and stable errors;
- authenticated/idempotent create semantics;
- one approved owned `story_image` asset per Story;
- 24-hour server-authoritative expiry and active-only reads;
- owner delete plus account-deletion cascade;
- Following/self, private-profile, symmetric block and moderation restriction enforcement;
- reuse of existing managed-media moderation/delivery/cleanup authority;
- idempotent viewed state;
- bounded ordering/pagination;
- retention cleanup and privacy/data-export coverage;
- forward migration source and PostgreSQL evidence in CI.

No deployment or production migration execution was performed.

### Mobile read/view — complete

Mobile PR #533 established and validated:

- strict Story DTO/media/lifecycle parsing and Story error mapping;
- authenticated Story API boundary;
- bounded account-scoped two-minute cache with expiry filtering and backend revalidation;
- separate `useSocialStories` ownership from Following feed state;
- Home Story strip between daily metrics and Following;
- backend ordering and server `viewed` seen/unseen state;
- safe-area/content-driven Story viewer;
- idempotent viewed acknowledgement;
- localized loading/error/retry states;
- source guards and exact-head Mobile CI #1984.

The pre-contract `homeSocialFirst` guard was updated from “Stories must not exist” to “Stories must come from real server state; mock/demo Stories remain forbidden.”

### Active package — owner Story authoring

Implement as one coherent mobile package:

1. Extend existing managed-media mobile contracts and parser support from `avatar | workout_post_image` to include `story_image` where the backend contract supports it.
2. Reuse the existing signed image upload/private object storage/finalize/status workflow; do not add a second media pipeline.
3. Expose bounded owner states: upload pending, quarantined/processing, review required, approved, rejected, failed/deleted.
4. Story create is enabled only for an owned `approved` `story_image` and must submit its exact current `stateVersion`.
5. On successful create, refresh authoritative Home Stories rather than fabricating a local server object.
6. Provide owner deletion through the merged Story delete endpoint and refresh server state after success.
7. Keep v1 image-only: no caption, text overlay, video, arbitrary URL or client-authored expiry.
8. Localize authoring/processing/error copy and preserve accessibility/safe-area/responsive contracts.
9. Add strict parser/API/source tests and require exact-head Mobile CI.

### LG-H2 definition of done

LG-H2 is complete only when backend lifecycle/privacy/media/viewed-state and mobile list/view/create/delete all agree on the same strict contract, owner authoring uses the existing managed-media approval authority, exact-head CI is green, docs match Git history and no review blockers remain.

## LG-H3 Steps

**Blocked.** Require a reviewed native health/activity source, dependency/permission disclosure and later separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 Feed retention/ranking

Later. Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## Deferred secondary material

After LG-H2 stability, reassess remaining Progress/exercise secondary material. Coach recovery scores/inputs, limitation choices, Safety lookback controls, history filters and Combined domain/result material remain explicitly deferred unless reprioritized.

## Later Phase 11 execution

1. Finish LG-H2 owner Story authoring/delete.
2. Reassess remaining Progress/exercise secondary material.
3. LG-4 Workouts material convergence.
4. LG-5 bounded elevated chrome/motion.
5. LG-6 visual QA/stabilization; physical evidence only when separately authorized.
6. LG-H3 Steps only after native capability review and authorization.

---

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. Responsive/Liquid Glass packages must also follow their canonical architecture documents. CI does not substitute for physical-device evidence.

Backend runtime/source work must follow backend `AGENTS.md`: routes → services → repositories → DB, strict validation, authenticated ownership, fail-closed privacy, forward-safe migration source, repository line limits, lint/format/build/tests and relevant PostgreSQL CI. Source work must not deploy or execute production migrations.

Docs-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes.
