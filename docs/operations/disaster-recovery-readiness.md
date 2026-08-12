# Smart Fitness — Disaster Recovery Readiness Matrix

Updated: 2026-08-12

## Purpose

This checklist tracks whether Smart Fitness can actually be recovered, not merely whether recovery instructions exist. It intentionally contains no passwords, API keys, private signing keys, backup passphrases, recovery codes, seed phrases, session cookies, or other credentials.

Canonical procedures:

- mobile/cross-repository recovery: `docs/operations/disaster-recovery.md`;
- external account registry: `docs/operations/external-recovery-registry.md`;
- backend recovery: `ivangemini/smart-fitness-backend/docs/operations/disaster-recovery.md`.

Exact Git history, runtime evidence and external account state override this document if it becomes stale.

## Status vocabulary

- **KNOWN** — identity/configuration is recoverable from source or already evidenced without using secrets.
- **UNVERIFIED** — a documented recovery path exists, but no current operational evidence proves it works.
- **BLOCKED** — recovery requires external account access, credentials, provider state, signing material, production data or another action that source control cannot establish.
- **PROVEN** — a dated non-production recovery exercise or equivalent evidence has demonstrated the step end to end.

Do not mark an item PROVEN from documentation alone.

## Readiness matrix

| Area | Current status | Source evidence | What closes the gap | Evidence to record |
|---|---|---|---|---|
| Mobile repository | KNOWN | `ivangemini/smart-fitness-app` | Keep GitHub recovery access available | GitHub account/team recovery owner + last access verification date |
| Backend repository | KNOWN | `ivangemini/smart-fitness-backend` | Keep GitHub recovery access available | GitHub account/team recovery owner + last access verification date |
| Mobile runtime/source checkpoint | KNOWN | Current `main`; S9-E runtime merge `98dcd668c91533b5dafb0f443f70b24c02824a8a`, later docs-only merges do not alter runtime | Read exact current Git `main` during an incident | Incident recovery commit SHA |
| Backend runtime/source checkpoint | KNOWN | Current backend `main`; S9-E runtime merge `677231145d4fc87b8f2e9f2cc6e3d2ab96b76dab`, later docs-only DR merge does not alter runtime | Read exact current Git `main` during an incident | Incident recovery commit SHA |
| Production API identity | KNOWN | `https://api.peptonio.com` | Preserve DNS/domain ownership | Registrar/provider, zone owner, last access verification |
| Backend clean-host topology | KNOWN | Backend Docker Compose + Caddy + DR runbook | Rebuild only during an authorized recovery/test | Replacement-host build record and smoke results |
| PostgreSQL backup command | KNOWN | Backend DR/deployment docs define encrypted `pg_dump` pipeline | Maintain command with schema/runtime changes | Command review date |
| Automated PostgreSQL backup schedule | UNVERIFIED | Source documents desired backup behavior only | Verify actual scheduler/timer/cron and successful recent executions | Scheduler identifier, cadence, last success UTC, backup object/file identifier |
| Off-host PostgreSQL backup | UNVERIFIED | DR policy requires a copy outside the primary VPS failure domain | Verify at least one current encrypted copy exists off-host | Destination/provider identifier, backup timestamp, integrity/hash metadata where available |
| Backup encryption material recovery | BLOCKED | Source intentionally excludes passphrase/key | Record approved secret-store/vault location and recovery owner | Secret-store name/path reference only + last recovery-access verification |
| PostgreSQL restore drill | UNVERIFIED | Restore pipeline is documented | Perform an explicitly authorized restore into a disposable/non-production database and verify application invariants | Date, source backup timestamp, target environment, migration result, smoke result, cleanup confirmation |
| VPS/Hermes account recovery | BLOCKED | Host role and CI runner names are documented | Record VPS provider/account and rescue-console/recovery path | Provider/account identifier, recovery owner, last console access verification |
| DNS recovery | BLOCKED | Domain/API identity is known | Record registrar/DNS provider, account/team and zone recovery path | Provider, zone identifier, recovery owner, last access verification |
| TLS recovery | UNVERIFIED | Caddy configuration and automatic TLS path are documented | Demonstrate on an authorized replacement/non-production hostname or incident recovery | DNS/TLS issuance evidence and HTTPS health result |
| Backend production secret store | BLOCKED | `.env.production.example` defines required names only | Record approved secret-store/vault and owner | Vault/store name and path references only; never values |
| Auth signing/token secrets | BLOCKED | Required variable names are known | Ensure recoverable copies exist in approved secret store | Store/path reference + last access verification |
| Object storage / CDN | BLOCKED unless inactive | Backend capability contracts exist but active production provider is not proven by source | Establish whether each provider is active; if active, record account/resource recovery | Provider/account, bucket/namespace/base-URL ownership, last access verification |
| Social moderation / OCR / model / email providers | BLOCKED unless inactive | Capability selectors are source-defined and fail-closed | Record active/inactive production state and recovery account for each active provider | Provider/account identifiers and last access verification |
| Expo/EAS project identity | KNOWN | Project ID `0f2acce2-b968-4b48-87de-5622ccdec60c`, update URL/channel in repo | Preserve account/team access | Expo account/team recovery path + last access verification |
| EAS environment secrets | BLOCKED | Secret values are intentionally external | Record EAS environment/secret custody and recovery owner | Environment names + custody reference, not values |
| iOS application identity | KNOWN | Bundle ID `com.dzahard28.smartfitnessapp` | Preserve Apple team/App Store Connect access and signing recovery | Apple team/account recovery path, last access verification |
| iOS signing credentials | BLOCKED | Git must not contain private signing keys/profiles | Verify EAS-managed or Apple-managed recovery path before a binary incident | Credential custody mode + last recovery verification |
| Android application identity | KNOWN | Package `com.dzahard28.smartfitnessapp` | Preserve Play Console/signing access if Android release is in scope | Google Play account/recovery path |
| Android signing credentials | BLOCKED if Android release is in scope | Signing material is external | Verify Google/EAS signing custody | Custody mode + last access/recovery verification |
| Mobile source rebuild | KNOWN | package/Expo config/source are in Git | Reconstruct on a clean machine when authorized/needed | Node/npm versions, install/type/test/export result |
| Native binary recovery | UNVERIFIED | Bundle/package/EAS identities are documented | Perform separately authorized clean-machine EAS/native recovery evidence | Build ID, profile, signing source, install/launch evidence |
| End-to-end auth/sync recovery | UNVERIFIED | Backend/mobile smoke sequence is documented | After an authorized recovery drill, verify auth + revisioned sync using non-production/test account | Test account scope, endpoints/actions, result, cleanup |
| Social/Stories recovery | UNVERIFIED | Server-authoritative source contracts and S9-E source/CI are complete | Verify only after DB/storage/provider dependencies are restored and authorized | Read/write/privacy/lifecycle smoke evidence |
| CI runner reconstruction | UNVERIFIED | `hermes-mobile-ci-01` / `hermes-backend-ci-01` labels and policies are documented | Document runner registration/service reconstruction without storing registration tokens | Runner service names, host path, labels, last reconstruction/access verification |
| Recovery incident logging | UNVERIFIED | Runbooks require evidence recording | Define durable incident record location | Incident log location, owner, template link |

