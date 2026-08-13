# Stories roadmap

Updated: 2026-08-12

## Purpose

This is the focused roadmap for Social Stories across:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

It separates source/CI completion from deployment, runtime and release evidence. Exact code, migrations, tests and current Git history override this document if it becomes stale. Stories remain server-authoritative Social data and must not be moved into private revisioned `AppState` sync.

The reviewed S10 product/privacy contract is `docs/architecture/stories-s10-contract.md`.

## Current checkpoint

Merged baseline:

- mobile `main` after S9-F PR #641: `a5da4b85ac42f9560faa5fd0516fef2244e9c7a7`;
- backend `main` after S9-F PR #228: `e23fd62c31c3067c96898138efa2bbf60f2b1d0a`;
- S9-A through S9-F remain merged and exact-head source/CI-complete.

Explicitly prioritized active S10 package:

- mobile PR #643 implements S10-A through S10-E; runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed Mobile CI #2217 / run `31631890545`;
- backend PR #229 implements the server-authoritative S10-A through S10-E boundary; current source head at this documentation checkpoint is `fb68a88844fe895588a477cefa971e5fae8328ac` and must pass exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI before backend source/CI completion is claimed.

Environment, production migration execution, physical-device, provider and release evidence remain separately gated.

## Scope vocabulary

- **Source-complete:** required code/contracts/tests for the stated scope are present. This does not prove a deployed environment or physical device.
- **CI-complete:** the required exact-head source gates passed before merge.
- **Contract-approved:** exact source/product/privacy boundaries are defined and may be implemented autonomously, but completion has not yet been established.
- **Gated:** implementation/evidence requires explicit authorization, environment/provider access, native/runtime work or release activity.
- **Deferred:** not part of the active source contract. It must not be started automatically.
- **Candidate:** a possible future product capability, not implementation authorization.

## S8 — image-only Stories v1

Status: **source-complete**.

Completed authority includes:

- authenticated server-owned Story creation with idempotency;
- one owned approved managed `story_image` per Story;
- exact 24-hour server expiry and active-only reads;
- self/Following visibility, private-profile enforcement, symmetric block filtering and moderation restrictions;
- cursor-paginated Home listing and individual Story reads;
- server-authoritative viewed state;
- owner-only deletion and account-deletion cascade boundaries;
- bounded Story write throttling;
- media-library selection plus bounded resize/JPEG preprocessing;
- signed managed-media upload/finalize/moderation polling/delivery;
- account-scoped restart-safe authoring draft recovery;
- server-backed Home strip, image viewer, progression/navigation and deterministic refresh after create/delete.

The mobile client does not fabricate server Story rows, expiry, visibility or managed-media approval.

## S9-A — direct camera capture

Status: **source-complete and exact-head Mobile CI-complete; physical runtime evidence remains gated.**

- native authoring offers one still-photo camera capture path in addition to the media library;
- camera access is requested only from the explicit camera action;
- cancellation creates no Story state;
- captured photos enter the same bounded preprocessing and managed `story_image` lifecycle;
- web does not expose the native camera action;
- no video/audio capture, alternate upload transport, client expiry or visibility bypass was added;
- native permission text still requires a separately authorized matching binary/device check.

## S9-B — optional Story captions

Status: **source-complete and exact-head backend/mobile CI-complete; deployed migration/moderation/runtime evidence remains gated.**

Contract/result:

- one optional trimmed 1–1,000 character caption;
- caption persisted by the backend, with blank mobile input omitted;
- strict base schemaVersion-1 Story DTO remains unchanged;
- caption uses a separate versioned authenticated Story subresource;
- caption reads reuse active-Story visibility/block/restriction/deletion/expiry authority;
- Story idempotency binds caption and managed image;
- caption is included in ownership-safe data-access export;
- mobile authoring/viewer includes bounded EN/RU caption UI;
- `story_caption` is a distinct `social-text-v1` moderation surface;
- moderation runs before Story persistence/media attachment and fails closed when enforcement is active;
- a failed caption moderation attempt creates no Story and leaves the approved image reusable.

Source/CI evidence:

