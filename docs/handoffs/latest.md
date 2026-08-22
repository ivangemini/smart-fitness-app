# Latest Handoff

Updated: 2026-08-22

Exact source, tests, migrations, CI and Git history override prose if this handoff becomes stale.

## Repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- main baseline before Phase 19 closure: `0cfcac732b570f58ee7860b5a317ddd4e856a147`;
- Phase 18 P18-A through P18-H remains closed;
- #802 added cross-repository contract verification;
- #803 carries the Phase 19 Exercise + Training Intelligence closure implementation;
- implementation head before closure documentation: `6e017b18fdeba3e1d47a2ce7191cd343743cf3f5`;
- exact-head CI and merge history are the authoritative closure evidence.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`;
- no backend persistence/schema/provider change is required by the reviewed Phase 19 mobile scope.

## Phase 19 handoff state

P19-A through P19-D are implemented for the reviewed mobile source scope. Do not resume the old “thumbnail first slice” sequence; that checkpoint is historical.

### Stable anatomy authority

- `src/features/exercises/muscleTaxonomy.ts` remains canonical muscle naming/mapping authority;
- `src/features/exercises/muscleAnatomy.ts` owns shared SVG region geometry;
- `BodyMuscleSvg` renders that geometry for thumbnails, exercise detail, interactive filters and heatmaps;
- unknown provider names remain text/unmapped instead of being guessed;
- exercise detail and canonical muscle detail reuse the same anatomy/mapping authority.

### Stable training-intelligence authority

- completed workout sessions are the history authority;
- mapped exercise metadata, not name heuristics, drives muscle analytics;
- 7/30/90-day windows use explicit `endAt` and immediately preceding equal comparison windows;
- PR types remain explicit: load, reps, estimated 1RM, session volume;
- `training-intelligence-v1` findings remain deterministic and evidence-backed;
- supported findings include PR, plateau, stable-load rep progression, bounded regression, volume spike, muscle exposure concentration, muscle gap and exercise gap;
- missing/ambiguous mapping remains missing/unmapped;
- model prose is not finding authority.

### Stable UX boundaries

- Training Progress owns the Phase 19 muscle heatmap and structured finding presentation;
- exact evidence remains visible under findings;
- heatmap taps open the canonical muscle detail drill-down;
- exercise trend/raw workout history remain available as evidence paths;
- no finding automatically modifies workouts, programs, goals, nutrition, Labs, recovery or safety state;
- Phase 19 adds no production/provider/release authorization.

## What to do next

1. Treat Phase 19 as closed for normal source implementation once #803 exact-head CI/merge history confirms closure; reopen only for a reproduced defect or newly reviewed requirement.
2. Start Phase 20 with P20-A private standardized progress photos.
3. Define and review photo ownership, storage, deletion/export and account-boundary semantics before implementing cloud/provider behavior.
4. Add front/side/back capture/import guidance with repeatable framing/pose/lighting semantics.
5. Require physical-device camera/photo evidence before release-ready claims.
6. Add P20-B comparison/overlay only after stable photo identity/crop/scale semantics exist.
7. Build P20-C body-composition progress from real measurements/photos without presenting photo-estimated body-fat percentage as exact truth.
8. Keep P18 closed and do not manufacture P18-I.
9. Continue remaining independent Phase 14 provider/native/device evidence when prerequisites are available.

## Remaining independent external evidence

Phase 14 configured-provider/native/device evidence remains separate:

- Labs configured provider + physical device;
- Push provider + physical device;
- Steps signed native/physical device;
- Stories remaining mobile/physical-device evidence.

No source/CI result implies production migration execution, provider activation, canonical content publication, OTA/native publication or physical-device validation.