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
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains presentation over Coach, not a second assistant authority.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete and merged. There is no approved P18-I.
- **Phase 19 — Exercise + Training Intelligence:** P19-A through P19-D merged through #803; deferred reviewed Exercise Intelligence metadata is being completed in #807 without a new phase.
- **Phase 20 — Progress Photos / Body Composition:** P20-A through P20-C merged through #804/#805/#806 and source/CI-complete for reviewed scope.

## Current verified checkpoint

### Mobile

`main` includes Phase 20 through PR #806, merge commit `6e287c64d4fcdcd604e78de6ae911510ddf604bb`.

The remaining reviewed Exercise Intelligence layer is implemented in #807 at code head `32221db92dcaae78bb38b96ad1ff358cea0877d5`. Mobile CI #2731 is the code-head validation authority; final closure-documentation head and #807 merge history remain final authority.

### Backend

Current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`.

The Exercise Intelligence completion and Phase 20 add no backend persistence/schema/provider-upload authority.

## Exercise + Personal Training Intelligence

Stable reviewed scope now includes:

- canonical reusable SVG muscle anatomy, body thumbnails, filtering and muscle drill-downs;
- deterministic completed-session analytics with explicit 7/30/90-day windows;
- load/reps/e1RM/session-volume PRs and `training-intelligence-v1` evidence findings;
- reviewed `exercise-intelligence-v1` metadata for all 15 canonical local exercises;
- movement pattern, technique cues, common errors and controlled ROM guidance;
- qualitative low/moderate/high fatigue cost with explicit non-measurement disclaimer;
- reviewed substitution links/rationales with no automatic workout mutation;
- EN/RU presentation;
- unknown/remote-only records fail closed instead of receiving guessed intelligence.

An OSS exercise only receives reviewed intelligence when existing normalization reuses a reviewed canonical local identity. Do not infer this metadata from runtime names, body-part labels or muscles.

## Phase 20 — Progress Photos / Body Composition

### P20-A

Merged through #804: private account-owned front/side/back photos, camera/library input, re-encoding before persistence, deterministic local app-owned storage, durable deletion/account cleanup, privacy inventory and no photo-derived body-fat estimate.

### P20-B

Merged through #805: deterministic same-pose comparison, strict chronology, `contain` rendering, fail-closed 3:4 overlay, visible date/source identity, nearby stored weight/waist as separate evidence, no AI vision or comparison persistence.

### P20-C

Merged through #806: read-only 30/90-day body-composition view reusing existing weight/measurement authorities plus private period-bounded photo timeline. Stored body-fat remains user-entered measurement evidence and is never image inference.

**Status:** Phase 20 source/CI-complete through #806.

## Remaining independent evidence

Phase 14 configured-provider/native/device evidence remains separate.

Phase 20 release evidence remains separate:

- P20-A real-device camera permission/capture/import/persistence/delete/account-cleanup behavior;
- P20-B real-device side-by-side/overlay rendering and visual-quality evidence.

Use `docs/qa/progress-photo-device-validation.md` for the exact device run. The checklist itself is preparation, not proof that the run occurred.

## Next execution order

1. Complete #807 exact-head CI, closure docs and merge.
2. After #807 merge, treat requested source/CI scope for Personal Training Intelligence and Exercise Intelligence as complete.
3. Run Phase 20 physical-device validation only on an actual intended signed iPhone build; record evidence without conflating it with source/CI.
4. Do not create P20-D or Phase 21 without a reviewed requirement or reproduced defect.
5. Keep source/CI, deployment, provider activation, OTA/native publication and physical-device evidence as separate claims.

## Authorization / release boundary

Source/CI completion does not imply deployment, OTA/native publication, provider activation or physical-device validation. Progress photos remain private by default and no image-derived body-fat inference is authorized.
