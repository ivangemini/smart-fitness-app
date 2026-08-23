# Adaptive Program + Recovery Engine

Updated: 2026-08-23

This is an approved unnumbered expansion after the Exercise & Training Intelligence package. It does **not** create P21-F or Phase 22. Existing TrainingProgram, workout-template identity, completed-history immutability, `training-intelligence-v1`, Safety/Recovery, Coach and synchronization boundaries remain authoritative.

## Product objective

Turn deterministic training-performance evidence into explicit program-progression proposals while allowing fresh user-entered recovery evidence to modify those proposals conservatively.

The engine is not a universal readiness score, medical assessment or autonomous coach. Missing evidence stays unknown and workout/program mutation requires a reviewed Apply contract and explicit user confirmation.

## Execution sequence

1. **A1 — Read-only progression proposal foundation — delivered by #829.**
2. **A2 — Recovery modifier expansion and evidence drill-down — delivered by #830.**
3. **A3 — Explicit proposal preview / Apply contract — active slice.**
4. **A4 — Coach explanation over deterministic proposals.**

## A1 — delivered

Authority:

- active/default `TrainingProgram` remains the program authority;
- a program day contributes only through exact `workoutTemplateId`;
- workout templates resolve only by exact `Workout.id`;
- planned exercise identity resolves only by exact exercise ID;
- performance direction reuses deterministic `training-intelligence-v1` findings rather than inventing a second progression calculation;
- only exercise-scoped findings with exact IDs are eligible for exercise proposals;
- unknown templates and identities fail closed.

Proposal semantics:

- `new_pr` / `rep_progression` may produce a `progress` proposal;
- `plateau` may produce `maintain`;
- `regression` / `exercise_gap` produce `review` rather than an automatic reduction;
- muscle/global findings remain supporting review evidence and are not converted into arbitrary exercise mutations.

Recovery modifier:

- only a fresh stored `RecoveryCheckIn` within 48 hours contributes to the modifier;
- no fresh check-in -> `unknown`;
- explicit user-entered sleep, fatigue, soreness, stress, pain-interference and self-reported readiness may produce `caution` / `strong_caution`;
- no weighted readiness score or percentage is calculated;
- recovery may conservatively downgrade a `progress` proposal to `maintain` or turn `maintain` into `review` under stronger caution evidence;
- recovery evidence never silently changes stored workouts/programs.

Delivery evidence:

- implementation: #829 (`feat(progress): add Adaptive Program proposal foundation`);
- exact PR head `35e817745451e943dbaedb43980bfd819704223c` passed Mobile CI #2869 including line audits, agent integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor;
- merged to `main` as `089753636c006c32937188285f33aba1aeac71eb`.

## A2 — delivered

A2 makes the A1 proposal inspectable without creating a physiological recovery estimator.

- latest stored check-in raw values and a seven-day check-in count are shown as evidence;
- an explicit 72-hour display window reports completed, non-warm-up training exposure for the proposal exercise's canonical primary muscles;
- exposure resolves exercises by exact ID and may include other exact-ID exercises sharing those primary muscles;
- unknown/name-only exercise identity fails closed;
- the 72-hour window is descriptive exposure only, not a recovery-duration claim or timer;
- exposure does not change the A1 action rules;
- no new persisted analytics state, backend/sync schema or provider call is introduced.

Delivery evidence:

- implementation: #830 (`feat(progress): add Adaptive Recovery evidence drill-down`);
- exact PR head `ef400c70eedc3b35f0f200af5e6fbda50e3ab4d2` passed Mobile CI #2871 including line audits, agent integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor;
- merged to `main` as `18d2d6de52f36313582e28272c6b36665e261ed7`.

## A3 — active exact Apply contract

A3 may mutate only a future custom workout template prescription after a separate preview and explicit confirmation.

Eligibility:

- proposal action must still be `progress` after the current recovery modifier;
- proposal must resolve to exactly one canonical `workoutTemplateId`; multiple template targets fail closed;
- the exact template must still exist and be custom/editable;
- the exact exercise must still exist in that template;
- an existing stored `Workout.prescription` row for the exact exercise ID is required; A3 does not invent a prescription where none exists;
- `estimated_1rm` and `session_volume` PRs remain read-only because they do not map unambiguously to one prescription target field.

Bounded deterministic changes:

- confirmed load PR: preserve the existing multi-set prescription shape and scale positive target loads by the observed PR ratio, capped at `1.05` (+5%) for one application and rounded to the existing 0.5 kg target precision;
- confirmed reps PR or `rep_progression`: preserve target load/RPE and add the observed rep gain, capped at +2 reps for one application;
- target RPE, exercise identity, template identity and unrelated prescription rows are preserved;
- each applied finding writes an existing prescription `rationaleCode` marker so the same finding cannot be applied repeatedly.

Preview / stale gate:

- preview shows exact template, exact rows and before -> after targets;
- Apply is a second explicit user action after preview;
- preview captures an exact fingerprint of template exercise identity and the full stored prescription;
- if that source fingerprint changes before Apply, the mutation returns `stale` and writes nothing;
- invalid/mismatched rows return `blocked` and write nothing.

Persistence / history boundary:

- Apply uses the existing AppContext local-persistence mutation queue; no parallel storage or sync authority is introduced;
- completed `WorkoutSession` history is never rewritten by an A3 template Apply;
- A3 does not change the TrainingProgram day/template links;
- no backend schema change, provider/model call or automatic mutation is introduced.

## A4 — future

Coach may explain an already-derived deterministic proposal and its evidence, but must not become the calculation or mutation authority. A4 must not bypass the A3 preview/stale/confirmation gates.
