# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-10

Architecture contracts:
- `docs/architecture/liquid-glass-ui.md`
- `docs/architecture/responsive-mobile-ui.md`

## Objective

Converge Smart Fitness on Liquid Glass while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, Social authority/privacy and backend contracts.

Home remains a social-first hybrid: compact personal metrics → server-authoritative Stories → chronological Following Feed.

## Status

- Phase 10 responsive source hardening: complete for current source scope.
- LG-1 foundation through LG-3I approved packages: complete.
- LG-H1 social-first Home: complete.
- LG-H2 Stories: complete for the current image-only v1 source scope.
- Progress/exercise secondary-material reassessment: complete for current active source scope.
- **LG-4 Workouts material convergence: source-complete on `main` through PR #557.**
- **LG-5 QA and bounded polish: active.**
- Coach material remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- No OTA/EAS publication, native install/build, backend deployment, migration execution, or physical-device proof is implied by source/CI completion.

## LG-H2 — Stories complete

The merged backend owns the image-only v1 lifecycle/privacy contract: approved owned `story_image`, authenticated/idempotent create, server-derived 24-hour expiry, active-only reads, owner delete, account-deletion cascade, Following/self visibility, private/block/moderation enforcement, managed-media moderation/delivery/cleanup, viewed state, bounded ordering/pagination, retention cleanup and Social export/privacy coverage.

The merged mobile surface consumes that authority with strict parsing/API errors, bounded account-scoped cache/revalidation, separate Story state, Home strip, safe-area viewer, viewed acknowledgement, managed `story_image` upload/finalize/polling reuse, restart-safe draft recovery, exact approved `stateVersion` creation, deterministic idempotency, authoritative refresh after create/delete and owner deletion.

No placeholder/demo Story data is authorized. V1 remains image-only: no caption/text overlay/video/arbitrary URL/client-authored expiry.

## Progress/exercise secondary material — reassessment complete

PR #537 closed the concrete post-Stories debt:
- Exercise Detail uses active semantic theme colors rather than hardcoded dark tokens;
- `MuscleMap` is theme-adaptive;
- shared `StatChip` is theme-adaptive across secondary cards;
- Exercise Detail back chrome uses shared `LiquidGlassIconButton`;
- the inert unimplemented More affordance was removed;
- existing media, favorites, sharing, history/progress calculations, navigation and safe-area behavior were preserved;
- source guards protect the boundary.

The follow-up audit found no additional meaningful bounded active-surface debt outside the later Workouts package, explicitly deferred Coach/planning surfaces and inactive legacy primitives.

## LG-4 — Workouts source convergence complete

LG-4 was delivered as bounded PRs #539–#557 so dense set-entry behavior, workout lifecycle and persistence were never mixed with a broad visual rewrite.

### Hub and Active Session

- PR #539: Workouts hub Search, sticky Start/Resume and Create Program shell/actions moved to shared material while preserving tabs, rows, floating-tab clearance and active-session routing.
- PR #540: SessionHeader became content-driven; magic `paddingBottom: 52` / timer `marginTop: 48` were removed and Back/overflow moved to shared glass controls.
- PR #541: visible session footer Add Exercises/Test GIF actions moved to shared controls; fixed footer-only positioning was removed.
- PR #545: RPE sheet became adaptive, wrapping values with >=44 px targets and shared elevated material while preserving the 6–10 value domain and selection lifecycle.
- PR #550: Finish Share/Save moved to shared secondary/primary controls; Resume and clear-name accessibility were hardened while measured footer and completion lifecycle were preserved.
- PR #555: Exercise/Workout overflow sheets moved to shared elevated material with semantic overlay; missing-session Back moved to a shared secondary action.

### Pickers, creation and program surfaces

- PR #542: replacement exercise picker moved from `ScrollView + slice(0,100).map` to bounded `FlatList`, removing the 100-item cap and adding safe-area/shared elevated material ownership.
- PR #544: workout creation picker/editor/builder boundary became active-theme adaptive without changing draft/save/reorder semantics.
- PR #546: builder exercise Move/Duplicate/Delete targets were raised to the 44 px minimum.
- PR #548: New Routine exercise picker kept `FlatList` virtualization but removed the artificial 100-item cap and gained safe-area/shared elevated material ownership.
- PR #549: New Routine root-stack content stopped reserving floating-tab clearance.
- PR #552: Program Detail Back/More moved to shared glass controls; row Play/Remove actions gained full 44 px targets.
- PR #553: New Routine exercise action menu moved from an opaque local panel to shared elevated material.
- PR #554: Workout Builder root-stack content stopped reserving floating-tab clearance and Start Next Workout was raised to >=44 px.

### Detail, library, safety and history surfaces

- PR #547: Workout Template Detail replaced 34 px header controls, absolute title and guessed `+116` footer clearance with shared 44 px controls, flex title, measured footer and shared Start action.
- PR #551: Exercise Library Back/Add moved to shared controls; Details, filters and Retry were raised to usable targets while FlatList and measured footer were preserved.
- PR #556: Workout History list/detail and Workout Safety Gate Back/filter controls were brought to shared/44 px contracts while preserving history filtering and safety acknowledgement semantics.
- PR #557: direct editable workout-history route moved from `ScrollView + map` to `SectionList`, off hardcoded `Colors.dark`, and off floating-tab/guessed `+120` bottom clearance while preserving edit/save/delete/unit-conversion behavior.

### LG-4 completion evidence

Every runtime package was validated on its exact PR head before merge. The final package, PR #557 (`7c888c65…`), passed Mobile CI #2034: repository line audit, changed-file line limit, TypeScript, full regression suite, expanded model smoke, Expo export and Expo Doctor. It merged as `fbdba5e6…`.

Preserved throughout LG-4:
- tuned Set / Previous / weight / reps / RPE table semantics and active-session persistence;
- RPE value domain and selection lifecycle;
- workout/program draft, save, reorder, attach and delete semantics;
- completed-history retention and editable-history save/delete semantics;
- safety/recovery decision and acknowledgement behavior;
- routes, synchronization and backend contracts.

## LG-5 — QA and bounded polish active

LG-5 is validation-first. Do not restart broad source migration unless QA identifies a concrete defect.

Validation matrix:
- light / dark / system appearance;
- narrow phone width and short phone height;
- modern iPhone safe areas and Android system navigation insets;
- increased text size and long EN/RU copy;
- keyboard-open editing states;
- populated / empty / loading / error / disabled states;
- long exercise/history/program collections;
- elevated-material and blur fallback performance;
- Active Session set-entry ergonomics, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history read/edit/delete flows.

Source/CI validation does not replace physical-device release evidence. Native build/install, OTA/EAS publish, backend deployment, production activation and credential changes remain explicitly authorization-gated.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention

Later. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain material remains deferred unless explicitly reprioritized.

## Later execution

1. Run LG-5 source/CI QA and fix only concrete defects it surfaces.
2. Collect physical-device evidence only when separately authorized.
3. Continue deferred Coach/material work only when reprioritized.
4. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent evidence-backed packages over cosmetic churn. Reuse existing adaptive material/navigation primitives instead of duplicating them. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
