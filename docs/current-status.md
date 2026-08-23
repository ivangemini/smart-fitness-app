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
- Adaptive package closure docs #833;
- **Custom-template Smart Replace T1–T4 #835**.

Latest Smart Replace delivery:

- #835 exact validated head `d915ed60cad9e59fe3966e34fab16d80c9c1f430`;
- Mobile CI #2882 fully green;
- merged squash `1a9c1ca7d9300cbf25c526b69c653a5f82e30d40`;
- saved custom templates expose deterministic reviewed/manual exact-ID replacement selection;
- selection is read-only until explicit before/after preview and Apply;
- Apply rechecks a conservative current-template fingerprint and returns `applied | stale | blocked`;
- matching prescription exercise identity remaps while targets/unrelated fields remain unchanged;
- completed `WorkoutSession` history and program→template references remain unchanged;
- existing AppState persistence/sync mutation authority remains the only write path.

### Backend / Admin

Repository: `ivangemini/smart-fitness-backend`.

- Phase 21 sync dependency #332 is merged.
- Admin write-plane/hardening/navigation/session-v2 repairs through #325/#335/#336/#337/#340/#342/#343 are merged.
- production backend and Admin-console deployment plus authorized browser smoke were verified for the reviewed activation scope.
- **Admin production activation is closed** unless a reproduced production defect appears.

## Smart Replace current boundary

Delivered end-to-end reviewed source scope:

- device-local `avoid` + note preference separate from favorites;
- reviewed exact-ID candidate ranking with `avoid` filtering;
- read-only detail candidates;
- explicit active-session replacement that changes only `completed === false` sets;
- completed/legacy evidence preservation;
- #824 exact-ID custom-template replacement primitive with deterministic `Workout.prescription` identity remapping;
- #835 saved-custom-template preview/Apply UI with exact identity, collision protection and stale fingerprint validation.

The old blocker saying template editing lacks stable identity/prescription remapping is obsolete. The user-facing custom-template Smart Replace package is now also source/CI-complete.

## Exercise & Training Intelligence / Adaptive packages

The reviewed Exercise & Training Intelligence package is source/CI-complete through #825/#826/#828.

The Adaptive Program + Recovery package is source/CI-complete through #829–#832 and closed by #833. Do not silently extend A1–A4; new work is a separate unnumbered package.

## Next autonomous source queue

1. **Weekly Training Review** — current active package; compose existing deterministic planned/completed, findings, Coverage, Adaptive and recovery evidence into one 7-day read-only review.
2. **Progress Stories / Share Cards** — explicit privacy-aware share/export over existing progress evidence.
3. **Trainer / Coach collaboration** — first define cross-account authority/privacy contract, then backend/mobile implementation with owner confirmation before mutation.
4. **Apple Health / Apple Watch expansion** — source-side adapters/architecture where possible; device/runtime claims remain evidence-gated.

Canonical package detail: `docs/roadmap/next-product-expansions.md`.

## Independent release / external evidence

These remain separate from source completion:

- relevant production EAS OTA metadata and real-iPhone Phase 21/Smart Replace active-workout smoke;
- optional real-device custom-template Smart Replace modal/search comprehension check;
- Phase 20 physical-device progress-photo validation via `docs/qa/progress-photo-device-validation.md`;
- Phase 14 configured APNs/FCM, Labs storage/model and native Health evidence;
- Coach → Learn production mapping activation from approved canonical content only;
- any native build/install, provider activation, production rollout or store submission.

## Release boundary

Source merge, backend deployment, migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims.
