# Stories roadmap

Updated: 2026-08-11

## Purpose

This is the focused roadmap for Social Stories across:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

It separates source completion from deployment, runtime and release evidence. Exact code, migrations, tests and current Git history override this document if it becomes stale. Stories remain server-authoritative Social data and must not be moved into private revisioned `AppState` sync.

## Current checkpoint

Audited against:

- mobile `main` `fc090914dc048ed50ee288287a358f66f8308728` after PR #624 `feat(stories): add bounded text overlay UI`;
- backend `main` `7c2e3e9842b7bfa3d63508e4cc6d9c0a2ae13280` after PR #220 `feat(stories): add bounded text overlay authority`;
- backend PR #214 Stories foundation;
- mobile PRs #533/#535 image-only Home/authoring foundation;
- mobile PR #618 Story viewer completion;
- mobile PR #620 direct camera capture;
- backend PRs #218/#219 Story caption persistence and moderation;
- mobile PR #621 Story caption authoring/viewer integration;
- backend PR #220 Story overlay persistence/moderation/export authority;
- mobile PR #624 strict overlay API/authoring/viewer integration and publish-idempotency retry hardening.

S9-A direct camera, S9-B captions and S9-C one bounded text overlay are source/CI-complete. S9-D below is the next **contract-approved** source slice and may be implemented autonomously. Environment, migration execution, physical-device and release evidence remain separately gated.

## Scope vocabulary

- **Source-complete:** required code/contracts/tests for the stated scope are present. This does not prove a deployed environment or physical device.
- **Contract-approved:** exact source/product/privacy boundaries are defined and may be implemented autonomously, but completion has not yet been established.
- **Gated:** implementation/evidence requires explicit authorization, environment/provider access, native/runtime work or release activity.
- **Deferred:** not part of the active source contract. It must not be started automatically.
- **Candidate:** a possible future product capability, not implementation authorization.

## S8 — image-only Stories v1

Status: **source-complete**.

The completed v1 authority includes:

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

### Product/result contract

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

Completed scope:

- [x] one optional overlay only;
- [x] fixed `top`, `center` or `bottom` placement;
- [x] one reviewed high-contrast treatment;
- [x] authoring preview renders overlay over the existing image;
- [x] viewer renders the server-returned overlay over the image;
- [x] caption remains separate below-image content and may coexist;
- [x] blank overlay input is omitted;
- [x] no free x/y dragging, transforms, custom font/color/size controls, multiple blocks, stickers, drawings, effects, video composition or raster re-upload.

### Backend authority and compatibility

- [x] migration `0044_story_text_overlay` adds nullable overlay text/placement with pair, length and closed placement constraints;
- [x] Story create identity binds image, caption, overlay text and placement;
- [x] released strict schemaVersion-1 Story list/get/create DTO shape remains unchanged;
- [x] overlay is exposed through separate authenticated `GET /v1/social/stories/:storyId/overlay`;
- [x] overlay reads reuse active Story self/Following, block, restriction, deletion and expiry authority;
- [x] authored overlay text/placement participates in ownership-safe data-access export;
- [x] old clients can continue to render the base image/caption without receiving an unexpected Story DTO key.

### Moderation and retry authority

- [x] `story_overlay_text` is a distinct `social-text-v1` moderation surface bounded to 280 characters;
- [x] the closed PostgreSQL moderation-surface constraint includes the overlay surface;
- [x] overlay moderation completes before Story persistence/media attachment when enforcement is enabled;
- [x] review/reject/unavailable/timeout/invalid outcomes fail closed and create no Story;
- [x] failed text moderation leaves the approved managed image unattached and reusable;
- [x] moderation audit stores bounded hashes/metadata rather than raw overlay text;
- [x] mobile publication keeps one idempotency key for an ambiguous retry of the exact normalized Story composition;
- [x] changing image state/caption/overlay creates a new publish identity;
- [x] confirmed moderation terminal failures or Story idempotency-key reuse clear the cached publish identity so a safe retry can use a new key.

### Mobile result

