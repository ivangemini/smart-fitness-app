# Push registration lifecycle contract

Updated: 2026-08-14

## Status

This document defines the source/runtime boundary required before real external push delivery can be activated.

Current provider-neutral source now covers registration plus online authenticated logout/session-revocation cleanup. It still does not authorize APNs/FCM credentials, native permission prompts, production workers, deployment or physical-device activation.

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

The previously proposed server-assisted pattern is now implemented in source.

### Current-device logout — backend #233

Authenticated `/v1/auth/logout`:

- revokes the current auth session;
- invalidates the current authenticated device registration;
- performs those server-owned lifecycle changes in one database transaction;
- does not invalidate unrelated account devices.

A client-side post-logout effect is therefore not required for authoritative online current-device cleanup.

### Remote session revocation — backend #234

Authenticated remote-session lifecycle now also cleans registration state:

- `DELETE /v1/auth/sessions/:sessionId` revokes the owned remote session and invalidates that session device registration in one transaction;
- `POST /v1/auth/sessions/revoke-others` uses set-based non-current session revocation and invalidates only the returned device IDs;
- current session/device remains active during revoke-others;
- ownership-safe not-found/current-session rejection behavior is preserved.

This closes the normal online session/device cleanup source gap.

## Offline logout

Offline logout remains a distinct privacy/runtime case.

If the client cannot reach the backend, local logout must still be allowed. Because no server transaction can run while offline, stale server session/registration state may remain until a later server-side or reconnect convergence path occurs.

Before external delivery activation, define and test a bounded policy, for example:

- reconnect cleanup using retained non-secret lifecycle intent;
- server session-expiry/revocation eligibility checks before delivery;
- short-lived eligibility/registration lease semantics;
- another reviewed provider-independent convergence mechanism.

Do not activate sensitive notification content while this case remains unresolved.

## Account deletion

Backend account deletion owns final database cleanup through account-owned cascade semantics. Provider-side invalidation/cleanup still requires runtime evidence once a real transport exists.

## Credential rotation

Native delivery credentials may rotate independently of account identity.

A future native adapter must treat a new credential as an update for the same authenticated `AuthSession.device.id`, not a new device.

Any delayed provider invalid-token response must be scoped to the exact attempted registration version/token. It must not be allowed to invalidate a newer credential that replaced the attempted one.

## Durable delivery worker contract

The next backend source package is a durable push outbox/delivery worker.

Required properties:

- durable PostgreSQL jobs;
- registration/device reference rather than unnecessary duplication of raw delivery credentials in ordinary job payloads;
- atomic lease/claim ownership for concurrent workers;
- bounded retry/backoff using the existing retry policy;
- deterministic terminal/retry states;
- injected provider transport boundary;
- stale-worker protection so a worker that lost its claim cannot finalize a job;
- permanent-invalid-token feedback scoped to the exact attempted registration;
- account-deletion/privacy/data-inventory coverage for any new persistent state.

This worker is still provider-neutral source until concrete provider credentials/adapters and production scheduling are explicitly activated.

## Notification enqueue/content boundary

Outbox existence alone does not authorize every in-app notification to become external push.

A separate composition package must define:

- eligible event types;
- minimum payload/content required for delivery;
- whether sensitive content is omitted from lock-screen payloads;
- deep-link target semantics;
- Story interaction delivery behavior;
- idempotency/deduplication between event creation and outbox enqueue.

Do not copy private Labs, workout, nutrition, Coach or authentication payloads into push jobs merely because a worker exists.

## Data Access Export

Registration routing/credential state is security-sensitive operational metadata. It remains excluded from candidate Data Access Export surfaces.

Future outbox state should likewise expose no reusable credential material. If lifecycle metadata becomes account-owned persistent state, inventory/export policy must be reviewed explicitly rather than inferred.

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
- authenticated registration synchronization;
- durable outbox/worker behavior;
- notification-event enqueue/idempotency;
- provider adapter behavior;
- bounded retry/dead-letter policy;
- permanent invalid-token feedback;
- offline logout/reconnect convergence;
- notification privacy/content policy;
- deep-link routing;
- physical-device delivery evidence;
- second-account/device isolation evidence;
- account-deletion/provider cleanup evidence;
- production deployment/migration/worker authorization.

Already source-complete and not to be reimplemented:

- authenticated registration persistence/API;
- mobile authenticated registration client/readiness coordinator;
- online current-device logout cleanup;
- online remote-session/revoke-others cleanup.

Source-complete seams are prerequisites for activation, not substitutes for runtime/provider/device evidence.
