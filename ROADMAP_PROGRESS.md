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
- **Phase 19 — Exercise + Training Intelligence:** merged through PR #803 for the reviewed mobile source scope.
- **Phase 20 — Progress Photos / Body Composition:** P20-A implementation complete in PR #804 for reviewed source/CI scope; P20-B is next.

There is no approved P18-I.

## Current verified checkpoint

### Mobile

Phase 19 is merged on `main` through PR #803.

P20-A implementation lives in PR #804. Code head before closure documentation: `8d20cb49d227f85c24fe37109b15c021997100d4`. Mobile CI #2716 passed repository file line audit, changed file line limit, agent navigation integrity, TypeScript, full regression suite, expanded-model smoke, Expo export and Expo Doctor on that head. Exact final documentation head and merge history remain authoritative.

### Backend

Current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`.

Recent Phase 18 closure path remains:

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

P19-A through P19-D are implemented and merged in #803. Stable Phase 19 authority remains:

- one canonical muscle taxonomy and reusable local SVG anatomy authority;
- exact/fail-closed muscle mapping;
- deterministic completed-session analytics with explicit 7/30/90 windows;
- explicit load/reps/e1RM/session-volume PR types;
- `training-intelligence-v1` deterministic findings with exact evidence;
- no universal readiness score or hidden state mutation;
- model prose is never finding authority.

## Phase 20 — Progress Photos / Body Composition

Focused roadmap: `docs/roadmap/training-intelligence.md`.

### P20-A — Private standardized progress photos

Implemented reviewed source/CI scope in #804:

- private account-owned front/side/back slots;
- camera capture and photo-library import;
- repeatable pose/framing/lighting guidance;
- explicit added-at date/time identity;
- image re-encoding before persistence so embedded EXIF/location metadata is not copied to the app-owned photo;
- deterministic app-owned local document storage keyed by account;
- account-scoped metadata and durable per-photo deletion recovery;
- account-deletion/resume cleanup covers both metadata and photo directory;
- Progress entry point plus virtualized history;
- privacy inventory/export-contract coverage;
- no cloud/provider/social upload;
- no photo-derived body-fat estimate.

**Status:** implementation complete for reviewed source/CI scope in #804. Physical-device/native runtime evidence remains a separate release gate.

### P20-B — Visual comparison

Next implementation scope:

- deterministic before/after selection from the private photo timeline;
- same-pose side-by-side comparison;
- overlay/ghost comparison only when crop/scale semantics are stable;
- explicit dates/source identity;
- nearby real weight/body measurements shown as separate evidence;
- no AI vision/body-fat inference;
- fail closed when images are not meaningfully comparable.

**Status:** next normal source implementation step after #804 merge.

### P20-C — Body-composition progress

After stable P20-B comparison semantics, combine real stored weight/measurements/photo history without fabricating body-fat precision. Any future vision/model estimate requires separate privacy and uncertainty review.

## Remaining Phase 14 gates

- **Push:** configured APNs/FCM provider plus signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** configured private storage/model provider plus bounded lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Merge P20-A only after final exact-head CI confirms the closure documentation head.
2. Start P20-B comparison/overlay from the merged P20-A baseline.
3. Keep comparison deterministic and private; do not add vision/body-fat inference.
4. Build P20-C only from real stored measurements/photos and reproducible derived trends.
5. Keep P18 closed unless a reproduced defect or newly reviewed requirement appears; do not invent P18-I.
6. Keep P17-E inactive without a richer-goal requirement.
7. Continue Phase 14 provider/native/device evidence independently when prerequisites are available.
8. Keep source/CI, deployment, provider activation, OTA/native publication and physical-device evidence as separate claims.

## Authorization / release boundary

Source/CI progress does not relax provider, native/device, production, editorial-publication or medical-safety controls. P20-A source/CI completion does not imply native/OTA publication or physical-device validation.