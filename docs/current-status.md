# Smart Fitness Current Status

Updated: 2026-08-22

This is the short mutable cross-repository checkpoint. **Live branch/commit/PR/CI truth must be read from Git/GitHub, not copied from this file.** Exact source, tests, CI, deployments and Git history override this checkpoint if it becomes stale. Stable architecture belongs in `docs/project-context.md`; forward sequencing belongs in `ROADMAP_PROGRESS.md`, `docs/implementation-plan.md` and focused roadmap files.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Phase 18 Knowledge & Learning remains closed for P18-A through P18-H.
- Phase 19 Exercise + Training Intelligence reviewed scope is merged through #803/#807.
- Phase 20 P20-A/P20-B/P20-C is merged through #804/#805/#806 and source/CI-complete for the reviewed scope.
- #811/#812 keep `Mobile CI / validate` present on PRs and validate long-lived PR merge refs against the live remote base branch.
- Phase 21 Workout Assistant P21-A through P21-E exact PR head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068` passed Mobile CI #2806 and #810 merged as `a2abde02e31b5ed1207e67835144e9359aea711e`.
- Exercise Preferences foundation #816 merged as `99427b189792489c1977d96959a366bac05962b9`.
- Read-only deterministic Smart Replace explorer #818 merged as `d396fc343019b96578f09fa2041dc6893bc5da9e`.
- Active-session replacement safety #819 exact head `438ae2946abf58eec3dc8bd2da371b937a126cb2` passed Mobile CI #2823 and merged as `c52277f580b5255d801a8cc045b0d2d4d708dc54`.
- Active-session reviewed Smart Replace Apply #820 exact head `fb70be57fe735e835494e6895a5016d35fe962bd` passed Mobile CI #2830 and merged as `872d0a677d85b0d856a9ab6df6e08d655e949739` with `[ota]`.
- #820 maps reviewed candidates into the workout catalog by exact canonical ID only, keeps the manual catalog available and routes explicit selection through the pending-set-only replacement safety primitive.
- Completed/legacy sets retain their original exercise identity; pending set IDs, load, reps, target/actual RPE, set type and superset membership are preserved when replaced.
- No workout-template/program mutation or new workout-session sync schema was added by the Smart Replace expansion.

### Backend / Admin

Repository: `ivangemini/smart-fitness-backend`.

- Admin v5-v12 #305 and backend agent-tooling #324 are merged.
- #330 disabled automatic Vercel Git deployments for Admin; the VPS/GitHub Actions Admin path remains authoritative for Admin deployment.
- Admin write-plane #325 is merged as `a3f260aca1089548202eeeee8b96624e931b7efc`; follow-up hardening #335/#336/#337 is merged.
- Phase 21 sync dependency #332 is merged as `b5a054e49e795a75f19c16ba85f507396e4598b6` and requires no database migration.
- #340 activated global Administration navigation and merged as `75c47a2a8973e41146c98d78cab07baa007f1274` after Backend CI #2453.
- #342 repaired the backend Admin session contract to schema v2 and merged as `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c` after Backend CI #2458.
- #343 repaired the Admin login BFF schema-v2 validator and merged as `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50` after Backend CI #2461.
- Production backend is deployed at exact SHA `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c`.
- Production Admin-console is deployed at exact SHA `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50`.
- Production verification confirmed backend/PostgreSQL health, `/health` HTTP 200, migration `0056_admin_control_plane.sql`, expected Admin schema/constraints, authorized schema-v2 `owner / bootstrap` session with permissions, account search, roles, feature flags, audit reads and ordinary-user 403 gating.
- Final authorized browser smoke passed for login, global `Администрирование`, `/administration`, `/administration/audit`, refresh persistence and direct-navigation persistence with 0 browser JS exceptions.
- No safe reversible production mutation target was available, so live write/audit mutation smoke remains intentionally unexecuted rather than simulated.
- **Admin production activation is closed.**

## Stable Exercise + Training Intelligence scope

The reviewed mobile authority includes:

- canonical muscle taxonomy and reusable local front/back SVG anatomy;
- exact/fail-closed muscle mapping, filtering, detail drill-downs and Progress heatmaps;
- deterministic completed-session analytics under explicit 7/30/90-day windows;
- load/reps/e1RM/session-volume PRs and evidence-backed `training-intelligence-v1` findings;
- reviewed `exercise-intelligence-v1` metadata for all 15 canonical local exercises;
- movement pattern, EN/RU technique cues, common errors, controlled ROM guidance, qualitative fatigue cost and reviewed substitutions.

Unknown or remote-only exercise IDs do not receive guessed intelligence. Runtime names, body-part labels and muscle labels are not inference authority for reviewed metadata.

## Exercise Preferences + Smart Replace boundary

Source delivered through #820:

- per-exercise device-local `avoid` and personal notes remain separate from favorites;
- candidate ranking starts only from reviewed substitutions and fails closed for unresolved identities;
- saved `avoid` filters the Smart Replace shortlist but never silently edits programs or blocks explicit manual selection;
- read-only detail candidates remain bounded to three;
- active-session Smart Replace appears only as an explicit replacement choice;
- active-session candidate mapping is exact canonical ID only, with no name fallback;
- active-session mutation requires at least one source set with `completed === false` and changes only those pending sets;
- completed and legacy-completion evidence is immutable under replacement;
- existing active-draft persistence is reused and no sync schema change was required.

Program/template Smart Replace Apply remains gated. The current custom-template update path rebuilds exercise identities from names/indexes and lacks a reviewed `workout.prescription` remapping contract. Do not wire Smart Replace into that path until stable identity and deterministic prescription preservation are defined and tested.

## Phase 20 delivered scope

### P20-A — private standardized progress photos

- private account-owned front/side/back photos;
- camera/photo-library input with repeatable capture guidance;
- re-encoding before persistence so imported EXIF/location metadata is not copied;
- deterministic app-owned local document storage;
- durable photo deletion and account cleanup;
- no cloud/provider/social upload and no photo-derived body-fat estimate.

### P20-B — deterministic visual comparison

- same-pose Before/After comparison with strict chronology;
- non-cropping rendering and fail-closed reviewed-aspect overlay;
- visible date/source identity;
- nearby stored weight/waist presented as separate evidence;
- no comparison persistence, AI vision or image-derived body-fat estimate.

### P20-C — body-composition progress

- read-only 30/90-day composition view under one explicit period boundary;
- existing weight and body-measurement analytics remain calculation authority;
- stored body-fat remains user-entered measurement evidence;
- private ready-photo timeline remains period-bounded;
- no new sync/provider upload/AI vision authority.

## Phase 21 / current OTA release boundary

Phase 21 source, backend compatibility and mobile merge gates are closed. Smart Replace active-session source scope through #820 is also merged.

The latest current OTA-eligible merge is `872d0a677d85b0d856a9ab6df6e08d655e949739`; its commit message contains `[ota]`. The repository `Publish EAS Update` workflow is configured for iOS `production` branch/channel and expected runtime `1.0.3`.

Treat actual workflow success, EAS update ID/group/runtime and phone delivery as separate evidence until observed. A successful OTA from `872d0a677...` is the preferred current release checkpoint because that commit contains Phase 21 and the later Smart Replace merges in its ancestry. The old exact #810/a2ab OTA run remains an audit detail if historical run metadata is still needed.

## Admin release boundary

**Closed.** Admin source, migration, backend deployment, Admin-console deployment and authorized production browser smoke are complete for the reviewed activation scope.

Do not reopen Admin activation unless a reproduced production defect appears.

## Remaining physical-device / external evidence

Current active-workout iPhone smoke should cover:

- Previous/Today row alignment;
- rest timer start/background/pause/adjust/skip behavior;
- warm-up Add/Skip and working-index isolation;
- set type/superset actions;
- contextual Apply/Ignore behavior;
- Smart Replace reviewed shortlist versus manual catalog;
- completed-set preservation when remaining pending sets are replaced;
- session persistence and sync sanity.

Phase 20 source/CI completion still does not prove native camera/photo behavior. Use `docs/qa/progress-photo-device-validation.md` for a dated run on the intended signed iPhone build.

Phase 14 configured-provider/native/device evidence remains independent and is not implied by Phase 18–21 or Smart Replace source work.

## Next execution order

1. Confirm the `Publish EAS Update` run for latest `[ota]` merge `872d0a677d85b0d856a9ab6df6e08d655e949739` and record update ID/group/runtime/production branch-channel evidence.
2. Run the intended real-iPhone active-workout smoke against that current OTA and record dated evidence.
3. Run Phase 20 physical-device validation on the intended signed iPhone build.
4. Continue Phase 14 provider/native/device evidence when external prerequisites are available.
5. Keep Admin production activation, P18-A through P18-H, Phase 19 reviewed scope, Phase 20 source scope, Phase 21 source scope and active-session Smart Replace source scope closed unless a reproduced defect or newly reviewed requirement appears.
6. Activate real Coach → Learn content mappings only when approved canonical `findingCode → articleId` rules exist.
7. Keep program/template Smart Replace Apply gated until stable identity and prescription-remapping rules are reviewed.

## Release boundary

Source merge, backend deployment, database migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims.
