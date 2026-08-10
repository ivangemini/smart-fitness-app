# LG-5 Coach history theme consistency

Date: 2026-08-10

Scope: bounded LG-5 presentation fix for demonstrated Coach history controls, detail rows and input-summary content that bypassed the selected app appearance.

## Findings

Both Coach history screens already resolve their main backgrounds, headers and cards from `AppThemeProvider`, but three nested presentation boundaries still used `Colors.dark` directly:

- `CoachRunHistoryScreen` domain/status filter chips used dark border, accent and text colors from a static style sheet;
- `CoachRunHistoryDetailScreen` reusable key/value rows used dark primary/secondary text colors from a static style sheet;
- `CoachInputSummaryCard`, rendered inside the detail screen, used dark text and divider colors for its description, source headings, availability notices and coverage rows.

In Light appearance those nested controls/content could therefore retain dark-palette styling inside an otherwise light screen.

## Fix

- filter chips now resolve active `borderSubtle`, `accent` and `textPrimary` colors from `useAppTheme()`;
- detail key/value rows now resolve active `textSecondary` and `textPrimary` colors from `useAppTheme()`;
- `CoachInputSummaryCard` now uses an active-palette style factory for text, dividers and all nested coverage rows;
- existing geometry, 44 px filter touch targets, filtering behavior and history layout are preserved.

## Reviewed no-change boundaries

- `CoachRunTrustCard` already resolves all presentation through `useAppTheme()` and was left unchanged;
- `CoachAppliedChangeCard` already resolves all presentation through `useAppTheme()` and was left unchanged.

## Preserved behavior

- No Coach API, run history, status/domain filtering semantics or immutable-run behavior changes.
- No applied-change, provenance, trust or input-summary data logic changes.
- No auth/session, persistence/sync or backend changes.
- No localization copy, dependency, native configuration, OTA/EAS or deployment changes.

This package is LG-5 presentation hardening only; it does not resume deferred Coach product/material work.

Physical-device light/dark/system validation remains part of the separately authorized LG-5 device matrix and is not claimed by this source-level package.
