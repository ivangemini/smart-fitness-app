# Phase 14 — Authorized runtime activation

Updated: 2026-08-16

Status: **explicitly authorized for implementation and runtime validation.**

This package reopens only the previously gated provider/native/deployment work. It does not reopen completed provider-neutral source architecture without reproduced defects.

## Authorized workstreams

### A. Push staging and device evidence

Authorized:

- configure APNs/FCM credentials in an authorized non-production environment;
- deploy the validated backend checkpoint and required migrations to staging/Hermes;
- run `push:delivery-readiness` and bounded one-shot delivery workers;
- exercise success, transient/permanent failure, timeout/unknown-result, restart recovery and redaction;
- create/install native builds needed for physical-device evidence;
- test foreground/background/terminated delivery, deep links, logout, account/device isolation and offline/reconnect behavior;
- fix reproduced defects and repeat exact-head validation.

Production activation remains a separate final rollout step after staging/device evidence. Credentials must never be committed or printed into evidence.

### B. Labs / Analyses provider activation

Authorized:

- select and configure private storage, OCR and model providers;
- implement the provider adapters required by the existing confirmed-result workflow;
- add the native PDF picker/dependencies required for real document ingestion;
- run required backend migrations/deployment in an authorized environment;
- define the internal model-tool exposure allowlist and preserve confirmation before interpretation;
- collect provider, physical-device and accessibility evidence;
- keep raw OCR draft text non-authoritative and fail closed when provider/runtime configuration is unavailable.

### C. Steps native health integration

Authorized:

- add reviewed read-only HealthKit and Health Connect adapters/dependencies;
- add explicit user-initiated permission/disclosure UX;
- connect the existing `StepActivitySource` contract to real native aggregate data;
- collect denied, unsupported, DST/local-day and physical-device evidence;
- validate Home presentation against real aggregate data;
- do not request write permissions or write health data.

### D. Deployment/build actions

Authorized where required by A–C:

- backend staging/Hermes deployment and migrations;
- worker/service configuration in staging;
- EAS/native development or internal builds and installation for evidence;
- provider configuration using external secret stores;
- OTA only when the change is OTA-compatible and native runtime has not changed.

Do not commit credentials. Do not mutate production user data for testing. Production rollout must remain staged, observable and rollback-capable.

## Execution order

1. Prepare source changes for Steps native adapters and Labs provider/native integration in bounded workstreams.
2. Run exact-head Mobile/Backend CI after substantial batches, not after every small edit.
3. Deploy the validated backend checkpoint to staging/Hermes and run migrations/readiness checks.
4. Configure non-production providers through secret storage and collect push/Labs runtime evidence.
5. Build/install the native app containing Health/Labs native dependencies and collect device evidence.
6. Repair only reproduced defects, revalidate, and update canonical status/evidence matrices.
7. Consider production activation only after staging/device evidence is green.

## External blockers

Actions that require secrets, Apple/Google provider accounts, signing identities or a physical-device interaction remain executable only when those resources are actually available to the acting environment. Their absence is an access blocker, not a scope restriction.
