# LG-5 SectionHeader theme consistency

Date: 2026-08-10

Scope: bounded source-level LG-5 fix for a demonstrated shared-header theme mismatch.

## Finding

`src/app/(tabs)/coach.tsx` is a live theme-aware surface: it resolves the screen and body palette from `AppThemeProvider`. The shared `SectionHeader` used by that screen still resolved title/subtitle colors from `Colors.dark` directly.

That creates an app-appearance mismatch when the selected app appearance differs from the platform appearance and on non-iOS platforms where the legacy adaptive fallback resolves to the dark palette. A light Coach surface could therefore retain dark-palette header text instead of the active app palette.

## Fix

`src/components/ui/SectionHeader.tsx` now:

- resolves colors from `useAppTheme()`;
- memoizes a theme style factory keyed by the active palette;
- uses active `textPrimary` and `textSecondary` colors for header copy;
- preserves the existing layout, typography, action ownership and public component API.

## Reviewed no-change boundaries

- No navigation changes.
- No touch-target geometry changes.
- No localization, persistence, sync, API or business-logic changes.
- No native configuration or dependency changes.
- No EAS build, OTA publish, deployment or device installation.

Physical light/dark/system validation remains part of the broader LG-5 device matrix and is not claimed by this source-level package.
