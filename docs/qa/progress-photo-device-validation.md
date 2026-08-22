# Progress Photo Physical-Device Validation

Updated: 2026-08-22

This checklist records the native/physical-device evidence still required for Phase 20 P20-A/P20-B. Source/CI success is not a substitute for this evidence.

## Preconditions

- use a disposable/test account, never production user data;
- record the exact mobile commit/build identifier under test;
- record iPhone model and iOS version;
- use a signed native build with the actual camera/photo-library permission configuration;
- keep test photos non-sensitive and suitable for deletion after the run.

## P20-A — capture/import/storage lifecycle

Record PASS/FAIL and evidence for each item:

1. Open Progress Photos with camera permission not yet granted.
2. Deny camera permission and verify the app fails safely without creating a photo record.
3. Grant camera permission and capture front, side and back photos.
4. Verify each saved record shows the selected pose, camera source and added-at timestamp.
5. Import a library photo and verify library source identity is shown.
6. Force-quit/relaunch and verify ready photos still render from app-owned storage.
7. Delete one photo, relaunch, and verify it does not reappear.
8. Interrupt/retry a deletion if practical and verify repository recovery does not create a phantom ready record.
9. On a disposable account only, execute the approved account-deletion flow and verify progress-photo history is gone after cleanup/relaunch.

Do not claim EXIF/location stripping solely from visual UI inspection. That property remains covered by source/contracts unless a separate inspected-file test is performed on non-sensitive test media.

## P20-B — comparison rendering

Record PASS/FAIL and evidence for each item:

1. Create at least two ready photos of the same pose on different timestamps.
2. Open comparison and verify the latest chronological same-pose pair is selected by default.
3. Manually choose Before/After and verify reversed chronology is rejected.
4. Verify different poses cannot form a comparison pair.
5. Verify side-by-side uses the complete photo without arbitrary crop.
6. With two standardized 3:4 photos, enable the 50/50 ghost overlay and inspect visual stability.
7. With a deliberately non-standard aspect photo, verify overlay is unavailable/fails closed.
8. Verify date and camera/library source identity remain visible for both endpoints.
9. When stored weight exists within ±7 days, verify it appears as separate evidence; verify a farther value does not.
10. When canonical waist length exists within ±14 days, verify it appears as separate evidence; malformed/non-length data must not be coerced.
11. Confirm comparison creates no new saved comparison object and does not mutate workout/program/goal/nutrition/Labs/recovery/safety state.

## Evidence record

For every run, record:

- date/time and tester;
- device model and iOS version;
- exact app commit/build/OTA identity;
- permission state at start;
- numbered scenario results;
- screenshots/screen recording references where appropriate;
- any defect link and reproduction steps;
- cleanup result for test photos/account.

## Release boundary

P20-A/P20-B are not physical-device validated until this checklist has a dated completed run against the intended release build. A blank or source-only checklist is preparation, not evidence.
