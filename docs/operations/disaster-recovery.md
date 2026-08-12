# Smart Fitness — Cross-Repository Disaster Recovery

Updated: 2026-08-12

## Purpose

This is the cross-repository recovery index for rebuilding Smart Fitness after loss of a developer machine, VPS, local configuration, or production deployment state. It intentionally contains no real secrets. Exact code, Git history, backend migrations, EAS configuration, and current operational evidence override stale prose.

Repositories:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`;
- production API: `https://api.peptonio.com`.

Backend server/database recovery is defined in `ivangemini/smart-fitness-backend/docs/operations/disaster-recovery.md`.

Operational proof status is tracked separately in `docs/operations/disaster-recovery-readiness.md`. Do not infer that a recovery step is proven merely because this runbook documents it.

## Recovery order

Use this order because later layers depend on earlier authority:

1. recover GitHub account/repository access;
2. recover the backend host and PostgreSQL data;
3. recover DNS/TLS and confirm the public API;
4. recover only enabled external providers and managed-media infrastructure;
5. recover Expo/EAS project access and mobile build configuration;
6. recover Apple/Android signing and store access if a new binary is required;
7. install/launch the mobile client against the recovered API;
8. run end-to-end auth/sync/domain smoke checks;
9. record the recovery event and remaining gaps.

A merge, build, deployment, migration, DNS change, provider activation, signing action, OTA publication, or store submission remains an explicit operational action. This document is not authorization to execute one.

## What GitHub already preserves

The repositories contain the application source, tests, migrations, architecture contracts, CI configuration, Docker deployment topology, example environment contracts, Expo/EAS configuration, stable mobile identifiers, and current roadmap/status documentation.

A total loss of a local Mac/worktree is therefore recoverable from GitHub without reconstructing application logic from memory.

## Mobile reconstruction from a clean machine

Required source files include:

- `package.json` / lockfile;
- `app.json`;
- `app.config.ts`;
- `eas.json`;
- `src/`;
- assets and Expo plugins;
- release/QA documentation under `docs/`.

Baseline developer reconstruction:

```bash
git clone <mobile repository>
cd smart-fitness-app
npm install
npx expo start
```

API configuration:

```text
EXPO_PUBLIC_API_BASE_URL
```

Production code defaults to `https://api.peptonio.com`. Provider secrets must never be placed in Expo public environment variables.

## Stable mobile identity

Current repository configuration records:

```text
Expo slug: smart-fitness-app
iOS bundle identifier: com.dzahard28.smartfitnessapp
Android package: com.dzahard28.smartfitnessapp
URL scheme: smartfitnessapp
EAS project ID: 0f2acce2-b968-4b48-87de-5622ccdec60c
EAS update URL: https://u.expo.dev/0f2acce2-b968-4b48-87de-5622ccdec60c
Production update channel: production
runtimeVersion policy: appVersion
```

These identifiers are recovery-critical because changing them can create a different application identity rather than restoring the existing product.

## EAS / native recovery

The repository preserves build profiles in `eas.json`:

- `development` — internal distribution, production environment/channel;
- `preview` — internal distribution, production environment/channel;
- `production` — production distribution with auto-increment;
- `production-internal` — internal distribution using production environment/channel.

A clean workstation must still recover external account access that Git cannot contain:

- Expo/EAS account with access to project `0f2acce2-b968-4b48-87de-5622ccdec60c`;
- Apple Developer / App Store Connect team for `com.dzahard28.smartfitnessapp`;
- Android/Google Play account and signing material when Android distribution is used;
- any EAS environment secrets or signing credentials stored outside GitHub.

Do not replace lost signing credentials casually. First determine whether EAS/Apple/Google retain recoverable managed credentials and whether rotation would affect installed builds or store identity.

## Backend dependency

The mobile app is offline-first for private state, but server-authoritative auth, sync, Social/Stories, managed media and provider-backed capabilities depend on the backend. Recover the backend before declaring the system restored.

Canonical backend recovery steps live in:

```text
smart-fitness-backend/docs/operations/disaster-recovery.md
smart-fitness-backend/docs/deployment.md
smart-fitness-backend/.env.production.example
smart-fitness-backend/docker-compose.prod.yml
```

## Data classes and recovery implications

Private mobile fitness state is locally persisted and revision-synchronized with the backend for the established sync entities. Social/Stories/managed-media state is server-authoritative and must not be reconstructed from private mobile AppState.

A server disaster therefore has different consequences:

- local private data may still exist on devices, but should not be treated as a substitute for a verified server restore;
- Social/Stories/media require their authoritative backend/database/storage recovery path;
- SecureStore tokens can be reissued through authentication and are not a backup source;
- AsyncStorage on one device is not an infrastructure backup strategy.

## End-to-end recovery verification

After backend recovery and before release claims, verify at minimum:

```text
Backend /health over HTTPS
register/login/me/refresh/logout
Data & Sync status
bounded private sync push/pull round trip
mobile app reaches production API
existing local state loads after reinstall/upgrade scenario being tested
Workouts/Nutrition/Progress/Profile basic navigation
Social/Stories only if their deployed dependencies are configured
Coach provider path only if intentionally enabled; deterministic fallback remains valid where defined
```

Physical-device, second-device, native signing, provider, deployment and production evidence must be labeled separately from source/CI evidence.

## External recovery registry

Git cannot safely contain the real credentials required to recover every external service. Maintain `docs/operations/external-recovery-registry.md` as a non-secret index of account ownership and recovery locations. The registry must identify where access can be recovered without storing passwords, API keys, private keys, passphrases, recovery codes or seed phrases.

## Recovery readiness

Use `docs/operations/disaster-recovery-readiness.md` to distinguish:

- source-known identities/configuration;
- operational paths that are documented but unverified;
- external dependencies that are blocked on account/credential/provider access;
- dated recovery exercises that are actually proven.

The project must not be described as production disaster-recovery-ready until the highest-priority unverified/blocked items in that matrix are evidenced.

## Recovery completeness levels

Use these states in incident notes:

- **Source recovered:** repositories, exact revisions and local build/test capability are restored.
- **Backend recovered:** PostgreSQL, migrations, API and TLS are healthy.
- **Provider recovered:** intentionally enabled storage/media/model/email/moderation capabilities are healthy.
- **Mobile build recovered:** existing EAS/native application identity and signing access are available.
- **End-to-end recovered:** a real client can authenticate, sync and use all currently enabled production domains.

Do not call the product fully recovered when only source code or CI is available.
