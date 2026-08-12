# Stories S10 product/privacy contract

Updated: 2026-08-12

## Status

This document defines the explicitly prioritized Stories S10 source boundary across:

- mobile: `ivangemini/smart-fitness-app`, PR #643;
- backend: `ivangemini/smart-fitness-backend`, PR #229.

S10 is a server-authoritative Social expansion. It is not private revisioned `AppState` data and must not create a second local authority for Story visibility, lifecycle, relationships, moderation, archive state, replies, Highlights or interaction delivery.

Source/CI completion does not authorize backend deployment, production migration execution, OTA/EAS publication, native build/install, APNs/FCM/provider activation, credentials, production data access or store submission.

## S10-A — owner-only Story viewers

- A Story owner may read the bounded viewer list for their own Story.
- Viewer identity comes only from authoritative recorded Story views.
- Non-owners cannot read another Story's viewer list.
- Block and moderation restrictions filter identities through the existing Social authority.
- The viewer list does not turn Like/Reaction aggregates into liker/reactor identity lists; S9 Like/Reaction privacy contracts remain unchanged.
- Viewer data is not a ranking, recommendation or analytics signal.

## S10-B — Close Friends and per-Story audience

Supported Story audience values are exactly:

- `following`;
- `close_friends`.

Authority rules:

- `following` preserves the existing readable-following Story boundary.
- A Close Friends member must currently follow the Story owner.
- Close Friends membership is owner-managed and server-authoritative.
- The backend structurally binds a Close Friends edge to the corresponding authoritative follow edge.
- Removing that follow removes only the now-invalid directional Close Friends edge.
- Blocking clears Close Friends membership in both directions together with the existing Social interaction cleanup.
- Re-following does not resurrect a previously removed Close Friends membership.
- Replaying the same membership PUT returns the persisted membership metadata rather than fabricating a new creation timestamp.
- Story visibility remains fail-closed under private-profile, block, moderation, deletion and lifecycle authority.

The base Story response DTO remains stable. Audience changes do not authorize ranking changes or private `AppState` synchronization.

## S10-C — bounded private Story replies

- One authenticated non-owner viewer may send a text reply only to a currently readable active Story.
- Reply body is trimmed and bounded to 1–1,000 characters.
- Reply text uses the reviewed Social text-moderation boundary and fails closed when enforcement requires it.
- Reply creation is idempotent for one author, Story and idempotency key.
- Reusing an idempotency key for changed reply content is rejected rather than silently mutating the prior reply.
- Mobile preserves one idempotency identity while retrying the same normalized `storyId + body`; a response-loss retry must not create a duplicate reply.
- The Story owner may list replies to their Story; replies do not create a general DM inbox, chat, thread or public comment surface.
- Reply lifecycle follows Story visibility/expiry/deletion and Social block/account authority.
- A bounded in-app Story reply notification may reuse the existing Social Notification Center. This is not external push delivery.

## S10-D — provider-neutral push preference seam

The source contract may persist a user's requested interaction-push preference, but S10 does not activate external push delivery.

Until a separately reviewed provider/native/release package exists:

- `deliveryProviderAvailable` remains false;
- `effectiveEnabled` remains false;
- no APNs token, FCM token, provider credential, native push permission, background delivery worker or external notification channel is activated;
- storing `requestedEnabled=true` is preference state only and must not be presented as proof that push delivery is active.

Real push requires a separate provider, privacy, permission, credential, native-runtime and release contract.

## S10-E — owner archive and Highlights

- A Story leaves the active surface after its server-owned expiry.
- Expiry may archive the owned Story while retaining its already approved managed image for owner Archive/Highlight use.
- Expiry clears ephemeral Story interactions/notifications according to lifecycle policy rather than keeping an active public interaction surface alive.
- Archive is owner-only.
- Highlights and Highlight membership/order are owner-managed server state.
- Explicit Story deletion still removes the Story lifecycle and follows the managed-media cleanup path; Highlight references must not preserve a deleted Story.
- Archive/Highlights do not make an expired Story readable through the normal active Following/Close Friends Story API.

## Rollout compatibility

S10 backend is backward-compatible with the existing S9 mobile create path because omitted audience defaults to `following`.

S10 mobile can send the new strict audience field. The pre-S10 backend create schema does not accept that field. Therefore any later authorized runtime rollout must use this order:

1. deploy/migrate/validate the compatible S10 backend;
2. only then release or activate the S10 mobile client.

This ordering statement is source compatibility guidance only. It is not deployment authorization and does not claim that either step has occurred.

## Explicit non-goals

S10 does not authorize:

- DMs or threaded chat;
- liker/reactor identity lists;
- video Stories, transcoding or video moderation/delivery;
- free-position composition, stickers, drawing or multi-asset editing;
- music/advanced media formats;
- Story recommendation/ranking/analytics signals;
- APNs/FCM or any other external push provider;
- migration of Stories into private revisioned `AppState` sync.

## Validation layers

Keep completion claims separated:

- **source:** reviewed backend/mobile code and tests exist;
- **CI:** required exact-head repository gates pass;
- **environment:** migrations/providers/storage are actually configured and validated under explicit authorization;
- **runtime:** physical standalone/device scenarios are exercised;
- **release:** privacy/legal/accessibility/localization/rollback evidence is complete.

Do not collapse source/CI completion into environment, runtime or release completion.