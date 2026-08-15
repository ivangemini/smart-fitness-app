# Smart Fitness App

Expo / React Native client for Smart Fitness.

## Current foundation

- Offline-first local `AppState` persisted through AsyncStorage for private fitness state.
- Focused state boundaries for production consumers; the full compatibility `AppContext` is internal only.
- Native access and refresh tokens stored through Expo SecureStore.
- Authenticated revision-aware synchronization with explicit conflicts, tombstones, idempotency, restart recovery and bounded diagnostics.
- Deterministic and structured Nutrition, Strength, Safety & Recovery and Combined Coach flows.
- Private server-authoritative Labs / Analyses with review-before-confirmation and provider-gated interpretation.
- Server-authoritative Social/Stories domains and managed-media contracts.
- Explicit confirmation before any Coach proposal changes user data.
- Provider-neutral mobile code; provider credentials remain backend-only.

## Synchronization coverage

First-class synchronization exists for weight history, completed workout sessions/sets, workout templates, food entries, nutrition targets, fitness profiles, user limitations, recovery check-ins, body measurements, training programs, custom exercises, meal templates and account-scoped Nutrition library items.

Social/Stories and Labs are server-authoritative domains outside private revisioned `AppState` synchronization.

Physical standalone validation for offline termination/restart, reconnect, recovery and second-device conflicts remains separate from source-level test coverage.

## Documentation

Start with:

- [Agent instructions](AGENTS.md)
- [Project context](docs/project-context.md)
- [Current status](docs/current-status.md)
- [Latest handoff](docs/handoffs/latest.md)
- [Cross-repository implementation plan](docs/implementation-plan.md)
- [Architecture index](docs/architecture/README.md)
- [Disaster recovery](docs/operations/disaster-recovery.md)
- [Project learnings](PROJECT_LEARNINGS.md)

Backend documentation is canonical in `ivangemini/smart-fitness-backend`. Mobile [`docs/backend/README.md`](docs/backend/README.md) is a redirect only; backend API/database/architecture copies must not be maintained here.

## Run

```bash
npm install
npx expo start
```

## API configuration

Set `EXPO_PUBLIC_API_BASE_URL` for the backend. Production defaults to `https://api.peptonio.com`.

`EXPO_PUBLIC_FOOD_API_BASE_URL` is a backwards-compatible fallback only where already supported.

Do not add model, moderation, storage, OCR, push-provider or other service credentials to Expo environment variables. The app consumes normalized backend DTOs and never calls those providers directly.

## Release boundary

A merge to `main` is not an OTA, native build, device installation, backend deployment or production activation. Native dependency/plugin/entitlement/Pod/runtime/binary changes require a matching native build and explicit release authorization.
