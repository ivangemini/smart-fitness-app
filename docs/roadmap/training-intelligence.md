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

P19-A through P19-D were implemented and merged through PR #803. The reviewed Exercise Intelligence completion was merged through PR #807.

Stable authority includes:

- one canonical muscle taxonomy and reusable local SVG anatomy authority;
- exact/fail-closed muscle mapping, interactive muscle filtering, detail drill-downs and Progress heatmaps;
- deterministic completed-session analytics under explicit 7/30/90-day windows;
- explicit load/reps/e1RM/session-volume PR types;
- `training-intelligence-v1` deterministic progression/plateau/regression/volume/gap findings with exact evidence;
- reviewed `exercise-intelligence-v1` metadata for all 15 canonical local exercises;
- movement pattern, bilingual EN/RU technique cues/common errors, controlled ROM guidance, qualitative fatigue cost and reviewed substitutions;
- no universal readiness score, hidden state mutation or model-owned deterministic finding authority.

Unknown or remote-only exercise IDs fail closed. Runtime names/body-part/muscle labels are not authority for reviewed metadata.

Validation checkpoints:

- #807 code head `32221db92dcaae78bb38b96ad1ff358cea0877d5` passed Mobile CI #2731;
- #807 closure head `da4064e6c4e805a4395cce3fb84ce55fddc21e96` passed Mobile CI #2732;
- #807 merged as `371e1cdfc09aeffd93f4664cabbb4a777f19e1b0`.

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
- overlay remains a visual aid, not registration or measurement;
- visible date and camera/library source identity;
- nearby stored weight (±7 days) and canonical waist length (±14 days) as separate evidence;
- malformed/non-length waist values fail closed;
- no comparison persistence, AI vision, photo-derived body-fat estimate or hidden mutation.

### P20-C — Body-composition progress surface

Implemented and merged through PR #806; merge commit `6e287c64d4fcdcd604e78de6ae911510ddf604bb`:

- read-only 30/90-day body-composition view under one explicit period boundary;
- existing weight/trend/measurement analytics remain calculation authority;
- canonical waist and other measurements remain user-entered evidence;
- stored body-fat remains stored measurement evidence, never a photo estimate;
- private ready-photo timeline remains period-bounded with pose/date/source identity;
- no new persistence, sync, provider upload, AI vision or photo-derived body-fat estimate.

Phase 20 is source/CI-complete. Physical-device evidence remains separate.

## Phase 21 — Workout Assistant

Approved product direction: make the active workout faster and more informative without adding a dense dashboard or an assistant that interrupts after every set.

### Verified source / compatibility state

