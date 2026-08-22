# Smart Fitness Current Status

Updated: 2026-08-22

Exact source, tests, migrations, CI and Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

- Main baseline before the Phase 19 closure PR: `0cfcac732b570f58ee7860b5a317ddd4e856a147`.
- Phase 18 Knowledge & Learning is closed for P18-A through P18-H.
- #802 added cross-repository mobile/backend contract checks.
- #803 is the Phase 19 Exercise + Training Intelligence closure change.
- Phase 19 implementation head before closure documentation: `6e017b18fdeba3e1d47a2ce7191cd343743cf3f5`.
- Exact-head CI and Git merge history remain authoritative for final closure evidence.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

- Current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`.
- Phase 18 backend source remains merged through #309 for the reviewed Knowledge/Coach integration scope.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains the user-facing presentation layer over Coach rather than a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete and merged for the reviewed scope. There is no approved P18-I.
- **Phase 19 — Exercise + Training Intelligence:** implementation complete for the reviewed mobile source scope in #803.
- **Phase 20 — Progress Photos / Body Composition:** next planned product phase.

## Phase 19 delivered scope

The Phase 19 implementation provides:

- one canonical reusable local SVG anatomy system for exercise detail, thumbnails, interactive body-map filters and Progress heatmaps;
- fail-closed provider muscle mapping with stable canonical muscle IDs;
- exact muscle detail drill-downs with relevant exercises and completed user history;
- deterministic 7/30/90-day mapped muscle analytics over completed workout sessions;
- explicit PR types for load, reps, estimated 1RM and session volume;
- versioned `training-intelligence-v1` plateau/progression/regression/volume/imbalance/gap findings with exact evidence;
- Progress presentation that keeps estimates labelled, exposes unmapped/insufficient data and does not create an opaque universal score;
- read-only insight behavior: no automatic workout, program, goal, nutrition, Labs, recovery or safety mutation.

## Permanent Phase 19 rules

- completed workout/session history and reviewed exercise metadata are deterministic authority;
- unknown/ambiguous muscle mappings fail closed rather than being inferred from exercise names;
- estimated 1RM remains an estimate, not a measured max;
- findings are versioned, reproducible and bounded to explicit analysis windows;
- model/free-form prose may explain findings but is not finding authority;
- anatomy stays local, reusable, accessible and theme-compatible;
- reading an insight never silently mutates user state.

## Next execution order

1. Treat Phase 19 as implemented for the reviewed mobile source scope; use #803, exact-head CI and Git history for closure evidence.
2. Begin P20-A only with a reviewed private photo ownership/storage/deletion/export contract.
3. Add standardized front/side/back capture/import guidance and physical-device evidence before release claims.
4. Continue P20-B comparison/overlay after stable photo identity, crop and scale semantics exist.
5. Build P20-C from real stored weight/measurement/photo evidence without presenting photo-estimated body-fat percentage as exact measurement.
6. Keep P18 closed unless a reproduced defect or newly reviewed requirement appears; do not invent P18-I.
7. Continue independent Phase 14 external/provider/device evidence when prerequisites are available.

## Production / rollout boundary

Source merge, production deployment, OTA/native publication, provider activation and physical-device validation remain separate claims. Phase 19 adds no backend schema, provider activation or release authorization. Phase 20 camera/photo work will require separate private-storage and physical-device evidence before release-ready claims.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.