# Mobile CI runner policy

Updated: 2026-08-10

## Decision

Routine authoritative Mobile CI runs on the dedicated self-hosted runner label:

`[self-hosted, linux, x64, hermes-mobile-ci]`

Runtime pull requests, direct non-merge pushes to `main`, and manual Mobile CI dispatches use this runner class.

## Preserved validation gate

Moving the runner does not reduce the required validation surface. The authoritative Mobile CI still includes:

- repository file line audit;
- changed-file line limit;
- TypeScript;
- full regression suite;
- bounded expanded-model smoke;
- Expo export;
- Expo Doctor.

`concurrency.cancel-in-progress: true` remains required so obsolete runs for the same PR/ref do not continue consuming runner capacity.

Documentation-only changes remain excluded through the existing path filters.

## Merge-push deduplication

A normal pull request must pass the authoritative exact-head Mobile CI before merge. The subsequent GitHub-generated `Merge pull request #…` push to `main` is the same validated source tree wrapped in the merge commit and must not immediately repeat the full gate.

The workflow therefore skips merge-generated `main` pushes while retaining validation for direct/non-merge pushes to `main` and manual dispatch. This matches the existing backend CI deduplication contract and prevents already-validated merges from monopolizing the single Hermes runner while other repository checks wait.

## Why Hermes is authoritative for routine validation

The same `hermes-mobile-ci` runner class already executes the scheduled mobile adversarial model job and the mobile release-validation job, including Node/npm installation, mobile tests, Expo Doctor, and Expo export. Routine Mobile CI therefore does not require a separate GitHub-hosted Linux execution environment.

The 2026-08-09 scheduled adversarial workflow demonstrated that the mobile job can complete successfully on this runner class. That workflow's overall failure occurred in the separate private-backend checkout job and is not evidence of a mobile runner failure.

## Hosted-runner fallback

Do not move routine Mobile CI back to `ubuntu-latest` merely as a convenience or diagnostic shortcut. A GitHub-hosted fallback requires an explicit, demonstrated Hermes incompatibility or outage and should be bounded to the affected validation rather than permanently duplicating the full gate.

Do not run both Hermes and GitHub-hosted copies of the same authoritative mobile gate in parallel.

## Release and deployment boundary

This runner policy changes CI execution location and deduplication only. It does not authorize OTA/EAS publication, native builds or installation, backend deployment, production migration execution, provider activation, credential changes, or store submission.
