# Push registration lifecycle contract

Updated: 2026-08-15

## Status

This document defines the source/runtime boundary required before real external push delivery can be activated.

Current provider-neutral source now covers authenticated registration, online logout/session-revocation cleanup, the durable outbox/worker, and transactional Story interaction enqueue/source-removal cancellation. It still does not authorize APNs/FCM credentials, native permission prompts, production worker scheduling, deployment or physical-device activation.

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

Mobile #656 implements the provider-neutral repository/readiness coordination for this boundary. It does not itself activate a native permission UX or provider transport.

## Backend ownership boundary

Backend #232 establishes owner/device registration persistence and authenticated register/unregister routes.

Properties to preserve:

- registration responses do not echo the stored delivery credential;
- same user/device registration updates the active route;
- provider/token handoff between accounts is atomic so a previous owner cannot remain active;
- owner unregister is non-enumerating;
- routing/credential state is inventoried for lifecycle/privacy review but excluded from candidate Data Access Export surfaces;
- raw reusable credentials stay out of ordinary logs, diagnostics and model context.

## Authentication refresh boundary

Mobile registration API calls may retry once after 401 through the existing auth refresh path.

They must not:

- perform unbounded auth retry loops;
- invent fallback user/device identity;
- register without an authenticated access token;
- log/persist the credential outside the reviewed registration boundary.

## Online logout and session revocation

### Current-device logout — backend #233

Authenticated `/v1/auth/logout`:

- revokes the current auth session;
- invalidates the current authenticated device registration;
- performs those server-owned lifecycle changes in one database transaction;
- does not invalidate unrelated account devices.

A client-side post-logout effect is therefore not required for authoritative online current-device cleanup.

### Remote session revocation — backend #234

Authenticated remote-session lifecycle also cleans registration state:

- `DELETE /v1/auth/sessions/:sessionId` revokes the owned remote session and invalidates that session device registration in one transaction;
- `POST /v1/auth/sessions/revoke-others` invalidates only devices associated with the revoked non-current sessions;
- current session/device remains active during revoke-others;
- ownership-safe not-found/current-session rejection behavior is preserved.

This closes the normal online session/device cleanup source gap.

## Offline logout

Offline logout remains a distinct privacy/runtime case and is **not source-complete for external delivery activation**.

Current mobile behavior intentionally allows local logout when the backend is unreachable. `createAuthService.logout()` attempts authenticated `/v1/auth/logout` and then clears access/refresh tokens plus local session metadata in `finally`, even if the request fails.

That property must be preserved: do **not** retain an access token or refresh token after logout merely so a later reconnect can unregister push state.

### 2026-08-15 source audit

The current contracts do not expose a safe post-logout authenticated cleanup path once local credentials have been erased. The mobile push-registration repository correctly requires authentication for unregister.

A server-session eligibility check alone is also insufficient as the logout-convergence policy: the default refresh/session lifetime is 30 days. Treating an unrevoked server session as delivery eligibility could therefore leave a stale registration eligible far too long after an offline local logout.

Do not solve this by:

- persisting access/refresh tokens after logout;
- adding an unauthenticated `deviceId`-only unregister endpoint;
- treating the current 30-day session expiry as an acceptable push privacy lease;
- inventing a second device identity disconnected from `AuthSession.device.id`.

Before external delivery activation, choose and test a bounded convergence policy with an explicit security model, for example a narrowly scoped revocation capability/lease or another reviewed mechanism that does not preserve general authentication credentials after logout. That design decision remains activation-gated rather than an autonomous source patch.

Do not activate sensitive notification content while this case remains unresolved.

## Account deletion

Backend account deletion owns final database cleanup through account-owned cascade semantics. Provider-side invalidation/cleanup still requires runtime evidence once a real transport exists.

## Credential rotation

Native delivery credentials may rotate independently of account identity.

A future native adapter must treat a new credential as an update for the same authenticated `AuthSession.device.id`, not a new device.

Delayed provider invalid-token feedback must be scoped to the exact attempted registration version/token. It must not invalidate a newer credential that replaced the attempted one.

Backend #237 implements this source-side fencing for the durable worker path.

## Durable delivery worker contract — source complete

Backend #237 merged the provider-neutral durable delivery worker.

Implemented properties include:

- durable PostgreSQL jobs;
- registration/device reference rather than duplication of raw delivery credentials in ordinary job payloads;
- atomic claim/lease ownership for concurrent workers;
- bounded retry/backoff;
- deterministic terminal/retry states;
- injected provider transport boundary;
- stale-worker finalization protection through claim identity;
- exact-registration invalid-token handling with credential-rotation protection;
- account-deletion/privacy/data-inventory coverage.

This remains provider-neutral source until concrete provider credentials/adapters and production scheduling are explicitly activated.

## Story notification enqueue/content boundary — source complete for current Story event class

Backend #238 connects eligible Story like/reaction/reply notifications to the durable outbox only when both conditions are true:

- provider availability is explicitly injected as `true`;
- the Story owner has enabled the interaction push preference.

Current external-message content is intentionally generic:

- title: `Smart Fitness`;
- body: `You have new Story activity.`;
- destination: `/social/story/:storyId`.

The destination resolves to the existing authenticated Story viewer. The mobile viewer fails closed when no authenticated session exists and does not load Story content while logged out.

Source removal cancels undelivered pending/retryable/claimed jobs for unlike/reaction clear/reply deletion and Story deletion/expiry. Claim-token fencing prevents a cancelled job from later being finalized or retried by a stale worker.

Important runtime limit: once a provider send has actually begun, source cancellation cannot retract an already in-flight external request. Do not describe claim fencing as a provider-level recall guarantee. Generic lock-screen copy and provider/device runtime evidence remain part of activation review.

Do not copy private Labs, workout, nutrition, Coach or authentication payloads into push jobs merely because the worker exists.

## Data Access Export

Registration routing/credential state and durable delivery operational copies are security-sensitive/internal lifecycle metadata. They remain excluded from candidate Data Access Export surfaces unless a later reviewed policy explicitly changes that boundary.

## Logging and diagnostics

Do not include raw delivery credentials in:

- analytics;
- support diagnostics;
- crash breadcrumbs;
- structured application logs;
- user-visible debug screens;
- model/Coach context.

Provider error handling should use bounded classified outcomes rather than raw credential-bearing payloads.

## Activation checklist

Before real APNs/FCM delivery is enabled, reviewed evidence is still needed for:

- explicit native permission UX/disclosure;
- provider selection and credentials;
- native credential acquisition/rotation;
- authenticated registration synchronization on real devices;
- concrete provider adapter behavior;
- offline logout/reconnect convergence;
- final notification privacy/content policy for the enabled event set;
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
- durable outbox/worker;
- Story interaction enqueue/idempotency/source-removal cancellation;
- Story deep-link route existence and authenticated viewer fail-closed behavior.

Source-complete seams are prerequisites for activation, not substitutes for runtime/provider/device evidence.
