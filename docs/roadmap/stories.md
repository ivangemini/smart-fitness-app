# Stories roadmap

Updated: 2026-08-11

## Purpose

This is the focused roadmap for Social Stories across:

- mobile: `ivangemini/smart-fitness-app`;
- backend: `ivangemini/smart-fitness-backend`.

It exists to prevent two different claims from being conflated:

1. **the approved image-only Stories v1 source scope is complete**;
2. **the full long-term Stories product is not complete or fully authorized.**

Exact code, migrations, tests and current Git history override this document if it becomes stale. Stories remain server-authoritative Social data and must not be moved into private revisioned `AppState` sync.

## Current checkpoint

Audited against:

- mobile `main` `3a32c19ebfd10fa3b173b8ed8619eaada754b20e` after PR #622 `docs(stories): record S9-B captions checkpoint`;
- backend `main` `3733206f405e3dac842303d6d596b1f9ab75510f` after PR #219 `fix(stories): enforce caption text moderation`;
- backend PR #214 `Add server-authoritative Stories foundation`;
- mobile PR #533 `Add server-backed Stories to Home`;
- mobile PR #535 `Add managed Story authoring lifecycle`;
- mobile PR #618 Story viewer completion;
- mobile PR #620 direct camera capture;
- backend PR #218 Story caption persistence/visibility/export authority;
- mobile PR #621 Story caption authoring/viewer integration;
- backend PR #219 Story caption text-moderation hardening;
- current mobile Story routes, API/parsers, cache, viewer, authoring hook and managed-media composition;
- current backend Story routes/schemas/service, Social text moderation and managed-media contracts.

Direct camera capture (S9-A) and optional photo captions (S9-B) are source/CI-complete post-v1 Stories expansions. S9-C below is the next approved source contract and is **not** source-complete yet.

## Scope vocabulary

Use these terms precisely:

- **Source-complete:** required code/contracts/tests for the stated scope are present. This does not prove a deployed environment or physical device.
- **Contract-approved:** exact source/product/privacy boundaries are defined and may be implemented autonomously, but completion has not yet been established.
- **Gated:** implementation/evidence requires explicit authorization, environment/provider access, native/runtime work or release activity.
- **Deferred:** not part of the active source contract. It must not be started automatically.
- **Candidate:** a possible future product capability, not implementation authorization.

## S8-A — server authority and lifecycle

Status: **source-complete for image-only v1**.

- [x] versioned Story contracts and stable parsing boundaries;
- [x] authenticated Story creation with idempotency;
- [x] 24-hour server-authoritative expiry;
- [x] active-only reads;
- [x] cursor-paginated Story listing;
- [x] individual Story reads;
- [x] idempotent viewed-state acknowledgement;
- [x] self/Following visibility semantics;
- [x] private-profile enforcement;
- [x] symmetric block filtering;
- [x] restricted-profile/content filtering;
- [x] owner-only Story deletion;
- [x] account-deletion cascade/cleanup boundary;
- [x] bounded Story write-rate limiting;
- [x] dedicated managed-media `story_image` ownership contract.

The backend owns expiry and visibility. Mobile must not fabricate expiry, visibility, viewed state or server Story records.

## S8-B — managed image acquisition and publication

Status: **source-complete for image-only v1**.

Mobile currently provides the complete managed image path:

- [x] select one image from the media library through `expo-image-picker`;
- [x] validate selected image metadata before processing;
- [x] resize the long edge to at most 2,048 px when required;
- [x] re-encode to bounded JPEG with a lower-quality retry when needed;
- [x] reject the prepared client payload when it still exceeds the bounded upload size;
- [x] retain a local preview while managed media is being processed;
- [x] create a signed `story_image` upload through the Social API;
- [x] upload through the shared signed-media transport rather than a Story-specific second pipeline;
- [x] persist account-scoped draft metadata for restart recovery;
- [x] finalize the upload with the current media state version;
- [x] poll the server-owned asset until a terminal moderation state;
- [x] publish only an owned approved `story_image` asset;
- [x] remove/replace the pending image through managed-media ownership semantics;
- [x] clear the Story media draft after successful publication.

Current v1 does **not** publish arbitrary remote image URLs and does not own client-side expiry.

## S8-C — Home consumption and viewer

Status: **source-complete for image-only v1**.

- [x] strict mobile Story DTO parsing;
- [x] authenticated list/get/view API integration;
- [x] server-authoritative Home Story strip between personal metrics and Following;
- [x] bounded account-scoped short-lived cache for responsive first render;
- [x] backend revalidation rather than cache authority;
- [x] grouped Story presentation by author;
- [x] seen/unseen presentation derived from Story viewed state;
- [x] image Story viewer;
- [x] segment progress and automatic advancement;
- [x] previous/next/close navigation semantics;
- [x] viewed-state acknowledgement;
- [x] safe handling of expired/deleted/unavailable Story reads.

