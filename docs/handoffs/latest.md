# Latest Handoff

Updated: 2026-08-09

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `89bae8d1085ffd72131142700c1d625d6fa91f40`.
- Latest runtime merge: PR #533 `Add server-backed Stories to Home`.
- PR #533 exact validated head: `6fde319be2c932620ecec177e3c7e4b7e7e0032a`; Mobile CI #1984 passed the full required gate.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Stories backend foundation: PR #214 merged as `2339f6ce…`; exact validated head `9a5af3aba1f4470f261eb9ea00a6e2f2f8979bfe`.
- Active priority: **LG-H2 Story authoring — reuse managed media for `story_image` upload/approval/create/delete**.
- **Coach material remains deferred.**

## Stories completed

Backend v1 is real and server-authoritative: image-only Stories, 24-hour expiry, Following/self visibility, private/block/moderation enforcement, viewed state, idempotent create, owner delete, account-deletion cascade, retention cleanup and privacy/export coverage all exist in merged source and PostgreSQL CI.

Mobile PR #533 consumes that contract with:

- strict DTO/media/lifecycle parsing and Story error mapping;
- authenticated list/get/view/delete/create-capable API boundary;
- account-scoped two-minute bounded cache with expiry filtering and backend revalidation;
- separate `useSocialStories` ownership;
- Home order: daily metrics → Stories → Following;
- seen/unseen ring from server `viewed` state;
- safe-area/content-driven Story viewer using shared `LiquidGlassIconButton`;
- pull-to-refresh of both Stories and Following without coupling their state.

The only regression blocker was an obsolete pre-contract assertion in `tests/homeSocialFirst.source.test.ts` that banned `Story`/`Stories` entirely. It now requires real server-backed Story ownership and still rejects fabricated steps/demo Story state. Temporary diagnostic workflow/script changes were removed before merge.

## Next package

Implement Story authoring as one bounded mobile package:

1. extend existing mobile managed-media asset types/parsers with `story_image`;
2. reuse signed image upload/finalization/polling/moderation state — no second pipeline;
3. permit Story create only when the owned asset is `approved`, using its exact `stateVersion`;
4. expose processing/review/rejected/failed states with localized UI;
5. refresh the authoritative Home Story list after creation;
6. expose owner delete from an owned Story surface;
7. keep v1 image-only: no arbitrary URLs, caption, text overlay or video.

After that, reassess remaining LG-H2 polish/empty states before moving to unrelated secondary material.

## Boundaries

- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- Coach material remains intentionally deferred.
- Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credentials/DNS changes, destructive production cleanup, HealthKit/Health Connect activation, or store submission without direct authorization.
