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
- **Phase 20 — Progress Photos / Body Composition:** P20-A merged through #804; P20-B source implementation is complete in #805 and P20-C is next.

There is no approved P18-I.

## Current verified checkpoint

### Mobile

Phase 19 is merged on `main` through PR #803. P20-A is merged on `main` through PR #804.

P20-B code head `44231980f4bbfd6a40e9e89510c42ab411b83db4` passed Mobile CI #2724 across repository file line audit, changed file line limit, agent navigation integrity, TypeScript, full regression suite, expanded-model smoke, Expo export and Expo Doctor. Exact final documentation head and PR #805 merge history remain authoritative for closure.

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

Implemented and merged through #804 for the reviewed source/CI scope:

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

**Status:** source/CI implementation merged in #804. Physical-device/native runtime evidence remains a separate release gate.

### P20-B — Visual comparison

Implemented reviewed source/CI scope in #805:

- deterministic Before/After selection from private ready photos;
- same-pose requirement and strict chronological validation;
- non-cropping side-by-side comparison;
- fail-closed 3:4 ghost overlay with explicit non-measurement disclosure;
- before/after date and camera/library source identity;
- nearest stored weight within ±7 days and canonical waist measurement within ±14 days as separate evidence;
- malformed/non-length waist records rejected rather than coerced;
- no new persistence or derived comparison state;
- no AI vision/body-fat inference or hidden mutation.

**Status:** code head `44231980f4bbfd6a40e9e89510c42ab411b83db4` passed Mobile CI #2724. Final closure-doc head and #805 merge history are source/CI authority. Physical-device visual evidence remains separate.

### P20-C — Body-composition progress

Next source scope combines real stored evidence without fabricating body-fat precision:

- period-bounded existing weight analytics;
- canonical waist and other stored measurement series;
- private ready photo timeline;
- explicit distinction between user-entered measurements and visual evidence;
- reproducible summaries under one explicit `endAt` boundary;
- read-only links to existing measurement/photo comparison drill-downs.

Any future vision/model body-fat estimate requires separate privacy and uncertainty review.

## Remaining Phase 14 gates

- **Push:** configured APNs/FCM provider plus signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** configured private storage/model provider plus bounded lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Finalize #805 closure documentation and exact-head CI, then merge P20-B.
2. Start P20-C from the merged P20-B baseline.
3. Reuse existing weight/measurement analytics and P20-A private-photo authority; do not create a second calculation/storage system.
4. Keep user-entered body-fat measurements distinct from any photo evidence; do not add image-derived body-fat estimation.
5. Keep P18 closed unless a reproduced defect or newly reviewed requirement appears; do not invent P18-I.
6. Keep P17-E inactive without a richer-goal requirement.
7. Continue Phase 14 provider/native/device evidence independently when prerequisites are available.
8. Keep source/CI, deployment, provider activation, OTA/native publication and physical-device evidence as separate claims.

## Authorization / release boundary

Source/CI progress does not relax provider, native/device, production, editorial-publication or medical-safety controls. P20-A/P20-B source/CI completion does not imply native/OTA publication or physical-device validation.
