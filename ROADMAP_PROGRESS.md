# Smart Fitness Roadmap Progress

Updated: 2026-08-22

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI and Git history override stale prose.

Focused roadmap references:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/knowledge-learning.md`;
- `docs/roadmap/training-intelligence.md`.

## Verified phase baseline

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains presentation over Coach, not a second assistant authority.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete and merged. There is no approved P18-I.
- **Phase 19 — Exercise + Training Intelligence:** P19-A through P19-D merged through PR #803.
- **Phase 20 — Progress Photos / Body Composition:** P20-A merged through #804, P20-B merged through #805, P20-C source implementation complete in #806 pending final closure-head CI/merge.

## Current verified checkpoint

### Mobile

Phase 19 is merged on `main` through #803. Phase 20 P20-A is merged through #804 and P20-B is merged through #805 (`c5074f006fd67cdaf5a485a8c4b8a4b78b1340a7`).

P20-C implementation head is `54cf667c5280e089ca81bb1c8c4335fbda43e8ec`. Mobile CI #2726 passed repository file line audit, changed-file line limit, agent navigation integrity, TypeScript, full regression suite, expanded-model smoke, Expo export and Expo Doctor on that code head. Final closure-documentation head and #806 merge history remain authoritative for final source/CI closure.

### Backend

Current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`.

Phase 20 adds no backend persistence/schema/provider upload authority.

## Phase 18 — Knowledge & Learning

Focused roadmap: `docs/roadmap/knowledge-learning.md`.

P18-A through P18-H remain closed for the reviewed source/CI scope. Do not invent P18-I merely to continue development.

## Phase 19 — Exercise + Training Intelligence

Focused roadmap: `docs/roadmap/training-intelligence.md`.

P19-A through P19-D are implemented and merged through #803. Stable authority remains canonical SVG anatomy/muscle taxonomy, deterministic completed-session analytics, explicit PR types, `training-intelligence-v1` findings and exact evidence. No universal readiness score or hidden mutation exists.

## Phase 20 — Progress Photos / Body Composition

Focused roadmap: `docs/roadmap/training-intelligence.md`.

### P20-A — Private standardized progress photos

Merged through #804:

- private account-owned front/side/back photo records;
- camera/library input with repeatability guidance;
- re-encoding before persistence so imported EXIF/location metadata is not copied;
- deterministic app-owned local storage and account-scoped metadata;
- durable deletion recovery and account-cleanup coverage;
- privacy inventory/export-contract coverage;
- no cloud/provider/social upload or photo-derived body-fat estimate.

### P20-B — Visual comparison

Merged through #805:

- deterministic same-pose Before/After selection;
- non-cropping side-by-side rendering;
- fail-closed 3:4 ghost overlay explicitly labeled as a visual aid, not registration/measurement;
- date/source identity;
- nearby stored weight (±7 days) and canonical waist length (±14 days) as separate evidence;
- no comparison persistence, AI vision or image-derived body-fat estimate.

### P20-C — Body-composition progress

Implemented reviewed source scope in #806:

- read-only 30/90-day composition surface with explicit period/end boundary;
- existing `getWeightAnalytics` and `getWeightTrendEntries` remain weight authorities;
- existing canonical measurement-series analytics remain measurement authority;
- waist and other user-entered measurements stay distinct from visual evidence;
- user-entered body-fat remains a stored measurement, never a photo estimate;
- private ready-photo timeline is period-bounded and carries pose/date/source identity;
- read-only links reuse existing P20-A/P20-B and measurement drill-downs;
- no new persistence, sync, provider upload, AI vision, or photo-derived body-fat estimate.

**Status:** code head `54cf667c5280e089ca81bb1c8c4335fbda43e8ec` passed Mobile CI #2726. Final documentation-head CI and #806 merge history are closure authority.

## Remaining independent evidence

Phase 14 configured-provider/native/device evidence remains separate:

- Labs configured provider + physical device;
- Push configured APNs/FCM provider + physical device;
- Steps signed native/physical device;
- Stories remaining mobile/physical-device evidence.

Phase 20 release evidence remains separate from source/CI closure:

- P20-A real-device camera permission/capture/import/persistence/delete/account-cleanup behavior;
- P20-B real-device side-by-side/overlay rendering and visual-quality evidence.

## Next execution order

1. Finalize #806 closure documentation and exact-head CI, then merge P20-C.
2. After #806 merge, Phase 20 is source/CI-complete for the reviewed roadmap scope.
3. Do not invent Phase 21 or P20-D merely to continue development; require a reviewed new requirement or reproduced defect.
4. Continue independent Phase 14 and Phase 20 native/physical-device evidence when prerequisites are available.
5. Keep source/CI, deployment, provider activation, OTA/native publication and physical-device evidence as separate claims.

## Authorization / release boundary

Source/CI completion does not imply deployment, OTA/native publication, provider activation, or physical-device validation. Progress photos remain private by default, and no image-derived body-fat inference is authorized.