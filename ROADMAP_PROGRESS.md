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
- **Phase 13 — Companion v1:** retained. Companion is the user-facing presentation layer of Coach, not a second assistant authority.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete and merged for the reviewed scope.
- **Phase 19 — Exercise + Training Intelligence:** implementation complete for the reviewed mobile source scope; PR #803 is the closure vehicle.
- **Phase 20 — Progress Photos / Body Composition:** approved next product phase after Phase 19 closure.

There is no approved P18-I.

## Current verified checkpoint

### Mobile

Main baseline before the Phase 19 closure PR: `0cfcac732b570f58ee7860b5a317ddd4e856a147`.

Recent closure path:

- #793 — Knowledge Library and immutable Reader;
- #794 — account-scoped exact-version learning state;
- #795 — reviewed learning paths;
- #797 — optional Coach → Learn mobile consumer;
- #802 — cross-repository mobile/backend contract checks;
- #803 — Phase 19 Exercise + Training Intelligence closure change.

Phase 19 implementation head before closure documentation: `6e017b18fdeba3e1d47a2ce7191cd343743cf3f5`. Exact-head CI and merge history are authoritative for the final closure result.

### Backend

Current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`.

Recent Phase 18 closure path:

- #285 — canonical Knowledge persistence/published reader;
- #290 — provider-neutral editorial orchestration;
- #294 — exact-version quiz authority;
- #296 — account-scoped learning state;
- #306 — deterministic Coach → Learn selector;
- #307 — reviewed learning paths;
- #308 — deterministic trusted Coach finding authority;
- #309 — optional Coach run-detail Learn projection host.

## Phase 18 — Knowledge & Learning

Focused roadmap: `docs/roadmap/knowledge-learning.md`.

P18-A through P18-H remain closed for the reviewed source/CI scope. The production recommendation-rule registry may remain intentionally empty until reviewed canonical `findingCode → articleId` mappings exist; that content-activation boundary does not reopen Phase 18 runtime work.

Do not invent P18-I merely to continue development.

## Phase 19 — Exercise + Training Intelligence

Focused roadmap: `docs/roadmap/training-intelligence.md`.

Product objective: make exercise anatomy and training history understandable through reusable visual anatomy, deterministic analytics and evidence-backed training findings.

### P19-A — Exercise Intelligence foundation

Implemented reviewed scope:

- one canonical muscle taxonomy and stable muscle IDs;
- one reusable local SVG geometry/rendering authority for thumbnails, full-size anatomy, exercise detail, interactive filtering and heatmaps;
- front/back tappable body-map filtering wired to the existing exercise-library muscle filter;
- text/accessibility retained as primary meaning alongside SVG;
- canonical muscle detail with exactly mapped exercises and completed user history;
- unknown provider names fail closed instead of being guessed.

**Status:** implementation complete in #803.

### P19-B — Training analytics foundation

Implemented reviewed scope:

- completed session history remains authority;
- conservative comparable e1RM/exercise trends;
- explicit load/reps/estimated-e1RM/session-volume PR types;
- mapped muscle primary sets/volume, secondary exposure, frequency and last exposure;
- deterministic equal-window 7/30/90-day comparisons with explicit `endAt`;
- visible insufficient/unmapped states.

No universal fitness/readiness score is introduced and estimates are not represented as measured maxes.

**Status:** implementation complete in #803.

### P19-C — Plateau / PR / progression findings

`training-intelligence-v1` provides deterministic, evidence-backed findings for PRs, plateaus, stable-load rep progression, bounded regression, volume spikes, exposure concentration and long exercise/muscle gaps. Findings are bounded to the selected period and model prose is not finding authority.

**Status:** implementation complete in #803.

### P19-D — Training Intelligence UX

Training Progress now carries the reviewed 7/30/90 period model, shared SVG muscle heatmaps, mapped muscle facts and exact finding evidence. Tapping mapped muscle regions opens the canonical muscle detail surface. Existing exercise progress/raw-history paths remain available and no insight mutates workouts/programs/goals automatically.

**Status:** implementation complete in #803.

## Phase 20 — Progress Photos / Body Composition

Focused roadmap: `docs/roadmap/training-intelligence.md`.

Approved scope includes private account-owned standardized front/side/back progress photos, repeatable capture guidance, comparison/overlay tooling, timeline selection and pairing with real stored measurements such as weight and waist.

The product must not present photo-estimated body-fat percentage as exact measurement-grade truth. Any future model/vision estimation requires a separate uncertainty/privacy contract.

**Status:** next planned implementation phase. P20-A private standardized progress photos is first.

## Remaining Phase 14 gates

- **Push:** configured APNs/FCM provider plus signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** configured private storage/model provider plus bounded lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Treat P19-A through P19-D as implemented for the reviewed source scope; use PR/CI/Git history as closure authority.
2. Start P20-A with a reviewed private progress-photo storage/ownership contract before camera/import UI claims.
3. Continue P20-B comparison/overlay only after stable photo identity/crop semantics exist.
4. Build P20-C body-composition progress from stored measurements/photos without fabricating body-fat precision.
5. Keep P18-A through P18-H closed unless a reproduced defect or newly reviewed requirement appears; do not invent P18-I.
6. Keep P17-E inactive without a richer-goal requirement.
7. Execute remaining Phase 14 provider/native/device evidence independently when external prerequisites are available.
8. Repair reproduced defects and keep source/CI, deployment, provider activation, OTA/native release and physical-device evidence as separate claims.

## Authorization / release boundary

Source/CI progress does not relax provider, native/device, production, editorial-publication or medical-safety controls. Production deployment, production migrations, OTA/native publication, provider activation, canonical content publication and physical-device validation remain separately authorized/evidenced claims.