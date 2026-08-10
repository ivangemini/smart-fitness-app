# LG-5 Coach history theme consistency

Date: 2026-08-10

Scope: bounded LG-5 presentation fix for demonstrated Coach history controls and detail rows that bypassed the selected app appearance.

## Findings

Both Coach history screens already resolve their main backgrounds, headers and cards from `AppThemeProvider`, but two nested presentation helpers still used `Colors.dark` directly:

- `CoachRunHistoryScreen` domain/status filter chips used dark border, accent and text colors from a static style sheet;
- `CoachRunHistoryDetailScreen` reusable key/value rows used dark primary/secondary text colors from a static style sheet.

In Light appearance those nested controls could therefore retain dark-palette styling inside an otherwise light screen.

## Fix

- filter chips now resolve active `borderSubtle`, `accent` and `textPrimary` colors from `useAppTheme()`;
- detail key/value rows now resolve active `textSecondary` and `textPrimary` colors from `useAppTheme()`;
- existing geometry, 44 px filter touch targets, filtering behavior and history layout are preserved.

## Preserved behavior

- No Coach API, run history, status/domain filtering semantics or immutable-run behavior changes.
- No applied-change, provenance, trust or input-summary logic changes.
- No auth/session, persistence/sync or backend changes.
- No localization copy, dependency, native configuration, OTA/EAS or deployment changes.

This package is LG-5 presentation hardening only; it does not resume deferred Coach product/material work.

Physical-device light/dark/system validation remains part of the separately authorized LG-5 device matrix and is not claimed by this source-level package.
