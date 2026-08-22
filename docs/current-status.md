# Smart Fitness Current Status

Updated: 2026-08-22

Exact source, tests, CI and Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

- Phase 18 Knowledge & Learning remains closed for P18-A through P18-H.
- Phase 19 Exercise + Training Intelligence base scope is merged through #803.
- Phase 20 P20-A private standardized progress photos is merged through #804.
- Phase 20 P20-B deterministic visual comparison is merged through #805.
- Phase 20 P20-C body-composition progress is merged through #806; `main` merge commit `6e287c64d4fcdcd604e78de6ae911510ddf604bb`.
- Phase 20 is source/CI-complete for the reviewed roadmap scope.
- PR #807 completes the deferred reviewed Exercise Intelligence metadata without creating a new phase.
- #807 code head: `32221db92dcaae78bb38b96ad1ff358cea0877d5`; Mobile CI #2731 is code-head validation authority and final closure-head CI/merge history remains final authority.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

- Current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`.
- #807 and Phase 20 add no backend schema/provider-upload authority.

## Exercise Intelligence stable scope

The app now has two distinct reviewed authorities that must not be conflated:

1. canonical muscle taxonomy/SVG anatomy and deterministic training analytics from #803;
2. `exercise-intelligence-v1` reviewed static metadata for the 15 canonical local exercises from #807.

The reviewed metadata includes:

- movement pattern;
- EN/RU technique cues;
- EN/RU common errors;
- controlled range-of-motion guidance;
- qualitative low/moderate/high fatigue cost;
- reviewed substitutions with rationale;
- read-only substitution navigation from Exercise Detail.

Permanent rules:

- unknown or remote-only exercise IDs have no reviewed intelligence;
- OSS records gain reviewed intelligence only when existing normalization reuses a reviewed canonical local identity;
- do not infer movement pattern/substitution/technique/ROM/fatigue from names, body parts or muscle labels at runtime;
- fatigue cost is a qualitative programming label, not a physiological/readiness measurement;
- substitutions never automatically alter workouts and do not claim exact equivalence.

## Phase 20 stable delivered scope

### P20-A

- private account-owned front/side/back progress photos;
- camera/photo-library input with repeatable pose/framing/lighting guidance;
- explicit added-at timestamp rather than trusting imported EXIF capture time;
- re-encoding before persistence so embedded EXIF/location metadata is not copied;
- deterministic account-owned local document storage and durable deletion/account cleanup;
- privacy/export-contract coverage;
- no cloud/provider/social upload or AI/vision body-fat estimation.

### P20-B

- deterministic same-pose Before/After comparison;
- strict chronological validation;
- non-cropping `contain` rendering;
- fail-closed standardized-aspect ghost overlay as a visual aid only;
- visible date/source identity;
- nearby stored weight (±7 days) and canonical waist length (±14 days) as separate evidence;
- no comparison persistence, AI vision or image-derived body-fat estimate.

### P20-C

- read-only 30/90-day body-composition progress;
- one explicit `endAt`/period boundary;
- existing weight and measurement analytics remain calculation authority;
- stored body-fat remains user-entered measurement evidence;
- private ready-photo timeline remains period-bounded with pose/date/source identity;
- no new persistence/sync/provider upload, hidden mutation, AI vision or photo-derived body-fat estimate.

## Remaining physical-device evidence

Source/CI completion does not validate native camera/photo behavior. Use `docs/qa/progress-photo-device-validation.md` for a dated run on the intended signed iPhone build.

Still unproven until that real-device run is recorded:

- P20-A permission/capture/import/persistence/delete/account-cleanup behavior;
- P20-B side-by-side/overlay rendering and visual quality.

The checklist is preparation, not physical-device evidence by itself.

## Next execution order

1. Finish #807 final exact-head CI/merge.
2. Do not create another Exercise Intelligence phase merely to continue development; future additions require reviewed canonical data or a reproduced defect.
3. Keep Phase 20 physical-device validation separate and evidence it only on an actual signed device build.
4. Keep Phase 14 configured-provider/native/device evidence independent.

## Production / rollout boundary

Source merge, deployment, OTA/native publication, provider activation and physical-device validation remain separate claims.