The Home Following feed remains a separate chronological server-authoritative surface. Story state must not mutate feed ordering or private fitness state.

## S8-D — owner authoring and deletion UX

Status: **source-complete for image-only v1**.

- [x] Story authoring route and Home entry point, including when the Story list is empty;
- [x] safe-area-aware image selection/preview/status/actions surface;
- [x] bounded loading, authentication, processing, moderation and error states;
- [x] upload progress and restart-safe pending result recovery;
- [x] explicit publish action after managed-media approval;
- [x] deterministic Stories revalidation after create/delete;
- [x] owner-only delete from the Story viewer;
- [x] no fabricated client Story insertion after create/delete.

## Approved v1 source result

**Remaining autonomous source packages inside the already approved image-only v1 contract: 0.**

That statement is intentionally narrower than “Stories are fully done.” It means the source contract defined for LG-H2/image-only v1 is implemented. Release/runtime evidence and product expansion remain separate below.

## S9-A — direct camera capture

Status: **source-complete and exact-head Mobile CI-complete; physical runtime evidence remains a separate gated layer.**

Product/privacy contract:

- [x] the native Story authoring surface offers `Take photo` in addition to media-library selection;
- [x] web does not expose a camera action;
- [x] camera access is requested only when the user explicitly chooses the camera action;
- [x] camera cancellation returns to the authoring surface without publishing or creating Story state;
- [x] capture remains **one still image only**; no video or audio capture is added;
- [x] captured image metadata is validated before processing;
- [x] captured images enter the same bounded resize/JPEG preprocessing used by existing Story images;
- [x] captured images enter the same signed `story_image` upload/finalize/moderation polling lifecycle;
- [x] publication still requires an owned approved managed asset with its exact current `stateVersion`;
- [x] replacement/removal/restart-safe draft behavior remains unchanged;
- [x] no Story-specific upload transport, backend endpoint, schema, visibility rule or moderation bypass is introduced;
- [x] camera and photo-library permission disclosures explicitly cover the Social/Stories uses already present in source;
- [x] microphone/audio permission remains disabled for this image-only capability.

Native/runtime boundary:

- the project already depends on `expo-camera` for barcode scanning, so this source package adds no dependency;
- the camera permission disclosure in Expo native configuration names Story photo capture;
- native configuration text only takes effect in a matching rebuilt binary, so **no physical/native completion is claimed until a separately authorized native build/device validation is performed**;
- this package performed no build, install, OTA/EAS publication, backend deployment or provider activation.

## S9-B — optional Story captions

Status: **source-complete and exact-head backend/mobile CI-complete; deployed migration/moderation/runtime evidence remains a separate gated layer.**

Product/privacy/compatibility contract:

- [x] an image Story may include one optional textual caption;
- [x] captions are trimmed and bounded to 1–1,000 characters when present; blank mobile input is omitted rather than creating empty server content;
- [x] captions are persisted server-side with the Story rather than treated as authoritative local UI state;
- [x] the existing schemaVersion-1 Story list/get/create response shape remains unchanged so already released strict mobile parsers are not broken by a backend rollout;
- [x] caption reads use a separate versioned authenticated Story caption contract;
- [x] caption reads reuse the same active-Story authority as image reads, including self/Following visibility, block filtering, moderation restrictions, deletion and 24-hour expiry;
- [x] Story idempotency binds the caption value as well as the managed image, so a reused key cannot silently change published content;
- [x] authored Story captions participate in the ownership-safe data-access export projection;
- [x] mobile authoring exposes a bounded multiline caption field and character count;
- [x] the viewer renders the server-returned caption without weakening the strict base Story parser;
- [x] caption loading is fail-soft for staged rollout, so an otherwise readable image Story remains readable if the caption subresource is temporarily unavailable;
- [x] caption text is a distinct `story_caption` Social moderation surface under `social-text-v1`;
- [x] caption moderation runs before Story persistence/media attachment and fails closed for review/reject/provider failure when enforcement is active;
- [x] failed caption moderation creates no Story and leaves the approved managed image unattached for a safe retry;
- [x] moderation audit persistence stores bounded metadata/hash rather than raw Story caption text;
- [x] new caption copy is localized in English and Russian;
- [x] no alternate media transport, client-owned expiry, visibility bypass or unmanaged Story record is introduced.

Source/CI evidence:

