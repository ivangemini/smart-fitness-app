# Smart Fitness Current Status

Updated: 2026-08-09

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `279a09e4b73e067a2cb0c1d836b8da809ce0b6b1`.
- Latest runtime merge: PR #537 — Exercise Detail / shared secondary-material theme convergence.
- PR #537 exact validated head: `5ee5a3dfb1cf3591168821c3b4275b26e597aca4`; Mobile CI #1992 passed the full required gate.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current Stories backend baseline: merge `2339f6ce…` from backend PR #214; exact validated head `9a5af3aba1f4470f261eb9ea00a6e2f2f8979bfe`.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- Progress/exercise secondary-material reassessment is active; the first bounded package is complete.
- **Coach material remains deferred by explicit product priority.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## Liquid Glass / Home status

Completed milestones through LG-3I remain unchanged. PRs #533 and #535 complete the current LG-H2 server-backed Stories consumption and owner-authoring lifecycle.

Home is now a social-first hybrid:

1. compact personal daily metrics;
2. server-authoritative Stories with an always-available owner authoring entry;
3. existing server-authoritative Following Feed.

### Stories backend — complete for v1 source scope

Backend PR #214 established:

- strict versioned image-only Story contracts;
- 24-hour server-authoritative expiry;
- authenticated/idempotent creation;
- owner deletion and account-deletion cascade;
- Following/self visibility, private-profile, block and moderation restriction enforcement;
- reuse of the existing managed-media moderation/delivery/cleanup pipeline via `story_image`;
- idempotent viewed state;
- bounded pagination/order;
- retention cleanup to `retention_expired`;
- privacy/data inventory and complete Social export coverage;
- PostgreSQL lifecycle/privacy/export evidence in CI.

No backend deployment or production migration was performed.

### Stories mobile read/view — complete

Mobile PR #533 added:

- strict Story DTO/parser/error contracts and authenticated API client;
- bounded account-scoped short-lived Story cache with immediate server revalidation;
- separate `useSocialStories` state so Following feed ownership remains unchanged;
- horizontal Home Story strip between daily metrics and Following;
- backend order and server `viewed` state;
- safe-area, content-driven Story viewer;
- idempotent viewed-state acknowledgement;
- localized loading/error/retry copy;
- regression guards for strict parsing, cache expiry/account isolation, Home ordering and Liquid Glass/safe-area ownership.

### Stories mobile authoring/delete — complete

Mobile PR #535 added:

- `story_image` support to the existing strict managed-media contracts, parser and API;
- reuse of the existing image-selection/preparation, signed upload, finalize and polling pipeline instead of a second uploader;
- account-scoped restart-safe draft state for unfinished unbound Story media;
- pending ImagePicker-result recovery after Android activity destruction;
- bounded upload/processing/review/approved/rejected/failed/deleted owner states;
- exact approval gate: Story create is possible only for an owned approved `story_image` and uses its current `stateVersion`;
- deterministic asset-scoped create idempotency;
- authoritative Home Story revalidation after create/delete rather than fabricated local server objects;
- owner delete action in the Story viewer after resolving the current server Social profile;
- `Your story` / Add entry on Home even when there are zero current Stories;
- localized authoring/status/error/delete copy and safe-area/content-driven layout;
- strict parser/state/source regression tests.

Story v1 remains intentionally image-only: no arbitrary URL, caption, text overlay, video or client-authored expiry.

## Progress / exercise material status

PR #537 completed the first evidence-backed package from the post-Stories reassessment:

- `ExerciseDetailScreen` now uses active semantic theme colors through extracted adaptive styles rather than `Colors.dark`;
- `MuscleMap` now derives SVG fills, border, background and label colors from the active theme;
- shared `StatChip` now follows the active theme, fixing its use in Exercise Detail and other secondary cards;
- the Exercise Detail back control now uses shared `LiquidGlassIconButton`;
- the inert unimplemented “More” affordance was removed instead of presenting a false button;
- media play/pause uses a shared button primitive;
- exercise lookup, GIF/media behavior, favorite persistence, sharing, workout-history/progress calculations, navigation and safe-area/content-driven layout were preserved;
- `tests/exerciseDetailThemeConsistency.source.test.ts` guards the theme and responsive/media boundary.

A repository search during this package found no remaining indexed `Colors.dark` occurrences after the change. The broader Progress/exercise audit must still check for other legacy material debt instead of treating that single token pattern as exhaustive.

## Validation state

PR #537 exact head `5ee5a3dfb1cf3591168821c3b4275b26e597aca4` passed Mobile CI #1992:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

No review submissions or inline review threads blocked merge. PR #537 merged as `279a09e4b73e067a2cb0c1d836b8da809ce0b6b1`.

The prior docs-only regression lesson remains active: `docs/implementation-plan.md` must retain the reviewed local-state decision link and the explicit “There is no remaining approved autonomous source-refactor phase” source-guard marker unless the underlying contract is deliberately changed.

Source/CI validation is not physical-device or release proof.

## Next roadmap work

- Continue the remaining Progress/exercise secondary-material audit for actual legacy surfaces, duplicate controls, non-semantic colors and brittle geometry.
- Implement only bounded evidence-backed packages. If the audit finds no material debt, record that conclusion and move to LG-4 Workouts rather than generating cosmetic churn.
- LG-5 bounded elevated chrome/motion and LG-6 visual QA/stabilization follow later.
- LG-H3 Steps remains blocked on a reviewed native health/activity capability and permissions. Do not infer steps from workouts.
- LG-H4 feed retention/ranking remains later; preserve chronological Following semantics.
- Coach material remains intentionally deferred.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, backend deployment or migration execution, production/provider activation, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
