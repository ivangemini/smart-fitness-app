# Smart Fitness — External Recovery Registry

Updated: 2026-08-12

## Purpose

This is a non-secret registry of infrastructure and account dependencies that cannot be reconstructed from source code alone. It must never contain passwords, API keys, private signing keys, backup passphrases, seed phrases, recovery codes, session cookies, or raw credentials.

Use it to answer one question during an incident: **where does an authorized operator go to recover access?**

## Registry

| Asset | Repository evidence | Recovery owner/location to record | Current status |
|---|---|---|---|
| GitHub mobile repository | `ivangemini/smart-fitness-app` | GitHub account/org recovery path | Known repository; external account recovery not recorded here |
| GitHub backend repository | `ivangemini/smart-fitness-backend` | GitHub account/org recovery path | Known repository; external account recovery not recorded here |
| Production API domain | `api.peptonio.com` | DNS registrar/provider account and zone owner | Domain known; registrar/provider recovery path not proven in Git |
| Production VPS / Hermes host | backend deployment and CI runner docs | VPS provider, account identifier, rescue-console/recovery path | Host role known; provider/account recovery path not proven in Git |
| Backend secret store | `.env.production.example` defines required keys | Password manager/secret manager name and vault/path | Required; actual secret-store location not proven in Git |
| PostgreSQL backups | backend `docs/deployment.md` and DR runbook | Off-host backup destination, schedule owner, retention, restore-test record | Backup command exists; actual automation/off-host copy must be verified |
| Backup encryption material | backend backup command | Approved secret-store entry/path | Required; never commit value |
| Expo/EAS project | EAS project ID `0f2acce2-b968-4b48-87de-5622ccdec60c` | Expo account/team recovery path | Project identity known; account recovery path external |
| Apple application identity | bundle ID `com.dzahard28.smartfitnessapp` | Apple Developer/App Store Connect team and account recovery path | Bundle ID known; team/recovery path external |
| Android application identity | package `com.dzahard28.smartfitnessapp` | Google Play account and signing recovery path | Package known; account/signing recovery path external |
| EAS/native signing credentials | `eas.json` build profiles | EAS managed credentials and/or Apple/Google signing custody location | Must be verified before a binary-recovery incident |
| Private object storage | backend `.env.production.example` | Provider/account, bucket/namespace, recovery owner | Capability defined; active provider not proven from source alone |
| Immutable media delivery/CDN | backend `.env.production.example` | Provider/account, bucket/namespace, public base URL ownership | Capability defined; active provider not proven from source alone |
| Coach model provider | backend `.env.production.example` | Provider account and key custody location | Disabled-by-default contract; active production provider must be verified externally |
| Social moderation provider | backend `.env.production.example` | Provider account and key custody location | Disabled-by-default contract; active production provider must be verified externally |
| Rekognition classifier/OCR | backend `.env.production.example` | AWS account/role and credential custody location | Capability defined; active state external |
| Password-reset delivery | backend `.env.production.example` | Email/provider account and sender-domain ownership | Capability defined; active state external |
| FatSecret | backend `.env.production.example` | Provider account and credential custody location | Optional capability |
| CI self-hosted runners | mobile/backend CI policy docs | GitHub runner registrations + Hermes host service recovery path | Runner classes documented; recovery credentials external |

## Required maintenance fields

For every production-active row, the operator should record outside source control or in an approved non-secret inventory:

```text
provider/service name
account/team identifier
human recovery owner
management-console location
secret-store/vault path (name only, no secret value)
resource identifiers such as zone/bucket/project/team IDs
billing owner where service suspension could affect recovery
last access verification date
last backup/restore verification date where applicable
```

## Critical unresolved evidence

The following facts cannot be established safely from repository source alone and should be verified operationally before calling disaster recovery production-ready:

1. whether PostgreSQL backups are actually scheduled automatically;
2. whether at least one backup copy exists outside the primary VPS failure domain;
3. date/result of the last real restore drill into a non-production database;
4. location of the backup encryption passphrase/key;
5. VPS provider/account and rescue-access procedure;
6. DNS registrar/provider and account recovery procedure;
7. approved backend secret-store location;
8. Expo/EAS account/team recovery path and credential custody;
9. Apple Developer/App Store Connect team ownership and recovery path;
10. Android/Google Play signing custody if Android release is in scope;
11. which object-storage/CDN/provider capabilities are actually active in production today.

Once these are filled, this registry should contain references to locations/owners only, never credential values.

## Review cadence

Review this registry after any change to hosting, DNS, signing, EAS ownership, backup destination, secret store, storage/CDN, model/moderation provider, email delivery, or CI runner infrastructure. A source-complete feature that is not activated does not need fabricated production ownership data.
