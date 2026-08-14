# Push registration lifecycle contract

Updated: 2026-08-14

## Status

This document defines the source/runtime boundary required before real external push delivery can be activated.

Current source foundations are provider-neutral. They do not authorize APNs/FCM credentials, native permission prompts, background delivery, production deployment, or physical-device activation.

## Identity authority

A push registration must reuse the authenticated server-issued device identity already present in `AuthSession.device.id`.

Do not create a second local push-specific device UUID. A second identity would split session/device ownership from notification ownership and make logout, account switching, revocation, support diagnostics and privacy deletion ambiguous.

The registration ownership tuple is therefore conceptually:

`authenticated user + authenticated device id + platform/provider + current native delivery credential`

The user ID is always taken from backend authentication. It must never be trusted from a mobile registration payload.

## Permission boundary

Registration synchronization must not request native notification permission implicitly.

The safe sequence is:

1. inspect the native permission state;
2. if permission has not been requested, return `permission_required` without prompting;
3. if permission is denied or unsupported, fail closed without backend registration;
4. only after permission is already granted, read the native device credential;
5. only after both permission and credential readiness exist, synchronize the authenticated backend registration.

This keeps the permission prompt a deliberate product/UI action rather than a hidden side effect of login, app bootstrap, sync, or background work.

## Backend ownership boundary

The backend owns registration rows from the authenticated request user. Registration responses must not echo the stored delivery credential.

A repeated registration for the same authenticated user/device updates the active route. If the same provider credential moves between accounts on one physical device, the current authenticated registration must atomically supersede the stale route so the previous account cannot remain the active delivery owner.

Owner unregister must be non-enumerating: deleting a missing or other-owner device identity may return the same bounded success response rather than exposing registration existence.

## Authentication refresh boundary

Mobile registration API calls may retry once after a 401 using the existing auth refresh path.

They must not:

- perform unbounded auth retry loops;
- invent a fallback user/device identity;
- register without an authenticated access token;
- log or persist the credential in diagnostics outside the reviewed registration storage boundary.

## Logout and account-switch boundary

Real push delivery must not be activated until logout/account-switch semantics are explicitly composed.

Current `AuthContext.logout()` calls the underlying auth service before clearing local session state. A post-logout React effect is therefore not a reliable place to unregister push because the authenticated token may already be revoked or removed.

A future activation package must choose and test one of these reviewed patterns:

### Preferred: pre-logout best-effort unregister

An AuthService/lifecycle decorator may:

1. read the current authenticated session/device ID;
2. attempt owner-scoped push unregister while the access token is still usable;
3. proceed with logout even if unregister cannot complete;
4. clear local auth state using the normal logout path.

Unregister failure must never trap the user inside an authenticated session merely to preserve notification cleanup.

### Server-assisted revocation

Alternatively, the backend logout/session-revocation operation may invalidate registrations linked to the authoritative device/session boundary in the same server-owned lifecycle.

This requires a separately reviewed schema/API coupling because push registrations are currently account/device-owned rather than session-row-owned.

## Offline logout

Offline logout is a specific privacy case. If the client cannot reach the unregister endpoint, the app must still allow local logout.

Before external delivery activation, the product/provider contract must define how stale registrations are bounded after offline logout. Options may include server-side device/session revocation convergence, short-lived delivery eligibility, or a reviewed reconnect cleanup path.

Do not activate sensitive notification content while this lifecycle remains unresolved.

## Account deletion

Backend account deletion owns final cleanup through account-owned cascade semantics. The mobile client does not need a successful unregister request to make account deletion complete if the backend deletion transaction removes registration rows.

Provider-side delivery invalidation/cleanup still requires separate provider runtime evidence once a real transport exists.

## Credential rotation

Native delivery credentials can rotate independently of app account identity.

A future native adapter must treat a newly observed credential as a registration update for the same authenticated `AuthSession.device.id`. It must not create a second device identity merely because the provider credential changed.

## Data Access Export

Registration routing/credential state is security-sensitive operational metadata. It is inventoried for lifecycle/account-deletion review but excluded from candidate Data Access Export surfaces.

User-facing export may include ordinary account/device metadata through the existing reviewed projection; it must not expose reusable notification delivery credentials.

## Logging and diagnostics

Backend logger redaction already censors request/response bodies and token-like fields. Future diagnostics must preserve that boundary.

Do not include raw delivery credentials in:

- analytics;
- support diagnostics;
- crash breadcrumbs;
- structured application logs;
- user-visible debug screens;
- model/Coach context.

## Activation checklist

Before real APNs/FCM delivery is enabled, all of the following need reviewed evidence:

- native permission UX and disclosure;
- production provider selection and credentials;
- device credential acquisition/rotation;
- authenticated registration synchronization;
- logout/account-switch cleanup;
- offline logout behavior;
- invalid-provider-response handling;
- delivery worker retry/dead-letter policy;
- provider invalid-token feedback and registration invalidation;
- notification privacy/content policy;
- physical-device delivery evidence;
- second-account/device isolation evidence;
- account-deletion/provider cleanup evidence;
- production deployment and migration authorization.

Source-complete registration seams are prerequisites for this checklist, not substitutes for it.
