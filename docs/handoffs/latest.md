# Latest Handoff

Updated: 2026-08-22

Exact source, tests, CI and Git history override prose if this handoff becomes stale.

## Repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Phase 19 base Exercise + Training Intelligence is merged through #803;
- Phase 20 P20-A/P20-B/P20-C are merged through #804/#805/#806;
- #806 merge commit on `main`: `6e287c64d4fcdcd604e78de6ae911510ddf604bb`;
- Phase 20 is source/CI-complete for reviewed scope;
- PR #807 completes the previously deferred reviewed Exercise Intelligence metadata without creating a new roadmap phase;
- #807 code head `32221db92dcaae78bb38b96ad1ff358cea0877d5` uses Mobile CI #2731 as code-head authority; final docs-head CI and #807 merge history remain final closure authority.

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

1. Complete #807 code-head CI #2731.
2. Commit canonical closure docs and the physical-device checklist in one docs-only commit.
3. Run final exact-head Mobile CI on that docs head.
4. Update #807 evidence, mark ready and merge with expected-head SHA.
5. Confirm `main` merge commit.
6. Do not invent P20-D/Phase 21 or another Exercise Intelligence phase without reviewed new requirements.
7. Keep physical-device evidence, OTA/native publication, deployment and provider activation separate from source/CI.

## Remaining external/release evidence

- Phase 14 configured-provider/native/device evidence remains separate;
- P20-A real-device camera permission/capture/import/persistence/delete/account-cleanup behavior remains unvalidated until the checklist is run;
- P20-B real-device comparison rendering/overlay/visual quality remains unvalidated until the checklist is run.
