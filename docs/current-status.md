# Smart Fitness Current Status

Updated: 2026-08-16

Exact code, tests, migrations and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Latest runtime/source merge: `4ea37c11c81fafc64c2ef5e1e8479868b66e689e` (#675).

Recent Phase 14 push source includes:

- #663 — registration aligned to server-owned authenticated device authority;
- #667 — native Expo Notifications runtime, explicit notification settings UX, native APNs/FCM token acquisition, token rotation synchronization, foreground presentation, cold-start tap consumption and auth-gated allowlisted Story routing;
- #669 — foreground registration reconciliation and lease renewal;
- #674 — queued operation user-provenance enforcement across auth changes;
- #675 — authenticated-only foreground push renewal and signed-out regression coverage.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Latest runtime/source merge: `b1643893fc42c57ceaaa54094a1c1c4e1e58b068` (#252).

Recent Phase 14 push/security source includes:

- #237 — durable PostgreSQL outbox + provider-neutral worker;
- #238/#240 — Story enqueue/source-removal/preference cancellation and race hardening;
- #242 — concrete APNs HTTP/2 and FCM HTTP v1 transports;
- #245 — explicit fail-closed provider environment composition;
- #246 — atomic refresh-token CAS rotation with concurrent HTTP regression coverage;
- #247 — bounded manual push worker plus configurable registration freshness lease for offline-registration convergence;
- #249 — privacy-minimized generic Story notification payload regression coverage;
- #250 — provider-token account handoff regression proving one current authenticated owner/device;
- #252 — privacy-safe push delivery readiness manifest/CLI, rollout and rollback evidence template, source-prepared Docker/systemd one-shot entrypoints and operational runbook without activating provider delivery.

Provider delivery remains disabled unless the explicit master/provider switches and complete credentials are supplied. #252 prepares rollout verification and rollback contracts only; no provider credential, production deployment, scheduler activation or physical-device evidence is implied.

## Phase 14 status

**Phase 14 has reached source/CI completion for the currently authorized provider-neutral/native contracts.** Remaining work is environment evidence or separately gated activation, not an unfinished general implementation package.

Focused roadmap: `docs/roadmap/phase14-active-workstreams.md`.

### P14-A — Push

Source/CI now covers registration authority, logout/session cleanup, durable delivery, provider transports, fail-closed configuration, bounded registration freshness, native token lifecycle, auth-only foreground renewal, generic external payload privacy, account handoff and a privacy-safe operational readiness/rollback contract.

The offline logout boundary is now bounded at source level by two complementary rules:

- mobile erases reusable auth credentials even when remote logout cannot run;
- backend delivery eligibility expires unless an authenticated client renews the registration freshness lease.

That removes the prior source-level stop-gate without weakening logout by retaining credentials.

The merged rollout-readiness source adds a read-only `push:delivery-readiness` manifest that reports only provider selection, credential-field presence, configuration validity, registration lease and readiness booleans. It does not emit provider identifiers, private keys, service-account addresses or raw credential values. A reviewed rollout/rollback runbook and external evidence-record template now define the staging-first activation order while keeping master delivery disabled through initial deployment.

Runtime evidence still pending:

- configured APNs/FCM sends through the reviewed worker;
- provider success/transient/permanent/timeout/restart/redaction behavior in an authorized environment;
- physical-device permission/token/background/terminated-app behavior;
- authenticated/logged-out notification tap behavior;
- second-device/account isolation against real clients/providers;
- offline/reconnect ordering evidence, including network restoration before JS execution;
- production credentials, worker scheduling and deployment as separately authorized rollout actions.

Canonical checklist: `docs/qa/push-runtime-evidence-matrix.md`. Backend operational runbook: `docs/operations/push-delivery-rollout.md` in `smart-fitness-backend`.

### P14-B — Labs / Analyses

Provider-neutral Labs source remains complete through confirmed-result interpretation presentation. Remaining work is explicitly gated provider/native/deployment scope: production private storage/OCR/model configuration, authorized migrations/deployment, PDF native picker/dependency, internal model-tool exposure policy and provider/device/accessibility evidence.

### P14-C — Stories

Stories S10 remains source-complete. Continue only deployment/device/privacy evidence through `docs/qa/stories-s10-runtime-matrix.md` plus bounded fixes for reproduced defects.

### P14-D — Steps

Provider-neutral Steps source remains complete through deterministic unavailable state, device-local calendar-day windows, DST-safe 23/24/25-hour handling and no fake/workout-derived Steps. HealthKit/Health Connect integration and physical-device evidence remain separately gated.

## Companion

Phase 13 Companion v1 remains the bounded merged baseline. Richer pet/cosmetics/naming/progression stays deferred unless explicitly reprioritized.

## CI execution

Mobile authoritative routine CI uses `[self-hosted, linux, x64, hermes-mobile-ci]` and includes repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Backend authoritative routine CI uses `[self-hosted, linux, x64, hermes-backend-ci]` and applicable lint/format/build/test/PostgreSQL/account-deletion gates. Backend #252 merged only after exact-head Backend CI, PostgreSQL CI and Account Deletion Receipt CI all passed.

Do not substitute source CI or a green readiness manifest for configured-provider, physical-device, deployment or production evidence.

## Current remaining roadmap

1. Keep Phase 14 source closed unless a reproduced defect or explicitly opened gated package appears.
2. Use `docs/qa/push-runtime-evidence-matrix.md` plus the backend rollout runbook/evidence template for remaining P14-A external evidence.
3. Collect Stories/Labs/Steps provider/device/deployed evidence only in authorized environments.
4. Keep provider-backed capabilities fail closed until their activation gates are explicitly opened.
5. Re-synchronize canonical docs after material runtime-evidence or rollout checkpoints.
6. Move ordinary autonomous source work to the next explicitly prioritized roadmap phase rather than creating artificial Phase 14 refactors.

## Safety / activation boundaries

Do not perform without direct authorization: OTA/EAS publication, native release build/install, backend deployment, production migrations, production push worker scheduling, production data access/mutation, APNs/FCM credential activation/rotation, HealthKit/Health Connect activation, production Labs provider activation, DNS changes, destructive production cleanup or app-store submission.
