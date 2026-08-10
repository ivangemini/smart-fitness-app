# LG-5 exercise detail loading-state resilience

Date: 2026-08-10

Scope: bounded LG-5 fix for a demonstrated Exercise Detail loading-state safe-area/theme mismatch.

## Finding

`ExerciseDetailScreen` already gave its error state and populated state explicit active-theme backgrounds plus runtime safe-area padding, but its loading branch returned a bare `LoadingState` component.

That made the initial loading state the only Exercise Detail state without screen ownership. On devices with status/notch safe areas it could render against the route default at the top edge rather than inside the same safe, themed full-screen boundary used by the rest of the screen.

## Fix

The loading branch now reuses the existing `centeredState` container and the same active `colors.background` plus runtime top/bottom safe-area clearance as the error state.

## Preserved behavior

- No exercise repository, favorite, history or progress logic changes.
- No tab, media, share or navigation behavior changes.
- No localization copy changes.
- No persistence/sync, backend, dependency or native configuration changes.
- Error and populated-state behavior remain unchanged.

Physical-device validation remains part of the separately authorized LG-5 device matrix and is not claimed by this source-level package.
