# Latest Handoff

Updated: 2026-08-22

Exact source, tests, migrations, CI and Git history override prose if this handoff becomes stale.

## Repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Phase 19 is merged through PR #803;
- Phase 20 P20-A private standardized progress photos is merged through PR #804;
- PR #805 carries P20-B deterministic visual comparison;
- P20-B code head `44231980f4bbfd6a40e9e89510c42ab411b83db4` passed Mobile CI #2724 across line audits, agent integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor;
- final documentation-head CI and #805 merge history are closure authority.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`;
- P20-A/P20-B add no backend storage/schema/provider upload behavior.

## Phase 20 stable handoff state

### P20-A ownership/storage authority

- `progressPhotoStore.ts` owns strict account-scoped metadata parsing/persistence;
- native progress-photo file storage owns deterministic app-document media paths under the account;
- persisted files do not depend on picker/cache URIs;
- captured/imported images are re-encoded before persistence so imported EXIF/location metadata is not copied into app-owned media;
- non-native runtime does not pretend to provide durable native photo storage.

### P20-A deletion/privacy authority

- per-photo deletion transitions metadata to a durable `deleting` state before deleting the file;
- interrupted deletion is recovered on the next repository read;
- account deletion and cleanup-resume remove progress-photo metadata plus the deterministic account-owned photo directory;
- cleanup-marker completion remains dependent on successful account-data/file cleanup;
- mobile privacy inventory explicitly names progress-photo metadata/files;
- data-access/export remains blocked under the existing export contract rather than exposing raw private paths or pretending export is complete;
- no cloud/provider/social upload is part of Phase 20 progress photos.

### P20-B comparison authority

- `progressPhotoComparison.ts` is the deterministic comparison model;
- candidates are ready private photo records filtered by pose and ordered by `capturedAt`/stable ID;
- default selection is the latest two chronological photos of one pose;
- same-photo, pose mismatch and non-increasing chronology fail closed;
- side-by-side rendering uses `contain` and never rewrites/crops the stored photo;
- overlay is allowed only when both records remain within the standardized 3:4 aspect tolerance;
- overlay remains a 50/50 visual aid rather than registration, measurement or image analysis;
- endpoint evidence uses nearest stored weight within ±7 days and canonical waist length within ±14 days;
- malformed/non-length waist records are excluded;
- comparison persists no derived state and mutates no workout/program/goal/nutrition/Labs/recovery/safety state;
- no AI vision or photo-derived body-fat estimation exists.

## What to do next

1. Treat P20-B as source/CI-complete once #805 final documentation-head CI and merge history confirm closure.
2. Start P20-C on a new branch from the merged #805 baseline.
3. Reuse `getWeightAnalytics`, `buildBodyMeasurementProgressAnalytics` and existing progress-photo repository/identity rather than creating duplicate authorities.
4. Apply one explicit `endAt`/period boundary to longitudinal weight, measurement and ready-photo evidence.
5. Present user-entered measurements separately from visual evidence; a stored body-fat entry is not a photo estimate.
6. Keep P20-C read-only and link to the existing measurement/photo comparison drill-downs.
7. Do not add AI vision or photo-derived body-fat estimation without a separately reviewed privacy/uncertainty contract.
8. Keep physical-device camera/photo/comparison validation as a separate release evidence stream; source/CI completion does not satisfy it.

## Remaining independent external evidence

Phase 14 configured-provider/native/device evidence remains separate:

- Labs configured provider + physical device;
- Push provider + physical device;
- Steps signed native/physical device;
- Stories remaining mobile/physical-device evidence;
- P20-A native/physical-device camera, permission, import, persistence and deletion evidence;
- P20-B real-device side-by-side/overlay rendering and visual-quality evidence.

No source/CI result implies production migration execution, provider activation, OTA/native publication or physical-device validation.