- backend PR #218 exact head `f648c5d5268426568f0d1f6cd1f3189d07301bc7` passed Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI before merge;
- backend PR #218 merged to `main` as `64981c086f8456817ba6ab3a2d5e1911add6e228`;
- mobile PR #621 exact head `f6011e92993a52bab24b4d14fbd8c08a02fea752` passed repository/changed-file audits, TypeScript, full regression tests, expanded-model smoke, Expo export and Expo Doctor before merge;
- mobile PR #621 merged to `main` as `54c6b983b0d285c8ddf5c4316b9cd8bab27c569b`;
- backend PR #219 exact head `b65f35fe2d43c156651afcb96d54e188961f6c35` passed Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI before merge;
- backend PR #219 merged to `main` as `3733206f405e3dac842303d6d596b1f9ab75510f`;
- PR #219 includes forward migration `0043_story_caption_moderation_surface` and permanently includes the dedicated Story-caption moderation integration test in Backend PostgreSQL CI.

Environment/release boundary:

- source includes forward migrations `0042_social_story_captions` and `0043_story_caption_moderation_surface`, but this roadmap does **not** claim that either migration has been executed in production or staging;
- a caption-enabled mobile release must not target an environment that lacks the compatible Story-caption schema/runtime;
- production text-moderation enforcement/provider activation remains a separately authorized environment decision;
- these source packages performed no backend deployment, migration execution, native build/install, OTA/EAS publication, provider activation or credential change.

## S9-C — one bounded text overlay

Status: **contract-approved; backend/mobile source implementation not yet complete.**

This is deliberately narrower than a general Story editor. S9-C adds one optional server-authoritative text overlay to an existing image Story while preserving the current managed-image lifecycle.

### Product contract

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

Approved UX scope:

- [ ] one optional text overlay only;
- [ ] fixed `top`, `center` or `bottom` placement selected by the author;
- [ ] one reviewed high-contrast visual treatment owned by the client design system;
- [ ] authoring preview shows the overlay over the existing Story image;
- [ ] viewer renders the server-returned overlay over the image;
- [ ] caption remains a separate below-image field and may coexist with an overlay;
- [ ] blank overlay input is equivalent to no overlay.

Explicitly deferred from S9-C:

- free dragging or arbitrary x/y coordinates;
- rotation, scaling or gesture transforms;
- custom fonts, font sizes, colors, gradients or alignment controls;
- multiple text blocks;
- stickers, emojis as separate movable objects, drawings, music or effects;
- rasterizing/re-uploading a new image merely to attach overlay text;
- video composition.

### Backend authority and compatibility

- [ ] persist overlay text and placement with the Story under a forward migration;
- [ ] enforce an atomic invariant: overlay text/placement are both null or both present;
- [ ] reject unknown placements rather than silently coercing them;
- [ ] bind overlay text and placement into Story idempotency identity;
- [ ] preserve the existing strict schemaVersion-1 Story list/get/create response shape for released clients;
- [ ] expose overlay through a separate versioned authenticated Story subresource such as `GET /v1/social/stories/:storyId/overlay`;
- [ ] overlay reads must reuse the same active-Story authority as image/caption reads: self/Following visibility, block filtering, moderation restrictions, deletion and 24-hour expiry;
- [ ] authored overlay text/placement must participate in ownership-safe data-access export;
- [ ] old clients may display only the base image/caption; they must not crash or receive an unexpected key in the strict Story v1 DTO.

### Text moderation

- [ ] add a distinct `story_overlay_text` Social moderation surface under the existing `social-text-v1` policy;
- [ ] bound that surface to 280 characters;
- [ ] extend the closed PostgreSQL moderation-surface CHECK through the same forward migration chain;
- [ ] moderate overlay text before Story persistence/media attachment when enforcement is enabled;
- [ ] review/reject/unavailable/timeout/invalid outcomes fail closed and create no Story;
- [ ] a moderation failure leaves the approved `story_image` unattached and reusable for a safe retry;
- [ ] moderation audit stores hash/metadata, not raw overlay text;
- [ ] overlay moderation must not be bypassed merely because media OCR also exists.

### Mobile contract

- [ ] add a strict versioned overlay DTO/parser separate from the base Story DTO;
- [ ] omit the overlay from create payloads when the normalized text is blank;
- [ ] authoring provides bounded text input plus an accessible top/center/bottom selector;
- [ ] no hard-coded screen-height positioning; preview and controls remain Safe-Area/ScrollView compatible;
- [ ] viewer fetches overlay fail-soft in parallel with caption so a temporarily unavailable overlay subresource does not make the base image Story unreadable;
- [ ] overlay rendering remains presentational; server response is authority for published overlay content/placement;
- [ ] EN/RU copy and accessibility labels are included.

### Media boundary

