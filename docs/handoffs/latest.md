# Latest Handoff

Updated: 2026-08-22

Exact source, tests, migrations, CI and Git history override prose if this handoff becomes stale.

## Repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Phase 19 is merged through PR #803;
- Phase 20 P20-A private standardized progress photos is merged through PR #804;
- Phase 20 P20-B deterministic visual comparison is merged through PR #805 (`c5074f006fd67cdaf5a485a8c4b8a4b78b1340a7`);
- PR #806 carries P20-C body-composition progress;
- P20-C code head `54cf667c5280e089ca81bb1c8c4335fbda43e8ec` passed Mobile CI #2726 across line audits, agent integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor;
- final documentation-head CI and #806 merge history are Phase 20 source/CI closure authority.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`;
- Phase 20 adds no backend storage/schema/provider upload behavior.

## Stable Phase 20 handoff state

### P20-A ownership/storage/privacy authority

- progress-photo metadata is private/account-scoped;
- native app-document storage owns deterministic account photo paths;
- picker/cache URIs are not durable storage authority;
- captured/imported images are re-encoded before persistence so imported EXIF/location metadata is not copied into app-owned media;
- durable deleting state supports interrupted per-photo deletion recovery;
- account deletion/resume cleanup covers metadata and deterministic account-owned photo files;
- data access/export stays governed by the existing blocked export contract;
- no cloud/provider/social upload is introduced.

### P20-B comparison authority

- `progressPhotoComparison.ts` is the deterministic comparison model;
- candidates are ready private records filtered by pose and chronology;
- default pair is the latest two chronological same-pose records;
- same-photo, pose mismatch and non-increasing chronology fail closed;
- side-by-side uses non-cropping `contain` semantics;
- overlay requires standardized 3:4 aspect semantics and remains a 50/50 visual aid rather than registration/measurement;
- date and camera/library source identity stay visible;
- endpoint evidence uses nearest stored weight within ±7 days and canonical waist length within ±14 days;
- malformed/non-length waist records are excluded;
- no comparison state is persisted and no AI vision/photo-derived body-fat estimate exists.

### P20-C body-composition authority

- `bodyCompositionProgress.ts` composes existing authorities rather than reimplementing them;
- `getWeightAnalytics` remains weight-summary authority;
- `getWeightTrendEntries` remains weight trend/dedup authority for the 30/90-day UI periods;
- `buildBodyMeasurementProgressAnalytics` remains canonical measurement-series authority;
- one explicit `endAt`/period boundary is applied to longitudinal evidence;
- canonical waist and other stored measurements remain user-entered evidence;
- stored `body_fat` measurements remain stored measurements and are never relabeled as image estimates;
- only ready progress photos inside the selected period are included in the private timeline;
- timeline items preserve pose/date/source identity and link read-only to existing photo/comparison surfaces;
- no new persistence, sync, provider upload, hidden state mutation, AI vision or photo-derived body-fat estimate exists.

## What to do next

1. Commit the four canonical Phase 20 closure docs only after P20-C code-head CI #2726 is fully green.
2. Run final exact-head Mobile CI on that documentation head.
3. Update #806 with code-head and final closure-head evidence, mark ready, and merge with exact expected head SHA.
4. Confirm `main` merge commit; then Phase 20 is source/CI-complete for the reviewed roadmap scope.
5. Do not invent P20-D or Phase 21 merely to continue development; require a reviewed new requirement or reproduced defect.
6. Continue native/physical-device evidence separately.

## Remaining independent external/release evidence

Phase 14 configured-provider/native/device evidence remains separate:

- Labs configured provider + physical device;
- Push provider + physical device;
- Steps signed native/physical device;
- Stories remaining mobile/physical-device evidence.

Phase 20 release evidence remains separate:

- P20-A real-device camera permission/capture/import/persistence/delete/account-cleanup behavior;
- P20-B real-device side-by-side/overlay rendering and visual-quality evidence.

No source/CI result implies production migration execution, provider activation, OTA/native publication or physical-device validation.