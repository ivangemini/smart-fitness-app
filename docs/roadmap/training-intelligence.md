# Training Intelligence, Body Composition & Workout Assistant Roadmap

Updated: 2026-08-22

This roadmap defines the reviewed work for Exercise Intelligence, Personal Training Intelligence, Progress Photos / Body Composition, and the active-workout assistance layer. Existing Coach, Progress, Workouts, privacy, sync and safety authority remain in force.

## Product objective

Help the user answer four questions without duplicate authority or false precision:

1. What muscle and movement does this exercise train?
2. How is training performance changing over time?
3. How is physique/body-composition progress changing visually and through stored measurements?
4. What should I know while performing the current workout without turning the session screen into a dashboard?

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

The richer metadata originally left requirement/data-authority-dependent after #803 is completed and merged through PR #807 without creating a new roadmap phase.

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

#807 validation/merge authority:

- code head `32221db92dcaae78bb38b96ad1ff358cea0877d5` passed Mobile CI #2731;
- final closure head `da4064e6c4e805a4395cce3fb84ce55fddc21e96` passed Mobile CI #2732;
- #807 merged with exact expected head into `main` as `371e1cdfc09aeffd93f4664cabbb4a777f19e1b0`.

P19 source/CI completion plus #807 therefore covers the requested SVG/muscle layer and the reviewed movement/substitution/technique/ROM/fatigue layer while preserving fail-closed behavior.

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

## Phase 21 — Workout Assistant

Approved product direction: make the active workout faster and more informative without adding a dense dashboard or an assistant that interrupts after every set.

Source/CI status: **P21-A through P21-E are implemented on mobile PR #810.** The validated code head is `2b4afbab5c071fa7d692b11c59fc651860bd3565`; exact live CI/PR state must still be read from GitHub. Backend sync dependency PR #332 is merged to backend `main` as `b5a054e49e795a75f19c16ba85f507396e4598b6`. Production backend deployment remains a separate release gate before mobile schema-v2 behavior may ship.

### Permanent interaction rules

- preserve the compact primary set table rather than adding large intelligence cards;
- use progressive disclosure for secondary detail;
- deterministic/reviewed facts precede Coach explanation;
- a suggestion is not a mutation: workout/program changes require explicit user action;
- normal execution should stay quiet; contextual intervention is reserved for meaningful evidence;
- do not add a plate calculator to the reviewed scope;
- do not introduce a universal recovery/readiness score.

### P21-A — Smart Previous + Today’s Target

Implemented:

- Previous remains directly aligned to each working set;
- previous load × reps and stored actual RPE are shown when available;
- exact confirmed `Workout.prescription` is the only authority for prescribed target load/reps/RPE;
- canonical template `targetReps` is a reps-only fallback when no valid prescribed reps exist;
- no target load is inferred from previous history merely because a prior load exists;
- exact `exerciseId` matching only; no runtime name-based target matching;
- target load/reps remain compact read-only hints and do not silently populate or complete a set.

### P21-B — Automatic Rest Timer

Implemented:

- starts only after an explicit set-completion action;
- uses existing exercise-level `restSeconds`; no invented default;
- real-clock countdown preserves elapsed background time;
- pause/resume, ±15 seconds and skip are explicit controls;
- timer state is transient UI state and remains separate from workout-set truth;
- no Live Activity / Dynamic Island claim is made by source support.

### P21-C — Warm-up Sets

Implemented:

- deterministic proposal derives only from an explicit prescribed working load;
- user can Add or Skip and can edit resulting rows through normal set controls;
- warm-up sets persist explicitly as `setType: warmup`;
- warm-up rows do not shift working-set Previous/Today indexing;
- warm-up sets are excluded from live working totals, prior-set guidance, RPE prompting, training-intelligence PR/e1RM/volume calculations, exercise progress series and weekly muscle-volume analytics;
- no working load is guessed when prescription authority is absent.

### P21-D — Set Types + Supersets

Implemented contract:

- durable set types: `working | warmup | backoff | drop | amrap`;
- durable optional `supersetId`;
- compact row semantics and explicit set actions;
- legacy sessions remain workout-sync schema v1 when no new semantics are present;
- sessions using set semantics use additive workout-sync schema v2;
- v1 envelopes carrying v2-only semantics fail closed instead of silently stripping fields;
- backend #332 validates/materializes v2 while preserving v1 compatibility and requires no database migration.

Release boundary: backend #332 source is merged, but mobile v2 must not ship until production `api.peptonio.com` is deliberately redeployed with the merged backend source and verified.

### P21-E — Rare Contextual Adjustment

Implemented, deliberately bounded:

- no suggestion after every set;
- suggestion appears only when actual performance materially diverges from an exact aligned prescription row under deterministic RPE/reps thresholds;
- missing/insufficient evidence fails closed;
- Apply / Ignore are explicit;
- remaining sets are never rewritten silently;
- Apply preserves per-set prescription shape through a bounded load multiplier;
- recovery-aware adaptation remains the responsibility of the dedicated future adaptive/recovery engine.

## Approved expansion queue after the Workout Assistant foundation

These directions are approved for roadmap planning but remain separate implementation packages so authority, persistence, native and UX boundaries can be reviewed independently.

### Adaptive Program + Recovery Engine

Build two linked deterministic layers rather than a free-form Coach decision:

1. **Training Progression Engine** — performance history, load/reps/RPE, e1RM, progression/regression, plateau, recent training load and program context.
2. **Recovery Modifier** — local muscle recovery plus systemic evidence such as recovery check-ins and, when legitimately available, sleep/activity/resting-HR/HRV evidence.

Additional context may include activity/cardio, nutrition context, schedule and evidence confidence. Missing signals remain unknown. Recovery is muscle-specific where possible and systemic where appropriate; it is not collapsed into a pseudo-precise universal score.

Final proposals remain explicit suggestions. Coach may explain them but does not become the deterministic calculation authority and does not silently mutate a program.

### Exercise Preferences + Smart Replace

- user preference states such as prefer / neutral / avoid;
- explicit reasons such as equipment, preference, discomfort or temporary exclusion;
- combine user preference with existing reviewed substitutions;
- no claim that two exercises are physiologically identical;
- replacement remains explicit user action.

### Weekly Training Review

One compact weekly review over existing deterministic authorities:

- completed versus planned workouts;
- volume/performance direction and PRs;
- muscle exposure/gaps;
- meaningful changes only, with evidence drill-down;
- optional Coach explanation over the deterministic review.

### Apple Health / Apple Watch

Future native workstream for reviewed, permission-bounded health/activity inputs and a focused workout companion. This requires signed native builds and physical-device evidence; source/OTA completion alone is insufficient.

### Progress Stories / Share Cards

User-initiated share artifacts for selected non-sensitive progress facts. Progress photos are included only when the user explicitly selects them for the share action. Private progress evidence is never silently published.

### Trainer / Coach Layer

Future server-authoritative collaboration layer for explicit coach/client relationships, scoped data access, program assignment and feedback. Marketplace/payments are not implied and require separate reviewed contracts.

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
2. Deferred reviewed Exercise Intelligence metadata — merged in #807; merge checkpoint `371e1cdfc09aeffd93f4664cabbb4a777f19e1b0`.
3. P20-A — merged in #804.
4. P20-B — merged in #805.
5. P20-C — merged in #806; Phase 20 source/CI-complete.
6. P21-A through P21-E — mobile implementation complete on #810; final source merge/release remains gated by exact-head validation and backend production deployment sequencing.
7. Backend P21-D dependency #332 — merged as `b5a054e49e795a75f19c16ba85f507396e4598b6`; production deployment is not yet implied by merge.
8. P20 physical-device validation remains a separate release-evidence workstream.

Phase 21 is an explicitly reviewed product requirement dated 2026-08-22. Do not invent P21-F or Phase 22 merely to continue development; use the approved expansion queue above or require another reviewed requirement.
