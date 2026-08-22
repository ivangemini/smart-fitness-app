# Smart Fitness Current Status

Updated: 2026-08-22

This is the short mutable cross-repository checkpoint. **Live branch/commit/PR/CI truth must be read from Git/GitHub, not copied from this file.** Exact source, tests, CI and Git history override this checkpoint if it becomes stale. Stable architecture belongs in `docs/project-context.md`; forward sequencing belongs in `docs/implementation-plan.md` and focused roadmap files.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Checkpoint verified during Phase 21 closure work after CI guard PR #812.

- Phase 18 Knowledge & Learning remains closed for P18-A through P18-H.
- Phase 19 Exercise + Training Intelligence reviewed scope is merged through #803/#807.
- Phase 20 P20-A/P20-B/P20-C is merged through #804/#805/#806 and source/CI-complete for the reviewed scope.
- #811/#812 keep `Mobile CI / validate` present on PRs and validate long-lived PR merge refs against the live remote base branch.
- Phase 21 Workout Assistant P21-A through P21-E is implemented on mobile PR #810.
- Phase 21 code includes Smart Previous/Today guidance, explicit-completion rest timer, deterministic warm-up proposal, typed set semantics/supersets and rare contextual Apply/Ignore adjustment.
- Warm-up rows are excluded from working-set Previous/Today indexing and from live/history Progress analytics including PR/e1RM/volume, exercise progress and weekly muscle volume.
- Workout-session sync remains v1 for legacy sessions and uses additive schema v2 only when `setType`/`supersetId` semantics are present; malformed v1/v2 envelopes fail closed.
- Pre-documentation Phase 21 code head at this checkpoint is `2b4afbab5c071fa7d692b11c59fc651860bd3565`; re-check the exact final PR head and Mobile CI before merge.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- Admin v5-v12 #305 and backend agent-tooling #324 are merged.
- #330 disabled automatic Vercel Git deployments for Admin; the VPS/GitHub Actions Admin path remains authoritative for Admin deployment.
- Phase 21 sync dependency #332 is merged to backend `main` as `b5a054e49e795a75f19c16ba85f507396e4598b6`.
- #332 exact PR head `1a0bf3319db094aed14b7e397242250f30dc087d` passed Backend CI #2435 and Backend PostgreSQL CI #798 before merge.
- #332 requires no database migration.
- **Backend source merge is not production API deployment evidence.** The automatic `Admin Production Deploy` workflow only deploys `admin-console/`/compose changes; it does not prove that the Fastify API containing #332 was rebuilt on the production VPS.
- #325 remains an independent Admin write-plane workstream; re-check its exact GitHub state before acting.

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

Phase 21 source work is coordinated across mobile #810 and merged backend #332. The remaining boundary is operational, not a reason to duplicate implementation.

Required before mobile schema-v2 behavior is released:

1. deliberately deploy backend `main` containing `b5a054e49e795a75f19c16ba85f507396e4598b6` to the production VPS;
2. verify `api.peptonio.com` health and bounded authenticated workout-session sync v1/v2 compatibility;
3. re-check exact mobile #810 head and exact-head Mobile CI;
4. merge mobile #810;
5. treat OTA/native publication as a separate explicit action;
6. run a real-device active-workout smoke before calling the user-facing release verified.

Do not duplicate or fork Phase 21 into another branch without first checking #810 and the merged backend contract.

## Remaining physical-device evidence

Source/CI completion does not prove native camera/photo behavior. Use `docs/qa/progress-photo-device-validation.md` for a dated run on the intended signed iPhone build.

Still unproven until that run is recorded:

- P20-A permission/capture/import/persistence/delete/account-cleanup behavior;
- P20-B side-by-side/overlay rendering and visual quality.

Phase 14 configured-provider/native/device evidence remains independent and is not implied by Phase 18–21 source work.

## Next execution order

1. Deploy backend `main` containing merged #332 to the production VPS through the normal backend production path.
2. Verify production health and workout-session sync v1/v2 compatibility without weakening fail-closed behavior.
3. Re-check exact mobile #810 head/CI; merge only after backend deployment evidence exists.
4. Publish OTA/native output only as an explicit separate action, then run the intended real-device Phase 21 smoke.
5. Run Phase 20 physical-device validation on the intended signed iPhone build and record dated evidence.
6. Continue Phase 14 provider/native/device evidence when external prerequisites are available.
7. Keep P18-A through P18-H, Phase 19 reviewed scope and Phase 20 source scope closed unless a reproduced defect or newly reviewed requirement appears.
8. Activate real Coach → Learn content mappings only when approved canonical `findingCode → articleId` rules exist.
9. Review backend #325 independently against its exact current head and deployment/migration boundaries.

## Release boundary

Source merge, backend deployment, database migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims.
