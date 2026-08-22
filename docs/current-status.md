# Smart Fitness Current Status

Updated: 2026-08-22

This is the short mutable cross-repository checkpoint. **Live branch/commit/PR/CI truth must be read from Git/GitHub, not copied from this file.** Exact source, tests, CI and Git history override this checkpoint if it becomes stale. Stable architecture belongs in `docs/project-context.md`; forward sequencing belongs in `docs/implementation-plan.md` and focused roadmap files.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Checkpoint verified against GitHub after the merge of documentation-only #808.

- #808 is a documentation-only post-merge checkpoint sync; it does not change reviewed runtime/product authority.
- Phase 18 Knowledge & Learning remains closed for P18-A through P18-H.
- Phase 19 Exercise + Training Intelligence base scope is merged through #803.
- The reviewed Exercise Intelligence completion is merged through #807; merge commit `371e1cdfc09aeffd93f4664cabbb4a777f19e1b0`. Final closure head `da4064e6c4e805a4395cce3fb84ce55fddc21e96` passed Mobile CI #2732 before merge.
- Phase 20 P20-A/P20-B/P20-C is merged through #804/#805/#806 and is source/CI-complete for the reviewed scope.
- There is no approved P20-D or Phase 21.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Checkpoint verified against GitHub after #330.

- Admin v5-v12 PR #305 is merged; it is no longer a pending merge gate.
- PR #330 disabled automatic Vercel Git deployments for Admin. The VPS/GitHub Actions Admin deployment path is authoritative; Vercel is retained only as temporary rollback infrastructure.
- Open backend workstreams at this checkpoint include #324 (impact-aware agent tooling) and #325 (audited Admin write-plane). Re-check their exact current state in GitHub before acting.

## Stable Exercise + Training Intelligence scope

The reviewed mobile authority now includes:

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

## Remaining physical-device evidence

Source/CI completion does not prove native camera/photo behavior. Use `docs/qa/progress-photo-device-validation.md` for a dated run on the intended signed iPhone build.

Still unproven until that run is recorded:

- P20-A permission/capture/import/persistence/delete/account-cleanup behavior;
- P20-B side-by-side/overlay rendering and visual quality.

Phase 14 configured-provider/native/device evidence remains independent and is not implied by Phase 18–20 source closure.

## Next execution order

1. Re-read exact mobile/backend GitHub state before starting work from this checkpoint.
2. Run Phase 20 physical-device validation only on the intended signed iPhone build and record dated evidence.
3. Continue Phase 14 provider/native/device evidence when external prerequisites are available.
4. Treat P18-A through P18-H, Phase 19 reviewed scope and Phase 20 source scope as closed unless a reproduced defect or newly reviewed requirement appears.
5. Activate real Coach → Learn content mappings only when approved canonical `findingCode → articleId` rules exist; runtime must remain fail closed without them.
6. Review backend #324/#325 independently against their exact current heads and deployment/migration boundaries.
7. Do not invent Phase 21 or broaden authority merely to continue development.

## Release boundary

Source merge, backend deployment, database migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims.