- backend PR #218 exact head `f648c5d5268426568f0d1f6cd1f3189d07301bc7` passed Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI, then merged as `64981c086f8456817ba6ab3a2d5e1911add6e228`;
- mobile PR #621 exact head `f6011e92993a52bab24b4d14fbd8c08a02fea752` passed the full Mobile CI gate, then merged as `54c6b983b0d285c8ddf5c4316b9cd8bab27c569b`;
- backend PR #219 exact head `b65f35fe2d43c156651afcb96d54e188961f6c35` passed Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI, then merged as `3733206f405e3dac842303d6d596b1f9ab75510f`;
- migrations `0042_social_story_captions` and `0043_story_caption_moderation_surface` are merged source only; this roadmap does not claim environment execution.

## S9-C — one bounded text overlay

Status: **source-complete and exact-head backend/mobile CI-complete; deployed migration/moderation/runtime evidence remains gated.**

S9-C deliberately remains narrower than a general Story editor.

A Story may carry at most one overlay:

```text
overlay = null
or
{
  schemaVersion: 1,
  text: trimmed 1..280 characters,
  placement: top | center | bottom
}
```

Completed boundaries:

- one optional overlay only, with fixed `top`, `center` or `bottom` placement and one reviewed high-contrast treatment;
- authoring preview and viewer render relative to the image container;
- caption remains separate and may coexist;
- blank overlay input is omitted;
- migration `0044_story_text_overlay` provides pair/length/placement constraints;
- base Story list/get/create DTO remains unchanged; overlay uses a separate authenticated subresource;
- `story_overlay_text` is a distinct bounded moderation surface and moderation fails closed before Story persistence when enforcement is active;
- Story create idempotency binds image, caption, overlay text and placement;
- authored overlay text/placement participates in ownership-safe export;
- no free x/y dragging, transforms, custom font/color/size controls, multiple blocks, stickers, drawings, effects, video composition or raster re-upload.

Source/CI evidence:

- backend PR #220 exact head `fa708c39ef1c7731992b266e1445b7a6d8170e00` passed Backend CI #1570, Backend PostgreSQL CI #177 and Account Deletion Receipt CI #259 before merge `7c2e3e9842b7bfa3d63508e4cc6d9c0a2ae13280`;
- mobile PR #624 exact head `e96882801393b4f0975f22c6107bb57c6a10b6d2` passed Mobile CI #2191 before merge `fc090914dc048ed50ee288287a358f66f8308728`.

## S9-D — private Story Like

Status: **source-complete and exact-head backend/mobile CI-complete; deployed migration/runtime evidence remains gated.**

Product/privacy contract:

- one authenticated non-owner viewer may Like or Unlike a currently readable active Story;
- self-like is rejected; Like/Unlike are idempotent;
- viewer reads only their own boolean `liked` state;
- owner reads only aggregate `likeCount` for their own active Story;
- no endpoint exposes liker usernames, user IDs, profiles, per-liker timestamps or liker lists;
- separate strict versioned Like-state and owner-summary subresources keep the base Story DTO unchanged;
- unreadable, expired, deleted, blocked or restricted Stories fail closed through existing visibility authority;
- `social_story_likes` persistence uses a unique `(story_id, user_id)` edge, lifecycle cleanup, block cleanup and account cascade behavior;
- owner export never receives liker identity; requesting-user export remains bounded and excludes target Story/owner identity;
- Like state does not alter Home ordering/ranking and is not an analytics/recommendation signal.

## S9-E — bounded Story Reactions

Status: **source-complete and exact-head backend/mobile CI-complete; deployed migration/runtime evidence remains gated.**

Product/privacy contract:

- fixed semantic reaction set: `love | fire | strong | clap`;
- at most one reaction per non-owner viewer per currently readable active Story;
- setting the same choice again may clear it; replacing a reaction keeps one edge;
- S9-D Like remains a separate independent interaction;
- viewer receives only their own current reaction state;
- owner receives aggregate counts by reaction type and total only;
- no reactor identity list, user IDs, profiles or per-reactor timestamps are exposed;
- base Story DTO remains unchanged; separate strict versioned reaction subresources are used;
- lifecycle, block, account-deletion and visibility authority remain server-owned;
- reaction state does not affect chronological Following ordering, ranking, recommendations, analytics or private `AppState` sync.

## S9-F — bounded Story interaction notifications

Status: **source-complete and exact-head backend/mobile CI-complete; deployment/runtime/push expansion remains gated or out of scope.**

