# Settings information architecture

## Goal

Replace the current single long Settings scroll with a compact grouped navigation screen and focused child screens, while preserving existing preference/auth/sync/privacy behavior.

## Main Settings screen

The root screen contains navigation rows rather than embedded forms.

### Account
- Account & security
- Profile & personal details

### Preferences
- Appearance
- Language
- Units

### Data & privacy
- Data & Sync
- Privacy

### Support
- About

### Developer
Visible only under the existing support/development gate.
- Developer tools / diagnostics

## Child-screen ownership

- `settings/account` owns AuthGate/account identity, sessions, password, logout and account deletion behavior.
- `settings/profile` owns personal details and links to Social profile where applicable; it must not embed account-security actions.
- `settings/appearance` owns appearance mode.
- `settings/language` owns language preference.
- `settings/units` owns weight/length/energy units.
- `settings/data-sync` owns existing SyncSettings content.
- `settings/privacy` owns existing Privacy content.
- `settings/about` owns app/build/runtime/legal information only; Coach/Companion history is not an About setting.
- `settings/developer` owns OTA/runtime/local performance diagnostics and onboarding reset under the existing developer/support gate.

## UI contract

- Use one grouped Liquid Glass structural surface for related rows, not one decorative glass card per setting.
- Each row has a clear label, optional current-value summary and chevron.
- Child forms keep existing semantic controls and persistence owners.
- No preference migration is implied by the IA change.
- No auth/session/sync business logic moves into the root Settings screen.
- All screens use safe-area-aware vertical scrolling and remain usable on short devices and with larger text.
- Developer/runtime details stay hidden outside the existing support/development condition.
- Companion/Coach surfaces stay outside system-information screens unless the setting directly controls that product surface.

## Non-goals

- no new analytics;
- no new notification provider;
- no permission request changes;
- no account/session contract changes;
- no redesign of unrelated Profile/Coach product flows beyond navigation links required by this IA.
