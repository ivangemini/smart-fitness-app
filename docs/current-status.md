# Smart Fitness Current Status

Updated: 2026-08-22

This is the short mutable cross-repository checkpoint. **Live branch/commit/PR/CI truth must be read from Git/GitHub, not copied from this file.** Exact source, tests, CI and Git history override this checkpoint if it becomes stale. Stable architecture belongs in `docs/project-context.md`; forward sequencing belongs in `docs/implementation-plan.md` and focused roadmap files.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Phase 18 Knowledge & Learning remains closed for P18-A through P18-H.
- Phase 19 Exercise + Training Intelligence reviewed scope is merged through #803/#807.
- Phase 20 P20-A/P20-B/P20-C is merged through #804/#805/#806 and source/CI-complete for the reviewed scope.
- #811/#812 keep `Mobile CI / validate` present on PRs and validate long-lived PR merge refs against the live remote base branch.
- Phase 21 Workout Assistant P21-A through P21-E was validated on exact PR head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068`; Mobile CI #2806 completed successfully.
- Mobile PR #810 was squash-merged to `main` as `a2abde02e31b5ed1207e67835144e9359aea711e` after production backend compatibility was verified.
- Phase 21 includes Smart Previous/Today guidance, explicit-completion rest timer, deterministic warm-up proposal, typed set semantics/supersets and rare contextual Apply/Ignore adjustment.
- Warm-up rows are excluded from working-set Previous/Today indexing and from live/history Progress analytics including PR/e1RM/volume, exercise progress and weekly muscle volume.
- Workout-session sync remains v1 for legacy sessions and uses additive schema v2 only when `setType`/`supersetId` semantics are present; malformed v1/v2 envelopes fail closed.

### Backend / Admin

Repository: `ivangemini/smart-fitness-backend`.

- Admin v5-v12 #305 and backend agent-tooling #324 are merged.
- #330 disabled automatic Vercel Git deployments for Admin; the VPS/GitHub Actions Admin path remains authoritative for Admin deployment.
- Admin write-plane #325 is merged as `a3f260aca1089548202eeeee8b96624e931b7efc`; exact PR head `621efecbe5a62a3a8873e005ead65ffd49f5641c` passed Backend CI #2422, Backend PostgreSQL CI #791 and Account Deletion Receipt CI #699.
- Follow-up Admin hardening #335/#336/#337 is merged, including RBAC search/mutation guardrails, high-impact confirmations and filtered/paginated audit viewer.
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

## Phase 21 release boundary

Phase 21 source, backend compatibility and mobile merge gates are closed.

Verified sequence:

1. backend #332 merged and passed Backend CI/PostgreSQL CI;
2. production backend compatibility passed for workout-session sync v1/v2 semantics;
3. exact mobile #810 head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068` passed Mobile CI #2806;
4. #810 merged to `main` as `a2abde02e31b5ed1207e67835144e9359aea711e`.

The remaining Phase 21 release evidence is OTA publication confirmation plus real-device active-workout smoke. The repository `Publish EAS Update` workflow is configured to publish iOS to production on `main` pushes whose commit message contains `[ota]`; the Phase 21 merge commit contains that marker. Treat actual workflow success/publication metadata as separate evidence until observed.

## Admin release boundary

**Closed.** Admin source, migration, backend deployment, Admin-console deployment and authorized production browser smoke are complete for the reviewed activation scope.

Current production evidence:

- backend exact SHA `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c`;
- Admin-console exact SHA `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50`;
- migration `0056_admin_control_plane.sql` applied;
- expected Admin schema/constraints present;
- schema-v2 Admin session resolves `owner / bootstrap` with permissions;
- global Administration navigation visible;
- `/administration` and `/administration/audit` work under authorized browser access;
- refresh/direct-navigation preserve the session;
- browser JS exceptions: 0.

Do not reopen Admin activation unless a reproduced production defect appears.

## Remaining physical-device evidence

Phase 21 still needs real-device smoke after the corresponding OTA/native output is available:

- Previous/Today row alignment;
- rest timer start/background/pause/adjust/skip behavior;
- warm-up Add/Skip and working-index isolation;
- set type/superset actions;
- contextual Apply/Ignore behavior;
- session persistence and sync sanity.

Phase 20 source/CI completion still does not prove native camera/photo behavior. Use `docs/qa/progress-photo-device-validation.md` for a dated run on the intended signed iPhone build.

Still unproven until that run is recorded:

- P20-A permission/capture/import/persistence/delete/account-cleanup behavior;
- P20-B side-by-side/overlay rendering and visual quality.

Phase 14 configured-provider/native/device evidence remains independent and is not implied by Phase 18–21 source work.

## Next execution order

1. Confirm the `Publish EAS Update` run for merge commit `a2abde02e31b5ed1207e67835144e9359aea711e` succeeded and record its EAS update ID/group/runtime metadata.
2. Run the intended real-iPhone Phase 21 active-workout smoke and record dated evidence.
3. Run Phase 20 physical-device validation on the intended signed iPhone build and record dated evidence.
4. Continue Phase 14 provider/native/device evidence when external prerequisites are available.
5. Keep Admin production activation, P18-A through P18-H, Phase 19 reviewed scope, Phase 20 source scope and Phase 21 source scope closed unless a reproduced defect or newly reviewed requirement appears.
6. Activate real Coach → Learn content mappings only when approved canonical `findingCode → articleId` rules exist.

## Release boundary

Source merge, backend deployment, database migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims.
