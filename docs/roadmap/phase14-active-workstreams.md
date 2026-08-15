# Phase 14 — Active product workstreams

Updated: 2026-08-16

Status: explicitly prioritized bounded completion program; provider/device/deployment/production activation remains separately gated.

Exact code, tests, migrations and Git history remain authoritative.

## Verified merged baseline

### Mobile

Latest runtime/source merge: `de2f0f01d2167aa91d7167130159f1b63c595b35` (#667).

P14-A mobile source now includes server-owned registration contract alignment #663 and the native Expo Notifications runtime #667.

### Backend

Latest runtime/source merge: `c7108f3fb98818cdb726c28a4e235ef642b7902d` (#245).

P14-A backend source now includes concrete APNs/FCM transports #242 and fail-closed environment composition #245 in addition to the durable outbox/worker and Story enqueue/cancellation foundation.

## Active workstreams

### P14-A — Real push delivery

**Status: provider/native source and CI path complete; configured-provider, physical-device, isolation, reconnect and rollout evidence remain.**

Canonical stop/go checklist: `docs/qa/push-runtime-evidence-matrix.md`.

#### Completed source foundation

Backend:

- authenticated persistent owner/device registrations;
- current-device and remote-session registration cleanup;
- durable PostgreSQL outbox + provider-neutral delivery worker;
- claim/lease ownership and stale-worker fencing;
- bounded retry/backoff;
- exact-registration invalid-token handling with rotation protection;
- Story interaction enqueue and source-removal/preference cancellation;
- concrete APNs HTTP/2 transport;
- concrete FCM HTTP v1 transport;
- fail-closed provider composition requiring `PUSH_DELIVERY_ENABLED=true`, explicit provider enablement and complete credentials.

Mobile:

- authenticated registration bound to the server-owned `AuthSession.device.id`;
- local logout that erases session/access/refresh credentials even when remote logout fails;
- Expo Notifications native adapter;
- explicit Settings → Notifications permission entry point;
- no implicit permission prompt during bootstrap;
- APNs/FCM native device-token acquisition after allowed/provisional permission;
- token-rotation listener and re-registration;
- foreground notification presentation;
- one-time cold-start notification response consumption;
- Story destination allowlist;
- active-auth requirement before notification routing;
- `expo-notifications` config plugin and reproducible npm lockfile.

#667 exact head `923435267ae09e02671dcafcb04c88dfeae31ff2` passed all Mobile CI gates before merge.

#### Remaining push work

1. **Configured-provider runtime evidence** — exercise APNs/FCM transports through the durable worker in an authorized non-production environment, including success, transient failure, permanent invalid token, timeout/unknown result, restart recovery and redaction.
2. **Physical-device evidence** — permission states, granted/provisional token sync, token rotation, foreground/background/terminated-app delivery and authenticated/logged-out Story taps.
3. **Second-device/account isolation** — independent revoke/logout/account handoff and Story preference/source-removal behavior.
4. **Offline logout/reconnect convergence** — stale server registration eligibility must converge without retaining reusable auth credentials after logout; policy must cover network returning before JS runs and long-offline devices.
5. **External content/privacy policy** — keep notification content privacy-minimized and do not expose Story/reply/actor/private-health content before the reviewed in-app fetch.
6. **Production rollout** — provider credentials and worker scheduling remain separate explicit activation actions.

Do not rebuild the durable worker, Story enqueue/cancellation paths, provider transports or native runtime merely because runtime evidence remains pending.

### P14-B — Labs / Analyses completion

**Status: provider-neutral source composition complete; provider/native/runtime work gated.**

Remaining work: production private storage/OCR/model provider selection/configuration, authorized backend deployment/migrations, PDF native picker/dependency, internal Labs/model tool exposure policy and provider/device/accessibility/runtime evidence.

### P14-C — Stories runtime completion

**Status: source-complete; evidence/runtime only unless a defect is reproduced.**

Use `docs/qa/stories-s10-runtime-matrix.md` to distinguish source/CI, deployed backend/migration, physical-device and second-device/privacy/lifecycle evidence.

### P14-D — Steps / native health activity

**Status: provider-neutral source complete through local-day/DST-safe/fail-closed semantics; native health integration remains gated.**

Remaining: reviewed HealthKit/Health Connect read-only adapters/dependencies, explicit user-initiated permission/disclosure UX, denied/unsupported runtime evidence, physical-device evidence and Home presentation against real aggregate data.

## Parallel execution rules

Independent work may proceed in parallel when contracts/files do not overlap. While activation gates remain closed, useful work is limited to read-only audits, QA/evidence preparation, bounded reproduced-defect fixes and canonical documentation synchronization.

Do not create broad source branches merely to keep Phase 14 busy. Shared auth lifecycle, database schema/journal, package manifests and root configuration require deliberate integration.

## Validation gates

### Mobile source

Exact-head Mobile CI requires repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

### Backend source

Applicable exact-head gates include Backend CI, PostgreSQL CI and Account Deletion Receipt CI when schema/privacy/account lifecycle surfaces change.

### Provider/device/runtime

Configured-provider runtime and physical-device evidence remain distinct from source CI. Source tests do not complete those rows.

## Current execution order

1. Keep canonical docs synchronized to mobile `de2f0f01` / backend `c7108f3f`.
2. Use the push runtime evidence matrix for the next P14-A work.
3. Resolve offline logout/reconnect convergence before calling real push delivery runtime-complete.
4. Run configured-provider, physical-device, deployment or production actions only with direct authorization.
5. Keep Labs source closed unless provider/native/runtime work is explicitly opened or a concrete defect appears.
6. Collect Stories/Steps runtime evidence only in authorized environments.
7. Re-synchronize canonical docs after material merges.

## Closed activation boundaries

Without direct authorization, do not deploy backend code, execute production migrations, schedule/activate production workers, configure/rotate APNs/FCM credentials, publish OTA/EAS, create/install native release builds, activate HealthKit/Health Connect, activate production Labs providers, access/mutate production data or submit to app stores.

## Deferred

Companion progression beyond current v1, feed ranking/retention, broad Coach expansion, DMs/groups/marketplace/subscriptions and broad autonomous refactoring outside an active product contract or demonstrated defect remain deferred unless explicitly reprioritized.
