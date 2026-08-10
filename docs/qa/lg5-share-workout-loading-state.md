# LG-5 Share Workout state/theme resilience

Date: 2026-08-10

Scope: bounded LG-5 fix for demonstrated Share Workout restore/auth-readiness and share-control presentation mismatches.

## Findings

### Restore/auth-readiness loading state

The normal Share Workout flow already owns runtime top/bottom safe-area padding through its scroll content. During app-state restore or before the auth session is ready, however, the screen returned only `styles.screen` plus a `LoadingState`.

That temporary state had the correct themed background but no safe-area clearance and no centered loading layout, making it an outlier from the populated form and from other reviewed Social loading surfaces.

### Share-control Switch palette

The workout-field disclosure switches were live app-appearance controls but used fixed colors:

- white thumb;
- `#475569` inactive track;
- `#14B8A6` active track.

Those values bypassed `AppThemeProvider`. In particular, the active track did not follow the dark app accent (`#0A84FF`) or the light app accent (`#1B8A7A`).

## Fix

- add a bounded `loadingState` layout that centers the shared loading indicator;
- apply runtime top/bottom insets plus existing spacing to the restore/auth-readiness branch;
- preserve the active app background from `styles.screen`;
- resolve Switch thumb and track colors from the active app palette (`textOnAccent`, `surfaceSecondary`, `accent`).

## Preserved behavior

- No workout-session selection or preview changes.
- No share-field boolean state or disclosure dependency changes.
- No caption, image/media, moderation or publication changes.
- No auth, sync, idempotency or Social API changes.
- No localization copy changes.
- No dependency, native configuration, OTA/EAS or deployment changes.

Physical-device validation remains part of the separately authorized LG-5 device matrix and is not claimed by this source-level package.