S9-F uses the existing in-app Social Notification Center. It is not a new push-notification subsystem.

### Backend result

- existing `social_notifications` supports `story_like` and `story_reaction` types;
- nullable `story_id` FK targets `social_stories` with strict notification target-shape constraints;
- Story Like/Reaction mutations create/remove deduped in-app notifications transactionally;
- self notifications are suppressed;
- Story owner delete/24-hour expiry clears Story-targeted notifications along with Story interaction lifecycle cleanup;
- notification read-state, pagination, actor moderation/block filtering and existing auth authority are reused;
- no APNs, FCM, email, SMS or external delivery provider was introduced.

### Mobile result

- existing Social notification contracts accept `story_like` and `story_reaction`;
- strict Story targeting routes taps to the existing Story viewer;
- legacy pre-S9-F payloads without `storyId` remain accepted and normalize to `null`;
- existing optimistic read-state, pagination, auth refresh, stale notification removal and fail-soft behavior are retained;
- no local durable notification authority or private `AppState` sync was added.

### Source/CI evidence

- backend PR #228 exact head `cec2e772672ac073fc606a3358e79c85d0117109` passed Backend CI #1635 / run `31607002861`, Backend PostgreSQL CI #242 / run `31607002889`, and Account Deletion Receipt CI #324 / run `31607002829` before merge `e23fd62c31c3067c96898138efa2bbf60f2b1d0a`;
- mobile PR #641 exact head `28f9c1c0f3019efc73f3a78d7aa801469a3fe96e` passed Mobile CI #2207 / run `31598972282` before merge `a5da4b85ac42f9560faa5fd0516fef2244e9c7a7`;
- migration `0048_story_interaction_notifications` is merged source only; this roadmap does not claim staging/production execution.

### Historical S9-F rollout compatibility

The S9-F backend notification response adds `storyId`; the compatible S9-F mobile parser understands both the legacy payload without `storyId` and the strict Story-targeted payload. A later S9-F-specific response activation therefore requires that compatible mobile parser first.

No backend deployment, production migration execution, OTA/EAS publication, native build/install, credential/provider change or production activation occurred as part of S9-F source completion.

## S9 closure

**S9-A through S9-F are merged and source/CI-complete. Remaining autonomous S9 source packages: 0.**

S9 closure does not block later explicitly prioritized product work. The user subsequently authorized the bounded S10 contract below.

## S10 — reviewed product expansion

Status: **contract-approved and actively implemented; mobile runtime/source CI is complete, backend final exact-head CI is required before full S10 source/CI completion is claimed.**

Authoritative contract: `docs/architecture/stories-s10-contract.md`.

### S10-A — owner-only viewer list

- Story owner may list identities recorded by authoritative Story views.
- Non-owners cannot read another Story's viewer list.
- block/moderation filtering remains server-owned.
- this does not expose liker/reactor identity lists and does not alter S9-D/S9-E privacy.
- viewer identity is not a ranking/analytics signal.

### S10-B — Close Friends and per-Story audience

Exact audience values:

```text
following | close_friends
```

- Close Friends membership requires the member to currently follow the owner.
- membership is owner-managed server state, not mobile/AppState authority.
- the database constrains membership to the corresponding authoritative follow edge.
- unfollow removes only the now-invalid directional Close Friends edge; block removes both directions.
- re-follow does not resurrect membership.
- idempotent membership replay returns persisted membership metadata.
- Story visibility still fails closed under block/private/moderation/lifecycle authority.

### S10-C — bounded private replies

- authenticated non-owner viewers may send a trimmed 1–1,000 character reply only to a currently readable active Story;
- reply text uses the existing bounded Social text-moderation boundary;
- backend reply creation is idempotent and rejects changed-content reuse of the same identity;
- mobile preserves one idempotency key across retries of the same normalized Story/body, including response-loss retry;
- owner may list replies to their Story;
- this is not a DM inbox, public comment system or threaded chat product;
- Story/block/delete/expiry/account lifecycle remains authoritative.

### S10-D — provider-neutral push preference seam

- a requested interaction-push preference may be stored;
- `deliveryProviderAvailable=false` and `effectiveEnabled=false` remain authoritative;
- there is no APNs/FCM token lifecycle, provider credential, native permission or external delivery worker in S10;
- real push requires a separately reviewed provider/native/privacy/release package.