- [x] strict versioned overlay DTO/parser is separate from the base Story DTO;
- [x] create payload omits blank normalized overlay input;
- [x] authoring includes bounded text input and accessible top/center/bottom radio controls;
- [x] positioning is relative to the image container rather than screen-height coordinates;
- [x] authoring/viewer remain Safe-Area/ScrollView compatible;
- [x] viewer fetches overlay fail-soft in parallel with caption;
- [x] server response remains authority for published text/placement;
- [x] EN/RU copy and parser/idempotency regression tests are included;
- [x] no Skia dependency, new native module, second media asset or Story-specific upload pipeline was introduced.

### Source/CI evidence

- backend PR #220 exact head `fa708c39ef1c7731992b266e1445b7a6d8170e00` passed Backend CI #1570, Backend PostgreSQL CI #177 and Account Deletion Receipt CI #259 before merge;
- backend PR #220 merged to `main` as `7c2e3e9842b7bfa3d63508e4cc6d9c0a2ae13280`;
- mobile PR #624 exact head `e96882801393b4f0975f22c6107bb57c6a10b6d2` passed Mobile CI #2191: repository/changed-file line audits, TypeScript, full regression suite, expanded-model smoke, Expo export and Expo Doctor;
- mobile PR #624 merged to `main` as `fc090914dc048ed50ee288287a358f66f8308728`.

Environment/release boundary:

- migration `0044_story_text_overlay` is merged source; no staging/production execution is claimed here;
- an overlay-enabled mobile release must target a compatible backend schema/runtime;
- text-moderation provider/enforcement activation remains an explicit environment decision;
- no backend deployment, migration execution, provider activation, credentials, native build/install or OTA/EAS publish occurred in S9-C source completion.

## S9-D — private Story Like

Status: **contract-approved; backend/mobile source implementation not yet complete.**

S9-D adds one binary, privacy-narrow Story interaction. It is not a general reactions/replies system.

### Product contract

- [ ] one authenticated non-owner viewer may Like or Unlike a Story that is currently readable through existing active-Story authority;
- [ ] self-like is rejected; the author cannot Like their own Story;
- [ ] Like and Unlike are idempotent state mutations;
- [ ] the viewer may read only their own boolean `liked` state;
- [ ] the Story owner may read only an aggregate `likeCount` for their own active Story;
- [ ] no endpoint exposes liker usernames, user IDs, profile objects, per-liker timestamps or a liker list;
- [ ] no Story-like notification is generated in S9-D;
- [ ] no emoji/reaction set, replies, DMs, text input or moderation surface is introduced;
- [ ] Story Like state does not alter Home ranking/feed ordering and is not an analytics/recommendation signal.

### Compatibility/API contract

Keep the released strict Story DTO unchanged. Use separate strict versioned subresources:

```text
viewer state:
{
  schemaVersion: 1,
  storyId: UUID,
  liked: boolean
}

owner summary:
{
  schemaVersion: 1,
  storyId: UUID,
  likeCount: non-negative integer
}
```

Approved route contour:

- [ ] `GET /v1/social/stories/:storyId/like` — readable Story, current viewer state only;
- [ ] `PUT /v1/social/stories/:storyId/like` — non-owner readable Story, idempotent Like;
- [ ] `DELETE /v1/social/stories/:storyId/like` — non-owner readable Story, idempotent Unlike;
- [ ] `GET /v1/social/stories/:storyId/like-summary` — owner-only active Story aggregate;
- [ ] Like/Unlike reuse the existing bounded `reaction_toggle` Social write-rate policy rather than creating an unbounded interaction path;
- [ ] unreadable, expired, deleted, blocked or restricted Stories fail closed through existing Story visibility authority.

### Persistence, lifecycle and privacy

