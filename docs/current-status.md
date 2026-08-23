# Smart Fitness Current Status

Updated: 2026-08-23

This is the short mutable cross-repository checkpoint. **Live branch/commit/PR/CI truth must be read from Git/GitHub.** Exact source, tests, CI, deployments and Git history override this file if it becomes stale. Stable architecture belongs in `docs/project-context.md`; forward sequencing belongs in `ROADMAP_PROGRESS.md` and `docs/implementation-plan.md`.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Closed reviewed source packages:

- Phase 18 Knowledge & Learning P18-A through P18-H;
- Phase 19 Exercise + Training Intelligence reviewed scope;
- Phase 20 Progress Photos / Body Composition P20-A through P20-C;
- Phase 21 Workout Assistant P21-A through P21-E;
- Exercise Preferences + Smart Replace active-session scope through #816/#818/#819/#820;
- exact custom-template replacement identity/prescription remapping primitive #824;
- Exercise Intelligence 2.0 #825;
- Training Coverage #826;
- Training Intelligence Loop #828;
- Adaptive Program + Recovery A1–A4 #829/#830/#831/#832;
- Adaptive package closure docs #833.

Latest completed Adaptive Program authority:

- exact `TrainingProgramDay.workoutTemplateId` / `Workout.id` / exercise ID joins;
- deterministic `progress | maintain | review` proposal actions;
- fresh stored recovery evidence may conservatively downgrade an action without producing a universal readiness score;
- A3 preview/Apply mutates only eligible future custom-template prescription targets under exact identity, stale fingerprint and bounded change rules;
- completed `WorkoutSession` history remains immutable;
- A4 Coach explanation is optional/read-only and cannot recalculate or apply the proposal.

### Backend / Admin

Repository: `ivangemini/smart-fitness-backend`.

- Phase 21 sync dependency #332 is merged.
- Admin write-plane/hardening/navigation/session-v2 repairs through #325/#335/#336/#337/#340/#342/#343 are merged.
- production backend and Admin-console deployment plus authorized browser smoke were verified for the reviewed activation scope.
- **Admin production activation is closed** unless a reproduced production defect appears.

## Smart Replace current boundary

Delivered:

- device-local `avoid` + note preference separate from favorites;
- reviewed exact-ID candidate ranking with `avoid` filtering;
- read-only detail candidates;
- explicit active-session replacement that changes only `completed === false` sets;
- completed/legacy evidence preservation;
- #824 exact-ID custom-template replacement primitive with deterministic `Workout.prescription` identity remapping and preservation of unrelated fields.

The old blocker saying template editing lacks stable identity/prescription remapping is obsolete after #824.

**Next active source package:** user-facing custom-template Smart Replace preview/confirm/apply over #824. It must remain explicit, fail closed on stale/unresolved/collision cases, preserve unrelated workout data, reuse existing persistence/sync authority and never rewrite completed session history.

## Exercise & Training Intelligence / Adaptive packages

The reviewed Exercise & Training Intelligence package is source/CI-complete through #825/#826/#828.

The Adaptive Program + Recovery package is source/CI-complete through #829–#832 and closed by #833. Do not silently extend A1–A4; new work is a separate unnumbered package.

## Next autonomous source queue

1. **Custom-template Smart Replace UI** — immediate.
2. **Weekly Training Review** — compose existing deterministic planned/completed, findings, Coverage, Adaptive and recovery evidence into one weekly review.
3. **Progress Stories / Share Cards** — explicit privacy-aware share/export over existing progress evidence.
4. **Trainer / Coach collaboration** — first define cross-account authority/privacy contract, then backend/mobile implementation with owner confirmation before mutation.
5. **Apple Health / Apple Watch expansion** — source-side adapters/architecture where possible; device/runtime claims remain evidence-gated.

Canonical package detail: `docs/roadmap/next-product-expansions.md`.

## Independent release / external evidence

These remain separate from source completion:

- relevant production EAS OTA metadata and real-iPhone Phase 21/Smart Replace active-workout smoke;
- Phase 20 physical-device progress-photo validation via `docs/qa/progress-photo-device-validation.md`;
- Phase 14 configured APNs/FCM, Labs storage/model and native Health evidence;
- Coach → Learn production mapping activation from approved canonical content only;
- any native build/install, provider activation, production rollout or store submission.

## Release boundary

Source merge, backend deployment, migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims.
