# LG-5 shared state theme consistency

Date: 2026-08-10

Scope: bounded source-level LG-5 fix for demonstrated shared empty/loading/error theme mismatches.

## Findings

Three shared state primitives still resolved presentation from `Colors.dark` directly:

- `src/components/ui/EmptyState.tsx`;
- `src/components/ui/InlineError.tsx`;
- `src/components/ui/LoadingState.tsx`.

They are live on active theme-aware surfaces:

- Home uses `InlineError` for Stories/feed errors and `LoadingState` for Following Feed loading while the screen itself resolves its background, cards and other controls from `AppThemeProvider`;
- Progress uses compact `EmptyState` for weight-baseline and body-measurement empty states while the screen itself resolves its palette from `AppThemeProvider`.

When the selected app appearance is light, those shared states could therefore retain dark-palette error/accent/text/surface colors inside otherwise light active-theme UI.

## Fix

The three shared primitives now resolve semantic colors from `useAppTheme()`:

- `InlineError` uses the active `error` color;
- `LoadingState` uses the active `accent` and `textSecondary` colors;
- `EmptyState` uses active `surfaceAccent`, `borderSubtle`, `textPrimary` and `textSecondary` colors.

Existing component APIs, copy, typography, spacing, accessibility roles, action behavior and consumer state logic are preserved.

## Reviewed no-change boundaries

- No Home feed/Stories lifecycle changes.
- No Progress analytics/measurement behavior changes.
- No localization copy changes.
- No navigation, persistence, sync, API or backend changes.
- No native configuration, dependency, EAS/OTA, deployment or device-install changes.

Physical light/dark/system validation remains part of the broader LG-5 device matrix and is not claimed by this source-level package.
