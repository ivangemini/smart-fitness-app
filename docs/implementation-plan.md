# Smart Fitness — Implementation Plan

Updated: 2026-08-10

This file is the **canonical forward roadmap**. Detailed current evidence belongs in `docs/current-status.md` and `docs/handoffs/latest.md`; focused Liquid Glass execution belongs in `docs/roadmap/liquid-glass.md`.

## Current verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime mobile `main`: `fbdba5e64445b94081da6c4403858b34d7af7c30`.
- Latest runtime merge: PR #557 — editable workout history moved to virtualized `SectionList`, active semantic theme and stack-safe bottom clearance while preserving edit/save/delete behavior.
- PR #557 exact validated head: `7c888c65bf5721fcf705888638d080937e979d17`; Mobile CI #2034 passed the full required gate before merge.
- Backend Stories foundation remains the last recorded backend baseline: PR #214 merged as `2339f6ce…`, exact validated head `9a5af3aba1f4470f261eb9ea00a6e2f2f8979bfe`. LG-4 did not modify or revalidate backend runtime/deployment state.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **Progress/exercise secondary-material reassessment is complete for the current active source scope.**
- **LG-4 Workouts source convergence is complete through PR #557.**
- Active product/source priority: **LG-5 QA and bounded polish, validation-first. Do not restart broad source migration unless QA identifies a concrete defect.**
- **Coach material is deferred by explicit product priority.**

Release readiness remains lower than source completeness because physical-device/native-release/production/provider evidence is separately gated.

## Operating rules

- Re-check exact mobile/backend `main`, open PRs, `AGENTS.md`, this plan, current status, handoff and focused roadmaps before new work.
- Prefer bounded coherent packages over cosmetic churn.
- Preserve routes, IDs, private persistence/sync contracts, calculations, auth/session semantics, workout/program lifecycle, Social authority/privacy and backend API contracts unless a task explicitly changes them.
- Follow `docs/architecture/responsive-mobile-ui.md` and `docs/architecture/liquid-glass-ui.md`.
- Use shared navigation/safe-area geometry and material primitives; avoid screen-local magic clearances and repeated native blur.
- Local AsyncStorage remains the active storage strategy; architecture-only design options are not implementation authorization. Reviewed decision evidence: `docs/architecture/local-state-performance-decision.md`. There is no remaining approved autonomous source-refactor phase. In equivalent explicit terms, **no separate autonomous source-refactor phase is currently authorized**.
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
- **Phase 10 Responsive Mobile UI Hardening:** complete for current source/CI scope; concrete responsive regressions found during later work remain valid bounded fixes.
- **Phase 11 Liquid Glass + Home convergence:** source migration through LG-4 complete for the current approved scope; **LG-5 QA and bounded polish is active**.

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

PR #535 exact validated head `8045e96c07cb2f1fac6113b56d0061cb1547f4ee` passed Mobile CI #1990 and merged as `ad17cc9d8be896cf9610027a63018c07119b5b01`.

### LG-H2 definition of done

**Satisfied for the current image-only v1 source scope.** Backend lifecycle/privacy/media/viewed-state and mobile list/view/create/delete use the same strict server-authoritative contract; owner authoring reuses managed-media approval authority; exact-head CI is green; runtime Git history is recorded; no review blockers remained.

Physical-device/native-release/production evidence remains separately gated and was not performed as part of LG-H2.

## Progress/exercise secondary material — reassessment complete

PR #537 closed the concrete active debt found during the post-Stories reassessment:

- `ExerciseDetailScreen` consumes the active application theme through adaptive styles instead of hardcoded `Colors.dark`;
- `MuscleMap` renders SVG/background/border/text from active semantic theme colors;
- shared `StatChip` follows the active theme wherever reused;
- Exercise Detail back navigation uses shared `LiquidGlassIconButton`;
- the inert unimplemented More affordance was removed rather than exposing a false interactive control;
- media, favorites, sharing, history/progress calculations, navigation, persistence and safe-area/content-driven behavior were preserved;
- a source guard prevents hardcoded dark styling from returning to the boundary.

PR #537 exact validated head `5ee5a3dfb1cf3591168821c3b4275b26e597aca4` passed Mobile CI #1992 and merged as `279a09e4b73e067a2cb0c1d836b8da809ce0b6b1`.

The subsequent audit found no additional meaningful bounded debt in active Progress/exercise surfaces outside later Workouts packages and explicitly deferred Coach/planning surfaces.

## LG-4 Workouts — source convergence complete

LG-4 was implemented as bounded PRs #539–#557 rather than one broad rewrite.

### Hub / Active Session / Finish

