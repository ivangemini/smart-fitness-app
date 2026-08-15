# Phase 14 — Active product workstreams

Updated: 2026-08-15

Status: explicitly prioritized bounded completion program; provider/native/deployment activation remains separately gated.

This file is a forward roadmap only. The detailed backend implementation baseline lives once in [backend `docs/project-context.md`](https://github.com/ivangemini/smart-fitness-backend/blob/main/docs/project-context.md). Exact source/tests/Git history remain authoritative.

## Checkpoints

- mobile current `main`: `9313fa18419dc657423a7d363724b017b8519392` (#662);
- mobile active prepared branch: `fix/p14-home-steps-docs`;
- backend current `main`: `2b73f34e168d7a6a1dd4087df1a1992e44137d54` (#241).

Closed provider-neutral backend packages #237–#241 must not be reimplemented. Their exact invariants are owned by the backend baseline/reference set.

## Active workstreams

### P14-A — Real push delivery

**Status:** provider-neutral source path and authenticated-device registration authority are complete; external provider/native/runtime activation remains gated.

Canonical stop/go checklist: `docs/qa/push-runtime-evidence-matrix.md`.

Remaining work:

1. concrete APNs/FCM adapters and configured-environment evidence;
2. provider credentials and production worker scheduling;
3. explicit native permission UX;
4. native device-token acquisition/rotation and backend convergence;
5. offline logout/reconnect server convergence without retaining reusable auth credentials;
6. final external notification content/privacy/deep-link policy;
7. physical-device and second-account/device isolation evidence.

### P14-B — Labs / Analyses completion

**Status:** approved provider-neutral source composition and strict confirmed-structured-facts-only Coach/model exposure policy are complete; provider/native/runtime work gated.

Remaining work:

- production private storage/OCR/model provider selection/configuration;
- authorized backend deployment/migrations;
- PDF native picker/dependency;
- provider/device/accessibility/runtime evidence.

Diagnosis, treatment/dosing state and unrestricted raw-document/OCR/provider model exposure remain outside the approved contract.

### P14-C — Stories runtime completion

**Status:** source-complete; evidence/runtime only unless a defect is reproduced.

Use `docs/qa/stories-s10-runtime-matrix.md` to distinguish source/CI, deployed backend/migration, physical-device and second-device/privacy/lifecycle evidence.

### P14-D — Steps / native health activity

**Status:** provider-neutral source/day-boundary/fail-closed semantics are complete. The active mobile branch additionally consumes the source on Home and refreshes it on foreground/local-day rollover with DST boundary coverage.

Remaining work: reviewed HealthKit/Health Connect read-only adapters/dependencies, explicit permission/disclosure UX, denied/unsupported runtime evidence and physical-device evidence.

## Parallel execution rules

Independent work may proceed in parallel only when contracts/files do not overlap. While activation gates are closed, useful parallel work is read-only lifecycle/content/deep-link audits, QA/evidence preparation, canonical docs/reference synchronization and bounded fixes for reproduced defects.

Do not manufacture broad source branches solely to keep Phase 14 active.

## Validation gates

- mobile source: exact-head Mobile CI before merge;
- backend source: applicable exact-head Backend CI/PostgreSQL CI/account-deletion gates;
- provider/native/runtime: configured-environment, native build and physical-device evidence as applicable.

Source CI does not substitute for provider/device/deployment evidence.

## Current execution order

1. Validate the active mobile Steps/docs branch.
2. Keep short status/handoff/roadmaps linked to the canonical backend baseline rather than copying it.
3. Enter APNs/FCM/native push only after explicit provider/native authorization.
4. Keep Labs provider-neutral source/model-exposure composition closed unless a reproduced defect appears; otherwise next work is provider/native/runtime evidence.
5. Collect Stories runtime evidence only in authorized environments.
6. Enter HealthKit/Health Connect only after explicit dependency/permission authorization.
7. Re-synchronize canonical pointers after material merges.

## Closed activation boundaries

Without direct authorization, do not deploy backend code, execute production migrations, schedule/activate production workers, activate APNs/FCM/provider credentials, request native push permission implicitly, activate HealthKit/Health Connect, activate production Labs providers, publish OTA/EAS, build/install native releases, access/mutate production data or submit to app stores.
