# Latest Handoff

Updated: 2026-08-11

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current repository/runtime `main`: `b354fb58f8b1759cca0e2dfd4cb68d48ad5b26b4`.
- Latest runtime merge: PR #617 `fix(workouts): persist program builder state`.
- PR #617 exact validated head: `4773f60339d70f4ee40163ecc92a492547c9ccc7`; Mobile CI #2179 run `31491962947` passed the full Hermes mobile gate.
- PR #617 is a bounded post-LG-5 regression fix; LG-5 merged demonstrated-defect runtime batches remain **38**.
- Backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains CI infrastructure at exact head `f5c7f2d4cd1d150f5894fcc60725e85f05631d22`; its three exact-head gates must execute and pass before merge. Backend Hermes runner registration/access remains the known infrastructure dependency.
- LG-H2 Stories is **source-complete only for the approved image-only v1 contract**. `docs/roadmap/stories.md` is the focused Stories roadmap and prevents this from being confused with full product/release completion.
- LG-4 Workouts source convergence remains complete.
- **LG-5 validation-first source/CI QA is complete for the currently authorized source scope.**
- **There is no remaining approved autonomous source-refactor phase.**
- Coach product/material expansion remains deferred.
- Mobile issue #618 tracks the unresolved Home active-training-program contract; do not substitute recency/favorite/order heuristics.

## Stories audit handoff

The audited image-only v1 source surface is complete across both repositories.

Backend PR #214/current backend source provides:

- authenticated/idempotent create;
- 24-hour expiry and active-only reads;
- cursor list/get/viewed-state endpoints;
- self/Following/private/block/restriction enforcement;
- owner deletion/account cleanup/rate limits;
- managed-media `story_image` authority.

Mobile PRs #533/#535/current source provide:

- strict Story contracts/API/parsers;
- bounded account-scoped server-revalidated cache;
- Home Story strip and viewer with progress/advance/view acknowledgement;
- media-library image selection;
- bounded resize/JPEG preprocessing;
- signed upload/finalize/polling through the shared managed-media composition;
- account-scoped restart-safe media draft recovery;
- approved-media-only publication;
- authoritative create/delete refresh and owner delete.

**Remaining autonomous source packages inside the already approved image-only v1 contract: 0.**

Not complete by that statement:

1. physical-device/standalone runtime evidence;
2. deployed storage/CDN/moderation/provider/migration evidence;
3. broad release/privacy/legal/accessibility evidence;
4. future product expansion such as richer authoring, Story interactions, audience controls, video, archive/highlights, viewer surfaces or advanced media/analytics.

Items 1–3 are authorization-gated. Item 4 is candidate inventory only until explicitly prioritized and reviewed.

## Final LG-5 runtime sequence

- #607 Workouts Exercise Library active-theme/material convergence — batch 34.
- #610 New Routine arbitrary-exercise virtualization — batch 35; exact head `2fc3a0aba57648d7940cd928b441eefd0b6c531a`, Mobile CI #2161 run `31473376632`, merge `ec380756151464872304690c0a571a90650a8ef9`.
- #611 Program Workout Editor arbitrary draft-exercise virtualization — batch 36; exact head `9dbc7b89fa4a69f719427af76d1749c2d46d2def`, Mobile CI #2162 run `31473525715`, merge `2ca233420b209401279b6ced832e3c7364967cf0`.
- #614 Safety Gate narrow-width/localized-copy/accessibility hardening — batch 37; exact head `ca2a9277cac376b52d6332798ce3cf6ebadadd11`, Mobile CI #2167 run `31474957650`, merge `d0f44018ea457a4acc2d33bc69fb608621b3fbe5`.
- #613 Program Editor/Picker interaction-material convergence — batch 38; exact head `fae10aa93a1d26279eabe9d56eaf1efeb7103974`, Mobile CI #2170 run `31476083264`, merge `a8b2c4530cbdc944e7a3821cdc7926296fb78f18`.

PR #612 was intentionally rejected/reset after confirming Program Detail/Builder program-day collections are bounded by the seven-day `WeekdayKey` model. PR #617 is later regression repair and not a new LG-5 package.

## Next work

There is no broad or numbered follow-on source-refactor phase to start autonomously.

1. Resolve backend #215 runner registration/access outside the source PR; then require Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI to execute and pass on exact head before ready/merge. Do not route routine validation back to hosted runners just to bypass the blocker.
2. Keep the approved Stories image-only v1 source scope closed. Collect its physical-device/provider/release evidence only when separately authorized; start a Stories expansion candidate only after explicit product/privacy/media prioritization.
3. Collect other physical-device/native/release/deployment/provider evidence only when separately authorized.
4. Keep LG-H3 Steps blocked until a reviewed native health/activity source, dependency and permissions contract exists and physical runtime work is authorized.
5. Preserve chronological Following semantics; LG-H4 ranking/retention remains later.
6. Keep Coach product/material expansion deferred until explicit reprioritization.
7. Keep Home active-program behavior unchanged until issue #618 receives a reviewed state/product contract.
8. Future source work is limited to newly demonstrated bounded regressions or explicitly prioritized product work.

## Contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history read-only semantics, private persistence/sync schemas, exercise repository/provider behavior, Social/Stories server authority/privacy, Coach API/auth contracts, or backend ownership/revision/idempotency contracts as incidental follow-up.

Potentially long collections retain one suitable virtualized boundary with stable identity. Keyboard forms retain active-input/primary-action reachability. Direct interaction feedback changes material state rather than relying on generic opacity. Safe-area ownership remains singular per edge.

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve the explicit authorization marker: **no separate autonomous source-refactor phase is currently authorized**.

Do not perform authorization-gated OTA/EAS publication, native build/install, backend deployment, production/provider activation, credential/DNS, native-health or store actions unless explicitly requested.
