# Phase 14 — Active product workstreams

Updated: 2026-08-16

Status: **source/CI completion checkpoint reached for the currently authorized Phase 14 contracts.** Remaining work is external evidence or separately gated provider/native/deployment activation.

Exact code, tests, migrations and Git history remain authoritative.

## Verified merged baseline

### Mobile

Latest runtime/source merge: `4ea37c11c81fafc64c2ef5e1e8479868b66e689e` (#675).

Recent P14-A completion packages:

- #669 — foreground registration reconciliation and lease renewal;
- #674 — queued-operation user provenance across auth transitions;
- #675 — authenticated-only foreground push renewal.

### Backend

Latest runtime/source merge: `8592cd9ea0291796e5c5d8c810bfe11ec21826da` (#250).

Recent P14-A completion packages:

- #246 — atomic refresh-token CAS rotation;
- #247 — bounded manual delivery worker and registration freshness lease;
- #249 — generic privacy-minimized Story notification payload regression;
- #250 — provider-token account handoff regression.

## P14-A — Real push delivery

**Status: source/CI complete for the reviewed architecture; configured-provider, physical-device, second-device/account and rollout evidence remain.**

Canonical stop/go checklist: `docs/qa/push-runtime-evidence-matrix.md`.

### Completed source foundation

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
- fail-closed provider composition requiring `PUSH_DELIVERY_ENABLED=true`, explicit provider enablement and complete credentials;
- bounded one-shot manual worker entry point;
- configurable registration freshness lease that bounds stale offline eligibility without retained logout credentials;
- privacy-minimized generic Story notification payload contract;
- atomic provider-token ownership convergence on account handoff;
- atomic refresh-token CAS rotation under concurrency.

Mobile:

- authenticated registration bound to the server-owned `AuthSession.device.id`;
- local logout that erases session/access/refresh credentials even when remote logout fails;
- Expo Notifications native adapter;
- explicit Settings → Notifications permission entry point;
- no implicit permission prompt during bootstrap;
- APNs/FCM native device-token acquisition after allowed/provisional permission;
- token-rotation listener and re-registration;
- foreground registration reconciliation/lease renewal only while an authenticated device exists;
- foreground notification presentation;
- one-time cold-start notification response consumption;
- Story destination allowlist;
- active-auth requirement before notification routing.

### Offline/reconnect source contract

The previous source-level stop-gate is closed by a bounded convergence model:

1. offline logout always removes reusable auth credentials locally;
2. the backend does not treat a registration as indefinitely eligible — delivery requires freshness within the configured registration lease;
3. authenticated foreground runtime renews the registration; signed-out foreground runtime does not;
4. a token reused under a different authenticated account/device converges to that latest owner atomically.

This does **not** substitute for physical/provider runtime evidence about ordering when OS/provider connectivity returns before JS executes.

### Remaining push work

1. **Configured-provider runtime evidence** — exercise APNs/FCM transports through the durable worker in an authorized non-production environment, including success, transient failure, permanent invalid token, timeout/unknown result, restart recovery and redaction.
2. **Physical-device evidence** — permission states, granted/provisional token sync, token rotation, foreground/background/terminated-app delivery and authenticated/logged-out Story taps.
3. **Second-device/account evidence** — real-client independent revoke/logout/account handoff and Story preference/source-removal behavior.
4. **Offline/reconnect runtime evidence** — verify freshness expiry and authenticated renewal under real device/network ordering.
5. **Production rollout** — provider credentials, backend deployment and worker scheduling remain separate explicit activation actions.

Do not reopen the durable worker, Story enqueue/cancellation paths, provider transports, registration lease or native runtime merely because runtime evidence remains pending.

## P14-B — Labs / Analyses completion

**Status: provider-neutral source composition complete; provider/native/runtime work gated.**

Remaining work: production private storage/OCR/model provider selection/configuration, authorized backend deployment/migrations, PDF native picker/dependency, internal Labs/model tool exposure policy and provider/device/accessibility/runtime evidence.

## P14-C — Stories runtime completion

**Status: source-complete; evidence/runtime only unless a defect is reproduced.**

Use `docs/qa/stories-s10-runtime-matrix.md` to distinguish source/CI, deployed backend/migration, physical-device and second-device/privacy/lifecycle evidence.

## P14-D — Steps / native health activity

**Status: provider-neutral source complete through local-day/DST-safe/fail-closed semantics; native health integration remains gated.**

Remaining: reviewed HealthKit/Health Connect read-only adapters/dependencies, explicit user-initiated permission/disclosure UX, denied/unsupported runtime evidence, physical-device evidence and Home presentation against real aggregate data.

## Completion interpretation

Phase 14 should now be treated as **closed for ordinary autonomous source work**. It is not accurate to call external runtime or production activation complete until the required environments have actually been exercised.

Reopen a Phase 14 source package only for:

- a reproduced defect from runtime evidence;
- an explicitly authorized provider/native/deployment package;
- a reviewed contract change.

Do not create broad source branches merely to keep Phase 14 active.

## Validation gates

### Mobile source

Exact-head Mobile CI requires repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

### Backend source

Applicable exact-head gates include Backend CI, PostgreSQL CI and Account Deletion Receipt CI when schema/privacy/account lifecycle surfaces change.

### Provider/device/runtime

Configured-provider runtime and physical-device evidence remain distinct from source CI. Source tests do not complete those rows.

## Next execution order

1. Keep Phase 14 source closed unless runtime evidence reproduces a defect or a gated package is explicitly opened.
2. Use the push runtime evidence matrix for P14-A external evidence.
3. Run configured-provider, physical-device, deployment or production actions only with direct authorization.
4. Keep Labs source closed unless provider/native/runtime work is explicitly opened or a concrete defect appears.
5. Collect Stories/Steps runtime evidence only in authorized environments.
6. Move autonomous source work to the next explicitly prioritized roadmap package.

## Closed activation boundaries

Without direct authorization, do not deploy backend code, execute production migrations, schedule/activate production workers, configure/rotate APNs/FCM credentials, publish OTA/EAS, create/install native release builds, activate HealthKit/Health Connect, activate production Labs providers, access/mutate production data or submit to app stores.

## Deferred

Companion progression beyond current v1, feed ranking/retention, broad Coach expansion, DMs/groups/marketplace/subscriptions and broad autonomous refactoring outside an active product contract or demonstrated defect remain deferred unless explicitly reprioritized.