- P21-A through P21-E exact PR head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068` passed Mobile CI #2806.
- Mobile PR #810 was squash-merged to `main` as `a2abde02e31b5ed1207e67835144e9359aea711e`.
- Backend sync dependency #332 was merged as `b5a054e49e795a75f19c16ba85f507396e4598b6`.
- Production backend was deployed at `8a2c539ecfbf7842bf37a02491de9f844ec83c81`, with #332 in its ancestry.
- Production verification reported backend/PostgreSQL healthy, `/health` HTTP 200 and bounded workout-session schema v1/v2 compatibility passing, including fail-closed invalid cases.

The source, backend compatibility, exact-head CI and mobile merge gates are closed. Remaining Phase 21 evidence is OTA publication confirmation plus real-device active-workout smoke.

### Permanent interaction rules

- preserve the compact primary set table rather than adding large intelligence cards;
- use progressive disclosure for secondary detail;
- deterministic/reviewed facts precede Coach explanation;
- a suggestion is not a mutation: workout/program changes require explicit user action;
- normal execution should stay quiet; contextual intervention is reserved for meaningful evidence;
- no plate calculator in the reviewed scope;
- no universal recovery/readiness score.

### P21-A — Smart Previous + Today’s Target

Implemented:

- Previous directly aligned to each working set;
- previous load × reps and stored actual RPE when available;
- exact confirmed `Workout.prescription` is the only authority for prescribed target load/reps/RPE;
- canonical template `targetReps` is a reps-only fallback;
- no inferred target load from previous history;
- exact `exerciseId` matching only;
- target hints remain read-only/non-mutating until explicit user input.

### P21-B — Automatic Rest Timer

Implemented:

- starts only after explicit set completion;
- uses existing exercise-level `restSeconds`; no invented default;
- real-clock countdown preserves elapsed background time;
- pause/resume, ±15 seconds and skip are explicit controls;
- timer state is transient UI state and separate from workout-set truth.

### P21-C — Warm-up Sets

Implemented:

- deterministic proposal derives only from explicit prescribed working load;
- user can Add or Skip and edit resulting rows normally;
- warm-ups persist as `setType: warmup`;
- warm-ups do not shift working-set Previous/Today indexing;
- warm-ups are excluded from live working totals, prior guidance, RPE prompting, PR/e1RM/volume, exercise-progress series and weekly muscle-volume analytics;
- no working load is guessed when prescription authority is absent.

### P21-D — Set Types + Supersets

Implemented contract:

- durable set types: `working | warmup | backoff | drop | amrap`;
- durable optional `supersetId`;
- compact row semantics and explicit set actions;
- legacy sessions remain sync schema v1 when no new semantics are present;
- sessions using set semantics use additive schema v2;
- v1 envelopes carrying v2-only semantics fail closed;
- backend #332 validates/materializes v2 while preserving v1 compatibility and requires no database migration.

Production backend compatibility for this contract is verified.

### P21-E — Rare Contextual Adjustment

Implemented, deliberately bounded:

- no suggestion after every set;
- suggestion appears only when actual performance materially diverges from an exact aligned prescription row under deterministic RPE/reps thresholds;
- missing/insufficient evidence fails closed;
- Apply / Ignore are explicit;
- remaining sets are never rewritten silently;
- Apply preserves per-set prescription shape through a bounded load multiplier;
- recovery-aware adaptation remains the responsibility of a future reviewed adaptive/recovery engine.

## Remaining release evidence

### Phase 21

1. Confirm the `Publish EAS Update` run for merge `a2abde02e31b5ed1207e67835144e9359aea711e` succeeded.
2. Record EAS update ID/group/runtime `1.0.3` and production branch/channel evidence.
3. Run a real-iPhone active-workout smoke covering Previous/Today, rest timer, warm-ups, set types/supersets, contextual Apply/Ignore, active-session persistence and sync sanity.

### Phase 20

Use `docs/qa/progress-photo-device-validation.md` on the intended signed iPhone build for:

- camera permission/capture/import/persistence/delete/account-cleanup behavior;
- side-by-side/overlay rendering, fail-closed aspect behavior and visual quality.

A prepared checklist is not evidence of a completed device run.

## Approved expansion queue after the Workout Assistant foundation

These directions are approved for roadmap planning but remain separate requirement packages.

### Adaptive Program + Recovery Engine

Build two linked deterministic layers rather than a free-form Coach decision:

1. **Training Progression Engine** — performance history, load/reps/RPE, e1RM, progression/regression, plateau, recent training load and program context.
2. **Recovery Modifier** — local muscle recovery plus systemic evidence such as recovery check-ins and, when legitimately available, sleep/activity/resting-HR/HRV evidence.

Missing signals remain unknown. Final proposals remain explicit suggestions; Coach may explain them but does not become the deterministic calculation authority and does not silently mutate a program.

### Exercise Preferences + Smart Replace

- user preference states such as prefer / neutral / avoid;
- explicit reasons such as equipment, preference, discomfort or temporary exclusion;
- combine preference with existing reviewed substitutions;
- no exact-equivalence claim;
- replacement remains explicit user action.

### Weekly Training Review

One compact weekly review over existing deterministic authorities:

- completed versus planned workouts;
- volume/performance direction and PRs;
- muscle exposure/gaps;
- meaningful changes only, with evidence drill-down;
- optional Coach explanation over deterministic findings.

### Apple Health / Apple Watch

Future native workstream for permission-bounded health/activity inputs and a focused workout companion. Requires signed native builds and physical-device evidence.

### Progress Stories / Share Cards

User-initiated share artifacts for selected non-sensitive progress facts. Progress photos are included only when explicitly selected for sharing.

### Trainer / Coach Layer

Future server-authoritative collaboration for explicit coach/client relationships, scoped data access, program assignment and feedback. Marketplace/payments are not implied.

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
2. Reviewed Exercise Intelligence completion — merged in #807 as `371e1cdfc09aeffd93f4664cabbb4a777f19e1b0`.
3. P20-A/P20-B/P20-C — merged through #804/#805/#806; Phase 20 source/CI-complete.
4. P21-A through P21-E — merged through #810 as `a2abde02e31b5ed1207e67835144e9359aea711e` after exact-head Mobile CI #2806.
5. Backend #332 — merged and deployed in production through descendant `8a2c539ecfbf7842bf37a02491de9f844ec83c81`; v1/v2 compatibility verified.
6. Remaining Phase 21 work is OTA publication evidence plus real-device smoke.
7. Remaining Phase 20 work is physical-device validation.

Phase 21 is the latest explicitly reviewed numbered product requirement. Do not invent P21-F or Phase 22 merely to continue development; use the approved expansion queue only after a reviewed requirement is created.