### S10-E — owner Archive and Highlights

- expired owned Stories may transition out of active delivery into owner Archive while retaining already approved managed media;
- expiry clears ephemeral active interaction state according to lifecycle policy;
- Archive is owner-only;
- Highlights and item ordering are owner-managed server state;
- explicit Story deletion follows managed-media cleanup and does not allow a Highlight to preserve a deleted Story;
- Archive/Highlights do not reactivate an expired Story in the normal active Following/Close Friends API.

### S10 source/CI evidence so far

- mobile PR #643 runtime/source head `692dea96e692fdecdb9db87341c5758cdf2fed01` passed complete Mobile CI #2217 / run `31631890545`;
- mobile reply retry hardening preserves one idempotency identity until confirmed success;
- backend PR #229 includes migration `0049_social_stories_s10`, ownership/privacy/export integration and Close Friends follow-authority hardening; exact-head backend CI must be green before completion is claimed.

### S10 rollout compatibility

The S10 backend accepts the legacy create payload because omitted audience defaults to `following`. The S10 mobile client can send the new strict audience field, which the pre-S10 backend does not accept. Therefore any later authorized runtime rollout must use:

1. compatible S10 backend deploy/migration/validation;
2. S10 mobile release/activation after that.

This is guidance only. It is not deployment, migration, native-build or production authorization.

## G1 — physical-device and standalone runtime evidence

Status: **gated; not established by source CI**.

Run only with explicit authorization. Evidence should cover applicable Story acquisition, camera/picker permissions, upload interruption/restart, moderation/publication, caption/overlay rendering, Like/Reaction UI, S10 audience/reply/viewer/archive/highlight surfaces, notification navigation, expiry, visibility, block behavior, account isolation, offline recovery, second-device convergence and supported iOS/Android release targets.

Do not convert missing physical/runtime evidence into speculative source churn.

## G2 — deployed backend/provider evidence

Status: **gated**.

Before a broad Stories release, separately authorize and verify the selected environment for:

- Stories migrations `0041` through `0049_social_stories_s10` as applicable to that environment;
- private upload/quarantine storage and signed finalize path;
- text/image moderation state transitions under selected provider configuration;
- approved derivative delivery and Archive/retention cleanup;
- Story audience/reply/interaction/notification lifecycle against the deployed database;
- failure/retry behavior and privacy-safe operational evidence.

No migration execution, provider activation, credentials or deployment is authorized by this roadmap.

## G3 — release/privacy evidence

Status: **gated**.

Broad-release evidence must remain consistent with Social privacy/moderation/release policy, including account deletion, accessibility, localization, rollback/recovery and any required legal/policy review.

## Product expansion inventory after S10

Outside the reviewed S10 source contract:

1. richer composition: free positioning, multiple text blocks, style controls, drawings, stickers/effects or multi-asset composition;
2. DMs or threaded Story chat beyond the bounded private reply contract;
3. real push notifications / APNs / FCM or another external delivery provider;
4. liker/reactor identity lists beyond the separate owner viewer-list contract;
5. video Stories and video-specific acquisition/transcoding/moderation/delivery;
6. music and advanced media formats;
7. Story analytics, recommendation or ranking signals;
8. additional audience products beyond `following | close_friends`.

These remain candidates/deferred until separately contracted.

## Expansion dependency order

For another approved Stories expansion:

1. define the exact product/privacy contract;
2. extend backend authority/contracts first when persistence, visibility, moderation, notifications or media lifecycle changes;
3. add strict mobile contracts/parsers only after compatibility and rollout order are reviewed;
4. add the smallest coherent mobile product surface;
5. require exact-head source CI;
6. collect separately authorized runtime/environment evidence when native/provider/release behavior is involved.

Do not infer that a candidate is active merely because an earlier dependency is already available.

## Definition of done

A Stories capability is not “done” unless its applicable layers are distinguished explicitly:

- **contract/source done:** backend/mobile source and tests are complete;
- **CI done:** exact-head required gates passed;
- **environment done:** applicable migrations/providers/storage/workers are configured and validated under authorization;
- **runtime done:** required physical-device/standalone scenarios were exercised;
- **release done:** required privacy/legal/accessibility/localization/rollback evidence exists.

Roadmap summaries must name the highest completed layer instead of collapsing all five into a single “complete” label.