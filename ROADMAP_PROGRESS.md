# Smart Fitness Roadmap Progress

Updated: 2026-08-22

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI, deployments and live Git history override stale prose.

Focused roadmap references:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/knowledge-learning.md`;
- `docs/roadmap/training-intelligence.md`;
- `docs/roadmap/exercise-preferences-smart-replace.md`.

## Verified phase baseline

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** complete for reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained as presentation over Coach.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Progress Analytics:** source/CI-complete for reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D complete; P17-E remains requirement-gated rather than unfinished default work.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete and merged; production Coach → Learn mappings remain separate editorial/product activation.
- **Phase 19 — Exercise + Training Intelligence:** reviewed scope merged through #803/#807.
- **Phase 20 — Progress Photos / Body Composition:** P20-A/P20-B/P20-C merged through #804/#805/#806 and source/CI-complete; physical-device evidence remains.
- **Phase 21 — Workout Assistant:** P21-A through P21-E source/CI-complete and merged through #810; backend schema-v2 compatibility is deployed and verified in production. OTA publication evidence and real-device smoke remain.

There is no approved P21-F or Phase 22. Do not invent a new numbered phase merely to continue development.

## Current verified checkpoints

### Mobile

- Phase 21 exact PR head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068` passed Mobile CI #2806.
- PR #810 was squash-merged to `main` as `a2abde02e31b5ed1207e67835144e9359aea711e`; its merge message contains `[ota]`.
- Exercise Preferences foundation #816 merged as `99427b189792489c1977d96959a366bac05962b9` after exact-head Mobile CI passed.
- Deterministic read-only Smart Replace explorer #818 merged as `d396fc343019b96578f09fa2041dc6893bc5da9e` after exact-head Mobile CI passed.
- Active-session replacement safety #819 merged as `c52277f580b5255d801a8cc045b0d2d4d708dc54`; exact PR head `438ae2946abf58eec3dc8bd2da371b937a126cb2` passed Mobile CI #2823.
- Active-session reviewed Smart Replace Apply #820 exact PR head `fb70be57fe735e835494e6895a5016d35fe962bd` passed Mobile CI #2830 and squash-merged as `872d0a677d85b0d856a9ab6df6e08d655e949739` with `[ota]`.
- #819/#820 preserve completed/legacy exercise identity and mutate only explicitly pending active-session sets while keeping existing set prescription fields intact.
- Actual EAS publication success/update ID/group/runtime for `[ota]` merges remains separate evidence until observed.

### Backend / Admin

- Phase 21 sync dependency #332 is merged as `b5a054e49e795a75f19c16ba85f507396e4598b6`.
- Admin write-plane #325 and follow-up hardening #335/#336/#337 are merged.
- Administration navigation activation #340 merged as `75c47a2a8973e41146c98d78cab07baa007f1274` after Backend CI #2453.
- Backend Admin session-v2 repair #342 merged as `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c` after Backend CI #2458 and is the verified production backend SHA.
- Admin login BFF session-v2 repair #343 merged as `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50` after Backend CI #2461 and is the verified production Admin-console SHA.
- Production verification confirmed backend/PostgreSQL health, `/health` HTTP 200, migration `0056_admin_control_plane.sql`, expected Admin schema/constraints, authorized schema-v2 `owner / bootstrap` session with permissions, account search, roles, feature flags, audit reads and ordinary-user 403 gating.
- Final authorized browser smoke passed for login, global `Администрирование`, `/administration`, `/administration/audit`, refresh persistence and direct-navigation persistence with 0 browser JS exceptions.
- **Admin production activation is closed.** Do not retain it as remaining roadmap work unless a reproduced production defect appears.

## Stable delivered authority

### Phase 18 — Knowledge & Learning

The runtime path is complete. Production Learn recommendations remain fail-closed unless an approved canonical `findingCode → articleId` mapping exists. Models/runtime must not synthesize article IDs or fallback canonical lessons.

### Phase 19 — Exercise + Training Intelligence

Delivered authority includes:

- canonical muscle taxonomy and reusable SVG anatomy;
- exact/fail-closed muscle mapping, filtering and drill-downs;
- deterministic 7/30/90-day completed-session analytics;
- explicit load/reps/e1RM/session-volume PR types and evidence-backed findings;
- reviewed movement pattern, EN/RU technique cues, common errors, ROM guidance, qualitative fatigue cost and substitutions for 15 canonical local exercises.

### Phase 20 — Progress Photos / Body Composition

Delivered source includes:

- private standardized front/side/back progress photos with app-owned local storage;
- camera/library intake with re-encoding before persistence;
- durable deletion/account cleanup and privacy coverage;
- deterministic same-pose Before/After comparison and fail-closed overlay;
- nearby stored weight/waist only as separate evidence;
- read-only 30/90-day body-composition progress using existing calculation authorities;
- no cloud/provider/social photo upload, AI vision or photo-derived body-fat estimate.

