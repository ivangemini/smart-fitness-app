# Smart Fitness — Implementation Plan

Updated: 2026-08-09

This file is the **canonical forward roadmap**. Detailed current evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass execution belongs in `docs/roadmap/liquid-glass.md`.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime mobile `main`: `c14a173a35636853d3d1bfacb5daf64f85f301c4`.
- Latest runtime merge: PR #542 — virtualized, safe-area-aware replacement exercise picker with shared Liquid Glass shell.
- PR #542 exact validated head: `bc8c0d50070615ab3694878b57c8a0484734f52e`; Mobile CI #2003 passed the full required gate.
- Backend Stories foundation: PR #214 merged as `2339f6ce…`; exact validated head `9a5af3aba1f4470f261eb9ea00a6e2f2f8979bfe`.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **Progress/exercise secondary-material reassessment is complete for the current active source scope.** PR #537 closed the concrete active debt found; remaining legacy/deferred findings are not active product surfaces and are not authorization for churn.
- **LG-4 Workouts material convergence is active.** Four bounded packages are merged: hub interactive chrome (#539), responsive active-session header (#540), shared active-session footer actions (#541), and virtualized replacement exercise picker (#542).
- Active product/source priority: **continue evidence-backed LG-4 Workouts material/responsive convergence while preserving the tuned workout set table and all domain/persistence behavior.**
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
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope; new responsive regressions discovered during Phase 11 remain valid bounded fixes.
- **Phase 11 Liquid Glass + Home convergence:** active; LG-H2 Stories and Progress/exercise reassessment are complete, LG-4 Workouts is active.

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

## Progress/exercise secondary material — reassessment complete

PR #537 closed the concrete active debt found during the post-Stories reassessment:

- `ExerciseDetailScreen` no longer owns a hardcoded dark palette and now consumes the active application theme through extracted adaptive styles;
- `MuscleMap` renders its SVG/background/border/text from active semantic theme colors;
- shared `StatChip` follows the active theme wherever reused;
- Exercise Detail back navigation uses shared `LiquidGlassIconButton`;
- the inert unimplemented “More” button affordance was removed rather than exposing a false interactive control;
- media, favorites, sharing, history/progress calculations, navigation, persistence and safe-area/content-driven behavior were preserved;
- a source guard prevents hardcoded `Colors.dark` from returning to this boundary.

PR #537 exact validated head `5ee5a3dfb1cf3591168821c3b4275b26e597aca4` passed Mobile CI #1992 and merged as `279a09e4b73e067a2cb0c1d836b8da809ce0b6b1`.

The subsequent broader audit found no additional meaningful bounded debt in active Progress/exercise surfaces. Remaining hardcoded-dark findings were inactive legacy primitives or explicitly deferred Coach/planning surfaces, so no cosmetic runtime churn was created.

## LG-4 Workouts — active

Four bounded packages are complete:

1. **Workouts hub interactive chrome — PR #539.** Search uses shared `LiquidGlassIconButton`; sticky Start/Resume uses shared `PrimaryButton` while preserving tab-bar-safe clearance; Create Program shell/actions use shared `AppCard`/buttons. Exact head `0190fdf6aae13ef7f2ab2682a7e9ee7277e4ef0e`, Mobile CI #1997, merge `3f336794fec980ddbcf5d2c26572f054ecb59a6a`.
2. **Active-session responsive header — PR #540.** Removed magic `paddingBottom: 52` / `marginTop: 48`, moved back/overflow to shared glass icon controls, and made stats/timer spacing content-driven while preserving Finish gating and the set table. Exact head `63163f0049024a5f359035c3f1e0114f31f36fbb`, Mobile CI #1999, merge `9d934e755d09af6270807b7b797baff4fe2b3024`.
3. **Active-session footer actions — PR #541.** Add Exercises/Test GIF now use shared primary/secondary controls; fixed `marginTop: 38` and footer-only duplicate button styles were removed without changing the empty-workout card. Exact head `ffeb006fb812ce67061974ed3b8b6676066bf2b8`, Mobile CI #2001, merge `2b4ec40bcc78dbabb06fb1af591d17c9b07c3fb5`.
4. **Replacement exercise picker — PR #542.** Replaced `ScrollView + slice(0,100).map` with bounded `FlatList`, removed the artificial 100-item cap, added bottom-safe-area ownership, and moved the sheet/close chrome to shared Liquid Glass primitives. Exact head `bc8c0d50070615ab3694878b57c8a0484734f52e`, Mobile CI #2003, merge `c14a173a35636853d3d1bfacb5daf64f85f301c4`.

Continue auditing the remaining active Workouts surfaces for evidence-backed material/responsive debt. Current candidates include active-session overflow/RPE sheets and workout-creation surfaces that still own local/hardcoded material. Preserve the carefully tuned `Set / Previous / KG / Reps / RPE` table geometry unless a separately proven defect requires change.

## LG-H3 Steps

**Blocked.** Require a reviewed native health/activity source, dependency/permission disclosure and later separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 Feed retention/ranking

Later. Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## Later Phase 11 execution

1. Continue LG-4 Workouts material convergence with bounded evidence-backed packages.
2. LG-5 bounded elevated chrome/motion.
3. LG-6 visual QA/stabilization; physical evidence only when separately authorized.
4. LG-H3 Steps only after native capability review and authorization.

---

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. Responsive/Liquid Glass packages must also follow their canonical architecture documents. CI does not substitute for physical-device evidence.

Backend runtime/source work must follow backend `AGENTS.md`: routes → services → repositories → DB, strict validation, authenticated ownership, fail-closed privacy, forward-safe migration source, repository line limits, lint/format/build/tests and relevant PostgreSQL CI. Source work must not deploy or execute production migrations.

Docs-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs-only rewrites must preserve or explicitly update those asserted contracts rather than relying on workflow path filters.
