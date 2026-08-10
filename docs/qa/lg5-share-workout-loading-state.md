# LG-5 Share Workout loading-state resilience

Date: 2026-08-10

Scope: bounded LG-5 fix for a demonstrated Share Workout restore/auth-readiness loading-state safe-area mismatch.

## Finding

The normal Share Workout flow already owns runtime top/bottom safe-area padding through its scroll content. During app-state restore or before the auth session is ready, however, the screen returned only `styles.screen` plus a `LoadingState`.

That temporary state had the correct themed background but no safe-area clearance and no centered loading layout, making it an outlier from the populated form and from other reviewed Social loading surfaces.

## Fix

- add a bounded `loadingState` layout that centers the shared loading indicator;
- apply runtime top/bottom insets plus existing spacing to the restore/auth-readiness branch;
- preserve the active app background from `styles.screen`.

## Preserved behavior

- No workout-session selection or preview changes.
- No share-field, caption, image/media, moderation or publication changes.
- No auth, sync, idempotency or Social API changes.
- No localization copy changes.
- No dependency, native configuration, OTA/EAS or deployment changes.

Physical-device validation remains part of the separately authorized LG-5 device matrix and is not claimed by this source-level package.
