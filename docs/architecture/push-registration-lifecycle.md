# Push registration lifecycle contract

Updated: 2026-08-15

## Status

This document defines the source/runtime boundary required before real external push delivery can be activated.

Current provider-neutral source covers authenticated registration, online logout/session-revocation cleanup, the durable outbox/worker, transactional Story interaction enqueue/source-removal cancellation, Story preference opt-out privacy hardening and local offline-logout credential erasure. None of this authorizes APNs/FCM credentials, native permission prompts, production worker scheduling, deployment or physical-device activation.

## Identity authority

A push registration reuses the authenticated server-issued device identity already present in `AuthSession.device.id`.

Do not create a second local push-specific device UUID. Registration ownership is conceptually:

`authenticated user + authenticated device id + platform/provider + current native delivery credential`

The user ID comes only from backend authentication and is never trusted from a mobile registration payload.

## Permission boundary

Registration synchronization must not request native notification permission implicitly.

Safe sequence:

1. inspect native permission state;
2. if permission has not been requested, return `permission_required` without prompting;
3. if denied/unsupported, fail closed without backend registration;
4. only after permission is already granted, read the native credential;
5. only after permission + credential readiness exist, synchronize the authenticated backend registration.

Mobile #656 implements the provider-neutral repository/readiness coordination. It does not itself activate native permission UX or provider transport.

## Backend ownership boundary

Backend #232 establishes owner/device registration persistence and authenticated register/unregister routes.

Properties to preserve:

- registration responses do not echo the stored delivery credential;
- same user/device registration updates the active route;
- provider/token handoff between accounts is atomic so a previous owner cannot remain active;
- owner unregister is non-enumerating;
- routing/credential state remains internal lifecycle metadata;
- raw reusable credentials stay out of ordinary logs, diagnostics and model context.

## Authentication refresh boundary

Mobile registration API calls may retry once after 401 through the existing auth refresh path. They must not perform unbounded auth retry loops, invent fallback identity, register without an authenticated access token or persist/log credentials outside the reviewed registration boundary.

## Online logout and session revocation

### Current-device logout — backend #233

Authenticated `/v1/auth/logout` revokes the current session and invalidates the current authenticated device registration in one database transaction without invalidating unrelated account devices.

### Remote session revocation — backend #234

`DELETE /v1/auth/sessions/:sessionId` revokes an owned remote session and invalidates that device registration transactionally. `POST /v1/auth/sessions/revoke-others` invalidates only devices returned by the set-based non-current session revocation; the current session/device remains active.

### Active-session listing — backend #239

Backend #239 adds expiry to the active-list predicate: an expired non-revoked session is no longer presented as an active device/session.

This is intentionally **not** the cleanup predicate. Remote revoke/revoke-others may still revoke expired-but-unrevoked sessions and invalidate their device registrations. Do not couple display semantics to cleanup semantics.

## Offline logout

Offline logout remains a distinct privacy/runtime case and is **not source-complete for external delivery activation**.

Mobile #660 permanently regression-covers the local security invariant. `createAuthService.logout()` attempts authenticated `/v1/auth/logout`; if the request cannot reach the backend, local logout still completes and clears:

- local session metadata;
- access token;
- refresh token.

After logout, `loadSession()` returns no session. This behavior must be preserved.

Do **not** solve deferred push cleanup by:

- retaining access/refresh tokens after logout;
- adding an unauthenticated `deviceId`-only unregister endpoint;
- treating the current long-lived server session expiry as an acceptable push privacy lease;
- inventing a second push-only device identity disconnected from `AuthSession.device.id`.

Because no backend transaction can run while the client is offline, stale server session/registration state may remain until a later server-side or reconnect convergence path occurs. Before external delivery activation, choose and test a bounded convergence policy with an explicit security model. A short eligibility/registration lease is only useful once the native/runtime synchronization path can actually renew it; do not add a lease in isolation.

Do not activate sensitive notification content while this case remains unresolved.

## Account deletion

Backend account deletion owns final database cleanup through account-owned cascade semantics. Provider-side invalidation/cleanup still requires runtime evidence once a real transport exists.

## Credential rotation

Native delivery credentials may rotate independently of account identity. A future native adapter must update the same authenticated `AuthSession.device.id`, not create a new device.

