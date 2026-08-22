# Latest Handoff

Updated: 2026-08-22

Exact source, tests, CI and Git history override prose if this handoff becomes stale.

## Repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Phase 19 base Exercise + Training Intelligence is merged through #803;
- reviewed Exercise Intelligence completion is merged through #807 without creating a new roadmap phase;
- Phase 20 P20-A/P20-B/P20-C are merged through #804/#805/#806 and source/CI-complete;
- #807 code head `32221db92dcaae78bb38b96ad1ff358cea0877d5` passed Mobile CI #2731;
- #807 final closure head `da4064e6c4e805a4395cce3fb84ce55fddc21e96` passed Mobile CI #2732;
- #807 merged with exact expected head into `main` as merge commit `371e1cdfc09aeffd93f4664cabbb4a777f19e1b0`.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`;
- #807 and Phase 20 add no backend storage/schema/provider-upload behavior.

## Exercise Intelligence authority

### Existing #803 authority

- canonical muscle taxonomy;
- reusable local front/back SVG anatomy;
- exact/fail-closed muscle mapping;
- muscle filtering, detail drill-down and Progress heatmaps;
- deterministic 7/30/90-day training analytics and evidence-backed findings.

### #807 reviewed metadata authority

`src/features/exercises/exerciseIntelligence.ts` owns `exercise-intelligence-v1` reviewed static metadata for all 15 canonical local exercise runtime IDs.

Each reviewed exercise may expose:

- movement pattern;
- EN/RU technique cues;
- EN/RU common errors;
- controlled ROM guidance;
- qualitative low/moderate/high fatigue cost;
- reviewed substitution targets and rationale.

`ExerciseIntelligenceSection` presents that authority read-only inside Exercise Detail. Substitution buttons only navigate to another exercise detail; they do not rewrite the workout.

Fail-closed behavior is permanent:

- unknown/remote-only IDs return no reviewed intelligence;
- OSS rows inherit reviewed intelligence only when existing normalization reuses a reviewed local canonical identity;
- do not add runtime guesses based on names, body-part labels or muscles;
- fatigue cost is not physiological/readiness measurement;
- substitution metadata does not claim exact equivalence.

## Phase 20 authority

### P20-A

Private/account-owned progress-photo metadata and app-owned native file storage remain authority. Re-encoding prevents imported EXIF/location metadata from becoming durable app metadata; deletion/account cleanup covers app-owned media. No cloud/provider/social upload exists.

### P20-B

`progressPhotoComparison.ts` remains deterministic comparison authority: same-pose chronology, non-cropping side-by-side, fail-closed reviewed-aspect overlay, separate nearby stored weight/waist evidence, and no persisted comparison or AI vision.

### P20-C

`bodyCompositionProgress.ts` composes existing weight/measurement/photo authorities under one explicit period boundary. Stored body-fat remains user-entered evidence and is never image inference.

## Physical-device validation

Use `docs/qa/progress-photo-device-validation.md` for P20-A/P20-B real-device validation.

Important: the checklist is not evidence until a dated run is completed on the intended signed iPhone build with device/iOS/build identity and scenario results.

## What to do next

1. Treat requested source/CI scope for Exercise + Personal Training Intelligence as complete through #807.
2. Run the Phase 20 progress-photo checklist on an actual intended signed iPhone build and record dated evidence.
3. Keep Phase 14 configured-provider/native/device evidence independent.
4. Do not invent P20-D/Phase 21 or another Exercise Intelligence phase without reviewed new requirements or reproduced defects.
5. Keep physical-device evidence, OTA/native publication, deployment and provider activation separate from source/CI.

## Remaining external/release evidence

- Phase 14 configured-provider/native/device evidence remains separate;
- P20-A real-device camera permission/capture/import/persistence/delete/account-cleanup behavior remains unvalidated until the checklist is run;
- P20-B real-device comparison rendering/overlay/visual quality remains unvalidated until the checklist is run.
