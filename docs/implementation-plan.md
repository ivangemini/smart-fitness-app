# Smart Fitness — Implementation Plan

Updated: 2026-08-09

This file is the **canonical forward roadmap**. Detailed current evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass execution belongs in `docs/roadmap/liquid-glass.md`.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime mobile `main`: `279a09e4b73e067a2cb0c1d836b8da809ce0b6b1`.
- Latest runtime merge: PR #537 — Exercise Detail / shared secondary-material theme convergence.
- PR #537 exact validated head: `5ee5a3dfb1cf3591168821c3b4275b26e597aca4`; Mobile CI #1992 passed the full required gate.
- Backend Stories foundation: PR #214 merged as `2339f6ce…`; exact validated head `9a5af3aba1f4470f261eb9ea00a6e2f2f8979bfe`.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- Progress/exercise reassessment has completed one bounded package: Exercise Detail, `MuscleMap`, and shared `StatChip` now use the active theme rather than hardcoded dark tokens.
- Active product/source priority: **continue the remaining Progress/exercise secondary-material audit; move to LG-4 Workouts when no material bounded debt remains.**
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
- **Phase 7 Social foundation:** base Social plus Stories list/view/authoring/delete complete for the current image-only v1 source scope.
- **Phase 8 privacy/security hardening:** substantially complete for current source scope; environment/provider evidence remains external.
- **Phase 9 release/privacy/data-access evidence:** separate cross-repository/release program, not implicitly activated by product work.
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope.
- **Phase 11 Liquid Glass + Home convergence:** active; LG-H2 Stories is complete and Progress/exercise secondary-material reassessment is active.

---

# Phase 11 — Liquid Glass + Home convergence

Home is now:

**compact personal daily metrics → server-authoritative Stories → server-authoritative chronological Following Feed**.

Completed material/navigation milestones through LG-3I remain valid. Coach material debt is intentionally deferred.

## LG-H2 Stories — complete

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

### Mobile authoring/delete — complete

Mobile PR #535 completed the owner lifecycle on top of the existing managed-media authority:

- managed-media contracts/API/parsers support `story_image` without a second uploader;
- Story image selection/preparation reuses the existing image pipeline, including pending picker-result recovery after Android activity destruction;
- unfinished unbound Story media is stored only as an account-scoped restart-safe draft containing the server asset ID and local preview URI;
- signed upload, finalize and bounded server polling reuse the existing managed-media composition;
- bounded pending/processing/review/approved/rejected/failed/deleted states are localized in the authoring surface;
- publish is enabled only for an owned `approved` `story_image` and submits its exact current `stateVersion`;
- Story creation uses deterministic asset-scoped idempotency and then revalidates the authoritative Home Story list;
- owner deletion uses the merged server endpoint and revalidates Stories after success;
- the Home Story strip always exposes a `Your story` authoring entry, including when the server list is empty;
- v1 remains image-only with no caption, text overlay, video, arbitrary URL or client-authored expiry;
- safe-area/content-driven UI, localization and source guards were added without backend/schema/release changes.

PR #535 exact validated head `8045e96c07cb2f1fac6113b56d0061cb1547f4ee` passed Mobile CI #1990: repository and changed-file line audits, TypeScript, **1560/1560 regression tests**, expanded model smoke, Expo export and Expo Doctor. It merged as `ad17cc9d8be896cf9610027a63018c07119b5b01`. No review blockers remained.

During validation, PR #535 also restored two canonical local-state decision markers accidentally removed by the preceding Markdown-only PR #534; this repaired the existing source guard rather than weakening it.

### LG-H2 definition of done

**Satisfied for the current image-only v1 source scope.** Backend lifecycle/privacy/media/viewed-state and mobile list/view/create/delete use the same strict server-authoritative contract; owner authoring reuses managed-media approval authority; exact-head CI is green; runtime Git history is recorded; no review blockers remained.

Physical-device/native-release/production evidence remains separately gated and was not performed as part of LG-H2.

## LG-H3 Steps

**Blocked.** Require a reviewed native health/activity source, dependency/permission disclosure and later separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 Feed retention/ranking

Later. Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## Active reassessment — Progress/exercise secondary material

PR #537 closed the first concrete debt found in this reassessment:

- `ExerciseDetailScreen` no longer owns a hardcoded dark palette and now consumes the active application theme through extracted adaptive styles;
- `MuscleMap` now renders its SVG/background/border/text from active semantic theme colors;
- shared `StatChip` now follows the active theme, improving secondary cards wherever the primitive is reused;
- Exercise Detail back navigation now uses the shared `LiquidGlassIconButton`;
- the inert unimplemented “More” button affordance was removed rather than exposing a false interactive control;
- media, favorites, sharing, history/progress calculations, navigation, persistence and safe-area/content-driven behavior were preserved;
- a source guard prevents hardcoded `Colors.dark` from returning to this boundary.

PR #537 exact validated head `5ee5a3dfb1cf3591168821c3b4275b26e597aca4` passed Mobile CI #1992: repository and changed-file line audits, TypeScript, full regression suite, expanded model smoke, Expo export and Expo Doctor. It merged as `279a09e4b73e067a2cb0c1d836b8da809ce0b6b1`; no review blockers remained.

Continue auditing remaining Progress/exercise secondary surfaces for actual material/responsive debt such as local legacy surface styling, duplicate controls, non-semantic colors or layout geometry. Do not create cosmetic churn when shared primitives and current architecture are already correct. If no meaningful bounded debt remains, record that conclusion and move to LG-4 Workouts.

Coach recovery scores/inputs, limitation choices, Safety lookback controls, history filters and Combined domain/result material remain explicitly deferred unless reprioritized.

## Later Phase 11 execution

1. Finish the remaining Progress/exercise secondary-material audit and only implement evidence-backed bounded packages.
2. LG-4 Workouts material convergence.
3. LG-5 bounded elevated chrome/motion.
4. LG-6 visual QA/stabilization; physical evidence only when separately authorized.
5. LG-H3 Steps only after native capability review and authorization.

---

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. Responsive/Liquid Glass packages must also follow their canonical architecture documents. CI does not substitute for physical-device evidence.

Backend runtime/source work must follow backend `AGENTS.md`: routes → services → repositories → DB, strict validation, authenticated ownership, fail-closed privacy, forward-safe migration source, repository line limits, lint/format/build/tests and relevant PostgreSQL CI. Source work must not deploy or execute production migrations.

Docs-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs-only rewrites must preserve or explicitly update those asserted contracts rather than relying on workflow path filters.