### Phase 21 — Workout Assistant

Delivered source includes:

- row-aligned Previous load/reps/RPE and exact prescribed Today guidance;
- automatic rest timer only after explicit completion, using configured `restSeconds`;
- deterministic prescribed-load warm-up proposal with explicit Add/Skip;
- warm-up exclusion from working-set indexing and working analytics;
- typed `setType` (`working | warmup | backoff | drop | amrap`) plus optional `supersetId`;
- additive workout-session schema v2 while legacy sessions remain v1 and malformed envelopes fail closed;
- rare deterministic contextual adjustment with explicit Apply/Ignore and no silent rewrite.

### Exercise Preferences + Smart Replace

This is an approved unnumbered expansion, not P21-F/Phase 22.

Delivered through #820:

- device-local per-exercise `avoid` plus optional personal note, separate from favorites;
- fail-closed preference persistence and explicit-save RU/EN detail UI;
- deterministic reviewed-substitution candidate ranking with exact canonical IDs, `avoid` filtering and a bounded three-candidate list;
- read-only detail candidate explorer;
- active-session replacement primitive that changes only sets with `completed === false`;
- completed sets and legacy completion evidence retain the original exercise identity;
- pending set IDs, load, reps, target/actual RPE, set type and superset membership are preserved during replacement;
- reviewed Smart Replace candidates map into the workout catalog only by exact canonical ID, with no name fallback;
- reviewed candidates appear first in the explicit replacement selector while the manual catalog remains available;
- saved `avoid` affects the reviewed shortlist but does not prohibit explicit manual selection;
- no new backend/sync schema and no automatic replacement.

Program/template Apply remains gated. Current custom-template update authority rebuilds exercise identities from names/indexes and does not provide a reviewed prescription-remapping contract, so Smart Replace must not be wired into that path yet.

## Remaining executable work

### 1. Current OTA + Phase 21 device evidence

- confirm the `Publish EAS Update` run triggered by latest `[ota]` merge `872d0a677d85b0d856a9ab6df6e08d655e949739` succeeded;
- record EAS update ID/group/runtime `1.0.3` and production branch/channel evidence;
- because `872d0a677...` contains Phase 21 and Smart Replace history in its ancestry, a successful current production OTA is the preferred user-facing release checkpoint;
- retain the historical #810/a2ab OTA run as an unobserved audit item if its exact old run metadata is still required;
- run a real-iPhone active-workout smoke covering Previous/Today, rest timer, warm-ups, set types/supersets, Apply/Ignore, active-session persistence/sync sanity and reviewed/manual replacement behavior.

### 2. Phase 20 physical-device evidence

Run `docs/qa/progress-photo-device-validation.md` on the intended signed iPhone build and record dated evidence for camera/library intake, relaunch persistence, deletion/account cleanup, comparison, overlay/fail-closed aspect behavior and visual quality.

### 3. Phase 14 external/provider evidence

Continue only when the external prerequisites exist:

- Push: APNs/FCM configuration plus signed-device permission/token/delivery/tap evidence;
- Labs: configured HTTPS S3-compatible storage/model plus bounded lifecycle and picker evidence;
- Steps: signed HealthKit/Health Connect evidence;
- Stories: remaining mobile/device runtime evidence.

### 4. Phase 18 content activation

Activate Coach → Learn mappings only from approved canonical content authority. This is editorial/product activation, not missing runtime infrastructure.

### 5. Smart Replace program/template contract

Do not apply reviewed replacements to persisted workout/program templates until a separate reviewed identity/prescription preservation contract exists. The contract must define stable source/replacement identity, deterministic prescription remapping, persistence/sync consequences and reversal/confirmation behavior.

## Approved future expansion queue

The following directions are approved for planning but are not automatically authorized as a new numbered phase:

- Adaptive Program + Recovery Engine;
- Exercise Preferences + Smart Replace — active-session source scope delivered; program/template scope remains gated by `docs/roadmap/exercise-preferences-smart-replace.md`;
- Weekly Training Review;
- Apple Health / Apple Watch expansion;
- Progress Stories / Share Cards;
- Trainer / Coach collaboration layer.

Each direction still requires reviewed authority boundaries before work outside an already documented slice.

## Execution order

1. Confirm latest `[ota]` publication metadata for merge `872d0a677d85b0d856a9ab6df6e08d655e949739` when workflow evidence is observable.
2. Run Phase 21/current active-session real-iPhone smoke after that OTA is available.
3. Run Phase 20 signed-iPhone validation.
4. Continue Phase 14 external/provider/device evidence when prerequisites are available.
5. Activate Coach → Learn mappings only when approved content mappings exist.
6. Keep program/template Smart Replace Apply gated until stable identity and prescription-remapping rules are reviewed.
7. Do not create P21-F/Phase 22 or reopen closed source scopes without a reproduced defect or newly reviewed requirement.

## Release boundary

Source merge, backend deployment, database migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims and must not be conflated.