S9-C intentionally does **not** alter the managed `story_image` pipeline. The selected/captured image continues through existing resize/JPEG upload/finalize/media-moderation/delivery before Story publication. Overlay text is structured Story metadata, not a second image upload and not an unmanaged local-only edit.

This avoids replacing an already approved image solely because text was added after upload. It also preserves one media ownership/retention path while giving the server independent text-moderation and export authority.

### Completion order

1. backend schema/migration + overlay DTO/subresource + moderation + export + tests;
2. exact-head Backend CI/PostgreSQL/account-deletion gates as triggered;
3. merge backend authority first;
4. strict mobile contract/parser/API + authoring/viewer UI + tests;
5. exact-head Mobile CI and merge;
6. update this checkpoint with source/CI evidence;
7. collect separately authorized environment/device/release evidence later.

No deployment, migration execution, provider activation, credentials, native build/install or OTA/EAS publish is authorized by S9-C source work.

## G1 — physical-device and standalone runtime evidence

Status: **gated; not yet established by source CI**.

Run only with explicit authorization for native/physical runtime work. Evidence should cover at least:

- media-library permission allow/deny/retry;
- image selection and cancellation;
- camera permission allow/deny/retry and capture cancellation;
- direct camera still-photo capture entering the same preview/upload path;
- large-image preprocessing and preview behavior;
- upload progress and interrupted-network recovery;
- process/restart recovery of an in-flight managed-media draft;
- moderation allow/review/reject/failure presentation against the authorized environment;
- publish, view, mark-viewed and owner delete;
- caption create/read behavior against a backend with `0042`/`0043` applied;
- overlay create/read/render behavior once S9-C source is complete and its migration is applied;
- 24-hour expiry behavior against server authority;
- self/Following/private/block/restriction visibility boundaries, including caption/overlay reads;
- account switch/cache isolation;
- offline cached-preview behavior followed by server revalidation;
- second-device viewed/delete convergence where the environment supports it;
- iOS/Android behavior for supported release targets.

Do not convert missing runtime evidence into speculative source churn.

## G2 — deployed backend, media provider and moderation evidence

Status: **gated**.

Source-complete managed-media/text contracts do not prove that a production or staging object store, CDN, moderation provider, worker lifecycle or migration is activated correctly.

Before broad release, separately authorize and verify the applicable environment for:

- Stories database migration state, including `0042` and `0043` before caption moderation is relied upon and the future S9-C migration before overlay release;
- private quarantine/upload storage;
- signed upload/finalize path;
- text and image moderation state transitions under the selected environment;
- approved derivative delivery;
- retention/cleanup behavior;
- failure/retry behavior;
- provider/storage/CDN credentials and configuration;
- privacy-safe operational evidence.

No deployment, migration execution, provider activation or credential change is authorized by this roadmap.

## G3 — release/privacy evidence

Status: **gated**.

Stories broad-release evidence must remain consistent with Social privacy/moderation/release policy, including legal policy review where required, account deletion, report/restriction behavior, accessibility/runtime evidence, localization and rollback/recovery expectations.

## Product expansion inventory

The capabilities below are outside S9-C and remain candidates/deferred until separately contracted:

1. **Richer composition beyond one overlay:** free positioning, multiple text blocks, style controls, drawings, stickers, effects or multi-asset composition.
2. **Story interactions:** Story-specific replies/reactions and their notification/privacy/moderation semantics.
3. **Audience controls:** per-Story audience selection, Close Friends or equivalent visibility models.
4. **Video Stories:** video acquisition, transcoding, moderation, delivery, duration/bandwidth limits and resumable/multipart upload where needed.
5. **Persistence surfaces:** archive, highlights or other post-expiry owner-visible retention products.
6. **Owner viewer surface:** a privacy-reviewed list/count of viewers if the product chooses to expose one.
7. **Advanced media:** music and other richer formats not covered by the bounded S9-C overlay.
8. **Analytics/ranking:** Story analytics, recommendation or ranking signals remain separately consent/product/privacy gated; they are not implied by viewed-state storage.

This inventory is not implementation authorization and does not define final UX. Items may be rejected, reordered or split after review.

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

A future Stories capability is not “done” unless its applicable layers are distinguished explicitly:

- **contract/source done:** backend/mobile source and tests are complete;
- **CI done:** exact-head required gates passed;
- **environment done:** applicable migrations/providers/storage/workers are configured and validated under authorization;
- **runtime done:** required physical-device/standalone scenarios were exercised;
- **release done:** required privacy/legal/accessibility/localization/rollback evidence exists.

Roadmap summaries must name the highest completed layer instead of collapsing all five into a single “complete” label.
