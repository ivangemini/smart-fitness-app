# Push runtime evidence matrix

Updated: 2026-08-15

Status: provider-neutral source contract is complete; external provider/native/runtime activation remains authorization-gated under Phase 14.

This matrix is the canonical evidence checklist for real push delivery. A scenario is complete only when its required environment was actually exercised. Source tests and CI do not substitute for configured-provider, native-device, second-account/device or reconnect evidence.

Current source baselines:

- mobile runtime/source: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660);
- backend runtime/source: `37cd865ef94bfc9b2eef4c554ba83e3179726541` (#240).

Current API composition keeps Story delivery provider availability disabled. This document does not authorize APNs/FCM activation, native dependency changes, provider credentials, worker scheduling, builds, deployment or production data access.

## Evidence levels

- **Source/CI** — deterministic repository contract evidence.
- **Configured provider runtime** — authorized non-production backend plus a concrete APNs/FCM transport/configuration.
- **Physical device** — native app on a real supported device with reviewed permission/token integration.
- **Second device/account** — independent authenticated clients used to prove account/device isolation.
- **Offline/reconnect** — network-loss and reconnect behavior where server authority cannot be updated at the instant of local logout.

## Source / CI foundation

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Authenticated device registration API | owner/device registration persists without echoing reusable provider credentials | complete — #232 |
| Current-device logout | online logout invalidates the linked device registration transactionally | complete — #233 |
| Remote session / revoke-others | server-side session revocation invalidates linked registrations | complete — #234 |
| Durable delivery queue | PostgreSQL outbox, bounded retry/backoff, claim lease and stale-worker fencing | complete — #237 |
| Invalid provider credential feedback | only the exact still-current registration can be invalidated; rotated credentials are protected | complete — #237 |
| Story interaction enqueue | like/reaction/reply enqueue is fail-closed unless provider availability and owner preference both allow it | complete — #238 |
| Story source removal | unlike/reaction clear/reply delete/Story deletion or expiry terminalizes matching undelivered jobs | complete — #238 |
| Active session listing | expired sessions are not presented as active devices while cleanup semantics remain broader | complete — #239 |
| Story preference opt-out | pending/retryable/claimed Story jobs are terminalized without cancelling unrelated push categories | complete — #240 |
| Enqueue vs opt-out race | preference-row serialization prevents a completed opt-out from leaving a late queued Story job | complete — #240 |
| Mobile readiness contract | readiness does not request permission implicitly and fails closed for unsupported/not-requested/denied states | complete — #647/#656 |
| Mobile authenticated registration client | registration uses existing `AuthSession.device.id`, fails without auth and has one reviewed 401 refresh retry | complete — #656 |
| Offline local logout erasure | access token, refresh token and session metadata are removed even when remote logout fails | complete — #660 |
| Story deep-link target | `/social/story/:storyId` maps to the Story viewer and unauthenticated state returns before private Story fetch | complete — source audit 2026-08-15 |
| Provider activation default | current Story route/service composition does not pass provider availability; enqueue requires it to be exactly `true` | complete — source audit 2026-08-15 |

## Configured provider runtime

These rows remain pending until a provider/native gate is explicitly opened.

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Concrete transport adapter | authorized environment can send through the reviewed APNs/FCM adapter without bypassing the outbox | pending configured-provider evidence |
| Worker restart recovery | claimed/expired jobs recover according to lease/backoff semantics across a worker restart | pending configured-provider evidence |
| Provider success finalization | one successful provider response finalizes only the claimed job/token pair | pending configured-provider evidence |
| Transient provider failure | retryable provider result schedules bounded retry without losing claim fencing | pending configured-provider evidence |
| Permanent invalid token | provider invalid-token result disables only the exact still-current registration | pending configured-provider evidence |
| Credential rotation race | delayed feedback for an old token cannot disable the newly rotated token | pending configured-provider evidence |
| Provider timeout / unknown result | retry policy is explicitly reviewed for duplicate-delivery risk; no stronger exactly-once claim is made than the provider supports | pending configured-provider evidence |
| Redaction | logs/errors do not expose raw provider tokens or credentials | pending configured-provider evidence |
| Generic Story content | external notification title/body remains privacy-minimized and contains no Story/reply/actor content | pending configured-provider evidence |
| Provider-disabled environment | when provider availability is off, user preference cannot imply effective external delivery | pending configured-provider evidence |

## Physical-device permission and token lifecycle

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Permission entry point | permission request occurs only from explicit reviewed UX, never from readiness/background bootstrap | pending physical-device evidence |
| Not requested | no native token registration and no backend registration | pending physical-device evidence |
| Denied | no registration; UI remains truthful about unavailable delivery | pending physical-device evidence |
| Unsupported platform/runtime | deterministic unavailable state and no backend registration | pending physical-device evidence |
| Granted/provisional | native credential is acquired and synchronized to the authenticated `AuthSession.device.id` | pending physical-device evidence |
| Token acquisition failure | temporary inability to acquire a token is not misclassified as permission revocation and does not delete a known-good registration by inference | pending physical-device evidence |
| Token rotation | new credential replaces the old credential for the intended device/account and stale feedback cannot remove it | pending physical-device evidence |
| Permission revoked after registration | next authoritative lifecycle sync removes or disables the known registration according to reviewed semantics | pending physical-device evidence |
| Foreground delivery | notification behavior matches reviewed foreground UX | pending physical-device evidence |
| Background delivery | generic notification is delivered without leaking private Story content | pending physical-device evidence |
| Terminated-app delivery | generic notification behavior is verified from a terminated app | pending physical-device evidence |
| Tap deep link while authenticated | Story notification opens only the reviewed `/social/story/:storyId` destination | pending physical-device evidence |
| Tap deep link while logged out | app does not perform a private Story fetch and presents bounded unauthenticated/unavailable state | pending physical-device evidence |

## Second-device / account isolation

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Same account on devices A + B | each active registration receives only intended account events and can be independently revoked | pending second-device evidence |
| Logout on device A | A stops being eligible after authoritative online logout while B remains eligible | pending second-device evidence |
| Revoke device B remotely | B stops being eligible without invalidating A | pending second-device evidence |
| Revoke all other sessions | all linked remote registrations become ineligible while current device remains valid | pending second-device evidence |
| Account A → B handoff on one device | registration ownership/token handoff cannot leave B receiving A private content or A receiving B content | pending second-account evidence |
| Story owner opt-out | disabling Story push prevents later undelivered Story interaction jobs from reaching the provider | pending second-device evidence |
| Interaction removed before send | source-removal cancellation prevents an undelivered stale interaction notification | pending second-device evidence |
| Story deleted/expired before send | undelivered Story interaction notification is suppressed | pending second-device evidence |
| Claimed job cancelled before provider call | stale worker finalization remains fenced and provider is not invoked after the authoritative cancellation point | pending configured-provider/second-device evidence |
| Provider call already started | observed behavior is documented; database cancellation is not described as recalling an already-started external send | pending configured-provider evidence |

## Offline logout / reconnect boundary

Immediate remote convergence is impossible while the device has no network path to the backend. Local logout must still erase reusable auth credentials; those credentials must not be retained merely to perform deferred push cleanup.

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Offline local logout | access/refresh/session data is erased locally and private Story deep links fail closed | source complete — #660 + deep-link audit; physical evidence pending |
| Reconnect while still logged out | reviewed lifecycle does not silently re-authenticate or re-register the logged-out account | pending design/runtime evidence |
| Server registration convergence | a bounded reconnect/eligibility mechanism removes or expires the stale server registration without retaining reusable auth credentials after logout | **blocking before real delivery activation** |
| Network returns before app code runs | privacy policy explicitly accounts for the fact that the OS/provider may regain connectivity before JavaScript can perform cleanup | **blocking policy/runtime evidence** |
| Login as a different account after offline logout | old-account registration converges safely before/with new-account registration; no cross-account notification content is exposed | pending second-account/reconnect evidence |
| Long-offline device | stale eligibility has a documented bound or accepted privacy-minimized behavior; no claim of immediate server revocation is made | **blocking before real delivery activation** |

## Stop / go rule for external activation

Do **not** call real push delivery activation-complete while any of the following is missing:

1. reviewed concrete provider adapter/configuration and configured-environment evidence;
2. explicit native permission UX plus credential acquisition/rotation evidence on a physical device;
3. authenticated/unauthenticated Story deep-link evidence;
4. current-device, remote-device and account-handoff isolation evidence;
5. an accepted and tested offline logout/reconnect convergence policy that does not retain reusable auth credentials;
6. reviewed external notification content/privacy behavior;
7. evidence that provider failures/timeouts do not invalidate the wrong credential or create unbounded retry behavior.

A provider send that already started externally cannot be recalled by terminalizing the corresponding database row. Completion language must preserve that boundary.

## Regression rules

- Fix only reproduced defects discovered by this matrix; do not reopen durable outbox, Story enqueue, opt-out or logout source packages without evidence.
- Do not treat Expo Go as native push evidence.
- Do not activate APNs/FCM, add provider credentials, schedule production workers, build/install native releases or deploy backend changes merely to fill this matrix without direct authorization.
- Do not persist raw provider credentials in ordinary outbox payloads or expose them in responses/logs.
- Do not weaken local logout by retaining access/refresh credentials for deferred cleanup.
- Do not mark a provider/device/reconnect row complete from source inspection or CI alone.

## Completion rule

Real push delivery may be called runtime-complete only when every blocking row has a concrete evidence reference or an explicitly accepted platform/environment exclusion, and the source/CI baselines still pass. Production rollout remains a separate controlled action.