Delayed provider invalid-token feedback must be scoped to the exact attempted registration version/token so it cannot invalidate a newer credential. Backend #237 implements this source-side fencing for the durable worker path.

## Durable delivery worker — source complete

Backend #237 implements durable PostgreSQL jobs, registration/device references without raw credential copies in ordinary outbox payloads, atomic claim/lease ownership, bounded retry/backoff, deterministic terminal/retry states, injected provider transport, stale-worker finalization protection, exact-registration invalid-token handling and account-deletion/privacy/data-inventory coverage.

It remains provider-neutral source until concrete provider credentials/adapters and production scheduling are explicitly activated.

## Story interaction delivery — source complete through preference opt-out

Backend #238 connects eligible Story like/reaction/reply notifications to the durable outbox only when provider availability is explicitly injected as `true` and the Story owner has enabled interaction push.

Current external-message content is intentionally generic:

- title: `Smart Fitness`;
- body: `You have new Story activity.`;
- destination: `/social/story/:storyId`.

The destination resolves to the existing authenticated Story viewer, which fails closed without an authenticated session.

#238 also cancels undelivered pending/retryable/claimed jobs after direct interaction removal and Story deletion/expiry. Claim-token fencing prevents a stale worker from later finalizing/retrying a cancelled row.

### Story preference opt-out — backend #240

Backend #240 (`37cd865ef94bfc9b2eef4c554ba83e3179726541`) closes the separate race between interaction enqueue and owner preference opt-out.

The interaction transaction reads the owner's preference using `SELECT ... FOR UPDATE`. Disabling the preference updates the same preference row and, in that transaction, terminalizes only jobs that match both the Story interaction idempotency prefix and Story destination prefix.

Serialization property:

- if enqueue owns the preference-row lock first, opt-out waits; the late job commits, then opt-out terminalizes it;
- if opt-out owns the row first, enqueue waits and then observes the disabled preference and skips enqueue.

The final exact head `cbcf858e0d6e1b88b8583493ad98ca75f1cc0e55` passed Backend CI and the full Backend PostgreSQL CI. PostgreSQL regression coverage deterministically waits for the real row-lock wait state rather than relying on timing sleeps and also verifies domain scoping plus stale-claim fencing.

Important limit: terminalizing a claimed row fences database finalization/retry but does **not** retract a provider call whose external send has already begun. Do not describe outbox cancellation as provider-level recall.

Current API composition still leaves provider availability disabled; #240 is privacy/source hardening, not external-delivery activation.

Do not copy private Labs, workout, nutrition, Coach or authentication payloads into push jobs merely because the worker exists.

## Data Access Export

Registration routing/credential state and durable delivery operational copies are security-sensitive/internal lifecycle metadata. They remain excluded from candidate Data Access Export surfaces unless a later reviewed policy explicitly changes that boundary.

## Logging and diagnostics

Do not include raw delivery credentials in analytics, support diagnostics, crash breadcrumbs, structured application logs, user-visible debug screens or model/Coach context. Provider errors should use bounded classified outcomes rather than raw credential-bearing payloads.

## Activation checklist

Before real APNs/FCM delivery is enabled, reviewed evidence is still needed for:

- explicit native permission UX/disclosure;
- provider selection and credentials;
- native credential acquisition/rotation;
- authenticated registration synchronization on real devices;
- concrete provider adapter behavior;
- offline logout/reconnect convergence;
- final notification privacy/content policy;
- provider-level behavior for cancellation races/in-flight sends;
- physical-device delivery evidence;
- second-account/device isolation evidence;
- account-deletion/provider cleanup evidence;
- production deployment/migration/worker authorization.

Already source-complete and not to be reimplemented:

- authenticated registration persistence/API;
- mobile authenticated registration client/readiness coordinator;
- online current-device logout cleanup;
- online remote-session/revoke-others cleanup;
- active-session expiry listing semantics;
- durable outbox/worker;
- Story interaction enqueue/idempotency/source-removal cancellation;
- Story interaction preference opt-out cancellation/race serialization;
- Story deep-link route existence and authenticated viewer fail-closed behavior;
- local offline-logout credential/session erasure.

Source-complete seams are prerequisites for activation, not substitutes for runtime/provider/device evidence.
