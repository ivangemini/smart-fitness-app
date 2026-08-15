# Push runtime evidence matrix

Updated: 2026-08-16

Status: concrete backend provider transports and mobile native runtime are source/CI-complete; configured-provider, physical-device, second-device/account, offline/reconnect and production activation evidence remain incomplete.

This matrix is the canonical stop/go checklist for real push delivery. A scenario is complete only when its required environment was actually exercised. Source tests and CI do not substitute for configured-provider or physical-device evidence.

Current source baselines:

- mobile: `de2f0f01d2167aa91d7167130159f1b63c595b35` (#667);
- backend: `c7108f3fb98818cdb726c28a4e235ef642b7902d` (#245).

No production APNs/FCM credential, worker schedule, backend deployment, native build/install or production data access is authorized by this document.

## Evidence levels

- **Source/CI** — deterministic repository contract evidence.
- **Configured provider runtime** — authorized non-production backend using concrete APNs/FCM configuration.
- **Physical device** — native app on a real supported device.
- **Second device/account** — independent authenticated clients proving isolation.
- **Offline/reconnect** — network-loss/reconnect behavior where server authority cannot update at local logout time.

## Source / CI foundation

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Authenticated registration API | server-owned owner/device registration persists without echoing reusable credentials | complete — #232/#663 |
| Current-device logout | online logout invalidates linked registration transactionally | complete — #233 |
| Remote session / revoke-others | server-side revocation invalidates linked registrations | complete — #234 |
| Durable delivery queue | outbox, bounded retry, claim lease and stale-worker fencing | complete — #237 |
| Invalid-token fencing | only exact current registration can be invalidated; rotated token protected | complete — #237 |
| Story interaction enqueue | enqueue requires explicit provider availability + owner preference | complete — #238 |
| Story source removal | interaction/Story removal terminalizes matching undelivered jobs | complete — #238 |
| Active session listing | expired sessions excluded while cleanup semantics remain broader | complete — #239 |
| Story preference opt-out | matching pending/retryable/claimed jobs terminalized; unrelated categories preserved | complete — #240 |
| Enqueue vs opt-out race | preference-row serialization prevents late queued Story job after completed opt-out | complete — #240 |
| Concrete APNs transport | reviewed HTTP/2 transport maps provider results into delivery contract | complete source — #242 |
| Concrete FCM transport | reviewed HTTP v1 transport maps provider/auth results into delivery contract | complete source — #242 |
| Provider config default | delivery remains off unless master switch + provider switch + complete credentials are present | complete source — #245 |
| Explicit native permission UX | bootstrap does not request permission; Settings action is the explicit request point | complete source — #667 |
| Native device-token acquisition | granted/provisional state obtains APNs/FCM device token and registers against auth device | complete source — #667 |
| Native token rotation | token listener re-registers rotated credential | complete source — #667 |
| Foreground presentation | foreground handler is configured | complete source — #667 |
| Cold-start tap consumption | last notification response is handled then cleared | complete source — #667 |
| Story destination allowlist | only reviewed Story destination is routable and active auth is required | complete source — #667 |
| Offline local logout erasure | access token, refresh token and session metadata erased even when remote logout fails | complete — #660 |

## Configured provider runtime

Source adapters exist, but these rows remain pending until an authorized configured environment is exercised.

| Scenario | Required evidence | Status |
| --- | --- | --- |
| APNs configured send | real configured APNs transport sends through durable worker | pending configured-provider evidence |
| FCM configured send | real configured FCM transport sends through durable worker | pending configured-provider evidence |
| Worker restart recovery | expired claims recover according to lease/backoff across restart | pending configured-provider evidence |
| Provider success finalization | success finalizes only claimed job/token pair | pending configured-provider evidence |
| Transient failure | retryable result schedules bounded retry without losing fencing | pending configured-provider evidence |
| Permanent invalid token | invalid-token feedback disables only exact current registration | pending configured-provider evidence |
| Credential rotation race | delayed old-token feedback cannot disable replacement token | pending configured-provider evidence |
| Provider timeout / unknown result | duplicate-delivery risk and retry semantics are explicitly evidenced | pending configured-provider evidence |
| Redaction | logs/errors expose neither raw provider token nor provider credentials | pending configured-provider evidence |
| Generic notification content | title/body remain privacy-minimized and exclude Story/reply/actor/private-health content | pending configured-provider evidence |
| Provider-disabled environment | user preference cannot imply effective delivery while master/provider switch is off | pending configured-provider evidence |

## Physical-device permission and token lifecycle

The native source path exists; every row below still requires physical-device evidence.

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Permission entry point | native prompt appears only after explicit Settings action | pending physical-device evidence |
| Not requested | no device-token/backend registration occurs | pending physical-device evidence |
| Denied | no new registration; UI truthfully reports blocked/unavailable state | pending physical-device evidence |
| Unsupported runtime/platform | deterministic unavailable state and no registration | pending physical-device evidence |
| Granted/provisional | native credential synchronizes to authenticated `AuthSession.device.id` | pending physical-device evidence |
| Token acquisition failure | failure is not misclassified as permission revocation and does not infer-delete known-good registration | pending physical-device evidence |
| Token rotation | rotated credential replaces prior registration for intended device/account | pending physical-device evidence |
| Permission revoked after registration | reviewed authoritative lifecycle converges registration eligibility correctly | pending design + physical-device evidence |
| Foreground delivery | visible behavior matches reviewed foreground UX | pending physical-device evidence |
| Background delivery | privacy-minimized notification delivered without private content leak | pending physical-device evidence |
| Terminated-app delivery | privacy-minimized notification behavior verified from terminated app | pending physical-device evidence |
| Tap while authenticated | only reviewed Story destination opens | pending physical-device evidence |
| Tap while logged out | no private Story fetch occurs; bounded unauthenticated state remains | pending physical-device evidence |

## Second-device / account isolation

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Same account on devices A + B | registrations remain independently addressable/revocable | pending second-device evidence |
| Logout device A | A becomes ineligible after authoritative online logout; B remains valid | pending second-device evidence |
| Revoke device B remotely | B becomes ineligible without invalidating A | pending second-device evidence |
| Revoke all other sessions | remote linked registrations become ineligible while current device remains | pending second-device evidence |
| Account A → B handoff on one device | no cross-account notification eligibility/content survives handoff | pending second-account evidence |
| Story owner opt-out | later undelivered Story jobs do not reach provider | pending second-device/configured-provider evidence |
| Interaction removed before send | cancelled undelivered interaction does not reach provider | pending second-device/configured-provider evidence |
| Story deleted/expired before send | undelivered Story interaction notification suppressed | pending second-device/configured-provider evidence |
| Provider call already started | observed boundary documented; DB cancellation is not described as recall | pending configured-provider evidence |

## Offline logout / reconnect boundary

Immediate authoritative backend cleanup is impossible without connectivity. Local logout must still erase reusable auth credentials; those credentials must not be retained merely for deferred push cleanup.

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Offline local logout | credentials/session erased locally and notification Story route fails closed | source complete; physical evidence pending |
| Reconnect while logged out | runtime does not silently re-authenticate or re-register old account | pending design/runtime evidence |
| Server registration convergence | bounded mechanism removes/expires stale server eligibility without retained auth credentials | **blocking before real delivery activation** |
| Network returns before app code runs | privacy policy accounts for provider/OS connectivity before JS cleanup | **blocking policy/runtime evidence** |
| Login as different account after offline logout | old-account eligibility converges safely before/with new-account registration | pending second-account/reconnect evidence |
| Long-offline device | stale eligibility has documented bound or explicitly accepted privacy-minimized behavior | **blocking before real delivery activation** |

## Stop / go rule for external activation

Do **not** call real push delivery runtime-complete while any of the following is missing:

1. configured APNs/FCM runtime evidence through the reviewed worker/transports;
2. physical-device permission/token/background/terminated-app evidence;
3. authenticated and logged-out deep-link device evidence;
4. second-device/account isolation evidence;
5. accepted and tested offline logout/reconnect convergence without credential retention;
6. reviewed external notification content/privacy behavior;
7. timeout/failure evidence demonstrating bounded retry and correct credential invalidation.

Production rollout remains a separate action after runtime evidence. A provider send already started externally cannot be recalled by terminalizing its database row.

## Regression rules

- Fix only reproduced defects discovered by this matrix; do not reopen durable outbox, Story enqueue/opt-out, provider adapter or logout packages without evidence.
- Do not treat Expo Go or source CI as physical-device push evidence.
- Do not activate APNs/FCM credentials, schedule production workers, deploy backend changes, publish/build/install releases or access production data merely to fill this matrix without direct authorization.
- Do not persist raw provider credentials in ordinary outbox payloads or expose them in responses/logs.
- Do not weaken local logout by retaining access/refresh credentials for deferred cleanup.

## Completion rule

Real push delivery may be called runtime-complete only when every blocking row has concrete evidence or an explicitly accepted environment/platform exclusion and the source/CI baselines still pass. Production rollout remains separately controlled.
