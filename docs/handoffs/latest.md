# Latest Handoff

Updated: 2026-08-22

Exact source, tests, migrations, CI and Git history override prose if this handoff becomes stale.

## Repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Phase 19 is merged through PR #803;
- PR #804 carries Phase 20 P20-A private standardized progress photos;
- P20-A code head before closure documentation: `8d20cb49d227f85c24fe37109b15c021997100d4`;
- Mobile CI #2716 is green on that code head across line audits, agent integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor;
- final documentation-head CI and merge history are closure authority.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`;
- P20-A adds no backend storage/schema/provider upload behavior.

## Phase 20 P20-A handoff state

P20-A is implemented for the reviewed mobile source/CI scope in #804.

### Stable progress-photo ownership/storage authority

- `src/features/progressPhotos/progressPhotoTypes.ts` defines private photo identity, pose/source/lifecycle and account-scoped snapshot semantics;
- `progressPhotoStore.ts` owns strict metadata parsing and account-scoped metadata persistence;
- `progressPhotoFileStore.native.ts` owns native app-document media storage;
- persisted files live under a deterministic account-owned progress-photo directory rather than picker/cache URIs;
- captured/imported images are re-encoded before persistence so imported EXIF/location metadata is not copied into app-owned media;
- non-native runtime does not pretend to provide durable native photo storage.

### Stable deletion/privacy authority

- per-photo deletion transitions metadata to a durable `deleting` state before deleting the file;
- interrupted deletion is recovered on the next repository read;
- account deletion and cleanup-resume remove progress-photo metadata plus the deterministic account-owned photo directory;
- cleanup-marker completion remains dependent on successful account-data/file cleanup;
- mobile privacy inventory explicitly names progress-photo metadata/files;
- data-access/export remains blocked under the existing export contract rather than exposing raw private paths or pretending export is complete;
- no cloud/provider/social upload is part of P20-A.

### Stable P20-A UX

- Progress links to `/progress-photos`;
- the screen provides front/side/back selection, repeatability guidance, camera capture and library import;
- latest pose slots and a virtualized history are visible;
- imported records use explicit added-at time, not inferred EXIF capture time;
- deletion is explicit and user-controlled;
- no AI/vision body-fat estimate exists.

## What to do next

1. Treat P20-A as source/CI-complete once #804 final documentation-head CI and merge history confirm closure.
2. Start P20-B on a new branch from the merged #804 baseline.
3. Implement deterministic selection of two private photos and require matching pose for direct visual comparison.
4. Add side-by-side before/after first.
5. Add overlay/ghost only with stable crop/scale semantics; fail closed when images are not meaningfully comparable.
6. Show nearby stored weight/body measurements as separate evidence, never as photo-derived values.
7. Do not add AI vision or body-fat estimation in P20-B.
8. Keep physical-device camera/photo validation as a separate release evidence stream; source/CI completion does not satisfy it.
9. Build P20-C after P20-B comparison semantics are stable.

## Remaining independent external evidence

Phase 14 configured-provider/native/device evidence remains separate:

- Labs configured provider + physical device;
- Push provider + physical device;
- Steps signed native/physical device;
- Stories remaining mobile/physical-device evidence;
- P20-A native/physical-device camera, permission, import, persistence and deletion evidence.

No source/CI result implies production migration execution, provider activation, OTA/native publication or physical-device validation.