- [ ] add a dedicated `social_story_likes` table with Story/user foreign keys, one unique `(story_id, user_id)` edge and creation timestamp;
- [ ] account deletion cascades owned Story Like rows through database ownership constraints;
- [ ] Story owner deletion and Story expiry explicitly remove Like rows before the current soft-delete lifecycle completes;
- [ ] blocking either direction removes Story Likes between those two users in the same Social graph transaction;
- [ ] owner aggregate never reveals individual liker identity;
- [ ] technical backend data inventory includes the new Story Like table and its 24-hour Story lifecycle relationship;
- [ ] data-access export includes only the requesting user's own retained/readable Story Like activity in a bounded privacy-safe projection, without target Story ID, target owner identity or other liker identity;
- [ ] no raw liker list is added to privacy export merely because an owner can see an aggregate count;
- [ ] no notification, ranking, recommendation or generic analytics persistence is introduced.

### Backend implementation order

1. forward migration `0045_social_story_likes` plus Drizzle schema;
2. repository layer with own-state, aggregate-count, add/remove, Story cleanup and between-users block cleanup;
3. Story Like service/routes reusing active Story authority and explicit self-like guard;
4. Story expiry/delete and graph-block cleanup integration;
5. technical inventory/data-access export/account-deletion evidence updates;
6. PostgreSQL integration tests for idempotent like/unlike, owner-only aggregate, self-like rejection, visibility, block, expiry/delete cleanup and export privacy;
7. exact-head Backend CI/PostgreSQL/account-deletion gates as triggered;
8. merge backend authority before mobile consumption.

### Mobile implementation order

After compatible backend merge:

- [ ] add strict Like-state and owner-summary contracts/parsers/API without extending `SocialStoryDto`;
- [ ] non-owner viewer loads own Like state fail-soft and exposes one accessible Like/Unlike control;
- [ ] owner viewer loads only aggregate `likeCount` fail-soft and has no self-like control;
- [ ] mutation UI disables duplicate in-flight toggles and renders the server-returned state as authority;
- [ ] no fabricated liker list, notification or optimistic persistent Story DTO mutation;
- [ ] EN/RU copy and contract/state regression tests;
- [ ] exact-head Mobile CI before merge.

No backend deployment, migration execution, provider/environment change, native build/install or OTA/EAS publish is authorized by S9-D source work.

## G1 — physical-device and standalone runtime evidence

Status: **gated; not established by source CI**.

Run only with explicit authorization. Evidence should cover applicable Story acquisition, upload, moderation, publication, caption/overlay rendering, Like UI after S9-D source completion, expiry, visibility, block behavior, account isolation, offline recovery, second-device convergence and supported iOS/Android release targets.

Do not convert missing physical/runtime evidence into speculative source churn.

## G2 — deployed backend/provider evidence

Status: **gated**.

Before a broad Stories release, separately authorize and verify the selected environment for:

- migrations `0041` through the latest released Stories migration (`0044` for S9-C; future `0045` for S9-D once merged);
- private upload/quarantine storage and signed finalize path;
- text/image moderation state transitions under selected provider configuration;
- approved derivative delivery and retention cleanup;
- failure/retry behavior and privacy-safe operational evidence.

No migration execution, provider activation, credentials or deployment is authorized by this roadmap.

## G3 — release/privacy evidence

Status: **gated**.

Broad-release evidence must remain consistent with Social privacy/moderation/release policy, including account deletion, accessibility, localization, rollback/recovery and any required legal/policy review.

## Product expansion inventory

Outside the active S9-D contract:

1. richer composition: free positioning, multiple text blocks, style controls, drawings, stickers/effects or multi-asset composition;
2. richer Story interactions: replies, DMs, emoji/reaction sets, liker lists or interaction notifications;
3. per-Story audience controls / Close Friends;
4. video Stories and video-specific acquisition/transcoding/moderation/delivery;
5. archive/highlights or other owner-visible post-expiry persistence;
6. owner viewer-list surface;
7. music and advanced media formats;
8. Story analytics, recommendation or ranking signals.

These remain candidates/deferred until separately contracted.

## Expansion dependency order

For an approved Stories expansion:

1. define the exact product/privacy contract;
2. extend backend authority/contracts first when persistence, visibility, moderation, notifications or media lifecycle changes;
3. add strict mobile contracts/parsers only after compatible backend merge;
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
