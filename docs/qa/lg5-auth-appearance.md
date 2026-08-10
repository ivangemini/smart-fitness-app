# LG-5 auth appearance consistency

Date: 2026-08-10

Scope: bounded source-level LG-5 fix for demonstrated auth/account surfaces that ignored the selected app appearance.

## Findings

The auth navigation stack already resolves its container background from `AppThemeProvider`, but several live auth surfaces and shared auth primitives still resolved presentation directly from `Colors.dark`:

- `src/components/ui/FormField.tsx`;
- `src/components/ui/ScreenHeader.tsx`;
- `src/components/ui/TertiaryButton.tsx`;
- `src/app/auth/index.tsx`;
- `src/components/auth/AuthFormScreen.tsx`, used by sign-in and registration;
- `src/app/auth/forgot-password.tsx`;
- `src/app/auth/reset-password.tsx`;
- `src/components/auth/AuthGateCard.tsx`;
- `src/components/auth/ChangePasswordModal.tsx`;
- `src/components/auth/DeleteAccountModal.tsx`.

This created mixed-palette UI in light app appearance: the stack/AppCard/buttons could use the active light palette while screen backgrounds, headers, fields, metadata, warnings and modal sheets remained on dark semantic colors.

## Fix

The affected presentation boundaries now resolve semantic colors through `useAppTheme()` and memoized style factories:

- auth screen backgrounds use active `background`;
- headers, labels, body copy and metadata use active text colors;
- form fields preserve existing focus/error behavior while using active surface, border, accent, error and placeholder colors;
- tertiary actions use active accent/accent-soft colors;
- registration experience choices use active surface, selected, border, accent and text colors;
- change-password/delete-account modal sheets, inputs and warning states use the active semantic palette.

## Preserved behavior

No changes were made to:

- sign-in/register payloads, validation or navigation;
- auth-session restore/login/register/logout/refresh behavior;
- password-reset token parsing, rejection handling, capability gates or submission semantics;
- change-password validation/submission lifecycle;
- account-deletion validation, deletion receipts or local cleanup behavior;
- keyboard avoidance, scroll reachability or safe-area ownership;
- localization copy;
- persistence/sync, backend APIs or provider configuration.

Physical light/dark/system validation remains part of the separately authorized LG-5 device matrix and is not claimed by this source-level package.