- **#539:** Workouts hub Search, sticky Start/Resume and Create Program shell/actions moved to shared material.
- **#540:** Active Session header became content-driven; magic `paddingBottom: 52` and timer `marginTop: 48` were removed; Back/overflow moved to shared glass controls.
- **#541:** Active Session footer Add Exercises/Test GIF moved to shared primary/secondary controls; fixed footer-only positioning was removed.
- **#545:** RPE sheet became adaptive with wrapping values and >=44 px targets while preserving the 6–10 value domain and selection lifecycle.
- **#550:** Finish Share/Save moved to shared controls; Resume and clear-name accessibility were hardened while measured footer and completion lifecycle were preserved.
- **#555:** Exercise/Workout overflow sheets moved to shared elevated material with semantic overlay; missing-session Back moved to a shared secondary action.

### Pickers / workout creation / program surfaces

- **#542:** replacement exercise picker moved from `ScrollView + slice(0,100).map` to bounded `FlatList`; the artificial cap was removed and safe-area/shared elevated material ownership added.
- **#544:** workout creation picker/editor/builder boundary became active-theme adaptive without changing draft/save/reorder semantics.
- **#546:** builder exercise Move/Duplicate/Delete actions were raised to the 44 px interaction minimum.
- **#548:** New Routine picker retained `FlatList` virtualization but removed the artificial 100-item cap and gained bottom-safe-area/shared elevated material ownership.
- **#549:** New Routine root Stack screen stopped reserving floating-tab clearance.
- **#552:** Program Detail Back/More moved to shared glass controls and row Play/Remove actions gained full 44 px targets.
- **#553:** New Routine exercise action menu moved from an opaque local panel to shared elevated material.
- **#554:** Workout Builder root Stack screen stopped reserving floating-tab clearance and Start Next Workout was raised to >=44 px.

### Detail / library / safety / history

- **#547:** Workout Template Detail replaced 34 px header controls, absolute title and guessed `+116` footer clearance with shared 44 px controls, flex title, measured footer and shared Start action.
- **#551:** Exercise Library Back/Add moved to shared controls; Details, filters and Retry were raised to usable targets while `FlatList` and measured footer were preserved.
- **#556:** Workout History list/detail and Workout Safety Gate Back/filter controls were brought to shared/44 px contracts while preserving filtering and safety acknowledgement semantics.
- **#557:** direct editable workout-history route moved from `ScrollView + map` to `SectionList`, off hardcoded `Colors.dark`, and off floating-tab/guessed `+120` bottom clearance while preserving edit/save/delete/unit-conversion behavior.

### LG-4 definition of done

**Satisfied for the current source/CI scope.** The final runtime package, PR #557, exact head `7c888c65bf5721fcf705888638d080937e979d17`, passed Mobile CI #2034: repository and changed-file line audits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. It merged as `fbdba5e64445b94081da6c4403858b34d7af7c30`.

Preserved throughout LG-4:

- tuned `Set / Previous / weight / reps / RPE` table semantics and active-session persistence;
- RPE value domain and selection lifecycle;
- workout/program draft, save, reorder, attach, favorite and delete semantics;
- completed-history retention and editable-history save/delete behavior;
- safety/recovery decision and acknowledgement behavior;
- routes, synchronization schemas and backend contracts.

No physical-device/native-release/production evidence is implied by source/CI completion.

## LG-5 — QA and bounded polish active

LG-5 is validation-first. Do not create broad migration packages merely to continue changing source. Create runtime work only for a demonstrated defect.

Required validation matrix:

- light / dark / system appearance;
- narrow phone width and short phone height;
- modern iPhone safe areas and Android system navigation insets;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long exercise/history/program collections;
- elevated material and blur/fallback behavior;
- Active Session set entry, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history read/edit/delete flows.

Source/CI validation does not replace physical-device evidence. Physical/native proof is collected only when separately authorized.

## LG-H3 Steps

**Blocked.** Require a reviewed native health/activity source, dependency/permission disclosure and later separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 Feed retention/ranking

Later. Preserve chronological Following semantics until a separately reviewed ranking contract exists.

## Later Phase 11 execution

1. Run LG-5 source/CI QA and fix only concrete defects it surfaces.
2. Collect physical-device evidence only when separately authorized.
3. Continue deferred Coach/material work only when reprioritized.
4. LG-H3 Steps only after native capability review and authorization.

---

# Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository and changed-file line limits, TypeScript, full regression, expanded model smoke, Expo export and Expo Doctor. Responsive/Liquid Glass packages must also follow their canonical architecture documents. CI does not substitute for physical-device evidence.

Backend runtime/source work must follow backend `AGENTS.md`: routes → services → repositories → DB, strict validation, authenticated ownership, fail-closed privacy, forward-safe migration source, repository line limits, lint/format/build/tests and relevant PostgreSQL CI. Source work must not deploy or execute production migrations.

Docs-only synchronization uses diff/ancestry verification; workflows may intentionally ignore Markdown-only changes. Because source tests may assert canonical documentation markers, docs-only rewrites must preserve or explicitly update those asserted contracts rather than relying on workflow path filters.
