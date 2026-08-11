# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-11

Architecture contracts:

- `docs/architecture/liquid-glass-ui.md`
- `docs/architecture/responsive-mobile-ui.md`

## Objective

Converge Smart Fitness on Liquid Glass while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, Social authority/privacy and backend contracts.

Home remains a social-first hybrid: compact personal metrics → server-authoritative Stories → chronological Following Feed.

## Status

- Phase 10 responsive source hardening: complete for current source/CI scope.
- LG-1 foundation through LG-3I approved packages: complete.
- LG-H1 social-first Home: complete.
- LG-H2 Stories: complete for current image-only v1 source scope.
- Progress/exercise secondary-material reassessment: complete for current active source scope.
- **LG-4 Workouts material convergence: source-complete.**
- **LG-5 QA and bounded polish: complete for the currently authorized source/CI scope with 38 demonstrated-defect runtime batches merged.**
- Current runtime mobile `main`: `a8b2c4530cbdc944e7a3821cdc7926296fb78f18` (merge PR #613).
- Latest exact validated runtime head: PR #613 `fae10aa93a1d26279eabe9d56eaf1efeb7103974`; Mobile CI #2170 run `31476083264` fully green before merge.
- Coach product/material expansion remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- Source/CI completion does not imply physical-device, native-release, backend deployment, provider or production activation evidence.

## LG-5 — source/CI closure

LG-5 was validation-first throughout: runtime work required a concrete reproduced or source-demonstrated defect, while compliant surfaces were recorded as no-change evidence.

The first 34 runtime batches run through PR #607. Their detailed history remains in Git and earlier checkpoints. The final four packages complete the current source boundary.

### Batch 35 — PR #610: New Routine virtualization

The New Routine arbitrary exercise collection uses the intended virtualized owner with stable exercise identity, preserving routine creation, keyboard/safe-area behavior and picker flows.

Exact head `2fc3a0aba57648d7940cd928b441eefd0b6c531a`; Mobile CI #2161 run `31473376632`; merge `ec380756151464872304690c0a571a90650a8ef9`.

### Batch 36 — PR #611: Program Workout Editor virtualization

The Program Workout Editor arbitrary draft-exercise collection uses the intended virtualized owner with stable IDs while preserving edit/save/move/duplicate/delete and keyboard behavior.

Exact head `9dbc7b89fa4a69f719427af76d1749c2d46d2def`; Mobile CI #2162 run `31473525715`; merge `2ca233420b209401279b6ced832e3c7364967cf0`.

### Batch 37 — PR #614: Safety Gate responsive/accessibility hardening

The live pre-workout Safety Gate gives its two review metrics equal shrinkable cells so long EN/RU labels remain inside narrow cards. Recovery Check-in and Limitations actions expose button semantics and shrinkable centered labels while preserving 44 pt targets, review decisions, acknowledgement behavior, virtualization and safe-area ownership.

Exact head `ca2a9277cac376b52d6332798ce3cf6ebadadd11`; Mobile CI #2167 run `31474957650`; merge `d0f44018ea457a4acc2d33bc69fb608621b3fbe5`.

### Batch 38 — PR #613: Program Editor interaction materials

Program Workout Picker choices/rows, workout-builder exercise actions and the collapsible builder header use adaptive Liquid Glass control/accent/destructive/disabled material states instead of generic opacity-only feedback. Focused source guards protect the material-state contract while picker/editor virtualization, stable IDs, keyboard/safe-area behavior and create/edit/attach flows remain unchanged.

The branch was refreshed onto the already merged #614 before final validation so the exact tested head was mergeable against current main. Exact head `fae10aa93a1d26279eabe9d56eaf1efeb7103974`; Mobile CI #2170 run `31476083264`; merge `a8b2c4530cbdc944e7a3821cdc7926296fb78f18`.

## Rejected speculative package

PR #612 is not an LG-5 runtime batch. An initial audit proposed virtualizing Program Detail/Builder program-day rows, but deeper inspection confirmed those collections are semantically bounded by the seven-day `WeekdayKey` model. The branch was reset instead of merging a refactor without a scalability defect.

## Final no-change evidence

The post-#611 sweep rechecked remaining live Workouts boundaries against responsive, theme/material, accessibility, localization, safe-area, stable-identity and virtualization contracts.

- Workout History list/detail already owns suitable `FlatList` boundaries, stable IDs, read-only completed-history behavior and responsive metric layout.
- Workout Template Detail already owns the intended arbitrary-exercise virtualization and stable IDs.
- Program Detail/Builder day collections remain bounded by the seven-day domain.
- Existing source guards cover Hub, Program Detail, creation/editor stack, picker responsiveness, Exercise Library, History Detail, Template Detail, Active Session exercise virtualization plus header/footer/overflow/finish/RPE/replacement flows.
- `QuickActionsCard` label-as-key remains candidate-only until live usage is established; do not modify legacy/candidate code without evidence.
- Previously audited Home/Profile/Coach/Nutrition/Settings controls remain no-change evidence unless a new mismatch is reproduced.

Future concrete regressions remain valid bounded fixes. They do not create a new autonomous migration phase.

## LG-5 validation matrix outcome

Current source/CI inspection covers the established contracts for:

- light / dark / system appearance ownership;
- narrow-width/short-height source behavior and long EN/RU copy;
- keyboard-aware creation/edit flows;
- safe-area ownership;
- populated / empty / loading / error / disabled state contracts;
- long collections and stable-identity virtualization boundaries;
- elevated material/fallback ownership and direct-interaction pressed states;
- Active Session set/RPE/replacement/finish/discard boundaries;
- workout create/edit/save/program attachment;
- completed-history list/detail navigation and read-only review.

This is source/CI evidence only. Physical-device, large-text runtime, Android system-navigation, standalone/native release and second-device/offline restart evidence remain separate authorization-gated work.

## Execution state after LG-5

There is no broad/pre-authorized Liquid Glass source package after batch 38. Do not create `LG-6`/`LG-7` merely to continue code churn; those phases do not exist in the canonical roadmap.

A source change is now appropriate only when:

1. a concrete regression is reproduced or source-demonstrated; or
2. the user explicitly prioritizes a new reviewed product/architecture scope.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention/ranking

**Later.** Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred material

Coach recovery/input/lookback/history/domain product/material expansion remains deferred unless explicitly reprioritized. Bounded fixes to demonstrated regressions on existing live Coach surfaces do not reopen that product phase.

## CI / activation boundary

Routine authoritative Mobile CI remains on Hermes under PR #562/#563/#564 policy. Backend PR #215 is separate infrastructure work and must pass all required exact-head Hermes workflows before merge.

Source/CI completion never authorizes OTA/EAS publication, native build/install, backend deployment/migrations, provider activation, production data/credentials/DNS changes, native-health activation or store submission.
