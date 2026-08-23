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
- Custom-template Smart Replace T1–T4 #835, closure #836;
- **Weekly Training Review W1–W3 #837/#838; W4 documentation/evidence closure follows those validated source merges.**

Latest Weekly Training Review delivery:

- #837 exact validated head `39a133550607de1f79aa005f693dc9f201f5e9ff`;
- Mobile CI #2885 / run `32648145266` / job `97215495481` fully green;
- #837 merged squash `447236cecacc17b26d1bf88774e7785ac2121dfe`;
- #838 exact validated head `eb034c796adfdb9b5aba6d96462700201709d5af`;
- Mobile CI #2887 / run `32648944883` / job `97217437867` fully green;
- #838 merged squash `7a9fd9b8c734a6b2cd9354d12432a2d99715d43e`;
- Progress now exposes an explicit deterministic 7-day review with planned/completed comparison, Training Coverage, recovery context, adaptive action counts and bounded key findings;
- detail navigation reuses existing Training Progress with an explicit 7-day period;
- optional Coach explanation is explicit, bounded and read-only; it cannot calculate or mutate the canonical review;
- no new analytics persistence layer, universal score, hidden program mutation or completed-history rewrite was added.

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

The old blocker saying template editing lacks stable identity/prescription remapping is obsolete. The user-facing custom-template Smart Replace package is source/CI-complete.

## Training Intelligence / Adaptive / Weekly authority

The reviewed Exercise & Training Intelligence package is source/CI-complete through #825/#826/#828.

The Adaptive Program + Recovery package is source/CI-complete through #829–#832 and closed by #833. Do not silently extend A1–A4; new work is a separate unnumbered package.

Weekly Training Review is a read-only composition layer over those existing authorities:

- explicit 7-day window;
- exact planned-versus-completed identity;
- deterministic findings and Training Coverage;
- stored recovery modifier evidence and existing Adaptive Program proposals;
- source/evidence mismatch fails closed;
- missing evidence remains unknown/unavailable;
- Coach explanation is optional and read-only;
- no second analytics truth or mutation authority.

## Next autonomous source queue

1. **Progress Stories / Share Cards** — current active package. Start with S1 deterministic share-card view models over existing exact Progress evidence; do not add renderer/native share dependencies or publication side effects in S1.
2. **Trainer / Coach collaboration** — first define cross-account authority/privacy contract, then backend/mobile implementation with owner confirmation before mutation.
3. **Apple Health / Apple Watch expansion** — source-side adapters/architecture where possible; device/runtime claims remain evidence-gated.

Canonical package detail: `docs/roadmap/next-product-expansions.md`.

## Independent release / external evidence

These remain separate from source completion:

- relevant production EAS OTA metadata and real-iPhone Phase 21/Smart Replace active-workout smoke;
- optional real-device custom-template Smart Replace modal/search comprehension check;
- optional real-device Weekly Review UX observation;
- Phase 20 physical-device progress-photo validation via `docs/qa/progress-photo-device-validation.md`;
- Phase 14 configured APNs/FCM, Labs storage/model and native Health evidence;
- Coach → Learn production mapping activation from approved canonical content only;
- any native build/install, provider activation, production rollout or store submission.

## Release boundary

Source merge, backend deployment, migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims.