## Highest-priority gaps

The project should not be called production disaster-recovery-ready until these are evidenced:

1. **Automated encrypted PostgreSQL backups are actually running.**
2. **At least one current backup exists outside the primary VPS failure domain.**
3. **A real restore into a disposable/non-production database has succeeded.**
4. **The backup encryption material and backend production secrets have a recoverable approved custody path.**
5. **VPS and DNS account recovery paths are recorded and accessible.**
6. **Expo/EAS and Apple signing/account recovery paths are verified.**
7. **Active production providers are explicitly identified instead of inferred from source configuration.**

Items 1–7 require external/operational evidence. Source code cannot truthfully mark them complete.

## Restore-drill evidence template

Use this template after an explicitly authorized non-production restore exercise:

```text
Date/time UTC:
Operator:
Source backend commit:
Source backup timestamp / identifier:
Backup storage location identifier (no credentials):
Target disposable environment:
Decrypt: PASS / FAIL
PostgreSQL restore: PASS / FAIL
Migration status: PASS / FAIL
/health HTTPS: PASS / FAIL
Auth smoke: PASS / FAIL
Revisioned sync smoke: PASS / FAIL
Ownership/privacy invariant: PASS / FAIL
Optional active provider smoke: PASS / FAIL / NOT IN SCOPE
Cleanup of disposable environment: PASS / FAIL
Observed RPO:
Observed RTO:
Follow-up defects/issues:
```

## Recovery-account verification template

For GitHub, VPS, DNS, secret store, Expo/EAS, Apple, Google and active providers, record outside source control or in an approved non-secret registry:

```text
Service:
Account/team identifier:
Human recovery owner:
Management console location:
Recovery method available: YES / NO
MFA recovery method verified: YES / NO
Secret-store/vault path reference (name only):
Resource IDs relevant to recovery:
Last successful access verification date:
Notes without credential values:
```

## Safety boundary

This matrix is documentation and prioritization only. It is not authorization to:

- access or copy production data;
- execute a database restore or migration;
- rotate/read/change credentials;
- alter DNS or TLS;
- deploy/redeploy the backend;
- activate providers;
- publish OTA/EAS updates;
- create/install native production builds;
- alter signing credentials;
- submit to an app store.

Those actions require their normal explicit authorization and must produce dated evidence when performed.
