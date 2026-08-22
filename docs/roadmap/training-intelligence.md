# Training Intelligence & Body Composition Roadmap

Updated: 2026-08-22

This roadmap defines the reviewed work for Exercise Intelligence, Personal Training Intelligence, and Progress Photos / Body Composition. Existing Coach, Progress, Workouts, privacy, sync and safety authority remain in force.

## Product objective

Help the user answer three questions without duplicate authority or false precision:

1. What muscle and movement does this exercise train?
2. How is training performance changing over time?
3. How is physique/body-composition progress changing visually and through stored measurements?

## Phase 19 — Exercise + Training Intelligence

P19-A through P19-D were implemented and merged through PR #803 for the reviewed mobile source/CI scope.

Stable Phase 19 authority includes:

- one canonical muscle taxonomy and reusable local SVG anatomy authority;
- exact/fail-closed muscle mapping, interactive muscle filtering, detail drill-downs and Progress heatmaps;
- deterministic completed-session analytics under explicit 7/30/90-day windows;
- explicit load/reps/e1RM/session-volume PR types;
- `training-intelligence-v1` deterministic progression/plateau/regression/volume/gap findings with exact evidence;
- no universal readiness score, hidden state mutation or model-owned deterministic finding authority.

### Reviewed Exercise Intelligence completion

The richer metadata originally left requirement/data-authority-dependent after #803 is completed separately in PR #807 without creating a new roadmap phase.

`exercise-intelligence-v1` is a reviewed static authority for all 15 canonical local exercises and provides:

- movement pattern;
- bilingual EN/RU technique cues;
- bilingual EN/RU common errors;
- controlled range-of-motion guidance;
- qualitative `low` / `moderate` / `high` fatigue cost;
- reviewed substitution targets plus explicit rationale;
- read-only substitution navigation from Exercise Detail.

Safety and authority boundaries:

- unknown or remote-only exercise IDs return no reviewed intelligence;
- an OSS ExerciseDB record receives reviewed intelligence only when existing normalization reuses a reviewed canonical local exercise identity;
- do not infer movement pattern, substitutions, technique, ROM or fatigue cost from exercise names, body-part labels or muscle labels at runtime;
- fatigue cost is qualitative programming guidance, not a measured physiological/readiness value;
- substitutions are reviewed alternatives, not exact-equivalence claims and never automatically modify a workout.

P19 source/CI completion plus #807 therefore covers the originally requested SVG/muscle layer and the reviewed movement/substitution/technique/ROM/fatigue layer while preserving fail-closed behavior.

## Phase 20 — Progress Photos / Body Composition

### P20-A — Standardized private progress photos

Implemented and merged through PR #804:

- private account-owned front/side/back photos;
- camera and photo-library input with repeatable pose/framing/lighting guidance;
- explicit added-at timestamp identity;
- re-encoding before app-owned persistence so imported EXIF/location metadata is not copied;
- deterministic account-owned local document storage and strict metadata parsing;
- durable per-photo deletion recovery and account cleanup;
- virtualized history, privacy inventory and blocked export-contract coverage;
- no cloud/provider/social upload and no photo-derived body-fat estimate.

### P20-B — Visual comparison

Implemented and merged through PR #805:

- deterministic same-pose Before/After selection;
- strict chronological validation and fail-closed invalid states;
- non-cropping side-by-side rendering;
- 50/50 ghost overlay only for reviewed 3:4 aspect tolerance;
- overlay explicitly remains a visual aid, not registration or measurement;
- visible date and camera/library source identity;
- nearby stored weight (±7 days) and canonical waist length (±14 days) as separate evidence;
- malformed/non-length waist values fail closed;
- no comparison persistence, AI vision, photo-derived body-fat estimate or hidden mutation.

### P20-C — Body-composition progress surface

Implemented and merged through PR #806; merge commit `6e287c64d4fcdcd604e78de6ae911510ddf604bb`:

- read-only 30/90-day body-composition view under one explicit `endAt`/period boundary;
- existing `getWeightAnalytics` remains weight-summary authority;
- existing `getWeightTrendEntries` remains weight-trend selection/dedup authority;
- existing `buildBodyMeasurementProgressAnalytics` remains measurement-series authority;
- canonical waist and other stored measurements remain user-entered evidence;
- stored body-fat remains a stored measurement and is never relabeled as a photo estimate;
- private ready-photo timeline remains period-bounded with pose/date/source identity;
- no new persistence, sync, provider upload, AI vision or photo-derived body-fat estimate.

Phase 20 is source/CI-complete for the reviewed scope through #806.

## Physical-device release evidence

Source/CI closure does not satisfy native photo validation. The exact checklist is `docs/qa/progress-photo-device-validation.md`.

Still required on the intended signed iPhone build:

- P20-A camera permission/capture/import/persistence/delete/account-cleanup behavior;
- P20-B side-by-side/overlay rendering, fail-closed aspect behavior and visual-quality evidence.

A prepared checklist is not evidence of a completed device run.

## Shared constraints

- Existing data ownership, account deletion/export and sync boundaries remain authoritative.
- No hidden mutation of workouts, nutrition, goals, Labs, recovery or safety state.
- Do not create a second Coach, storage, taxonomy or calculation authority.
- Deterministic/reviewed authority precedes model explanation.
- Progress photos remain private by default and are not silently uploaded.
- User-entered measurements and visual evidence remain explicitly distinct.
- Do not present photo-estimated body-fat percentage as exact or measurement-grade truth.

## Current execution state

1. P19-A through P19-D — merged in #803.
2. P20-A — merged in #804.
3. P20-B — merged in #805.
4. P20-C — merged in #806; Phase 20 source/CI-complete.
5. Deferred reviewed Exercise Intelligence metadata — implemented in #807; code head `32221db92dcaae78bb38b96ad1ff358cea0877d5`, with Mobile CI #2731 as code-head validation authority and final closure-head CI/merge history as final authority.
6. P20 physical-device validation remains a separate release-evidence workstream.

There is no approved P20-D or Phase 21. Do not invent one merely to continue development.
